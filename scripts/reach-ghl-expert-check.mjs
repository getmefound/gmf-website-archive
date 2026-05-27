#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const LANES = {
  reviews: {
    label: "Reviews",
    dedicatedDomain: "mail.aioutsourcehubs.com",
    fromEmail: "mike@mail.aioutsourcehubs.com",
    campaignTag: "aoh_campaign_reviews",
    importedTag: "aoh_campaign_reviews_imported",
    startTag: "aoh_campaign_reviews_start",
    coldWorkflow: "Reviews Special - Pilot Drip",
    replyWorkflow: "Campaign Reply - Reviews Send",
    pipeline: "Reach - Reviews",
    warmStage: "Warm Leads",
  },
  ai: {
    label: "AI Visibility",
    dedicatedDomain: "mail.getaioutsourcehub.com",
    fromEmail: "mike@mail.getaioutsourcehub.com",
    campaignTag: "aoh_campaign_ai_visibility",
    importedTag: "aoh_campaign_ai_imported",
    startTag: "aoh_campaign_ai_visibility_start",
    coldWorkflow: "AI Visibility - Pilot Drip",
    replyWorkflow: "Campaign Reply - AI Visibility Send",
    pipeline: "Reach - AI",
    warmStage: "Warm Leads",
  },
  relay: {
    label: "Relay",
    dedicatedDomain: "mail.myaioutsourcehub.com",
    fromEmail: "mike@mail.myaioutsourcehub.com",
    campaignTag: "aoh_campaign_relay",
    importedTag: "aoh_campaign_relay_imported",
    startTag: "aoh_campaign_relay_start",
    coldWorkflow: "Relay - Pilot Drip",
    replyWorkflow: "Campaign Reply - Relay Send",
    pipeline: "Reach - Relay",
    warmStage: "Warm Leads",
  },
};

const FIELD_IDS = {
  businessName: "98RC4gU1FR9SDpSAs0ho",
  productOrderCompanyName: "Ujpd3zNVGEtmiIR73OZ3",
  websiteMarketingAuditReport: "iE0EbTGkRwLJMHLsr0Yj",
  cityMarketingAuditReport: "i1xZWM6PuWNBDuVqR0Dt",
  stateMarketingAuditReport: "mOpqct6qm8DYJIIIWEl0",
  emailMarketingAuditReport: "4kgAtEFQyKya1hKVWaLo",
  gbpRating: "8QBiI3hdQljVmpHOhEvq",
  gbpReviewCount: "fRZfxk8HQ5Tcj1mJEuod",
  gbpLastReview: "dLdnUmq5fTEqjuvWhDHs",
  gbpCategories: "42OpFsF6PxuLvok5yQTT",
  topCompetitorName: "njpBBdT7kS3grTvaHY9g",
  topCompetitorReviewCount: "CNiQRXxZPY0dzLcKNkjd",
  niche: "6wItCWXqDFECRX67Ki3F",
  prospectLink: "rs6FEOL7ZMItZ3kSBoc7",
  campaignSource: "kBW9m7V0hTehnb9N3WlK",
  offerLane: "xRNb2vJGyf7lXGFscSfh",
  leadSource: "LIILv8zU5JGSYxmRsbsB",
};

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

  const token = requiredEnv("GHL_PIT_TOKEN");
  const locationId = requiredEnv("GHL_LOCATION_ID");
  const outDir = String(args.outDir ?? args["out-dir"] ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outDir, { recursive: true });

  const pipelines = await getJson(`/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`, token);
  const workflows = await tryGetWorkflows(token, locationId);
  const customFields = await tryGetCustomFields(token, locationId);
  const checks = buildChecks({ pipelines, workflows, customFields });
  const report = renderReport({ locationId, checks, workflows, customFields });
  const outPath = resolve(outDir, `ghl-expert-readiness-${today()}.md`);
  writeFileSync(outPath, report);
  updateDomainReadiness("docs/client-ops-ledger/sending-domain-readiness.csv", checks);

  console.log(`GHL Expert readiness report: ${outPath}`);
  console.log("Read-only check complete. No contacts, tags, workflows, or settings were changed.");
}

function buildChecks({ pipelines, workflows, customFields }) {
  const pipelineList = asArray(pipelines?.pipelines);
  const workflowList = asArray(workflows?.workflows ?? workflows?.data ?? workflows);
  const fieldList = asArray(customFields?.customFields ?? customFields?.fields ?? customFields);

  return Object.entries(LANES).map(([laneKey, lane]) => {
    const pipeline = findByName(pipelineList, lane.pipeline);
    const warmStage = asArray(pipeline?.stages).find((stage) => same(stage?.name, lane.warmStage));
    const coldWorkflow = findByName(workflowList, lane.coldWorkflow);
    const replyWorkflow = findByName(workflowList, lane.replyWorkflow);

    return {
      laneKey,
      lane,
      pipelineFound: Boolean(pipeline),
      warmStageFound: Boolean(warmStage),
      coldWorkflowFound: Boolean(coldWorkflow),
      coldWorkflowStatus: readWorkflowStatus(coldWorkflow),
      replyWorkflowFound: Boolean(replyWorkflow),
      replyWorkflowStatus: readWorkflowStatus(replyWorkflow),
      customFieldsFound: Object.values(FIELD_IDS).filter((id) => findField(fieldList, id)).length,
      customFieldsTotal: Object.values(FIELD_IDS).length,
    };
  });
}

function renderReport({ locationId, checks, workflows, customFields }) {
  const workflowAvailable = workflows?.ok !== false;
  const customFieldsAvailable = customFields?.ok !== false;

  return `# GHL Expert Reach Readiness

Date: ${today()}
Location ID: \`${locationId}\`
Mode: read-only

## Summary

| Lane | Domain | From email | Pipeline | Warm stage | Cold workflow | Reply workflow | Custom fields |
|---|---|---|---|---|---|---|---|
${checks
  .map(
    (check) =>
      `| ${check.lane.label} | ${check.lane.dedicatedDomain} | ${check.lane.fromEmail} | ${mark(check.pipelineFound)} | ${mark(check.warmStageFound)} | ${mark(check.coldWorkflowFound)} ${cell(check.coldWorkflowStatus)} | ${mark(check.replyWorkflowFound)} ${cell(check.replyWorkflowStatus)} | ${check.customFieldsFound}/${check.customFieldsTotal} |`,
  )
  .join("\n")}

## Tag Map

| Lane | Campaign tag | Import-only tag | Live start tag |
|---|---|---|---|
${Object.values(LANES)
  .map((lane) => `| ${lane.label} | \`${lane.campaignTag}\` | \`${lane.importedTag}\` | \`${lane.startTag}\` |`)
  .join("\n")}

## Readiness Judgment

${checks.map(readinessLine).join("\n")}

## Limitations

- This checker uses the LeadConnector API in read-only mode.
- It can verify location access, pipelines, stages, workflow metadata when exposed by the API, and configured custom field IDs.
- It does not prove the exact email sender/domain inside a workflow email node unless the workflow endpoint exposes those internals.
- GHL Expert should still visually confirm email sender/domain, warmup status, and HighLevel AI toggles in GHL before start-drip approval.

## API Coverage

| Surface | Result |
|---|---|
| Workflows API | ${workflowAvailable ? "available" : `unavailable: ${cell(workflows?.error)}`} |
| Custom fields API | ${customFieldsAvailable ? "available" : `unavailable: ${cell(customFields?.error)}`} |

## Hard Safety Rule

HighLevel AI features must remain OFF unless Mike explicitly authorizes them manually.
`;
}

function readinessLine(check) {
  const blockers = readinessBlockers(check);

  if (blockers.length) {
    return `- ${check.lane.label}: not ready for start-drip until ${blockers.join("; ")}.`;
  }
  return `- ${check.lane.label}: API metadata looks ready for GHL Expert visual sender-domain/warmup confirmation.`;
}

function readinessBlockers(check) {
  const blockers = [];
  if (!check?.pipelineFound) blockers.push(`missing pipeline ${check?.lane?.pipeline ?? "unknown"}`);
  if (!check?.warmStageFound) blockers.push(`missing ${check?.lane?.warmStage ?? "warm"} stage`);
  if (!check?.coldWorkflowFound) blockers.push(`missing cold workflow ${check?.lane?.coldWorkflow ?? "unknown"}`);
  if (!check?.replyWorkflowFound) blockers.push(`missing reply workflow ${check?.lane?.replyWorkflow ?? "unknown"}`);
  if ((check?.customFieldsFound ?? 0) < (check?.customFieldsTotal ?? 0)) {
    blockers.push("some campaign custom fields were not verified by API");
  }
  return blockers;
}

async function tryGetWorkflows(token, locationId) {
  const paths = [
    `/workflows/?locationId=${encodeURIComponent(locationId)}`,
    `/workflows?locationId=${encodeURIComponent(locationId)}`,
  ];
  return tryFirst(paths, token);
}

async function tryGetCustomFields(token, locationId) {
  const paths = [
    `/locations/${encodeURIComponent(locationId)}/customFields`,
    `/locations/${encodeURIComponent(locationId)}/custom-fields`,
  ];
  return tryFirst(paths, token);
}

async function tryFirst(paths, token) {
  const errors = [];
  for (const path of paths) {
    try {
      const data = await getJson(path, token);
      return data;
    } catch (error) {
      errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { ok: false, error: errors.join(" | ") };
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
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`parse_failed ${text.slice(0, 300)}`);
  }
}

function updateDomainReadiness(path, checks) {
  const existingRows = existsSync(path) ? readCsv(path) : [];
  const existingByLane = new Map(existingRows.map((row) => [String(row.lane ?? "").trim().toLowerCase(), row]));

  const rows = Object.entries(LANES).map(([laneKey, lane]) => ({
    ...buildReadinessRow({
      laneKey,
      lane,
      check: checks.find((item) => item.laneKey === laneKey),
      existing: existingByLane.get(laneKey) ?? {},
    }),
  }));
  writeCsv(path, rows);
}

function buildReadinessRow({ laneKey, lane, check, existing }) {
  const blockers = readinessBlockers(check);
  const apiMetadataReady = blockers.length === 0;
  const priorDripReady = isYes(existing.ready_for_drip);
  const readyForDrip = apiMetadataReady && priorDripReady;
  const checkedBy = readyForDrip ? preserveCheckedBy(existing.checked_by) : "GHL Expert";
  const notes = readyForDrip
    ? `From ${lane.fromEmail}. API metadata rechecked ${today()}; prior start-drip approval preserved. ${cleanExistingReadinessNote(existing.notes, lane.fromEmail)}`.trim()
    : `From ${lane.fromEmail}. ${
        apiMetadataReady
          ? "Visual GHL sender-domain/warmup confirmation still required before start-drip."
          : `Not ready: ${blockers.join("; ")}.`
      }`;

  return {
    lane: laneKey,
    dedicated_subdomain: lane.dedicatedDomain,
    warmup_status: existing.warmup_status || "warming",
    warmup_started: existing.warmup_started || "TBD",
    allowed_daily_send_volume: existing.allowed_daily_send_volume || "10-20",
    ready_for_import: apiMetadataReady ? "yes" : "no",
    ready_for_drip: readyForDrip ? "yes" : "no",
    last_checked: today(),
    checked_by: checkedBy,
    notes,
  };
}

function preserveCheckedBy(value) {
  const text = String(value ?? "").trim();
  if (!text) return "GHL Expert + prior approval";
  if (/GHL Expert/i.test(text)) return text;
  return `${text} + GHL Expert`;
}

function cleanExistingReadinessNote(note, fromEmail) {
  let text = String(note ?? "").trim();
  const fromPrefix = `From ${fromEmail}.`;
  const recheckPattern = new RegExp(
    `^${escapeRegExp(fromPrefix)} API metadata rechecked \\d{4}-\\d{2}-\\d{2}; prior start-drip approval preserved\\.\\s*`,
    "i",
  );
  text = text.replace(recheckPattern, "").trim();
  if (text.toLowerCase().startsWith(fromPrefix.toLowerCase())) {
    text = text.slice(fromPrefix.length).trim();
  }
  return text || "Prior ready_for_drip=yes remains the source of truth.";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findByName(items, name) {
  return items.find((item) => same(item?.name ?? item?.title, name));
}

function findField(items, id) {
  return items.find((item) => item?.id === id || item?._id === id);
}

function readWorkflowStatus(workflow) {
  if (!workflow) return "missing";
  return String(workflow.status ?? workflow.workflowStatus ?? workflow.publishedStatus ?? workflow.isPublished ?? "found");
}

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function mark(value) {
  return value ? "yes" : "no";
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function writeCsv(path, rows) {
  const headers = Object.keys(rows[0] ?? {});
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
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

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function isYes(value) {
  return String(value ?? "").trim().toLowerCase() === "yes";
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

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
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
Run GHL Expert read-only Reach readiness checks.

Examples:
  npm run reach:ghl-check

Outputs:
  docs/client-ops-ledger/outbox/ghl-expert-readiness-YYYY-MM-DD.md

No contacts, tags, workflows, or settings are changed.
`);
}
