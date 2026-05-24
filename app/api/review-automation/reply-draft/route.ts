import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import { draftReviewReply } from "@/lib/review-reply-drafts";

type Body = {
  clientSlug?: unknown;
  reviewerName?: unknown;
  rating?: unknown;
  reviewText?: unknown;
  dryRun?: unknown;
};

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const result = await draftReviewReply({
    clientSlug: cleanClientSlug(body.clientSlug),
    reviewerName: typeof body.reviewerName === "string" ? body.reviewerName : "",
    rating: Number(body.rating ?? 5),
    reviewText: typeof body.reviewText === "string" ? body.reviewText : "",
    dryRun: body.dryRun === true,
  });

  const { status, ...payload } = result;
  return NextResponse.json(payload, { status: status ?? (result.ok ? 200 : 500) });
}
