import type { ReviewSendLogPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type ReviewFollowupCandidate = {
  clientSlug: string;
  clientName: string;
  customerEmail: string;
  sentAt: string;
  provider: string;
  messageId: string;
};

export async function getReviewFollowupCandidates(input: {
  clientSlug?: string;
  limit?: number;
  dueAfterDays?: number;
}) {
  const clientSlug = cleanClientSlug(input.clientSlug ?? "");
  const limit = Math.min(500, Math.max(1, Number(input.limit ?? 300)));
  const dueAfterDays = Math.min(14, Math.max(0, Number(input.dueAfterDays ?? 3)));
  const result = await listReviewAutomationRecords({ clientSlug, limit });

  if (!result.ok) {
    return {
      ok: false as const,
      storageConfigured: result.configured,
      status: result.configured ? 502 : 503,
      error: result.error,
    };
  }

  return {
    ok: true as const,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    dueAfterDays,
    candidates: findDueFollowups(
      result.records
        .filter((record) => record.eventType === "send_log")
        .map((record) => record.payload as ReviewSendLogPacket),
      dueAfterDays,
    ),
  };
}

function findDueFollowups(logs: ReviewSendLogPacket[], dueAfterDays: number): ReviewFollowupCandidate[] {
  const cutoff = Date.now() - dueAfterDays * 24 * 60 * 60 * 1000;
  const byKey = new Map<string, ReviewSendLogPacket[]>();

  for (const log of logs) {
    const key = `${log.clientSlug}:${log.customerEmail}`;
    byKey.set(key, [...(byKey.get(key) ?? []), log]);
  }

  const due = [];
  for (const events of byKey.values()) {
    const sorted = events.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    const latestTerminal = sorted.findLast((event) =>
      ["bounced", "clicked", "followup_sent"].includes(event.status),
    );
    if (latestTerminal) continue;

    const latestSent = sorted.findLast((event) => event.status === "sent");
    if (!latestSent || Date.parse(latestSent.timestamp) > cutoff) continue;

    due.push({
      clientSlug: latestSent.clientSlug,
      clientName: latestSent.clientName,
      customerEmail: latestSent.customerEmail,
      sentAt: latestSent.timestamp,
      provider: latestSent.provider,
      messageId: latestSent.messageId,
    });
  }

  return due.sort((a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt));
}

function cleanClientSlug(value: string) {
  return value.trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}
