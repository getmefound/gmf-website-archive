import type { Metadata } from "next";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — GetMeFound" },
  description:
    "Plain-English terms of service for GetMeFound plans, billing, access, ownership, and cancellation.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageBody>
      <PageSection className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Legal
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-body)] md:text-6xl">
              Terms of Service
            </h1>
            <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
              <p>Last updated: June 1, 2026</p>
              <p>Effective date: June 1, 2026</p>
              <p>Governing law: State of Connecticut</p>
            </div>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            These terms explain what GetMeFound provides, what we need from clients, how billing
            works, and what we do not promise. They are written in plain English.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-10">
          <TermsSection title="The services">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Get Found:</strong> $149 one-time payment. Work begins within 48 hours of
                purchase. Non-refundable once work has started. If we have not started yet, a full
                refund is available.
              </li>
              <li>
                <strong>Stay Found:</strong> $99/month plus $49 one-time setup fee. Month-to-month.
                Cancel anytime, no notice required, no cancellation fee. Cancellation takes effect
                at the end of the current billing period.
              </li>
              <li>
                <strong>Always Ready:</strong> $299/month. Month-to-month. Cancel anytime, no
                notice required, no cancellation fee.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="What the client provides">
            <ul className="list-disc space-y-2 pl-6">
              <li>Access to the client&apos;s Google Business Profile as a manager. The client keeps ownership.</li>
              <li>Access to the website backend during setup work when needed, using revocable user access where available.</li>
              <li>GetMeFound does not need client passwords for client hub access; client hubs use magic links.</li>
              <li>The client can revoke access at any time.</li>
            </ul>
          </TermsSection>

          <TermsSection title="What GetMeFound delivers">
            <ul className="list-disc space-y-2 pl-6">
              <li>All fixes described on the service page for the purchased plan.</li>
              <li>Before/after report within 48 hours for Get Found.</li>
              <li>Monthly deliverables as described for Stay Found and Always Ready.</li>
              <li>If anything is done incorrectly, GetMeFound will fix it at no charge.</li>
            </ul>
          </TermsSection>

          <TermsSection title="What GetMeFound does not guarantee">
            <ul className="list-disc space-y-2 pl-6">
              <li>Specific search positions or rankings.</li>
              <li>Specific number of reviews.</li>
              <li>Specific revenue outcomes.</li>
              <li>
                Results vary by business, market, and platform changes outside GetMeFound&apos;s
                control.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="Ownership">
            <ul className="list-disc space-y-2 pl-6">
              <li>The client owns their Google listing, website, reviews, and all data.</li>
              <li>GetMeFound claims no ownership of any client asset.</li>
              <li>Upon cancellation, the client retains everything. Nothing is held back.</li>
            </ul>
          </TermsSection>

          <TermsSection title="Other terms">
            <ul className="list-disc space-y-2 pl-6">
              <li>GetMeFound reserves the right to refuse service.</li>
              <li>Acceptable use: the service may not be used for illegal businesses.</li>
              <li>
                Limitation of liability: GetMeFound&apos;s maximum liability is the amount paid for
                the service in the prior 30 days.
              </li>
              <li>
                Disputes should be resolved by email first at{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                , then Connecticut courts.
              </li>
              <li>Terms may be updated with 30 days email notice to active clients.</li>
              <li>
                Questions:{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </TermsSection>
        </div>
      </PageSection>
    </PageBody>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-[var(--color-text-body)]">{title}</h2>
      <div className="leading-relaxed text-[var(--color-text-muted)]">{children}</div>
    </section>
  );
}
