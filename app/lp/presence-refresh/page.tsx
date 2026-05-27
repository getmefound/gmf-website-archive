import type { Metadata } from "next";
import Image from "next/image";
import { growthProductBySlug } from "@/lib/control/growth-products";

const BOOKING_HREF = "/contact";

const product = growthProductBySlug("presence-refresh");
const offer = product?.specialOffer;
const sourceClaims = product?.sourceClaims ?? [];

export const metadata: Metadata = {
  title: "Presence Refresh Launch Special - GetMeFound",
  description:
    "A $499 limited-time content refresh before Reach campaigns send prospects to check your business.",
  robots: { index: false, follow: false },
};

export default function PresenceRefreshLandingPage() {
  if (!product || !offer) return null;

  return (
    <main id="main-content" tabIndex={-1} className="bg-[var(--color-bg-page)] text-slate-950 focus:outline-none">
      <section className="relative isolate overflow-hidden bg-[var(--color-hero-bg)] text-white md:min-h-[78svh]">
        <Image
          src="/social/ai-gen/cost-of-dormant-profile.jpg"
          alt="A quiet business desk ready for a new campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,12,22,0.86),rgba(7,12,22,0.55),rgba(7,12,22,0.2))]" />

        <div className="relative mx-auto flex max-w-6xl flex-col px-5 py-8 md:min-h-[78svh] md:px-6">
          <div className="flex flex-1 items-center">
            <div className="max-w-3xl py-6 md:py-12">
              <p className="mb-4 inline-flex rounded-md border border-emerald-300/35 bg-emerald-300/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-emerald-100">
                {offer.label}
              </p>
              <h1 className="max-w-3xl text-2xl font-semibold leading-[1.05] tracking-tight sm:text-3xl md:text-6xl">
                Your next prospect will check you out first. Make sure they see momentum.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base md:text-xl md:leading-8">
                Turn stale social pages and outdated website content into sales-ready proof before
                Cold Email Reach or Social Reach sends prospects your way.
              </p>

              <div className="mt-5 grid grid-cols-2 items-stretch gap-3 md:mt-7 md:grid-cols-[0.75fr_1.1fr_1fr]">
                <div className="order-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm md:order-none">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300">
                    Normally
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-400 line-through decoration-rose-300 decoration-2">
                    {offer.regularPrice}
                  </p>
                </div>
                <div className="order-1 col-span-2 rounded-lg border border-emerald-300/45 bg-[var(--color-accent)]/70 px-4 py-3 shadow-lg shadow-emerald-950/30 backdrop-blur-sm md:order-none md:col-auto">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-100">
                    Launch price
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-white md:text-4xl">
                    {offer.price}
                  </p>
                </div>
                <div className="order-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm md:order-none">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300">
                    Includes
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    10 posts + 5 blogs
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-5">
                <a
                  href={BOOKING_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-[var(--color-accent-hover)]"
                >
                  Book My $499 Refresh Call
                </a>
                <p className="text-sm leading-6 text-slate-200">
                  10 social posts + 5 blog posts + proof report. Approval before anything goes live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 md:grid-cols-2 md:px-6">
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-rose-700">
              Before
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              Stale feed, outdated blog, weak proof, and prospects landing on last year&apos;s posts.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-[var(--color-accent-soft)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-800">
              After
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              10 current social posts, 5 useful articles, proof brief, and Reach-ready links.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700">
            Why this matters before outreach
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            This is the setup before the lead push.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Cold Email Reach and Social Reach can create attention. Presence Refresh makes sure
            that attention lands on a business that looks current, useful, and worth calling.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Social pages look alive",
              copy: "Recent posts answer common buyer questions and show the business is still moving.",
            },
            {
              title: "Website has useful proof",
              copy: "Five blog posts give the business current content that supports expertise, searchability, and sales follow-up.",
            },
            {
              title: "Reach has better handoff",
              copy: "Every campaign has current links to point to, instead of sending prospects to an empty or stale presence.",
            },
            {
              title: "Owner gets the Morning Brief",
              copy: "The brief shows what changed, proof links, open approvals, and the next move without making the owner babysit the work.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eaf2ee]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-800">
                What you get for $499
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Built for quick delivery first, custom work second.
              </h2>
            </div>
            <a
              href={BOOKING_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Book My $499 Refresh Call
            </a>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700">
                Commercial package
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                What every launch-special client gets
              </h3>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                {[
                  "Online presence audit",
                  "10 catch-up social posts",
                  "5 useful blog posts",
                  "Approval-ready drafts",
                  "Proof links and screenshots",
                  "Morning Brief bonus",
                  "Recommended Reach campaign angle",
                ].map((item) => (
                  <li key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
              >
                Claim the $499 launch price
              </a>
            </article>

            <article className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-700">
                Custom add-ons
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                Only when the business needs more
              </h3>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                {[
                  "Publishing directly inside client accounts",
                  "CRM or GHL campaign connection",
                  "Extra social channels",
                  "Owner interview or voice capture",
                  "Photo/video cleanup",
                  "Ongoing Social Reach watchlist",
                  "Monthly content and reporting cadence",
                ].map((item) => (
                  <li key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700">
              Work steps
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              The agent team does the work in a clean order.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Open the steps to see what happens. The owner only needs to approve the drafts and
              give access where publishing is included.
            </p>
          </div>

          <div className="space-y-3">
            {product.steps.map((step, index) => (
              <details
                key={step.title}
                className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700">
                      Step {index + 1} - {step.owner}
                    </span>
                    <span className="mt-1 block text-lg font-semibold text-slate-950">
                      {step.title}
                    </span>
                  </span>
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 transition group-open:bg-slate-950 group-open:text-white">
                    Open
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
                  Proof: {step.proof}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700">
              Source-backed sales story
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              We sell current proof, not fake magic metrics.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The offer is simple: make the business look active, useful, and ready before we
              start driving new attention to it.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {sourceClaims.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700">
                  {source.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{source.claim}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{source.detail}</p>
                <p className="mt-3 text-sm font-semibold text-emerald-800">Source link</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              Launch special
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              10 social posts, 5 blog posts, and Morning Brief proof for {offer.price}.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Founding-client price: {offer.price}. Standard package value: {offer.regularPrice}.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={BOOKING_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400"
            >
              Book My $499 Refresh Call
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
