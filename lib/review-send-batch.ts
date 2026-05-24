import { buildSendLogPacket, postReviewAutomationSlackSummary } from "@/lib/review-automation";
import { buildReviewRequestEmail, getReviewEmailReadiness, sendReviewRequestEmail } from "@/lib/review-request-email";
import { getReviewSendCandidates } from "@/lib/review-send-candidates";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";

export const REVIEW_SEND_CONFIRM_TEXT = "SEND_REVIEW_REQUESTS";
export const REVIEW_SEND_MAX_BATCH_SIZE = 25;
export const REVIEW_SEND_DEFAULT_BATCH_SIZE = 5;

export async function buildReviewSendProof(input: {
  clientSlug: string;
  limit?: number;
}) {
  const limit = clampBatchLimit(input.limit);
  const result = await getReviewSendCandidates({ clientSlug: input.clientSlug, limit: 500 });

  if (!result.ok) return result;

  const batch = result.candidates.slice(0, limit);
  const emails = batch.map((candidate) =>
    buildReviewRequestEmail({
      clientSlug: result.clientSlug,
      clientName: result.clientName,
      candidate,
    }),
  );

  return {
    ok: true as const,
    dryRun: true,
    clientSlug: result.clientSlug,
    clientName: result.clientName,
    sourceUploadAt: result.sourceUploadAt,
    totalCandidates: result.totalCandidates,
    batchSize: emails.length,
    candidates: batch,
    previews: emails.map((email, index) => ({
      name: batch[index]?.name ?? "",
      to: email.to,
      subject: email.subject,
      text: email.text,
      feedbackUrl: email.feedbackUrl,
      unsubscribeUrl: email.unsubscribeUrl,
    })),
    nextStep: `Approve with ${REVIEW_SEND_CONFIRM_TEXT} after proof check.`,
  };
}

export async function sendApprovedReviewBatch(input: {
  clientSlug: string;
  limit?: number;
  confirm: string;
}) {
  const proof = await buildReviewSendProof(input);
  if (!proof.ok) return proof;

  if (input.confirm !== REVIEW_SEND_CONFIRM_TEXT) {
    return {
      ok: false as const,
      status: 409,
      error: `Live sends require confirm=${REVIEW_SEND_CONFIRM_TEXT}.`,
    };
  }

  const readiness = getReviewEmailReadiness();
  if (!readiness.ok) {
    return {
      ok: false as const,
      status: 409,
      dryRun: false,
      clientSlug: proof.clientSlug,
      clientName: proof.clientName,
      requested: proof.previews.length,
      sent: 0,
      failed: 0,
      blocked: true,
      blocker: "review_email_sender_not_ready",
      emailProvider: readiness.provider,
      checks: readiness.checks,
      error: readiness.error ?? "Review email sender is not ready.",
    };
  }

  const sent: Array<{ to: string; provider: string; messageId: string }> = [];
  const failed: Array<{ to: string; provider: string; error: string }> = [];

  for (const preview of proof.previews) {
    const email = buildReviewRequestEmail({
      clientSlug: proof.clientSlug,
      clientName: proof.clientName,
      candidate: {
        name: preview.name,
        email: preview.to,
        phone: "",
        jobDate: "",
        notes: "",
      },
    });
    const sendResult = await sendReviewRequestEmail(email);
    const packet = buildSendLogPacket({
      clientSlug: proof.clientSlug,
      customerEmail: email.to,
      status: sendResult.ok ? "sent" : "failed",
      provider: sendResult.provider,
      messageId: sendResult.ok ? sendResult.messageId : "",
      detail: sendResult.ok ? `Review request sent to ${email.feedbackUrl}` : sendResult.error,
    });
    const storageResult = await saveReviewAutomationEvent("send_log", packet);

    if (sendResult.ok) {
      sent.push({ to: email.to, provider: sendResult.provider, messageId: sendResult.messageId });
    } else {
      failed.push({ to: email.to, provider: sendResult.provider, error: sendResult.error });
      await postReviewAutomationSlackSummary("send_log", packet, {
        ok: storageResult.ok,
        configured: storageResult.configured,
        error: storageResult.ok ? undefined : storageResult.error,
      });
    }
  }

  return {
    ok: failed.length === 0,
    status: 200,
    dryRun: false,
    clientSlug: proof.clientSlug,
    clientName: proof.clientName,
    sourceUploadAt: proof.sourceUploadAt,
    requested: proof.previews.length,
    sent: sent.length,
    failed: failed.length,
    sentProof: sent,
    failures: failed,
  };
}

export function clampBatchLimit(value: unknown) {
  const parsed = Number(value ?? REVIEW_SEND_DEFAULT_BATCH_SIZE);
  if (!Number.isFinite(parsed)) return REVIEW_SEND_DEFAULT_BATCH_SIZE;
  return Math.min(REVIEW_SEND_MAX_BATCH_SIZE, Math.max(1, Math.floor(parsed)));
}
