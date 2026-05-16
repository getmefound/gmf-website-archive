import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Outsource Hub runs growth services for local businesses on Hub360ai, our white-labeled ops platform. Built by people who've spent 15+ years explaining technology to non-technical buyers.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

// Fraunces serif applied only to display headlines + signature pieces
const serif = "[font-family:var(--font-fraunces)]";

const companyFields: { k: string; v: string }[] = [
  { k: "what", v: "AOH runs reviews, search visibility, voice answering, and outreach for local businesses" },
  { k: "tools", v: "Automation for the busywork — runs while your team stays small" },
  { k: "for", v: "Local SMB owners running their business" },
  { k: "model", v: "Done-for-you · monthly · cancel anytime" },
  { k: "platform", v: "Hub360ai — our white-labeled ops platform" },
  { k: "won't", v: "Teach you to use the tools yourself" },
];

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  initials: string;
};

const teamRest: TeamMember[] = [
  {
    name: "Kip Leathers",
    role: "Business Development Specialist",
    focus: "Owns outbound. Finds the right prospects, opens the conversations.",
    initials: "KL",
  },
  {
    name: "Teri Egidio",
    role: "Sales Manager",
    focus: "Manages the inbound pipeline and client onboarding.",
    initials: "TE",
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
            HERO — distilled mission. No status pills. Research-led.
            Pattern: Anthropic / OpenAI / Linear About headers.
            Mission line + one supporting sentence. Nothing else.
            ═══════════════════════════════════════════════════════ */}
        <section aria-label="About AI Outsource Hub" className="bg-[var(--color-hero-bg)] text-white">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-green-400 tracking-wider">§00</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                about — aioutsourcehub.com
              </span>
            </div>

            <h1
              className={`${serif} text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-5 max-w-5xl`}
              style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
            >
              You want more <span className="text-green-400">customers</span>.
            </h1>

            <p className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mb-5">
              We get you found. We bring you the rest. You run the business.
            </p>

            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
              Most local owners don&apos;t lose to better businesses. They lose to faster ones who showed up first in search. We fix that — and a couple things more.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §01 — THE FOUNDER (small photo LEFT, condensed bio RIGHT)
            Photo modest size. Bio not a long letter — 3 lines.
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <SectionMarker num="01" label="The founder" />

            <div className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-8 md:gap-14 items-start">
              {/* Modest photo, square, slight rounded */}
              <div className="w-40 md:w-56">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="/team/mike.jpg"
                    alt="Mike Egidio, founder of AI Outsource Hub"
                    fill
                    sizes="(min-width: 768px) 14rem, 10rem"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Founder · Mike Egidio
                </p>
                <a
                  href="https://www.linkedin.com/in/mikeegidio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mike Egidio on LinkedIn"
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              </div>

              {/* Condensed serif intro beside the image — not a paragraph block in mid-page */}
              <div>
                <h2
                  className={`${serif} text-3xl md:text-5xl leading-[1.05] tracking-tight mb-6 max-w-2xl`}
                  style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
                >
                  He&apos;s been on your side of the desk for 15 years.
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                  Mike is a serial entrepreneur who&apos;s built and sold companies — including
                  an EdTech company that helped schools without in-house tech teams. He&apos;s run
                  every part of the work himself: sales, marketing, support, IT. Every pain point
                  owners run into — missed leads, busywork, lost hours — he&apos;s solved himself.
                  AOH is the same playbook, packaged to help SMBs like yours.
                </p>

                {/* 3 founder stats — replaces the niche chip strip */}
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-2xl">
                  {[
                    { value: "15+", unit: "years", label: "running businesses" },
                    { value: "1", unit: "sold", label: "EdTech company, schools without IT" },
                    { value: "4", unit: "hats", label: "sales · marketing · IT · support" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-3"
                    >
                      <p className="font-mono text-2xl md:text-3xl font-bold text-[var(--color-text-body)] leading-none">
                        {s.value}{" "}
                        <span className="text-xs font-medium text-[var(--color-text-muted)] tracking-wider uppercase">
                          {s.unit}
                        </span>
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] leading-snug">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §02 — WHAT AOH IS (data-fields only, no market claims)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <SectionMarker num="02" label="The company" />

            <h2
              className={`${serif} text-3xl md:text-5xl tracking-tight mb-6 max-w-3xl`}
              style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
            >
              What AOH is.
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-stretch">
              <dl className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] overflow-hidden">
                {companyFields.map((row) => (
                  <div
                    key={row.k}
                    className="grid grid-cols-[6rem_1fr] md:grid-cols-[8rem_1fr] gap-3 md:gap-6 px-4 md:px-6 py-3.5"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] pt-0.5">
                      {row.k}
                    </dt>
                    <dd className="text-sm md:text-base text-[var(--color-text-body)] leading-snug">
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Hub360ai callout — logo prominent, matches left dl height */}
              <aside className="h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-7 md:p-8 flex flex-col">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-6">
                  Our platform
                </p>
                <Image
                  src="/hub360ai/hub360ai-horizontal-light.svg"
                  alt="Hub360ai"
                  width={320}
                  height={80}
                  className="h-16 md:h-20 w-auto mb-6"
                />
                <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
                  Hub360ai is our private platform for running every AOH service in one place.
                  You almost never log in — results show up on your phone, in your inbox, on your
                  calendar.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §03 — WHY NOW (market-shift line lives here, NOT in §02)
            ═══════════════════════════════════════════════════════ */}
        <section className="bg-[var(--color-hero-bg)] text-white">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-green-400 tracking-wider">§03</span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                Why now
              </span>
            </div>

            <p
              className={`${serif} text-2xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] max-w-5xl`}
              style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
            >
              The way customers find local businesses just{" "}
              <span className="text-green-400">changed</span>. Most are{" "}
              <span className="text-amber-300">completely invisible</span> across the new channels.
            </p>

            <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-3xl">
              <span className="font-bold text-white">80% of your future customers find you by searching.</span> We make sure they find YOU — Google, Maps, ChatGPT, Claude, AI Overviews — so the right name comes up first.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
              {["Google", "Maps", "ChatGPT", "AI Overviews", "Claude"].map((c) => (
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
            §04 — TEAM (Kip + Teri only; Mike is §01)
            (Principles section removed per spec)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <SectionMarker num="04" label="The rest of the team" />

            <h2
              className={`${serif} text-3xl md:text-5xl tracking-tight mb-6`}
              style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
            >
              Who else runs it.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamRest.map((m) => (
                <article
                  key={m.name}
                  className="grid grid-cols-[8rem_1fr] gap-5 rounded-xl bg-[var(--color-bg-page)] border border-[var(--color-border)] p-5 md:p-6"
                >
                  <div className="aspect-square w-32 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="text-3xl font-bold text-[var(--color-text-muted)]/40"
                    >
                      {m.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
                      {m.role}
                    </p>
                    <h3 className="text-xl font-bold text-[var(--color-text-body)] mb-3">
                      {m.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {m.focus}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            §05 — CONTACT CTA (linked out to /contact, no embedded form)
            ═══════════════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <SectionMarker num="05" label="Got a question" />

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2
                className={`${serif} text-3xl md:text-5xl tracking-tight max-w-2xl`}
                style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
              >
                Easiest way to reach us is to just write.
              </h2>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-6 py-3 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
              >
                Contact us
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* OUTRO */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-10 md:py-14 text-center">
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
