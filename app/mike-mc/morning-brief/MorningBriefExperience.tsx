"use client";

import { useMemo, useState } from "react";
import type { MondayAgentJobsOverview, MondayAgentJobRow } from "@/lib/control/monday-agent-jobs";
import type { MorningBriefData, SlackOwnerSignals } from "@/lib/control/morning-brief";

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

type ViewKey = "owner" | "agents" | "prospecting" | "sources";

type OwnerAction = {
  id: string;
  title: string;
  ask: string;
  source: string;
  owner: string;
  due: string;
  status: string;
  proof?: string;
  tone: "danger" | "warm" | "accent" | "muted";
};

const nicheRanking = [
  ["Medical spas / aesthetic clinics", "Primary Monday recommendation", "30 max if QA supports it"],
  ["Dentists / cosmetic and implant dental", "Strong second test", "More compliance review"],
  ["Pet grooming / boarding / daycare", "Reply-friendly fallback", "Lower ticket"],
  ["HVAC / plumbing / roofing", "High-value future lane", "Needs fresh QA batch"],
  ["Assisted living / senior living", "High value, sensitive", "Dedicated careful copy"],
];

export function MorningBriefExperience({
  brief,
  totals,
  mondayOverview,
  slackSignals,
}: {
  brief: MorningBriefData;
  totals: Totals;
  mondayOverview: MondayAgentJobsOverview;
  slackSignals: SlackOwnerSignals;
}) {
  const [view, setView] = useState<ViewKey>("owner");
  const ownerActions = useMemo(
    () => buildOwnerActions({ brief, mondayOverview, slackSignals }),
    [brief, mondayOverview, slackSignals],
  );
  const activeWithoutOwner = mondayOverview.activeRows.filter((row) => row.humanNeeded !== "Yes");
  const topAction = ownerActions[0];
  const currentTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap gap-2" aria-label="Mission Control">
              <a href="/mike-mc" className="nav-chip">
                Mission Control
              </a>
              <a href="/mike-mc/jobs" className="nav-chip">
                Jobs
              </a>
              <a href="/mike-mc/sentinel" className="nav-chip">
                Sentinel
              </a>
            </nav>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {currentTime} ET
            </span>
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-700">GMF owner brief</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-950 md:text-5xl">
                Mike&apos;s Morning Brief
              </h1>
              <p className="mt-4 max-w-3xl break-words text-base leading-7 text-slate-600">
                Owner actions first, agent work next, proof underneath.
              </p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <ScoreTile label="Owner actions" value={ownerActions.length.toString()} tone={ownerActions.length ? "danger" : "accent"} />
              <ScoreTile label="Agents active" value={mondayOverview.totals.inProgress.toString()} tone="accent" />
              <ScoreTile label="Human-needed Monday" value={mondayOverview.totals.humanNeeded.toString()} tone={mondayOverview.totals.humanNeeded ? "warm" : "muted"} />
              <ScoreTile label="Sentinel grade" value={brief.businessAudit.efficiencyScore} tone="warm" />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-[#fffaf0]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <p className="font-semibold text-amber-900">Start here</p>
            <p className="min-w-0 break-words text-sm leading-6 text-amber-950">
              {topAction
                ? `${topAction.title}: ${topAction.ask}`
                : "No owner action is currently marked as required. Agents continue the queue and escalate only true decisions."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Owner action queue</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">What Mike needs to do</h2>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            {mondayOverview.boardUrl ? (
              <a
                href={mondayOverview.boardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
              >
                Open Monday
              </a>
            ) : null}
            <span className={slackSignals.ok ? "status-chip" : "custom-chip"}>
              Slack {slackSignals.ok ? "read" : "limited"}
            </span>
            <span className={mondayOverview.ok ? "status-chip" : "custom-chip"}>
              Monday {mondayOverview.ok ? "live" : "limited"}
            </span>
          </div>
        </div>

        {ownerActions.length ? (
          <div className="grid min-w-0 gap-4 lg:grid-cols-3">
            {ownerActions.map((action) => (
              <OwnerActionCard key={action.id} action={action} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950">
            No owner action is marked as required. Manager and agents continue working from Monday, Mission Control, and proof docs.
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <LiveStateCard label="Smartlead campaign" value="Paused" detail="No prospect sends before approval." tone="warm" />
            <LiveStateCard label="Outreach inboxes" value="Healthy" detail="3 inboxes ready; 0 spam; 100 reputation." tone="accent" />
            <LiveStateCard label="Casey mailbox" value="Owner gate" detail="First-login and reply proof still needed." tone="danger" />
            <LiveStateCard label="Southington GBP" value="Agent working" detail="Profile Manager timer due today at noon ET." tone="muted" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Operating view</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Morning control surface</h2>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm md:grid-cols-4">
            <TabButton active={view === "owner"} onClick={() => setView("owner")} label="Owner" />
            <TabButton active={view === "agents"} onClick={() => setView("agents")} label="Agents" />
            <TabButton active={view === "prospecting"} onClick={() => setView("prospecting")} label="Prospecting" />
            <TabButton active={view === "sources"} onClick={() => setView("sources")} label="Sources" />
          </div>
        </div>

        {view === "owner" ? <OwnerView brief={brief} slackSignals={slackSignals} /> : null}
        {view === "agents" ? <AgentsView brief={brief} mondayOverview={mondayOverview} activeRows={activeWithoutOwner} /> : null}
        {view === "prospecting" ? <ProspectingView totals={totals} /> : null}
        {view === "sources" ? <SourcesView brief={brief} slackSignals={slackSignals} mondayOverview={mondayOverview} /> : null}
      </section>
    </main>
  );
}

function OwnerView({ brief, slackSignals }: { brief: MorningBriefData; slackSignals: SlackOwnerSignals }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section>
        <SectionTitle label="Today's read" title="What happened and what matters" />
        <div className="mt-4 grid gap-3">
          {brief.commercialBrief.map((item) => (
            <TextCard key={item} text={item} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle label="Recommended move" title="Best next decision" />
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-base leading-7 text-slate-700">{brief.recommendedMove}</p>
        </div>
        <div className="mt-4 grid gap-3">
          <SignalCard label="Main constraint" value={brief.businessAudit.mainConstraint} />
          <SignalCard label="Slack owner asks" value={slackSignals.signals.length ? `${slackSignals.signals.length} recent ask(s) found` : slackSignals.error || "No recent owner-needed Slack asks found."} />
        </div>
      </section>
    </div>
  );
}

function AgentsView({
  brief,
  mondayOverview,
  activeRows,
}: {
  brief: MorningBriefData;
  mondayOverview: MondayAgentJobsOverview;
  activeRows: MondayAgentJobRow[];
}) {
  return (
    <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreTile label="Started" value={mondayOverview.totals.started.toString()} tone="accent" />
        <ScoreTile label="Review queue" value={mondayOverview.totals.review.toString()} tone="warm" />
        <ScoreTile label="True waiting" value={mondayOverview.totals.trueWaiting.toString()} tone={mondayOverview.totals.trueWaiting ? "warm" : "muted"} />
        <ScoreTile label="Needs rescue" value={mondayOverview.totals.needsRescue.toString()} tone={mondayOverview.totals.needsRescue ? "danger" : "muted"} />
      </div>

      <section>
        <SectionTitle label="Autonomous work" title="Agents running without Mike" />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {activeRows.length ? activeRows.map((row) => <JobCard key={row.id} row={row} />) : <TextCard text="No active agent rows returned from Monday." />}
        </div>
      </section>

      <section>
        <SectionTitle label="Sentinel" title="Process improvement queue" />
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {brief.businessAudit.processImprovements.map((item, index) => (
            <TextCard key={item} eyebrow={`Fix ${index + 1}`} text={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProspectingView({ totals }: { totals: Totals }) {
  return (
    <div className="space-y-7">
      <section>
        <SectionTitle label="Monday launch" title="Smartlead decision packet" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <LiveStateCard label="Recommended niche" value="Med spas" detail="Single-niche launch; do not mix copy unless approved." tone="accent" />
          <LiveStateCard label="Recommended cap" value="30 total" detail="10 per warmed inbox; 45 is aggressive; 60 is not recommended." tone="warm" />
          <LiveStateCard label="Launch state" value="Paused" detail="Mike approval required before resume, cap change, or list expansion." tone="danger" />
        </div>
      </section>

      <section>
        <SectionTitle label="Five niches" title="Sales Manager ranking" />
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {nicheRanking.map(([name, note, fit], index) => (
            <article key={name} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">#{index + 1}</p>
              <h3 className="mt-2 text-base font-semibold text-slate-950">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
              <p className="mt-3 text-sm font-semibold text-emerald-700">{fit}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle label="Outreach archive" title="Historical stats still visible" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <ScoreTile label="Sent" value={totals.sent.toString()} tone="muted" />
          <ScoreTile label="Delivered" value={`${totals.deliveredPct}%`} tone="muted" />
          <ScoreTile label="Opened" value={`${totals.openedPct}%`} tone="muted" />
          <ScoreTile label="Replies" value={totals.replied.toString()} tone="muted" />
          <ScoreTile label="Bounces" value={totals.bounced.toString()} tone={totals.bounced ? "warm" : "muted"} />
        </div>
      </section>
    </div>
  );
}

function SourcesView({
  brief,
  slackSignals,
  mondayOverview,
}: {
  brief: MorningBriefData;
  slackSignals: SlackOwnerSignals;
  mondayOverview: MondayAgentJobsOverview;
}) {
  const proof = [brief.currentFile, brief.statsFile, brief.businessAudit.sourceFile, ...brief.proofUsed].filter(Boolean);

  return (
    <div className="space-y-7">
      <section>
        <SectionTitle label="Source health" title="Where this page is reading from" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <LiveStateCard label="Monday" value={mondayOverview.ok ? "Live" : "Limited"} detail={mondayOverview.error || "Owner-needed rows and agent queue loaded."} tone={mondayOverview.ok ? "accent" : "danger"} />
          <LiveStateCard label="Slack DM" value={slackSignals.ok ? "Live" : "Limited"} detail={slackSignals.error || "Recent owner-needed DMs loaded."} tone={slackSignals.ok ? "accent" : "warm"} />
          <LiveStateCard label="Sentinel" value={brief.businessAudit.date || "Loaded"} detail={brief.businessAudit.mainConstraint} tone="warm" />
          <LiveStateCard label="Brief file" value={brief.date} detail="Current generated owner brief." tone="muted" />
        </div>
      </section>

      <section>
        <SectionTitle label="Proof" title="Files behind the brief" />
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {proof.map((item) => (
            <code key={item} className="min-w-0 break-all rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              {item}
            </code>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle label="Archive" title="Recent morning briefs" />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {brief.archive.slice(0, 6).map((item) => (
            <article key={item.file} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">{item.date}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function OwnerActionCard({ action }: { action: OwnerAction }) {
  return (
    <article className={`min-w-0 rounded-lg border bg-white p-5 shadow-sm ${borderTone(action.tone)}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${textTone(action.tone)}`}>{action.source}</p>
          <h3 className="mt-2 break-words text-xl font-semibold text-slate-950">{action.title}</h3>
        </div>
        <span className={chipTone(action.tone)}>{action.status}</span>
      </div>
      <p className="mt-4 break-words text-sm leading-6 text-slate-700">{action.ask}</p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-500">Owner</dt>
          <dd className="mt-1 break-words text-slate-900">{action.owner}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Due</dt>
          <dd className="mt-1 break-words text-slate-900">{action.due}</dd>
        </div>
      </dl>
      {action.proof ? <p className="mt-4 break-all text-xs leading-5 text-slate-500">{action.proof}</p> : null}
    </article>
  );
}

function JobCard({ row }: { row: MondayAgentJobRow }) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold text-slate-950">{row.name}</h3>
          <p className="mt-1 break-words text-sm text-slate-500">{row.agentOwner || row.nextOwner || "Agent owner not recorded"}</p>
        </div>
        <span className="status-chip">{row.status || row.runtimeState || "Active"}</span>
      </div>
      <p className="mt-3 break-words text-sm leading-6 text-slate-600">{row.nextAction || row.unlockProof || "No next action recorded."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {row.expectedReceive ? <span className="custom-chip">Expected {shortDate(row.expectedReceive)}</span> : null}
        {row.escalateAt ? <span className="custom-chip">Escalate {shortDate(row.escalateAt)}</span> : null}
      </div>
    </article>
  );
}

function TextCard({ text, eyebrow }: { text: string; eyebrow?: string }) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {eyebrow ? <p className="mb-2 text-sm font-semibold text-slate-500">{eyebrow}</p> : null}
      <p className="break-words text-sm leading-6 text-slate-700">{text}</p>
    </article>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-700">{value}</p>
    </article>
  );
}

function LiveStateCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "danger" | "warm" | "accent" | "muted";
}) {
  return (
    <article className={`min-w-0 rounded-lg border bg-white p-4 shadow-sm ${borderTone(tone)}`}>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 break-words text-2xl font-semibold ${textTone(tone)}`}>{value}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function ScoreTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "danger" | "warm" | "accent" | "muted";
}) {
  return (
    <article className={`min-w-0 rounded-lg border bg-white p-4 shadow-sm ${borderTone(tone)}`}>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 break-words text-3xl font-semibold ${textTone(tone)}`}>{value}</p>
    </article>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h2>
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

function buildOwnerActions({
  brief,
  mondayOverview,
  slackSignals,
}: {
  brief: MorningBriefData;
  mondayOverview: MondayAgentJobsOverview;
  slackSignals: SlackOwnerSignals;
}): OwnerAction[] {
  const rows = mondayOverview.humanRows;
  const actions: OwnerAction[] = [];
  const caseyRow = rows.find((row) => /email identity|sender routing|casey/i.test(row.name));
  const caseySignal = slackSignals.signals.find((signal) => /casey/i.test(`${signal.title} ${signal.action}`));
  if (caseyRow || caseySignal) {
    actions.push({
      id: "casey-mailbox",
      title: "Secure Casey mailbox",
      ask:
        caseySignal?.action ||
        "Complete Casey first-login security/reply proof, or approve a monitored fallback reply path for Monday launch.",
      source: caseySignal ? "Slack DM + Monday" : "Monday",
      owner: "Mike, then Systems Director",
      due: caseyRow?.expectedReceive ? shortDate(caseyRow.expectedReceive) : "Today",
      status: "Owner gate",
      proof: caseyRow?.proofText,
      tone: "danger",
    });
  }

  const smartleadRows = rows.filter((row) => /smartlead/i.test(row.name));
  if (smartleadRows.length) {
    actions.push({
      id: "smartlead-approval",
      title: "Decide Monday prospecting launch",
      ask: "Review the five-niche packet, then approve med-spa-only, choose another niche, approve a split test, or hold. Campaign stays paused until this decision.",
      source: "Monday",
      owner: "Mike + Elon",
      due: shortDate(smartleadRows[0].expectedReceive) || "Today",
      status: "Approval needed",
      proof: smartleadRows[0].proofText,
      tone: "warm",
    });
  }

  for (const row of rows) {
    if (/smartlead|email identity|sender routing|casey/i.test(row.name)) continue;
    actions.push({
      id: `monday-${row.id}`,
      title: row.name,
      ask: row.nextAction || row.unlockProof || "Review this Monday owner-needed row.",
      source: "Monday",
      owner: row.nextOwner || row.agentOwner || "Mike",
      due: shortDate(row.expectedReceive) || "Today",
      status: row.status || "Human Needed",
      proof: row.proofText,
      tone: "warm",
    });
  }

  for (const signal of slackSignals.signals) {
    if (/casey/i.test(`${signal.title} ${signal.action}`)) continue;
    actions.push({
      id: `slack-${signal.title}`,
      title: signal.title,
      ask: signal.action,
      source: signal.source,
      owner: "Mike",
      due: signal.timestamp || "Today",
      status: "Slack ask",
      tone: "warm",
    });
  }

  for (const item of brief.needsMike) {
    if (/^no mike action|no routine owner action/i.test(item)) continue;
    if (/smartlead|sender|casey|mailbox/i.test(item)) continue;
    actions.push({
      id: `brief-${item}`,
      title: "Morning brief ask",
      ask: item,
      source: "Morning brief",
      owner: "Mike",
      due: "Today",
      status: "Review",
      tone: "muted",
    });
  }

  return actions.slice(0, 6);
}

function shortDate(value: string) {
  const match = value.match(/^\d{4}-\d{2}-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[2]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `May ${match[1]}, ${hour12}:${match[3]} ${suffix} ET`;
}

function borderTone(tone: "danger" | "warm" | "accent" | "muted") {
  if (tone === "danger") return "border-rose-200";
  if (tone === "warm") return "border-amber-200";
  if (tone === "accent") return "border-emerald-200";
  return "border-slate-200";
}

function textTone(tone: "danger" | "warm" | "accent" | "muted") {
  if (tone === "danger") return "text-rose-700";
  if (tone === "warm") return "text-amber-700";
  if (tone === "accent") return "text-emerald-700";
  return "text-slate-700";
}

function chipTone(tone: "danger" | "warm" | "accent" | "muted") {
  if (tone === "danger") return "rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700";
  if (tone === "warm") return "rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700";
  if (tone === "accent") return "status-chip";
  return "rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600";
}
