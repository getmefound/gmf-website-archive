import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { getReviewReplyDigest } from "@/lib/review-reply-digest";
import { cleanClientSlug } from "@/lib/review-send-candidates";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanClientSlug(searchParams.get("client"));
  const days = Math.min(30, Math.max(1, Number(searchParams.get("days") ?? 7)));
  const limit = Math.min(200, Math.max(20, Number(searchParams.get("limit") ?? 100)));

  const result = await getReviewReplyDigest({ clientSlug, days, limit });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.storageConfigured, error: result.error },
      { status: result.storageConfigured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    days: result.days,
    counts: result.counts,
    ownerSummary: result.ownerSummary,
    latest: result.latest,
  });
}
