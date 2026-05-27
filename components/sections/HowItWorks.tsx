"use client";

import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "We check what AI sees",
    body: "We review your Google Business listing, your website, and every directory where your business appears. We see exactly what Google, ChatGPT, and Claude see when someone searches for your type of business — and what’s missing or wrong.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    accentColor: "text-amber-400",
    borderColor: "border-l-amber-400",
    bgGlow: "bg-amber-400/5",
    iconBg: "bg-amber-400/10 ring-amber-400/25",
    numberBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  },
  {
    number: "02",
    title: "We fix what’s keeping you invisible",
    body: "We correct your Google listing — hours, services, photos, description — and make your website match exactly. We submit your business to the directories AI cross-checks so your information is consistent everywhere. We also set up your first review requests to past customers.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    accentColor: "text-accent",
    borderColor: "border-l-[var(--color-accent)]",
    bgGlow: "bg-accent/5",
    iconBg: "bg-accent/10 ring-accent/25",
    numberBg: "bg-accent/15 border-accent/30 text-accent",
  },
  {
    number: "03",
    title: "You see the difference",
    body: "Within 48 hours you get a before/after report showing how visible you were and how visible you are now. You see how you compare to local competitors and what’s worth improving next.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    accentColor: "text-emerald-400",
    borderColor: "border-l-emerald-400",
    bgGlow: "bg-emerald-400/5",
    iconBg: "bg-emerald-400/10 ring-emerald-400/25",
    numberBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  },
] as const;

const PILLS = ["No contract", "No tech skills needed", "We handle everything"] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-title"
      className="scroll-mt-20 border-y border-border bg-(--color-bg-page) py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:items-start md:gap-16">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
              Get Found / $149
            </p>
            <h2
              id="hiw-title"
              className="mt-3 text-3xl font-bold leading-tight text-text-body md:text-4xl"
            >
              Done for you.
              <br />
              Done in 48 hours.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-text-muted">
              We check what Google and AI see when someone searches for your type of business. Then we fix everything that&apos;s holding you back.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-(--color-bg-elevated) px-3 py-1 text-xs font-medium text-text-muted"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3 w-3 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            <Link
              href="/checkout/get-found-refresh"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-(--color-accent-text) transition hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-lg hover:shadow-(--color-accent)/25"
            >
              Get Found for $149
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div
              aria-hidden="true"
              className="absolute left-[23px] top-14 h-[calc(100%-3.5rem)] w-px"
              style={{
                background: "linear-gradient(to bottom, rgb(251 191 36 / 0.3), var(--color-accent) 50%, rgb(52 211 153 / 0.3))",
              }}
            />

            <div className="space-y-5">
              {STEPS.map((step) => (
                <div key={step.number} className="relative flex gap-5 group">
                  {/* Step number circle */}
                  <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-bold ${step.numberBg} transition-transform group-hover:scale-110`}>
                    {step.number}
                  </div>

                  {/* Card */}
                  <div className={`min-w-0 flex-1 rounded-xl border border-border border-l-[3px] ${step.borderColor} ${step.bgGlow} px-6 py-5 shadow-xl shadow-slate-950/5 transition-all group-hover:shadow-2xl group-hover:-translate-y-0.5`}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${step.iconBg} ring-1 ${step.accentColor}`}>
                        {step.icon}
                      </div>
                      <p className="text-lg font-bold leading-snug text-text-body pt-1">
                        {step.title}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted pl-12">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
