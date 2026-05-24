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

type UploadPreviewRow = {
  name: string;
  email: string;
  suppressed: boolean;
  suppressReason: string;
};

type UploadResponse = {
  ok?: boolean;
  error?: string;
  dryRun?: boolean;
  summary?: UploadSummary;
  previewRows?: UploadPreviewRow[];
  storageConfigured?: boolean;
  nextProofUrl?: string;
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
  const [previewRows, setPreviewRows] = useState<UploadPreviewRow[]>([]);
  const [lastAction, setLastAction] = useState<"preview" | "submit" | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);
  const [nextProofUrl, setNextProofUrl] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const action = submitter?.value === "submit" ? "submit" : "preview";
    setError(null);
    setSummary(null);
    setPreviewRows([]);
    setNextProofUrl("");
    setLastAction(action);

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
          dryRun: action === "preview",
          websiteTrap: honeypotRef.current?.value ?? "",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as UploadResponse;
      if (!response.ok || !data.ok || !data.summary) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSummary(data.summary);
      setPreviewRows(data.previewRows ?? []);
      setStorageConfigured(data.storageConfigured !== false);
      setNextProofUrl(data.nextProofUrl ?? "");
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
        <a
          href={`/api/review-automation/customer-template?client=${encodeURIComponent(clientSlug)}`}
          className="mt-3 inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
        >
          Download CSV template
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Your name" value={submittedBy} onChange={setSubmittedBy} required />
        <TextField label="Your email" value={submittedEmail} onChange={setSubmittedEmail} type="email" required />
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-950">Customer rows</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          Format: name, email, phone, job date, notes. Spreadsheet paste and CSV rows are both fine.
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
          <p className="text-sm font-semibold text-slate-950">
            {lastAction === "preview" ? "List check complete" : "List received"}
          </p>
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
          {previewRows.length ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-emerald-200 bg-white">
              <div className="grid grid-cols-[1fr_1fr_120px] gap-2 border-b border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800">
                <span>Name</span>
                <span>Email</span>
                <span>Status</span>
              </div>
              {previewRows.map((row, index) => (
                <div
                  key={`${row.email}-${index}`}
                  className="grid grid-cols-[1fr_1fr_120px] gap-2 border-b border-slate-100 px-3 py-2 text-xs text-slate-700 last:border-b-0"
                >
                  <span className="truncate">{row.name || "Unnamed"}</span>
                  <span className="truncate">{row.email || "Missing"}</span>
                  <span className={row.suppressed ? "font-semibold text-amber-800" : "font-semibold text-emerald-800"}>
                    {row.suppressed ? row.suppressReason || "held" : "sendable"}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {nextProofUrl ? (
            <a
              href={nextProofUrl}
              className="mt-4 inline-flex rounded-md border border-emerald-700 bg-emerald-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              Review send proof
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          name="action"
          value="preview"
          disabled={pending}
          className="rounded-lg border border-emerald-700 bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && lastAction === "preview" ? "Checking..." : "Check list"}
        </button>
        <button
          type="submit"
          name="action"
          value="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && lastAction === "submit" ? "Submitting..." : "Submit customer list"}
        </button>
      </div>
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
