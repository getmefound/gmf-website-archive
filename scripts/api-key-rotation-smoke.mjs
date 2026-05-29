#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const CURRENT_REPORT = "docs/client-ops-ledger/api-key-rotation-smoke-current.md";
const ENV_FILES = [".env", ".env.prod", ".env.vercel", ".env.vercel.local", ".env.local"];
const SKIP_ENV_FILES = process.argv.includes("--no-env-files") || process.env.GMF_SMOKE_SKIP_ENV_FILES === "1";
const REQUIRED = [
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown key-rotation smoke failure.");
  process.exit(1);
});

async function main() {
  const loadedEnvFiles = SKIP_ENV_FILES ? [] : loadEnvFiles();
  mkdirSync(OUTBOX_DIR, { recursive: true });

  const checks = {
    env: checkEnv(),
    openai: await checkOpenAI(),
    supabase: await checkSupabase(),
    production: await checkProduction(),
  };

  const ok =
    checks.env.ok &&
    checks.openai.ok &&
    checks.supabase.ok &&
    checks.production.supabase.ok &&
    checks.production.ops.ok;
  const report = renderReport({ ok, loadedEnvFiles, checks });
  const outPath = resolve(OUTBOX_DIR, `api-key-rotation-smoke-${timestampSlug()}.md`);
  writeFileSync(outPath, report);
  writeFileSync(CURRENT_REPORT, report);

  console.log(`API key rotation smoke report: ${outPath}`);
  console.log(`Current proof report: ${CURRENT_REPORT}`);
  console.log(ownerSummary({ ok, checks }));
  process.exit(ok ? 0 : 1);
}

function checkEnv() {
  const present = [
    { name: "OPENAI_API_KEY", present: hasEnv("OPENAI_API_KEY") },
    { name: "NEXT_PUBLIC_SUPABASE_URL", present: hasEnv("NEXT_PUBLIC_SUPABASE_URL") },
    {
      name: "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
      present: hasEnv("SUPABASE_SECRET_KEY") || hasEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
  ];

  return {
    ok: present.every((item) => item.present),
    present,
    missing: present.filter((item) => !item.present).map((item) => item.name),
  };
}

async function checkOpenAI() {
  const key = envValue("OPENAI_API_KEY");
  if (!key) return { ok: false, status: 0, error: "OPENAI_API_KEY missing." };

  const started = Date.now();
  const response = await fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      authorization: `Bearer ${key}`,
      "user-agent": "getmefound-key-rotation-smoke/1.0",
    },
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    error: error instanceof Error ? error.message : "OpenAI request failed.",
  }));

  if (!(response instanceof Response)) return response;

  const body = await response.json().catch(() => null);
  const modelCount = Array.isArray(body?.data) ? body.data.length : 0;
  return {
    ok: response.ok,
    status: response.status,
    modelCount,
    durationMs: Date.now() - started,
    error: response.ok ? "" : safeError(body),
  };
}

async function checkSupabase() {
  const rawUrl = envValue("NEXT_PUBLIC_SUPABASE_URL");
  if (!rawUrl) {
    return { ok: false, status: 0, tableStatus: 0, error: "Supabase env missing." };
  }

  const baseUrl = rawUrl.replace(/\/+$/, "");
  const restBase = baseUrl.endsWith("/rest/v1") ? baseUrl : `${baseUrl}/rest/v1`;
  const started = Date.now();
  const candidates = supabaseKeyCandidates();
  if (!candidates.length) {
    return { ok: false, status: 0, tableStatus: 0, error: "Supabase key env missing.", candidates: [] };
  }

  const candidateChecks = [];
  for (const candidate of candidates) {
    const root = await supabaseGet(`${restBase}/`, candidate.value, candidate.mode);
    const table = await supabaseGet(
      `${restBase}/tooling_status?select=service&service=eq.supabase&limit=1`,
      candidate.value,
      candidate.mode,
    );
    candidateChecks.push({
      name: candidate.name,
      format: candidate.format,
      mode: candidate.mode,
      rootStatus: root.status,
      tableStatus: table.status,
      rootOk: root.ok,
      toolingStatusOk: table.ok,
      error: root.ok && table.ok ? "" : [root.error, table.error].filter(Boolean).join("; "),
    });
  }

  const passing = candidateChecks.find((candidate) => candidate.rootOk && candidate.toolingStatusOk);
  const first = passing || candidateChecks[0];

  return {
    ok: Boolean(passing),
    status: first?.rootStatus ?? 0,
    tableStatus: first?.tableStatus ?? 0,
    durationMs: Date.now() - started,
    rootOk: Boolean(passing?.rootOk),
    toolingStatusOk: Boolean(passing?.toolingStatusOk),
    candidates: candidateChecks,
    error: passing ? "" : unique(candidateChecks.flatMap((item) => item.error.split("; ").filter(Boolean))).join("; "),
  };
}

async function supabaseGet(url, key, mode) {
  const headers = {
    apikey: key,
    "content-type": "application/json",
    "user-agent": "getmefound-key-rotation-smoke/1.0",
  };
  if (mode === "bearer-same") headers.authorization = `Bearer ${key}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    error: error instanceof Error ? error.message : "Supabase request failed.",
  }));

  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  return {
    ok: response.ok,
    status: response.status,
    error: response.ok ? "" : safeError(body),
  };
}

async function checkProduction() {
  const supabase = await publicJson("https://getmefound.ai/api/health/supabase");
  const ops = await publicJson("https://getmefound.ai/api/health/ops");
  return { supabase, ops };
}

async function publicJson(url) {
  const response = await fetch(url, { cache: "no-store" }).catch((error) => ({
    ok: false,
    status: 0,
    error: error instanceof Error ? error.message : "Production check failed.",
  }));
  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  return {
    ok: response.ok && body?.ok === true,
    status: response.status,
    healthOk: body?.ok === true,
    summary: summarizeHealth(body),
  };
}

function renderReport({ ok, loadedEnvFiles, checks }) {
  return `# API Key Rotation Smoke Check

Date: ${new Date().toISOString()}
Owner: Systems Director
Mode: read-only; no secret values printed

## Owner Summary

${ownerSummary({ ok, checks })}

## Env Sources Loaded

${envSourceLines(loadedEnvFiles)}

## Required Key Names

| Env var | Present |
|---|---:|
${checks.env.present.map((item) => `| ${item.name} | ${item.present ? "yes" : "no"} |`).join("\n")}

## OpenAI

| Check | Result |
|---|---|
| Endpoint | \`GET /v1/models\` |
| Status | ${checks.openai.status} |
| Active | ${checks.openai.ok ? "yes" : "no"} |
| Model count visible | ${checks.openai.modelCount ?? 0} |
| Duration ms | ${checks.openai.durationMs ?? 0} |
| Error | ${cell(checks.openai.error || "")} |

## Supabase

| Check | Result |
|---|---|
| REST root status | ${checks.supabase.status} |
| \`tooling_status\` read status | ${checks.supabase.tableStatus} |
| Active | ${checks.supabase.ok ? "yes" : "no"} |
| REST root ok | ${checks.supabase.rootOk ? "yes" : "no"} |
| App table read ok | ${checks.supabase.toolingStatusOk ? "yes" : "no"} |
| Duration ms | ${checks.supabase.durationMs ?? 0} |
| Error | ${cell(checks.supabase.error || "")} |

### Supabase Candidate Checks

| Key env | Format | Header mode | REST root | App table read | Result |
|---|---|---|---:|---:|---|
${(checks.supabase.candidates || [])
  .map(
    (item) =>
      `| ${item.name} | ${item.format} | ${item.mode} | ${item.rootStatus} | ${item.tableStatus} | ${
        item.rootOk && item.toolingStatusOk ? "pass" : "fail"
      } |`,
  )
  .join("\n")}

## Production Health

| Endpoint | HTTP status | Health ok | Summary |
|---|---:|---:|---|
| \`/api/health/supabase\` | ${checks.production.supabase.status} | ${
    checks.production.supabase.healthOk ? "yes" : "no"
  } | ${cell(checks.production.supabase.summary)} |
| \`/api/health/ops\` | ${checks.production.ops.status} | ${
    checks.production.ops.healthOk ? "yes" : "no"
  } | ${cell(checks.production.ops.summary)} |

## Safety Notes

- No key values, tokens, headers, or secret fingerprints were printed.
- No writes were made to OpenAI or Supabase.
- Supabase check verifies both project REST auth and the app-critical \`tooling_status\` read used by the health route.
`;
}

function ownerSummary({ ok, checks }) {
  if (ok) {
    return "Pass: OpenAI and Supabase keys are present and active in this runtime; production Supabase and ops health are green.";
  }
  const parts = [];
  if (!checks.env.ok) parts.push(`missing env: ${checks.env.missing.join(", ")}`);
  if (!checks.openai.ok) parts.push(`OpenAI failed status ${checks.openai.status}`);
  if (!checks.supabase.ok) parts.push(`Supabase failed status ${checks.supabase.status}/${checks.supabase.tableStatus}`);
  if (!checks.production.supabase.ok) parts.push(`production Supabase health failed status ${checks.production.supabase.status}`);
  if (!checks.production.ops.ok) parts.push(`production ops health failed status ${checks.production.ops.status}`);
  return `Blocked: ${parts.join("; ")}.`;
}

function envSourceLines(loadedEnvFiles) {
  if (SKIP_ENV_FILES) return "- Env file loading skipped; using inherited process env.";
  if (!loadedEnvFiles.length) return "- No env files loaded.";
  return loadedEnvFiles.map((file) => `- ${file}`).join("\n");
}

function loadEnvFiles() {
  const loaded = [];
  for (const file of ENV_FILES) {
    if (!existsSync(file)) continue;
    const raw = readFileSync(file, "utf8");
    let used = false;
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      process.env[key] = stripQuotes(rest.join("=").trim());
      used = true;
    }
    if (used) loaded.push(file);
  }
  return loaded;
}

function supabaseKeyCandidates() {
  const keys = [
    { name: "SUPABASE_SECRET_KEY", value: envValue("SUPABASE_SECRET_KEY") },
    { name: "SUPABASE_SERVICE_ROLE_KEY", value: envValue("SUPABASE_SERVICE_ROLE_KEY") },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: envValue("NEXT_PUBLIC_SUPABASE_ANON_KEY") },
  ]
    .filter((item) => item.value)
    .map((item) => ({ ...item, format: classifyKey(item.value) }));

  return keys.flatMap((item) =>
    supabaseHeaderModes(item.format).map((mode) => ({
      ...item,
      mode,
    })),
  );
}

function supabaseHeaderModes(format) {
  if (format === "legacy_jwt") return ["bearer-same"];
  return ["apikey-only", "bearer-same"];
}

function classifyKey(value) {
  if (value.startsWith("sb_secret_")) return "sb_secret";
  if (value.startsWith("sb_publishable_")) return "sb_publishable";
  if (value.startsWith("eyJ")) return "legacy_jwt";
  return "unknown";
}

function hasEnv(name) {
  return Boolean(envValue(name));
}

function envValue(name) {
  return stripQuotes(String(process.env[name] ?? "").trim());
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function safeError(body) {
  if (!body || typeof body !== "object") return "Request failed.";
  const error = body.error;
  if (typeof error === "string") return error.slice(0, 240);
  if (error && typeof error === "object") {
    return String(error.message || error.code || "Request failed.").slice(0, 240);
  }
  return String(body.message || body.code || "Request failed.").slice(0, 240);
}

function summarizeHealth(body) {
  if (!body || typeof body !== "object") return "No JSON body.";
  const parts = [];
  if ("ok" in body) parts.push(`ok=${body.ok}`);
  if (body.database?.status) parts.push(`database=${body.database.status}`);
  if (body.database?.error) parts.push(`databaseError=${body.database.error}`);
  if (body.services?.resend?.ok !== undefined) parts.push(`resend=${body.services.resend.ok}`);
  if (body.services?.supabase?.status) parts.push(`supabase=${body.services.supabase.status}`);
  return parts.join("; ") || "No health fields.";
}

function unique(items) {
  return [...new Set(items)];
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").slice(0, 240);
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
