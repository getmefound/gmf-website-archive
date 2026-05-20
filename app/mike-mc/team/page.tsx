import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";

export const metadata: Metadata = {
  title: "AOH Company Directory - The Hub",
  description: "Internal AOH company-style directory for human and agent roles.",
  robots: { index: false, follow: false },
};

type OrgTone = "executive" | "ops" | "revenue" | "delivery" | "systems";

type OrgRole = {
  title: string;
  name: string;
  status: "human" | "live" | "manual" | "building" | "planned";
  summary: string;
  owns: string[];
  reportsTo?: string;
  tone: OrgTone;
};

const ROLES: OrgRole[] = [
  {
    title: "President",
    name: "Mike Egidio",
    status: "human",
    summary: "Approves direction, client-facing risk, pricing, tool changes, and final go/no-go calls.",
    owns: ["business decisions", "approvals", "client promises"],
    tone: "executive",
  },
  {
    title: "Chief of Staff",
    name: "Eleanor Brooks",
    status: "planned",
    summary: "Prepares the morning brief, filters noise, and turns recommendations into a clean approval queue.",
    owns: ["morning brief", "approval queue", "daily agenda"],
    reportsTo: "President",
    tone: "executive",
  },
  {
    title: "General Manager",
    name: "Grant Mercer",
    status: "live",
    summary: "Runs the agent company day to day, assigns owners, tracks blockers, and escalates to Mike.",
    owns: ["job routing", "client risk triage", "fleet priorities"],
    reportsTo: "Chief of Staff",
    tone: "ops",
  },
  {
    title: "Systems Director",
    name: "Martin Vale",
    status: "planned",
    summary: "Owns IT, tool stack health, access, security, backups, costs, and whether new software is worth adding.",
    owns: ["OpenClaw", "VPS", "GitHub", "Vercel", "Slack", "GHL access", "backups"],
    reportsTo: "General Manager",
    tone: "systems",
  },
  {
    title: "Sales Manager",
    name: "Clara Bennett",
    status: "building",
    summary: "Owns the revenue pipeline from campaign choice to booked calls, including when to pause, change, or scale outreach.",
    owns: ["campaign strategy", "sales pipeline", "reply follow-up", "booked-call handoff"],
    reportsTo: "General Manager",
    tone: "revenue",
  },
  {
    title: "Client Success Manager",
    name: "Dana Ellis",
    status: "planned",
    summary: "Owns whether clients are onboarded, happy, reported to, renewed, and not quietly ignored after the sale.",
    owns: ["onboarding health", "client check-ins", "renewals", "retention risks"],
    reportsTo: "General Manager",
    tone: "ops",
  },
  {
    title: "Hub",
    name: "Avery Cole",
    status: "planned",
    summary: "Answers account questions by reading the ledger, GHL, Drive, client notes, and delivery history.",
    owns: ["client Q&A", "account lookups", "status answers"],
    reportsTo: "Client Success Manager",
    tone: "ops",
  },
  {
    title: "GHL Expert",
    name: "Nolan Pierce",
    status: "live",
    summary: "Owns hub360ai/GHL setup, workflows, pipelines, tags, callbacks, reports, and automation health.",
    owns: ["GHL workflows", "pipelines", "calendars", "report delivery"],
    reportsTo: "Systems Director",
    tone: "systems",
  },
  {
    title: "Local Visibility Manager",
    name: "Elena Brooks",
    status: "building",
    summary: "Owns Google Business Profile access, profile health, citations, review links, and local/AI visibility signals.",
    owns: ["Google profile", "local visibility", "citations", "AI visibility checks"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
  },
  {
    title: "Reviews Manager",
    name: "Priya Shah",
    status: "planned",
    summary: "Owns review automation delivery, review request health, replies, reporting cadence, and review-volume warnings.",
    owns: ["review requests", "review reports", "reply health", "review velocity"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
  },
  {
    title: "Relay Manager",
    name: "Marcus Hale",
    status: "planned",
    summary: "Owns voice-agent delivery, missed-call recovery, call summaries, routing quality, and escalation issues.",
    owns: ["voice delivery", "call logs", "missed calls", "routing QA"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
  },
  {
    title: "Coach",
    name: "Thomas Reed",
    status: "building",
    summary: "Keeps product truth, SOPs, sales language, client instructions, and response drafts aligned.",
    owns: ["SOPs", "pricing answers", "objection handling", "client-safe wording"],
    reportsTo: "General Manager",
    tone: "ops",
  },
  {
    title: "Scout",
    name: "Nora Pierce",
    status: "live",
    summary: "Finds prospects, weak profiles, review gaps, niche signals, and cheap prefilter evidence.",
    owns: ["prospect research", "fit scoring", "source notes"],
    reportsTo: "Sales Manager",
    tone: "revenue",
  },
  {
    title: "Sender",
    name: "Leo Park",
    status: "planned",
    summary: "Prepares outreach, watches deliverability, validates merge fields, and keeps campaigns reply-first.",
    owns: ["email campaigns", "follow-ups", "deliverability"],
    reportsTo: "Sales Manager",
    tone: "revenue",
  },
  {
    title: "Sorter",
    name: "Isabel Chen",
    status: "planned",
    summary: "Classifies replies, catches hot leads, handles opt-outs, and routes unclear items for review.",
    owns: ["reply triage", "hot lead routing", "suppression"],
    reportsTo: "Sales Manager",
    tone: "revenue",
  },
  {
    title: "Booker",
    name: "Olivia Kane",
    status: "planned",
    summary: "Turns buying intent into booked calls and keeps handoffs clean.",
    owns: ["booking links", "show-rate follow-up", "meeting handoff"],
    reportsTo: "Sales Manager",
    tone: "revenue",
  },
  {
    title: "Engagement Scout",
    name: "Maya Collins",
    status: "planned",
    summary: "Finds social conversations worth entering and drafts comments or DM suggestions for approval.",
    owns: ["social listening", "comment drafts", "DM opportunities", "engagement log"],
    reportsTo: "Sales Manager",
    tone: "revenue",
  },
  {
    title: "Studio",
    name: "Jordan Vale",
    status: "live",
    summary: "Creates approved visuals, assets, and eventually content variants for AOH and clients.",
    owns: ["creative assets", "visual drafts", "content production"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Editor",
    name: "Vivian Hart",
    status: "manual",
    summary: "Chooses angles, priorities, brand voice, and what content is worth making.",
    owns: ["editorial plan", "angle selection", "voice review"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Press",
    name: "Miles Carter",
    status: "manual",
    summary: "Publishes approved content and records proof that it went out correctly.",
    owns: ["publishing", "scheduling", "proof of publish"],
    reportsTo: "General Manager",
    tone: "delivery",
  },
  {
    title: "Reporter",
    name: "Iris Bennett",
    status: "live",
    summary: "Confirms report links open, match the right contact, and tell a useful story.",
    owns: ["report QA", "delivery proof", "monthly reporting"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
  },
  {
    title: "Scheduler",
    name: "Grace Turner",
    status: "live",
    summary: "Protects calendars, booking availability, reminders, and meeting context.",
    owns: ["AOH Talk", "calendar blocks", "meeting briefs"],
    reportsTo: "Chief of Staff",
    tone: "ops",
  },
];

const DEPARTMENTS = [
  {
    title: "Executive Office",
    lead: "Chief of Staff",
    support: ["Scheduler"],
    note: "Briefs Mike and protects the approval queue.",
  },
  {
    title: "Company Operations",
    lead: "General Manager",
    support: ["Coach"],
    note: "Turns company priorities into assigned agent work.",
  },
  {
    title: "Systems and IT",
    lead: "Systems Director",
    support: ["GHL Expert"],
    note: "Keeps tools, access, costs, automations, and risk under control.",
  },
  {
    title: "Sales Department",
    lead: "Sales Manager",
    support: ["Scout", "Sender", "Sorter", "Booker", "Engagement Scout"],
    note: "Owns prospecting, outreach, replies, social opportunities, and booked calls.",
  },
  {
    title: "Client Success",
    lead: "Client Success Manager",
    support: ["Hub", "Reporter"],
    note: "Keeps clients onboarded, informed, retained, and visible in the ledger.",
  },
  {
    title: "Client Delivery",
    lead: "Local Visibility Manager",
    support: ["Reviews Manager", "Relay Manager"],
    note: "Owns the recurring client work AOH sells and monitors.",
  },
  {
    title: "Marketing Department",
    lead: "Editor",
    support: ["Studio", "Press"],
    note: "Plans, creates, and publishes approved AOH and client content.",
  },
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

const AVATAR_COLORS: Record<OrgTone, { dark: string; light: string; accent: string }> = {
  executive: { dark: "#052e24", light: "#34d399", accent: "#a7f3d0" },
  ops: { dark: "#082f49", light: "#38bdf8", accent: "#bae6fd" },
  revenue: { dark: "#3b0764", light: "#a78bfa", accent: "#ddd6fe" },
  delivery: { dark: "#451a03", light: "#f59e0b", accent: "#fde68a" },
  systems: { dark: "#4c0519", light: "#fb7185", accent: "#fecdd3" },
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
            AOH Company Directory
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            A company-style view of the human and agent roles. Each agent has a professional name,
            title, responsibility, reporting line, and owned lane.
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
        <div className="flex flex-col justify-center gap-4">
          <ConnectorLabel text="daily company scan" />
          <OrgNode role={findRole("Sales Manager")} />
          <OrgNode role={findRole("Client Success Manager")} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {DEPARTMENTS.map((department) => (
          <div key={department.title} className="border-t border-zinc-800/70 pt-4">
            <div className="mb-4 min-h-16">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
                {department.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{department.note}</p>
            </div>
            <OrgNode role={findRole(department.lead)} />
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {department.support.map((title) => (
                <OrgNode key={title} role={findRole(title)} compact />
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
    <article className={`rounded-lg border p-4 ${TONE_CLASS[role.tone]} ${large ? "min-h-56" : ""}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <AgentAvatar role={role} large={large} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {role.title}
            </p>
            <h3 className={`${large ? "text-2xl" : "text-lg"} mt-1 font-semibold tracking-tight text-zinc-50`}>
              {role.name}
            </h3>
          </div>
        </div>
        <Pill tone={STATUS_TONE[role.status]}>{role.status}</Pill>
      </div>
      {!compact && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          Responsibility
        </p>
      )}
      <p className={`${compact ? "text-xs" : "text-sm"} mt-1 leading-relaxed text-zinc-300`}>
        {role.summary}
      </p>
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

function AgentAvatar({ role, large = false }: { role: OrgRole; large?: boolean }) {
  const colors = AVATAR_COLORS[role.tone];
  const gradientId = `agent-avatar-${slugify(role.title)}`;
  const initials = getInitials(role.name);
  const size = large ? "h-16 w-16" : "h-12 w-12";

  return (
    <div className={`${size} shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-inner shadow-black/40`}>
      <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label={`${role.name} avatar`}>
        <defs>
          <linearGradient id={gradientId} x1="12" x2="84" y1="8" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor={colors.light} stopOpacity="0.9" />
            <stop offset="1" stopColor={colors.dark} />
          </linearGradient>
        </defs>
        <rect width="96" height="96" fill={`url(#${gradientId})`} />
        <circle cx="48" cy="38" r="19" fill="#f8fafc" opacity="0.92" />
        <path d="M18 91c5.2-19.5 16.2-29.2 30-29.2S72.8 71.5 78 91H18Z" fill="#f8fafc" opacity="0.9" />
        <circle cx="30" cy="24" r="13" fill={colors.accent} opacity="0.28" />
        <circle cx="74" cy="70" r="16" fill="#020617" opacity="0.18" />
        <text
          x="48"
          y="43"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.dark}
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          {initials}
        </text>
      </svg>
    </div>
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
