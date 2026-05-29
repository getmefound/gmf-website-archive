"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    id: "map",
    number: "01",
    label: "Map",
    headline: "We map every signal AI reads about you.",
    body: "Google AI, ChatGPT, Claude, and Gemini each crawl a different mix of your Google listing, structured data, directories, website, and reviews before they decide whether to trust — and recommend — your business. We start by reading exactly what they see.",
    accent: "text-amber-400",
    border: "#f59e0b",
    bg: "bg-[#1c1f0e]",
    iconPath: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z",
  },
  {
    id: "align",
    number: "02",
    label: "Align",
    headline: "We fix the conflicts that make AI distrust you.",
    body: "A business name spelled three ways across directories, hours that don't match, a website describing different services than the Google listing — AI reads every inconsistency as a trust signal against you. We resolve every conflict in your Signal Stack so AI sees one clear, credible story.",
    accent: "text-[var(--color-accent)]",
    border: "var(--color-accent)",
    bg: "bg-[#0f1e18]",
    iconPath: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    id: "amplify",
    number: "03",
    label: "Amplify",
    headline: "We build the signals AI uses to pick you.",
    body: "Verified entity consistency across the web, review velocity and recency, machine-readable structured data, and cross-platform business fact alignment — these are the signals that tip AI from \"found\" to \"recommended.\" We build and maintain them continuously.",
    accent: "text-emerald-400",
    border: "#10b981",
    bg: "bg-[#0e1e1a]",
    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

export function VisibilityEngine() {
  return (
    <section
      aria-labelledby="ve-title"
      className="bg-[var(--color-hero-bg)] py-12 text-[var(--color-hero-text)] md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            How it works
          </p>
          <h2 id="ve-title" className="text-3xl font-bold leading-tight md:text-4xl">
            The Visibility Engine:{" "}
            <span className="text-[var(--color-accent)]">Map → Align → Amplify</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-hero-subtext)]/75 md:text-lg">
            Getting picked by AI isn&apos;t one fix — it&apos;s dozens of interdependent signals
            that Google AI, ChatGPT, Claude, and Gemini cross-check before they trust you. We
            engineer all of them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              className={`relative flex flex-col overflow-hidden rounded-2xl ${step.bg} p-6 md:p-7`}
            >
              {/* Top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: step.border }}
              />

              {/* Step number + icon row */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${step.accent}`}>
                    {step.number}
                  </span>
                  <span className={`text-xl font-black ${step.accent}`}>{step.label}</span>
                </div>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-6 w-6 shrink-0 ${step.accent}`}
                >
                  <path d={step.iconPath} />
                </svg>
              </div>

              <h3 className="mb-3 text-base font-bold leading-snug text-white md:text-lg">
                {step.headline}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 text-center text-sm text-[var(--color-hero-subtext)]/50"
        >
          Everything is run through our Visibility Engine — not a checklist, a system.
        </motion.p>
      </div>
    </section>
  );
}
