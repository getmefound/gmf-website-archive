#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const API_BASE = "https://server.smartlead.ai/api/v1";
const OUTBOX = "docs/client-ops-ledger/outbox";
const CURRENT_CSV = "docs/client-ops-ledger/smartlead-warmup-current.csv";

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

  const apiKey = process.env.SMARTLEAD_API_KEY?.trim();
  if (!apiKey) throw new Error("SMARTLEAD_API_KEY is not set.");

  const date = String(args.date ?? todayEastern());
  mkdirSync(OUTBOX, { recursive: true });

  const accounts = await smartleadGet("/email-accounts/", apiKey);
  const listedOutreach = asArray(accounts?.data ?? accounts)
    .filter((account) => String(account.from_email ?? "").includes("getmefound"))
    .map((account) => ({
      id: account.id,
      email: account.from_email,
      smtpOk: Boolean(account.is_smtp_success),
      imapOk: Boolean(account.is_imap_success),
      suspended: Boolean(account.is_suspended),
      dailySent: number(account.daily_sent_count),
      maxPerDay: number(account.message_per_day),
      warmup: account.warmup_details ?? {},
    }));

  const rows = [];
  for (const listed of listedOutreach) {
    const detail = await smartleadGet(`/email-accounts/${listed.id}`, apiKey).catch(() => null);
    const account = detail
      ? {
          id: detail.id,
          email: detail.from_email,
          smtpOk: Boolean(detail.is_smtp_success),
          imapOk: Boolean(detail.is_imap_success),
          suspended: Boolean(detail.is_suspended),
          dailySent: number(detail.daily_sent_count),
          maxPerDay: number(detail.message_per_day),
          warmup: detail.warmup_details ?? {},
        }
      : listed;
    const stats = await smartleadGet(`/email-accounts/${account.id}/warmup-stats`, apiKey).catch((error) => ({
      error: error.message,
    }));
    rows.push(normalizeRow({ date, account, stats }));
  }

  writeCsv(CURRENT_CSV, rows);
  const datedCsv = resolve(OUTBOX, `smartlead-warmup-${date}.csv`);
  writeCsv(datedCsv, rows);
  const reportPath = resolve(OUTBOX, `smartlead-warmup-${date}.md`);
  writeFileSync(reportPath, renderReport({ date, rows }));

  console.log(`Smartlead warmup current: ${resolve(CURRENT_CSV)}`);
  console.log(`Smartlead warmup CSV: ${datedCsv}`);
  console.log(`Smartlead warmup report: ${reportPath}`);
}

function normalizeRow({ date, account, stats }) {
  const warmup = account.warmup ?? {};
  return {
    date,
    email: account.email,
    smartlead_id: account.id,
    smtp_ok: account.smtpOk ? "yes" : "no",
    imap_ok: account.imapOk ? "yes" : "no",
    suspended: account.suspended ? "yes" : "no",
    warmup_status: warmup.status ?? warmup.warmup_status ?? "unknown",
    warmup_enabled: warmup.status ? "yes" : (warmup.warmup_enabled ?? warmup.is_warmup_enabled ?? "unknown"),
    warmup_reputation: number(warmup.warmup_reputation),
    warmup_min_count: number(warmup.warmup_min_count),
    warmup_max_count: number(warmup.warmup_max_count ?? warmup.max_email_per_day),
    warmup_reply_rate: number(warmup.reply_rate),
    warmup_blocked: warmup.is_warmup_blocked ? "yes" : "no",
    warmup_sent_count: number(stats?.sent_count),
    warmup_inbox_count: number(stats?.inbox_count),
    warmup_spam_count: number(stats?.spam_count),
    warmup_received_count: number(stats?.warmup_email_received_count),
    daily_sent_count: account.dailySent,
    max_email_per_day: account.maxPerDay,
    notes: stats?.error ? `warmup stats error: ${stats.error}` : "Read-only Smartlead warmup stats.",
  };
}

function renderReport({ date, rows }) {
  return `# Smartlead Warmup Report

Date: ${date}
Mode: read-only

## Summary

${rows.map(summaryLine).join("\n")}

## Mailboxes

| Email | SMTP | IMAP | Warmup | Rep | Warmup/day | Sent | Inbox | Spam | Max/day |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
${rows
  .map(
    (row) =>
      `| ${cell(row.email)} | ${row.smtp_ok} | ${row.imap_ok} | ${cell(row.warmup_status)} | ${row.warmup_reputation} | ${row.warmup_max_count} | ${row.warmup_sent_count} | ${row.warmup_inbox_count} | ${row.warmup_spam_count} | ${row.max_email_per_day} |`,
  )
  .join("\n")}

## Safety Read

- Do not add live prospects until warmup activity is healthy.
- Keep the first phase to one real mailbox per domain.
- Do not add \`hello@...\` inboxes until these three accounts show clean warmup.
- No HighLevel AI features should be enabled.
`;
}

function summaryLine(row) {
  const health = row.smtp_ok === "yes" && row.imap_ok === "yes" && row.suspended === "no" ? "connected" : "needs attention";
  return `- ${row.email}: ${health}; ${row.warmup_sent_count} warmup sent, ${row.warmup_spam_count} spam, max ${row.max_email_per_day}/day.`;
}

async function smartleadGet(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, { headers: { accept: "application/json" } });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) throw new Error(`${path}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  return body;
}

function writeCsv(path, rows) {
  const headers = [
    "date",
    "email",
    "smartlead_id",
    "smtp_ok",
    "imap_ok",
    "suspended",
    "warmup_status",
    "warmup_enabled",
    "warmup_reputation",
    "warmup_min_count",
    "warmup_max_count",
    "warmup_reply_rate",
    "warmup_blocked",
    "warmup_sent_count",
    "warmup_inbox_count",
    "warmup_spam_count",
    "warmup_received_count",
    "daily_sent_count",
    "max_email_per_day",
    "notes",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function todayEastern() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return `${parts.find((p) => p.type === "year")?.value}-${parts.find((p) => p.type === "month")?.value}-${parts.find((p) => p.type === "day")?.value}`;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
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

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
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
Create a read-only Smartlead warmup report.

Usage:
  npm run smartlead:warmup-report

Outputs:
  docs/client-ops-ledger/smartlead-warmup-current.csv
  docs/client-ops-ledger/outbox/smartlead-warmup-YYYY-MM-DD.md
`);
}
