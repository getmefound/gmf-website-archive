#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADERS = [
  "name",
  "email",
  "phone",
  "website",
  "address",
  "city",
  "state",
  "niche",
  "rating",
  "reviewCount",
  "lastReviewDate",
  "reviewsLink",
  "competitorName",
  "competitorReviewCount",
  "lane",
  "sourceQuery",
];

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const input = String(args.input ?? args.in ?? "").trim();
  if (!input) die("Missing --input.");

  const output = String(args.out ?? input.replace(/\.json$/i, ".csv"));
  const absolute = resolve(input);
  if (!existsSync(absolute)) die(`JSON not found: ${absolute}`);

  const data = JSON.parse(readFileSync(absolute, "utf8"));
  const rows = Array.isArray(data) ? data : [];
  writeCsv(output, rows);

  console.log(`Input JSON rows: ${rows.length}`);
  console.log(`CSV written: ${output}`);
}

function writeCsv(path, rows) {
  const lines = [HEADERS.join(",")];
  for (const row of rows) {
    lines.push(HEADERS.map((header) => csvEscape(row?.[header] ?? "")).join(","));
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
Convert Reach dry-run JSON output to CSV for verification/import prep.

Examples:
  npm run reach:csv -- --input tmp-reach-reviews-next.json
  npm run reach:csv -- --input tmp-reach-ai-next.json --out tmp-reach-ai-next-clean.csv
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
