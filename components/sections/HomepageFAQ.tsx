import Link from "next/link";

const ITEMS = [
  {
    q: "What exactly do you do for $149?",
    a: "We engineer the signals Google AI, ChatGPT, and Claude check before recommending a local business — AI crawlability and schema so they can read your site, your Google profile rebuilt for the signals AI checks first, cross-web entity consistency, your review-velocity engine switched on, and a before/after report scoring all 20 AI signals. Everything done within 48 hours.",
  },
  {
    q: "Will you break my email?",
    a: "No. Your email and your website are completely separate — like your phone number and your mailing address. Before we touch anything, we verify exactly where your email lives. If it's on Google Workspace, Microsoft 365, or similar, updating your website does nothing to your email. We check this first, before any work starts.",
  },
  {
    q: "Do I need to give you my passwords?",
    a: "You add us as a manager on your Google Business listing — you stay the owner and can remove us any time. For your website, you give us a login with only what we need. We never share your access with anyone outside our team.",
  },
  {
    q: "Is there a contract?",
    a: "No contract, ever. Get Found is a one-time payment. Stay Found and Always Ready are month-to-month. Cancel any time, no notice required, no cancellation fee.",
  },
  {
    q: "Do you guarantee results?",
    a: "We don't guarantee a specific Google ranking or a specific number of reviews — nobody honest can. What we guarantee is the work: every fix in your report gets done, done correctly, and done within 48 hours. If something isn't right, we fix it at no charge.",
  },
] as const;

export function HomepageFAQ() {
  return (
    <section
      id="faq-home"
      aria-labelledby="faq-home-title"
      className="bg-(--color-bg-page) py-10 text-text-body md:py-14"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 text-center">
          <h2
            id="faq-home-title"
            className="text-3xl font-bold text-text-body md:text-4xl"
          >
            Questions we actually get asked
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            No fine print. No runaround.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {ITEMS.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg-page)">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
