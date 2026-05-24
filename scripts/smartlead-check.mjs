#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_BASE = "https://server.smartlead.ai/api/v1";

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
  if (!apiKey) {
    throw new Error("SMARTLEAD_API_KEY is not set. Add it to .env.local, then rerun npm run smartlead:check.");
  }

  const campaigns = await smartleadGet("/campaigns/", apiKey);
  const emailAccounts = await smartleadGet("/email-accounts/", apiKey).catch((error) => ({
    error: error.message,
  }));

  const campaignRows = asArray(campaigns?.data ?? campaigns).map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
  }));

  const accountRows = asArray(emailAccounts?.data ?? emailAccounts).map((account) => ({
    id: account.id,
    email: account.from_email ?? account.email,
    warmup: account.warmup_enabled ?? account.is_warmup_enabled,
  }));

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "read_only",
        campaigns: campaignRows,
        emailAccounts: accountRows,
        emailAccountWarning: emailAccounts?.error,
      },
      null,
      2,
    ),
  );
}

async function smartleadGet(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });
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
Run a read-only Smartlead API check.

Setup:
  Add SMARTLEAD_API_KEY to .env.local.

Usage:
  npm run smartlead:check

This reads campaigns and email accounts only. It does not create campaigns,
add leads, connect inboxes, start warmup, or send email.
`);
}
