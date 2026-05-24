#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const GHL_EMAIL_API_VERSION = "2023-02-21";
const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX_DIR = `${LEDGER_DIR}/outbox`;

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
    const message = "GHL exit inventory skipped: GHL_PIT_TOKEN or GHL_LOCATION_ID is not set.";
    if (args["soft-fail"]) {
      console.log(message);
      return;
    }
    throw new Error(message);
  }

  const date = String(args.date ?? todayEastern());
  const outDir = String(args.outDir ?? args["out-dir"] ?? OUTBOX_DIR);
  mkdirSync(outDir, { recursive: true });

  const inventory = {
    date,
    locationId,
    mode: "read-only metadata inventory",
    piiPolicy: "Contacts, customer records, message bodies, and secret values are intentionally excluded.",
    surfaces: await collectSurfaces({ token, locationId }),
    localArtifacts: collectLocalArtifacts(),
  };

  const jsonPath = resolve(outDir, `ghl-exit-inventory-${date}.json`);
  const reportPath = resolve(outDir, `ghl-exit-inventory-${date}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(reportPath, renderReport(inventory));

  console.log(`GHL exit inventory JSON: ${jsonPath}`);
  console.log(`GHL exit inventory report: ${reportPath}`);
  console.log("Read-only inventory complete. No contacts, workflows, settings, or HighLevel AI features were changed.");
}

async function collectSurfaces({ token, locationId }) {
  const encodedLocation = encodeURIComponent(locationId);
  const surfaces = [
    {
      key: "location",
      label: "Location",
      version: GHL_API_VERSION,
      paths: [`/locations/${encodedLocation}`],
      pick: (data) => data?.location ?? data,
      summarize: summarizeLocation,
    },
    {
      key: "pipelines",
      label: "Pipelines and stages",
      version: GHL_API_VERSION,
      paths: [`/opportunities/pipelines?locationId=${encodedLocation}`],
      pick: (data) => data?.pipelines ?? data,
      summarize: summarizePipeline,
    },
    {
      key: "workflows",
      label: "Workflows",
      version: GHL_API_VERSION,
      paths: [`/workflows/?locationId=${encodedLocation}`, `/workflows?locationId=${encodedLocation}`],
      pick: (data) => data?.workflows ?? data?.data ?? data,
      summarize: summarizeWorkflow,
    },
    {
      key: "customFields",
      label: "Custom fields",
      version: GHL_API_VERSION,
      paths: [`/locations/${encodedLocation}/customFields`, `/locations/${encodedLocation}/custom-fields`],
      pick: (data) => data?.customFields ?? data?.fields ?? data,
      summarize: summarizeCustomField,
    },
    {
      key: "customValues",
      label: "Custom values",
      version: GHL_API_VERSION,
      paths: [`/locations/${encodedLocation}/customValues`, `/locations/${encodedLocation}/custom-values`],
      pick: (data) => data?.customValues ?? data?.values ?? data,
      summarize: summarizeCustomValue,
    },
    {
      key: "emailWorkflowCampaigns",
      label: "Email workflow campaigns",
      version: GHL_EMAIL_API_VERSION,
      paths: [`/emails/public/v2/locations/${encodedLocation}/campaigns/workflows`],
      pick: (data) => data?.campaigns ?? data?.data ?? data?.workflowCampaigns ?? data,
      summarize: summarizeEmailCampaign,
    },
    {
      key: "calendars",
      label: "Calendars",
      version: GHL_API_VERSION,
      paths: [`/calendars/?locationId=${encodedLocation}`, `/calendars?locationId=${encodedLocation}`],
      pick: (data) => data?.calendars ?? data?.data ?? data,
      summarize: summarizeCalendar,
    },
    {
      key: "tags",
      label: "Tags",
      version: GHL_API_VERSION,
      paths: [`/locations/${encodedLocation}/tags`, `/tags/?locationId=${encodedLocation}`, `/tags?locationId=${encodedLocation}`],
      pick: (data) => data?.tags ?? data?.data ?? data,
      summarize: summarizeTag,
    },
  ];

  const results = [];
  for (const surface of surfaces) {
    results.push(await collectSurface({ ...surface, token }));
  }
  return results;
}

async function collectSurface({ key, label, version, paths, pick, summarize, token }) {
  const errors = [];
  for (const path of paths) {
    try {
      const data = await getJson({ path, token, version });
      const picked = pick(data);
      const items = Array.isArray(picked) ? picked : picked ? [picked] : [];
      return {
        key,
        label,
        ok: true,
        version,
        path,
        count: items.length,
        items: items.map((item) => summarize(item)).filter(Boolean),
      };
    } catch (error) {
      errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return {
    key,
    label,
    ok: false,
    version,
    count: 0,
    items: [],
    error: errors.join(" | "),
  };
}

function summarizeLocation(item) {
  return compactObject({
    id: read(item, "id", "_id", "locationId"),
    name: read(item, "name", "businessName"),
    timezone: read(item, "timezone", "timeZone"),
  });
}

function summarizePipeline(item) {
  const stages = asArray(item?.stages).map((stage) => compactObject({ id: stage?.id, name: stage?.name }));
  return compactObject({
    id: read(item, "id", "_id"),
    name: read(item, "name"),
    stagesCount: stages.length,
    stages,
  });
}

function summarizeWorkflow(item) {
  return compactObject({
    id: read(item, "id", "_id"),
    name: read(item, "name", "title"),
    status: read(item, "status", "workflowStatus", "publishedStatus"),
    isPublished: read(item, "isPublished", "published"),
  });
}

function summarizeCustomField(item) {
  return compactObject({
    id: read(item, "id", "_id"),
    name: read(item, "name", "fieldName"),
    key: read(item, "key", "fieldKey"),
    type: read(item, "dataType", "type"),
  });
}

function summarizeCustomValue(item) {
  return compactObject({
    id: read(item, "id", "_id"),
    name: read(item, "name"),
    key: read(item, "key"),
  });
}

function summarizeEmailCampaign(item) {
  return compactObject({
    sourceId: read(item, "sourceId", "id", "_id"),
    name: read(item, "name", "title"),
    status: read(item, "status"),
  });
}

function summarizeCalendar(item) {
  return compactObject({
    id: read(item, "id", "_id", "calendarId"),
    name: read(item, "name", "title"),
    isActive: read(item, "isActive", "active"),
  });
}

function summarizeTag(item) {
  return compactObject({
    id: read(item, "id", "_id"),
    name: read(item, "name"),
  });
}

function collectLocalArtifacts() {
  return [
    "docs/client-ops-ledger/sending-domain-readiness.csv",
    "docs/client-ops-ledger/ghl-email-stats-current.csv",
    "docs/client-ops-ledger/ghl-replacement-cost-plan.md",
    "docs/client-ops-ledger/ghl-exit-migration-plan.md",
  ].map((path) => ({ path, present: existsSync(path) }));
}

async function getJson({ path, token, version }) {
  const res = await fetch(`${GHL_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: version,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 240)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`parse_failed ${text.slice(0, 240)}`);
  }
}

function renderReport(inventory) {
  const rows = inventory.surfaces
    .map(
      (surface) =>
        `| ${cell(surface.label)} | ${surface.ok ? "available" : "not available"} | ${surface.count} | ${cell(surface.path || surface.error || "")} |`,
    )
    .join("\n");

  return `# GHL Exit Inventory

Date: ${inventory.date}
Location ID: \`${inventory.locationId}\`
Mode: ${inventory.mode}

## Owner Summary

- GHL Expert can use this as the current map of what must be exported or replaced.
- This inventory is metadata-only.
- Contacts, customer records, message bodies, token values, and passwords are intentionally excluded.
- HighLevel AI features were not changed.

## Surfaces

| Surface | Result | Count | API path or note |
|---|---:|---:|---|
${rows}

## Replacement Notes

${inventory.surfaces.map(renderSurfaceNotes).join("\n")}

## Local GMF Artifacts

| File | Present |
|---|---:|
${inventory.localArtifacts.map((item) => `| ${cell(item.path)} | ${item.present ? "yes" : "no"} |`).join("\n")}

## Safety

- Read-only API calls only.
- No contacts were exported into Git.
- No workflows, contacts, tags, settings, domains, wallets, add-ons, or HighLevel AI features were changed.
- If contacts need to be exported later, write them to a gitignored folder like \`data/ghl-exit/YYYY-MM-DD/\` and do not commit them.
`;
}

function renderSurfaceNotes(surface) {
  if (!surface.ok) return `### ${surface.label}\n\n- Not available through this API check: ${surface.error}`;
  if (surface.items.length === 0) return `### ${surface.label}\n\n- Available, but no items were returned.`;
  const lines = surface.items.slice(0, 20).map((item) => `- ${formatItem(item)}`);
  const extra = surface.items.length > 20 ? `\n- ${surface.items.length - 20} more items in the JSON inventory.` : "";
  return `### ${surface.label}\n\n${lines.join("\n")}${extra}`;
}

function formatItem(item) {
  const primary = item.name || item.key || item.id || item.sourceId || "unnamed";
  const details = Object.entries(item)
    .filter(([key]) => !["name", "key"].includes(key))
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.length : value}`)
    .join("; ");
  return details ? `${primary} (${details})` : String(primary);
}

function read(item, ...keys) {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") return item[key];
  }
  return undefined;
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
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

function printHelp() {
  console.log(`
Create a read-only HighLevel exit inventory for the GHL migration.

Examples:
  npm run ghl:exit-inventory
  npm run ghl:exit-inventory -- --soft-fail

Outputs:
  docs/client-ops-ledger/outbox/ghl-exit-inventory-YYYY-MM-DD.md
  docs/client-ops-ledger/outbox/ghl-exit-inventory-YYYY-MM-DD.json

This inventory is metadata-only. Contacts and message bodies are intentionally excluded.
`);
}
