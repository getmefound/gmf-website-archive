#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "aol.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "comcast.net",
  "optonline.net",
]);

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const csv = String(args.csv ?? "").trim();
  if (!csv) die("Missing --csv.");

  const lane = String(args.lane ?? "unknown").toLowerCase();
  const outDir = String(args.outDir ?? args["out-dir"] ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outDir, { recursive: true });

  const rows = readCsv(csv);
  const byBusiness = groupBy(rows, (row) => String(row.name ?? "").trim().toLowerCase());
  const reviewed = rows.map((row) => {
    const email = String(row.email ?? "").trim().toLowerCase();
    const domain = email.split("@")[1] ?? "";
    const flags = [];
    if (PERSONAL_DOMAINS.has(domain)) flags.push("personal_email_domain");
    if ((byBusiness.get(String(row.name ?? "").trim().toLowerCase()) ?? []).length > 1) flags.push("multiple_contacts_same_business");
    if (!String(row.website ?? "").trim()) flags.push("missing_website");
    if (!String(row.city ?? "").trim()) flags.push("missing_city");
    return { ...row, qa_flags: flags.join(";"), qa_recommendation: flags.length ? "review_before_live" : "ok" };
  });

  const reviewCount = reviewed.filter((row) => row.qa_recommendation === "review_before_live").length;
  const okCount = reviewed.length - reviewCount;
  const outCsv = String(args.out ?? csv.replace(/\.csv$/i, "-qa.csv"));
  const outMd = resolve(outDir, `reach-${lane}-quality-${today()}.md`);

  writeCsv(outCsv, reviewed);
  writeFileSync(outMd, renderMarkdown({ lane, csv, reviewed, okCount, reviewCount }));

  console.log(`Rows reviewed: ${reviewed.length}`);
  console.log(`OK rows: ${okCount}`);
  console.log(`Review rows: ${reviewCount}`);
  console.log(`QA CSV: ${outCsv}`);
  console.log(`QA report: ${outMd}`);
}

function renderMarkdown({ lane, csv, reviewed, okCount, reviewCount }) {
  return `# Reach Quality Review

Date: ${today()}
Lane: ${lane}
CSV: \`${csv}\`

## Summary

| Item | Count |
|---|---:|
| Rows reviewed | ${reviewed.length} |
| OK rows | ${okCount} |
| Rows needing review | ${reviewCount} |

## Rows Needing Review

| Business | Email | City | State | Flags |
|---|---|---|---|---|
${reviewed
  .filter((row) => row.qa_recommendation === "review_before_live")
  .map((row) => `| ${cell(row.name)} | ${cell(row.email)} | ${cell(row.city)} | ${cell(row.state)} | ${cell(row.qa_flags)} |`)
  .join("\n") || "| None | | | | |"}

## Recommendation

Rows with \`personal_email_domain\` or \`multiple_contacts_same_business\` are not automatically bad, but Sales Manager should review them before Mike approves live outreach.
`;
}

function groupBy(rows, fn) {
  const map = new Map();
  for (const row of rows) {
    const key = fn(row);
    const group = map.get(key) ?? [];
    group.push(row);
    map.set(key, group);
  }
  return map;
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

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
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
Review verified Reach CSV rows for lightweight quality risks.

Examples:
  npm run reach:quality -- --lane reviews --csv tmp-reach-reviews-next-verified.csv

Options:
  --lane reviews|ai|relay
  --csv path/to/verified.csv
  --out path/to/qa.csv
  --out-dir docs/client-ops-ledger/outbox
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
