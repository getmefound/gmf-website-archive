import { createAgentTask } from "@/lib/ops-store";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

export type VisibilityReportContext =
  | "prospect_free_check"
  | "prospect_campaign_reply"
  | "client_onboarding_baseline"
  | "client_recurring_check";

export type VisibilityReportAudience = "prospect" | "client";

export type VisibilityReportStatus =
  | "requested"
  | "building"
  | "ready_for_audit"
  | "approved_to_send"
  | "sent"
  | "blocked"
  | "closed";

export type VisibilityReportRow = {
  id: string;
  created_at: string;
  updated_at: string;
  run_id: string;
  report_context: VisibilityReportContext;
  audience: VisibilityReportAudience;
  report_status: VisibilityReportStatus;
  lead_status: string;
  client_lifecycle: string;
  owner_role: string;
  next_action: string;
  blocker: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  business_website: string;
  business_location: string;
  client_slug: string;
  client_id: string;
  report_type: "marketing" | "ai_visibility";
  source: string;
  campaign: string;
  audit_url: string;
  heatmap_url: string;
  metadata: Record<string, unknown>;
};

export type VisibilityReportEventRow = {
  id: string;
  created_at: string;
  run_id: string;
  event_type: string;
  actor_role: string;
  note: string;
  payload: Record<string, unknown>;
};

type VisibilityReportCreateInput = {
  runId: string;
  context: VisibilityReportContext;
  businessName: string;
  contactEmail: string;
  businessWebsite?: string;
  businessLocation?: string;
  contactName?: string;
  clientSlug?: string;
  clientId?: string;
  reportType: "marketing" | "ai_visibility";
  source: string;
  campaign: "reviews" | "ai" | "organic";
  auditUrl: string;
  heatmapUrl?: string;
  metadata?: Record<string, unknown>;
};

const REPORTS_TABLE = "visibility_reports";
const EVENTS_TABLE = "visibility_report_events";

export async function createVisibilityReportRequest(input: VisibilityReportCreateInput) {
  const audience = input.context.startsWith("client_") ? "client" : "prospect";
  const status = "requested" satisfies VisibilityReportStatus;
  const ownerRole = audience === "client" ? "Account Manager" : "Sales Rep";
  const leadStatus =
    input.context === "prospect_free_check"
      ? "free_check_requested"
      : input.context === "prospect_campaign_reply"
        ? "report_building"
        : "";
  const clientLifecycle =
    input.context === "client_onboarding_baseline"
      ? "paid_needs_onboarding"
      : input.context === "client_recurring_check"
        ? "live_recurring"
        : "";
  const nextAction =
    audience === "client"
      ? "Reporter builds onboarding baseline, Auditor checks it, Account Manager sends client-safe proof."
      : "Scout runs public scan, Reporter builds free visibility report, Auditor checks it, Sales Rep sends it.";

  const row = {
    run_id: input.runId,
    report_context: input.context,
    audience,
    report_status: status,
    lead_status: leadStatus,
    client_lifecycle: clientLifecycle,
    owner_role: ownerRole,
    next_action: nextAction,
    blocker: "",
    business_name: cleanText(input.businessName, 180),
    contact_name: cleanText(input.contactName ?? "", 140),
    contact_email: cleanText(input.contactEmail, 220).toLowerCase(),
    business_website: cleanText(input.businessWebsite ?? "", 500),
    business_location: cleanText(input.businessLocation ?? "", 180),
    client_slug: cleanText(input.clientSlug ?? "", 100),
    client_id: cleanText(input.clientId ?? "", 80),
    report_type: input.reportType,
    source: cleanText(input.source, 180),
    campaign: input.campaign,
    audit_url: cleanText(input.auditUrl, 500),
    heatmap_url: cleanText(input.heatmapUrl ?? "", 500),
    metadata: input.metadata ?? {},
  };

  const save = hasSupabaseConfig()
    ? await supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, {
        method: "POST",
        query: "on_conflict=run_id",
        prefer: "resolution=merge-duplicates,return=representation",
        body: row,
      })
    : { ok: false as const, status: 0, error: "Supabase environment variables are missing." };

  if (!save.ok) {
    console.error("Visibility report save failed", save.status, save.error);
  }

  await Promise.allSettled([
    logVisibilityReportEvent({
      runId: input.runId,
      eventType: "requested",
      actorRole: "System",
      note: nextAction,
      payload: row,
    }),
    createAgentTask({
      title: `${audience === "client" ? "Build onboarding baseline" : "Build free visibility report"} - ${row.business_name}`,
      kind: "visibility_report",
      priority: audience === "client" ? "high" : "normal",
      source: row.source,
      payload: {
        runId: input.runId,
        context: input.context,
        audience,
        ownerRole,
        reportType: input.reportType,
        businessName: row.business_name,
        contactEmail: row.contact_email,
        auditUrl: row.audit_url,
        nextAction,
      },
    }),
  ]);

  return save;
}

export async function logVisibilityReportEvent(input: {
  runId: string;
  eventType: string;
  actorRole: string;
  note: string;
  payload?: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig()) {
    return { ok: false as const, status: 0, error: "Supabase environment variables are missing." };
  }

  return supabaseRest<VisibilityReportEventRow[]>(EVENTS_TABLE, {
    method: "POST",
    prefer: "return=representation",
    body: {
      run_id: cleanText(input.runId, 160),
      event_type: cleanText(input.eventType, 80),
      actor_role: cleanText(input.actorRole, 80),
      note: cleanText(input.note, 800),
      payload: input.payload ?? {},
    },
  });
}

export async function listVisibilityReports(input?: {
  context?: VisibilityReportContext;
  audience?: VisibilityReportAudience;
  limit?: number;
}) {
  if (!hasSupabaseConfig()) {
    return {
      ok: false as const,
      configured: false as const,
      reports: [],
      error: "Supabase environment variables are missing.",
    };
  }

  const query = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: String(Math.min(500, Math.max(1, Math.floor(input?.limit ?? 100)))),
  });
  if (input?.context) query.set("report_context", `eq.${input.context}`);
  if (input?.audience) query.set("audience", `eq.${input.audience}`);

  const result = await supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, { query: query.toString() });
  if (!result.ok) {
    return {
      ok: false as const,
      configured: true as const,
      reports: [],
      status: result.status,
      error: result.error,
    };
  }

  return { ok: true as const, configured: true as const, reports: result.data };
}

function cleanText(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}
