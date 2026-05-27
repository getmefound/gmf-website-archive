"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { trackContactFormSubmit } from "@/lib/analytics";
import { validateEmail } from "@/lib/email-validation";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    onContactTurnstileSuccess?: (token: string) => void;
    onContactTurnstileExpired?: () => void;
  }
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileTokenRef = useRef<string>("");

  useEffect(() => {
    window.onContactTurnstileSuccess = (token: string) => {
      turnstileTokenRef.current = token;
    };
    window.onContactTurnstileExpired = () => {
      turnstileTokenRef.current = "";
    };
    return () => {
      window.onContactTurnstileSuccess = undefined;
      window.onContactTurnstileExpired = undefined;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const honeypot = honeypotRef.current?.value ?? "";
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    if (name.trim().length < 2) {
      setError("Please add your name.");
      return;
    }
    const v = validateEmail(email);
    if (!v.ok) {
      setError(v.error);
      return;
    }
    if (message.trim().length < 10) {
      setError("Your message is too short - give us a bit more to work with.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: honeypot,
          turnstileToken: turnstileTokenRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      track("contact_submit");
      trackContactFormSubmit();
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-3">Thanks - we got it.</h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed">
          We&apos;ll reply within a few hours. If it&apos;s urgent, email{" "}
          <a
            href="mailto:support@getmefound.ai"
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            support@getmefound.ai
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-4">Send a message</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold mb-2">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold mb-2">
            Business email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-semibold mb-2">
            What&apos;s on your mind?
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors resize-none"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
        >
          <label htmlFor="contact-website">Leave blank</label>
          <input
            id="contact-website"
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Sending..." : "Send message"}
        </button>

        {error && (
          <p role="alert" className="text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}

        {TURNSTILE_SITE_KEY && (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
              async
              defer
            />
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="onContactTurnstileSuccess"
              data-expired-callback="onContactTurnstileExpired"
              data-size="invisible"
            />
          </>
        )}
      </form>
    </div>
  );
}
