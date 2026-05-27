import { Reveal } from "@/components/Reveal";

const planUnlocks = [
  {
    plan: "Get Found",
    accent: "border-l-green-500",
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
    items: [
      "Baseline visibility check",
      "Before/after proof snapshot",
      "Google profile cleanup status",
    ],
  },
  {
    plan: "Stay Found",
    accent: "border-l-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    items: [
      "Monthly visibility report",
      "Review requests sent + results",
      "Google profile freshness checks",
    ],
  },
  {
    plan: "Always Ready",
    accent: "border-l-sky-400",
    badge: "bg-sky-400/10 text-sky-400 border border-sky-400/20",
    items: [
      "AI search visibility checks",
      "Competitor movement notes",
      "Approval-gated strategy actions",
    ],
  },
];

function MockClientPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1c28] p-5 text-sm shadow-2xl shadow-black/40 font-mono">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-0.5">
            Your business
          </p>
          <p className="text-base font-bold text-white font-sans">
            Lakeside Family Dentistry
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="rounded-full bg-green-500/15 border border-green-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
            Get Found
          </span>
          <span className="flex items-center gap-1 text-[10px] text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Active
          </span>
        </div>
      </div>

      {/* What's done */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
          What we did this week
        </p>
        <div className="space-y-1.5">
          {[
            "Google profile cleaned up and verified",
            "Website facts synced to listing",
            "First review requests sent to 12 past customers",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/70 font-sans text-xs">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="my-3 border-t border-white/8" />

      {/* Waiting on you */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
          Waiting on you
        </p>
        <div className="flex items-center gap-2 font-sans text-xs text-white/45">
          <span className="text-white/25">—</span>
          <span>Nothing right now</span>
        </div>
      </div>

      <div className="my-3 border-t border-white/8" />

      {/* Proof */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
          Latest proof
        </p>
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 font-sans">
          <div>
            <p className="text-xs font-semibold text-white">Before / After Report</p>
            <p className="text-[10px] text-white/40 mt-0.5">May 2026 · Score: 34 → 81</p>
          </div>
          <span className="text-[10px] text-[var(--color-accent)] font-semibold">View →</span>
        </div>
      </div>

      <div className="my-3 border-t border-white/8" />

      {/* Locked preview */}
      <div className="rounded-xl bg-white/[0.03] border border-white/8 px-3 py-2.5 font-sans">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25">🔒</span>
          <p className="text-[10px] text-white/30">
            Monthly reviews + visibility reports unlock with Stay Found
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClientPagePreview() {
  return (
    <section
      aria-labelledby="client-page-title"
      className="bg-[var(--color-bg-page)] py-14 md:py-20 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: copy */}
          <Reveal delay={0.05}>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                After signup
              </p>
              <h2
                id="client-page-title"
                className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] leading-tight mb-5"
              >
                Your private client page — no dashboard to manage.
              </h2>
              <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
                Every client gets a simple private page for their business. It shows what we are
                doing, what is finished, what we still need from you, and the proof behind every
                update. You never have to wonder what happened this month or what to do next.
              </p>

              <div className="space-y-4">
                {planUnlocks.map(({ plan, accent, badge, items }) => (
                  <div
                    key={plan}
                    className={`rounded-xl border-l-2 ${accent} bg-[var(--color-bg-elevated)] border border-[var(--color-border)] pl-4 pr-4 py-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge}`}>
                        {plan}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li key={item} className="text-sm text-[var(--color-text-muted)] flex gap-2">
                          <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs text-[var(--color-text-muted)] leading-relaxed">
                You can upload customer lists, approve changes, and view reports without learning
                another marketing tool. We do the work. Your page shows the proof.
              </p>
            </div>
          </Reveal>

          {/* Right: mockup */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-32">
              <MockClientPage />
              <p className="mt-3 text-center text-[11px] text-[var(--color-text-muted)]">
                Representative view — your business name, plan, and status
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
