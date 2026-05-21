"use client";

import { useMemo, useState } from "react";
import type { MorningBriefData } from "@/lib/control/morning-brief";

type Totals = {
  sent: number;
  delivered: number;
  deliveredPct: number;
  opened: number;
  openedPct: number;
  replied: number;
  bounced: number;
  bouncePct: number;
  unsubscribed: number;
};

type ViewKey = "today" | "sources" | "custom" | "pricing";

const standardIncludes = [
  "Reach campaign results",
  "News and market signals",
  "What needs Mike",
  "Agents working today",
  "Recommended next move",
  "Running archive",
];

const customConnectors = [
  "Email inbox triage",
  "Calendar and booking checks",
  "Deeper GHL pipeline detail",
  "Google Business Profile updates",
  "Missed calls or call tracking",
  "Ads, payments, or other private systems",
];

const agentOwners = [
  {
    agent: "General Manager",
    job: "Turns everything into the short owner read and flags anything that needs Mike.",
  },
  {
    agent: "GHL Expert",
    job: "Pulls Reach email stats, workflow proof, sender checks, and GHL readiness.",
  },
  {
    agent: "Scout",
    job: "Finds useful news, market shifts, competitor angles, and offer ideas.",
  },
  {
    agent: "Systems Director",
    job: "Watches source health, cron jobs, failures, and cost risk.",
  },
];

const sourceCards = [
  {
    name: "Reach / GHL outreach",
    state: "Live",
    owner: "GHL Expert",
    shows: "Sent, delivered, opened, replies, bounces, and unsubscribes.",
    where: "HighLevel read-only email stats API, current CSV, and this page.",
  },
  {
    name: "News and market signals",
    state: "Started",
    owner: "Scout",
    shows: "AI automation, GoHighLevel, Google Business Profile, and AI receptionist signals.",
    where: "Google News RSS starter feeds now. Google Alerts or n8n can broaden it next.",
  },
  {
    name: "Calendar",
    state: "Custom next",
    owner: "Scheduler + Systems Director",
    shows: "Booked work, open spots, missed appointments, and follow-up needs.",
    where: "Not connected to this brief yet. This should be a read-only custom connector.",
  },
  {
    name: "Email inbox",
    state: "Custom next",
    owner: "Manager + Systems Director",
    shows: "Important customer messages, owner tasks, sales replies, and follow-up risk.",
    where: "Not connected to this brief yet. Add Gmail/Outlook read-only access when ready.",
  },
  {
    name: "Archive and proof",
    state: "Live",
    owner: "Systems Director",
    shows: "Daily briefs, source files, GHL stats files, and proof used.",
    where: "Ledger docs, outbox files, and this running page.",
  },
  {
    name: "Slack delivery",
    state: "Ready path",
    owner: "General Manager",
    shows: "Short daily owner message and urgent exceptions.",
    where: "#04-aoh-ops now, then Mike DM if you want that delivery style.",
  },
];

const pricingAnchors = [
  {
    vendor: "AgencyAnalytics",
    price: "$20/client/mo",
    detail: "Automated reports, AI insights, white-label branding, and client portal. Billed annually.",
    source: "https://agencyanalytics.com/pricing",
  },
  {
    vendor: "DashThis",
    price: "$44-$54/mo",
    detail: "Starter dashboard plan with 3 dashboards and 15 sources.",
    source: "https://dashthis.com/pricing",
  },
  {
    vendor: "Databox",
    price: "$159/mo",
    detail: "Pro reporting plan for dashboards, reports, goals, shared updates, and team visibility.",
    source: "https://databox.com/pricing",
  },
  {
    vendor: "Whatagraph",
    price: "199 euros/mo",
    detail: "Start plan billed annually, with automated emails, reports, AI summaries, and data credits.",
    source: "https://whatagraph.com/pricing",
  },
];

const packaging = [
  {
    tier: "Standard Owner Brief",
    price: "$149-$299/mo",
    setup: "$0-$500 setup",
    body: "Daily owner read, outreach results, market signal, archive, and one recommended move.",
  },
  {
    tier: "Custom Owner Layer",
    price: "$399-$1,500+/mo",
    setup: "$750-$3,000 setup",
    body: "Private systems connected: email, calendar, GHL/CRM, GBP, calls, ads, payments, or custom agent jobs.",
  },
];

const retention = [
  ["Daily briefs", "13 months", "Your useful owner history without making the page feel endless."],
  ["Raw proof", "90 days", "Enough to debug sources, exports, and campaign questions."],
  ["Monthly rollups", "24 months", "Best for annual review, renewal, and offer proof."],
];

export function MorningBriefExperience({
  brief,
  totals,
}: {
  brief: MorningBriefData;
  totals: Totals;
}) {
  const [view, setView] = useState<ViewKey>("today");
  const [proofOpen, setProofOpen] = useState(false);
  const primarySignal = brief.marketSignals[0] ?? "Scout brings one useful market signal each morning.";

  const selectedContent = useMemo(() => {
    if (view === "sources") return <SourcesView brief={brief} />;
    if (view === "custom") return <CustomView />;
    if (view === "pricing") return <PricingView />;
    return <TodayView brief={brief} totals={totals} />;
  }, [view, brief, totals]);

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <a href="/mike-mc" className="nav-chip">
                  Mission Control
                </a>
                <a href="/mike-mc/jobs" className="nav-chip">
                  Jobs
                </a>
                <span className="status-chip">Mike view</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                AOH Owner Brief
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Mike&apos;s Morning Brief
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Your daily operating page for Reach results, market signals, owner decisions, and the custom sources still waiting to be connected.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Outreach sent" value={totals.sent.toString()} />
              <HeroMetric label="Delivery rate" value={`${totals.deliveredPct}%`} tone="green" />
              <HeroMetric label="Open rate" value={`${totals.openedPct}%`} tone="amber" />
            </div>
          </div>

          <BriefGraphic brief={brief} totals={totals} />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#eef6f2]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="grid gap-3 lg:grid-cols-[220px_1fr] lg:items-center">
            <p className="text-sm font-semibold text-emerald-900">News / market signal</p>
            <p className="text-sm leading-6 text-slate-700">{primarySignal}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <SourceStrip brief={brief} />

        <div className="mb-7 mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              My operating page
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Today, sources, and my custom layer
            </h2>
          </div>
          <div className="inline-grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm md:grid-cols-4">
            <TabButton active={view === "today"} onClick={() => setView("today")} label="Today" />
            <TabButton active={view === "sources"} onClick={() => setView("sources")} label="Sources" />
            <TabButton active={view === "custom"} onClick={() => setView("custom")} label="My Custom" />
            <TabButton active={view === "pricing"} onClick={() => setView("pricing")} label="Pricing Later" />
          </div>
        </div>

        {selectedContent}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="mb-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                My archive
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Running brief history
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Keep daily briefs for 13 months, raw proof for 90 days, and monthly rollups for 24 months.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {retention.map(([label, value, note]) => (
              <article key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {brief.archive.slice(0, 6).map((item) => (
              <article key={item.file} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950">{item.date}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                    saved
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <button
          type="button"
          onClick={() => setProofOpen((value) => !value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          {proofOpen ? "Hide proof files" : "Show proof files"}
        </button>
        {proofOpen ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {[brief.currentFile, brief.statsFile, ...brief.proofUsed].filter(Boolean).map((item) => (
              <code key={item} className="truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                {item}
              </code>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function TodayView({ brief, totals }: { brief: MorningBriefData; totals: Totals }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="status-chip">Today&apos;s owner read</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {brief.date}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">What happened and what matters</h3>
        <div className="mt-4 space-y-3">
          {brief.commercialBrief.map((item) => (
            <BriefLine key={item} text={item} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-950">Needs Mike</h3>
        <div className="mt-4 space-y-3">
          {brief.needsMike.length ? (
            brief.needsMike.map((item) => <BriefLine key={item} text={item} tone="amber" />)
          ) : (
            <p className="text-sm text-slate-600">No owner action listed.</p>
          )}
        </div>
        <div className="mt-5 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Recommended move
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{brief.recommendedMove}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <SmallMetric label="Replies" value={totals.replied.toString()} />
          <SmallMetric label="Bounces" value={totals.bounced.toString()} />
          <SmallMetric label="Unsubs" value={totals.unsubscribed.toString()} />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <h3 className="text-2xl font-semibold text-slate-950">Agents working this brief</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agentOwners.map((item) => (
            <article key={item.agent} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{item.agent}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.job}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SourcesView({ brief }: { brief: MorningBriefData }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {sourceCards.map((item) => (
          <article key={item.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
              <span className={item.state === "Live" ? "status-chip" : item.state === "Started" ? "rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700" : "custom-chip"}>
                {item.state}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.shows}</p>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Owner</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{item.owner}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Where it is</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.where}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-950">Current source check</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {brief.sourceStatus.map((item) => (
            <BriefLine key={item} text={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CustomView() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="status-chip">Standard in my brief</span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">Already part of Mike&apos;s daily view</h3>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {standardIncludes.map((item) => (
            <FeaturePill key={item} label={item} />
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="custom-chip">My custom layer</span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">Connect only when I approve access</h3>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {customConnectors.map((item) => (
            <FeaturePill key={item} label={item} custom />
          ))}
        </div>
      </section>
    </div>
  );
}

function PricingView() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-950">How I would sell this later</h3>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Lead with owner clarity, not dashboards. Standard is the daily brief and running page. Custom is paid setup when agents connect to private systems.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {packaging.map((item) => (
          <article key={item.tier} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={item.tier.includes("Custom") ? "custom-chip" : "status-chip"}>{item.tier}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.setup}
              </span>
            </div>
            <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {pricingAnchors.map((item) => (
          <a
            key={item.vendor}
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300"
          >
            <p className="font-semibold text-slate-950">{item.vendor}</p>
            <p className="mt-2 font-mono text-sm font-semibold text-emerald-700">{item.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function SourceStrip({ brief }: { brief: MorningBriefData }) {
  const items = [
    ["Outreach stats", brief.stats.length ? "Live from HighLevel" : "Waiting on stats"],
    ["News", brief.marketSignals.length ? "Starter feeds live" : "Waiting on signal"],
    ["Calendar", "Custom connector next"],
    ["Email", "Custom connector next"],
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map(([label, value]) => (
        <article key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
        </article>
      ))}
    </div>
  );
}

function BriefGraphic({ brief, totals }: { brief: MorningBriefData; totals: Totals }) {
  return (
    <div className="relative min-w-0">
      <div className="absolute -right-4 top-6 hidden h-52 w-24 rounded-lg bg-amber-100 md:block" />
      <div className="relative min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-[#fbfaf6] p-5 shadow-2xl shadow-slate-200">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mike view</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{brief.date}</p>
          </div>
          <span className="status-chip">Owner page</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SmallMetric label="Sent" value={totals.sent.toString()} />
          <SmallMetric label="Delivery" value={`${totals.deliveredPct}%`} />
          <SmallMetric label="Open" value={`${totals.openedPct}%`} />
        </div>

        <div className="mt-5 space-y-3">
          {brief.stats.map((stat) => (
            <div key={stat.lane} className="grid grid-cols-[64px_minmax(0,1fr)_44px] items-center gap-3 sm:grid-cols-[96px_minmax(0,1fr)_54px]">
              <p className="text-sm font-semibold text-slate-700">{laneLabel(stat.lane)}</p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, stat.openedPct)}%` }} />
              </div>
              <p className="text-right font-mono text-sm text-slate-600">{stat.openedPct}%</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Next move
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{brief.recommendedMove}</p>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "green" | "amber" }) {
  const color = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-slate-950";
  return (
    <div className="rounded-lg border border-slate-200 bg-[#fbfaf6] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BriefLine({ text, tone = "green" }: { text: string; tone?: "green" | "amber" }) {
  const dot = tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex gap-3">
      <span className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
      <p className="text-base leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function FeaturePill({ label, custom }: { label: string; custom?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${custom ? "border-amber-200 bg-white text-amber-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {custom ? "Custom: " : ""}
      {label}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function laneLabel(lane: string) {
  if (lane === "ai") return "AI";
  return lane.charAt(0).toUpperCase() + lane.slice(1);
}
