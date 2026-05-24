import type { ReviewReplyDraftPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type ReviewReplyDigestCounts = {
  drafted: number;
  approved: number;
  rejected: number;
  posted: number;
  highRisk: number;
  autoPostEligible: number;
};

export async function getReviewReplyDigest(input: {
  clientSlug: string;
  days?: number;
  limit?: number;
}) {
  const days = Math.min(30, Math.max(1, Number(input.days ?? 7)));
  const limit = Math.min(200, Math.max(20, Number(input.limit ?? 100)));
  const result = await listReviewAutomationRecords({ clientSlug: input.clientSlug, limit });
  if (!result.ok) {
    return {
      ok: false as const,
      storageConfigured: result.configured,
      error: result.error,
      days,
      counts: emptyCounts(),
      ownerSummary: ["Review reply activity is temporarily unavailable."],
      latest: [],
    };
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const drafts = result.records
    .filter((record) => record.eventType === "review_reply_draft")
    .filter((record) => Date.parse(record.createdAt) >= cutoff)
    .map((record) => record.payload as ReviewReplyDraftPacket);
  const counts = summarizeReviewReplies(drafts);

  return {
    ok: true as const,
    storageConfigured: true,
    days,
    counts,
    ownerSummary: buildReplyOwnerSummary(counts),
    latest: drafts.slice(0, 10).map((draft) => ({
      clientName: draft.clientName,
      reviewerName: draft.reviewerName,
      rating: draft.rating,
      status: draft.status,
      riskLevel: draft.safety?.riskLevel ?? "unknown",
      autoPostEligible: Boolean(draft.safety?.autoPostEligible),
      timestamp: draft.timestamp,
    })),
  };
}

export function summarizeReviewReplies(drafts: ReviewReplyDraftPacket[]) {
  return {
    drafted: drafts.filter((draft) => draft.status === "drafted").length,
    approved: drafts.filter((draft) => draft.status === "approved").length,
    rejected: drafts.filter((draft) => draft.status === "rejected").length,
    posted: drafts.filter((draft) => draft.status === "posted").length,
    highRisk: drafts.filter((draft) => draft.safety?.riskLevel === "high").length,
    autoPostEligible: drafts.filter((draft) => draft.safety?.autoPostEligible).length,
  } satisfies ReviewReplyDigestCounts;
}

export function buildReplyOwnerSummary(counts: ReviewReplyDigestCounts) {
  const notes = [];
  notes.push(`${counts.drafted} draft${counts.drafted === 1 ? "" : "s"} waiting for a decision.`);
  if (counts.approved) notes.push(`${counts.approved} approved repl${counts.approved === 1 ? "y" : "ies"} ready to post manually.`);
  if (counts.posted) notes.push(`${counts.posted} repl${counts.posted === 1 ? "y" : "ies"} marked posted.`);
  if (counts.highRisk) notes.push(`${counts.highRisk} high-risk review${counts.highRisk === 1 ? "" : "s"} should stay human-reviewed.`);
  if (counts.autoPostEligible) notes.push(`${counts.autoPostEligible} low-risk 5-star repl${counts.autoPostEligible === 1 ? "y is" : "ies are"} technically eligible after trust rules.`);
  return notes;
}

function emptyCounts() {
  return {
    drafted: 0,
    approved: 0,
    rejected: 0,
    posted: 0,
    highRisk: 0,
    autoPostEligible: 0,
  } satisfies ReviewReplyDigestCounts;
}
