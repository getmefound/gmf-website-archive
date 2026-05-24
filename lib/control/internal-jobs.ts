export type ControlTone =
  | "default"
  | "accent"
  | "warm"
  | "hot"
  | "warn"
  | "ok"
  | "muted"
  | "danger";

export type ReachLane = {
  name: string;
  domain: string;
  status: string;
  rows: string;
  qa: string;
  importState: string;
  dripState: string;
  tone: ControlTone;
};

export type ReachStep = {
  order: number;
  agent: string;
  title: string;
  status: string;
  tone: ControlTone;
  whatHappened: string;
  leftToDo: string;
  evidence: string;
};

export type InternalJob = {
  slug: string;
  title: string;
  href: string;
  owner: string;
  status: string;
  statusTone: ControlTone;
  summary: string;
  currentBlocker: string;
  plainEnglish: string;
  metrics: {
    label: string;
    value: string;
    tone: ControlTone;
  }[];
  lanes: ReachLane[];
  steps: ReachStep[];
};

export type ReachWarmupAutopilot = {
  status: string;
  statusTone: ControlTone;
  currentBlocker: string;
  dailyLadder: string[];
  commands: {
    label: string;
    command: string;
    detail: string;
    tone: ControlTone;
  }[];
  guardrails: string[];
  visibility: string[];
};

export type ReachTeamTraining = {
  agent: string;
  owns: string;
  trainedToDo: string;
  escalates: string;
  proof: string;
  status: string;
  tone: ControlTone;
};

export type ManagerOwnerPeek = {
  label: string;
  where: string;
  whatYouSee: string;
  cadence: string;
  ownerUse: string;
  tone: ControlTone;
};

export const REACH_JOB_HREF = "/mike-mc/jobs/reach-cold-email-campaign";

export const REACH_LANES: ReachLane[] = [
  {
    name: "Reviews",
    domain: "mail.aioutsourcehubs.com",
    status: "Auto warmup start executed today",
    rows: "12 OK contacts",
    qa: "No blockers",
    importState: "Imported",
    dripState: "Auto started",
    tone: "accent",
  },
  {
    name: "AI Visibility",
    domain: "mail.getaioutsourcehub.com",
    status: "Auto warmup start executed today",
    rows: "20 OK contacts",
    qa: "No blockers",
    importState: "Imported",
    dripState: "Auto started",
    tone: "accent",
  },
  {
    name: "Relay",
    domain: "mail.myaioutsourcehub.com",
    status: "Auto waiting; today's refill cap used",
    rows: "5 OK / 10 min",
    qa: "Needs next searches + ready switch",
    importState: "2 OK contacts imported/tagged",
    dripState: "Auto waiting",
    tone: "warm",
  },
];

export const REACH_STEPS: ReachStep[] = [
  {
    order: 1,
    agent: "Manager",
    title: "Open the internal job",
    status: "Done",
    tone: "accent",
    whatHappened:
      "The Reach Cold Email Campaign job is active in the Slack/agent ledger and shows up in Mission Control.",
    leftToDo: "Keep the job visible until the send/no-send decision is clear.",
    evidence: "Slack /manager status can see the three Reach lanes.",
  },
  {
    order: 2,
    agent: "Scout",
    title: "Run discovery-first batches",
    status: "Done for this batch",
    tone: "accent",
    whatHappened:
      "The current small Reviews, AI Visibility, and Relay lists already exist. Future refills should start with business discovery before deeper enrichment spend.",
    leftToDo:
      "Only run paid Outscraper/Google Maps discovery when the daily cap and lane are clear, then suppress already-used contacts.",
    evidence: "Current source files are the tmp-reach CSV batches from 2026-05-20.",
  },
  {
    order: 3,
    agent: "Sender + verifier",
    title: "Verify email quality before import",
    status: "Done for this batch",
    tone: "accent",
    whatHappened:
      "The QA files separated OK rows from review flags such as personal email domains, duplicate contacts, and questionable business ownership.",
    leftToDo:
      "Do not use flagged rows unless Sales Manager explicitly clears them. Pre-send verification must happen before auto or manual start.",
    evidence: "Relay kept 2 OK contacts and held 2 Cornell personal-email duplicate rows.",
  },
  {
    order: 4,
    agent: "Sales Manager",
    title: "Decide row-level QA",
    status: "Partly done",
    tone: "warm",
    whatHappened:
      "Relay QA is decided. Reviews and AI Visibility still need the same row-level keep/remove judgment.",
    leftToDo:
      "Review the remaining flagged rows before importing those lanes.",
    evidence: "Reviews has 7 flags / 1 OK. AI Visibility has 5 flags / 1 OK.",
  },
  {
    order: 5,
    agent: "GHL Expert",
    title: "Run read-only GHL readiness",
    status: "Passed",
    tone: "accent",
    whatHappened:
      "The API check confirmed the pipelines, cold workflows, and reply workflows exist for all three lanes.",
    leftToDo:
      "Remember this is structure only. It does not prove sender-domain screens or AI toggles are visually safe.",
    evidence: "Read-only GHL check passed without changing contacts, tags, workflows, or settings.",
  },
  {
    order: 6,
    agent: "GHL Expert + Mike",
    title: "Visual safety check",
    status: "Relay confirmed",
    tone: "warm",
    whatHappened:
      "Relay was visually confirmed for sender domain, warmup status, sender nodes, and HighLevel AI toggles OFF.",
    leftToDo:
      "Keep readiness switches accurate. Auto can start a lane only after drip readiness is proven.",
    evidence: "Mike included the Relay visual confirmation in the approval command.",
  },
  {
    order: 7,
    agent: "Manager",
    title: "Approval gate",
    status: "Relay import approved",
    tone: "accent",
    whatHappened:
      "Manager accepted import-only approval for Relay after QA and visual confirmation cleared.",
    leftToDo:
      "Do not use manual approvals for normal daily auto. Mike only needs exceptions, cap increases, or a manual override.",
    evidence: "Normal auto start requires ready_for_drip=yes and guardrails passing.",
  },
  {
    order: 8,
    agent: "GHL Expert",
    title: "Import-only into GHL",
    status: "Done for Relay",
    tone: "accent",
    whatHappened:
      "The 2 Relay OK contacts were imported/tagged in GHL. No emails were sent.",
    leftToDo:
      "Avoid importing Relay again. Continue only with drip readiness or the other lanes.",
    evidence: "Relay is now import_only_completed_waiting_drip_readiness.",
  },
  {
    order: 9,
    agent: "GHL Expert + Systems Director",
    title: "Auto start readiness",
    status: "Waiting",
    tone: "warm",
    whatHappened:
      "Reviews and AI Visibility started warmup automatically. Relay used today's capped refill attempts and is still at 5 OK contacts; it needs 10 and ready_for_drip is still no.",
    leftToDo:
      "Let the next auto run rotate into the next Relay searches, then mark the lane ready after the sending checks pass.",
    evidence: "2026-05-21 warmup reports: Reviews 12 started, AI 20 started, Relay tried 60 scraped rows and stayed blocked at 5 OK.",
  },
  {
    order: 10,
    agent: "Sender",
    title: "Auto start emails",
    status: "Auto mode on",
    tone: "accent",
    whatHappened:
      "The guarded runner can start a lane automatically once it has enough clean contacts and the lane is marked ready.",
    leftToDo:
      "Do not ask Mike for another start approval. Keep the readiness switches accurate so auto can do its job.",
    evidence: "reach-warmup-autopilot.json has autopilot_start_enabled=true and requires ready_for_drip=yes.",
  },
];

export const REACH_PROCESS_FACTS = [
  {
    label: "Not wiring failure",
    detail:
      "Slack, the Manager command, and the read-only GHL check are working. The job is stopping because the safety gates are doing their job.",
  },
  {
    label: "Not rescraping every time",
    detail:
      "Asking for status reads the ledger, CSVs, and GHL readiness. Google Maps/Outscraper should only run again when a new/fresh batch is requested.",
  },
  {
    label: "Bad emails were handled",
    detail:
      "The questionable Relay personal-email rows were held out. Only the 2 QA OK Relay contacts were imported/tagged.",
  },
  {
    label: "Main handoff issue",
    detail:
      "The remaining issue is Relay only: it needs enough clean contacts and the ready switch set to yes. Reviews and AI already started guarded warmup.",
  },
];

export const REACH_WARMUP_AUTOPILOT: ReachWarmupAutopilot = {
  status: "Auto mode on",
  statusTone: "accent",
  currentBlocker:
    "Reviews and AI started today. Relay used today's capped refill attempts and is waiting for 10 OK contacts plus ready_for_drip=yes.",
  dailyLadder: [
    "Days 1-3: 10-20 emails/day per dedicated domain",
    "Days 4-6: 40-50 emails/day per dedicated domain",
    "Days 7-9: 80-100 emails/day per dedicated domain",
    "After Day 9: hold for deliverability review before increasing",
  ],
  commands: [
    {
      label: "Daily auto",
      command: "npm run reach:warmup -- --lane all --execute auto",
      detail: "Chooses import or start from readiness, refills short lanes, and stops at caps.",
      tone: "accent",
    },
    {
      label: "Manual import",
      command: "npm run reach:warmup -- --lane all --execute import",
      detail: "Override for importing QA OK contacts only.",
      tone: "muted",
    },
    {
      label: "Manual start",
      command: "npm run reach:warmup -- --lane all --execute start",
      detail: "Override for adding start tags only when ready_for_drip=yes and guardrails pass.",
      tone: "danger",
    },
  ],
  guardrails: [
    "max 3 refill attempts per lane per run",
    "max 20 scraped rows per attempt",
    "max 60 scraped rows per all-lane run",
    "max 60 scraped rows per lane per day",
    "weak lanes rotate through the next configured searches",
    "bad/risky emails are removed and replaced",
    "already imported or started contacts are not reused",
    "HighLevel AI features stay OFF",
  ],
  visibility: [
    "Mission Control now shows auto warmup status by lane.",
    "Local runs write reports into docs/client-ops-ledger/outbox.",
    "True live progress in production MC needs the runner connected to shared state or a deployed job trigger.",
  ],
};

export const REACH_TEAM_TRAINING: ReachTeamTraining[] = [
  {
    agent: "Manager",
    owns: "Daily control of the Reach job.",
    trainedToDo:
      "Read the warmup summary, explain the business answer, assign the blocker, and keep Mike out of row-by-row work.",
    escalates:
      "Only asks Mike for exceptions: higher spend caps, risky manual overrides, or a true stop/start business decision.",
    proof: "Command: Manager, run Reach Cold Email Campaign",
    status: "trained",
    tone: "accent",
  },
  {
    agent: "Scout",
    owns: "Finding enough businesses before deeper email work.",
    trainedToDo:
      "Use discovery-first, rotate weak niches, avoid repeating the same poor searches, and stay inside Outscraper caps.",
    escalates:
      "Tells Manager when a lane cannot reach the minimum clean count inside the daily cap.",
    proof: "Workflow: Reach Business Discovery First",
    status: "trained",
    tone: "accent",
  },
  {
    agent: "Sender + verifier",
    owns: "Email quality before GHL action.",
    trainedToDo:
      "Verify emails before import/start, remove bad/unknown/catchall/personal-risk rows, and keep selected CSVs clean.",
    escalates:
      "Stops the lane when verification quality is too low or the batch falls below the minimum.",
    proof: "NeverBounce verification reports and QA CSVs",
    status: "trained",
    tone: "accent",
  },
  {
    agent: "Sales Manager",
    owns: "List quality and offer fit.",
    trainedToDo:
      "Decide whether the businesses are worth contacting and keep questionable rows out of live outreach.",
    escalates:
      "Flags weak niches, bad-fit industries, or rows that need human judgment.",
    proof: "Command: Sales Manager, review Reach QA",
    status: "trained",
    tone: "warm",
  },
  {
    agent: "GHL Expert",
    owns: "GHL readiness and send safety.",
    trainedToDo:
      "Confirm sender domain, workflow sender nodes, tags, warmup status, and HighLevel AI toggles OFF.",
    escalates:
      "Keeps ready_for_drip=no until the sending setup is proven safe.",
    proof: "Command: GHL Expert, check Reach readiness",
    status: "trained",
    tone: "warm",
  },
  {
    agent: "Systems Director",
    owns: "Cron, caps, access, and cost risk.",
    trainedToDo:
      "Watch workflow health, API availability, scrape caps, same-day reruns, and ledger preservation.",
    escalates:
      "Warns Manager before cap increases, new paid tools, or repeated workflow failures.",
    proof: "GitHub workflow results and cost guardrails",
    status: "training now",
    tone: "warm",
  },
  {
    agent: "Sorter",
    owns: "Reply classification.",
    trainedToDo:
      "Separate interested, book call, send info, bad fit, unsubscribe, and unclear replies.",
    escalates:
      "Routes warm replies to Booker and unsubscribe/risk replies to Manager.",
    proof: "Reply router blueprint",
    status: "next",
    tone: "muted",
  },
  {
    agent: "Booker",
    owns: "Turning interested replies into calls.",
    trainedToDo:
      "Move real interest toward the calendar with clean handoff notes.",
    escalates:
      "Asks Scheduler when booking links, availability, or meeting context are unclear.",
    proof: "GMF Talk booking link",
    status: "next",
    tone: "muted",
  },
];

export const MANAGER_OWNER_PEEK: ManagerOwnerPeek[] = [
  {
    label: "Manager conversation",
    where: "Slack #04-aoh-ops",
    whatYouSee:
      "Manager answers your questions, posts simple status, routes blockers, and gives the clean next move.",
    cadence: "On demand now; recommended daily owner brief.",
    ownerUse: "Best place to talk to Manager like your right hand.",
    tone: "accent",
  },
  {
    label: "Owner dashboard",
    where: "Mission Control front page",
    whatYouSee:
      "Active jobs, current blocker, agent owners, spend snapshot, and which room to open.",
    cadence: "Peek anytime.",
    ownerUse: "Best place to satisfy yourself without reading logs.",
    tone: "accent",
  },
  {
    label: "Reach job room",
    where: "/mike-mc/jobs/reach-cold-email-campaign",
    whatYouSee:
      "Lane status, warmup progress, agent handoff, team training, and the next blocker.",
    cadence: "Peek when a campaign question comes up.",
    ownerUse: "Best place to see what the cold email agents are doing.",
    tone: "warm",
  },
  {
    label: "Proof logs",
    where: "GitHub Actions + ledger outbox",
    whatYouSee:
      "Workflow runs, CSV/report artifacts, verification proof, and exact technical history.",
    cadence: "Only when something looks wrong.",
    ownerUse: "For audit/proof, not your daily owner view.",
    tone: "muted",
  },
  {
    label: "Manager DM",
    where: "Not automatic yet",
    whatYouSee:
      "Recommended: one short daily DM plus urgent exceptions only, not every agent message.",
    cadence: "Advised next layer.",
    ownerUse: "Keeps Manager as your right hand without blowing up your phone.",
    tone: "warn",
  },
];

export const REACH_INTERNAL_JOB: InternalJob = {
  slug: "reach-cold-email-campaign",
  title: "Internal Job: Reach Cold Email Campaign",
  href: REACH_JOB_HREF,
  owner: "Manager",
  status: "Auto warmup running",
  statusTone: "accent",
  summary:
    "Reviews and AI Visibility started guarded warmup today. Relay used today's capped refill and is still waiting for enough clean contacts and ready status.",
  currentBlocker:
    "Relay has 5 OK contacts but needs 10. Auto will rotate into the next searches on the next run, then start only after ready_for_drip is yes.",
  plainEnglish:
    "Auto is on. The system is running lanes that are ready and holding the lane that is not ready.",
  metrics: [
    { label: "Started today", value: "2 lanes", tone: "accent" },
    { label: "Reviews", value: "12 OK", tone: "accent" },
    { label: "AI", value: "20 OK", tone: "accent" },
    { label: "Relay", value: "5/10", tone: "warm" },
  ],
  lanes: REACH_LANES,
  steps: REACH_STEPS,
};

export const INTERNAL_JOBS: InternalJob[] = [REACH_INTERNAL_JOB];
