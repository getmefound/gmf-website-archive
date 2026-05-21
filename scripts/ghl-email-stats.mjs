#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2023-02-21";
const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX_DIR = `${LEDGER_DIR}/outbox`;
const SOURCES_PATH = `${LEDGER_DIR}/morning-brief-sources.json`;
const CURRENT_STATS_PATH = `${LEDGER_DIR}/ghl-email-stats-current.csv`;

const DEFAULT_LANES = [
  { lane: "reviews", label: "Reviews", workflow: "Reviews Special - Pilot Drip" },
  { lane: "ai", label: "AI Visibility", workflow: "AI Visibility - Pilot Drip" },
  { lane: "relay", label: "Relay", workflow: "Relay - Pilot Drip" },
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const token = process.env.GHL_PIT_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    const message = "GHL email stats skipped: GHL_PIT_TOKEN or GHL_LOCATION_ID is not set.";
    if (args["soft-fail"]) {
      console.log(message);
      return;
    }
    throw new Error(message);
  }

  const date = String(args.date ?? todayEastern());
  const outDir = String(args.outDir ?? args["out-dir"] ?? OUTBOX_DIR);
  mkdirSync(outDir, { recursive: true });

  const config = readJsonIfExists(SOURCES_PATH) ?? {};
  const laneConfigs = buildLaneConfigs(config);
  const campaigns = await listWorkflowCampaigns({ token, locationId });
  const rows = [];
  const reportRows = [];

  for (const laneConfig of laneConfigs) {
    const campaign = campaigns.find((item) => same(item.name, laneConfig.workflow));
    if (!campaign) {
      rows.push(emptyRow({ date, laneConfig, status: "missing_workflow_campaign" }));
      reportRows.push({ laneConfig, campaign: null, stats: null, status: "missing" });
      continue;
    }

    const statsResponse = await getJson(
      `/emails/public/v2/locations/${encodeURIComponent(locationId)}/campaigns/stats/workflow-campaigns/${encodeURIComponent(campaign.sourceId)}`,
      token,
    );
    const stats = statsResponse?.stats ?? {};
    rows.push(normalizeStatsRow({ date, laneConfig, campaign, stats }));
    reportRows.push({ laneConfig, campaign, stats, status: "ok" });
  }

  writeCsv(CURRENT_STATS_PATH, rows);
  const datedCsvPath = resolve(outDir, `ghl-email-stats-${date}.csv`);
  writeCsv(datedCsvPath, rows);

  const report = renderReport({ date, locationId, reportRows });
  const reportPath = resolve(outDir, `ghl-email-stats-${date}.md`);
  writeFileSync(reportPath, report);

  console.log(`GHL email stats current: ${resolve(CURRENT_STATS_PATH)}`);
  console.log(`GHL email stats dated CSV: ${datedCsvPath}`);
  console.log(`GHL email stats report: ${reportPath}`);
  console.log("Read-only stats check complete. No contacts, workflows, settings, or HighLevel AI features were changed.");
}

function buildLaneConfigs(config) {
  const configured = Array.isArray(config.ghlStatsSources) ? config.ghlStatsSources : [];
  return DEFAULT_LANES.map((fallback) => {
    const match = configured.find((item) => same(item.lane, fallback.lane) || same(item.workflow, fallback.workflow));
    return {
      lane: fallback.lane,
      label: fallback.label,
      workflow: match?.workflow || fallback.workflow,
    };
  });
}

async function listWorkflowCampaigns({ token, locationId }) {
  const response = await getJson(
    `/emails/public/v2/locations/${encodeURIComponent(locationId)}/campaigns/workflows`,
    token,
  );
  return asArray(response?.campaigns ?? response?.data ?? response?.workflowCampaigns ?? response);
}

function normalizeStatsRow({ date, laneConfig, campaign, stats }) {
  const sent = number(stats.sent);
  const delivered = number(stats.delivered);
  const bounced = number(stats.permanentFail) + number(stats.temporaryFail);
  return {
    date,
    lane: laneConfig.lane,
    workflow: laneConfig.workflow,
    total: sent,
    sent,
    accepted: number(stats.accepted),
    delivered,
    delivered_pct: pct(delivered, sent),
    opened: number(stats.opened),
    opened_pct: rate(stats.openRate),
    clicked: number(stats.clicked),
    clicked_pct: rate(stats.clickRate),
    replied: number(stats.replied),
    reply_pct: rate(stats.replyRate),
    bounced,
    bounce_pct: rate(stats.bounceRate),
    unsubscribed: number(stats.unsubscribed),
    complained: number(stats.complained),
    source: "ghl_api_workflow_campaigns",
    source_id: campaign.sourceId || "",
    status: campaign.status || "",
    notes: "Read-only HighLevel Email Statistics API.",
  };
}

function emptyRow({ date, laneConfig, status }) {
  return {
    date,
    lane: laneConfig.lane,
    workflow: laneConfig.workflow,
    total: 0,
    sent: 0,
    accepted: 0,
    delivered: 0,
    delivered_pct: 0,
    opened: 0,
    opened_pct: 0,
    clicked: 0,
    clicked_pct: 0,
    replied: 0,
    reply_pct: 0,
    bounced: 0,
    bounce_pct: 0,
    unsubscribed: 0,
    complained: 0,
    source: "ghl_api_workflow_campaigns",
    source_id: "",
    status,
    notes: "Workflow campaign was not found by the read-only API.",
  };
}

function renderReport({ date, locationId, reportRows }) {
  return `# GHL Email Stats

Date: ${date}
Location ID: \`${locationId}\`
Mode: read-only

## Owner Summary

${reportRows.map(renderOwnerLine).join("\n")}

## API Proof

| Lane | Workflow | Source | Source ID | Status |
|---|---|---|---|---|
${reportRows
  .map((row) => {
    const campaign = row.campaign ?? {};
    return `| ${row.laneConfig.label} | ${cell(row.laneConfig.workflow)} | workflow-campaigns | ${cell(campaign.sourceId || "missing")} | ${cell(campaign.status || row.status)} |`;
  })
  .join("\n")}

## Safety

- This job only reads HighLevel Email Statistics.
- No contacts, workflows, settings, domains, or HighLevel AI features were changed.
- HighLevel AI features remain OFF unless Mike explicitly approves them manually.

## Source

Official HighLevel endpoint: \`GET /emails/public/v2/locations/:locationId/campaigns/stats/:source/:sourceId\`
`;
}

function renderOwnerLine(row) {
  if (!row.stats) return `- ${row.laneConfig.label}: stats not found yet.`;
  const sent = number(row.stats.sent);
  const delivered = number(row.stats.delivered);
  const opened = number(row.stats.opened);
  const bounced = number(row.stats.permanentFail) + number(row.stats.temporaryFail);
  return `- ${row.laneConfig.label}: ${sent} sent, ${delivered} delivered, ${opened} opened, ${number(row.stats.replied)} replies, ${bounced} bounces, ${number(row.stats.unsubscribed)} unsubscribes.`;
}

async function getJson(path, token) {
  const res = await fetch(`${GHL_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path}: ${res.status} ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${path}: parse_failed ${text.slice(0, 300)}`);
  }
}

function writeCsv(path, rows) {
  const headers = [
    "date",
    "lane",
    "workflow",
    "total",
    "sent",
    "accepted",
    "delivered",
    "delivered_pct",
    "opened",
    "opened_pct",
    "clicked",
    "clicked_pct",
    "replied",
    "reply_pct",
    "bounced",
    "bounce_pct",
    "unsubscribed",
    "complained",
    "source",
    "source_id",
    "status",
    "notes",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function rate(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? round(numeric) : 0;
}

function pct(part, whole) {
  return whole > 0 ? round((part / whole) * 100) : 0;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function number(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function readJsonIfExists(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) return null;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return null;
  }
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim();
  }
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

function todayEastern() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function printHelp() {
  console.log(`
Fetch read-only HighLevel email workflow campaign stats for the Morning Brief.

Examples:
  npm run ghl:email-stats
  npm run ghl:email-stats -- --date 2026-05-21
  npm run ghl:email-stats -- --soft-fail

Outputs:
  docs/client-ops-ledger/ghl-email-stats-current.csv
  docs/client-ops-ledger/outbox/ghl-email-stats-YYYY-MM-DD.md

No contacts, workflows, settings, domains, or HighLevel AI features are changed.
`);
}
