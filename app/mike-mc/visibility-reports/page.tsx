import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { hasInternalToolSession } from "@/lib/internal-tool-session";
import { listVisibilityReports, type VisibilityReportRow } from "@/lib/visibility-reports";

export const metadata: Metadata = {
  title: "Visibility Reports",
  description: "GMF prospect and client visibility report queue.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VisibilityReportsPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const result = await listVisibilityReports({ limit: 200 });
  const reports = result.ok ? result.reports : [];
  const prospectReports = reports.filter((report) => report.audience === "prospect");
  const clientReports = reports.filter((report) => report.audience === "client");
  const blocked = reports.filter((report) => Boolean(report.blocker) || report.report_status === "blocked");
  const readyish = reports.filter((report) => ["ready_for_audit", "approved_to_send", "sent"].includes(report.report_status));

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Visibility reports
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            One report engine, two business contexts: prospect free checks for Sales Rep and client baselines for Account Manager.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/report-flow" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Legacy Flow
          </Link>
          <Pill tone={result.ok ? "accent" : "danger"}>{result.ok ? "supabase live" : "storage issue"}</Pill>
        </div>
      </header>

      {!result.ok ? (
        <section className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {result.error}
        </section>
      ) : null}

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MiniStat label="all reports" value={reports.length} tone="muted" />
        <MiniStat label="prospects" value={prospectReports.length} tone="warm" />
        <MiniStat label="clients" value={clientReports.length} tone="accent" />
        <MiniStat label="ready/sent" value={readyish.length} tone={readyish.length ? "accent" : "muted"} />
        <MiniStat label="blocked" value={blocked.length} tone={blocked.length ? "danger" : "muted"} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ReportPanel
          title="Prospect reports"
          description="Free checks, campaign replies, and orphanable reports. Sales Rep owns these."
          empty="No prospect visibility reports yet."
          reports={prospectReports}
        />
        <ReportPanel
          title="Client baselines"
          description="Paid-client onboarding and recurring visibility checks. Account Manager owns client communication."
          empty="No client baseline reports yet."
          reports={clientReports}
        />
      </section>

      <section className="mt-5 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Recent activity</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              This is the queue agents should use before deciding who emails the prospect or client.
            </p>
          </div>
          <Pill tone="muted">{reports.length} records</Pill>
        </div>
        <div className="grid gap-2 xl:grid-cols-2">
          {reports.length ? (
            reports.slice(0, 16).map((report) => <ReportRow key={report.id} report={report} />)
          ) : (
            <p className="text-sm text-zinc-500">No visibility report records yet.</p>
          )}
        </div>
      </section>
    </ControlShell>
  );
}

function ReportPanel({
  title,
  description,
  empty,
  reports,
}: {
  title: string;
  description: string;
  empty: string;
  reports: VisibilityReportRow[];
}) {
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{description}</p>
        </div>
        <Pill tone="muted">{reports.length}</Pill>
      </div>
      <div className="space-y-2">
        {reports.length ? reports.slice(0, 8).map((report) => <ReportRow key={report.id} report={report} />) : (
          <p className="text-sm text-zinc-500">{empty}</p>
        )}
      </div>
    </section>
  );
}

function ReportRow({ report }: { report: VisibilityReportRow }) {
  return (
    <article className="rounded-md border border-zinc-800 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">
            {report.business_name || "Unnamed business"}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {report.report_context} - {report.owner_role || "No owner"} - {formatShortDate(report.created_at)}
          </p>
        </div>
        <Pill tone={statusTone(report.report_status)}>{report.report_status}</Pill>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
        <p className="truncate">Email: {report.contact_email || "none"}</p>
        <p className="truncate">Location: {report.business_location || "none"}</p>
        <p className="truncate">Lead: {report.lead_status || "-"}</p>
        <p className="truncate">Client: {report.client_lifecycle || "-"}</p>
      </div>
      {report.next_action ? <p className="mt-3 text-xs leading-relaxed text-zinc-400">{report.next_action}</p> : null}
      {report.blocker ? <p className="mt-2 text-xs leading-relaxed text-rose-200/80">{report.blocker}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {report.audit_url ? <ReportLink href={report.audit_url}>Report</ReportLink> : null}
        {report.heatmap_url ? <ReportLink href={report.heatmap_url}>Heatmap</ReportLink> : null}
        {report.business_website ? <ReportLink href={report.business_website}>Business</ReportLink> : null}
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

function ReportLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20"
    >
      {children}
    </a>
  );
}

function statusTone(status: string) {
  if (status === "blocked") return "danger";
  if (status === "approved_to_send" || status === "sent") return "accent";
  if (status === "ready_for_audit" || status === "building") return "warm";
  return "muted";
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
