import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  REACH_INTERNAL_JOB,
  REACH_PROCESS_FACTS,
  type ControlTone,
  type ReachLane,
  type ReachStep,
} from "@/lib/control/internal-jobs";

export const metadata: Metadata = {
  title: "Reach Cold Email Campaign - The Hub",
  description: "Internal job room for Reach Cold Email Campaign progress.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const RELAY_OK_ROWS = [
  "Veterinary Eye Center - Connecticut | info@vecct.com | Greenwich",
  "Connecticut Veterinary Center | r.perez@ctvetcenter.com | West Hartford",
];

const RELAY_HELD_ROWS = [
  "Cornell University Veterinary Specialists | emazzaferro@hotmail.com | personal email + duplicate business",
  "Cornell University Veterinary Specialists | inez_earth@yahoo.com | personal email + duplicate business",
];

export default function ReachColdEmailCampaignPage() {
  const job = REACH_INTERNAL_JOB;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Internal job
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {job.title}
          </h1>
          <p className="mt-2 max-w-5xl text-base leading-relaxed text-zinc-400">
            {job.plainEnglish}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Link
            href="/mike-mc/jobs"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Job ledger
          </Link>
          <Pill tone={job.statusTone}>{job.status}</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {job.metrics.map((metric) => (
          <MetricTile key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
        ))}
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 md:p-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Normal terms
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              It is paused between import and sending
            </h2>
            <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-300">
              The wiring is good enough to answer in Slack and run read-only GHL checks. The bad or questionable
              Relay emails were filtered out. The handoff is stopping at the correct place: contacts can be imported,
              but the system should not send emails until drip readiness is proven.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/25 bg-black/25 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-300">
              Current stop sign
            </p>
            <p className="mt-2 text-base leading-relaxed text-zinc-100">
              {job.currentBlocker}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Import-only means "put the clean contacts in GHL and tag them." It does not mean "start emailing."
            </p>
          </div>
        </div>
      </section>

      <LaneStatusSection lanes={job.lanes} />
      <ProcessSection steps={job.steps} />
      <RelayRowsSection />
      <ProcessFactsSection />
      <NextMoveSection />
    </ControlShell>
  );
}

function LaneStatusSection({ lanes }: { lanes: ReachLane[] }) {
  return (
    <section className="mb-8">
      <SectionHeader
        eyebrow="Campaign lanes"
        title="What each lane is doing now"
        sub="These are the three small warmup lanes. Relay moved furthest; Reviews and AI Visibility still need list QA and visual GHL review."
      />
      <div className="grid gap-3 lg:grid-cols-3">
        {lanes.map((lane) => (
          <article
            key={lane.name}
            className="rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-mono text-lg font-bold uppercase tracking-wider text-zinc-50">
                  {lane.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{lane.domain}</p>
              </div>
              <Pill tone={lane.tone}>{lane.dripState}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">{lane.status}</p>
            <div className="mt-4 space-y-2 border-t border-zinc-800/60 pt-4">
              <StatusRow label="Rows" value={lane.rows} />
              <StatusRow label="QA" value={lane.qa} />
              <StatusRow label="Import" value={lane.importState} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProcessSection({ steps }: { steps: ReachStep[] }) {
  return (
    <section className="mb-8">
      <SectionHeader
        eyebrow="Agent handoff"
        title="Step-by-step job visual"
        sub="This is the succession chain: who touched it, what they did, and what is still left before anything sends."
      />
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
        {steps.map((step) => (
          <StepCard key={step.order} step={step} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ step }: { step: ReachStep }) {
  return (
    <article className="rounded-2xl border border-zinc-800/70 bg-zinc-950/80 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Step {step.order}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-snug text-zinc-100">
            {step.title}
          </h3>
        </div>
        <Pill tone={step.tone}>{step.status}</Pill>
      </div>
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
        {step.agent}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {step.whatHappened}
      </p>
      <div className="mt-4 border-t border-zinc-800/60 pt-3">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Left to do
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">
          {step.leftToDo}
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          {step.evidence}
        </p>
      </div>
    </article>
  );
}

function RelayRowsSection() {
  return (
    <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
            Relay row decision
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Clean rows went in; questionable rows stayed out
          </h2>
        </div>
        <Pill tone="accent">import-only done</Pill>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <RowList title="Imported and tagged" tone="accent" rows={RELAY_OK_ROWS} />
        <RowList title="Held out" tone="danger" rows={RELAY_HELD_ROWS} />
      </div>
    </section>
  );
}

function ProcessFactsSection() {
  return (
    <section className="mb-8">
      <SectionHeader
        eyebrow="Why it felt loopy"
        title="What the repeated checks actually mean"
        sub="Most repeated Slack answers were safety/status checks, not the whole prospecting process rerunning from scratch."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {REACH_PROCESS_FACTS.map((fact) => (
          <article key={fact.label} className="rounded-2xl border border-zinc-800/70 bg-black/25 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-sky-300">
              {fact.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {fact.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function NextMoveSection() {
  return (
    <section className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-300">
            Next move
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Do not start drip yet
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            The next valid step is proving drip readiness, not approving import again. HighLevel AI features must stay OFF unless Mike manually authorizes them.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ActionTile
            label="1"
            title="Confirm drip readiness"
            body="GHL Expert and Systems Director verify warmup, sender nodes, caps, unsubscribe, reply routing, and no AI toggles."
          />
          <ActionTile
            label="2"
            title="Mark ready_for_drip=yes"
            body="Only after those checks pass should the ledger move Relay from imported to drip-ready."
          />
          <ActionTile
            label="3"
            title="Separate Mike approval"
            body="Starting emails requires a new explicit start-drip approval. Import approval is not enough."
          />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="mb-5 max-w-5xl">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-zinc-500">{sub}</p>
    </header>
  );
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: ControlTone;
}) {
  const valueClass = {
    default: "text-zinc-100",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    hot: "text-rose-300",
    warn: "text-amber-300",
    ok: "text-emerald-300",
    muted: "text-zinc-400",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-600">
        {label}
      </span>
      <span className="text-right text-zinc-300">{value}</span>
    </div>
  );
}

function RowList({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: ControlTone;
  rows: string[];
}) {
  return (
    <div className="rounded-xl border border-zinc-800/70 bg-black/25 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300">
          {title}
        </h3>
        <Pill tone={tone}>{rows.length}</Pill>
      </div>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-sm leading-relaxed text-zinc-400">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionTile({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <p className="font-mono text-xs uppercase tracking-wider text-rose-300">
        Action {label}
      </p>
      <h3 className="mt-2 text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
    </article>
  );
}
