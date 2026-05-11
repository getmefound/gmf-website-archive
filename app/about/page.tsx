import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Outsource Hub runs the AI for local businesses. Built by people who've spent 15+ years explaining technology to non-technical buyers. No contracts. Free reports.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

type Tile = { eyebrow: string; title: string; body: string; note?: string };

const patternTiles: Tile[] = [
  {
    eyebrow: "Pattern",
    title: "Same job, new stack.",
    body: "For fifteen years we sold and ran technology for schools that didn't have an IT team. Translate, install, operate. The buyers weren't engineers — they were people trying to do their jobs.",
    note: "// EdTech business, built and sold.",
  },
  {
    eyebrow: "Recognition",
    title: "AI hit the same gap.",
    body: "Local businesses are now being told they need to \"use AI.\" Most don't have time to learn another platform or hire someone to run it. The tools are getting more useful. The gap is widening.",
    note: "// Same shape. Different decade.",
  },
  {
    eyebrow: "Approach",
    title: "We operate. You don't.",
    body: "AOH is the layer between local businesses and the AI tools reshaping how customers find them. Reviews, AI visibility, voice, content, leads. You get the outcome. We do the work.",
    note: "// Service business, not SaaS.",
  },
];

const principles = [
  {
    title: "Free report first",
    body: "Every client gets a free audit before paying a dollar. Trust comes before invoices.",
  },
  {
    title: "No contracts",
    body: "Cancel anytime. We keep you by doing good work or not at all.",
  },
  {
    title: "Honest timelines",
    body: "Reviews in 48 hours. Rankings move in 60–90 days. No inflated promises.",
  },
  {
    title: "Less than 10 min of your time",
    body: "Setup once. After that, hands-off. You run your business.",
  },
];

type TeamMember = {
  name: string;
  role: string;
  niches: string;
  photo?: string;
  initials: string;
  size: "large" | "small";
};

const team: TeamMember[] = [
  {
    name: "Mike Egidio",
    role: "Founder",
    niches: "Pet groomers · funeral homes · movers · marketing consultants",
    photo: "/team/mike.jpg",
    initials: "ME",
    size: "large",
  },
  {
    name: "Kip Leathers",
    role: "Co-founder · Business Development",
    niches: "Vets · senior living · auto repair · B2B",
    initials: "KL",
    size: "small",
  },
  {
    name: "Teri Egidio",
    role: "Outreach",
    niches: "Nursing homes",
    initials: "TE",
    size: "small",
  },
];

function SectionMarker({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="font-mono text-[11px] font-bold text-[var(--color-accent)] tracking-wider">
        §{num}
      </span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        {label}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col bg-[var(--color-bg-page)] text-[var(--color-text-body)] focus:outline-none"
      >
        {/* ═══════════════════════════════════════════════════════
            HERO — bold sans display, doc header, no portrait
            ═══════════════════════════════════════════════════════ */}
        <section aria-label="About AI Outsource Hub" className="bg-gray-950 text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-10 flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-green-400 tracking-wider">
                §00
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                about — aioutsourcehub.com
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8 max-w-5xl">
              We run the AI.
              <br />
              <span className="text-green-400">You run your business.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-end">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
                A done-for-you AI services hub for local businesses. Built by people who&apos;ve been
                explaining technology to non-technical buyers for fifteen years.
              </p>

              <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider">
                <span className="rounded-full border border-green-400/40 bg-green-400/10 px-2.5 py-1 text-green-400">
                  Founded 2026
                </span>
                <span className="rounded-full border border-white/20 px-2.5 py-1 text-white/70">
                  3 operators
                </span>
                <span className="rounded-full border border-white/20 px-2.5 py-1 text-white/70">
                  8 niches
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §01 — THE PATTERN (3 tiles, side-by-side, no prose-column)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionMarker num="01" label="Why AOH exists" />

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 max-w-3xl">
              We&apos;ve seen this movie before.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {patternTiles.map((t, i) => (
                <div
                  key={t.title}
                  className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-6 md:p-7"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[var(--color-accent)] tracking-wider">
                      0{i + 1}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      {t.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-[var(--color-text-body)] leading-tight">
                    {t.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {t.body}
                  </p>
                  {t.note && (
                    <p className="font-mono text-[11px] text-[var(--color-text-muted)]/60 border-t border-[var(--color-border)] pt-3">
                      {t.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §02 — STATEMENT BAND (oversized callout, no centered prose)
            ═══════════════════════════════════════════════════════ */}
        <section className="bg-gray-950 text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-8 flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-green-400 tracking-wider">
                §02
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                The shift
              </span>
            </div>

            <p className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-5xl">
              The way customers find local businesses just{" "}
              <span className="text-green-400">changed</span>. Most are{" "}
              <span className="text-amber-300">completely invisible</span> across the new channels.
            </p>

            <div className="mt-10 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
              {["Google", "Maps", "ChatGPT", "Perplexity", "Google AI Overviews"].map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-white/[0.04] border border-white/10 px-2.5 py-1 text-white/70"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §03 — PRINCIPLES (left-rail big numerals, right body)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionMarker num="03" label="How we work" />

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 max-w-3xl">
              Four rules. No exceptions.
            </h2>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {principles.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[auto_1fr] gap-5 items-start">
                  <span className="font-mono text-4xl md:text-5xl font-bold text-[var(--color-accent)]/30 leading-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[var(--color-text-body)]">
                      {p.title}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §04 — TEAM (asymmetric: Mike 1.3fr, Kip 1fr, Teri 1fr)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionMarker num="04" label="Who runs it" />

            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Three operators. Eight niches.
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                Headcount · 3
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-6">
              {team.map((m) => (
                <article
                  key={m.name}
                  className="rounded-xl bg-[var(--color-bg-page)] border border-[var(--color-border)] overflow-hidden"
                >
                  <div
                    className={`relative ${
                      m.size === "large" ? "aspect-square" : "aspect-square"
                    } bg-[var(--color-bg-elevated)] flex items-center justify-center overflow-hidden`}
                  >
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={`${m.name}, ${m.role}`}
                        fill
                        sizes={m.size === "large" ? "(min-width: 768px) 26rem, 100vw" : "(min-width: 768px) 18rem, 100vw"}
                        className="object-cover"
                        priority={m.size === "large"}
                        quality={92}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="text-5xl font-bold text-[var(--color-text-muted)]/40"
                      >
                        {m.initials}
                      </span>
                    )}
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {m.role}
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-[var(--color-text-body)] ${
                        m.size === "large" ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                    >
                      {m.name}
                    </h3>
                    {m.size === "large" && (
                      <p className="mt-3 text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
                        Spent 15 years explaining technology to schools without in-house tech teams. Built and sold the EdTech company that came out of it. Now does the same job for local businesses — operating the AI so owners don&apos;t have to learn it.
                      </p>
                    )}
                    <p className="mt-4 font-mono text-[10px] text-[var(--color-text-muted)]/70 leading-relaxed">
                      // covers · {m.niches}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §05 — CONTACT
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionMarker num="05" label="Get in touch" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Easiest way to reach us is to just write.
                </h2>

                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="block text-xl md:text-2xl font-bold text-[var(--color-accent)] hover:underline underline-offset-4 break-all"
                >
                  support@aioutsourcehub.com
                </a>

                <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  Response · usually within a few hours
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FOOTER OUTRO — quiet link, no big CTA block
            ═══════════════════════════════════════════════════════ */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
            <p className="text-base text-[var(--color-text-muted)] mb-4">
              Or skip the email and run the free audit.
            </p>
            <Link
              href="/#calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-6 py-3 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
            >
              Get your free report
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
