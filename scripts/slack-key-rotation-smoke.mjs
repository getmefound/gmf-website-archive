#!/usr/bin/env node

import { createHmac } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const CURRENT_REPORT = "docs/client-ops-ledger/slack-key-rotation-smoke-current.md";
const ENV_FILES = [".env", ".env.prod", ".env.vercel", ".env.vercel.local", ".env.local"];
const SKIP_ENV_FILES = process.argv.includes("--no-env-files") || process.env.GMF_SMOKE_SKIP_ENV_FILES === "1";
const PRODUCTION_URL = stripSlash(process.env.GMF_SLACK_LISTENER_URL || "https://getmefound.ai/api/agent/slack");
const DEFAULT_AGENT_CHANNEL_ID = "C0ATTA4NBR8";
const TEST_CHALLENGE = "gmf-slack-rotation-smoke";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown Slack key rotation smoke failure.");
  process.exit(1);
});

async function main() {
  const loadedEnvFiles = SKIP_ENV_FILES ? [] : loadEnvFiles();
  mkdirSync(OUTBOX_DIR, { recursive: true });

  const checks = {
    env: checkEnv(),
    auth: await checkSlackAuth(),
    history: await checkSlackHistory(),
    listenerGet: await checkListenerGet(),
    listenerSigned: await checkSignedListener(),
  };

  const ok =
    checks.env.botTokenPresent &&
    checks.auth.ok &&
    checks.history.ok &&
    checks.listenerGet.ok &&
    (!checks.env.signingSecretPresent || checks.listenerSigned.ok);

  const report = renderReport({ ok, loadedEnvFiles, checks });
  const outPath = resolve(OUTBOX_DIR, `slack-key-rotation-smoke-${timestampSlug()}.md`);
  writeFileSync(outPath, report);
  writeFileSync(CURRENT_REPORT, report);

  console.log(`Slack key rotation smoke report: ${outPath}`);
  console.log(`Current proof report: ${CURRENT_REPORT}`);
  console.log(ownerSummary({ ok, checks }));
  process.exit(ok ? 0 : 1);
}

function checkEnv() {
  return {
    botTokenPresent: hasEnv("SLACK_BOT_TOKEN"),
    signingSecretPresent: hasEnv("SLACK_SIGNING_SECRET"),
    allowedChannel: firstAllowedChannel(),
  };
}

async function checkSlackAuth() {
  const token = envValue("SLACK_BOT_TOKEN");
  if (!token) return { ok: false, status: 0, error: "SLACK_BOT_TOKEN missing." };

  const response = await slackGet("https://slack.com/api/auth.test", token);
  return {
    ok: response.ok,
    status: response.status,
    teamId: response.body?.team_id || "",
    userId: response.body?.user_id || "",
    botId: response.body?.bot_id || "",
    error: response.ok ? "" : safeError(response.body, response.status),
  };
}

async function checkSlackHistory() {
  const token = envValue("SLACK_BOT_TOKEN");
  if (!token) return { ok: false, status: 0, channel: firstAllowedChannel(), error: "SLACK_BOT_TOKEN missing." };

  const channel = firstAllowedChannel();
  const url = new URL("https://slack.com/api/conversations.history");
  url.searchParams.set("channel", channel);
  url.searchParams.set("limit", "1");
  const response = await slackGet(url, token);
  return {
    ok: response.ok,
    status: response.status,
    channel,
    messagesVisible: Array.isArray(response.body?.messages) ? response.body.messages.length : 0,
    error: response.ok ? "" : safeError(response.body, response.status),
  };
}

async function checkListenerGet() {
  const response = await fetch(PRODUCTION_URL, { cache: "no-store" }).catch((error) => ({
    ok: false,
    status: 0,
    error: error instanceof Error ? error.message : "Listener GET failed.",
  }));
  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  return {
    ok: response.ok && body?.ok === true && body?.endpoint === "slack-agent",
    status: response.status,
    endpoint: body?.endpoint || "",
    error: response.ok ? "" : safeError(body, response.status),
  };
}

async function checkSignedListener() {
  const signingSecret = envValue("SLACK_SIGNING_SECRET");
  if (!signingSecret) return { ok: false, skipped: true, status: 0, error: "SLACK_SIGNING_SECRET missing in this runtime." };

  const body = JSON.stringify({ type: "url_verification", challenge: TEST_CHALLENGE });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signSlackRequest({ signingSecret, timestamp, body });
  const response = await fetch(PRODUCTION_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-slack-request-timestamp": timestamp,
      "x-slack-signature": signature,
      "user-agent": "getmefound-slack-key-rotation-smoke/1.0",
    },
    body,
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    error: error instanceof Error ? error.message : "Signed listener POST failed.",
  }));

  if (!(response instanceof Response)) return response;
  const text = await response.text().catch(() => "");
  return {
    ok: response.ok && text.trim() === TEST_CHALLENGE,
    skipped: false,
    status: response.status,
    error: response.ok ? "" : text.slice(0, 240),
  };
}

async function slackGet(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
      "user-agent": "getmefound-slack-key-rotation-smoke/1.0",
    },
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    body: null,
    error: error instanceof Error ? error.message : "Slack request failed.",
  }));
  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  return {
    ok: response.ok && body?.ok === true,
    status: response.status,
    body,
  };
}

function renderReport({ ok, loadedEnvFiles, checks }) {
  return `# Slack Key Rotation Smoke Check

Date: ${new Date().toISOString()}
Owner: Systems Director
Mode: read-only; no token, signing secret, headers, or secret fingerprints printed

## Owner Summary

${ownerSummary({ ok, checks })}

## Env Sources Loaded

${envSourceLines(loadedEnvFiles)}

## Required Key Names

| Env var | Present |
|---|---:|
| SLACK_BOT_TOKEN | ${checks.env.botTokenPresent ? "yes" : "no"} |
| SLACK_SIGNING_SECRET | ${checks.env.signingSecretPresent ? "yes" : "no"} |

## Slack Bot Token

| Check | Result |
|---|---|
| \`auth.test\` status | ${checks.auth.status} |
| Token active | ${checks.auth.ok ? "yes" : "no"} |
| Team ID visible | ${checks.auth.teamId ? "yes" : "no"} |
| Bot/user ID visible | ${checks.auth.userId || checks.auth.botId ? "yes" : "no"} |
| Error | ${cell(checks.auth.error || "")} |

## Slack Channel Read

| Check | Result |
|---|---|
| Channel ID | \`${checks.history.channel || ""}\` |
| \`conversations.history\` status | ${checks.history.status} |
| Read active | ${checks.history.ok ? "yes" : "no"} |
| Messages visible in sample | ${checks.history.messagesVisible ?? 0} |
| Error | ${cell(checks.history.error || "")} |

## Production Listener

| Check | Result |
|---|---|
| Listener URL | \`${PRODUCTION_URL}\` |
| GET status | ${checks.listenerGet.status} |
| GET active | ${checks.listenerGet.ok ? "yes" : "no"} |
| Signed POST status | ${checks.listenerSigned.status} |
| Signed POST active | ${checks.listenerSigned.ok ? "yes" : checks.listenerSigned.skipped ? "skipped" : "no"} |
| Error | ${cell(checks.listenerGet.error || checks.listenerSigned.error || "")} |

## Safety Notes

- No Slack messages were posted.
- No Slack token or signing secret values were printed.
- The signed POST uses Slack's URL-verification shape and only expects the challenge text back.
`;
}

function ownerSummary({ ok, checks }) {
  if (ok) return "Pass: Slack bot token is active, channel read works, and the production listener is healthy for this runtime.";
  const parts = [];
  if (!checks.env.botTokenPresent) parts.push("SLACK_BOT_TOKEN missing");
  if (!checks.auth.ok) parts.push(`Slack auth.test failed status ${checks.auth.status}`);
  if (!checks.history.ok) parts.push(`Slack channel read failed status ${checks.history.status}`);
  if (!checks.listenerGet.ok) parts.push(`production listener GET failed status ${checks.listenerGet.status}`);
  if (checks.env.signingSecretPresent && !checks.listenerSigned.ok) {
    parts.push(`production listener signed POST failed status ${checks.listenerSigned.status}`);
  }
  if (!checks.env.signingSecretPresent) parts.push("SLACK_SIGNING_SECRET not available in this runtime; signed listener check skipped");
  return `Blocked: ${parts.join("; ")}.`;
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
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      process.env[key] = stripQuotes(value);
      used = true;
    }
    if (used) loaded.push(file);
  }
  return loaded;
}

function firstAllowedChannel() {
  return (
    envValue("SLACK_AGENT_ALLOWED_CHANNEL_IDS")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)[0] || DEFAULT_AGENT_CHANNEL_ID
  );
}

function signSlackRequest({ signingSecret, timestamp, body }) {
  const base = `v0:${timestamp}:${body}`;
  return `v0=${createHmac("sha256", signingSecret).update(base).digest("hex")}`;
}

function envSourceLines(loadedEnvFiles) {
  if (SKIP_ENV_FILES) return "- Env file loading skipped; using inherited process env.";
  if (!loadedEnvFiles.length) return "- No env files loaded.";
  return loadedEnvFiles.map((file) => `- ${file}`).join("\n");
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

function stripSlash(value) {
  return String(value).replace(/\/+$/, "");
}

function safeError(body, status) {
  if (body && typeof body === "object") {
    return String(body.error || body.message || body.code || `HTTP ${status}`).slice(0, 240);
  }
  return `HTTP ${status}`;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").slice(0, 240);
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
