#!/usr/bin/env node

import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_PATH = "docs/client-ops-ledger/reach-warmup-autopilot.json";
const OUTBOX = "docs/client-ops-ledger/outbox";

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const date = String(args.date ?? today()).trim();
  const config = readJson(CONFIG_PATH) ?? {};
  const relayReport = readJson(`${OUTBOX}/reach-warmup-relay-${date}.json`);
  const discoverySummary = readText(`${OUTBOX}/reach-discovery-summary-${date}.md`);
  const discoveryRelay = readText(`${OUTBOX}/reach-discovery-relay-${date}.md`);

  const relayMin = Number(relayReport?.quota?.min ?? quotaForDay(config, date)?.min ?? 10);
  const relaySelected = Number(relayReport?.selectedCount ?? 0);
  const scrapedToday = scrapedFromReport(relayReport, date);
  const laneDailyCap = Number(config.guardrails?.max_total_scraped_per_lane_per_day ?? 0);
  const remainingLaneScrape = Math.max(0, laneDailyCap - scrapedToday);
  const relayShort = !relayReport || relaySelected < relayMin;
  const canRetryRelay = relayShort && remainingLaneScrape > 0;
  const discoveryHeld = /Mode:\s*plan-only|Status:\s*held|Spend approved:\s*no|Plan-only mode/i.test(
    `${discoverySummary}\n${discoveryRelay}`,
  );
  const status = canRetryRelay ? "auto-retry-relay" : relayShort ? "needs-owner-attention" : "ok";
  const path = `${OUTBOX}/reach-manager-check-${date}.md`;
  const text = renderReport({
    date,
    status,
    relayReport,
    relayMin,
    relaySelected,
    scrapedToday,
    laneDailyCap,
    remainingLaneScrape,
    discoveryHeld,
    canRetryRelay,
  });

  mkdirSync(OUTBOX, { recursive: true });
  writeFileSync(path, text);
  writeGithubOutput(args["github-output"], {
    retry_relay: String(canRetryRelay),
    status,
    summary_path: path,
  });
  console.log(text);
  console.log("");
  console.log(`Manager check: ${resolve(path)}`);
}

function renderReport({
  date,
  status,
  relayReport,
  relayMin,
  relaySelected,
  scrapedToday,
  laneDailyCap,
  remainingLaneScrape,
  discoveryHeld,
  canRetryRelay,
}) {
  const relayStatus = relayReport?.status ?? "missing";
  const action = canRetryRelay
    ? "Manager will run one more capped Relay refill automatically."
    : relaySelected >= relayMin
      ? "Relay has enough clean contacts for the next guarded action."
      : "Manager cannot refill more inside today's cap; alert Mike only if this blocks the campaign.";
  const discoveryLine = discoveryHeld
    ? "Discovery did not run live or returned no usable contacts; Manager should not rely on it for today's Relay recovery."
    : "Discovery does not show a plan-only blocker.";

  return `# Reach Manager Check

Date: ${date}
Status: ${status}

## Owner Readout

- Relay clean contacts: ${relaySelected}/${relayMin}.
- Relay status: ${relayStatus}.
- Scraped today: ${scrapedToday}/${laneDailyCap} records.
- Remaining Relay scrape room today: ${remainingLaneScrape}.
- ${discoveryLine}

## Manager Action

${action}

## Safety

- This check does not import contacts.
- This check does not start drip.
- This check does not enable or change HighLevel AI features.
- Any auto-retry still uses Outscraper caps, NeverBounce verification, QA, duplicate filtering, and GHL guardrails.
`;
}

function quotaForDay(config, date) {
  const dayNumber = warmupDay(config.planned_start_date, date);
  return (config.daily_quota_ladder ?? []).find((quota) => dayNumber >= Number(quota.from_day) && dayNumber <= Number(quota.to_day));
}

function warmupDay(startDate, date) {
  const start = parseDateOnly(startDate);
  const current = parseDateOnly(date);
  if (!start || !current) return 1;
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1);
}

function scrapedFromReport(report, date) {
  const reportTotal = Array.isArray(report?.attempts)
    ? report.attempts.reduce((sum, attempt) => sum + (Number(attempt.scrapeLimit) || 0), 0)
    : 0;
  const rawTotal = warmupRawScrapeFiles("relay", report?.date ?? date).reduce((sum, file) => sum + readJsonArrayLength(file), 0);
  return Math.max(reportTotal, rawTotal);
}

function warmupRawScrapeFiles(laneKey, date = "") {
  const datePattern = date ? String(date).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "\\d{4}-\\d{2}-\\d{2}";
  const pattern = new RegExp(`^tmp-reach-warmup-${laneKey}-${datePattern}-a\\d+\\.json$`);
  return existsSync(resolve(".")) ? readdirSafe(".").filter((file) => pattern.test(file)).sort() : [];
}

function readJsonArrayLength(path) {
  try {
    const value = JSON.parse(readFileSync(resolve(path), "utf8"));
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}

function readdirSafe(path) {
  try {
    return readdirSync(resolve(path));
  } catch {
    return [];
  }
}

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseDateOnly(value) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) return null;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return null;
  }
}

function readText(path) {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function writeGithubOutput(path, values) {
  if (!path) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value).replace(/\r?\n/g, " ")}`);
  appendFileSync(path, `${lines.join("\n")}\n`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Check the morning Reach run and decide whether Manager should retry Relay.

Usage:
  node scripts/reach-manager-check.mjs
  node scripts/reach-manager-check.mjs --date 2026-05-21 --github-output "$GITHUB_OUTPUT"
`);
}
