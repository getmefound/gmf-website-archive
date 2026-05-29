// Preview route for the proposed VisibilityReport20 component.
// Accessible at /report/ai-visibility/demo (noindex — review only).
// Shows all three modes side by side with sample data.
import type { Metadata } from "next";
import { VisibilityReport20 } from "@/components/report/VisibilityReport20";
import { buildDemoSignals } from "@/lib/visibility-report-20";

export const metadata: Metadata = {
  title: "Visibility Report — Preview",
  robots: { index: false, follow: false },
};

export default function VisibilityReportDemoPage() {
  // Shared demo dataset — all red except a handful of signals
  const baselineSignals = buildDemoSignals({
    2:  { beforeStatus: "amber",  afterStatus: "green",  status: "green"  },
    4:  { beforeStatus: "amber",  afterStatus: "green",  status: "green"  },
    8:  { beforeStatus: "green",  afterStatus: "green",  status: "green"  },
    11: { beforeStatus: "green",  afterStatus: "green",  status: "green"  },
    13: { beforeStatus: "amber",  afterStatus: "green",  status: "green"  },
    16: { beforeStatus: "amber",  afterStatus: "green",  status: "green"  },
  });

  const monthlySignals = buildDemoSignals({
    2:  { status: "green",  beforeStatus: "amber", changedSinceLast: true  },
    4:  { status: "green",  beforeStatus: "green"                          },
    8:  { status: "green",  beforeStatus: "green"                          },
    11: { status: "green",  beforeStatus: "green"                          },
    13: { status: "green",  beforeStatus: "green"                          },
    16: { status: "green",  beforeStatus: "green"                          },
    19: { status: "amber",  beforeStatus: "green", changedSinceLast: true  },
  });

  return (
    <main className="bg-[var(--color-bg-page)] min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Page header */}
        <div className="mb-10 rounded-2xl border border-amber-300/40 bg-amber-50 p-5">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            Preview only — not final
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-body)]">
            Proposed: 20-Point AI Visibility Report
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            All three modes shown below using the same sample business. Compare with the
            current 5-signal report at{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">
              components/client/ClientReportCenter.tsx
            </code>
            .
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Files: <code className="font-mono">lib/visibility-report-20.ts</code> ·{" "}
            <code className="font-mono">components/report/VisibilityReport20.tsx</code>
          </p>
        </div>

        {/* Mode: baseline */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
              baseline
            </span>
            <p className="text-sm text-[var(--color-text-muted)]">
              Free check — shows current state + locked After column (teaser)
            </p>
          </div>
          <VisibilityReport20
            mode="baseline"
            signals={baselineSignals}
            businessName="Lakeside Family Dentistry"
            location="Hartford, CT"
            competitorGreens={13}
            competitorName="a top-visible dental practice nearby"
          />
        </section>

        <hr className="border-[var(--color-border)]" />

        {/* Mode: delivery */}
        <section className="my-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
              delivery
            </span>
            <p className="text-sm text-[var(--color-text-muted)]">
              Get Found deliverable — Before → After proof
            </p>
          </div>
          <VisibilityReport20
            mode="delivery"
            signals={baselineSignals}
            businessName="Lakeside Family Dentistry"
            location="Hartford, CT"
            periodLabel="Get Found — delivered June 2026"
            showCta={false}
          />
        </section>

        <hr className="border-[var(--color-border)]" />

        {/* Mode: monthly */}
        <section className="mt-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
              monthly
            </span>
            <p className="text-sm text-[var(--color-text-muted)]">
              Stay Found report — current state + what changed since last month
            </p>
          </div>
          <VisibilityReport20
            mode="monthly"
            signals={monthlySignals}
            businessName="Lakeside Family Dentistry"
            location="Hartford, CT"
            periodLabel="May 2026 monthly recap"
            showCta={false}
          />
        </section>

      </div>
    </main>
  );
}
