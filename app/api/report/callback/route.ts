import { NextRequest, NextResponse } from "next/server";
import { upsertReportRunFromCallback } from "@/lib/report-runs";

type CallbackPayload = {
  runId?: string;
  auditUrl?: string;
  heatmapUrl?: string;
  event?: "report_ready" | "heatmap_ready";
};

function extractRunIdFromUrl(urlValue?: string): string | null {
  if (!urlValue) return null;
  try {
    const u = new URL(urlValue);
    const runId = u.searchParams.get("runId");
    return runId?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.REPORT_CALLBACK_TOKEN;
  const provided = req.headers.get("x-report-callback-token");
  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as CallbackPayload | null;
  const resolvedRunId =
    body?.runId?.trim() ||
    extractRunIdFromUrl(body?.auditUrl) ||
    extractRunIdFromUrl(body?.heatmapUrl);

  if (!body || !resolvedRunId) {
    return NextResponse.json({ ok: false, error: "Missing runId" }, { status: 400 });
  }

  const now = Date.now();
  const patch: {
    reportReadyAt?: number;
    heatmapReadyAt?: number;
    auditUrl?: string;
    heatmapUrl?: string;
  } = {};

  if (body.auditUrl) patch.auditUrl = body.auditUrl;
  if (body.heatmapUrl) patch.heatmapUrl = body.heatmapUrl;

  if (body.event === "report_ready") patch.reportReadyAt = now;
  if (body.event === "heatmap_ready") patch.heatmapReadyAt = now;

  // If event omitted but auditUrl is present, treat as report-ready.
  if (!body.event && body.auditUrl) patch.reportReadyAt = now;

  const run = upsertReportRunFromCallback({
    runId: resolvedRunId,
    patch,
  });

  return NextResponse.json({ ok: true, runId: run.runId });
}
