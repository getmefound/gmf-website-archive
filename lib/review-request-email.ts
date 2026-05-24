import { SITE_URL } from "@/lib/seo";
import { envValueAny } from "@/lib/getmefound-env";
import type { ReviewSendCandidate } from "@/lib/review-send-candidates";

export type ReviewRequestEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  feedbackUrl: string;
  unsubscribeUrl: string;
};

export type ReviewEmailSendResult =
  | { ok: true; provider: string; messageId: string; status?: number }
  | { ok: false; provider: string; error: string; status?: number };

export type ReviewEmailReadiness = {
  ok: boolean;
  provider: string;
  checks: {
    resendApiKey: "present" | "missing" | "not-used";
    fromEmail: "present" | "missing";
    replyTo: "present" | "optional-missing";
  };
  error?: string;
};

type BuildReviewRequestInput = {
  clientSlug: string;
  clientName: string;
  candidate: ReviewSendCandidate;
};

type BuildReviewFollowupInput = {
  clientSlug: string;
  clientName: string;
  customerEmail: string;
};

export function buildReviewRequestEmail(input: BuildReviewRequestInput): ReviewRequestEmail {
  const name = firstName(input.candidate.name);
  const feedbackUrl = `${SITE_URL}/review/${input.clientSlug}`;
  const unsubscribeUrl = `${SITE_URL}/review/${input.clientSlug}/unsubscribe?email=${encodeURIComponent(input.candidate.email)}`;
  const greeting = name ? `Hi ${name},` : "Hi,";
  const subject = `Quick favor for ${input.clientName}`;

  const text = `${greeting}

Thanks again for working with ${input.clientName}. If everything went well, would you take a minute to leave quick feedback?

${feedbackUrl}

If there was a problem, the same page lets you send a private note first so the owner can make it right.

Stop review request emails:
${unsubscribeUrl}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f4;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
          Thanks again for working with ${escapeHtml(input.clientName)}. If everything went well,
          would you take a minute to leave quick feedback?
        </p>
        <p style="margin:24px 0;">
          <a href="${feedbackUrl}" style="display:inline-block;border-radius:8px;background:#065f46;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">
            Leave feedback
          </a>
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
          If there was a problem, the same page lets you send a private note first so the owner can make it right.
        </p>
      </div>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;line-height:1.5;color:#64748b;">
        <a href="${unsubscribeUrl}" style="color:#475569;">Stop review request emails</a>
      </p>
    </div>
  </body>
</html>`;

  return {
    to: input.candidate.email,
    subject,
    text,
    html,
    feedbackUrl,
    unsubscribeUrl,
  };
}

export function buildReviewFollowupEmail(input: BuildReviewFollowupInput): ReviewRequestEmail {
  const feedbackUrl = `${SITE_URL}/review/${input.clientSlug}`;
  const unsubscribeUrl = `${SITE_URL}/review/${input.clientSlug}/unsubscribe?email=${encodeURIComponent(input.customerEmail)}`;
  const subject = `Quick reminder from ${input.clientName}`;

  const text = `Hi,

Just a quick reminder from ${input.clientName}. If you have a minute, would you leave quick feedback about your experience?

${feedbackUrl}

If there was a problem, the same page lets you send a private note first so the owner can make it right.

Stop review request emails:
${unsubscribeUrl}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f4;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Hi,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
          Just a quick reminder from ${escapeHtml(input.clientName)}. If you have a minute,
          would you leave quick feedback about your experience?
        </p>
        <p style="margin:24px 0;">
          <a href="${feedbackUrl}" style="display:inline-block;border-radius:8px;background:#065f46;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">
            Leave feedback
          </a>
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
          If there was a problem, the same page lets you send a private note first so the owner can make it right.
        </p>
      </div>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;line-height:1.5;color:#64748b;">
        <a href="${unsubscribeUrl}" style="color:#475569;">Stop review request emails</a>
      </p>
    </div>
  </body>
</html>`;

  return {
    to: input.customerEmail,
    subject,
    text,
    html,
    feedbackUrl,
    unsubscribeUrl,
  };
}

export async function sendReviewRequestEmail(email: ReviewRequestEmail): Promise<ReviewEmailSendResult> {
  const readiness = getReviewEmailReadiness();
  if (!readiness.ok) {
    return {
      ok: false,
      provider: readiness.provider,
      error: readiness.error ?? "Review request email sender is not ready.",
    };
  }

  const apiKey = envValueAny("RESEND_API_KEY");
  const from = envValueAny("GMF_REVIEW_REQUEST_FROM_EMAIL", "AOH_REVIEW_REQUEST_FROM_EMAIL", "REVIEW_REQUEST_FROM_EMAIL");
  const replyTo = envValueAny("GMF_REVIEW_REQUEST_REPLY_TO", "AOH_REVIEW_REQUEST_REPLY_TO", "REVIEW_REQUEST_REPLY_TO");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown email provider error.");
  });

  if (response instanceof Error) {
    return { ok: false, provider: readiness.provider, error: response.message };
  }

  const data = (await response.json().catch(() => null)) as { id?: string; message?: string; error?: string } | null;
  if (!response.ok) {
    return {
      ok: false,
      provider: readiness.provider,
      status: response.status,
      error: data?.message || data?.error || "Email provider rejected the send.",
    };
  }

  return {
    ok: true,
    provider: readiness.provider,
    status: response.status,
    messageId: data?.id ?? "",
  };
}

export function getReviewEmailReadiness(): ReviewEmailReadiness {
  const provider = envValueAny("GMF_REVIEW_EMAIL_PROVIDER", "AOH_REVIEW_EMAIL_PROVIDER").toLowerCase() || "resend";
  const hasResendKey = Boolean(envValueAny("RESEND_API_KEY"));
  const hasFromEmail = Boolean(envValueAny("GMF_REVIEW_REQUEST_FROM_EMAIL", "AOH_REVIEW_REQUEST_FROM_EMAIL", "REVIEW_REQUEST_FROM_EMAIL"));
  const hasReplyTo = Boolean(envValueAny("GMF_REVIEW_REQUEST_REPLY_TO", "AOH_REVIEW_REQUEST_REPLY_TO", "REVIEW_REQUEST_REPLY_TO"));

  if (provider !== "resend") {
    return {
      ok: false,
      provider,
      checks: {
        resendApiKey: "not-used",
        fromEmail: hasFromEmail ? "present" : "missing",
        replyTo: hasReplyTo ? "present" : "optional-missing",
      },
      error: `Unsupported review email provider: ${provider}`,
    };
  }

  return {
    ok: hasResendKey && hasFromEmail,
    provider,
    checks: {
      resendApiKey: hasResendKey ? "present" : "missing",
      fromEmail: hasFromEmail ? "present" : "missing",
      replyTo: hasReplyTo ? "present" : "optional-missing",
    },
    error:
      hasResendKey && hasFromEmail
        ? undefined
        : "RESEND_API_KEY and GMF_REVIEW_REQUEST_FROM_EMAIL are required before live review sends.",
  };
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
