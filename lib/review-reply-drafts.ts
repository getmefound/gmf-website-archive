import { envValue } from "@/lib/getmefound-env";
import { getClientHubProfile } from "@/lib/client-profile-store";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";
import type { ReviewReplyDraftPacket, ReviewReplySafety } from "@/lib/review-automation";

export type ReviewReplyDraftInput = {
  clientSlug: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  dryRun?: boolean;
};

export async function draftReviewReply(input: ReviewReplyDraftInput) {
  const client = await getClientHubProfile(input.clientSlug);
  if (!client) return { ok: false as const, status: 404, error: "Unknown client." };

  const rating = clampRating(input.rating);
  const reviewText = cleanLong(input.reviewText, 3000);
  if (!reviewText) return { ok: false as const, status: 400, error: "Review text is required." };

  const model = envValue("GMF_REVIEW_REPLY_MODEL") || envValue("AOH_REVIEW_REPLY_MODEL") || envValue("OPENAI_MODEL") || "gpt-4o-mini";
  const mode = client.voiceProfile?.mode ?? "Draft only";
  const safety = assessReviewReplySafety({
    rating,
    reviewText,
    mode,
  });
  const prompt = buildReplyPrompt({
    clientName: client.businessName,
    reviewerName: cleanText(input.reviewerName, 100) || "the reviewer",
    rating,
    reviewText,
    tone: client.voiceProfile?.tone ?? "Friendly, concise, appreciative, and professional.",
    favoritePhrases: client.voiceProfile?.favoritePhrases ?? "",
    avoidPhrases: client.voiceProfile?.avoidPhrases ?? "",
    escalationNotes:
      client.voiceProfile?.escalationNotes ??
      "Hold any review mentioning refunds, safety, legal issues, staff accusations, or medical/regulated topics for human review.",
  });

  if (input.dryRun) {
    return {
      ok: true as const,
      dryRun: true,
      clientSlug: client.slug,
      clientName: client.businessName,
      model,
      prompt,
      draftText: "",
      mode,
      safety,
    };
  }

  const apiKey = envValue("OPENAI_API_KEY");
  if (!apiKey) return { ok: false as const, status: 503, error: "OPENAI_API_KEY is missing." };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You draft Google review replies for a local business. Return only the reply text. Never claim the issue is resolved. Never offer compensation. Keep replies under 90 words.",
      input: prompt,
      max_output_tokens: 220,
    }),
    cache: "no-store",
  }).catch((error) => (error instanceof Error ? error : new Error("Unknown OpenAI error.")));

  if (response instanceof Error) {
    return { ok: false as const, status: 502, error: response.message };
  }

  const data = (await response.json().catch(() => null)) as {
    output_text?: string;
    error?: { message?: string };
    output?: Array<{ content?: Array<{ text?: string }> }>;
  } | null;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: data?.error?.message ?? "OpenAI rejected the draft request.",
    };
  }

  const draftText = cleanLong(extractOutputText(data), 2000);
  if (!draftText) return { ok: false as const, status: 502, error: "OpenAI returned an empty draft." };

  const packet = {
    clientSlug: client.slug,
    clientName: client.businessName,
    reviewerName: cleanText(input.reviewerName, 100),
    rating,
    reviewText,
    draftText,
    mode,
    model,
    status: "drafted",
    safety,
    timestamp: new Date().toISOString(),
  } satisfies ReviewReplyDraftPacket;
  await saveReviewAutomationEvent("review_reply_draft", packet);

  return {
    ok: true as const,
    dryRun: false,
    clientSlug: client.slug,
    clientName: client.businessName,
    model,
    draftText,
    mode,
    safety,
  };
}

export async function saveReviewReplyDecision(input: {
  clientSlug: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  draftText: string;
  status: ReviewReplyDraftPacket["status"];
  decisionNote?: string;
}) {
  const client = await getClientHubProfile(input.clientSlug);
  if (!client) return { ok: false as const, status: 404, error: "Unknown client." };

  const draftText = cleanLong(input.draftText, 2000);
  const reviewText = cleanLong(input.reviewText, 3000);
  if (!draftText) return { ok: false as const, status: 400, error: "Draft text is required." };
  if (!reviewText) return { ok: false as const, status: 400, error: "Review text is required." };

  const packet = {
    clientSlug: client.slug,
    clientName: client.businessName,
    reviewerName: cleanText(input.reviewerName, 100),
    rating: clampRating(input.rating),
    reviewText,
    draftText,
    mode: client.voiceProfile?.mode ?? "Draft only",
    model: "manual-decision",
    status: input.status,
    safety: assessReviewReplySafety({
      rating: clampRating(input.rating),
      reviewText,
      mode: client.voiceProfile?.mode ?? "Draft only",
    }),
    decisionNote: cleanLong(input.decisionNote ?? "", 500),
    timestamp: new Date().toISOString(),
  } satisfies ReviewReplyDraftPacket;

  const result = await saveReviewAutomationEvent("review_reply_draft", packet);
  if (!result.ok) return { ok: false as const, status: "status" in result ? result.status : 500, error: result.error };
  return { ok: true as const, clientSlug: client.slug, status: input.status };
}

export function assessReviewReplySafety(input: {
  rating: number;
  reviewText: string;
  mode: string;
}): ReviewReplySafety {
  const flags: string[] = [];
  const text = input.reviewText.toLowerCase();
  const riskyPatterns = [
    ["refund", /refund|chargeback|money back|overcharg/],
    ["legal", /lawsuit|legal|attorney|lawyer|sue\b|court/],
    ["safety", /unsafe|injur|hurt|accident|danger|threat/],
    ["staff accusation", /rude|scam|fraud|stole|harass|discriminat|racis|sexist/],
    ["medical or regulated", /medical|doctor|patient|hipaa|diagnos|prescription/],
    ["pricing dispute", /price|pricing|expensive|bait|hidden fee|charged/],
    ["sarcasm risk", /yeah right|sure\.|great job ruining|thanks for nothing/],
  ] as const;

  for (const [label, pattern] of riskyPatterns) {
    if (pattern.test(text)) flags.push(label);
  }
  if (input.rating <= 4) flags.push("rating below safe auto-reply threshold");
  if (input.mode !== "Safe auto-reply eligible") flags.push("client is not in safe auto-reply mode");

  const riskLevel = flags.some((flag) => flag !== "client is not in safe auto-reply mode")
    ? "high"
    : input.rating === 5
      ? "low"
      : "medium";
  const autoPostEligible = input.rating === 5 && input.mode === "Safe auto-reply eligible" && flags.length === 0;

  return {
    autoPostEligible,
    riskLevel,
    flags,
    reason: autoPostEligible
      ? "Low-risk 5-star review and client mode allows safe auto-reply."
      : flags.length
        ? flags.join("; ")
        : "Manual approval required.",
  };
}

function buildReplyPrompt(input: {
  clientName: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  tone: string;
  favoritePhrases: string;
  avoidPhrases: string;
  escalationNotes: string;
}) {
  return `Business: ${input.clientName}
Reviewer: ${input.reviewerName}
Rating: ${input.rating}/5

Client voice:
- Tone: ${input.tone}
- Favorite phrases: ${input.favoritePhrases || "none provided"}
- Avoid phrases: ${input.avoidPhrases || "none provided"}
- Escalation notes: ${input.escalationNotes}

Rules:
- Draft only. Do not imply this was posted.
- For 1-3 star reviews, be empathetic and invite private follow-up.
- For 4-5 star reviews, thank them naturally and mention one specific detail if present.
- Do not mention AI, automation, or internal tools.
- Do not include placeholders.

Review:
${input.reviewText}`;
}

function extractOutputText(data: { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> } | null) {
  if (data?.output_text) return data.output_text;
  return data?.output?.flatMap((item) => item.content ?? []).map((content) => content.text ?? "").join("\n").trim() ?? "";
}

function clampRating(value: number) {
  if (!Number.isFinite(value)) return 5;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function cleanText(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanLong(value: string, max: number) {
  return value.trim().slice(0, max);
}
