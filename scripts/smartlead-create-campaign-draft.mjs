#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_BASE = "https://server.smartlead.ai/api/v1";
const DEFAULT_NAME = "GetMeFound - AI Visibility Audit - Warmup Draft";

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

  const name = String(args.name ?? DEFAULT_NAME);
  const existing = await smartleadGet("/campaigns/", apiKey);
  const match = asArray(existing).find((campaign) => same(campaign.name, name));
  if (match) {
    console.log(JSON.stringify({ ok: true, skipped: true, reason: "already_exists", campaign: pickCampaign(match) }, null, 2));
    return;
  }

  if (!args.apply) {
    console.log(JSON.stringify({ ok: true, mode: "dry_run", name }, null, 2));
    return;
  }

  const created = await smartleadPost("/campaigns/create", apiKey, { name });
  console.log(JSON.stringify({ ok: true, created }, null, 2));
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
  if (!response.ok) throw new Error(`${path}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
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

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function pickCampaign(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    created_at: campaign.created_at,
  };
}

function printHelp() {
  console.log(`
Create a drafted Smartlead campaign shell. This does not add leads, sequences,
sender accounts, schedules, or start sending.

Dry run:
  npm run smartlead:create-campaign-draft

Apply:
  npm run smartlead:create-campaign-draft -- --apply
`);
}
