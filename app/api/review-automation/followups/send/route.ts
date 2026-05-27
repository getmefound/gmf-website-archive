import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { buildSendLogPacket, postReviewAutomationSlackSummary } from "@/lib/review-automation";
import { getReviewFollowupCandidates } from "@/lib/review-followups";
import { buildReviewFollowupEmail, getReviewEmailReadiness, sendReviewRequestEmail } from "@/lib/review-request-email";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";

type SendFollowupsBody = {
  clientSlug?: unknown;
  dueAfterDays?: unknown;
  limit?: unknown;
  commit?: unknown;
  confirm?: unknown;
};

const MAX_BATCH_SIZE = 25;
const DEFAULT_BATCH_SIZE = 5;
const CONFIRM_TEXT = "SEND_REVIEW_FOLLOWUPS";

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendFollowupsBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const clientSlug = cleanClientSlug(body.clientSlug);
  const dueAfterDays = Math.min(14, Math.max(0, Number(body.dueAfterDays ?? 3)));
  const limit = clampBatchLimit(body.limit);
  const result = await getReviewFollowupCandidates({ clientSlug, dueAfterDays, limit: 500 });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.storageConfigured, error: result.error },
      { status: result.status },
    );
  }

  const batch = result.candidates.slice(0, limit);
  const emails = batch.map((candidate) =>
    buildReviewFollowupEmail({
      clientSlug: candidate.clientSlug,
      clientName: candidate.clientName,
      customerEmail: candidate.customerEmail,
    }),
  );

  const commit = body.commit === true;
  if (!commit) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      clientSlug: result.clientSlug,
      dueAfterDays: result.dueAfterDays,
      totalCandidates: result.candidates.length,
      batchSize: emails.length,
      previews: emails.map((email) => ({
        to: email.to,
        subject: email.subject,
        feedbackUrl: email.feedbackUrl,
        unsubscribeUrl: email.unsubscribeUrl,
      })),
      nextStep: `POST again with commit=true and confirm=${CONFIRM_TEXT} after proof check approval.`,
    });
  }

  if (body.confirm !== CONFIRM_TEXT) {
    return NextResponse.json(
      { ok: false, error: `Live follow-up sends require confirm=${CONFIRM_TEXT}.` },
      { status: 409 },
    );
  }

  const readiness = getReviewEmailReadiness();
  if (!readiness.ok) {
    return NextResponse.json(
      {
        ok: false,
        dryRun: false,
        requested: emails.length,
        sent: 0,
        failed: 0,
        blocked: true,
        blocker: "review_email_sender_not_ready",
        emailProvider: readiness.provider,
        checks: readiness.checks,
        error: readiness.error,
      },
      { status: 409 },
    );
  }

  const sent = [];
  const failed = [];
  for (let index = 0; index < emails.length; index++) {
    const email = emails[index];
    const candidate = batch[index];
    const sendResult = await sendReviewRequestEmail(email);
    const packet = buildSendLogPacket({
      clientSlug: candidate.clientSlug,
      customerEmail: email.to,
      status: sendResult.ok ? "followup_sent" : "failed",
      provider: sendResult.provider,
      messageId: sendResult.ok ? sendResult.messageId : "",
      detail: sendResult.ok ? `Follow-up review request sent to ${email.feedbackUrl}` : sendResult.error,
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

  return NextResponse.json({
    ok: failed.length === 0,
    dryRun: false,
    clientSlug: result.clientSlug,
    dueAfterDays: result.dueAfterDays,
    requested: emails.length,
    sent: sent.length,
    failed: failed.length,
    sentProof: sent,
    failures: failed,
  });
}

function clampBatchLimit(value: unknown) {
  const parsed = Number(value ?? DEFAULT_BATCH_SIZE);
  if (!Number.isFinite(parsed)) return DEFAULT_BATCH_SIZE;
  return Math.min(MAX_BATCH_SIZE, Math.max(1, Math.floor(parsed)));
}
