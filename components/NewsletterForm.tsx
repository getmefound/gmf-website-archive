"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "pending" || state === "success") return;
    setState("pending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  const disabled = state === "pending" || state === "success";

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
        Get the newsletter
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-hero-subtext)]">
        Short emails. Plain language. No spam.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Email address"
          disabled={disabled}
          className="flex-1 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-[var(--color-hero-text)] placeholder:text-[var(--color-hero-subtext)]/50 focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "pending" ? "…" : state === "success" ? "✓ in" : "Sign up"}
        </button>
      </div>
      {state === "success" && (
        <p className="text-xs text-[var(--color-accent)]">You&apos;re in. Check your inbox.</p>
      )}
      {state === "error" && (
        <p className="text-xs text-red-400">Couldn&apos;t sign you up. Try again or email us.</p>
      )}
    </form>
  );
}
