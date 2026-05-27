export type GhlExitStatus = "done" | "blocked" | "next" | "later";

export type GhlExitChecklistItem = {
  title: string;
  owner: string;
  status: GhlExitStatus;
  detail: string;
};

export const GHL_EXIT_SUMMARY = {
  title: "GHL Exit + Review Automation",
  ownerNote:
    "GHL is now only a $97 bridge. The GMF stack can handle contact intake, review storage, review email, client records, POS/CRM health checks, and internal report status without GHL.",
  cancelGate:
    "Cash-first cancel path: export GHL data, replace any public booking/report links still relying on GHL, pause outreach until Smartlead clears warmup, then cancel.",
};

export const GHL_EXIT_METRICS = [
  { label: "GHL plan", value: "$97", tone: "warm" as const },
  { label: "Storage", value: "Ready", tone: "accent" as const },
  { label: "Email", value: "Ready", tone: "accent" as const },
  { label: "Blockers", value: "1", tone: "danger" as const },
  { label: "Cancel GHL", value: "Close", tone: "warm" as const },
];

export const GHL_EXIT_CHECKLIST: GhlExitChecklistItem[] = [
  {
    title: "Downgrade GHL",
    owner: "Mike",
    status: "done",
    detail: "GHL is downgraded to the $97 bridge plan.",
  },
  {
    title: "Check GHL after downgrade",
    owner: "GHL Expert",
    status: "done",
    detail: "Smoke check passed for the pieces we still need during the bridge.",
  },
  {
    title: "Customer upload page",
    owner: "Reviews Manager",
    status: "done",
    detail: "Client/customer lists can be uploaded into the GMF system.",
  },
  {
    title: "Private feedback page",
    owner: "Reviews Manager",
    status: "done",
    detail: "Unhappy customers can be routed into private feedback before Google.",
  },
  {
    title: "Unsubscribe and suppression",
    owner: "Reviews Manager",
    status: "done",
    detail: "People who opt out or bounce can be held out of future sends.",
  },
  {
    title: "Send logs and follow-up list",
    owner: "Reviews Manager",
    status: "done",
    detail: "The system can track sends, failures, bounces, opens, clicks, and who needs one follow-up.",
  },
  {
    title: "Storage keys in Vercel",
    owner: "Systems Director",
    status: "done",
    detail: "Supabase storage env is present locally and in Vercel. Upstash is only a fallback path now.",
  },
  {
    title: "GMF Google review link",
    owner: "Profile Manager",
    status: "done",
    detail: "The GMF client profile has a working Google review URL for review request testing.",
  },
  {
    title: "GMF client-zero test",
    owner: "Reviews Manager",
    status: "done",
    detail: "Client-zero review request send and private feedback tests passed with GMF-owned storage.",
  },
  {
    title: "Review request sender endpoint",
    owner: "Sender",
    status: "done",
    detail: "GMF can dry-run a capped send batch, preview recipients, and log send attempts.",
  },
  {
    title: "Email sender setup",
    owner: "Sender",
    status: "done",
    detail: "Resend env is live for review request sends from the GMF domain.",
  },
  {
    title: "Live review request sender",
    owner: "Sender",
    status: "done",
    detail: "Review request sending is available through Resend with internal-token approval, logs, suppression, and follow-up checks.",
  },
  {
    title: "Monthly recap endpoint",
    owner: "Manager",
    status: "done",
    detail: "GMF can summarize uploads, sends, bounces, feedback, suppressions, and owner notes.",
  },
  {
    title: "Client-facing monthly recap",
    owner: "Manager",
    status: "done",
    detail: "Client hub now has a simple monthly recap card ready for live data wiring.",
  },
  {
    title: "Booking fallback",
    owner: "Scheduler",
    status: "done",
    detail: "Public report and landing page booking links now route to the GMF contact page instead of the old GHL calendar. A proper Google Calendar appointment page can replace this later.",
  },
  {
    title: "Export GHL data",
    owner: "Manager + Mike",
    status: "blocked",
    detail: "Export contacts, conversations, appointments, workflows, forms, funnels/pages, templates, pipelines, custom fields, and reports before access is removed.",
  },
  {
    title: "Production GHL env check",
    owner: "Systems Director",
    status: "done",
    detail: "Vercel production env no longer lists GHL API or webhook keys. Local old GHL keys should be archived or removed after export.",
  },
  {
    title: "Report request fallback",
    owner: "Manager + Reporter",
    status: "next",
    detail: "Keep report requests as GMF-owned manual/internal work or hide the public report flow until automated report fulfillment is fully off GHL.",
  },
  {
    title: "Reach replacement",
    owner: "Sender",
    status: "next",
    detail: "Smartlead is connected but not ready for live prospect sends yet. Keep prospect sends paused until all inboxes clear warmup gates.",
  },
  {
    title: "AI Visibility replacement",
    owner: "Profile Manager",
    status: "next",
    detail: "Use GMF-owned profile checks, notes, screenshots, and monthly proof for Stay Found while automated ranking reports mature.",
  },
  {
    title: "Final GHL cancel gate",
    owner: "Manager",
    status: "next",
    detail: "Cancel is reasonable once exports are saved and non-GHL booking/report paths are confirmed. Outreach can stay paused rather than keeping GHL.",
  },
];

export const GHL_EXIT_COMMANDS = [
  "GHL Expert, run $97 smoke check",
  "Reviews Manager, storage check",
  "Reviews Manager, status",
];
