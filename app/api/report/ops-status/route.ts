import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import type { ReportFlowStatusPacket } from "@/lib/review-automation";
import { getReportFlowStatus, reportFlowOwnerSummary } from "@/lib/report-flow-status";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const status = await getReportFlowStatus({ clientSlug: "getmefound", limit: 100 });
  if (!status.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: status.storageConfigured, error: status.error },
      { status: status.storageConfigured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    count: status.reports.length,
    latest: status.latest,
    counts: status.counts,
    ownerSummary: reportFlowOwnerSummary(status.counts),
    replacementNote: "This endpoint tracks report flow outside GHL. It does not trigger GHL workflows.",
  });
}

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });

  const packet = {
    clientSlug: "getmefound",
    clientName: "GetMeFound",
    reportLane: enumFrom(body.reportLane, ["website_free_report", "campaign_report", "client_report"], "website_free_report"),
    reportType: enumFrom(body.reportType, ["marketing", "ai_visibility"], "marketing"),
    source: stringFrom(body.source).slice(0, 120) || "manual_ops_status",
    status: enumFrom(body.status, ["planned", "submitted", "report_ready", "heatmap_ready", "blocked"], "planned"),
    runId: stringFrom(body.runId).slice(0, 160),
    auditUrl: stringFrom(body.auditUrl).slice(0, 500),
    heatmapUrl: stringFrom(body.heatmapUrl).slice(0, 500),
    blocker: stringFrom(body.blocker).slice(0, 500),
    timestamp: new Date().toISOString(),
  } satisfies ReportFlowStatusPacket;

  if (body.dryRun !== false) {
    return NextResponse.json({ ok: true, dryRun: true, packet });
  }

  const save = await saveReviewAutomationEvent("report_flow_status", packet);
  if (!save.ok) {
    return NextResponse.json({ ok: false, storageConfigured: save.configured, error: save.error }, { status: save.configured ? 502 : 503 });
  }

  return NextResponse.json({ ok: true, dryRun: false, id: save.id, packet });
}

function stringFrom(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function enumFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}
