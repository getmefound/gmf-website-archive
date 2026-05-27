import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { getClientHubProfile } from "@/lib/client-profile-store";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";
import type { ReviewReplyDraftPacket } from "@/lib/review-automation";
import { draftReviewReply, saveReviewReplyDecision } from "@/lib/review-reply-drafts";
import { cleanClientSlug } from "@/lib/review-send-candidates";

export const metadata: Metadata = {
  title: "Review Replies",
  description: "Internal draft and approval page for review replies.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    drafted?: string;
    saved?: string;
    error?: string;
  }>;
};

export default async function ReviewRepliesPage({ params, searchParams }: PageProps) {
  const { slug: rawSlug } = await params;
  const query = await searchParams;
  const slug = cleanClientSlug(rawSlug);
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <AccessForm slug={slug} message={auth.message} />
      </ControlShell>
    );
  }

  const client = await getClientHubProfile(slug);
  const records = await listReviewAutomationRecords({ clientSlug: slug, limit: 30 });
  const drafts = records.ok
    ? records.records
        .filter((record) => record.eventType === "review_reply_draft")
        .map((record) => ({
          id: record.id,
          createdAt: record.createdAt,
          payload: record.payload as ReviewReplyDraftPacket,
        }))
    : [];

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Review replies
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {client?.businessName ?? "Review reply workspace"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Draft replies in the client&apos;s saved voice, then approve, reject, or mark posted without turning on any GHL AI automation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc/clients"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Clients
          </Link>
          <Link
            href={`/client/${slug}`}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Client hub
          </Link>
          <Pill tone={client ? "accent" : "danger"}>{client ? client.voiceProfile?.mode ?? "Draft only" : "missing"}</Pill>
        </div>
      </header>

      {query.drafted ? (
        <Notice tone="ok">Draft created and saved to the review reply audit trail.</Notice>
      ) : null}
      {query.saved ? (
        <Notice tone="ok">Reply marked {query.saved}.</Notice>
      ) : null}
      {query.error ? <Notice tone="danger">{query.error}</Notice> : null}
      {!records.ok ? <Notice tone="danger">{records.error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <DraftForm slug={slug} disabled={!client} />
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Recent drafts</h2>
            <Pill tone={drafts.length ? "ok" : "muted"}>{drafts.length} records</Pill>
          </div>
          {drafts.length ? (
            drafts.map((draft) => <DraftCard key={draft.id} slug={slug} draft={draft} />)
          ) : (
            <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5 text-sm leading-relaxed text-zinc-400">
              No reply drafts yet. Paste a review on the left to create the first one.
            </section>
          )}
        </section>
      </div>
    </ControlShell>
  );
}

async function openRepliesPage(formData: FormData) {
  "use server";

  const slug = cleanClientSlug(valueFrom(formData, "slug"));
  const token = valueFrom(formData, "token");
  const ok = await startInternalToolSession(token);
  if (!ok) redirect(`/mike-mc/review-replies/${slug}?error=Unauthorized`);
  redirect(`/mike-mc/review-replies/${slug}`);
}

async function createReplyDraft(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  const slug = cleanClientSlug(valueFrom(formData, "slug"));
  if (!auth.ok) redirect(`/mike-mc/review-replies/${slug}?error=Unauthorized`);

  const result = await draftReviewReply({
    clientSlug: slug,
    reviewerName: valueFrom(formData, "reviewerName"),
    rating: Number(valueFrom(formData, "rating")),
    reviewText: valueFrom(formData, "reviewText"),
  });

  if (!result.ok) {
    redirect(`/mike-mc/review-replies/${slug}?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath(`/mike-mc/review-replies/${slug}`);
  redirect(`/mike-mc/review-replies/${slug}?drafted=1`);
}

async function saveReplyStatus(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  const slug = cleanClientSlug(valueFrom(formData, "slug"));
  if (!auth.ok) redirect(`/mike-mc/review-replies/${slug}?error=Unauthorized`);

  const status = valueFrom(formData, "status") as ReviewReplyDraftPacket["status"];
  if (!["approved", "rejected", "posted"].includes(status)) {
    redirect(`/mike-mc/review-replies/${slug}?error=${encodeURIComponent("Unsupported reply status.")}`);
  }

  const result = await saveReviewReplyDecision({
    clientSlug: slug,
    reviewerName: valueFrom(formData, "reviewerName"),
    rating: Number(valueFrom(formData, "rating")),
    reviewText: valueFrom(formData, "reviewText"),
    draftText: valueFrom(formData, "draftText"),
    status,
    decisionNote: valueFrom(formData, "decisionNote"),
  });

  if (!result.ok) {
    redirect(`/mike-mc/review-replies/${slug}?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath(`/mike-mc/review-replies/${slug}`);
  redirect(`/mike-mc/review-replies/${slug}?saved=${encodeURIComponent(status)}`);
}

function AccessForm({ slug, message }: { slug: string; message: string }) {
  return (
    <section className="max-w-xl">
      <header className="mb-8 border-b border-zinc-800/60 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
          GMF - Internal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Review replies
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enter the internal API token to draft and approve review replies.
        </p>
      </header>
      <form action={openRepliesPage} className="rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
        <input type="hidden" name="slug" value={slug} />
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Internal token</span>
          <input
            name="token"
            type="password"
            autoComplete="off"
            className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          />
        </label>
        <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
          Open replies
        </button>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      </form>
    </section>
  );
}

function DraftForm({ slug, disabled }: { slug: string; disabled: boolean }) {
  return (
    <aside className="h-fit rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">New draft</h2>
      <form action={createReplyDraft} className="mt-4 grid gap-3">
        <input type="hidden" name="slug" value={slug} />
        <Field label="Reviewer" name="reviewerName" defaultValue="" />
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Rating</span>
          <select
            name="rating"
            defaultValue="5"
            className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </label>
        <TextArea label="Review text" name="reviewText" defaultValue="" rows={7} />
        <button
          disabled={disabled}
          className="w-fit rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate draft
        </button>
        <p className="text-xs leading-relaxed text-zinc-500">
          This creates a draft only. Nothing posts to Google from this page.
        </p>
      </form>
    </aside>
  );
}

function DraftCard({
  slug,
  draft,
}: {
  slug: string;
  draft: { id: string; createdAt: string; payload: ReviewReplyDraftPacket };
}) {
  const payload = draft.payload;
  return (
    <article className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {new Date(draft.createdAt).toLocaleString("en-US")}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
            {payload.reviewerName || "Unnamed reviewer"} - {payload.rating}/5
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{payload.mode} - {payload.model}</p>
          {payload.safety ? (
            <p className="mt-1 text-xs text-zinc-500">
              Safety: {payload.safety.riskLevel} risk -{" "}
              {payload.safety.autoPostEligible ? "safe auto-post eligible" : "approval required"}
            </p>
          ) : null}
        </div>
        <Pill tone={payload.status === "posted" ? "ok" : payload.status === "rejected" ? "danger" : "warm"}>
          {payload.status}
        </Pill>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ReadBox label="Review" value={payload.reviewText} />
        <form action={saveReplyStatus} className="grid gap-3">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="reviewerName" value={payload.reviewerName} />
          <input type="hidden" name="rating" value={payload.rating} />
          <input type="hidden" name="reviewText" value={payload.reviewText} />
          <TextArea label="Reply draft" name="draftText" defaultValue={payload.draftText} rows={7} />
          <Field label="Decision note" name="decisionNote" defaultValue={payload.decisionNote ?? ""} />
          <div className="flex flex-wrap gap-2">
            <button
              name="status"
              value="approved"
              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Approve
            </button>
            <button
              name="status"
              value="posted"
              className="rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-sky-200 transition hover:bg-sky-500/20"
            >
              Mark posted
            </button>
            <button
              name="status"
              value="rejected"
              className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-rose-200 transition hover:bg-rose-500/20"
            >
              Reject
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}

function Notice({ tone, children }: { tone: "ok" | "danger"; children: ReactNode }) {
  const classes =
    tone === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
      : "border-rose-500/30 bg-rose-500/10 text-rose-100";
  return <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${classes}`}>{children}</div>;
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

function ReadBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1.5 whitespace-pre-wrap rounded-md border border-zinc-800 bg-black/30 p-3 text-sm leading-relaxed text-zinc-300">
        {value}
      </p>
    </div>
  );
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
