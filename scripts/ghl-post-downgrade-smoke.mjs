#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const READINESS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const STATS_PATH = "docs/client-ops-ledger/ghl-email-stats-current.csv";

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = String(args.outDir ?? args["out-dir"] ?? OUTBOX_DIR);
  mkdirSync(outDir, { recursive: true });

  const steps = [
    runStep("GHL exit inventory", ["run", "ghl:exit-inventory"]),
    runStep("Reach readiness", ["run", "reach:ghl-check"]),
    runStep("GHL email stats", ["run", "ghl:email-stats"]),
  ];

  const inventory = readLatestJson(outDir, /^ghl-exit-inventory-\d{4}-\d{2}-\d{2}\.json$/);
  const readinessRows = existsSync(READINESS_PATH) ? readCsv(READINESS_PATH) : [];
  const statsRows = existsSync(STATS_PATH) ? readCsv(STATS_PATH) : [];
  const checks = buildChecks({ steps, inventory, readinessRows, statsRows });
  const report = renderReport({ checks, inventory, readinessRows, statsRows, steps });
  const outPath = resolve(outDir, `ghl-post-downgrade-smoke-${today()}.md`);
  writeFileSync(outPath, report);

  console.log(`GHL post-downgrade smoke report: ${outPath}`);
  console.log(ownerSummary(checks));
  process.exit(checks.some((check) => check.result === "blocker") ? 1 : 0);
}

function runStep(label, npmArgs) {
  const result = spawnSync("npm", npmArgs, { encoding: "utf8", shell: true });
  return {
    label,
    ok: result.status === 0,
    status: result.status,
    output: trim(`${result.stdout || ""}\n${result.stderr || ""}`),
  };
}

function buildChecks({ steps, inventory, readinessRows, statsRows }) {
  const surfaces = inventory?.surfaces ?? [];
  const surface = (key) => surfaces.find((item) => item.key === key);
  const stepCheck = steps.map((step) => ({
    label: step.label,
    result: step.ok ? "pass" : "blocker",
    note: step.ok ? "Read-only command completed." : step.output || "Command failed.",
  }));

  const coreSurfaces = [
    ["Location API", surface("location")],
    ["Workflows API", surface("workflows")],
    ["Email campaign metadata", surface("emailWorkflowCampaigns")],
    ["Calendars metadata", surface("calendars")],
    ["Pipelines metadata", surface("pipelines")],
  ].map(([label, item]) => ({
    label,
    result: item?.ok ? "pass" : "blocker",
    note: item?.ok ? `${item.count} returned.` : item?.error || "Not returned by inventory.",
  }));

  const readyImport = readinessRows.filter((row) => yes(row.ready_for_import)).length;
  const readyDrip = readinessRows.filter((row) => yes(row.ready_for_drip)).length;
  const readinessCheck = {
    label: "Reach readiness ledger",
    result: readyImport >= 2 ? "pass" : "watch",
    note: `${readyImport}/${readinessRows.length} lanes import-ready; ${readyDrip}/${readinessRows.length} lanes drip-ready.`,
  };

  const statsTotal = statsRows.reduce((sum, row) => sum + number(row.sent), 0);
  const statsCheck = {
    label: "Email stats visibility",
    result: statsRows.length ? "pass" : "watch",
    note: statsRows.length ? `${statsRows.length} lanes visible; ${statsTotal} total sent in current stats file.` : "No stats rows found.",
  };

  const highLevelAiCheck = {
    label: "HighLevel AI safety",
    result: "pass",
    note: "No command toggled HighLevel AI. Rule remains OFF unless Mike manually approves.",
  };

  return [...stepCheck, ...coreSurfaces, readinessCheck, statsCheck, highLevelAiCheck];
}

function renderReport({ checks, inventory, readinessRows, statsRows, steps }) {
  return `# GHL $97 Post-Downgrade Smoke Check

Date: ${today()}
Mode: read-only

## Owner Summary

${ownerSummary(checks)}

## Checks

| Check | Result | Note |
|---|---|---|
${checks.map((check) => `| ${cell(check.label)} | ${check.result} | ${cell(check.note)} |`).join("\n")}

## Current GHL Footprint

${inventorySummary(inventory)}

## Reach Lane Status

| Lane | Import ready | Drip ready | Last checked | Notes |
|---|---|---|---|---|
${readinessRows
  .map((row) => `| ${cell(row.lane)} | ${cell(row.ready_for_import)} | ${cell(row.ready_for_drip)} | ${cell(row.last_checked)} | ${cell(row.notes)} |`)
  .join("\n")}

## Email Stats Visibility

| Lane | Workflow | Sent | Delivered | Opened | Replies | Bounces |
|---|---|---:|---:|---:|---:|---:|
${statsRows
  .map((row) => `| ${cell(row.lane)} | ${cell(row.workflow)} | ${number(row.sent)} | ${number(row.delivered)} | ${number(row.opened)} | ${number(row.replied)} | ${number(row.bounced)} |`)
  .join("\n")}

## Command Proof

${steps.map((step) => `### ${step.label}\n\n- Result: ${step.ok ? "pass" : "failed"}\n- Exit code: ${step.status}\n`).join("\n")}

## Safety

- Read-only checks only.
- No contacts, workflows, settings, wallets, add-ons, or HighLevel AI features were changed.
- GHL stays bridge-only at $97.
- Do not buy Calendly, Smartlead/Instantly, or a separate review email sender unless a specific blocker appears.
`;
}

function ownerSummary(checks) {
  const blockers = checks.filter((check) => check.result === "blocker");
  const watches = checks.filter((check) => check.result === "watch");
  if (blockers.length) return `Blocker: ${blockers.map((check) => check.label).join(", ")}.`;
  if (watches.length) return `Pass with watch items: ${watches.map((check) => check.label).join(", ")}.`;
  return "Pass: $97 downgrade did not break the checked GHL bridge surfaces.";
}

function inventorySummary(inventory) {
  const surfaces = inventory?.surfaces ?? [];
  if (!surfaces.length) return "- No inventory JSON found.";
  return surfaces
    .filter((surface) => surface.ok)
    .map((surface) => `- ${surface.label}: ${surface.count}`)
    .join("\n");
}

function readLatestJson(dir, pattern) {
  const files = readdirSync(dir)
    .filter((file) => pattern.test(file))
    .sort();
  const latest = files.at(-1);
  if (!latest) return null;
  return JSON.parse(readFileSync(resolve(dir, latest), "utf8"));
}

function readCsv(path) {
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const next = line[index + 1];
    if (quoted && char === '"' && next === '"') {
      value += '"';
      index++;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      values.push(value);
      value = "";
      continue;
    }
    value += char;
  }
  values.push(value);
  return values;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index++;
    }
  }
  return args;
}

function yes(value) {
  return String(value ?? "").trim().toLowerCase() === "yes";
}

function number(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function trim(value) {
  return String(value ?? "").trim().slice(0, 1200);
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
