import type { Metadata } from "next";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — GetMeFound" },
  description:
    "Plain-English privacy policy for GetMeFound forms, payments, analytics, and data storage.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageBody>
      <PageSection className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Legal
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-body)] md:text-6xl">
              Privacy Policy
            </h1>
            <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
              <p>Last updated: June 1, 2026</p>
              <p>Effective date: June 1, 2026</p>
            </div>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            GetMeFound keeps privacy simple. We collect only what we need to answer your request,
            run the service, protect the site from abuse, and keep basic business records.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-10">
          <PolicySection title="What we collect">
            <ul className="list-disc space-y-2 pl-6">
              <li>Name, business name, city, and email address when you submit the audit intake form or contact form.</li>
              <li>
                Payment information processed by Stripe. GetMeFound never sees or stores your card
                number. Stripe handles all payment data.
              </li>
              <li>IP address, stored temporarily for rate limiting to prevent abuse. We do not use it for tracking.</li>
              <li>
                Basic usage data through Vercel Analytics if enabled. This is page-view data only,
                with no personal data collected by GetMeFound.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="How we store it">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Form submissions are stored in Supabase, our database. This can include business
                name, city, email, and audit results.
              </li>
              <li>Stripe stores payment records under Stripe&apos;s own privacy policy.</li>
              <li>
                Cloudflare Turnstile is used on forms for bot protection. It collects minimal
                browser signals. GetMeFound does not store personal data from Turnstile.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="What we do with it">
            <ul className="list-disc space-y-2 pl-6">
              <li>Send you the visibility report or audit you requested.</li>
              <li>Follow up about GetMeFound services if you opted in.</li>
              <li>We never sell your data to anyone.</li>
              <li>We never share your data with advertisers.</li>
              <li>We do not use your data for any purpose other than providing the service you requested.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Your rights">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Request deletion of your data by emailing{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
              <li>Unsubscribe from any email at any time using the unsubscribe link.</li>
              <li>
                EU visitors: GDPR rights apply. Contact{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Email, children, and updates">
            <ul className="list-disc space-y-2 pl-6">
              <li>GetMeFound follows CAN-SPAM requirements for all email.</li>
              <li>This site is not directed at children under 13.</li>
              <li>Policy updates will be posted here with a new effective date.</li>
              <li>Company: GetMeFound, Connecticut, United States.</li>
              <li>
                Questions:{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </PolicySection>
        </div>
      </PageSection>
    </PageBody>
  );
}

function PolicySection({
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
