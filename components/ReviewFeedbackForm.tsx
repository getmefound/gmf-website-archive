"use client";

import { useRef, useState } from "react";

export function ReviewFeedbackForm({
  clientSlug,
  clientName,
}: {
  clientSlug: string;
  clientName: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ routeToGoogle: boolean; googleReviewUrl: string } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if ((honeypotRef.current?.value ?? "").trim()) {
      setResult({ routeToGoogle: false, googleReviewUrl: "" });
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/review-automation/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientSlug,
          customerName,
          customerEmail,
          rating,
          feedback,
          websiteTrap: honeypotRef.current?.value ?? "",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        routeToGoogle?: boolean;
        googleReviewUrl?: string;
      };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setResult({ routeToGoogle: Boolean(data.routeToGoogle), googleReviewUrl: data.googleReviewUrl ?? "" });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Thank you</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Your feedback was received.</h1>
        {result.routeToGoogle ? (
          <>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              If you are willing, the next step helps {clientName} by sharing your review on Google.
            </p>
            <a
              href={result.googleReviewUrl}
              className="mt-6 inline-flex rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue to Google
            </a>
          </>
        ) : (
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            The owner can review this privately and follow up if needed.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Quick feedback</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">How did {clientName} do?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This goes to the business first so they can celebrate wins or fix a problem quickly.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-5">
        {[1, 2, 3, 4, 5].map((value) => (
          <label
            key={value}
            className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 text-sm transition ${
              rating === value ? "border-emerald-700 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="rating"
              value={value}
              checked={rating === value}
              onChange={() => setRating(value)}
              className="sr-only"
            />
            <span className="text-2xl font-semibold text-slate-950">{value}</span>
            <span className="mt-1 text-xs text-slate-500">star{value === 1 ? "" : "s"}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextField label="Your name" value={customerName} onChange={setCustomerName} />
        <TextField label="Your email" value={customerEmail} onChange={setCustomerEmail} type="email" />
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-950">What should they know?</span>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          rows={5}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="feedback-trap">Leave blank</label>
        <input id="feedback-trap" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send feedback"}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-950">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      />
    </label>
  );
}
