import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { listClientAdminRecords } from "@/lib/client-profile-admin";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";
import {
  type ReportFlowStatusPacket,
  type ReviewIntegrationEventPacket,
  type ReviewSmsCompliancePacket,
} from "@/lib/review-automation";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";
import { assessIntegrationEvent, summarizeIntegrationEventHealth } from "@/lib/review-integration-events";
import { listReviewAutomationRecords, saveReviewAutomationEvent } from "@/lib/review-automation-store";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import { getReportFlowStatus, reportFlowOwnerSummary } from "@/lib/report-flow-status";

export const metadata: Metadata = {
  title: "GHL Exit Ops",
  description: "Internal GetMeFound GHL replacement operations.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function GhlExitOpsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <AccessForm message={auth.message} />
      </ControlShell>
    );
  }

  const clients = await listClientAdminRecords();
  const clientOptions = clients.ok ? clients.records.map((record) => ({
    slug: record.profile.slug,
    name: record.profile.business_name,
  })) : [];
  const defaultClient = clientOptions[0]?.slug ?? "ai-outsource-hub";
  const eventResult = await listReviewAutomationRecords({ limit: 80 });
  const integrationRollup = await getIntegrationHealthRollup();
  const reportFlowStatus = await getReportFlowStatus({ clientSlug: "getmefound", limit: 100 });
  const events = eventResult.ok ? eventResult.records : [];
  const integrationEvents = events
    .filter((event) => event.eventType === "integration_event")
    .slice(0, 8)
    .map((event) => event.payload as ReviewIntegrationEventPacket);
  const integrationHealth = summarizeIntegrationEventHealth(events);
  const smsEvents = events
    .filter((event) => event.eventType === "sms_compliance_update")
    .slice(0, 8)
    .map((event) => event.payload as ReviewSmsCompliancePacket);
  const reportEvents = reportFlowStatus.ok ? reportFlowStatus.reports.slice(0, 8) : [];
  const reportFlowCounts = reportFlowStatus.counts;
  const reportReadyCount = reportFlowCounts.reportReady + reportFlowCounts.heatmapReady;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - GHL exit
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Ops replacements
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            POS/CRM intake, SMS compliance readiness, and report-flow status. These tools record proof and readiness only; they do not send SMS, start campaigns, or trigger GHL workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/clients" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Clients
          </Link>
          <Link href="/mike-mc/report-flow" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Reports
          </Link>
          <Pill tone={eventResult.ok ? "accent" : "danger"}>{eventResult.ok ? "supabase live" : "storage issue"}</Pill>
        </div>
      </header>

      {params.saved ? <Notice tone="ok">Saved {params.saved} event.</Notice> : null}
      {params.error ? <Notice tone="danger">{params.error}</Notice> : null}
      {!clients.ok ? <Notice tone="danger">{clients.error}</Notice> : null}
      {!eventResult.ok ? <Notice tone="danger">{eventResult.error}</Notice> : null}
      {!integrationRollup.ok ? <Notice tone="danger">{integrationRollup.error}</Notice> : null}
      {!reportFlowStatus.ok ? <Notice tone="danger">{reportFlowStatus.error}</Notice> : null}

      {integrationRollup.ok ? (
        <section className="mb-8 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-50">POS/CRM sync health</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                Active auto-syncs are flagged if events stop arriving or if records are held.
              </p>
            </div>
            <Pill tone={integrationRollup.needsAttention ? "danger" : "accent"}>
              {integrationRollup.needsAttention ? `${integrationRollup.needsAttention} need attention` : "all clear"}
            </Pill>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="clients" value={integrationRollup.totalClients} tone="muted" />
            <MiniStat label="attention" value={integrationRollup.needsAttention} tone={integrationRollup.needsAttention ? "danger" : "accent"} />
            <MiniStat
              label="active sync"
              value={integrationRollup.clients.filter((client) => client.activeAutoSync).length}
              tone="warm"
            />
            <MiniStat label="stale hrs" value={integrationRollup.staleAfterHours} tone="muted" />
          </div>
          <div className="mt-4 grid gap-2 xl:grid-cols-2">
            {integrationRollup.clients.slice(0, 6).map((client) => (
              <EventRow
                key={client.clientSlug}
                title={client.clientName}
                detail={`${client.integration?.systemName ?? "No POS/CRM"} - ${client.health?.latestAt ? formatShortDate(client.health.latestAt) : "no events yet"}`}
                badge={client.needsAttention ? "check" : client.activeAutoSync ? "active" : "manual"}
                tone={client.needsAttention ? "danger" : client.activeAutoSync ? "accent" : "muted"}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-3">
        <OpsPanel title="POS/CRM event" badge="intake proof">
          <PosEventForm clients={clientOptions} defaultClient={defaultClient} />
        </OpsPanel>
        <OpsPanel title="SMS readiness" badge="blocked until compliant">
          <SmsReadinessForm clients={clientOptions} defaultClient={defaultClient} />
        </OpsPanel>
        <OpsPanel title="Report flow" badge="GHL-free status">
          <ReportFlowForm />
        </OpsPanel>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <EventList title="Recent POS/CRM events" empty="No POS/CRM events logged yet.">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <MiniStat label="received" value={integrationHealth.received} tone="accent" />
            <MiniStat label="held" value={integrationHealth.held} tone={integrationHealth.held ? "danger" : "muted"} />
            <MiniStat label="eligible" value={integrationHealth.sendCandidateEligible} tone="accent" />
            <MiniStat label="duplicates" value={integrationHealth.duplicates} tone={integrationHealth.duplicates ? "warm" : "muted"} />
          </div>
          {integrationEvents.map((event) => (
            <EventRow
              key={`${event.clientSlug}-${event.externalEventId}-${event.timestamp}`}
              title={`${event.systemName} - ${event.eventType}`}
              detail={`${event.clientName} - ${event.customerEmail || "no email"} - ${event.sendCandidateEligible ? "eligible" : event.status}`}
              badge={event.holdReason || (event.duplicate ? "duplicate" : event.connectionLevel)}
              tone={event.status === "received" ? "accent" : event.status === "held" ? "danger" : "muted"}
            />
          ))}
        </EventList>
        <EventList title="Recent SMS readiness" empty="No SMS readiness records yet.">
          {smsEvents.map((event) => (
            <EventRow
              key={`${event.clientSlug}-${event.timestamp}`}
              title={`${event.clientName} - ${event.provider}`}
              detail={`Brand ${event.brandStatus}; campaign ${event.campaignStatus}; STOP ${event.stopHandlingStatus}`}
              badge={event.liveSendingAllowed ? "ready" : "blocked"}
              tone={event.liveSendingAllowed ? "accent" : "warm"}
            />
          ))}
        </EventList>
        <EventList title="Recent report flow" empty="No report-flow records yet.">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <MiniStat label="planned" value={reportFlowCounts.planned} tone="muted" />
            <MiniStat label="submitted" value={reportFlowCounts.submitted} tone="warm" />
            <MiniStat label="ready" value={reportReadyCount} tone={reportReadyCount ? "accent" : "muted"} />
            <MiniStat label="blocked" value={reportFlowCounts.blocked} tone={reportFlowCounts.blocked ? "danger" : "muted"} />
          </div>
          <div className="mb-3 rounded-md border border-zinc-800 bg-black/20 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Owner summary</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {reportFlowOwnerSummary(reportFlowCounts).join(" ")}
            </p>
          </div>
          {reportEvents.map((event) => (
            <EventRow
              key={`${event.runId}-${event.timestamp}`}
              title={`${event.reportLane} - ${event.reportType}`}
              detail={event.blocker || event.auditUrl || "No blocker recorded"}
              badge={event.status}
              tone={event.status === "blocked" ? "danger" : event.status.includes("ready") ? "accent" : "warm"}
            />
          ))}
        </EventList>
      </section>
    </ControlShell>
  );
}

async function openOps(formData: FormData) {
  "use server";

  const ok = await startInternalToolSession(valueFrom(formData, "token"));
  if (!ok) redirect("/mike-mc/ghl-exit-ops?error=Unauthorized");
  redirect("/mike-mc/ghl-exit-ops");
}

async function savePosEvent(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  if (!auth.ok) redirect("/mike-mc/ghl-exit-ops?error=Unauthorized");

  const clientSlug = cleanClientSlug(valueFrom(formData, "clientSlug"));
  const clientName = await getClientName(clientSlug);
  const customerEmail = valueFrom(formData, "customerEmail").toLowerCase();
  const externalEventId = valueFrom(formData, "externalEventId");
  const systemName = valueFrom(formData, "systemName") || "Manual Import";
  const occurredAt = valueFrom(formData, "occurredAt") || new Date().toISOString();
  const decision = await assessIntegrationEvent({
    clientSlug,
    systemName,
    externalEventId,
    customerEmail,
    occurredAt,
    dryRun: false,
  });
  const packet = {
    clientSlug,
    clientName,
    systemName,
    connectionLevel: valueFrom(formData, "connectionLevel") || "manual_upload",
    eventKey: decision.eventKey,
    externalEventId,
    eventType: valueFrom(formData, "eventType") || "completed_job",
    customerName: valueFrom(formData, "customerName"),
    customerEmail,
    customerPhone: valueFrom(formData, "customerPhone"),
    occurredAt,
    status: decision.status,
    holdReason: decision.holdReason,
    duplicate: decision.duplicate,
    duplicateOf: decision.duplicateOf,
    sendCandidateEligible: decision.sendCandidateEligible,
    metadata: { source: "mike-mc/ghl-exit-ops" },
    timestamp: new Date().toISOString(),
  } satisfies ReviewIntegrationEventPacket;

  if (decision.duplicate) redirect("/mike-mc/ghl-exit-ops?error=Duplicate POS event skipped");

  const saved = await saveReviewAutomationEvent("integration_event", packet);
  if (!saved.ok) redirect(`/mike-mc/ghl-exit-ops?error=${encodeURIComponent(saved.error)}`);
  revalidatePath("/mike-mc/ghl-exit-ops");
  redirect("/mike-mc/ghl-exit-ops?saved=POS");
}

async function saveSmsReadiness(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  if (!auth.ok) redirect("/mike-mc/ghl-exit-ops?error=Unauthorized");

  const brandStatus = enumFrom(valueFrom(formData, "brandStatus"), ["not_started", "drafting", "submitted", "approved", "rejected"], "not_started");
  const campaignStatus = enumFrom(valueFrom(formData, "campaignStatus"), ["not_started", "drafting", "submitted", "approved", "rejected"], "not_started");
  const optInStatus = enumFrom(valueFrom(formData, "optInStatus"), ["missing", "drafted", "approved"], "missing");
  const stopHandlingStatus = enumFrom(valueFrom(formData, "stopHandlingStatus"), ["missing", "planned", "ready"], "missing");
  const sampleMessageStatus = enumFrom(valueFrom(formData, "sampleMessageStatus"), ["missing", "drafted", "approved"], "missing");
  const liveSendingAllowed =
    brandStatus === "approved" &&
    campaignStatus === "approved" &&
    optInStatus === "approved" &&
    stopHandlingStatus === "ready" &&
    sampleMessageStatus === "approved";
  const packet = {
    clientSlug: cleanClientSlug(valueFrom(formData, "clientSlug")),
    clientName: await getClientName(cleanClientSlug(valueFrom(formData, "clientSlug"))),
    provider: enumFrom(valueFrom(formData, "provider"), ["twilio", "manual", "unknown"], "twilio"),
    brandStatus,
    campaignStatus,
    optInStatus,
    stopHandlingStatus,
    sampleMessageStatus,
    liveSendingAllowed,
    notes: valueFrom(formData, "notes").slice(0, 500),
    timestamp: new Date().toISOString(),
  } satisfies ReviewSmsCompliancePacket;

  const saved = await saveReviewAutomationEvent("sms_compliance_update", packet);
  if (!saved.ok) redirect(`/mike-mc/ghl-exit-ops?error=${encodeURIComponent(saved.error)}`);
  revalidatePath("/mike-mc/ghl-exit-ops");
  redirect("/mike-mc/ghl-exit-ops?saved=SMS");
}

async function saveReportStatus(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  if (!auth.ok) redirect("/mike-mc/ghl-exit-ops?error=Unauthorized");

  const packet = {
    clientSlug: "getmefound",
    clientName: "GetMeFound",
    reportLane: enumFrom(valueFrom(formData, "reportLane"), ["website_free_report", "campaign_report", "client_report"], "website_free_report"),
    reportType: enumFrom(valueFrom(formData, "reportType"), ["marketing", "ai_visibility"], "marketing"),
    source: "mike-mc/ghl-exit-ops",
    status: enumFrom(valueFrom(formData, "status"), ["planned", "submitted", "report_ready", "heatmap_ready", "blocked"], "planned"),
    runId: valueFrom(formData, "runId"),
    auditUrl: valueFrom(formData, "auditUrl"),
    heatmapUrl: valueFrom(formData, "heatmapUrl"),
    blocker: valueFrom(formData, "blocker"),
    timestamp: new Date().toISOString(),
  } satisfies ReportFlowStatusPacket;

  const saved = await saveReviewAutomationEvent("report_flow_status", packet);
  if (!saved.ok) redirect(`/mike-mc/ghl-exit-ops?error=${encodeURIComponent(saved.error)}`);
  revalidatePath("/mike-mc/ghl-exit-ops");
  redirect("/mike-mc/ghl-exit-ops?saved=report");
}

function AccessForm({ message }: { message: string }) {
  return (
    <section className="max-w-xl">
      <header className="mb-8 border-b border-zinc-800/60 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">GMF - Internal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">GHL Exit Ops</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Enter the internal API token to open replacement operation tools.</p>
      </header>
      <form action={openOps} className="rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Internal token</span>
          <input name="token" type="password" autoComplete="off" className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
        </label>
        <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">Open ops</button>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      </form>
    </section>
  );
}

function PosEventForm({ clients, defaultClient }: { clients: Array<{ slug: string; name: string }>; defaultClient: string }) {
  return (
    <form action={savePosEvent} className="grid gap-3">
      <ClientSelect clients={clients} defaultClient={defaultClient} />
      <Field label="System" name="systemName" defaultValue="Manual Upload" />
      <Field label="Connection" name="connectionLevel" defaultValue="manual_upload" />
      <Field label="External event ID" name="externalEventId" defaultValue="" />
      <Field label="Event type" name="eventType" defaultValue="completed_job" />
      <Field label="Customer name" name="customerName" defaultValue="" />
      <Field label="Customer email" name="customerEmail" defaultValue="" />
      <Field label="Customer phone" name="customerPhone" defaultValue="" />
      <Field label="Occurred at" name="occurredAt" defaultValue="" />
      <Submit label="Log POS event" />
    </form>
  );
}

function SmsReadinessForm({ clients, defaultClient }: { clients: Array<{ slug: string; name: string }>; defaultClient: string }) {
  return (
    <form action={saveSmsReadiness} className="grid gap-3">
      <ClientSelect clients={clients} defaultClient={defaultClient} />
      <Select label="Provider" name="provider" defaultValue="twilio" options={["twilio", "manual", "unknown"]} />
      <Select label="Brand" name="brandStatus" defaultValue="not_started" options={["not_started", "drafting", "submitted", "approved", "rejected"]} />
      <Select label="Campaign" name="campaignStatus" defaultValue="not_started" options={["not_started", "drafting", "submitted", "approved", "rejected"]} />
      <Select label="Opt-in" name="optInStatus" defaultValue="missing" options={["missing", "drafted", "approved"]} />
      <Select label="STOP handling" name="stopHandlingStatus" defaultValue="missing" options={["missing", "planned", "ready"]} />
      <Select label="Sample message" name="sampleMessageStatus" defaultValue="missing" options={["missing", "drafted", "approved"]} />
      <TextArea label="Notes" name="notes" defaultValue="" />
      <Submit label="Save SMS readiness" />
    </form>
  );
}

function ReportFlowForm() {
  return (
    <form action={saveReportStatus} className="grid gap-3">
      <Select label="Lane" name="reportLane" defaultValue="website_free_report" options={["website_free_report", "campaign_report", "client_report"]} />
      <Select label="Type" name="reportType" defaultValue="marketing" options={["marketing", "ai_visibility"]} />
      <Select label="Status" name="status" defaultValue="planned" options={["planned", "submitted", "report_ready", "heatmap_ready", "blocked"]} />
      <Field label="Run ID" name="runId" defaultValue="" />
      <Field label="Audit URL" name="auditUrl" defaultValue="" />
      <Field label="Heatmap URL" name="heatmapUrl" defaultValue="" />
      <TextArea label="Blocker" name="blocker" defaultValue="" />
      <Submit label="Save report status" />
    </form>
  );
}

function OpsPanel({ title, badge, children }: { title: string; badge: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
        <Pill tone="warm">{badge}</Pill>
      </div>
      {children}
    </section>
  );
}

function EventList({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
      <div className="space-y-2">{children || <p className="text-sm text-zinc-500">{empty}</p>}</div>
    </section>
  );
}

function EventRow({ title, detail, badge, tone }: { title: string; detail: string; badge: string; tone: "accent" | "warm" | "danger" | "muted" }) {
  return (
    <article className="rounded-md border border-zinc-800 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{title}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{detail}</p>
        </div>
        <Pill tone={tone}>{badge || "ok"}</Pill>
      </div>
    </article>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: "accent" | "warm" | "danger" | "muted" }) {
  const toneClasses = {
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    warm: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    muted: "border-zinc-800 bg-black/20 text-zinc-400",
  }[tone];
  return (
    <div className={`rounded-md border px-3 py-2 ${toneClasses}`}>
      <p className="font-mono text-[10px] uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function ClientSelect({ clients, defaultClient }: { clients: Array<{ slug: string; name: string }>; defaultClient: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Client</span>
      <select name="clientSlug" defaultValue={defaultClient} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60">
        {clients.length ? clients.map((client) => (
          <option key={client.slug} value={client.slug}>{client.name}</option>
        )) : <option value={defaultClient}>{defaultClient}</option>}
      </select>
    </label>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <input name={name} defaultValue={defaultValue} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
    </label>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: string[] }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <select name={name} defaultValue={defaultValue} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={3} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none focus:border-emerald-500/60" />
    </label>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <button className="w-fit rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
      {label}
    </button>
  );
}

function Notice({ tone, children }: { tone: "ok" | "danger"; children: ReactNode }) {
  const classes = tone === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-rose-500/30 bg-rose-500/10 text-rose-100";
  return <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${classes}`}>{children}</div>;
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function enumFrom<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function getClientName(clientSlug: string) {
  const clients = await listClientAdminRecords();
  if (!clients.ok) return clientSlug;
  return clients.records.find((record) => record.profile.slug === clientSlug)?.profile.business_name ?? clientSlug;
}
