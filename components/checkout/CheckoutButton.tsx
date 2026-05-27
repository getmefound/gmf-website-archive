"use client";

import { useState } from "react";
import {
  trackAlwaysReadyCheckoutClick,
  trackGetFoundCheckoutClick,
  trackStayFoundCheckoutClick,
} from "@/lib/analytics";

const checkoutTrackers: Record<string, () => void> = {
  "get-found-refresh": trackGetFoundCheckoutClick,
  "stay-found": trackStayFoundCheckoutClick,
  "always-ready": trackAlwaysReadyCheckoutClick,
};

export function CheckoutButton({ slug, label }: { slug: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    checkoutTrackers[slug]?.();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-6 py-4 text-base font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark-card)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting to payment…" : label}
        {!loading && <span aria-hidden="true">→</span>}
      </button>
      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
