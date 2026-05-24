import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Payment confirmed — GetMeFound",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <PageBody>
      <PageSection>
        <div className="mx-auto max-w-xl text-center py-16">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-text-body)] mb-4">
            Payment confirmed.
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
            We received your order. Someone from GMF will reach out within one business day to get things moving.
          </p>

          <div className="rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-6 py-5 text-left mb-8">
            <p className="text-sm font-semibold text-[var(--color-text-body)] mb-1">What happens next</p>
            <ul className="space-y-1.5 text-sm text-[var(--color-text-muted)]">
              <li>→ You will get a receipt from Stripe shortly.</li>
              <li>→ A GMF team member will email you within one business day.</li>
              <li>→ We will collect your business details and get access set up.</li>
            </ul>
          </div>

          <Link
            href="/"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </PageSection>
    </PageBody>
  );
}
