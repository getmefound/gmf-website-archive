import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";
import { getReportFlowStatus, reportFlowOwnerSummary } from "@/lib/report-flow-status";
import type { ReportFlowStatusPacket } from "@/lib/review-automation";

export const metadata: Metadata = {
  title: "Report Flow",
  description: "Internal GetMeFound report delivery status.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ReportFlowPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <AccessForm message={params.error || auth.message} />
      </ControlShell>
    );
  }

  const status = await getReportFlowStatus({ clientSlug: "getmefound", limit: 100 });
  const counts = status.counts;
  const readyCount = counts.reportReady + counts.heatmapReady;
  const deliverables = status.ok
    ? status.reports.filter((report) => report.auditUrl || report.heatmapUrl)
    : [];
  const blockers = status.ok
    ? status.reports.filter((report) => report.status === "blocked")
    : [];

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - GHL exit
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Report flow
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            A GHL-free owner view for report requests, audit links, heatmap links, and blocked handoffs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/ghl-exit-ops" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Log Status
          </Link>
          <Pill tone={status.ok ? "accent" : "danger"}>{status.ok ? "supabase live" : "storage issue"}</Pill>
        </div>
      </header>

      {!status.ok ? <Notice tone="danger">{status.error}</Notice> : null}

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MiniStat label="planned" value={counts.planned} tone="muted" />
        <MiniStat label="submitted" value={counts.submitted} tone="warm" />
        <MiniStat label="ready" value={readyCount} tone={readyCount ? "accent" : "muted"} />
        <MiniStat label="links" value={counts.deliverable} tone={counts.deliverable ? "accent" : "muted"} />
        <MiniStat label="blocked" value={counts.blocked} tone={counts.blocked ? "danger" : "muted"} />
      </section>

      <section className="mb-8 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Owner summary</h2>
          <Pill tone={blockers.length ? "danger" : readyCount ? "accent" : "warm"}>
            {blockers.length ? "blocked" : readyCount ? "assets ready" : "in progress"}
          </Pill>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">
          {reportFlowOwnerSummary(counts).join(" ")}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Use GHL Exit Ops to log a report status. This page is the cleaner read-only delivery view.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <ReportList title="Deliverable links" empty="No audit or heatmap links have been logged yet." reports={deliverables} />
        <ReportList title="Blocked reports" empty="No blocked report handoffs." reports={blockers} />
      </section>

      <section className="mt-5 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Recent report activity</h2>
          <Pill tone="muted">{status.ok ? status.reports.length : 0} records</Pill>
        </div>
        <div className="grid gap-2 xl:grid-cols-2">
          {status.ok && status.reports.length ? (
            status.reports.slice(0, 12).map((report) => <ReportRow key={`${report.runId}-${report.timestamp}`} report={report} />)
          ) : (
            <p className="text-sm text-zinc-500">No report-flow records yet.</p>
          )}
        </div>
      </section>
    </ControlShell>
  );
}

async function openReportFlow(formData: FormData) {
  "use server";

  const ok = await startInternalToolSession(valueFrom(formData, "token"));
  if (!ok) redirect("/mike-mc/report-flow?error=Unauthorized");
  redirect("/mike-mc/report-flow");
}

function AccessForm({ message }: { message: string }) {
  return (
    <section className="max-w-xl">
      <header className="mb-8 border-b border-zinc-800/60 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">GMF - Internal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">Report Flow</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Enter the internal API token to open report delivery status.</p>
      </header>
      <form action={openReportFlow} className="rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Internal token</span>
          <input name="token" type="password" autoComplete="off" className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
        </label>
        <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">Open reports</button>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      </form>
    </section>
  );
}

function ReportList({ title, empty, reports }: { title: string; empty: string; reports: ReportFlowStatusPacket[] }) {
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
        <Pill tone="muted">{reports.length}</Pill>
      </div>
      <div className="space-y-2">
        {reports.length ? reports.slice(0, 8).map((report) => <ReportRow key={`${report.runId}-${report.timestamp}`} report={report} />) : (
          <p className="text-sm text-zinc-500">{empty}</p>
        )}
      </div>
    </section>
  );
}

function ReportRow({ report }: { report: ReportFlowStatusPacket }) {
  return (
    <article className="rounded-md border border-zinc-800 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">
            {report.reportLane} - {report.reportType}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {report.runId || "No run ID"} - {formatShortDate(report.timestamp)}
          </p>
        </div>
        <Pill tone={statusTone(report.status)}>{report.status}</Pill>
      </div>
      {report.blocker ? <p className="mt-2 text-xs leading-relaxed text-rose-200/80">{report.blocker}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {report.auditUrl ? <ReportLink href={report.auditUrl}>Audit</ReportLink> : null}
        {report.heatmapUrl ? <ReportLink href={report.heatmapUrl}>Heatmap</ReportLink> : null}
        {!report.auditUrl && !report.heatmapUrl && !report.blocker ? (
          <span className="text-xs text-zinc-600">No link or blocker recorded.</span>
        ) : null}
      </div>
    </article>
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

function Notice({ children }: { tone: "danger"; children: ReactNode }) {
  return <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{children}</div>;
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function statusTone(status: ReportFlowStatusPacket["status"]) {
  if (status === "blocked") return "danger";
  if (status === "report_ready" || status === "heatmap_ready") return "accent";
  if (status === "submitted") return "warm";
  return "muted";
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
