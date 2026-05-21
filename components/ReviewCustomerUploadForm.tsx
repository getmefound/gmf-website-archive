"use client";

import { useRef, useState } from "react";
import { validateEmail } from "@/lib/email-validation";

type UploadSummary = {
  totalRows: number;
  sendableRows: number;
  suppressedRows: number;
  missingEmailRows: number;
  duplicateEmailRows: number;
};

export function ReviewCustomerUploadForm({
  clientSlug,
  clientName,
}: {
  clientSlug: string;
  clientName: string;
}) {
  const [submittedBy, setSubmittedBy] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [customerText, setCustomerText] = useState("");
  const [doNotContactText, setDoNotContactText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSummary(null);

    if ((honeypotRef.current?.value ?? "").trim()) {
      setSummary({ totalRows: 0, sendableRows: 0, suppressedRows: 0, missingEmailRows: 0, duplicateEmailRows: 0 });
      return;
    }
    if (submittedBy.trim().length < 2) {
      setError("Add your name.");
      return;
    }
    const emailCheck = validateEmail(submittedEmail);
    if (!emailCheck.ok) {
      setError(emailCheck.error);
      return;
    }
    if (customerText.trim().length < 5) {
      setError("Paste at least one customer row.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/review-automation/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientSlug,
          submittedBy,
          submittedEmail,
          customerText,
          doNotContactText,
          websiteTrap: honeypotRef.current?.value ?? "",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        summary?: UploadSummary;
        storageConfigured?: boolean;
      };
      if (!response.ok || !data.ok || !data.summary) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSummary(data.summary);
      setStorageConfigured(data.storageConfigured !== false);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Customer list</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{clientName}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste recent completed jobs or customers. We hold back duplicates, missing emails, and do-not-contact matches
          before any review request is sent.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Your name" value={submittedBy} onChange={setSubmittedBy} required />
        <TextField label="Your email" value={submittedEmail} onChange={setSubmittedEmail} type="email" required />
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-950">Customer rows</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          Format: name, email, phone, job date, notes. Spreadsheet paste is fine.
        </span>
        <textarea
          value={customerText}
          onChange={(event) => setCustomerText(event.target.value)}
          rows={10}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder={"Jane Customer, jane@example.com, 555-0100, 2026-05-21, completed setup\nSam Customer, sam@example.com, 555-0101, 2026-05-20, happy customer"}
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-950">Do-not-contact names or notes</span>
        <textarea
          value={doNotContactText}
          onChange={(event) => setDoNotContactText(event.target.value)}
          rows={4}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="Names, emails, customers, or job notes to hold back"
        />
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="customer-upload-trap">Leave blank</label>
        <input id="customer-upload-trap" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      {summary ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-slate-950">List received</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-5">
            <Stat label="Rows" value={summary.totalRows} />
            <Stat label="Sendable" value={summary.sendableRows} />
            <Stat label="Held" value={summary.suppressedRows} />
            <Stat label="Missing email" value={summary.missingEmailRows} />
            <Stat label="Duplicates" value={summary.duplicateEmailRows} />
          </div>
          {!storageConfigured ? (
            <p className="mt-3 text-xs leading-5 text-amber-900">
              Internal storage webhook is not configured yet. Manager received the summary; send the file by email before
              real customer outreach.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Checking..." : "Submit customer list"}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-950">
        {label}
        {required ? <span className="text-emerald-700"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-emerald-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
