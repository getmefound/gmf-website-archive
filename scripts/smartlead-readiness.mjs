#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const CURRENT_CSV = "docs/client-ops-ledger/smartlead-warmup-current.csv";
const MIN_WARMUP_SENT = 10;
const MAX_SPAM = 0;
const MIN_REPUTATION = 95;

main();

function main() {
  const rows = readCsv(CURRENT_CSV);
  if (!rows.length) {
    console.log("Not ready: no Smartlead warmup report found. Run npm run smartlead:warmup-report first.");
    process.exit(1);
  }

  const findings = rows.map(checkRow);
  const ready = findings.every((finding) => finding.ready);

  console.log(render({ ready, findings }));
  process.exit(ready ? 0 : 1);
}

function checkRow(row) {
  const blockers = [];
  if (row.smtp_ok !== "yes") blockers.push("SMTP is not OK");
  if (row.imap_ok !== "yes") blockers.push("IMAP is not OK");
  if (row.suspended === "yes") blockers.push("account is suspended");
  if (row.warmup_status !== "ACTIVE") blockers.push(`warmup status is ${row.warmup_status || "unknown"}`);
  if (row.warmup_blocked === "yes") blockers.push("warmup is blocked");
  if (number(row.warmup_reputation) < MIN_REPUTATION) blockers.push(`warmup reputation below ${MIN_REPUTATION}`);
  if (number(row.warmup_sent_count) < MIN_WARMUP_SENT) blockers.push(`needs at least ${MIN_WARMUP_SENT} warmup sent`);
  if (number(row.warmup_spam_count) > MAX_SPAM) blockers.push("spam count is above zero");

  return {
    email: row.email,
    ready: blockers.length === 0,
    blockers,
    warmupSent: number(row.warmup_sent_count),
    spam: number(row.warmup_spam_count),
    reputation: number(row.warmup_reputation),
  };
}

function render({ ready, findings }) {
  const lines = [];
  lines.push(ready ? "READY for tiny seed-list test." : "NOT READY for live prospect sends.");
  lines.push("");
  for (const finding of findings) {
    lines.push(
      `- ${finding.email}: ${finding.ready ? "ready" : "hold"} (${finding.warmupSent} warmup sent, ${finding.spam} spam, rep ${finding.reputation})`,
    );
    for (const blocker of finding.blockers) lines.push(`  - ${blocker}`);
  }
  lines.push("");
  lines.push("Gate: all three inboxes need SMTP/IMAP OK, ACTIVE warmup, rep >= 95, at least 10 warmup sent, and 0 spam.");
  return lines.join("\n");
}

function readCsv(path) {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (quoted && char === '"' && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
