#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const LANES = {
  reviews: {
    importedTag: "aoh_campaign_reviews_imported",
    startTag: "aoh_campaign_reviews_start",
  },
  ai: {
    importedTag: "aoh_campaign_ai_imported",
    startTag: "aoh_campaign_ai_visibility_start",
  },
  relay: {
    importedTag: "aoh_campaign_relay_imported",
    startTag: "aoh_campaign_relay_start",
  },
};

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const laneKey = String(args.lane ?? "").toLowerCase();
  const lane = LANES[laneKey];
  if (!lane) die("Missing or invalid --lane. Use reviews, ai, or relay.");

  const csv = String(args.csv ?? "").trim();
  if (!csv) die("Missing --csv.");

  const out = String(args.out ?? csv.replace(/\.csv$/i, "-fresh.csv"));
  const requiredState = String(args.state ?? "").trim().toLowerCase();
  const rows = readCsv(csv);
  const history = readLaneHistory(laneKey, lane);
  const seen = new Set();
  const kept = [];
  const removed = [];

  for (const row of rows) {
    const email = String(row.email ?? "").trim().toLowerCase();
    let reason = "";
    if (!email) reason = "missing_email";
    else if (seen.has(email)) reason = "duplicate_in_csv";
    else if (history.started.has(email)) reason = "already_started";
    else if (history.imported.has(email)) reason = "already_imported";
    else if (requiredState && String(row.state ?? "").trim().toLowerCase() !== requiredState) {
      reason = "state_mismatch";
    }

    if (reason) {
      removed.push({ ...row, removal_reason: reason });
    } else {
      seen.add(email);
      kept.push(row);
    }
  }

  writeCsv(out, kept);
  writeCsv(out.replace(/\.csv$/i, "-removed.csv"), removed);

  console.log(`Input rows: ${rows.length}`);
  console.log(`Fresh rows kept: ${kept.length}`);
  console.log(`Removed rows: ${removed.length}`);
  console.log(`Fresh CSV: ${out}`);
  console.log(`Removed CSV: ${out.replace(/\.csv$/i, "-removed.csv")}`);
  console.log("No GHL API calls were made. This is CSV filtering only.");
}

function readLaneHistory(laneKey, lane) {
  const imported = new Set();
  const started = new Set();
  const files = [
    `tmp-reach-${laneKey}-live-import-ghl-results.json`,
    `tmp-reach-${laneKey}-verified-import-ghl-results.json`,
    `tmp-reach-${laneKey}-started-ghl-results.json`,
    `tmp-reach-${laneKey}-retry-started-ghl-results.json`,
  ];

  for (const file of files) {
    const absolute = resolve(file);
    if (!existsSync(absolute)) continue;
    let rows = [];
    try {
      rows = JSON.parse(readFileSync(absolute, "utf8"));
    } catch {
      continue;
    }
    for (const row of Array.isArray(rows) ? rows : []) {
      const email = String(row.email ?? "").trim().toLowerCase();
      if (!email || row.upsert !== true || row.tagged !== true) continue;
      const tags = Array.isArray(row.tags) ? row.tags : [];
      if (tags.includes(lane.importedTag)) imported.add(email);
      if (tags.includes(lane.startTag)) started.add(email);
    }
  }

  return { imported, started };
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) die(`CSV not found: ${absolute}`);
  return parseCsv(readFileSync(absolute, "utf8"));
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])));
}

function writeCsv(path, rows) {
  if (!rows.length) {
    writeFileSync(path, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
Filter candidate Reach CSVs against previous import/start history.

Examples:
  npm run reach:fresh -- --lane reviews --csv tmp-reach-reviews-candidate.csv
  npm run reach:fresh -- --lane ai --csv candidates.csv --out tmp-reach-ai-next-clean.csv

Options:
  --lane reviews|ai|relay
  --csv path/to/candidate.csv
  --out path/to/fresh.csv
  --state Connecticut
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
