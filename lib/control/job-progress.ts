import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getMondayAgentJobsOverview,
  type MondayAgentJobRow,
  type MondayAgentJobsOverview,
} from "@/lib/control/monday-agent-jobs";

const WATCHDOG_DIR = path.join(process.cwd(), "docs", "client-ops-ledger", "outbox");
const WATCHDOG_PREFIX = "manager-agent-watchdog-";

export type WatchdogFinding = {
  name: string;
  mondayId: string;
  group: string;
  owner: string;
  reviewer: string;
  mondayStatus: string;
  humanNeeded: string;
  runtimeState: string;
  recordedRuntimeState: string;
  waitingState: string;
  expectedReceive: string;
  escalateAt: string;
  nextOwner: string;
  handoffAck: string;
  ackAt: string;
  unlockProof: string;
  timerState: string;
  reason: string;
  recommendedAction: string;
  proof: string;
  mondayNextAction: string;
};

export type WatchdogReport = {
  ok: boolean;
  fileName?: string;
  filePath?: string;
  created?: string;
  board?: string;
  findings: WatchdogFinding[];
  error?: string;
};

export type JobProgressRow = {
  id: string;
  name: string;
  group: string;
  status: string;
  statusTone: "accent" | "warm" | "danger" | "muted";
  agentOwner: string;
  reviewer: string;
  nextOwner: string;
  humanNeeded: boolean;
  runtimeState: string;
  waitingState: string;
  handoffAck: string;
  expectedReceive: string;
  escalateAt: string;
  timerState: string;
  reason: string;
  currentStep: string;
  recommendedAction: string;
  proofText: string;
  proofUrl: string;
  doneSoFar: string[];
  managerWatch: ManagerWatch;
  mondayUrl: string;
};

export type ManagerWatch = {
  agreement: "agree" | "disagree" | "watch";
  label: string;
  tone: "accent" | "warm" | "danger" | "muted";
  action: string;
};

export type JobProgressOverview = {
  monday: MondayAgentJobsOverview;
  watchdog: WatchdogReport;
  rows: JobProgressRow[];
  totals: {
    total: number;
    active: number;
    readyForReview: number;
    overdue: number;
    humanNeeded: number;
    noProof: number;
  };
};

export async function getJobProgressOverview(): Promise<JobProgressOverview> {
  const [monday, watchdog] = await Promise.all([
    getMondayAgentJobsOverview(),
    getLatestWatchdogReport(),
  ]);
  const rows = buildJobProgressRows(monday, watchdog);

  return {
    monday,
    watchdog,
    rows,
    totals: {
      total: rows.length,
      active: rows.filter((row) => row.status === "Agent Working").length,
      readyForReview: rows.filter((row) => row.status === "Ready For Review").length,
      overdue: rows.filter((row) => isTimerOverdue(row.timerState)).length,
      humanNeeded: rows.filter((row) => row.humanNeeded).length,
      noProof: rows.filter((row) => !row.proofText && row.status !== "Done").length,
    },
  };
}

async function getLatestWatchdogReport(): Promise<WatchdogReport> {
  try {
    const entries = await fs.readdir(WATCHDOG_DIR, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.startsWith(WATCHDOG_PREFIX) && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort()
      .reverse();

    if (!files[0]) {
      return { ok: false, findings: [], error: "No watchdog report found yet." };
    }

    const fileName = files[0];
    const filePath = path.join(WATCHDOG_DIR, fileName);
    const markdown = await fs.readFile(filePath, "utf8");
    return parseWatchdogReport(markdown, fileName, filePath);
  } catch (error) {
    return {
      ok: false,
      findings: [],
      error: error instanceof Error ? error.message : "Could not read watchdog reports.",
    };
  }
}

function parseWatchdogReport(markdown: string, fileName: string, filePath: string): WatchdogReport {
  const created = markdown.match(/^Created:\s*(.+)$/m)?.[1]?.trim();
  const board = markdown.match(/^Board:\s*(.+)$/m)?.[1]?.trim();
  const sections = markdown.split(/\n### /).slice(1);

  return {
    ok: true,
    fileName,
    filePath,
    created,
    board,
    findings: sections.map((section) => parseFinding(section)).filter(Boolean),
  };
}

function parseFinding(section: string): WatchdogFinding {
  const [rawTitle = "", ...bodyLines] = section.split("\n");
  const values = new Map<string, string>();
  for (const line of bodyLines) {
    const match = line.match(/^- ([^:]+):\s*(.*)$/);
    if (match) values.set(normalizeKey(match[1]), match[2].trim());
  }

  return {
    name: rawTitle.trim(),
    mondayId: read(values, "Monday ID"),
    group: read(values, "Group"),
    owner: read(values, "Owner"),
    reviewer: read(values, "Reviewer"),
    mondayStatus: read(values, "Monday status"),
    humanNeeded: read(values, "Human needed"),
    runtimeState: read(values, "Runtime state"),
    recordedRuntimeState: read(values, "Recorded runtime state"),
    waitingState: read(values, "Waiting state"),
    expectedReceive: read(values, "Expected receive"),
    escalateAt: read(values, "Escalate at"),
    nextOwner: read(values, "Next owner"),
    handoffAck: read(values, "Handoff ack"),
    ackAt: read(values, "Ack at"),
    unlockProof: read(values, "Unlock proof"),
    timerState: read(values, "Timer state"),
    reason: read(values, "Reason"),
    recommendedAction: read(values, "Recommended action"),
    proof: read(values, "Proof"),
    mondayNextAction: read(values, "Monday next action"),
  };
}

function buildJobProgressRows(monday: MondayAgentJobsOverview, watchdog: WatchdogReport) {
  const findingsById = new Map(watchdog.findings.map((finding) => [finding.mondayId, finding]));
  const findingsByName = new Map(watchdog.findings.map((finding) => [normalizeKey(finding.name), finding]));
  const usedFindingIds = new Set<string>();

  const rows = monday.allRows.map((row) => {
    const finding = findingsById.get(row.id) ?? findingsByName.get(normalizeKey(row.name));
    if (finding?.mondayId) usedFindingIds.add(finding.mondayId);
    return toProgressRow(row, finding, monday.boardId);
  });

  for (const finding of watchdog.findings) {
    if (finding.mondayId && usedFindingIds.has(finding.mondayId)) continue;
    rows.push(toProgressRow(undefined, finding, monday.boardId));
  }

  return rows.sort(sortProgressRows);
}

function toProgressRow(row?: MondayAgentJobRow, finding?: WatchdogFinding, boardId?: string): JobProgressRow {
  const id = row?.id || finding?.mondayId || "";
  const status = row?.status || finding?.mondayStatus || "Open";
  const proofText = row?.proofText || finding?.proof || "";
  const currentStep = row?.nextAction || finding?.mondayNextAction || finding?.recommendedAction || "No next action recorded.";
  const runtimeState = finding?.runtimeState || row?.runtimeState || "";
  const timerState = finding?.timerState || "";
  const humanNeeded = isYes(row?.humanNeeded || finding?.humanNeeded || "");
  const managerWatch = buildManagerWatch({
    status,
    humanNeeded,
    runtimeState,
    timerState,
    proofText,
    currentStep,
  });

  return {
    id,
    name: row?.name || finding?.name || "Untitled job",
    group: row?.group || finding?.group || "",
    status,
    statusTone: statusTone(status, humanNeeded, timerState),
    agentOwner: row?.agentOwner || finding?.owner || "",
    reviewer: row?.reviewer || finding?.reviewer || "",
    nextOwner: row?.nextOwner || finding?.nextOwner || "",
    humanNeeded,
    runtimeState,
    waitingState: row?.waitingState || finding?.waitingState || "",
    handoffAck: row?.handoffAck || finding?.handoffAck || "",
    expectedReceive: row?.expectedReceive || finding?.expectedReceive || "",
    escalateAt: row?.escalateAt || finding?.escalateAt || "",
    timerState,
    reason: finding?.reason || "",
    currentStep,
    recommendedAction: finding?.recommendedAction || "",
    proofText,
    proofUrl: extractFirstUrl(proofText),
    doneSoFar: buildDoneSoFar(row, finding, proofText),
    managerWatch,
    mondayUrl: boardId && id ? `https://monday.com/boards/${boardId}/pulses/${id}` : "",
  };
}

function buildManagerWatch({
  status,
  humanNeeded,
  runtimeState,
  timerState,
  proofText,
  currentStep,
}: {
  status: string;
  humanNeeded: boolean;
  runtimeState: string;
  timerState: string;
  proofText: string;
  currentStep: string;
}): ManagerWatch {
  if (humanNeeded) {
    return {
      agreement: "watch",
      label: "Owner gate",
      tone: "danger",
      action: "I only accept owner-needed status when exhaustion proof exists. If it is valid, I send the smallest Slack DM ask; if not, I reroute it back to the agent.",
    };
  }

  if (isTimerOverdue(timerState)) {
    return {
      agreement: "disagree",
      label: "Rescue required",
      tone: "danger",
      action: "I do not accept this as healthy active work. I am forcing a rescue action: reroute, train, repair, document access failure, or escalate only after exhaustion.",
    };
  }

  if (runtimeState === "needs_dispatcher") {
    return {
      agreement: "disagree",
      label: "Map runner",
      tone: "danger",
      action: "I do not accept unmapped Agent Working status. I am mapping this to a script, schedule, manual SOP proof step, access lane, or a true owner-needed blocker.",
    };
  }

  if (runtimeState === "queue_control_missing_fields") {
    return {
      agreement: "disagree",
      label: "Fix queue fields",
      tone: "danger",
      action: "I do not accept a waiting/review state without full queue controls. I am adding the missing timer, next owner, unlock proof, or rerouting the row.",
    };
  }

  if (runtimeState === "access_blocked") {
    return {
      agreement: "agree",
      label: "Access lane",
      tone: "warm",
      action: "I agree this is not Mike-needed yet. I am pushing the assigned agent through OAuth/API, controlled browser-session, Gmail/history, docs, and proof checks before any owner ask.",
    };
  }

  if (runtimeState === "manual_audit" || same(status, "Ready For Review")) {
    return {
      agreement: proofText ? "agree" : "watch",
      label: proofText ? "Force review" : "Proof needed",
      tone: proofText ? "warm" : "danger",
      action: proofText
        ? "I agree this belongs with Auditor/Manager now. I am expecting a pass, hold, block, or changes-requested result, not silent waiting."
        : "I do not have enough proof to accept review status. I am forcing proof or rerouting the job to the accountable agent.",
    };
  }

  if (runtimeState === "script_runnable") {
    return {
      agreement: "agree",
      label: "Run proof",
      tone: "accent",
      action: "I agree the next move is executable. I am expecting the script/check output to be attached and the row updated after the run.",
    };
  }

  if (runtimeState === "systems_build") {
    return {
      agreement: proofText || currentStep ? "agree" : "watch",
      label: "Build watch",
      tone: proofText || currentStep ? "accent" : "warm",
      action: "I agree this is Systems Director build work if it has an artifact target. I am watching for a created file, page, runner, mapping, or proof link.",
    };
  }

  if (!proofText && !same(status, "Done")) {
    return {
      agreement: "watch",
      label: "Proof watch",
      tone: "warm",
      action: "I am not accepting this as complete. I am watching for proof, a next owner, or a corrected runtime classification.",
    };
  }

  if (same(status, "Done")) {
    return {
      agreement: proofText ? "agree" : "watch",
      label: proofText ? "Closed" : "Closed proof check",
      tone: proofText ? "muted" : "warm",
      action: proofText
        ? "I agree this can stay closed unless Auditor reopens it."
        : "I am checking that Done has proof attached; if not, I route it back for completion proof.",
    };
  }

  return {
    agreement: "watch",
    label: "Manager watch",
    tone: "muted",
    action: "I am watching this row for proof, next owner, timer health, and accurate runtime state.",
  };
}

function buildDoneSoFar(row: MondayAgentJobRow | undefined, finding: WatchdogFinding | undefined, proofText: string) {
  const notes: string[] = [];
  const status = row?.status || finding?.mondayStatus || "";

  if (same(status, "Done")) notes.push("Marked Done in Monday.");
  if (same(status, "Ready For Review")) notes.push("Agent output is in review with Auditor/Manager.");
  if (same(status, "Agent Working")) notes.push("Agent is actively assigned and not waiting on Mike.");
  if (row?.handoffAck || finding?.handoffAck) notes.push(`Handoff recorded: ${row?.handoffAck || finding?.handoffAck}.`);
  if (finding?.recordedRuntimeState || row?.runtimeState) notes.push(`Latest recorded state: ${finding?.recordedRuntimeState || row?.runtimeState}.`);
  if (proofText) notes.push(`Proof attached: ${stripUrl(proofText)}.`);
  if (row?.notes) notes.push(`Monday note: ${truncate(row.notes, 160)}.`);
  if (!notes.length) notes.push("No proof trail recorded yet; this job needs a clearer update.");

  return notes;
}

function sortProgressRows(a: JobProgressRow, b: JobProgressRow) {
  return priority(a) - priority(b) || a.name.localeCompare(b.name);
}

function priority(row: JobProgressRow) {
  if (row.humanNeeded) return 0;
  if (isTimerOverdue(row.timerState)) return 1;
  if (same(row.status, "Ready For Review")) return 2;
  if (same(row.status, "Agent Working")) return 3;
  if (row.status.startsWith("Waiting")) return 4;
  if (same(row.status, "Done")) return 9;
  return 5;
}

function statusTone(status: string, humanNeeded: boolean, timerState: string) {
  if (humanNeeded || isTimerOverdue(timerState)) return "danger" as const;
  if (same(status, "Ready For Review") || status.startsWith("Waiting")) return "warm" as const;
  if (same(status, "Done") || same(status, "Agent Working")) return "accent" as const;
  return "muted" as const;
}

function isTimerOverdue(timerState: string) {
  return timerState === "escalation_missed" || timerState === "expected_receive_missed";
}

function extractFirstUrl(value: string) {
  return value.match(/https?:\/\/\S+/)?.[0]?.replace(/[.)\]]+$/, "") ?? "";
}

function stripUrl(value: string) {
  return truncate(value.replace(/https?:\/\/\S+/g, "").replace(/\s+-\s*$/, "").trim() || value, 140);
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function read(values: Map<string, string>, key: string) {
  return values.get(normalizeKey(key)) ?? "";
}

function isYes(value: string) {
  return /^yes$/i.test(value.trim());
}

function same(a: string, b: string) {
  return normalizeKey(a) === normalizeKey(b);
}

function normalizeKey(value: string) {
  return String(value ?? "").trim().toLowerCase();
}
