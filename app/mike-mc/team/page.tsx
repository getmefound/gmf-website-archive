import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { AGENT_TEAM, type AgentTeamMember } from "@/lib/control/team";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "GMF Agent Roster - The Hub",
  description: "Internal GMF agent roster and responsibility map.",
  robots: { index: false, follow: false },
};

export default async function AgentRosterPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const activeCount = AGENT_TEAM.filter((agent) => agent.status === "active").length;
  const buildingCount = AGENT_TEAM.filter((agent) => agent.status === "building").length;
  const plannedCount = AGENT_TEAM.filter((agent) => agent.status === "planned").length;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Agent Company
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Agent Roster
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Manager runs the company. Each agent owns one lane, one proof standard, and one escalation path.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </Link>
          <Pill tone="accent">{activeCount} active</Pill>
          <Pill tone="warm">{buildingCount} building</Pill>
          <Pill tone="muted">{plannedCount} planned</Pill>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
          Operating rule
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Agents work until blocked. Manager decides who needs Mike.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Mike should not be asked to babysit normal delivery. He should approve access, spending, public promises, risky automation, and client messages that need human judgment.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {AGENT_TEAM.map((agent) => (
          <AgentRosterCard key={agent.agent} agent={agent} />
        ))}
      </section>
    </ControlShell>
  );
}

function AgentRosterCard({ agent }: { agent: AgentTeamMember }) {
  return (
    <article className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 shadow-xl shadow-black/30">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
            {agent.codename}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-50">
            {agent.displayName}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{agent.title}</p>
        </div>
        <Pill tone={statusTone(agent.status)}>{agent.status}</Pill>
      </div>

      <p className="text-sm leading-relaxed text-zinc-400">{agent.responsibility}</p>
      <p className="mt-3 rounded-lg border border-zinc-800/70 bg-black/20 p-3 text-xs leading-relaxed text-zinc-500">
        {agent.archetypeNote}
      </p>

      <LabelList label="Owns" items={agent.owns} />
      <LabelList label="Proof" items={agent.proof} muted />

      <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
          Current focus
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{agent.currentFocus}</p>
      </div>
    </article>
  );
}

function LabelList({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-md border px-2 py-1 text-xs ${
              muted
                ? "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function statusTone(status: AgentTeamMember["status"]) {
  if (status === "active") return "accent";
  if (status === "building") return "warm";
  if (status === "review") return "warn";
  return "muted";
}
