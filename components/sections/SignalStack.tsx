"use client";

import { motion } from "framer-motion";

const SIGNALS = [
  { label: "Entity consistency", detail: "Your business name, address, phone, and category match exactly across Google, Apple Maps, Bing, Yelp, and 50+ directories." },
  { label: "NAP feeding the knowledge graph", detail: "Google's knowledge graph builds its understanding of your business from consistent Name / Address / Phone data. Inconsistencies make it distrust the entity." },
  { label: "Structured data AI can parse", detail: "LocalBusiness schema markup on your website tells AI crawlers exactly who you are, what you do, and where you serve — in machine-readable format." },
  { label: "Google Business Profile completeness", detail: "Category selection, service areas, opening hours, attributes, Q&A, and photos are all signals AI uses for disambiguation and trust scoring." },
  { label: "Review velocity and recency", detail: "AI systems weight recent review activity heavily. A business with steady new reviews signals active, trustworthy operation — stale reviews signal risk." },
  { label: "Website ↔ profile fact alignment", detail: "AI cross-checks your website against your Google listing. Mismatches in hours, address, services, or description reduce trust on both." },
  { label: "Cross-web citation authority", detail: "The number, quality, and consistency of citations across directories, news, and third-party sites contributes to how confidently AI identifies and recommends you." },
  { label: "Review sentiment signal stack", detail: "Not just star ratings — AI reads review content for service-specific keyword clusters. Specific reviews mentioning your services outperform generic praise." },
  { label: "AI-answer citation readiness", detail: "When Google AI, ChatGPT, or Gemini generate a local recommendation, they prefer businesses with structured, verifiable, machine-readable proof. We build that." },
  { label: "Profile activity signals", detail: "Regular posts, photo updates, Q&A responses, and profile edits signal an active business. AI search systems infer reliability from activity recency." },
  { label: "Reply voice and brand consistency", detail: "Consistent, professional responses to reviews — especially negative ones — contribute to the trust picture AI reads before recommending you." },
  { label: "Business category and attribute alignment", detail: "Selecting the right primary and secondary categories, plus all relevant attributes (parking, payment methods, accessibility), improves disambiguation accuracy." },
  { label: "GEO / AEO signal readiness", detail: "Generative Engine Optimization and Answer Engine Optimization signals: AI systems increasingly pull from structured entity data and authoritative, unambiguous business profiles when generating local answers." },
];

export function SignalStack() {
  return (
    <section
      aria-labelledby="ss-title"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Under the hood
          </p>
          <h2 id="ss-title" className="text-3xl font-bold leading-tight text-[var(--color-text-body)] md:text-4xl">
            Your Signal Stack
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
            These are the signals Google AI, ChatGPT, Claude, and Gemini cross-check before they
            trust — and recommend — your business. Miss the consistency between any of them and AI
            discounts all of it.{" "}
            <span className="font-semibold text-[var(--color-text-body)]">
              Knowing which signals matter, in what order, is the work.
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((signal, i) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4), ease: "easeOut" }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4"
            >
              <div className="mb-1.5 flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                <p className="text-sm font-semibold leading-snug text-[var(--color-text-body)]">
                  {signal.label}
                </p>
              </div>
              <p className="pl-3.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {signal.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] p-5 md:p-6"
        >
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-body)]">
              This is what GetMeFound&apos;s Visibility Engine does in 48 hours
            </span>{" "}
            — map every signal listed above for your specific business, fix the ones that are wrong
            or missing, and start building the ones AI uses to decide who to recommend. No other
            local marketing service runs all of these as a system.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
