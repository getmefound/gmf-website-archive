import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const staleAfterHours = clampNumber(req.nextUrl.searchParams.get("staleAfterHours"), 1, 168, 48);
  const result = await getIntegrationHealthRollup({ staleAfterHours });
  if (!result.ok) return NextResponse.json(result, { status: 502 });
  return NextResponse.json(result);
}

function clampNumber(value: string | null, min: number, max: number, fallback: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
