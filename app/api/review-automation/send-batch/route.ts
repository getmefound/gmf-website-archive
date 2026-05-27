import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import {
  buildReviewSendProof,
  clampBatchLimit,
  REVIEW_SEND_CONFIRM_TEXT,
  sendApprovedReviewBatch,
} from "@/lib/review-send-batch";

type SendBatchBody = {
  clientSlug?: unknown;
  limit?: unknown;
  commit?: unknown;
  confirm?: unknown;
};

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendBatchBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const clientSlug = cleanClientSlug(body.clientSlug);
  const limit = clampBatchLimit(body.limit);
  const commit = body.commit === true;

  if (!commit) {
    const proof = await buildReviewSendProof({ clientSlug, limit });
    if (!proof.ok) {
      const { status, ...payload } = proof;
      return NextResponse.json(payload, { status });
    }
    return NextResponse.json({
      ...proof,
      nextStep: `POST again with commit=true and confirm=${REVIEW_SEND_CONFIRM_TEXT} after proof check approval.`,
    });
  }

  const sendResult = await sendApprovedReviewBatch({
    clientSlug,
    limit,
    confirm: typeof body.confirm === "string" ? body.confirm : "",
  });
  const { status, ...payload } = sendResult;
  return NextResponse.json(payload, { status: status ?? (sendResult.ok ? 200 : 500) });
}
