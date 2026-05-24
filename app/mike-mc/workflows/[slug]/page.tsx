import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { getGmfWorkflow, WORKFLOW_DEFINITIONS, type WorkflowStatus } from "@/lib/gmf-workflows";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = WORKFLOW_DEFINITIONS.find((item) => item.slug === slug);
  return {
    title: workflow?.name ?? "GMF Workflow",
    description: workflow?.oneLine ?? "GetMeFound workflow detail.",
    robots: { index: false, follow: false },
  };
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const workflow = await getGmfWorkflow(slug);
  if (!workflow) notFound();

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            Business workflow
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {workflow.name}
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-400">{workflow.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc/workflows" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Workflow Index
          </Link>
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Pill tone={statusTone(workflow.status)}>{workflow.status}</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {workflow.counters.map((counter) => (
          <MiniStat key={counter.label} label={counter.label} value={counter.value} tone={counter.tone} />
        ))}
      </section>

      <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Agent handoff</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                Each box shows what the agent does, what proof they owe, and who receives the handoff next.
              </p>
            </div>
            <Pill tone="muted">{workflow.agents.length} agents</Pill>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {workflow.agents.map((agent, index) => (
              <article key={`${agent.agent}-${agent.role}`} className="rounded-md border border-zinc-800 bg-black/20 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">Step {index + 1}</p>
                    <h3 className="mt-1 text-base font-semibold text-zinc-50">{agent.agent}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{agent.role}</p>
                  </div>
                  <Pill tone={index === workflow.agents.length - 1 ? "accent" : "warm"}>
                    {index === workflow.agents.length - 1 ? "outcome" : "handoff"}
                  </Pill>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">{agent.does}</p>
                <p className="mt-3 rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs leading-relaxed text-zinc-500">
                  Proof: {agent.proof}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <InfoPanel title="Ready Criteria" badge="weekly checked">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-400">
              {workflow.readyCriteria.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </InfoPanel>
          <InfoPanel title="Stall Protocol" badge={workflow.auditAgent}>
            <p className="text-sm leading-relaxed text-zinc-400">{workflow.stalledProtocol}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{workflow.mikeEscalation}</p>
          </InfoPanel>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <InfoPanel title="Client Email Approval" badge="Mike gate">
          <p className="text-sm leading-relaxed text-zinc-400">{workflow.clientEmailApproval}</p>
        </InfoPanel>
        <InfoPanel title="Coach Training" badge="knowledge">
          <p className="text-sm leading-relaxed text-zinc-400">{workflow.coachTraining}</p>
        </InfoPanel>
        <InfoPanel title="Useful Links" badge="open">
          <div className="flex flex-wrap gap-2">
            {workflow.links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
                {link.label}
              </Link>
            ))}
          </div>
        </InfoPanel>
      </section>
    </ControlShell>
  );
}

function InfoPanel({ title, badge, children }: { title: string; badge: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
        <Pill tone="muted">{badge}</Pill>
      </div>
      {children}
    </section>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "accent" | "warm" | "danger" | "muted" }) {
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

function statusTone(status: WorkflowStatus): "accent" | "warm" | "danger" | "muted" {
  if (status === "ready") return "accent";
  if (status === "working" || status === "manual") return "warm";
  if (status === "blocked") return "danger";
  return "muted";
}
