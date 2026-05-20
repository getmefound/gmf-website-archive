export type AgentTeamMember = {
  agent: string;
  displayName: string;
  codename: string;
  title: string;
  status: "active" | "building" | "planned" | "review";
  archetype: string;
  archetypeNote: string;
  responsibility: string;
  owns: string[];
  proof: string[];
  currentFocus: string;
  color: "emerald" | "sky" | "amber" | "rose" | "violet" | "zinc";
};

export const AGENT_TEAM: AgentTeamMember[] = [
  {
    agent: "Manager",
    displayName: "Grant Mercer",
    codename: "Control",
    title: "Manager",
    status: "active",
    archetype: "First-principles operator",
    archetypeNote: "Pushes work down to the actual constraint, then assigns the next concrete move.",
    responsibility:
      "Runs the team, chooses who owns each task, assigns the reviewer, tracks blockers, and keeps Mike out of technical busywork until approval is needed.",
    owns: ["Mission Control", "task routing", "model tier choice", "go/no-go calls"],
    proof: ["owner assigned", "reviewer assigned", "blocker visible", "proof before done"],
    currentFocus: "Campaign Reply Router is P0 until send/book paths pass.",
    color: "sky",
  },
  {
    agent: "GHL Expert",
    displayName: "Nolan Pierce",
    codename: "Switchboard",
    title: "Systems Architect",
    status: "active",
    archetype: "Systems builder",
    archetypeNote: "Turns HighLevel into repeatable workflows, fields, stages, and proof checks.",
    responsibility:
      "Builds and verifies HighLevel workflows, calendars, pipelines, tags, callbacks, and report delivery.",
    owns: ["GHL workflows", "Website Leads pipeline", "AOH Talk calendar", "report callbacks"],
    proof: ["green execution logs", "correct tags", "correct stage", "no duplicate sends"],
    currentFocus: "Build Campaign Reply Router for `send`, `book`, unclear, and opt-out replies.",
    color: "emerald",
  },
  {
    agent: "Systems Director",
    displayName: "Martin Vale",
    codename: "Lock",
    title: "IT and Risk Director",
    status: "review",
    archetype: "Risk inversion lens",
    archetypeNote: "Starts with what could fail across tools, access, costs, and infrastructure.",
    responsibility:
      "Keeps AOH's technical stack healthy: OpenClaw, VPS, GitHub, Vercel, GHL, Slack, backups, tokens, tool sprawl, and launch risk.",
    owns: ["tech-stack reviews", "security sweep", "access checks", "cost guardrails"],
    proof: ["no-go risks listed", "secrets absent", "backups verified", "tool changes approved"],
    currentFocus: "Make the stack visible before adding more tools or client volume.",
    color: "rose",
  },
  {
    agent: "Sender",
    displayName: "Leo Park",
    codename: "Signal",
    title: "Campaign Voice",
    status: "building",
    archetype: "Product-taste lens",
    archetypeNote: "Keeps the message simple, specific, and hard to confuse.",
    responsibility:
      "Prepares reply-first campaign emails and watches sending quality, merge fields, and deliverability.",
    owns: ["first-touch copy", "follow-up copy", "reply-first CTA", "send-domain readiness"],
    proof: ["merge fields render", "footer works", "unsubscribe present", "reply CTA is clear"],
    currentFocus: "Waits for Campaign Reply Router QA before scaled sending.",
    color: "violet",
  },
  {
    agent: "Sorter",
    displayName: "Isabel Chen",
    codename: "Triage",
    title: "Reply Classifier",
    status: "planned",
    archetype: "Operator discipline lens",
    archetypeNote: "Separates real buying signals from noise so hot replies do not sit.",
    responsibility:
      "Classifies inbound replies, cleans lists, flags bad fits, and routes unclear messages to a human.",
    owns: ["reply classification", "needs-review tasks", "list cleanup", "bad-fit routing"],
    proof: ["hot replies tagged", "unclear replies tasked", "opt-outs stopped", "no stale replies"],
    currentFocus: "Receives unclear campaign replies after router is live.",
    color: "amber",
  },
  {
    agent: "Scout",
    displayName: "Nora Pierce",
    codename: "Radar",
    title: "Prospect Researcher",
    status: "planned",
    archetype: "Research desk lens",
    archetypeNote: "Finds the cheapest signal before spending on deep scans or full reports.",
    responsibility:
      "Finds niches, prospects, weak profiles, review gaps, and fit signals before enrichment or outreach.",
    owns: ["cheap prefilter", "niche research", "prospect scoring", "source notes"],
    proof: ["filtered list", "fit reason", "cost guardrail", "bad leads excluded"],
    currentFocus: "Cheap prefilter before large campaign volume.",
    color: "zinc",
  },
  {
    agent: "Booker",
    displayName: "Olivia Kane",
    codename: "Calendar",
    title: "Appointment Handoff",
    status: "planned",
    archetype: "Sales floor discipline lens",
    archetypeNote: "Turns interest into a real appointment instead of another loose thread.",
    responsibility:
      "Routes booking-intent replies to AOH Talk, follows up on show rate, and keeps call handoffs clean.",
    owns: ["aoh-talk handoff", "booking intent", "show-rate follow-up", "meeting notes"],
    proof: ["booking link sent", "opportunity updated", "task created", "call booked"],
    currentFocus: "Receives `book` replies from Campaign Reply Router.",
    color: "emerald",
  },
  {
    agent: "Local Visibility Manager",
    displayName: "Elena Brooks",
    codename: "Presence",
    title: "Local Visibility Specialist",
    status: "building",
    archetype: "Local trust lens",
    archetypeNote: "Looks at the public footprint the way a buyer or AI answer engine would.",
    responsibility:
      "Checks Google Business Profile access, profile health, review link, citations, and local visibility gaps.",
    owns: ["GBP access", "profile audit", "review link", "AI visibility signals"],
    proof: ["correct profile", "access confirmed", "review link captured", "visibility gaps logged"],
    currentFocus: "Client-zero profile checks and AI Visibility support.",
    color: "sky",
  },
  {
    agent: "Coach",
    displayName: "Thomas Reed",
    codename: "Playbook",
    title: "Knowledge and Sales Clarity",
    status: "building",
    archetype: "Teacher/operator lens",
    archetypeNote: "Turns scattered facts into usable instructions and better sales language.",
    responsibility:
      "Maintains SOPs, agent training, product truth, client instructions, and approved response language.",
    owns: ["SOPs", "client instructions", "objection handling", "agent training"],
    proof: ["source doc linked", "instructions clear", "agent boundary defined", "client-safe wording"],
    currentFocus: "Keep agents aligned on report lanes and campaign routing.",
    color: "amber",
  },
  {
    agent: "Reporter",
    displayName: "Iris Bennett",
    codename: "Proof",
    title: "Report Delivery and QA",
    status: "active",
    archetype: "Evidence lens",
    archetypeNote: "Makes sure a report exists, opens, and tells a useful story.",
    responsibility:
      "Confirms generated marketing and AI visibility report links are usable and tied to the right contact.",
    owns: ["report links", "status proof", "customer delivery", "report QA"],
    proof: ["URL present", "report opens", "contact matches", "delivery logged"],
    currentFocus: "Website visitor reports are verified; campaign reports wait for warm replies.",
    color: "violet",
  },
  {
    agent: "Press",
    displayName: "Miles Carter",
    codename: "Publish",
    title: "Content Publisher",
    status: "planned",
    archetype: "Distribution lens",
    archetypeNote: "Keeps approved content moving without turning into random posting.",
    responsibility:
      "Publishes approved content to social, Google Business Profile, newsletter, and proof-of-publish logs.",
    owns: ["social publishing", "GBP posts", "newsletter", "publish proof"],
    proof: ["post scheduled", "channel correct", "asset approved", "proof captured"],
    currentFocus: "Queued after core campaign and report systems are stable.",
    color: "zinc",
  },
  {
    agent: "Scheduler",
    displayName: "Grace Turner",
    codename: "Time",
    title: "Calendar Defender",
    status: "active",
    archetype: "Executive assistant lens",
    archetypeNote: "Protects time and makes sure real meetings have context.",
    responsibility:
      "Watches AOH calendar, booking availability, conflict calendars, reminders, and meeting prep.",
    owns: ["AOH Talk", "calendar blocks", "meeting briefs", "availability"],
    proof: ["booking page opens", "calendar item visible", "conflicts respected", "brief ready"],
    currentFocus: "AOH Talk link is live; calendar data should stay AOH-only in MC.",
    color: "sky",
  },
];
