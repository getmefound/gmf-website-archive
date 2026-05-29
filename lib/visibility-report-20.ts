// Proposed 20-signal AI Visibility Report data model.
// NEW FILE — does NOT replace lib/visibility-report-artifacts.ts.
// Kept separate for review and comparison.

export type SignalStatus = "red" | "amber" | "green";
export type ReportMode = "baseline" | "delivery" | "monthly";
export type SignalGroup = "A" | "B" | "C" | "D";
export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export type VisibilitySignal20 = {
  id: number;
  group: SignalGroup;
  label: string;
  plainText: string;
  plan: "get-found" | "stay-found" | "always-ready";
  drifts: boolean;
  // Runtime data — all optional; missing = treated as "red"
  status?: SignalStatus;
  beforeStatus?: SignalStatus;
  afterStatus?: SignalStatus;
  changedSinceLast?: boolean;
};

// ─── 20-signal catalog ────────────────────────────────────────────────────────

type CatalogEntry = Omit<VisibilitySignal20, "status" | "beforeStatus" | "afterStatus" | "changedSinceLast">;

export const SIGNAL_CATALOG: CatalogEntry[] = [
  // ── Group A — Reviews & Trust ────────────────────────────────────────────
  {
    id: 1, group: "A",
    label: "Review velocity",
    plainText: "Steady, recent review flow — recency matters more than total count",
    plan: "stay-found", drifts: true,
  },
  {
    id: 2, group: "A",
    label: "Fresh reviews in last 30 days",
    plainText: "New reviews arrived recently — AI reads this as the business being active",
    plan: "get-found", drifts: true,
  },
  {
    id: 3, group: "A",
    label: "Review response cadence",
    plainText: "Owner responds to reviews — shows the business is real and engaged",
    plan: "stay-found", drifts: true,
  },
  {
    id: 4, group: "A",
    label: "Review sentiment",
    plainText: "What customers say in reviews (not just the star rating) matches what AI checks",
    plan: "stay-found", drifts: true,
  },
  {
    id: 5, group: "A",
    label: "Entity trust",
    plainText: "AI recognises your brand by name in its knowledge graph — not just by address",
    plan: "stay-found", drifts: true,
  },

  // ── Group B — AI Readability ─────────────────────────────────────────────
  {
    id: 6, group: "B",
    label: "AI crawlability",
    plainText: "GPTBot and Google-Extended can actually reach and read your site",
    plan: "get-found", drifts: false,
  },
  {
    id: 7, group: "B",
    label: "AI-ready content structure",
    plainText: "Your content is laid out in a way AI can parse and quote directly",
    plan: "get-found", drifts: false,
  },
  {
    id: 8, group: "B",
    label: "Schema markup",
    plainText: "Code behind your site tells AI exactly who you are and what you do",
    plan: "get-found", drifts: false,
  },
  {
    id: 9, group: "B",
    label: "Query-answer match",
    plainText: "Your page answers the specific questions people ask about businesses like yours",
    plan: "stay-found", drifts: true,
  },
  {
    id: 10, group: "B",
    label: "Factual specificity / answer-near-top",
    plainText: "Clear facts (prices, hours, services) appear near the top — AI can cite you as the answer",
    plan: "stay-found", drifts: false,
  },

  // ── Group C — Google Profile ─────────────────────────────────────────────
  {
    id: 11, group: "C",
    label: "Profile completeness",
    plainText: "Every field in your Google Business Profile is filled in correctly",
    plan: "get-found", drifts: false,
  },
  {
    id: 12, group: "C",
    label: "Primary category + service taxonomy",
    plainText: "Your main category and all service types are accurate and complete",
    plan: "get-found", drifts: false,
  },
  {
    id: 13, group: "C",
    label: "Hours/services/service-area clarity",
    plainText: "Hours, what you do, and where you serve are unambiguous to AI",
    plan: "get-found", drifts: true,
  },
  {
    id: 14, group: "C",
    label: "Photo & visual completeness",
    plainText: "Enough recent photos exist for AI to treat the profile as active and real",
    plan: "get-found", drifts: true,
  },
  {
    id: 15, group: "C",
    label: "Business description & attributes",
    plainText: "Your description and special attributes tell the full story of the business",
    plan: "get-found", drifts: false,
  },

  // ── Group D — Consistency & Freshness ───────────────────────────────────
  {
    id: 16, group: "D",
    label: "NAP consistency",
    plainText: "Your name, address, and phone number match everywhere they appear online",
    plan: "get-found", drifts: false,
  },
  {
    id: 17, group: "D",
    label: "Citation consistency",
    plainText: "Your business facts agree across directories, maps, and local listings",
    plan: "stay-found", drifts: true,
  },
  {
    id: 18, group: "D",
    label: "Duplicate/incorrect listing cleanup",
    plainText: "No conflicting listings confuse AI about which one is the real business",
    plan: "get-found", drifts: false,
  },
  {
    id: 19, group: "D",
    label: "Freshness signals",
    plainText: "Recent posts, updates, or activity show the business is still operating",
    plan: "stay-found", drifts: true,
  },
  {
    id: 20, group: "D",
    label: "Fresh photos & activity",
    plainText: "New photos added recently — AI reads static, unchanged profiles as inactive",
    plan: "stay-found", drifts: true,
  },
];

// ─── Group metadata ───────────────────────────────────────────────────────────

export const GROUP_META: Record<SignalGroup, { name: string; description: string }> = {
  A: { name: "Reviews & Trust", description: "Social proof signals AI reads before recommending" },
  B: { name: "AI Readability", description: "Whether AI can find, read, and cite your business" },
  C: { name: "Google Profile", description: "Profile completeness and category clarity" },
  D: { name: "Consistency & Freshness", description: "Cross-web agreement and activity recency" },
};

// ─── Scoring utilities ────────────────────────────────────────────────────────

/** Count green signals across the full 20. */
export function countGreen(signals: VisibilitySignal20[], mode: ReportMode): number {
  return signals.filter((s) => resolveStatus(s, mode) === "green").length;
}

/** Visibility Score = round(green / 20 * 100) */
export function calcScore(signals: VisibilitySignal20[], mode: ReportMode): number {
  return Math.round((countGreen(signals, mode) / 20) * 100);
}

/** Per-group: count of greens in the group's 5 signals. */
export function groupGreenCount(
  signals: VisibilitySignal20[],
  group: SignalGroup,
  mode: ReportMode,
): number {
  return signals
    .filter((s) => s.group === group)
    .filter((s) => resolveStatus(s, mode) === "green").length;
}

/** Grade from 0-5 greens (one group of 5). */
export function gradeFromGroupCount(greens: number): LetterGrade {
  if (greens === 5) return "A";
  if (greens === 4) return "B";
  if (greens === 3) return "C";
  if (greens === 2) return "D";
  return "F";
}

/** Overall grade from 0-20 greens (scaled same as per-group). */
export function overallGrade(greens: number): LetterGrade {
  if (greens >= 18) return "A";
  if (greens >= 14) return "B";
  if (greens >= 10) return "C";
  if (greens >= 6) return "D";
  return "F";
}

/** Verdict line from score. */
export function scoreVerdict(score: number, mode: ReportMode): string {
  if (mode === "baseline") {
    if (score >= 70) return `${score}/100 — AI can understand your business but signals need work.`;
    if (score >= 40) return `${score}/100 — AI is missing too many signals to confidently recommend you.`;
    return `${score}/100 — AI can't confidently recommend you yet.`;
  }
  if (score >= 80) return `${score}/100 — Strong AI visibility. Keep signals fresh.`;
  if (score >= 60) return `${score}/100 — Improving. A few signals still need attention.`;
  return `${score}/100 — Gaps remain. Stay Found keeps closing them.`;
}

/** Which status to use for display given the mode. */
export function resolveStatus(signal: VisibilitySignal20, mode: ReportMode): SignalStatus {
  if (mode === "baseline") return signal.beforeStatus ?? signal.status ?? "red";
  if (mode === "delivery") return signal.afterStatus ?? signal.status ?? "red";
  return signal.status ?? "red"; // monthly = current status
}

export function resolveBeforeStatus(signal: VisibilitySignal20): SignalStatus {
  return signal.beforeStatus ?? "red";
}

export function resolveAfterStatus(signal: VisibilitySignal20): SignalStatus {
  return signal.afterStatus ?? signal.status ?? "red";
}

// ─── Sample data (demo / Storybook usage) ────────────────────────────────────

/** Build a demo dataset from the catalog with optional status overrides. */
export function buildDemoSignals(
  overrides: Partial<Record<number, Pick<VisibilitySignal20, "beforeStatus" | "afterStatus" | "status" | "changedSinceLast">>> = {},
): VisibilitySignal20[] {
  return SIGNAL_CATALOG.map((entry) => ({
    ...entry,
    beforeStatus: "red" as SignalStatus,
    afterStatus: "red" as SignalStatus,
    status: "red" as SignalStatus,
    ...overrides[entry.id],
  }));
}

// Signals maintained by Stay Found (drift back without ongoing upkeep)
export const STAY_FOUND_MAINTAINED = SIGNAL_CATALOG
  .filter((s) => s.drifts)
  .map((s) => s.label);
