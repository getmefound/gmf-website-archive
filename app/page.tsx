import type { Metadata } from "next";
import Link from "next/link";
import { HeroEmailForm } from "@/components/hero/HeroEmailForm";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SocialProof } from "@/components/sections/SocialProof";
import { CostCompare } from "@/components/sections/CostCompare";
import { WhyLess } from "@/components/sections/WhyLess";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ } from "@/components/sections/FAQ";
import { Reveal } from "@/components/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { ICON_PATHS } from "@/lib/icon-paths";
import { Sparkles } from "@/components/ui/Sparkles";
import { MockReviewPanel } from "@/components/ui/MockReviewPanel";
import { MockAIVisibilityPanel } from "@/components/ui/MockAIVisibilityPanel";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "AI Services for Local Businesses",
  description:
    "Done-for-you AI services for local businesses: review automation, AI visibility, voice agents, and content. Start with a free audit.",
  alternates: { canonical: "/" },
};

const tier1Products = [
  {
    name: "Review Automation",
    tagline: "More reviews. Higher stars. More customers.",
    description:
      "Every customer gets a review request automatically — SMS or email — within minutes of service. AI-drafted replies turn on when your standard plan begins.",
    price: "$1",
    cadence: "/day",
    priceSub: ["30-day intro", "Then $99/mo + $99 setup"],
    bullets: [
      "Live in 48 hours, no contract",
      "Google Business Profile audit + fix",
      "AI-drafted replies unlock at standard plan",
    ],
    href: "/pricing",
    cta: "Start at $1/day",
    ctaSub: "Free report first. No card needed.",
    iconPaths: ICON_PATHS.star,
    Mock: MockReviewPanel,
  },
  {
    name: "AI Visibility",
    tagline: "Get recommended by ChatGPT, Google AI, and Perplexity.",
    description:
      "25% of searches have moved to AI tools. We get your business named when customers ask for a recommendation.",
    price: "$3",
    cadence: "/day",
    priceSub: undefined as string[] | undefined,
    bullets: ["Free AI visibility audit", "Structured data + schema", "Ongoing optimization"],
    href: "/pricing",
    cta: "See pricing",
    ctaSub: "Free report first. No card needed.",
    iconPaths: ICON_PATHS.search,
    Mock: MockAIVisibilityPanel,
  },
];

const tier2Products = [
  {
    name: "Relay",
    tagline: "AI voice receptionist",
    description: "Multilingual AI receptionist that answers calls, books appointments, and handles inquiries 24/7 in 27+ languages.",
    href: "/relay",
    iconPaths: ICON_PATHS.phone,
  },
  {
    name: "Studio",
    tagline: "Done-for-you content",
    description: "AI-generated social posts, images, carousels, and campaigns — published on autopilot in your brand voice.",
    href: "/studio",
    iconPaths: ICON_PATHS.studio,
  },
  {
    name: "Hub360ai",
    tagline: "Custom AI agents",
    description: "Custom-built AI agents for owners — like the Business Owner Briefing, a daily AI digest of business performance.",
    href: "/contact",
    iconPaths: ICON_PATHS.dashboard,
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        <HeroEmailForm />

        <section className="pb-20 md:pb-28 bg-[var(--color-bg-page)] pt-16 md:pt-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                What we run for you
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                We grade your online presence. Then we fix it.
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                Reviews. Listings. AI search. Google ranking. Customers grade you across all of it — most owners only see one piece. We run all of it.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" /> Win more customers
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">Rank higher in Google. Get recommended by AI. Win the customer.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {tier1Products.map((p, i) => {
                const MockPanel = p.Mock;
                return (
                  <Reveal key={p.name} delay={i * 0.08}>
                    <div
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-dark-card)] ring-1 ring-[var(--color-hero-border)] transition-all hover:ring-[var(--color-accent)] hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <Spotlight className="flex h-full flex-col rounded-2xl">
                        <BackgroundBeams />

                        <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                          <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
                              <AnimatedIcon paths={p.iconPaths} size={22} />
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-[var(--color-hero-text)]">{p.price}</span>
                                <span className="text-base text-[var(--color-hero-subtext)]">{p.cadence}</span>
                              </div>
                              {p.priceSub && (
                                <div className="mt-2 space-y-1 text-right">
                                  {p.priceSub.map((line, idx) => (
                                    <p
                                      key={line}
                                      className={`font-mono leading-tight whitespace-nowrap ${
                                        idx === 0
                                          ? "text-[10px] uppercase tracking-wider text-[var(--color-accent)]/80"
                                          : "text-[11px] text-[var(--color-hero-subtext)]/75"
                                      }`}
                                    >
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-[var(--color-hero-text)] mb-2">
                            {p.name}
                          </h3>
                          <p className="text-base text-[var(--color-accent)] font-medium mb-4">
                            {p.tagline}
                          </p>
                          <p className="text-[var(--color-hero-subtext)] leading-relaxed mb-5 text-sm">
                            {p.description}
                          </p>

                          <div className="mb-6">
                            <MockPanel />
                          </div>

                          <ul className="mb-8 space-y-2">
                            {p.bullets.map((b) => (
                              <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-hero-subtext)]">
                                <span className="text-[var(--color-accent)] flex-shrink-0 mt-0.5">✓</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto">
                            <Link
                              href="/pricing"
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
                            >
                              {p.cta}
                              <span aria-hidden="true">→</span>
                            </Link>
                            <p className="mt-3 text-[11px] text-[var(--color-hero-subtext)]/70 leading-snug">
                              No audit yet?{" "}
                              <Link
                                href="/#calculator"
                                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-2"
                              >
                                Get it free first →
                              </Link>
                            </p>
                          </div>
                        </div>
                      </Spotlight>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Bundle CTA bar — between tier 1 cards and tier 2 */}
            <Reveal delay={0.24}>
              <Link
                href="/pricing"
                className="group relative mb-16 block overflow-hidden rounded-2xl ring-1 ring-[var(--color-accent)]/40 transition-all hover:ring-[var(--color-accent)] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--color-accent)]/20"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-bg-dark-card) 0%, #0E1E36 50%, var(--color-bg-dark-card) 100%)",
                }}
              >
                <Spotlight className="block" radius={500}>
                  {/* Pulsing accent glow top-left */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[var(--color-accent)]/15 blur-3xl"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
                  />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-6 md:p-7">
                    <div className="flex items-center gap-4">
                      {/* Animated star badge */}
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/40">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-2xl bg-[var(--color-accent)]/25 blur-md animate-pulse"
                        />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#2D6A4F"
                          className="relative drop-shadow-[0_0_6px_rgba(45,106,79,0.6)]"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            Most popular
                          </span>
                          <span className="rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
                            Save $49/mo
                          </span>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-[var(--color-hero-text)] leading-tight">
                          Bundle Reviews + AI Visibility for{" "}
                          <span className="text-[var(--color-accent)]">$149/month</span>
                        </p>
                        <p className="mt-1 text-xs md:text-sm text-[var(--color-hero-subtext)]/80">
                          Both products. One price. Same setup, same intro.
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center justify-center gap-2 self-stretch md:self-auto rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition-all group-hover:gap-3 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/30 whitespace-nowrap">
                      See the bundle
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Spotlight>
              </Link>
            </Reveal>

            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Save hours every week
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">We run the calls, content, and follow-up so you don't have to.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tier2Products.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.06}>
                  <Link
                    href={p.href}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-7 transition-all hover:border-[var(--color-accent)] hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Sparkles className="right-3 top-3 text-[var(--color-accent)]/70" count={4} />

                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20 transition-all group-hover:scale-105">
                      <AnimatedIcon paths={p.iconPaths} size={20} />
                    </div>

                    <h3 className="text-xl font-bold text-[var(--color-text-body)] mb-1">
                      {p.name}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-accent)] mb-3">
                      {p.tagline}
                    </p>
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-sm mb-6">
                      {p.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-body)] group-hover:gap-2.5 group-hover:text-[var(--color-accent)] transition-all">
                      Learn more
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <RevenueCalculator />

        <HowItWorks />

        <WhyLess />

        <CostCompare />

        <SocialProof />

        <FAQ />

        <FinalCta />
      </main>
    </>
  );
}
