import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";
import {
  buildReviewSendProof,
  REVIEW_SEND_CONFIRM_TEXT,
  sendApprovedReviewBatch,
} from "@/lib/review-send-batch";
import { cleanClientSlug } from "@/lib/review-send-candidates";

export const metadata: Metadata = {
  title: "Review Send Proof",
  description: "Internal proof and approval page for Review Automation sends.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    limit?: string;
    sent?: string;
    failed?: string;
    error?: string;
  }>;
};

export default async function ReviewProofPage({ params, searchParams }: PageProps) {
  const { slug: rawSlug } = await params;
  const query = await searchParams;
  const slug = cleanClientSlug(rawSlug);
  const limit = Number(query.limit ?? 5);
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <AccessForm slug={slug} message={auth.message} />
      </ControlShell>
    );
  }

  const proof = await buildReviewSendProof({ clientSlug: slug, limit });

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Review proof
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {proof.ok ? proof.clientName : "Review send proof"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Review the recipients and message before any live Review Automation batch sends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc/clients"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Clients
          </Link>
          {proof.ok ? (
            <Link
              href={`/client/${proof.clientSlug}`}
              className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              Client hub
            </Link>
          ) : null}
          <Pill tone={proof.ok && proof.batchSize > 0 ? "warm" : "muted"}>
            {proof.ok ? `${proof.batchSize} queued` : "blocked"}
          </Pill>
        </div>
      </header>

      {query.sent ? (
        <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Sent {query.sent}. Failed {query.failed ?? "0"}.
        </div>
      ) : null}
      {query.error ? (
        <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {query.error}
        </div>
      ) : null}

      {!proof.ok ? (
        <BlockedState error={proof.error} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <ProofControls slug={proof.clientSlug} limit={limit} batchSize={proof.batchSize} />
          <section className="space-y-4">
            <SummaryStrip
              totalCandidates={proof.totalCandidates}
              batchSize={proof.batchSize}
              sourceUploadAt={proof.sourceUploadAt}
            />
            {proof.previews.map((preview, index) => (
              <article key={`${preview.to}-${index}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Recipient {index + 1}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
                      {preview.name || "Unnamed customer"}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">{preview.to}</p>
                  </div>
                  <Pill tone="accent">ready</Pill>
                </div>
                <dl className="grid gap-3 text-sm md:grid-cols-[120px_1fr]">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">Subject</dt>
                  <dd className="text-zinc-200">{preview.subject}</dd>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">Feedback</dt>
                  <dd className="break-all text-zinc-400">{preview.feedbackUrl}</dd>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">Message</dt>
                  <dd>
                    <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-zinc-800 bg-black/30 p-3 text-xs leading-relaxed text-zinc-300">
                      {preview.text}
                    </pre>
                  </dd>
                </dl>
              </article>
            ))}
          </section>
        </div>
      )}
    </ControlShell>
  );
}

async function openProofPage(formData: FormData) {
  "use server";

  const token = valueFrom(formData, "token");
  const slug = cleanClientSlug(valueFrom(formData, "slug"));
  const ok = await startInternalToolSession(token);
  if (!ok) redirect(`/mike-mc/review-proof/${slug}?error=Unauthorized`);
  redirect(`/mike-mc/review-proof/${slug}`);
}

async function sendProofBatch(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  const slug = cleanClientSlug(valueFrom(formData, "slug"));
  if (!auth.ok) redirect(`/mike-mc/review-proof/${slug}?error=Unauthorized`);

  const result = await sendApprovedReviewBatch({
    clientSlug: slug,
    limit: Number(valueFrom(formData, "limit")),
    confirm: valueFrom(formData, "confirm"),
  });

  if (!result.ok && "sent" in result && "failed" in result) {
    revalidatePath(`/client/${slug}`);
    redirect(`/mike-mc/review-proof/${slug}?sent=${result.sent}&failed=${result.failed}`);
  }

  if (!result.ok) {
    redirect(`/mike-mc/review-proof/${slug}?error=${encodeURIComponent(result.error ?? "Review send failed.")}`);
  }

  revalidatePath(`/client/${slug}`);
  redirect(`/mike-mc/review-proof/${slug}?sent=${result.sent}&failed=${result.failed}`);
}

function AccessForm({ slug, message }: { slug: string; message: string }) {
  return (
    <section className="max-w-xl">
      <header className="mb-8 border-b border-zinc-800/60 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
          GMF - Internal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Review send proof
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enter the internal API token to review queued recipients before sending.
        </p>
      </header>
      <form action={openProofPage} className="rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
        <input type="hidden" name="slug" value={slug} />
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Internal token
          </span>
          <input
            name="token"
            type="password"
            autoComplete="off"
            className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          />
        </label>
        <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
          Open proof
        </button>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      </form>
    </section>
  );
}

function ProofControls({ slug, limit, batchSize }: { slug: string; limit: number; batchSize: number }) {
  return (
    <aside className="h-fit rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Approval</h2>
      <form className="mt-4 grid gap-3" method="get">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Batch size</span>
          <input
            name="limit"
            type="number"
            min={1}
            max={25}
            defaultValue={Number.isFinite(limit) ? limit : 5}
            className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          />
        </label>
        <button className="w-fit rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800">
          Refresh proof
        </button>
      </form>

      <form action={sendProofBatch} className="mt-6 border-t border-zinc-800/70 pt-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="limit" value={Number.isFinite(limit) ? limit : 5} />
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Type confirm phrase
          </span>
          <input
            name="confirm"
            placeholder={REVIEW_SEND_CONFIRM_TEXT}
            disabled={batchSize === 0}
            className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60 disabled:opacity-50"
          />
        </label>
        <button
          disabled={batchSize === 0}
          className="mt-3 rounded-md border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send approved batch
        </button>
      </form>
    </aside>
  );
}

function SummaryStrip({
  totalCandidates,
  batchSize,
  sourceUploadAt,
}: {
  totalCandidates: number;
  batchSize: number;
  sourceUploadAt: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Metric label="Sendable customers" value={String(totalCandidates)} />
      <Metric label="This proof" value={String(batchSize)} />
      <Metric label="Upload source" value={sourceUploadAt ? new Date(sourceUploadAt).toLocaleDateString("en-US") : "None"} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">{value}</p>
    </div>
  );
}

function BlockedState({ error }: { error: string }) {
  return (
    <section className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-5">
      <h2 className="text-lg font-semibold tracking-tight text-rose-100">Proof blocked</h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-100/80">{error}</p>
    </section>
  );
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
