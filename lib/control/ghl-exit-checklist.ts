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
    "GHL is now a $97 bridge. Review Automation storage and email are live, but we do not cancel GHL until the Google review link and a real GMF send test pass.",
  cancelGate:
    "Cancel GHL only after Review Automation, Reach sending, and booking are working outside GHL for GMF.",
};

export const GHL_EXIT_METRICS = [
  { label: "GHL plan", value: "$97", tone: "warm" as const },
  { label: "Storage", value: "Ready", tone: "accent" as const },
  { label: "Email", value: "Ready", tone: "accent" as const },
  { label: "Blockers", value: "1", tone: "danger" as const },
  { label: "Cancel GHL", value: "Not yet", tone: "muted" as const },
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
    detail: "Upstash Redis is live and passed write, read, and cleanup checks.",
  },
  {
    title: "GMF Google review link",
    owner: "Profile Manager",
    status: "blocked",
    detail: "Capture and save the real GMF Google review link before any real review request send.",
  },
  {
    title: "GMF client-zero test",
    owner: "Reviews Manager",
    status: "next",
    detail: "Run the full GMF test with safe contacts before selling this workflow as client-ready.",
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
    status: "next",
    detail: "Run proof checks, then send only after the GMF Google review link and client-zero approval are in place.",
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
    title: "Booking replacement",
    owner: "Scheduler",
    status: "next",
    detail: "Pick Google Calendar or Calendly and move booking away from GHL when ready.",
  },
  {
    title: "Reach replacement",
    owner: "Sender",
    status: "later",
    detail: "Move cold email send, drip, reply tracking, and safety checks outside GHL.",
  },
  {
    title: "AI Visibility replacement",
    owner: "Profile Manager",
    status: "later",
    detail: "Replace GHL-dependent reporting with GMF-owned ranking checks, notes, and monthly proof.",
  },
  {
    title: "Final GHL cancel gate",
    owner: "Manager",
    status: "later",
    detail: "Only cancel after GMF can sell, fulfill, send, book, and report without GHL.",
  },
];

export const GHL_EXIT_COMMANDS = [
  "GHL Expert, run $97 smoke check",
  "Reviews Manager, storage check",
  "Reviews Manager, status",
];
