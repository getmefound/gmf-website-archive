import type { Metadata } from "next";
import Link from "next/link";
import { AuditRequestForm } from "@/components/sections/AuditRequestForm";

export const metadata: Metadata = {
  title: "Get Found by Google's AI — GetMeFound",
  description:
    "Google's AI now picks one or two local businesses instead of ten results. GetMeFound engineers the signals that get you picked. Done in 48 hours, no contract.",
  alternates: { canonical: "/lp/get-found" },
};

const GOOGLE_CALLING_URL =
  "https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/";

// ─── Trust strip items ────────────────────────────────────────────────
const TRUST_ITEMS = [
  { label: "48 hours", sub: "from access to done" },
  { label: "No contract", sub: "one-time $149" },
  { label: "No tech skills", sub: "we handle everything" },
  { label: "Work guarantee", sub: "if it's not right, we fix it" },
];

// ─── Signal Stack items ───────────────────────────────────────────────
const SIGNALS = [
  "Your business facts match everywhere AI looks",
  "AI can read and understand your site",
  "How recent and frequent your reviews are",
  "Whether your profile is complete enough to trust",
  "Hours, services, and service area are unambiguous",
  "Whether you look active or abandoned",
  "Name, address, and phone agree across the web",
  "Whether AI assistants can cite you as the answer",
  "Photos and content AI uses in recommendations",
  "How you compare to cleaner, better-signalled competitors",
];

// ─── FAQ items ────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "What do I get for $149?",
    a: "AI crawlability + schema added so Google AI, ChatGPT, and Claude can read and trust your site. Your Google profile rebuilt for the signals AI checks first. Cross-web entity consistency fixed. Your review-velocity engine switched on. A before/after report scoring all 20 AI signals — delivered in 48 hours.",
  },
  {
    q: "Do you guarantee I'll be #1 on Google?",
    a: "No — and any provider who does is lying. We guarantee the work: every fix in your report is done correctly, on time. AI systems make their own decisions. What we can control is whether your signals give them every reason to pick you. See the full guarantee at getmefound.ai/guarantee.",
  },
  {
    q: "Will this break my email or website?",
    a: "No. We verify your email setup before touching anything — it stays completely separate from your website. For your website, we update content and add code in the background. We never change your hosting, domain configuration, or email.",
  },
  {
    q: "Is there a contract?",
    a: "Never. Get Found is a one-time payment. Monthly plans (Stay Found, Always Ready) are month-to-month, cancel anytime, no fee.",
  },
];

export default function LpGetFoundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-hero-bg)", color: "var(--color-hero-text)" }}>

      {/* ── MINIMAL HEADER ─────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--color-hero-border)" }} className="px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight" style={{ color: "var(--color-hero-text)" }}>
            GetMeFound
          </Link>
          <span className="rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ borderColor: "var(--color-hero-border)", color: "var(--color-hero-subtext)" }}>
            Get Found · $149
          </span>
        </div>
      </header>

      {/* ── §1 HERO ────────────────────────────────────────────────── */}
      <section id="free-audit" aria-label="Hero" className="px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1fr_420px] md:items-start">

          {/* Left — copy */}
          <div>
            {/* Alert badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold text-red-400">
                May 2026 — Google replaced Search with AI
              </span>
            </div>

            <h1 className="text-[clamp(2rem,5.5vw,3.2rem)] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-hero-text)" }}>
              Google&apos;s AI now picks{" "}
              <em className="not-italic" style={{ color: "var(--color-accent)" }}>one</em>{" "}
              local business.
              <br />
              Make sure it&apos;s yours.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--color-hero-subtext)" }}>
              AI doesn&apos;t show ten results anymore — it recommends one or two. For the first time,
              a small business can be the one it picks. But the window closes the moment a competitor
              locks in the spot.
            </p>

            {/* Chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Done for you", "No contract", "48 hours"].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                  style={{ borderColor: "var(--color-hero-border)", color: "var(--color-hero-subtext)" }}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 shrink-0" style={{ color: "var(--color-accent)" }}
                    fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {chip}
                </span>
              ))}
            </div>

            {/* Secondary link */}
            <p className="mt-6 text-sm" style={{ color: "var(--color-hero-subtext)" }}>
              Already decided?{" "}
              <Link
                href="/checkout/get-found-refresh"
                className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
                style={{ color: "var(--color-accent)" }}
              >
                Get Found for $149 →
              </Link>
            </p>
          </div>

          {/* Right — form */}
          <div>
            <AuditRequestForm
              source="lp-get-found"
              heading="See where your business stands."
              subheading="Free AI-visibility check — in your inbox within minutes."
              submitLabel="Check if AI can find you"
            />
            <p className="mt-3 text-center text-xs" style={{ color: "rgba(168,179,196,0.5)" }}>
              Ready now?{" "}
              <Link href="/checkout/get-found-refresh" className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                style={{ color: "var(--color-accent)" }}>
                Get Found for $149 →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── §2 THE WINDOW JUST OPENED ──────────────────────────────── */}
      <section className="px-6 py-14 md:py-16" style={{ borderTop: "1px solid var(--color-hero-border)", borderBottom: "1px solid var(--color-hero-border)", backgroundColor: "rgba(10,22,40,0.8)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--color-accent)" }}>
            First-mover window
          </p>
          <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ color: "var(--color-hero-text)" }}>
            The window just opened — and it won&apos;t stay open.
          </h2>
          <p className="mt-5 text-base leading-relaxed md:text-lg" style={{ color: "var(--color-hero-subtext)" }}>
            Google&apos;s AI, ChatGPT, Claude, and Gemini decide who to recommend before anyone clicks.
            The business they pick isn&apos;t the biggest — it&apos;s the one whose signals are most complete
            and consistent. Right now most local businesses fail those basics and never know it.
            The ones who fix them first get picked.
          </p>
        </div>
      </section>

      {/* ── §3 THE VISIBILITY ENGINE ───────────────────────────────── */}
      <section className="px-6 py-14 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--color-accent)" }}>
              Get Found · $149
            </p>
            <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ color: "var(--color-hero-text)" }}>
              Done for you. Done in 48 hours.
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm leading-relaxed md:text-base" style={{ color: "var(--color-hero-subtext)" }}>
              We run your business through the Visibility Engine — mapping what AI sees, fixing what
              it distrusts, and proving the lift. In 48 hours.
            </p>
          </div>

          {/* 3 cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                n: "01", step: "Map", color: "#f59e0b", bg: "#1c1a0e",
                title: "We map what AI sees",
                body: "We check your business against everything AI looks at before it picks who to recommend.",
              },
              {
                n: "02", step: "Align", color: "var(--color-accent)", bg: "#0e1e14",
                title: "We fix what AI distrusts",
                body: "We add the code that makes AI read your business the right way — and fix the conflicting details that make it skip you.",
              },
              {
                n: "03", step: "Amplify", color: "#10b981", bg: "#0e1e1a",
                title: "You see the difference",
                body: null,
              },
            ].map((card) => (
              <div key={card.n} className="relative flex flex-col overflow-hidden rounded-2xl p-5 shadow-md"
                style={{ backgroundColor: card.bg }}>
                {/* top border */}
                <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: card.color }} />

                {/* number + step row */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: card.color }}>
                      {card.n}
                    </span>
                    <span className="text-lg font-black" style={{ color: card.color }}>{card.step}</span>
                  </div>
                  <span className="font-mono text-4xl font-black select-none" style={{ color: "rgba(255,255,255,0.05)" }}>
                    {card.n}
                  </span>
                </div>

                <h3 className="mb-1.5 text-base font-bold text-white">{card.title}</h3>

                {card.body ? (
                  <p className="text-sm leading-relaxed text-slate-300/70">{card.body}</p>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <p className="mb-2 text-sm text-slate-300/70">Before/after report in 48 hours:</p>
                    <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2">
                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 mb-0.5">Before</span>
                        <span className="block text-xl font-black text-red-400/80">12%</span>
                      </div>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500 shrink-0">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 mb-0.5">After</span>
                        <span className="block text-xl font-black text-emerald-400">89%</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-center text-[10px] text-slate-500">Illustrative example</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: "rgba(168,179,196,0.6)" }}>
            Ready to run your business through the Visibility Engine?{" "}
            <a href="#free-audit" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-accent)" }}>
              Get the free check →
            </a>
          </p>
        </div>
      </section>

      {/* ── §4 SIGNAL STACK ────────────────────────────────────────── */}
      <section className="px-6 py-14 md:py-16" style={{ borderTop: "1px solid var(--color-hero-border)" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--color-accent)" }}>
              Under the hood
            </p>
            <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ color: "var(--color-hero-text)" }}>
              Getting picked isn&apos;t one fix. It&apos;s dozens of signals.
            </h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "var(--color-hero-subtext)" }}>
              Here&apos;s some of what AI checks before it will trust and recommend a local business:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNALS.map((s) => (
              <div key={s} className="flex items-start gap-2.5 rounded-xl p-3"
                style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} aria-hidden="true" />
                <span className="text-sm leading-snug" style={{ color: "rgba(168,179,196,0.8)" }}>{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl p-5 md:p-6"
            style={{ border: "1px solid rgba(45,106,79,0.25)", backgroundColor: "rgba(45,106,79,0.06)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-hero-subtext)" }}>
              <span className="font-semibold" style={{ color: "var(--color-hero-text)" }}>
                Miss the consistency between any of these and AI discounts all of it.
              </span>{" "}
              Knowing which signals matter, in what order, and keeping them aligned as Google
              changes — that&apos;s the work.{" "}
              <span style={{ color: "rgba(168,179,196,0.55)" }}>
                (In the industry this is called GEO and AEO. We just call it getting you found.)
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── §5 TRUST STRIP ─────────────────────────────────────────── */}
      <section className="px-6 py-10" style={{ borderTop: "1px solid var(--color-hero-border)", borderBottom: "1px solid var(--color-hero-border)", backgroundColor: "rgba(10,22,40,0.7)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_ITEMS.map(({ label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-base font-bold" style={{ color: "var(--color-hero-text)" }}>{label}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--color-hero-subtext)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §6 FOUNDER BLOCK ───────────────────────────────────────── */}
      <section className="px-6 py-14 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
            {/* Photo */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="h-28 w-28 overflow-hidden rounded-full"
                style={{ border: "2px solid rgba(255,255,255,0.12)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/mike.jpg"
                  alt="Mike Egidio, founder of GetMeFound"
                  className="h-full w-full object-cover object-top"
                  style={{ mixBlendMode: "luminosity" }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: "var(--color-hero-text)" }}>Mike Egidio</p>
                <p className="text-xs" style={{ color: "var(--color-hero-subtext)" }}>Founder, GetMeFound</p>
                <p className="mt-1 text-[11px]" style={{ color: "rgba(168,179,196,0.5)" }}>15+ yrs building businesses</p>
              </div>
            </div>

            {/* Quote */}
            <div className="text-center md:text-left">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>
                Why I built this
              </p>
              <blockquote className="text-base leading-relaxed md:text-lg" style={{ color: "var(--color-hero-subtext)" }}>
                &ldquo;I&apos;ve built and sold companies, and I kept watching great local businesses
                stay invisible while weaker competitors got picked. Getting picked by AI isn&apos;t
                one fix — it&apos;s dozens of signals it cross-checks before it trusts you. I built
                GetMeFound to engineer all of them for you. Done for you, no contracts.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm">
                <Link href="/about" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--color-accent)" }}>
                  Full story →
                </Link>
              </p>
              <p className="mt-4 text-xs leading-relaxed" style={{ color: "rgba(168,179,196,0.5)" }}>
                Everything we do follows{" "}
                <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--color-accent)" }}>
                  Google&apos;s own published guidance
                </a>{" "}
                — not guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── §7 SECURITY REASSURANCE ────────────────────────────────── */}
      <section className="px-6 py-12" style={{ borderTop: "1px solid var(--color-hero-border)" }}>
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center font-mono text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent)" }}>
            You stay in control. We never touch what we shouldn&apos;t.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                h: "Your email is safe",
                b: "We verify your email configuration before any work starts. We never touch your email hosting or settings.",
              },
              {
                h: "You stay the owner",
                b: "You add us as a manager on your Google listing — not an owner. You can remove our access any time, for any reason.",
              },
              {
                h: "Access stays private",
                b: "We never share your credentials or access outside our team. No outsourcing, no third-party access.",
              },
            ].map(({ h, b }) => (
              <div key={h} className="rounded-xl p-4"
                style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                <p className="mb-1 text-sm font-bold" style={{ color: "var(--color-hero-text)" }}>{h}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(168,179,196,0.6)" }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §8 FAQ ─────────────────────────────────────────────────── */}
      <section className="px-6 py-14" style={{ borderTop: "1px solid var(--color-hero-border)" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl" style={{ color: "var(--color-hero-text)" }}>
            Questions
          </h2>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold"
                  style={{ color: "var(--color-hero-text)" }}>
                  <span>{item.q}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-45"
                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(168,179,196,0.5)" }}
                    aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-hero-subtext)" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── §9 FINAL CTA ───────────────────────────────────────────── */}
      <section className="px-6 py-14 md:py-20" style={{ borderTop: "1px solid var(--color-hero-border)", backgroundColor: "rgba(10,22,40,0.6)" }}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-8 text-2xl font-bold leading-tight md:text-3xl" style={{ color: "var(--color-hero-text)" }}>
            One business gets picked in your area.
            <br />
            <span style={{ color: "var(--color-accent)" }}>Make sure it&apos;s yours.</span>
          </h2>
          <AuditRequestForm
            source="lp-get-found-bottom"
            heading="See where your business stands."
            subheading="Free AI-visibility check — in your inbox within minutes."
            submitLabel="Check if AI can find you"
          />
          <p className="mt-4 text-sm" style={{ color: "rgba(168,179,196,0.5)" }}>
            Already decided?{" "}
            <Link href="/checkout/get-found-refresh"
              className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-accent)" }}>
              Get Found for $149 →
            </Link>
          </p>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ─────────────────────────────────────────── */}
      <footer className="px-6 py-8 text-center text-xs"
        style={{ borderTop: "1px solid var(--color-hero-border)", color: "rgba(168,179,196,0.4)" }}>
        <p className="mb-2">
          <a href="mailto:support@getmefound.ai" className="hover:opacity-70 transition-opacity"
            style={{ color: "rgba(168,179,196,0.5)" }}>
            support@getmefound.ai
          </a>
          {" · "}
          <Link href="/terms" className="hover:opacity-70 transition-opacity">Terms</Link>
          {" · "}
          <Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link>
          {" · "}
          <Link href="/guarantee" className="hover:opacity-70 transition-opacity">Guarantee</Link>
        </p>
        {/* Physical address required for CAN-SPAM */}
        <p>GetMeFound, a service of AI Outsource Hub LLC · Connecticut, USA</p>
        <p className="mt-1">© {new Date().getFullYear()} GetMeFound. All rights reserved.</p>
        <p className="mt-2">
          <a href="https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/"
            target="_blank" rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity text-[10px]">
            Google has confirmed its AI will call local businesses on behalf of customers.
          </a>
        </p>
      </footer>

    </div>
  );
}
