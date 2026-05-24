import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { getReviewFollowupCandidates } from "@/lib/review-followups";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanParam(searchParams.get("client"));
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 300)));
  const dueAfterDays = Math.min(14, Math.max(1, Number(searchParams.get("dueAfterDays") ?? 3)));
  const result = await getReviewFollowupCandidates({ clientSlug, limit, dueAfterDays });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.storageConfigured, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: result.clientSlug,
    dueAfterDays: result.dueAfterDays,
    count: result.candidates.length,
    due: result.candidates,
  });
}

function cleanParam(value: string | null) {
  return (value ?? "").trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}
