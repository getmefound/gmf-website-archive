#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_BASE = "https://server.smartlead.ai/api/v1";
const SMTP_HOST = "mail.privateemail.com";
const SMTP_PORT = 587;
const IMAP_HOST = "mail.privateemail.com";
const IMAP_PORT = 993;

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

  const apply = Boolean(args.apply);
  const existing = await smartleadGet("/email-accounts/", apiKey);
  const existingEmails = new Set(
    asArray(existing?.data ?? existing)
      .map((account) => String(account.from_email ?? account.email ?? "").toLowerCase())
      .filter(Boolean),
  );

  const accounts = [1, 2, 3].map((n) => ({
    n,
    email: process.env[`OUTREACH_EMAIL_${n}`]?.trim(),
    password: process.env[`OUTREACH_EMAIL_${n}_PASSWORD`]?.trim(),
  }));

  const results = [];
  for (const account of accounts) {
    if (!account.email || !account.password) {
      results.push({ account: account.n, ok: false, error: "missing_env" });
      continue;
    }
    if (existingEmails.has(account.email.toLowerCase())) {
      results.push({ account: account.n, email: account.email, skipped: true, reason: "already_exists" });
      continue;
    }

    const payload = buildPayload(account);
    if (!apply) {
      results.push({ account: account.n, email: account.email, mode: "dry_run", payload: redactPayload(payload) });
      continue;
    }

    const response = await smartleadPost("/email-accounts/save", apiKey, payload).catch((error) => ({
      ok: false,
      error: error.message,
    }));
    results.push({ account: account.n, email: account.email, response });
  }

  console.log(JSON.stringify({ ok: true, mode: apply ? "apply" : "dry_run", results }, null, 2));
}

function buildPayload(account) {
  return {
    from_name: "Mike",
    from_email: account.email,
    user_name: account.email,
    password: account.password,
    imap_user_name: account.email,
    imap_password: account.password,
    smtp_host: SMTP_HOST,
    smtp_port: SMTP_PORT,
    imap_host: IMAP_HOST,
    imap_port: IMAP_PORT,
    warmup_enabled: true,
    total_warmup_per_day: 5,
    daily_rampup: 1,
    reply_rate_percentage: 30,
    max_email_per_day: 20,
    time_to_wait_in_mins: 15,
    type: "SMTP",
    signature: "Mike<br>GetMeFound",
  };
}

function redactPayload(payload) {
  return {
    ...payload,
    password: "***",
    imap_password: "***",
  };
}

async function smartleadGet(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, { headers: { accept: "application/json" } });
  return parseSmartleadResponse(path, response);
}

async function smartleadPost(path, apiKey, body) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseSmartleadResponse(path, response);
}

async function parseSmartleadResponse(path, response) {
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    throw new Error(`${path}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
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

function printHelp() {
  console.log(`
Add outreach Namecheap Private Email SMTP accounts to Smartlead.

Dry run:
  npm run smartlead:add-outreach-accounts

Apply:
  npm run smartlead:add-outreach-accounts -- --apply

Initial warmup settings:
  warmup_enabled: true
  total_warmup_per_day: 5
  daily_rampup: 1
  max_email_per_day: 20
  time_to_wait_in_mins: 15
`);
}
