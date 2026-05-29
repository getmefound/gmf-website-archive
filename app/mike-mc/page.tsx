import type { Metadata } from "next";
import Link from "next/link";
import {
  AgentCard,
  ControlShell,
  FleetStrip,
  Pill,
  type AgentStatus,
  type OwnedRow,
} from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import {
  BOARD_COLUMNS,
  BOARD_TASKS,
  SCHEDULED_WORK,
  SERVICES,
  type BoardStatus,
  type BoardTask,
  type MissionTone,
} from "@/lib/control/mission";
import { getControlData } from "@/lib/control/fetchers";
import {
  getMondayAgentJobsOverview,
  type MondayAgentJobsOverview,
  type MondayAgentJobRow,
} from "@/lib/control/monday-agent-jobs";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "The Hub",
  description: "GMF operator console.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const MC_BOOKMARKS = [
  { label: "Hub", href: "/mike-mc" },
  { label: "Workflows", href: "/mike-mc/workflows" },
  { label: "Team", href: "/mike-mc/team" },
  { label: "Clients", href: "/mike-mc/clients" },
  { label: "Setup Jobs", href: "/mike-mc/setup-jobs" },
  { label: "Sentinel", href: "/mike-mc/sentinel" },
  { label: "Ops Index", href: "/mike-mc/ops" },
  { label: "Agent Jobs", href: "/mike-mc/jobs" },
  { label: "Morning Brief", href: "/mike-mc/morning-brief" },
  { label: "Visibility Reports", href: "/mike-mc/visibility-reports" },
  { label: "Review Proof", href: "/mike-mc/review-proof/ai-outsource-hub" },
  { label: "Review Replies", href: "/mike-mc/review-replies/ai-outsource-hub" },
  { label: "Report Flow", href: "/mike-mc/report-flow" },
  { label: "Campaigns", href: "/mike-mc/campaigns" },
  { label: "Cancer Research", href: "/mike-mc/cancer-research" },
];

const OVERSIGHT_LINKS = [
  {
    label: "Sentinel",
    href: "/mike-mc/sentinel",
    detail: "Independent daily audit of agent efficiency, stuck work, prospecting, retention, and next improvements.",
    tone: "hot" as const,
  },
  {
    label: "Workflows",
    href: "/mike-mc/workflows",
    detail: "Every GMF workflow, status, agent chain, counters, and weekly check.",
    tone: "accent" as const,
  },
  {
    label: "Visibility Reports",
    href: "/mike-mc/visibility-reports",
    detail: "Prospect free checks and client onboarding baselines in one owner queue.",
    tone: "accent" as const,
  },
  {
    label: "Clients",
    href: "/mike-mc/clients",
    detail: "Client profiles, review links, POS notes, plan, and voice settings.",
    tone: "warm" as const,
  },
  {
    label: "Setup Jobs",
    href: "/mike-mc/setup-jobs",
    detail: "Google Business Profile, access, intake, and launch work.",
    tone: "default" as const,
  },
  {
    label: "Review Proof",
    href: "/mike-mc/review-proof/ai-outsource-hub",
    detail: "Review request proof path for client-zero testing.",
    tone: "default" as const,
  },
  {
    label: "Review Replies",
    href: "/mike-mc/review-replies/ai-outsource-hub",
    detail: "AI reply draft queue and brand-safety review.",
    tone: "default" as const,
  },
  {
    label: "Ops Docs",
    href: "/mike-mc/ops",
    detail: "Operating docs, agent training, and recovery map.",
    tone: "muted" as const,
  },
];

const AGENTS: {
  name: string;
  role: string;
  status: AgentStatus;
  cadence: string;
  activity: {
    lastDone?: string;
    doingNow: string;
    upNext: string;
  };
  rows: OwnedRow[];
}[] = [
  {
    name: "Manager",
    role: "Runs the company day to day",
    status: "live",
    cadence: "daily",
    activity: {
      lastDone: "Narrowed GMF to Google visibility, review generation, review replies, and AI readiness.",
      doingNow: "Routes every job to the right agent and keeps Mike out of routine work.",
      upNext: "Escalate only access, spending, risk, or client-approval issues.",
    },
    rows: [
      { primary: "Owner brief", secondary: "Short status, blockers, and next decision.", badge: { tone: "accent", label: "daily" } },
      { primary: "Exception handling", secondary: "Only asks Mike when agents cannot proceed safely.", badge: { tone: "warm", label: "gate" } },
      { primary: "Weekly audit", secondary: "Confirms workflows still match the offer.", badge: { tone: "default", label: "weekly" } },
    ],
  },
  {
    name: "Profile Manager",
    role: "Google Business Profile and local visibility",
    status: "manual",
    cadence: "per client",
    activity: {
      doingNow: "Owns Get Found and Stay Found checks.",
      upNext: "Run GMF as client-zero before the first outside client.",
    },
    rows: [
      { primary: "Get Found", secondary: "Profile, categories, services, hours, NAP, website, schema, review path.", badge: { tone: "accent", label: "$149" } },
      { primary: "Stay Found", secondary: "Weekly GBP post, email review requests, included website hosting, monitoring, and owner recap.", badge: { tone: "warm", label: "$99/mo" } },
      { primary: "Access rule", secondary: "Client grants access; no password sharing.", badge: { tone: "danger", label: "safe" } },
    ],
  },
  {
    name: "Reviews Manager",
    role: "Stay Found review owner",
    status: "manual",
    cadence: "per client",
    activity: {
      doingNow: "Owns email and compliant SMS review request flow after POS, upload, or job-complete events.",
      upNext: "Move proof into GMF-owned Supabase client records and monthly reports.",
    },
    rows: [
      { primary: "Stay Found", secondary: "SMS/email requests, suppressions, review link, AI reply drafts, included hosting, and proof report.", badge: { tone: "accent", label: "$99/mo" } },
      { primary: "POS path", secondary: "Manual upload first, export/API later when ready.", badge: { tone: "warm", label: "staged" } },
      { primary: "SMS rule", secondary: "Do not rely on SMS until compliance is approved.", badge: { tone: "warn", label: "hold" } },
    ],
  },
  {
    name: "Reply Writer",
    role: "AI review replies in the client's voice",
    status: "manual",
    cadence: "as reviews arrive",
    activity: {
      doingNow: "Drafts replies using the client's voice profile.",
      upNext: "Graduate safe reply types only after Manager and Auditor approval.",
    },
    rows: [
      { primary: "Review Replies", secondary: "Included in Stay Found; draft-only first, approval before posting.", badge: { tone: "warm", label: "included" } },
      { primary: "Escalations", secondary: "Refunds, safety, legal, staff accusations, and regulated topics hold for human review.", badge: { tone: "danger", label: "hold" } },
      { primary: "Voice profile", secondary: "Tone, phrases, banned phrases, and examples.", badge: { tone: "accent", label: "trained" } },
    ],
  },
  {
    name: "Systems Director",
    role: "Tools, database, access, and cost safety",
    status: "building",
    cadence: "weekly",
    activity: {
      doingNow: "Keeps Supabase, Vercel, docs, email tools, and recovery paths aligned.",
      upNext: "Keep the GMF-owned stack clean and archive legacy dependencies.",
    },
    rows: [
      { primary: "Stack health", secondary: "Supabase, Vercel, GitHub, Google, Smartlead, Namecheap, Obsidian.", badge: { tone: "accent", label: "watch" } },
      { primary: "Cost watch", secondary: "Prevent surprise charges and dead subscriptions.", badge: { tone: "warm", label: "weekly" } },
      { primary: "Paid AI controls", secondary: "Legacy or vendor AI features stay off unless Mike explicitly approves.", badge: { tone: "danger", label: "rule" } },
    ],
  },
  {
    name: "Auditor",
    role: "Quality, safety, and stuck-job review",
    status: "building",
    cadence: "weekly",
    activity: {
      doingNow: "Checks workflows, approvals, bad loops, and missing proof.",
      upNext: "Create a short exception report for Manager.",
    },
    rows: [
      { primary: "Workflow check", secondary: "Every workflow gets a weekly readiness check.", badge: { tone: "accent", label: "weekly" } },
      { primary: "Loop detection", secondary: "If an agent is stuck, Auditor names the problem and next fix.", badge: { tone: "warn", label: "stop" } },
      { primary: "Human ask", secondary: "If Mike or client is needed, Manager approves the message.", badge: { tone: "warm", label: "approve" } },
    ],
  },
  {
    name: "Sentinel",
    role: "Independent business improvement auditor",
    status: "live",
    cadence: "daily",
    activity: {
      lastDone: "Generated the first business improvement audit and watchdog-linked operating score.",
      doingNow: "Grades operations, prospecting, and client success while surfacing improvement decisions for Mike.",
      upNext: "Send a compact morning report with up to five useful links and the hottest opportunities.",
    },
    rows: [
      { primary: "Efficiency audit", secondary: "Agent work, timers, blockers, queues, and proof gaps.", badge: { tone: "hot", label: "daily" } },
      { primary: "Growth watch", secondary: "Prospecting, retention, and process improvement suggestions.", badge: { tone: "accent", label: "daily" } },
      { primary: "Owner decision queue", secondary: "Suggestions Mike can approve, reject, or ask Elon to route.", badge: { tone: "warm", label: "decide" } },
    ],
  },
  {
    name: "Coach",
    role: "Trains agents and keeps the offer simple",
    status: "building",
    cadence: "weekly",
    activity: {
      doingNow: "Trained on GMF-only offers and the autonomous operating model.",
      upNext: "Keep agent knowledge updated as pages, pricing, and workflows change.",
    },
    rows: [
      { primary: "Training pack", secondary: "docs/GMF_AGENT_TRAINING_PACK.md", badge: { tone: "accent", label: "ready" } },
      { primary: "Company OS", secondary: "docs/GMF_COMPANY_OPERATING_SYSTEM.md", badge: { tone: "accent", label: "ready" } },
      { primary: "Offer boundary", secondary: "Reach belongs to a future separate company, not GMF.", badge: { tone: "warn", label: "scope" } },
    ],
  },
  {
    name: "Scout",
    role: "Market watch and opportunity research",
    status: "planned",
    cadence: "weekly",
    activity: {
      doingNow: "Watches Google/local-search changes and competitor positioning.",
      upNext: "Feed Manager simple offer adjustments and talking points.",
    },
    rows: [
      { primary: "Google change watch", secondary: "Search, AI Mode, profile, and review trends.", badge: { tone: "accent", label: "watch" } },
      { primary: "Competitor scan", secondary: "Find what local agencies are charging and promising.", badge: { tone: "muted", label: "soon" } },
    ],
  },
  {
    name: "Account Manager",
    role: "Client communication and reports",
    status: "building",
    cadence: "monthly",
    activity: {
      doingNow: "Owns client communication after signup and turns agent work into simple client-facing recaps.",
      upNext: "Test the Stay Found recap template and finish the monthly review report format.",
    },
    rows: [
      { primary: "Client recap", secondary: "What changed, what happened, what is next.", badge: { tone: "accent", label: "plain" } },
      { primary: "Upgrade cues", secondary: "Locked or future features show when they truly help.", badge: { tone: "warm", label: "upsell" } },
    ],
  },
];

export default async function ControlPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const [data, mondayOverview] = await Promise.all([
    getControlData(),
    getMondayAgentJobsOverview(),
  ]);
  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dataSources = {
    vercel: !!data.deploy,
    githubWebsite: !!data.commitsWebsite,
    githubTooling: !!data.commitsTooling,
    mondayJobs: mondayOverview.ok,
    missionData: Boolean(BOARD_TASKS.length || SCHEDULED_WORK.length),
  };
  const liveSources = Object.values(dataSources).filter(Boolean).length;

  return (
    <ControlShell>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Operator
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            The Hub
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {dateLine}. Manager runs the agents. Mike oversees decisions, approvals, risks, and money.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone={liveSources === 5 ? "accent" : liveSources > 0 ? "warm" : "warn"}>
            {liveSources}/5 sources live
          </Pill>
          <Pill tone="accent">GMF-only</Pill>
          <Pill tone="warm">legacy archived</Pill>
        </div>
      </header>

      <BookmarkSection />

      <section className="mb-8">
        <FleetStrip
          active={7}
          total={AGENTS.length}
          doneToday={mondayOverview.totals.completed || BOARD_TASKS.length}
          queued={mondayOverview.totals.started || SCHEDULED_WORK.length}
        />
      </section>

      <LiveJobOverviewSection overview={mondayOverview} />
      <OwnerCommandSection />
      <OversightLinksSection />
      <AgentFleetSection />
      <ServiceMapSection />
      <MissionBoardSection />
      <ScheduledWorkSection />

      <footer className="mt-12 border-t border-zinc-800/60 pt-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          GMF - autonomous operating system - Vercel / GitHub / Supabase / Monday / Google
        </p>
      </footer>
    </ControlShell>
  );
}

function LiveJobOverviewSection({ overview }: { overview: MondayAgentJobsOverview }) {
  const totals = overview.totals;

  return (
    <section className="mb-8 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            Monday live queue
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Jobs started, moving, waiting, and completed
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Waiting is external only. Agent handoffs stay active as Agent Working or Ready For Review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {overview.boardUrl ? (
            <Link
              href={overview.boardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              Open Monday
            </Link>
          ) : null}
          <Pill tone={overview.ok ? "accent" : "danger"}>{overview.ok ? "live" : "offline"}</Pill>
        </div>
      </div>

      {!overview.ok ? (
        <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {overview.error}
        </div>
      ) : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <QueueMetric label="Started" value={totals.started} tone="accent" />
        <QueueMetric label="In progress" value={totals.inProgress} tone="accent" />
        <QueueMetric label="Review" value={totals.review} tone="warm" />
        <QueueMetric label="True waiting" value={totals.trueWaiting} tone={totals.trueWaiting ? "warm" : "muted"} />
        <QueueMetric label="Human needed" value={totals.humanNeeded} tone={totals.humanNeeded ? "danger" : "muted"} />
        <QueueMetric label="Completed" value={totals.completed} tone="accent" />
        <QueueMetric label="Rescue" value={totals.needsRescue} tone={totals.needsRescue ? "danger" : "muted"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <QueueList
          title="Active now"
          empty="No active agent jobs found."
          rows={overview.activeRows}
        />
        <div className="grid gap-4">
          <QueueList
            title="Ready for review"
            empty="No review queue."
            rows={overview.reviewRows}
            compact
          />
          <QueueList
            title="True waiting"
            empty="No external/client/owner waiting rows."
            rows={overview.waitingRows}
            compact
          />
          <QueueList
            title="Completed"
            empty="No completed rows returned."
            rows={overview.completedRows}
            compact
          />
        </div>
      </div>

      {overview.rescueRows.length ? (
        <div className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-rose-100">Needs rescue</h3>
            <Pill tone="danger">{overview.rescueRows.length}</Pill>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {overview.rescueRows.map((row) => (
              <QueueRow key={row.id} row={row} compact />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function BookmarkSection() {
  return (
    <nav className="mb-8 rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-4" aria-label="Mike Command Center bookmarks">
      <div className="flex flex-wrap gap-2">
        {MC_BOOKMARKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md border border-zinc-800 bg-black/20 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function OwnerCommandSection() {
  return (
    <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
            How the company runs
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Manager is the right hand. Agents do the work. Mike approves exceptions.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            GMF sells a simple ladder: Get Found, Stay Found, and Always Ready. Review replies and voice automation stay approval-gated. Cold outbound stays separate from client delivery.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Core offers" value="3" />
          <Metric label="Upgrade target" value="$299" />
          <Metric label="Owner asks" value="exceptions" />
          <Metric label="Weekly check" value="required" />
        </div>
      </div>
    </section>
  );
}

function OversightLinksSection() {
  return (
    <section className="mb-8">
      <SectionHeader
        eyebrow="Owner oversight"
        title="Where Mike looks"
        sub="These are the pages that matter. The system should push only decisions and exceptions up to you."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {OVERSIGHT_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-snug text-zinc-100">
                {link.label}
              </h3>
              <Pill tone={link.tone}>{link.label === "Workflows" ? "main" : "view"}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{link.detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AgentFleetSection() {
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Agents"
        title="Who runs what"
        sub="Each agent has a narrow lane, clear escalation rules, and a weekly check through Manager and Auditor."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.name}
            name={agent.name}
            role={agent.role}
            status={agent.status}
            cadence={agent.cadence}
            activity={agent.activity}
            ownedTitle="Owns"
            ownedRows={agent.rows}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceMapSection() {
  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Services"
        title="Offerings -> agents -> skills"
        sub="Built as client x service x task so this can scale past 50 clients without one giant board."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SERVICES.map((service) => (
          <article
            key={service.slug}
            className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 shadow-xl shadow-black/30"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  {service.job}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-50">
                  {service.name}
                </h2>
              </div>
              <div className="flex gap-1.5">
                <Pill tone={service.blocked > 0 ? "warn" : "accent"}>
                  {service.openTasks} open
                </Pill>
                <Pill tone="muted">{service.activeClients} clients</Pill>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {service.outcome}
            </p>
            <LabelList label="Agents" items={service.agents} />
            <LabelList label="Skills" items={service.skills} muted />
          </article>
        ))}
      </div>
    </section>
  );
}

function MissionBoardSection() {
  const grouped = new Map<BoardStatus, BoardTask[]>();
  for (const column of BOARD_COLUMNS) grouped.set(column, []);
  for (const task of BOARD_TASKS) grouped.get(task.status)?.push(task);

  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Mission board"
        title="Work queue"
        sub="Manager owns task state. Mike should only see stuck work, approvals, and money/risk decisions."
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
        {BOARD_COLUMNS.map((column) => (
          <div
            key={column}
            className="min-h-48 rounded-2xl border border-zinc-800/60 bg-black/20 p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                {column}
              </h3>
              <Pill tone="muted">{grouped.get(column)?.length ?? 0}</Pill>
            </div>
            <div className="space-y-2">
              {(grouped.get(column) ?? []).map((task) => (
                <TaskCard key={task.title} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScheduledWorkSection() {
  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Planned checks"
        title="Recurring checks"
        sub="These are the checks to automate as clients grow."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SCHEDULED_WORK.map((item) => (
          <article
            key={`${item.cadence}-${item.title}`}
            className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  {item.cadence}
                </p>
                <h3 className="mt-1 text-base font-semibold text-zinc-50">
                  {item.title}
                </h3>
              </div>
              <Pill tone="accent">{item.owner}</Pill>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-zinc-500">
              {item.reason}
            </p>
            <LabelList label="Checks" items={item.checks} muted />
          </article>
        ))}
      </div>
    </section>
  );
}

function QueueMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: MissionTone;
}) {
  const color = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    hot: "text-rose-300",
    warn: "text-amber-300",
    ok: "text-emerald-300",
    muted: "text-zinc-500",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${color}`}>
        {value}
      </p>
    </div>
  );
}

function QueueList({
  title,
  empty,
  rows,
  compact = false,
}: {
  title: string;
  empty: string;
  rows: MondayAgentJobRow[];
  compact?: boolean;
}) {
  return (
    <section className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-zinc-50">{title}</h3>
        <Pill tone="muted">{rows.length}</Pill>
      </div>
      <div className="space-y-2">
        {rows.length ? (
          rows.map((row) => <QueueRow key={row.id} row={row} compact={compact} />)
        ) : (
          <p className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-zinc-500">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}

function QueueRow({ row, compact = false }: { row: MondayAgentJobRow; compact?: boolean }) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{row.name}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {row.agentOwner || row.nextOwner || "Unassigned"} {row.group ? `- ${row.group}` : ""}
          </p>
        </div>
        <Pill tone={queueStatusTone(row)}>{row.status || row.runtimeState || "open"}</Pill>
      </div>
      {!compact ? (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {row.nextAction || row.waitingState || "No next action recorded."}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {row.runtimeState ? <Pill tone="muted">{row.runtimeState}</Pill> : null}
        {row.waitingState ? <Pill tone="muted">{row.waitingState}</Pill> : null}
        {row.handoffAck ? <Pill tone="accent">{row.handoffAck}</Pill> : null}
        {row.expectedReceive ? <Pill tone="warm">{shortTimestamp(row.expectedReceive)}</Pill> : null}
      </div>
    </article>
  );
}

function queueStatusTone(row: MondayAgentJobRow): MissionTone {
  if (row.status === "Done") return "accent";
  if (row.humanNeeded === "Yes" || row.status === "Human Needed") return "danger";
  if (row.status === "Ready For Review") return "warm";
  if (row.status.startsWith("Waiting")) return "warn";
  if (row.status === "Agent Working") return "accent";
  return "muted";
}

function shortTimestamp(value: string) {
  const match = value.match(/^\d{4}-\d{2}-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[2]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${match[1]} ${hour12}:${match[3]} ${suffix}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">
        {value}
      </p>
    </div>
  );
}

function TaskCard({ task }: { task: BoardTask }) {
  const tone = priorityTone(task.priority);

  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug text-zinc-100">
          {task.title}
        </h4>
        <Pill tone={tone}>{task.priority}</Pill>
      </div>
      <div className="space-y-1 text-xs text-zinc-500">
        <p>Client: {task.client}</p>
        <p>Owner: {task.agent}</p>
        <p>Reviewer: {task.reviewer ?? "Manager"}</p>
        <p>Due: {task.due}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="mb-5 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{sub}</p>
    </header>
  );
}

function LabelList({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-md border px-2 py-1 text-xs ${
              muted
                ? "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function priorityTone(priority: BoardTask["priority"]): MissionTone {
  if (priority === "P0") return "danger";
  if (priority === "P1") return "warm";
  if (priority === "P2") return "accent";
  return "muted";
}
