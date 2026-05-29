import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { getSentinelReport, type SentinelGrade } from "@/lib/control/sentinel";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "Agent Ness",
  description: "Independent GMF business improvement auditor.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AgentNessPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const report = getSentinelReport();
  const priorSummary = summarizeReport(report.previousText);

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Independent auditor
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Agent Ness
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {report.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/workflows" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Workflows
          </Link>
          <Pill tone="accent">daily</Pill>
          <Pill tone={report.metrics.ownerNeeded ? "warm" : "ok"}>{report.metrics.ownerNeeded} owner asks</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="efficiency" value={`${report.metrics.efficiencyScore}/100`} tone={report.metrics.efficiencyScore >= 70 ? "accent" : "warm"} />
        <Metric label="watched jobs" value={report.metrics.watchedJobs.toString()} tone="muted" />
        <Metric label="access blocked" value={report.metrics.accessBlocked.toString()} tone={report.metrics.accessBlocked ? "danger" : "accent"} />
        <Metric label="manual audit" value={report.metrics.manualAudit.toString()} tone={report.metrics.manualAudit > 6 ? "warm" : "muted"} />
        <Metric label="systems build" value={report.metrics.systemsBuild.toString()} tone={report.metrics.systemsBuild > 3 ? "warm" : "muted"} />
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                Current report
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
                {report.date}
              </h2>
            </div>
            <Pill tone={report.metrics.timerOverdue ? "danger" : "ok"}>
              {report.metrics.timerOverdue ? "timer overdue" : "timers ok"}
            </Pill>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            {report.mainConstraint}
          </p>
          <p className="mt-3 rounded-md border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-sm leading-relaxed text-zinc-400">
            Owner decision: {report.ownerDecision}
          </p>
        </article>

        <article className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Prior results
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
            {report.previousLabel}
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            {priorSummary.map((item) => (
              <div key={item.label} className="rounded-md border border-zinc-800 bg-black/20 px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-8">
        <SectionHeader
          eyebrow="Grades"
          title="Operating temperature"
          sub="Hot means Agent Ness sees an opportunity or constraint worth attention now. Cool means monitor on cadence."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {report.grades.map((grade) => (
            <GradeCard key={grade.area} grade={grade} />
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeader
            eyebrow="Suggestions today"
            title="Decision-ready improvements"
            sub="Up to five things Mike can approve, reject, or ask Elon to route to an agent."
          />
          <div className="grid gap-3">
            {report.suggestions.map((suggestion) => (
              <article key={suggestion.title} className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-4">
                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-zinc-50">{suggestion.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500">{suggestion.reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="muted">{suggestion.owner}</Pill>
                    <Pill tone={suggestion.temperature === "hot" ? "hot" : "ok"}>{suggestion.temperature}</Pill>
                  </div>
                </div>
                <p className="mt-3 rounded-md border border-zinc-800 bg-black/20 px-3 py-2 font-mono text-xs leading-relaxed text-emerald-200">
                  {suggestion.command}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside>
          <SectionHeader
            eyebrow="Useful links"
            title="Improve the business"
            sub="Five links max unless Mike asks Agent Ness for more."
          />
          <div className="grid gap-3">
            {report.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.kind === "source" ? "_blank" : undefined}
                rel={link.kind === "source" ? "noopener noreferrer" : undefined}
                className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-zinc-100">{link.title}</h3>
                  <Pill tone={link.kind === "source" ? "warm" : "accent"}>{link.kind}</Pill>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500">{link.reason}</p>
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-5">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
              Southington GBP proof
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
              Authenticated proof still has to be captured
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="warm">{report.southington.status}</Pill>
            <Pill tone={report.southington.timer === "timer_ok" ? "ok" : "danger"}>{report.southington.timer}</Pill>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{report.southington.reason}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <TimeBox label="Expected receive" value={report.southington.expected} />
          <TimeBox label="Escalate if missing" value={report.southington.escalate} />
        </div>
      </section>
    </ControlShell>
  );
}

function summarizeReport(text: string) {
  return [
    { label: "efficiency", value: `${metricValue(text, "Agent efficiency score")}/100` },
    { label: "owner asks", value: metricValue(text, "Owner-needed jobs").toString() },
    { label: "blocked", value: metricValue(text, "Access-blocked jobs").toString() },
  ];
}

function metricValue(text: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Number(text.match(new RegExp(`- ${escaped}:\\s*(\\d+)`, "i"))?.[1] || 0);
}

function GradeCard({ grade }: { grade: SentinelGrade }) {
  return (
    <article className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-50">{grade.area}</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{grade.reason}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold leading-none text-emerald-300">{grade.grade}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{grade.score}/100</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Pill tone={grade.temperature === "hot" ? "hot" : "ok"}>{grade.temperature}</Pill>
      </div>
      <p className="mt-3 rounded-md border border-zinc-800 bg-black/20 px-3 py-2 text-sm leading-relaxed text-zinc-300">
        {grade.action}
      </p>
    </article>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "accent" | "warm" | "danger" | "muted" }) {
  const classes = {
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    warm: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    muted: "border-zinc-800 bg-black/20 text-zinc-400",
  }[tone];

  return (
    <div className={`rounded-md border px-3 py-2 ${classes}`}>
      <p className="font-mono text-[10px] uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 break-words font-mono text-xs text-zinc-200">{value}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <header className="mb-4 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{sub}</p>
    </header>
  );
}
