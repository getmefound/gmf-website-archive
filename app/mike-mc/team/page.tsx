import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";

export const metadata: Metadata = {
  title: "AOH Org Chart - The Hub",
  description: "Internal AOH company-style organizational chart for human and agent roles.",
  robots: { index: false, follow: false },
};

type OrgTone = "executive" | "ops" | "revenue" | "delivery" | "systems";

type OrgRole = {
  title: string;
  person?: string;
  status: "human" | "live" | "manual" | "building" | "planned";
  summary: string;
  owns: string[];
  reportsTo?: string;
  tone: OrgTone;
};

const ROLES: OrgRole[] = [
  {
    title: "President",
    person: "Mike",
    status: "human",
    summary: "Approves direction, client-facing risk, pricing, tool changes, and final go/no-go calls.",
    owns: ["business decisions", "approvals", "client promises"],
    tone: "executive",
  },
  {
    title: "Chief of Staff",
    status: "planned",
    summary: "Prepares the morning brief, filters noise, and turns recommendations into a clean approval queue.",
    owns: ["morning brief", "approval queue", "daily agenda"],
    reportsTo: "President",
    tone: "executive",
  },
  {
    title: "General Manager",
    person: "Manager",
    status: "live",
    summary: "Runs the agent company day to day, assigns owners, tracks blockers, and escalates to Mike.",
    owns: ["job routing", "client risk triage", "fleet priorities"],
    reportsTo: "Chief of Staff",
    tone: "ops",
  },
  {
    title: "Systems Director",
    status: "planned",
    summary: "Owns IT, tool stack health, access, security, backups, costs, and whether new software is worth adding.",
    owns: ["OpenClaw", "VPS", "GitHub", "Vercel", "Slack", "GHL access", "backups"],
    reportsTo: "General Manager",
    tone: "systems",
  },
  {
    title: "GHL Expert",
    status: "live",
    summary: "Owns hub360ai/GHL setup, workflows, pipelines, tags, callbacks, reports, and automation health.",
    owns: ["GHL workflows", "pipelines", "calendars", "report delivery"],
    reportsTo: "General Manager",
    tone: "systems",
  },
  {
    title: "Local Visibility Manager",
    status: "building",
    summary: "Owns Google Business Profile access, profile health, citations, review links, and local/AI visibility signals.",
    owns: ["Google profile", "local visibility", "citations", "AI visibility checks"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Coach",
    status: "building",
    summary: "Keeps product truth, SOPs, sales language, client instructions, and response drafts aligned.",
    owns: ["SOPs", "pricing answers", "objection handling", "client-safe wording"],
    reportsTo: "General Manager",
    tone: "ops",
  },
  {
    title: "Scout",
    status: "live",
    summary: "Finds prospects, weak profiles, review gaps, niche signals, and cheap prefilter evidence.",
    owns: ["prospect research", "fit scoring", "source notes"],
    reportsTo: "General Manager",
    tone: "revenue",
  },
  {
    title: "Sender",
    status: "planned",
    summary: "Prepares outreach, watches deliverability, validates merge fields, and keeps campaigns reply-first.",
    owns: ["email campaigns", "follow-ups", "deliverability"],
    reportsTo: "General Manager",
    tone: "revenue",
  },
  {
    title: "Sorter",
    status: "planned",
    summary: "Classifies replies, catches hot leads, handles opt-outs, and routes unclear items for review.",
    owns: ["reply triage", "hot lead routing", "suppression"],
    reportsTo: "General Manager",
    tone: "revenue",
  },
  {
    title: "Booker",
    status: "planned",
    summary: "Turns buying intent into booked calls and keeps handoffs clean.",
    owns: ["booking links", "show-rate follow-up", "meeting handoff"],
    reportsTo: "General Manager",
    tone: "revenue",
  },
  {
    title: "Studio",
    status: "live",
    summary: "Creates approved visuals, assets, and eventually content variants for AOH and clients.",
    owns: ["creative assets", "visual drafts", "content production"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Editor",
    status: "manual",
    summary: "Chooses angles, priorities, brand voice, and what content is worth making.",
    owns: ["editorial plan", "angle selection", "voice review"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Press",
    status: "manual",
    summary: "Publishes approved content and records proof that it went out correctly.",
    owns: ["publishing", "scheduling", "proof of publish"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Reporter",
    status: "live",
    summary: "Confirms report links open, match the right contact, and tell a useful story.",
    owns: ["report QA", "delivery proof", "monthly reporting"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Scheduler",
    status: "live",
    summary: "Protects calendars, booking availability, reminders, and meeting context.",
    owns: ["AOH Talk", "calendar blocks", "meeting briefs"],
    reportsTo: "Chief of Staff",
    tone: "ops",
  },
];

const GROUPS = [
  { title: "Executive Office", roles: ["President", "Chief of Staff", "Scheduler"] },
  { title: "Operations", roles: ["General Manager", "Coach"] },
  { title: "Systems and IT", roles: ["Systems Director", "GHL Expert"] },
  { title: "Client Delivery", roles: ["Local Visibility Manager", "Studio", "Editor", "Press", "Reporter"] },
  { title: "Revenue", roles: ["Scout", "Sender", "Sorter", "Booker"] },
];

const STATUS_TONE: Record<OrgRole["status"], "accent" | "warm" | "muted" | "warn"> = {
  human: "accent",
  live: "accent",
  manual: "warm",
  building: "warm",
  planned: "muted",
};

const TONE_CLASS: Record<OrgTone, string> = {
  executive: "border-emerald-500/30 bg-emerald-500/10",
  ops: "border-sky-500/30 bg-sky-500/10",
  revenue: "border-violet-500/30 bg-violet-500/10",
  delivery: "border-amber-500/30 bg-amber-500/10",
  systems: "border-rose-500/30 bg-rose-500/10",
};

export default function OrgChartPage() {
  const liveCount = ROLES.filter((role) => role.status === "live" || role.status === "human").length;
  const plannedCount = ROLES.filter((role) => role.status === "planned").length;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            AOH Organizational Chart
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            A company-style view of the human and agent roles. Mike sits at the top, the Chief of Staff
            prepares the brief, Manager runs work, and specialist departments own the details.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </Link>
          <Pill tone="accent">{liveCount} live/human</Pill>
          <Pill tone="muted">{plannedCount} planned</Pill>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
        <OrgNode role={findRole("President")} large />
        <div className="flex flex-col justify-center gap-4">
          <ConnectorLabel text="morning brief and approvals" />
          <OrgNode role={findRole("Chief of Staff")} />
          <ConnectorLabel text="routes approved work" />
          <OrgNode role={findRole("General Manager")} />
        </div>
        <OrgNode role={findRole("Systems Director")} large />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {GROUPS.map((group) => (
          <div key={group.title} className="border-t border-zinc-800/70 pt-4">
            <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.roles.map((title) => (
                <OrgNode key={title} role={findRole(title)} compact={group.roles.length > 3} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </ControlShell>
  );
}

function OrgNode({ role, large = false, compact = false }: { role: OrgRole; large?: boolean; compact?: boolean }) {
  return (
    <article className={`rounded-2xl border p-4 ${TONE_CLASS[role.tone]} ${large ? "min-h-56" : ""}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {role.person ?? "Agent role"}
          </p>
          <h3 className={`${large ? "text-2xl" : "text-lg"} mt-1 font-semibold tracking-tight text-zinc-50`}>
            {role.title}
          </h3>
        </div>
        <Pill tone={STATUS_TONE[role.status]}>{role.status}</Pill>
      </div>
      {!compact && <p className="text-sm leading-relaxed text-zinc-300">{role.summary}</p>}
      {role.reportsTo && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          reports to {role.reportsTo}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {role.owns.slice(0, compact ? 2 : 4).map((item) => (
          <span key={item} className="rounded-md border border-zinc-700/60 bg-zinc-950/50 px-2 py-1 text-xs text-zinc-300">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function ConnectorLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-center">
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{text}</span>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

function findRole(title: string) {
  const role = ROLES.find((item) => item.title === title);
  if (!role) throw new Error(`Missing org role: ${title}`);
  return role;
}
