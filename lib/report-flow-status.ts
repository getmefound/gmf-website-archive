import type { ReportFlowStatusPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords, saveReviewAutomationEvent } from "@/lib/review-automation-store";

export type ReportFlowCounts = {
  planned: number;
  submitted: number;
  reportReady: number;
  heatmapReady: number;
  blocked: number;
  deliverable: number;
};

export async function getReportFlowStatus(input?: {
  clientSlug?: string;
  limit?: number;
}) {
  const clientSlug = input?.clientSlug || "getmefound";
  const limit = Math.min(500, Math.max(1, Math.floor(input?.limit ?? 100)));
  const result = await listReviewAutomationRecords({ clientSlug, limit });
  if (!result.ok) {
    return {
      ok: false as const,
      storageConfigured: result.configured,
      error: result.error,
      clientSlug,
      reports: [],
      latest: null,
      counts: emptyCounts(),
    };
  }

  const reports = result.records
    .filter((record) => record.eventType === "report_flow_status")
    .map((record) => record.payload as ReportFlowStatusPacket);

  return {
    ok: true as const,
    storageConfigured: true,
    clientSlug,
    reports,
    latest: reports[0] ?? null,
    counts: summarizeReportFlow(reports),
  };
}

export function summarizeReportFlow(reports: ReportFlowStatusPacket[]) {
  return {
    planned: reports.filter((report) => report.status === "planned").length,
    submitted: reports.filter((report) => report.status === "submitted").length,
    reportReady: reports.filter((report) => report.status === "report_ready").length,
    heatmapReady: reports.filter((report) => report.status === "heatmap_ready").length,
    blocked: reports.filter((report) => report.status === "blocked").length,
    deliverable: reports.filter((report) => Boolean(report.auditUrl || report.heatmapUrl)).length,
  } satisfies ReportFlowCounts;
}

export function reportFlowOwnerSummary(counts: ReportFlowCounts) {
  const notes = [];
  notes.push(`${counts.submitted} report${counts.submitted === 1 ? "" : "s"} submitted.`);
  notes.push(`${counts.reportReady + counts.heatmapReady} report asset${counts.reportReady + counts.heatmapReady === 1 ? "" : "s"} ready.`);
  if (counts.deliverable) notes.push(`${counts.deliverable} deliverable link${counts.deliverable === 1 ? "" : "s"} recorded.`);
  if (counts.blocked) notes.push(`${counts.blocked} report${counts.blocked === 1 ? "" : "s"} blocked.`);
  return notes;
}

export async function saveReportFlowStatus(packet: ReportFlowStatusPacket) {
  return saveReviewAutomationEvent("report_flow_status", packet);
}

function emptyCounts() {
  return {
    planned: 0,
    submitted: 0,
    reportReady: 0,
    heatmapReady: 0,
    blocked: 0,
    deliverable: 0,
  } satisfies ReportFlowCounts;
}
