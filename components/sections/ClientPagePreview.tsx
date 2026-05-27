import { Reveal } from "@/components/Reveal";

function MockClientPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1a2332] p-5 shadow-xl shadow-black/30 text-sm">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-0.5">Your business</p>
          <p className="text-base font-bold text-white">Lakeside Family Dentistry</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="rounded-full bg-green-500/15 border border-green-500/25 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-green-400">
            Get Found
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Active
          </span>
        </div>
      </div>

      {/* What we did */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
          What we did this week
        </p>
        <div className="space-y-1.5">
          {[
            "Google profile cleaned up and verified",
            "Website facts synced to listing",
            "First review requests sent — 12 customers",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-white/65 text-xs">
              <span className="text-green-400 flex-shrink-0 mt-px">&#10003;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="my-3 border-t border-white/[0.07]" />

      {/* Reviews */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
          Reviews this month
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Requests sent", value: "12" },
            { label: "New reviews",   value: "4"  },
            { label: "Rating",        value: "4.8★" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] px-3 py-2.5 text-center">
              <p className="text-base font-bold text-white">{value}</p>
              <p className="font-mono leading-tight mt-0.5 text-white/35" style={{fontSize:"9px"}}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-3 border-t border-white/[0.07]" />

      {/* Waiting on you */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
          Waiting on you
        </p>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="text-white/20">&#8212;</span>
          <span>Nothing right now</span>
        </div>
      </div>

      <div className="my-3 border-t border-white/[0.07]" />

      {/* Latest proof */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
          Latest proof
        </p>
        <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.07] px-3 py-2.5">
          <div>
            <p className="text-xs font-semibold text-white">Before / After Report</p>
            <p className="font-mono text-white/35 mt-0.5" style={{fontSize:"10px"}}>May 2026 &middot; Score: 34 &#8594; 81</p>
          </div>
          <span className="font-semibold text-[var(--color-accent)]" style={{fontSize:"10px"}}>View &#8594;</span>
        </div>
      </div>

      <div className="my-3 border-t border-white/[0.07]" />

      {/* Locked upsells */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
          <span className="text-white/20" style={{fontSize:"11px"}}>&#128274;</span>
          <p className="text-white/30" style={{fontSize:"11px"}}>
            Monthly review reports + visibility recap &mdash;{" "}
            <span className="text-amber-400/60">Stay Found</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
          <span className="text-white/20" style={{fontSize:"11px"}}>&#128274;</span>
          <p className="text-white/30" style={{fontSize:"11px"}}>
            Google AI call readiness &mdash;{" "}
            <span className="text-sky-400/60">Always Ready</span>
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
      style={{borderTopColor:"var(--color-border)"}}
      className="border-t py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          <Reveal delay={0.05}>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                After signup
              </p>
              <h2
                id="client-page-title"
                className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-[var(--color-text-body)]"
              >
                Your private client page. No dashboard to manage.
              </h2>
              <p className="text-base md:text-lg leading-relaxed mb-8 text-[var(--color-text-muted)]">
                Every client gets a simple private page for their business. You can see what we
                are doing, what is finished, what we still need from you, and the proof behind
                every update &mdash; without logging into Google, checking your listing, or
                learning another tool.
              </p>

              <div className="space-y-4">

                <div className="rounded-xl border-l-2 border-l-green-500 border pl-4 pr-4 py-4"
                  style={{borderColor:"var(--color-border)",backgroundColor:"var(--color-bg-elevated)"}}>
                  <p className="rounded-full inline-block px-2.5 py-0.5 font-mono font-bold uppercase tracking-wider mb-2 bg-green-500/10 text-green-400 border border-green-500/20"
                    style={{fontSize:"10px"}}>
                    Get Found
                  </p>
                  <ul className="space-y-1">
                    {["Baseline visibility check","Before/after proof snapshot","Google profile cleanup status"].map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
                        <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">&#8594;</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border-l-2 border-l-amber-400 border pl-4 pr-4 py-4"
                  style={{borderColor:"var(--color-border)",backgroundColor:"var(--color-bg-elevated)"}}>
                  <p className="rounded-full inline-block px-2.5 py-0.5 font-mono font-bold uppercase tracking-wider mb-2 bg-amber-400/10 text-amber-400 border border-amber-400/20"
                    style={{fontSize:"10px"}}>
                    Stay Found
                  </p>
                  <ul className="space-y-1">
                    {["Monthly visibility report","Review requests sent and results","Google profile freshness checks"].map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
                        <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">&#8594;</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border-l-2 border-l-sky-400 border pl-4 pr-4 py-4"
                  style={{borderColor:"var(--color-border)",backgroundColor:"var(--color-bg-elevated)"}}>
                  <p className="rounded-full inline-block px-2.5 py-0.5 font-mono font-bold uppercase tracking-wider mb-2 bg-sky-400/10 text-sky-400 border border-sky-400/20"
                    style={{fontSize:"10px"}}>
                    Always Ready
                  </p>
                  <ul className="space-y-1">
                    {["AI search visibility checks","Competitor movement notes","Google AI call readiness status"].map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
                        <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">&#8594;</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              <p className="mt-6 text-xs leading-relaxed text-[var(--color-text-muted)]">
                You can upload customer lists, approve changes, and view reports without learning
                another marketing tool. We do the work. Your page shows the proof.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-32">
              <MockClientPage />
              <p className="mt-3 text-center font-mono text-[var(--color-text-muted)]" style={{fontSize:"11px"}}>
                Representative view &mdash; your business, plan, and activity
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
