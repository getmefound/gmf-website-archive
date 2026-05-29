import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import {
  GHL_EXIT_CHECKLIST,
  GHL_EXIT_COMMANDS,
  GHL_EXIT_METRICS,
  GHL_EXIT_SUMMARY,
  type GhlExitChecklistItem,
  type GhlExitStatus,
} from "@/lib/control/ghl-exit-checklist";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "Legacy Platform Archive - The Hub",
  description: "Archived transition checklist and proof for old platform replacement work.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const statusOrder: GhlExitStatus[] = ["done", "blocked", "next", "later"];

const sectionCopy: Record<GhlExitStatus, { title: string; sub: string }> = {
  done: {
    title: "Already handled",
    sub: "Pieces that are built or confirmed.",
  },
  blocked: {
    title: "Needs action before live testing",
    sub: "These are the two items stopping the Review Automation replacement from proving itself live.",
  },
  next: {
    title: "Build next",
    sub: "Work that turns the replacement from built pieces into a real operating service.",
  },
  later: {
    title: "After Review Automation works",
    sub: "Bigger legacy replacements that should wait until the first service is stable.",
  },
};

export default async function GhlExitPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const grouped = statusOrder.map((status) => ({
    status,
    items: GHL_EXIT_CHECKLIST.filter((item) => item.status === status),
  }));

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">
            GMF - Legacy archive
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {GHL_EXIT_SUMMARY.title}
          </h1>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-zinc-400">
            {GHL_EXIT_SUMMARY.ownerNote}
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
            Job index
          </Link>
          <Pill tone="warm">archive</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {GHL_EXIT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              {metric.label}
            </p>
            <p className={`mt-2 font-mono text-3xl font-bold leading-none ${metricTone(metric.tone)}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Owner rule
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              Legacy cancel proof stays archived
            </h2>
            <p className="mt-2 max-w-4xl text-base leading-relaxed text-zinc-400">
              {GHL_EXIT_SUMMARY.cancelGate}
            </p>
          </div>
          <Pill tone="warn">legacy</Pill>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {grouped.map(({ status, items }) => (
          <ChecklistSection key={status} status={status} items={items} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              Slack commands
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              What to ask Manager
            </h2>
            <p className="mt-2 text-base leading-relaxed text-zinc-400">
              These are the simple checks that keep this project moving without digging through files.
            </p>
          </div>
          <Pill tone="muted">copy into Slack</Pill>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {GHL_EXIT_COMMANDS.map((command) => (
            <code
              key={command}
              className="rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-4 font-mono text-sm leading-relaxed text-zinc-200"
            >
              {command}
            </code>
          ))}
        </div>
      </section>
    </ControlShell>
  );
}

function ChecklistSection({
  status,
  items,
}: {
  status: GhlExitStatus;
  items: GhlExitChecklistItem[];
}) {
  const copy = sectionCopy[status];

  return (
    <section className={`rounded-2xl border p-5 md:p-6 ${sectionClass(status)}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            {statusLabel(status)}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy.sub}</p>
        </div>
        <Pill tone={pillTone(status)}>{items.length}</Pill>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-xs ${boxClass(item.status)}`}>
                {item.status === "done" ? "x" : ""}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-base font-semibold leading-snug text-zinc-100">
                    {item.title}
                  </h3>
                  <Pill tone={pillTone(item.status)}>{item.owner}</Pill>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function statusLabel(status: GhlExitStatus) {
  if (status === "done") return "done";
  if (status === "blocked") return "blocked";
  if (status === "next") return "next";
  return "later";
}

function pillTone(status: GhlExitStatus) {
  if (status === "done") return "accent";
  if (status === "blocked") return "danger";
  if (status === "next") return "warm";
  return "muted";
}

function sectionClass(status: GhlExitStatus) {
  if (status === "done") return "border-emerald-500/25 bg-emerald-500/5";
  if (status === "blocked") return "border-rose-500/25 bg-rose-500/5";
  if (status === "next") return "border-amber-500/25 bg-amber-500/5";
  return "border-zinc-800/70 bg-zinc-900/40";
}

function boxClass(status: GhlExitStatus) {
  if (status === "done") return "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
  if (status === "blocked") return "border-rose-500/50 bg-rose-500/10 text-rose-300";
  if (status === "next") return "border-amber-500/50 bg-amber-500/10 text-amber-300";
  return "border-zinc-700 bg-zinc-900 text-zinc-500";
}

function metricTone(tone: (typeof GHL_EXIT_METRICS)[number]["tone"]) {
  if (tone === "accent") return "text-emerald-300";
  if (tone === "warm") return "text-amber-300";
  if (tone === "danger") return "text-rose-300";
  return "text-zinc-400";
}
