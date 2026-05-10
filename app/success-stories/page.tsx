import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Real outcomes from businesses we support.",
  robots: { index: false, follow: false },
};

const upcomingStories = [
  {
    title: "Local Service Business",
    result: "Review growth in first 30 days",
    focus: "Request flow, reply cadence, review velocity",
  },
  {
    title: "Healthcare Practice",
    result: "Higher review consistency week over week",
    focus: "Ask timing, compliance-safe messaging, follow-up",
  },
  {
    title: "Home Services Team",
    result: "Improved map visibility coverage",
    focus: "Review volume plus response quality",
  },
];

const whatGetsPublished = [
  "Short video testimonial from the owner or manager",
  "Before/after review metrics with exact timeframe",
  "A simple breakdown of what changed and why it worked",
];

export default function SuccessStoriesPage() {
  return (
    <main className="bg-[var(--color-bg-page)]">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-14 md:pt-24 md:pb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Success Stories
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[var(--color-text-body)] md:text-5xl">
          Real outcomes from businesses we support.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
          This page is where we publish verified client stories with video, timelines, and measurable
          outcomes.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8 md:pb-12">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Review Growth Success Stories (In Progress)
          </p>
          <p className="mb-6 text-[var(--color-text-body)]">
            We are currently running a limited pilot with a small group of businesses. As outcomes
            come in, we will publish:
          </p>
          <ul className="space-y-2 text-[var(--color-text-body)]">
            {whatGetsPublished.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-[var(--color-accent)]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 md:pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {upcomingStories.map((story) => (
            <article
              key={story.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
            >
              <div className="mb-4 aspect-video w-full rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-page)]" />
              <h2 className="mb-2 text-xl font-bold text-[var(--color-text-body)]">{story.title}</h2>
              <p className="mb-2 text-sm font-semibold text-[var(--color-accent)]">{story.result}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{story.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <div className="rounded-2xl bg-[var(--color-bg-dark-card)] p-8 text-[var(--color-hero-text)] md:p-10">
          <h3 className="text-2xl font-bold md:text-3xl">Want to be considered for this pilot?</h3>
          <p className="mt-3 max-w-2xl text-[var(--color-hero-subtext)]">
            We are onboarding a small number of businesses and documenting outcomes with permission.
          </p>
          <div className="mt-6">
            <Link
              href="/contact?topic=review-growth-pilot"
              className="inline-flex items-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Apply for pilot access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

