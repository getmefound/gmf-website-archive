import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { listGmfWorkflows, type GmfWorkflow, type WorkflowStatus } from "@/lib/gmf-workflows";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "GMF Workflows",
  description: "Internal index of GetMeFound operating workflows.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const workflows = await listGmfWorkflows();
  const ready = workflows.filter((workflow) => workflow.status === "ready").length;
  const blocked = workflows.filter((workflow) => workflow.status === "blocked").length;
  const working = workflows.filter((workflow) => workflow.status === "working").length;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GetMeFound - Operating system
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Workflow index
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Business workflow families, owners, counters, weekly checks, and handoffs. Open a workflow to see every agent step from start to final outcome.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/setup-jobs" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Setup Jobs
          </Link>
          <Pill tone="accent">{ready} ready</Pill>
          <Pill tone="warm">{working} working</Pill>
          <Pill tone={blocked ? "danger" : "muted"}>{blocked} blocked</Pill>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.slug} workflow={workflow} />
        ))}
      </section>
    </ControlShell>
  );
}

function WorkflowCard({ workflow }: { workflow: GmfWorkflow }) {
  return (
    <Link
      href={`/mike-mc/workflows/${workflow.slug}`}
      className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{workflow.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{workflow.oneLine}</p>
        </div>
        <Pill tone={statusTone(workflow.status)}>{workflow.status}</Pill>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {workflow.counters.map((counter) => (
          <div key={counter.label} className={`rounded-md border px-3 py-2 ${counterClass(counter.tone)}`}>
            <p className="font-mono text-[10px] uppercase tracking-wider">{counter.label}</p>
            <p className="mt-1 text-lg font-semibold">{counter.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone="muted">weekly: {workflow.weeklyCheckAgent}</Pill>
        <Pill tone="muted">audit: {workflow.auditAgent}</Pill>
      </div>
    </Link>
  );
}

function statusTone(status: WorkflowStatus): "accent" | "warm" | "danger" | "muted" {
  if (status === "ready") return "accent";
  if (status === "working" || status === "manual") return "warm";
  if (status === "blocked") return "danger";
  return "muted";
}

function counterClass(tone: "accent" | "warm" | "danger" | "muted") {
  return {
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    warm: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    muted: "border-zinc-800 bg-black/20 text-zinc-400",
  }[tone];
}
