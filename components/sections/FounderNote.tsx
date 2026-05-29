"use client";

import Link from "next/link";
import { useState } from "react";

const SHORT_QUOTE = "I've built and sold companies, and I kept watching great local businesses stay invisible while weaker competitors got picked. Getting picked by AI isn't one fix — it's dozens of signals it cross-checks before it trusts you.";
const FULL_QUOTE = "I built GetMeFound to engineer all of them for you. Done for you, no contracts, no dashboards.";

export function FounderNote() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      aria-label="Why I built this"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-10 md:py-12"
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Mobile: photo centered top; Desktop: side-by-side */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
          {/* Photo */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-[var(--color-border)] md:h-20 md:w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/mike.jpg"
                alt="Mike Egidio, founder of GetMeFound"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[var(--color-text-body)]">Mike Egidio</p>
              <p className="text-xs text-[var(--color-text-muted)]">Founder, GetMeFound</p>
            </div>
          </div>

          {/* Quote */}
          <div className="min-w-0 text-center md:text-left">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Why I built this
            </p>
            <blockquote className="text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
              &ldquo;{SHORT_QUOTE}
              {expanded && (
                <span> {FULL_QUOTE}</span>
              )}
              &rdquo;
            </blockquote>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              {!expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-sm font-semibold text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors"
                >
                  Full story →
                </button>
              )}
              {expanded && (
                <Link
                  href="/about"
                  className="text-sm font-semibold text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors"
                >
                  Full story →
                </Link>
              )}

              <div className="flex gap-3">
                {[
                  { stat: "15+ yrs", label: "building businesses" },
                  { stat: "1 sold", label: "EdTech company" },
                ].map(({ stat, label }) => (
                  <div
                    key={stat}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-1.5 text-center"
                  >
                    <p className="text-xs font-bold text-[var(--color-text-body)]">{stat}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]/70">
              Everything we do follows{" "}
              <a
                href="https://support.google.com/business/answer/7091"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Google&apos;s own published guidance
              </a>{" "}
              for local visibility — not guesswork. We only touch what Google and AI systems say matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
