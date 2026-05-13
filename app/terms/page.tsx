import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for AI Outsource Hub. No contracts. Cancel anytime. Plain-language terms covering what you get and what we expect.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Plain-language terms covering what you get from AOH and what we expect from each other. No contracts. Cancel anytime."
      />
      <PageBody>
        <PageSection>
          <div className="space-y-10">
            <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 13, 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">No contracts</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                AOH services are month-to-month. You can cancel at any time, for any reason, by
                emailing{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                . When you cancel, we stop billing you at the end of the current billing period
                and shut down the running services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">What you get</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                The services described on the product page you signed up from. We don't promise
                specific ranking outcomes — search algorithms change. We do promise to operate
                your AI tools competently, transparently, and consistently.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">What we expect from you</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Accurate business information at signup. Permission to operate the integrations
                we need (Google Business Profile, social accounts, SMS/email sending). Compliance
                with the platforms' terms of service — no fake reviews, no soliciting reviews in
                exchange for compensation, no spammy outreach.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Billing &amp; auto-renewal</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Plans are billed monthly in advance via the payment method on file. Your
                subscription <strong>renews automatically each month</strong> at the price shown on
                your signup page until you cancel by emailing{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                . Failed charges pause the service until the payment method is updated.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Refunds</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                <strong>Monthly fees</strong> aren't refundable once your billing period starts —
                but we don't charge cancellation fees. Cancel anytime and we'll stop billing at
                the end of the current period.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                <strong>One-time setup fees</strong> aren't refundable once setup work has started
                (voice tuning, integration build, content production). If you cancel before any
                setup work has started, we refund the setup fee in full.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If you think there's a billing error, email{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                {" "}— we fix real mistakes without argument.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Communications (SMS + email)</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                You authorize AOH to operate SMS and email messaging on your business's behalf —
                sending review requests, replies, appointment confirmations, and similar messages
                to your customers who have opted in to receive communications from your business.
                You confirm that your customer contact list has the required consent under TCPA,
                CAN-SPAM, and equivalent laws, and that AOH will not use it for any purpose outside
                the service you signed up for.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                We don't sell your data or your customer list. Ever.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                For the AOH services you're paying for, we may contact <em>you</em> (the business
                owner) at the phone and email you provided — for account updates, service alerts,
                and onboarding. Reply <strong>STOP</strong> to any SMS from us to opt out of
                non-essential messages. Standard message and data rates may apply.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Liability</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                AOH is not liable for losses caused by third-party platform changes, customer
                behavior, or factors outside our reasonable control. Our liability is capped at
                the amount you paid us in the 90 days preceding the issue.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Changes to these terms</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If we change these terms in a way that affects you materially, we'll email you 30
                days in advance. You can cancel before the change takes effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Questions? Email{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                .
              </p>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
