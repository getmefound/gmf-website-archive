import { NextRequest, NextResponse } from "next/server";
import { processAlwaysReadyNurtureQueue } from "@/lib/always-ready-nurture";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = authorizeCron(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const limit = Math.min(250, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 100)));
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const result = await processAlwaysReadyNurtureQueue({ limit, dryRun });
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

function authorizeCron(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected =
    process.env.CRON_SECRET?.trim() ||
    process.env.GMF_ALWAYS_READY_NURTURE_TOKEN?.trim() ||
    process.env.GMF_INTERNAL_API_TOKEN?.trim();
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    req.headers.get("x-gmf-always-ready-token")?.trim() ||
    req.nextUrl.searchParams.get("token")?.trim() ||
    req.nextUrl.searchParams.get("gmf_token")?.trim();

  if (expected) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Unauthorized" };
  }

  if (process.env.NODE_ENV !== "production") return { ok: true };
  return { ok: false, status: 503, error: "CRON_SECRET, GMF_ALWAYS_READY_NURTURE_TOKEN, or GMF_INTERNAL_API_TOKEN is not configured." };
}
