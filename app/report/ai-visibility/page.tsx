import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { ReportTiming } from "@/components/report/ReportTiming";
import { buildAIVisibilityReport } from "@/lib/ai-visibility";
import {
  buildFallbackProspectArtifact,
  buildProspectVisibilityArtifact,
  type ProspectVisibilityArtifact,
  type ProspectVisibilitySignal,
  type StatusLabel,
} from "@/lib/visibility-report-artifacts";

export const metadata: Metadata = {
  title: "AI Visibility Report",
  description: "See how Google and AI systems understand your business.",
  alternates: { canonical: "/report/ai-visibility" },
  robots: { index: false, follow: false },
};

const BOOK_URL = "/contact";
const GET_FOUND_URL = "/checkout/get-found-refresh";

export default async function AIVisibilityReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const str = (key: string) => (typeof params[key] === "string" ? (params[key] as string).trim() : "");
  const runId = str("runId");
  const email = str("email");
  const businessRaw = str("business");
  const cityRaw = str("city");
  const report = businessRaw ? await buildAIVisibilityReport(businessRaw, cityRaw || undefined) : null;
  const artifact = report
    ? buildProspectVisibilityArtifact(report)
    : buildFallbackProspectArtifact({ businessName: businessRaw || "Your Business", location: cityRaw });

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            AI/Search Visibility Check
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Here is what Google and AI can understand about {artifact.businessName}.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-hero-subtext)]">
            {artifact.location}
            {email ? (
              <>
                {" "}
                - Built for <span className="font-semibold text-[var(--color-hero-text)]">{email}</span>
              </>
            ) : null}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href={GET_FOUND_URL}
              className="rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
            >
              Start Get Found
            </Link>
            <Link
              href={BOOK_URL}
              className="rounded-xl border border-[var(--color-hero-border)] px-5 py-3 text-sm font-semibold text-[var(--color-hero-subtext)] transition hover:bg-white/5"
            >
              Ask a question
            </Link>
          </div>
          {runId ? <ReportTiming runId={runId} email={email} /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          <ScoreSummary artifact={artifact} />
          <QuickRead artifact={artifact} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                What we checked
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-body)]">
                The five public signals that matter first
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
              This is a short free check. The full baseline and before/after proof unlock after signup.
            </p>
          </div>
          <div className="grid gap-3">
            {artifact.signals.map((signal) => (
              <SignalRow key={signal.signal} signal={signal} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <LockedRoadmap artifact={artifact} />
          <NextStep />
        </div>
      </section>
    </main>
  );
}

function ScoreSummary({ artifact }: { artifact: ProspectVisibilityArtifact }) {
  const gap =
    artifact.topCompetitorScore !== null
      ? artifact.topCompetitorScore - artifact.score
      : null;

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Visibility score
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <p className={`text-7xl font-bold leading-none ${scoreColor(artifact.score)}`}>
          {artifact.score}
          <span className="text-xl font-normal text-[var(--color-text-muted)]">/100</span>
        </p>
        <p className="max-w-xs pb-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {gap !== null && gap > 0
            ? `${gap} points behind the top visible competitor.`
            : "Competitor benchmark is still being verified."}
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SmallScore
          label="Local competitor benchmark"
          value={artifact.competitorAverageScore !== null ? `${artifact.competitorAverageScore}/100` : "Pending"}
        />
        <SmallScore
          label={artifact.topCompetitorName}
          value={artifact.topCompetitorScore !== null ? `${artifact.topCompetitorScore}/100` : "Pending"}
        />
      </div>
    </article>
  );
}

function QuickRead({ artifact }: { artifact: ProspectVisibilityArtifact }) {
  return (
    <article className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
        Quick read
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--color-text-body)]">
        {artifact.primaryGap}
      </h2>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
        {artifact.quickRead}
      </p>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
        These are fixable foundation issues, not a months-long SEO campaign. Get Found cleans up the signals first.
      </p>
    </article>
  );
}

function SignalRow({ signal }: { signal: ProspectVisibilitySignal }) {
  return (
    <article className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4 md:grid-cols-[1fr_110px_1fr_150px] md:items-center">
      <div>
        <h3 className="font-semibold text-[var(--color-text-body)]">{signal.signal}</h3>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{signal.why}</p>
      </div>
      <StatusBadge status={signal.status} />
      <p className="text-sm leading-6 text-[var(--color-text-muted)]">{signal.competitorClue}</p>
      <p className="rounded-lg border border-slate-300 bg-white/50 px-3 py-2 text-xs font-semibold text-[var(--color-text-body)]">
        {signal.unlock}
      </p>
    </article>
  );
}

function LockedRoadmap({ artifact }: { artifact: ProspectVisibilityArtifact }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Locked until signup
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--color-text-body)]">
        What Get Found unlocks first
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {artifact.lockedNow.map((item) => (
          <LockedCard key={item} label={item} tag="Get Found" />
        ))}
      </div>
      <div className="mt-5 border-t border-[var(--color-border)] pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Available with Stay Found after the foundation is clean
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {artifact.lockedLater.map((item) => (
            <LockedCard key={item} label={item} tag="Stay Found" muted />
          ))}
        </div>
      </div>
    </article>
  );
}

function NextStep() {
  return (
    <article className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Recommended next step
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[var(--color-text-body)]">
        Start with Get Found.
      </h2>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
        We clean up the public signals Google and AI already look at, capture the review path, and show the before/after proof.
        Stay Found keeps the report current after the foundation is fixed.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={GET_FOUND_URL}
          className="rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
        >
          Start Get Found
        </Link>
        <Link
          href={BOOK_URL}
          className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-text-body)] transition hover:bg-[var(--color-bg-elevated)]"
        >
          Ask a question
        </Link>
      </div>
    </article>
  );
}

function SmallScore({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--color-text-body)]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusLabel }) {
  const classes = {
    Strong: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    Fair: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    Weak: "border-red-500/30 bg-red-500/10 text-red-700",
    Missing: "border-slate-400/40 bg-slate-200 text-slate-700",
  }[status];

  return (
    <span className={`inline-flex w-fit rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${classes}`}>
      {status}
    </span>
  );
}

function LockedCard({ label, tag, muted = false }: { label: string; tag: string; muted?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${muted ? "border-slate-200 bg-slate-100 text-slate-600" : "border-slate-300 bg-white text-slate-900"}`}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Locked - {tag}
      </p>
      <p className="mt-2 text-sm font-semibold">{label}</p>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 45) return "text-amber-600";
  return "text-red-600";
}
