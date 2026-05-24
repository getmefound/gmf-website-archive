import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { listClientAdminRecords } from "@/lib/client-profile-admin";
import { buildClientSetupUpdate, CLIENT_SETUP_STEPS, getClientSetupJob, saveClientSetupUpdate } from "@/lib/client-setup-jobs";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "Client Setup Jobs",
  description: "Internal GetMeFound client setup workflow.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    client?: string;
    saved?: string;
    error?: string;
  }>;
};

export default async function SetupJobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <AccessForm message={params.error || auth.message} />
      </ControlShell>
    );
  }

  const clients = await listClientAdminRecords();
  const clientOptions = clients.ok
    ? clients.records.map((record) => ({
        slug: record.profile.slug,
        name: record.profile.business_name,
      }))
    : [];
  const selectedClient = cleanClientSlug(params.client || "") || clientOptions.find((client) => client.slug === "getmefound")?.slug || clientOptions[0]?.slug || "getmefound";
  const selectedName = clientOptions.find((client) => client.slug === selectedClient)?.name || "GetMeFound";
  const jobResult = await getClientSetupJob(selectedClient);
  const state = jobResult.ok ? jobResult.state : null;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Client setup
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Setup jobs
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            A repeatable job room for onboarding a business: Manager review, Google Business Profile, review automation, safety, and launch gate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Hub
          </Link>
          <Link href="/mike-mc/clients" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Clients
          </Link>
          <Pill tone={jobResult.ok ? "accent" : "danger"}>{jobResult.ok ? "supabase live" : "storage issue"}</Pill>
        </div>
      </header>

      {params.saved ? <Notice tone="ok">Saved {params.saved}.</Notice> : null}
      {params.error ? <Notice tone="danger">{params.error}</Notice> : null}
      {!clients.ok ? <Notice tone="danger">{clients.error}</Notice> : null}
      {!jobResult.ok ? <Notice tone="danger">{jobResult.error}</Notice> : null}

      <section className="mb-6 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
        <form className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block min-w-0 flex-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Client</span>
            <select name="client" defaultValue={selectedClient} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60">
              {clientOptions.length ? clientOptions.map((client) => (
                <option key={client.slug} value={client.slug}>{client.name}</option>
              )) : <option value={selectedClient}>{selectedName}</option>}
            </select>
          </label>
          <button className="w-fit rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
            Open job
          </button>
        </form>
      </section>

      {state ? (
        <>
          <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MiniStat label="done" value={state.counts.done} tone="accent" />
            <MiniStat label="in progress" value={state.counts.inProgress} tone="warm" />
            <MiniStat label="waiting" value={state.counts.waiting} tone={state.counts.waiting ? "warm" : "muted"} />
            <MiniStat label="blocked" value={state.counts.blocked} tone={state.counts.blocked ? "danger" : "muted"} />
            <MiniStat label="events" value={state.events.length} tone="muted" />
          </section>

          <section className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{state.clientName}</h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{state.jobId}</p>
              </div>
              <Pill tone={statusTone(state.overallStatus)}>{state.overallStatus}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">{state.nextAction}</p>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <div className="space-y-3">
              {state.steps.map((step) => (
                <article key={step.key} className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-50">{step.label}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500">{step.check}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="muted">{step.owner}</Pill>
                      <Pill tone={statusTone(step.status)}>{step.status}</Pill>
                    </div>
                  </div>
                  {step.note ? <p className="text-sm leading-relaxed text-zinc-300">{step.note}</p> : null}
                  {step.blocker ? <p className="mt-2 rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm leading-relaxed text-rose-100">{step.blocker}</p> : null}
                  {step.nextAction ? <p className="mt-2 text-xs leading-relaxed text-zinc-500">Next: {step.nextAction}</p> : null}
                  {step.proofUrl ? <a href={step.proofUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">Open proof</a> : null}
                  {step.updatedAt ? <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">{formatShortDate(step.updatedAt)}</p> : null}
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-50">Log a check</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                Every save adds a proof event. It does not overwrite history.
              </p>
              <SetupUpdateForm clientSlug={selectedClient} clientName={selectedName} />
            </aside>
          </section>
        </>
      ) : null}
    </ControlShell>
  );
}

async function openSetupJobs(formData: FormData) {
  "use server";

  const ok = await startInternalToolSession(valueFrom(formData, "token"));
  if (!ok) redirect("/mike-mc/setup-jobs?error=Unauthorized");
  redirect("/mike-mc/setup-jobs");
}

async function saveSetupCheck(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  if (!auth.ok) redirect("/mike-mc/setup-jobs?error=Unauthorized");

  const clientSlug = cleanClientSlug(valueFrom(formData, "clientSlug")) || "getmefound";
  const clientName = valueFrom(formData, "clientName") || "GetMeFound";
  const stepKey = enumFrom(valueFrom(formData, "stepKey"), CLIENT_SETUP_STEPS.map((step) => step.key), "intake");
  const packet = buildClientSetupUpdate({
    clientSlug,
    clientName,
    jobId: `${clientSlug}-setup`,
    source: "mike-mc/setup-jobs",
    actor: enumFrom(valueFrom(formData, "actor"), ["Manager", "Profile Manager", "Reviews Manager", "Systems Director", "Auditor", "System"], "Manager"),
    stepKey,
    status: enumFrom(valueFrom(formData, "status"), ["not_started", "in_progress", "waiting_on_client", "blocked", "review", "done"], "in_progress"),
    note: valueFrom(formData, "note"),
    blocker: valueFrom(formData, "blocker"),
    nextAction: valueFrom(formData, "nextAction"),
    proofUrl: valueFrom(formData, "proofUrl"),
    metadata: {},
  });

  const saved = await saveClientSetupUpdate(packet);
  if (!saved.ok) redirect(`/mike-mc/setup-jobs?client=${clientSlug}&error=${encodeURIComponent(saved.error)}`);
  revalidatePath("/mike-mc/setup-jobs");
  redirect(`/mike-mc/setup-jobs?client=${clientSlug}&saved=${encodeURIComponent(stepKey)}`);
}

function AccessForm({ message }: { message: string }) {
  return (
    <section className="max-w-xl">
      <header className="mb-8 border-b border-zinc-800/60 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">GMF - Internal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">Setup Jobs</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Enter the internal API token to open client setup workflows.</p>
      </header>
      <form action={openSetupJobs} className="rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Internal token</span>
          <input name="token" type="password" autoComplete="off" className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
        </label>
        <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">Open jobs</button>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      </form>
    </section>
  );
}

function SetupUpdateForm({ clientSlug, clientName }: { clientSlug: string; clientName: string }) {
  return (
    <form action={saveSetupCheck} className="mt-5 grid gap-3">
      <input type="hidden" name="clientSlug" value={clientSlug} />
      <input type="hidden" name="clientName" value={clientName} />
      <Select label="Step" name="stepKey" defaultValue="manager_review" options={CLIENT_SETUP_STEPS.map((step) => step.key)} />
      <Select label="Actor" name="actor" defaultValue="Manager" options={["Manager", "Profile Manager", "Reviews Manager", "Systems Director", "Auditor", "System"]} />
      <Select label="Status" name="status" defaultValue="in_progress" options={["not_started", "in_progress", "waiting_on_client", "blocked", "review", "done"]} />
      <TextArea label="Note" name="note" defaultValue="" />
      <TextArea label="Blocker" name="blocker" defaultValue="" />
      <TextArea label="Next action" name="nextAction" defaultValue="" />
      <Field label="Proof URL" name="proofUrl" defaultValue="" />
      <button className="w-fit rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
        Save check
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <input name={name} defaultValue={defaultValue} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60" />
    </label>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: string[] }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <select name={name} defaultValue={defaultValue} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={3} className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none focus:border-emerald-500/60" />
    </label>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: "accent" | "warm" | "danger" | "muted" }) {
  const toneClasses = {
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    warm: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    muted: "border-zinc-800 bg-black/20 text-zinc-400",
  }[tone];
  return (
    <div className={`rounded-md border px-3 py-2 ${toneClasses}`}>
      <p className="font-mono text-[10px] uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Notice({ tone, children }: { tone: "ok" | "danger"; children: ReactNode }) {
  const classes = tone === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-rose-500/30 bg-rose-500/10 text-rose-100";
  return <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${classes}`}>{children}</div>;
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function enumFrom<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function cleanClientSlug(value: string) {
  return value.trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}

function statusTone(status: string): "accent" | "warm" | "danger" | "muted" {
  if (status === "ready" || status === "done") return "accent";
  if (status === "blocked") return "danger";
  if (status === "waiting_on_client" || status === "in_progress" || status === "review") return "warm";
  return "muted";
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
