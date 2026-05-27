import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import {
  createVisibilityReportRequest,
  listVisibilityReports,
  type VisibilityReportAudience,
  type VisibilityReportContext,
} from "@/lib/visibility-reports";

const CONTEXTS = [
  "prospect_free_check",
  "prospect_campaign_reply",
  "client_onboarding_baseline",
  "client_recurring_check",
] as const;

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const context = enumFrom(req.nextUrl.searchParams.get("context"), CONTEXTS, undefined);
  const audience = enumFrom(req.nextUrl.searchParams.get("audience"), ["prospect", "client"] as const, undefined);
  const limit = Math.min(500, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 100)));
  const result = await listVisibilityReports({ context, audience, limit });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.configured, error: result.error },
      { status: result.configured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    count: result.reports.length,
    reports: result.reports,
    counts: summarize(result.reports),
  });
}

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });

  const context = enumFrom(body.context, CONTEXTS, "client_onboarding_baseline");
  const reportType = enumFrom(body.reportType, ["marketing", "ai_visibility"] as const, "ai_visibility");
  const campaign = enumFrom(body.campaign, ["reviews", "ai", "organic"] as const, "organic");
  const runId = stringFrom(body.runId) || crypto.randomUUID();
  const businessName = stringFrom(body.businessName);
  const contactEmail = stringFrom(body.contactEmail).toLowerCase();

  if (!businessName) {
    return NextResponse.json({ ok: false, error: "businessName is required." }, { status: 400 });
  }
  if (!contactEmail) {
    return NextResponse.json({ ok: false, error: "contactEmail is required." }, { status: 400 });
  }

  const packet = {
    runId,
    context,
    businessName,
    contactEmail,
    contactName: stringFrom(body.contactName),
    businessWebsite: stringFrom(body.businessWebsite),
    businessLocation: stringFrom(body.businessLocation),
    clientSlug: cleanClientSlug(body.clientSlug),
    clientId: stringFrom(body.clientId),
    reportType,
    source: stringFrom(body.source) || "api/visibility-reports",
    campaign,
    auditUrl: stringFrom(body.auditUrl),
    heatmapUrl: stringFrom(body.heatmapUrl),
    metadata: objectFrom(body.metadata),
  };

  if (body.dryRun !== false) {
    return NextResponse.json({ ok: true, dryRun: true, packet });
  }

  const save = await createVisibilityReportRequest(packet);
  if (!save.ok) {
    return NextResponse.json({ ok: false, storageConfigured: true, error: save.error }, { status: save.status || 502 });
  }

  return NextResponse.json({ ok: true, dryRun: false, report: save.data[0] ?? null });
}

function summarize(reports: Array<{ audience: VisibilityReportAudience; report_context: VisibilityReportContext; report_status: string }>) {
  const counts: Record<string, number> = {};
  for (const report of reports) {
    counts[`audience:${report.audience}`] = (counts[`audience:${report.audience}`] ?? 0) + 1;
    counts[`context:${report.report_context}`] = (counts[`context:${report.report_context}`] ?? 0) + 1;
    counts[`status:${report.report_status}`] = (counts[`status:${report.report_status}`] ?? 0) + 1;
  }
  return counts;
}

function stringFrom(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function objectFrom(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function enumFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T;
function enumFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: undefined): T | undefined;
function enumFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: T | undefined): T | undefined {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}
