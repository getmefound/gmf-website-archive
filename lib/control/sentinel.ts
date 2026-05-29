import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const CURRENT_REPORT = "docs/client-ops-ledger/business-improvement-audit-current.md";
const OUTBOX_DIR = "docs/client-ops-ledger/outbox";

export type SentinelGrade = {
  area: "Operations" | "Prospecting" | "Client Success";
  grade: string;
  score: number;
  temperature: "hot" | "cool";
  reason: string;
  action: string;
};

export type SentinelSuggestion = {
  title: string;
  owner: string;
  temperature: "hot" | "cool";
  command: string;
  reason: string;
};

export type SentinelLink = {
  title: string;
  href: string;
  kind: "internal" | "source";
  reason: string;
};

export type SentinelReport = {
  name: string;
  tagline: string;
  date: string;
  generatedFrom: string;
  currentText: string;
  previousText: string;
  previousLabel: string;
  metrics: {
    efficiencyScore: number;
    watchedJobs: number;
    ownerNeeded: number;
    timerOverdue: number;
    queueMissing: number;
    accessBlocked: number;
    manualAudit: number;
    systemsBuild: number;
    paidClients: number;
    testClients: number;
  };
  mainConstraint: string;
  ownerDecision: string;
  grades: SentinelGrade[];
  suggestions: SentinelSuggestion[];
  links: SentinelLink[];
  southington: {
    status: string;
    timer: string;
    expected: string;
    escalate: string;
    reason: string;
  };
};

export function getSentinelReport(): SentinelReport {
  const currentText = readText(CURRENT_REPORT) || fallbackReport();
  const outboxReports = readOutboxReports();
  const previous = findPreviousReport(outboxReports, currentText);
  const metrics = parseMetrics(currentText);
  const date = matchLine(currentText, /^Date:\s*(.+)$/m) || "No report date";
  const mainConstraint = matchLine(currentText, /^- Main constraint:\s*(.+)$/m) || "No constraint recorded.";
  const ownerDecision = sectionFirstBullet(currentText, "Owner Decisions") || "No owner decision required right now.";

  return {
    name: "Agent Ness",
    tagline: "Independent operating auditor for agents, process, prospecting, and retention.",
    date,
    generatedFrom: CURRENT_REPORT,
    currentText,
    previousText: previous.text,
    previousLabel: previous.label,
    metrics,
    mainConstraint,
    ownerDecision,
    grades: buildGrades(metrics),
    suggestions: buildSuggestions(metrics, mainConstraint),
    links: usefulLinks(),
    southington: parseSouthington(currentText),
  };
}

function parseMetrics(text: string): SentinelReport["metrics"] {
  return {
    efficiencyScore: numberAfter(text, "Agent efficiency score"),
    watchedJobs: numberAfter(text, "Watched active jobs"),
    ownerNeeded: numberAfter(text, "Owner-needed jobs"),
    timerOverdue: numberAfter(text, "Timer overdue jobs"),
    queueMissing: numberAfter(text, "Queue-control missing-field jobs"),
    accessBlocked: numberAfter(text, "Access-blocked jobs"),
    manualAudit: numberAfter(text, "Manual audit queue"),
    systemsBuild: numberAfter(text, "Systems build queue"),
    paidClients: numberAfter(text, "Paid active clients"),
    testClients: numberAfter(text, "Test/internal clients"),
  };
}

function buildGrades(metrics: SentinelReport["metrics"]): SentinelGrade[] {
  const operationsScore = clamp(metrics.efficiencyScore - metrics.timerOverdue * 8 - metrics.queueMissing * 6);
  const prospectingScore = metrics.ownerNeeded > 0 ? 65 : 82;
  const clientSuccessScore = clamp(72 - metrics.accessBlocked * 4 - (metrics.paidClients === 0 ? 10 : 0));

  return [
    {
      area: "Operations",
      grade: gradeFor(operationsScore),
      score: operationsScore,
      temperature: metrics.manualAudit > 6 || metrics.systemsBuild > 3 ? "hot" : "cool",
      reason: `${metrics.manualAudit} manual-audit items and ${metrics.systemsBuild} systems-build items are still open.`,
      action: "Batch Auditor review and finish the scheduled dispatcher.",
    },
    {
      area: "Prospecting",
      grade: gradeFor(prospectingScore),
      score: prospectingScore,
      temperature: "hot",
      reason: "Smartlead is ready for a tiny seed test, but live sends still need launch guardrails.",
      action: "Prepare one seed-test packet for a narrow local-business segment.",
    },
    {
      area: "Client Success",
      grade: gradeFor(clientSuccessScore),
      score: clientSuccessScore,
      temperature: metrics.accessBlocked > 0 ? "hot" : "cool",
      reason: `${metrics.accessBlocked} access-blocked items limit client proof and handoff completion.`,
      action: "Resolve authenticated GBP proof or document exhaustion by timer.",
    },
  ];
}

function buildSuggestions(metrics: SentinelReport["metrics"], mainConstraint: string): SentinelSuggestion[] {
  return [
    {
      title: "Batch Auditor review into pass / hold / block",
      owner: "Auditor",
      temperature: metrics.manualAudit > 5 ? "hot" : "cool",
      command: "Elon, have Auditor batch the proof-ready items and show pass / hold / block.",
      reason: "Manual review is the largest queue and will slow every SOP if it stays loose.",
    },
    {
      title: "Finish the watchdog dispatcher",
      owner: "Systems Director",
      temperature: metrics.systemsBuild > 3 ? "hot" : "cool",
      command: "Elon, have Systems Director make watchdog automatic and prove the next scheduled run.",
      reason: "The timer exists, but scheduled execution is still the next operating upgrade.",
    },
    {
      title: "Clear Southington authenticated GBP proof",
      owner: "Profile Manager",
      temperature: mainConstraint.toLowerCase().includes("authenticated") ? "hot" : "cool",
      command: "Elon, push Profile Manager to capture inside-GBP proof or document exhaustion before the timer.",
      reason: "Client proof cannot advance cleanly until access is verified or formally exhausted.",
    },
    {
      title: "Build the tiny prospecting seed-test packet",
      owner: "Sales Manager",
      temperature: "hot",
      command: "Elon, have Sales Manager draft the first seed-test approval packet.",
      reason: "Smartlead is ready, so the next growth move is controlled acquisition proof.",
    },
    {
      title: "Separate paid clients, pilots, and internal demos",
      owner: "Reporter",
      temperature: metrics.paidClients === 0 ? "hot" : "cool",
      command: "Elon, have Reporter clean the client registry view so paid, pilot, and internal rows are separate.",
      reason: "Retention reporting needs clean client classes before 50+ clients arrive.",
    },
  ];
}

function usefulLinks(): SentinelLink[] {
  const links: SentinelLink[] = [
    {
      title: "Setup Jobs",
      href: "/mike-mc/setup-jobs",
      kind: "internal",
      reason: "Where access blockers and onboarding proof should be visible.",
    },
    {
      title: "Workflow Library",
      href: "/mike-mc/workflows",
      kind: "internal",
      reason: "Best owner view for SOP flow, stalls, and handoffs.",
    },
    {
      title: "Google GBP managers",
      href: "https://support.google.com/business/answer/3403100?p=edit_manager",
      kind: "source",
      reason: "Official role/access rules for why inside-GBP proof matters.",
    },
    {
      title: "Google AI features and your site",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
      kind: "source",
      reason: "Official Google guidance for AI Search visibility work.",
    },
    {
      title: "OpenClaw specialist lanes",
      href: "https://docs.openclaw.ai/concepts/parallel-specialist-lanes",
      kind: "source",
      reason: "Useful pattern for agent lane contracts and coordinator discipline.",
    },
  ];
  return links.slice(0, 5);
}

function parseSouthington(text: string): SentinelReport["southington"] {
  const line =
    text
      .split(/\r?\n/)
      .find((value) => value.includes("Southington - Verify GBP Manager access")) || "";
  return {
    status: matchValue(line, /:\s*([^;]+);/) || "Waiting on Access",
    timer: matchValue(line, /timer\s+([^;]+);/) || "timer_ok",
    expected: matchValue(line, /expected\s+([^;]+);/) || "2026-05-29T12:00:00-04:00",
    escalate: matchValue(line, /escalate\s+([^;]+);/) || "2026-05-29T15:00:00-04:00",
    reason:
      "Public Google evidence proves the profile exists; only an authenticated linked account or OAuth/API path proves Manager role and edit access.",
  };
}

function readOutboxReports() {
  const dir = resolve(OUTBOX_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => /^business-improvement-audit-.*\.md$/.test(file))
    .map((file) => {
      const path = join(dir, file);
      return { file, path, text: readText(path) };
    })
    .filter((report) => report.text)
    .sort((a, b) => b.file.localeCompare(a.file));
}

function findPreviousReport(reports: Array<{ file: string; text: string }>, currentText: string) {
  const currentDate = matchLine(currentText, /^Date:\s*(.+)$/m);
  const previousDifferentDay = reports.find((report) => {
    const date = matchLine(report.text, /^Date:\s*(.+)$/m);
    return date && currentDate && date !== currentDate;
  });
  if (previousDifferentDay) return { label: previousDifferentDay.file, text: previousDifferentDay.text };
  const latest = reports[0];
  if (latest) return { label: "First baseline run", text: latest.text };
  return { label: "No prior report yet", text: currentText };
}

function numberAfter(text: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`- ${escaped}:\\s*(\\d+)`, "i"));
  return match ? Number(match[1]) : 0;
}

function gradeFor(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function clamp(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function sectionFirstBullet(text: string, section: string) {
  const match = text.match(new RegExp(`## ${section}\\s+([\\s\\S]*?)(\\n## |$)`));
  if (!match) return "";
  return match[1].split(/\r?\n/).find((line) => line.trim().startsWith("- "))?.replace(/^- /, "").trim() || "";
}

function matchLine(text: string, pattern: RegExp) {
  return text.match(pattern)?.[1]?.trim() || "";
}

function matchValue(text: string, pattern: RegExp) {
  return text.match(pattern)?.[1]?.trim() || "";
}

function readText(path: string) {
  const full = resolve(path);
  return existsSync(full) ? readFileSync(full, "utf8") : "";
}

function fallbackReport() {
  return `# Business Improvement Auditor Morning Report

Date: unavailable

## Owner Summary

- Mike needed today: no
- Agent efficiency score: 0/100
- Watched active jobs: 0
- Owner-needed jobs: 0
- Timer overdue jobs: 0
- Queue-control missing-field jobs: 0
- Access-blocked jobs: 0
- Manual audit queue: 0
- Systems build queue: 0
- Main constraint: No report has been generated yet.

## Owner Decisions

- Run npm run agent:business-audit to generate Agent Ness's first report.
`;
}
