import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { getJobProgressOverview, type JobProgressOverview, type JobProgressRow } from "@/lib/control/job-progress";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "Job Progress - Mission Control",
  description: "Owner-readable progress trail for GMF agent jobs.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function JobProgressPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const progress = await getJobProgressOverview();
  const attentionRows = progress.rows
    .filter((row) => row.humanNeeded || isTimerOverdue(row.timerState) || !row.proofText)
    .slice(0, 10);
  const presenceRows = progress.rows.filter((row) => /social|owned presence|gbp|google business profile|profile/i.test(row.name));
  const activeRows = progress.rows.filter((row) => row.status !== "Done");

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Agent Operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Job Progress
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-400">
            Monday is the board. Watchdog is the runtime check. This page merges both so you can see what each agent has done, what is happening now, proof, timers, and whether Mike is actually needed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/mike-mc">Hub</LinkButton>
          <LinkButton href="/mike-mc/jobs">Agent Jobs</LinkButton>
          {progress.monday.boardUrl ? <LinkButton href={progress.monday.boardUrl} external>Open Monday</LinkButton> : null}
          <Pill tone={progress.monday.ok ? "accent" : "danger"}>{progress.monday.ok ? "monday live" : "monday offline"}</Pill>
          <Pill tone={progress.watchdog.ok ? "accent" : "danger"}>{progress.watchdog.ok ? "watchdog live" : "watchdog missing"}</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Total jobs" value={progress.totals.total} />
        <Metric label="Agent working" value={progress.totals.active} tone="accent" />
        <Metric label="Ready review" value={progress.totals.readyForReview} tone="warm" />
        <Metric label="Overdue" value={progress.totals.overdue} tone={progress.totals.overdue ? "danger" : "muted"} />
        <Metric label="Mike needed" value={progress.totals.humanNeeded} tone={progress.totals.humanNeeded ? "danger" : "accent"} />
        <Metric label="No proof yet" value={progress.totals.noProof} tone={progress.totals.noProof ? "warm" : "muted"} />
      </section>

      <section className="mb-6 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Latest runtime source</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">
              {progress.watchdog.created ? `Watchdog ran ${formatStamp(progress.watchdog.created)}.` : "No watchdog timestamp found."}{" "}
              {progress.watchdog.fileName ? `Report: ${progress.watchdog.fileName}` : progress.watchdog.error}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone={progress.totals.humanNeeded ? "danger" : "accent"}>
              {progress.totals.humanNeeded ? "owner ask exists" : "no owner ask"}
            </Pill>
            <Pill tone={progress.totals.overdue ? "danger" : "accent"}>
              {progress.totals.overdue ? "rescue timers active" : "timers ok"}
            </Pill>
          </div>
        </div>
      </section>

      <ManagerWatchPanel progress={progress} />

      <ProgressSection
        id="attention"
        eyebrow="Needs attention"
        title="Jobs with overdue timers or missing proof"
        rows={attentionRows}
        empty="No attention rows found."
      />

      <ProgressSection
        id="presence"
        eyebrow="GMF presence"
        title="Google Business Profile and social profile work"
        rows={presenceRows}
        empty="No presence jobs found."
      />

      <section id="all-jobs" className="scroll-mt-8">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Full queue</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">Every active job and proof trail</h2>
          </div>
          <Pill tone="muted">{activeRows.length} active/open</Pill>
        </div>
        <div className="grid gap-3 2xl:grid-cols-2">
          {activeRows.map((row) => <ProgressCard key={`${row.id}-${row.name}`} row={row} />)}
        </div>
      </section>
    </ControlShell>
  );
}

function ProgressSection({
  id,
  eyebrow,
  title,
  rows,
  empty,
}: {
  id: string;
  eyebrow: string;
  title: string;
  rows: JobProgressRow[];
  empty: string;
}) {
  return (
    <section id={id} className="scroll-mt-8 mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/35 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{title}</h2>
        </div>
        <Pill tone={rows.length ? "warm" : "muted"}>{rows.length}</Pill>
      </div>
      {rows.length ? (
        <div className="grid gap-3 2xl:grid-cols-2">
          {rows.map((row) => <ProgressCard key={`${id}-${row.id}-${row.name}`} row={row} />)}
        </div>
      ) : (
        <p className="rounded-lg border border-zinc-800 bg-black/20 px-4 py-3 text-sm text-zinc-500">{empty}</p>
      )}
    </section>
  );
}

function ManagerWatchPanel({ progress }: { progress: JobProgressOverview }) {
  const disagreeRows = progress.rows.filter((row) => row.managerWatch.agreement === "disagree");
  const watchRows = progress.rows.filter((row) => row.managerWatch.agreement === "watch");
  const agreeRows = progress.rows.filter((row) => row.managerWatch.agreement === "agree");
  const nextRows = [...disagreeRows, ...watchRows].slice(0, 6);

  return (
    <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">Elon watch</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            My status check on every job
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-400">
            I am watching every row returned by Monday and watchdog. I agree only when the status has a valid execution path, proof target, next owner, and timer. I disagree when a job is overdue, unmapped, missing queue controls, or pretending to move without proof.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">{agreeRows.length} agreed</Pill>
          <Pill tone={watchRows.length ? "warm" : "muted"}>{watchRows.length} watch</Pill>
          <Pill tone={disagreeRows.length ? "danger" : "muted"}>{disagreeRows.length} disagree</Pill>
        </div>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        <TextBlock
          label="Routine"
          value="I check this during operating work, after watchdog runs, before owner brief review, before launch gates, and whenever a job becomes overdue, owner-needed, or unmapped."
        />
        <TextBlock
          label="Current action"
          value={disagreeRows.length ? "I am prioritizing rescue/mapping for the disagree rows first, then proof-watch rows." : "No disagree rows are present; I am watching proof and review throughput."}
        />
        <TextBlock
          label="Escalation rule"
          value="I ask Mike only after the assigned agent exhausts access, tools, docs, public sources, Slack, Monday, Mission Control, proof artifacts, and training."
        />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {nextRows.length ? (
          nextRows.map((row) => (
            <article key={`manager-watch-${row.id}-${row.name}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-3">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-zinc-100">{row.name}</h3>
                <Pill tone={row.managerWatch.tone}>{row.managerWatch.label}</Pill>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400">{row.managerWatch.action}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-zinc-800 bg-black/20 px-4 py-3 text-sm text-zinc-500">
            No manager exceptions right now.
          </p>
        )}
      </div>
    </section>
  );
}

function ProgressCard({ row }: { row: JobProgressRow }) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-4">
      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Pill tone={row.statusTone}>{row.status}</Pill>
            {row.timerState ? <Pill tone={isTimerOverdue(row.timerState) ? "danger" : "muted"}>{row.timerState}</Pill> : null}
            {row.humanNeeded ? <Pill tone="danger">Mike needed</Pill> : <Pill tone="accent">agent owned</Pill>}
          </div>
          <h3 className="text-base font-semibold leading-snug text-zinc-50">{row.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{row.group || "No group recorded"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {row.mondayUrl ? <LinkButton href={row.mondayUrl} external>Monday item</LinkButton> : null}
          {row.proofUrl ? <LinkButton href={row.proofUrl} external>Proof</LinkButton> : null}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2 rounded-lg border border-zinc-800/70 bg-black/20 p-3">
          <Meta label="Agent owner" value={row.agentOwner || "Unassigned"} />
          <Meta label="Reviewer" value={row.reviewer || "Unassigned"} />
          <Meta label="Next owner" value={row.nextOwner || "Not recorded"} />
          <Meta label="Expected" value={row.expectedReceive ? formatStamp(row.expectedReceive) : "Not recorded"} />
          <Meta label="Escalate" value={row.escalateAt ? formatStamp(row.escalateAt) : "Not recorded"} />
        </div>

        <div className="rounded-lg border border-zinc-800/70 bg-black/20 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Done so far</p>
          <ul className="mt-2 space-y-1.5">
            {row.doneSoFar.slice(0, 4).map((item) => (
              <li key={item} className="text-sm leading-relaxed text-zinc-300">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <TextBlock label="Current step" value={row.currentStep} />
        <TextBlock label="Watchdog recommendation" value={row.recommendedAction || row.reason || "No watchdog recommendation recorded."} />
      </div>

      <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">Elon status check</p>
          <Pill tone={row.managerWatch.tone}>{row.managerWatch.label}</Pill>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{row.managerWatch.action}</p>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "warm" | "danger" | "muted";
}) {
  const color = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    danger: "text-rose-300",
    muted: "text-zinc-500",
  }[tone];

  return (
    <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${color}`}>{value}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 text-xs">
      <span className="font-mono uppercase tracking-wider text-zinc-600">{label}</span>
      <span className="min-w-0 text-zinc-300">{value}</span>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800/70 bg-black/20 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-300">{value}</p>
    </div>
  );
}

function LinkButton({
  href,
  children,
  external = false,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
    >
      {children}
    </Link>
  );
}

function isTimerOverdue(timerState: string) {
  return timerState === "escalation_missed" || timerState === "expected_receive_missed";
}

function formatStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
