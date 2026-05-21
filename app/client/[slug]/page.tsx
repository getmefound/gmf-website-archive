import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CLIENT_HUBS,
  getClientHub,
  statusClasses,
  statusLabel,
  type ClientHubProfile,
  type ClientHubStatus,
} from "@/lib/client-hub";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) {
    return {
      title: "Client Hub",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${client.businessName} Client Hub`,
    description: `AOH setup hub for ${client.businessName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClientHubPage({ params }: PageProps) {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) notFound();

  const completed = client.checklist.filter((item) => item.status === "done").length;
  const total = client.checklist.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f8f4] text-slate-950 focus:outline-none">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1fr_380px] lg:items-end lg:py-12">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                {client.plan}
              </span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                {client.statusLabel}
              </span>
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
                Owner protection: {client.protection}
              </span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <LogoMark client={client} size="large" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Client hub
                </p>
                <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
                  {client.businessName}
                </h1>
                <p className="mt-3 max-w-3xl break-words text-base leading-7 text-slate-600 md:text-lg">
                  {client.managerSummary}
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Manager says
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {progress}% ready
            </p>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-emerald-700"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Next client action: <span className="font-semibold text-slate-950">{client.nextClientAction}</span>
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#eef3ea]">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6 py-4">
          {[
            ["Setup", "#setup"],
            ["Review Automation", "#reviews"],
            ["Uploads", "#uploads"],
            ["AI Visibility", "#ai-visibility"],
            ["Agent workflow", "#agents"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="flex-shrink-0 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-4">
        {client.metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{metric.sub}</p>
          </article>
        ))}
      </section>

      <section id="setup" className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <SectionHeader
            eyebrow="Setup"
            title="What we have and what is still needed"
            sub="This is the page the client can check instead of logging into GHL."
          />
          <BusinessCard client={client} />
        </div>

        <div className="grid gap-3">
          {client.checklist.map((item) => (
            <article key={item.label} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[160px_1fr]">
              <div>
                <StatusPill status={item.status} />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {item.owner}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-950">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="reviews" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="Standard"
              title="Review Automation"
              sub="This is the live core service: collect more Google reviews without making the owner chase every customer."
            />
            <div className="grid gap-4">
              <ProofRow label="Google profile" value={client.reviews.googleStatus} />
              <ProofRow label="Review link" value={client.reviews.reviewLinkStatus} />
              <ProofRow label="Request rule" value={client.reviews.requestRule} />
              <ProofRow label="Launch proof" value={client.reviews.proof} />
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
              What the client sees
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Simple status, not a messy dashboard
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniStat label="Requests sent" value={client.metrics[0]?.value ?? "0"} />
              <MiniStat label="Access status" value={client.reviews.googleStatus} />
              <MiniStat label="Workflow" value={client.metrics[2]?.value ?? "Checking"} />
              <MiniStat label="Proof" value="Saved here" />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              SMS, AI-drafted replies, ranking reports, and ChatGPT visibility stay in AI Visibility unless the client upgrades.
            </p>
          </div>
        </div>
      </section>

      <section id="uploads" className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Client updates"
          title="Files and details we may need"
          sub="The goal is to prefill most of this from signup and only ask the client for the missing pieces."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {client.uploadRequests.map((request) => (
            <article key={request.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <StatusPill status={request.status} />
              <h3 className="mt-4 text-base font-semibold text-slate-950">{request.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{request.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/intake/review-automation"
            className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Update setup details
          </Link>
          <a
            href="mailto:mike@aioutsourcehub.com?subject=Client%20hub%20upload"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Send file to AOH
          </a>
        </div>
      </section>

      <section id="ai-visibility" className="bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Custom upgrade
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              AI Visibility preview
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Every client hub can show a locked preview so owners understand what they get if they upgrade:
              review replies, local ranking gaps, ChatGPT visibility, and competitor movement.
            </p>
            <Link
              href="/pricing#ai-visibility"
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
            >
              Unlock AI Visibility
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {client.aiVisibilityPreview.map((metric) => (
              <article key={metric.label} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/10 p-5">
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                  Locked
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">{metric.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Agent workflow"
          title="Who does the work behind this page"
          sub="Manager owns the final client-facing answer. The child agents prepare the checks and proof."
        />
        <div className="grid gap-4 lg:grid-cols-5">
          {client.agentSteps.map((step) => (
            <article key={step.agent} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                {step.agent}
              </p>
              <h3 className="mt-3 text-base font-semibold text-slate-950">{step.job}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.output}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LogoMark({ client, size = "normal" }: { client: ClientHubProfile; size?: "normal" | "large" }) {
  const dimensions = size === "large" ? "h-20 w-20 text-2xl" : "h-12 w-12 text-base";

  return (
    <div
      className={`${dimensions} flex flex-shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-700 to-slate-900 font-bold text-white shadow-sm`}
      aria-label={`${client.businessName} logo placeholder`}
    >
      {client.logoText}
    </div>
  );
}

function BusinessCard({ client }: { client: ClientHubProfile }) {
  const rows = [
    ["Owner", client.ownerName],
    ["Website", client.website],
    ["Phone", client.phone],
    ["Email", client.email],
    ["Location", client.location],
    ["Category", client.category],
    ["Brand", client.brandNote],
  ];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <LogoMark client={client} />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{client.businessName}</h2>
          <p className="text-sm text-slate-500">Prefilled client profile</p>
        </div>
      </div>
      <dl className="mt-5 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[110px_1fr]">
            <dt className="font-semibold text-slate-500">{label}</dt>
            <dd className="text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <header className="mb-5 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{sub}</p>
    </header>
  );
}

function StatusPill({ status }: { status: ClientHubStatus }) {
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClasses(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

function ProofRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}
