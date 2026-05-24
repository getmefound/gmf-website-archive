import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection } from "@/components/PageBody";
import { getCheckoutProduct } from "@/lib/checkout";

export const metadata: Metadata = {
  title: "Payment confirmed — GetMeFound",
  robots: { index: false, follow: false },
};

const ONE_TIME_NEXT_STEPS = [
  "You will get a receipt from Stripe shortly.",
  "A GetMeFound team member will email you within one business day.",
  "We will audit your Google Business Profile and send you a report with next steps.",
];

const SUBSCRIPTION_NEXT_STEPS = [
  "You will get a receipt from Stripe shortly.",
  "A GetMeFound team member will email you within one business day.",
  "We will collect your business details, confirm access, and start your first cycle.",
  "You can update your payment method or cancel anytime from your billing portal.",
];

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const product = slug ? getCheckoutProduct(slug) : undefined;

  const isSubscription = product?.stripeMode === "subscription";
  const nextSteps = isSubscription ? SUBSCRIPTION_NEXT_STEPS : ONE_TIME_NEXT_STEPS;
  const heading = product ? `${product.name} — confirmed.` : "Payment confirmed.";
  const sub = isSubscription
    ? `Your ${product!.name} plan is active. We will be in touch within one business day.`
    : "We received your payment. Someone will be in touch within one business day.";

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
            {heading}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
            {sub}
          </p>

          <div className="rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-6 py-5 text-left mb-8">
            <p className="text-sm font-semibold text-[var(--color-text-body)] mb-3">What happens next</p>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {nextSteps.map((step) => (
                <li key={step}>→ {step}</li>
              ))}
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
