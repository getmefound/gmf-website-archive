#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const CURRENT_REPORT = "docs/client-ops-ledger/stripe-resend-key-rotation-smoke-current.md";
const ENV_FILES = [".env", ".env.prod", ".env.vercel", ".env.vercel.local", ".env.local"];
const SKIP_ENV_FILES = process.argv.includes("--no-env-files") || process.env.GMF_SMOKE_SKIP_ENV_FILES === "1";
const PRODUCTION_ORIGIN = (process.env.GMF_PRODUCTION_ORIGIN || "https://getmefound.ai").replace(/\/+$/, "");
const RESEND_DOMAIN = process.env.GMF_RESEND_DOMAIN || "send.getmefound.ai";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown Stripe/Resend key rotation smoke failure.");
  process.exit(1);
});

async function main() {
  const loadedEnvFiles = SKIP_ENV_FILES ? [] : loadEnvFiles();
  mkdirSync(OUTBOX_DIR, { recursive: true });

  const checks = {
    env: checkEnv(),
    stripe: await checkStripe(),
    resend: await checkResend(),
    production: await checkProduction(),
  };

  const ok =
    checks.env.ok &&
    checks.stripe.ok &&
    checks.resend.ok &&
    checks.production.resend.ok &&
    checks.production.ops.ok;

  const report = renderReport({ ok, loadedEnvFiles, checks });
  const outPath = resolve(OUTBOX_DIR, `stripe-resend-key-rotation-smoke-${timestampSlug()}.md`);
  writeFileSync(outPath, report);
  writeFileSync(CURRENT_REPORT, report);

  console.log(`Stripe/Resend key rotation smoke report: ${outPath}`);
  console.log(`Current proof report: ${CURRENT_REPORT}`);
  console.log(ownerSummary({ ok, checks }));
  process.exit(ok ? 0 : 1);
}

function checkEnv() {
  const present = [
    { name: "STRIPE_SECRET_KEY", present: hasEnv("STRIPE_SECRET_KEY") },
    { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", present: hasEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") },
    { name: "STRIPE_WEBHOOK_SECRET", present: hasEnv("STRIPE_WEBHOOK_SECRET") },
    { name: "RESEND_API_KEY", present: hasEnv("RESEND_API_KEY") },
    { name: "RESEND_FROM_EMAIL", present: hasEnv("RESEND_FROM_EMAIL") },
  ];

  return {
    ok: present.every((item) => item.present),
    present,
    missing: present.filter((item) => !item.present).map((item) => item.name),
    formats: {
      stripeSecret: classifyPrefix(envValue("STRIPE_SECRET_KEY"), ["sk_live_", "rk_live_", "sk_test_", "rk_test_"]),
      stripePublishable: classifyPrefix(envValue("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"), ["pk_live_", "pk_test_"]),
      stripeWebhook: classifyPrefix(envValue("STRIPE_WEBHOOK_SECRET"), ["whsec_"]),
      resendApiKey: classifyPrefix(envValue("RESEND_API_KEY"), ["re_"]),
    },
  };
}

async function checkStripe() {
  const key = envValue("STRIPE_SECRET_KEY");
  if (!key) return { ok: false, account: { ok: false, status: 0, error: "STRIPE_SECRET_KEY missing." }, prices: [] };

  const account = await stripeGet("https://api.stripe.com/v1/account", key);
  const priceIds = configuredStripePriceIds();
  const prices = [];
  for (const id of priceIds) {
    const response = await stripeGet(`https://api.stripe.com/v1/prices/${encodeURIComponent(id)}`, key);
    prices.push({
      id,
      ok: response.ok,
      status: response.status,
      active: response.body?.active === true,
      currency: response.body?.currency || "",
      recurring: Boolean(response.body?.recurring),
      error: response.ok ? "" : safeStripeError(response.body, response.status),
    });
  }

  return {
    ok: account.ok && prices.every((price) => price.ok),
    account: {
      ok: account.ok,
      status: account.status,
      chargesEnabled: account.body?.charges_enabled === true,
      payoutsEnabled: account.body?.payouts_enabled === true,
      detailsSubmitted: account.body?.details_submitted === true,
      country: account.body?.country || "",
      error: account.ok ? "" : safeStripeError(account.body, account.status),
    },
    prices,
  };
}

async function stripeGet(url, key) {
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${key}`,
      "user-agent": "getmefound-stripe-resend-rotation-smoke/1.0",
    },
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    body: null,
    error: error instanceof Error ? error.message : "Stripe request failed.",
  }));
  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}

async function checkResend() {
  const key = envValue("RESEND_API_KEY");
  if (!key) return { ok: false, status: 0, domain: RESEND_DOMAIN, domainStatus: "missing", error: "RESEND_API_KEY missing." };

  const response = await fetch("https://api.resend.com/domains", {
    headers: {
      authorization: `Bearer ${key}`,
      "user-agent": "getmefound-stripe-resend-rotation-smoke/1.0",
    },
    cache: "no-store",
  }).catch((error) => ({
    ok: false,
    status: 0,
    body: null,
    error: error instanceof Error ? error.message : "Resend request failed.",
  }));

  if (!(response instanceof Response)) return response;
  const body = await response.json().catch(() => null);
  const match = Array.isArray(body?.data) ? body.data.find((item) => item.name === RESEND_DOMAIN) : null;
  return {
    ok: response.ok && Boolean(match) && match.status === "verified",
    status: response.status,
    domain: RESEND_DOMAIN,
    domainStatus: match?.status || "missing",
    error: response.ok ? "" : safeResendError(body, response.status),
  };
}

async function checkProduction() {
  const resend = await publicJson(`${PRODUCTION_ORIGIN}/api/health/resend`);
  const ops = await publicJson(`${PRODUCTION_ORIGIN}/api/health/ops`);
  return { resend, ops };
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
  return `# Stripe And Resend Key Rotation Smoke Check

Date: ${new Date().toISOString()}
Owner: Systems Director
Mode: read-only; no key values, headers, tokens, or secret fingerprints printed

## Owner Summary

${ownerSummary({ ok, checks })}

## Env Sources Loaded

${envSourceLines(loadedEnvFiles)}

## Required Key Names

| Env var | Present | Format |
|---|---:|---|
${checks.env.present
  .map((item) => `| ${item.name} | ${item.present ? "yes" : "no"} | ${envFormat(checks.env.formats, item.name)} |`)
  .join("\n")}

## Stripe

| Check | Result |
|---|---|
| Account API status | ${checks.stripe.account.status} |
| Account API active | ${checks.stripe.account.ok ? "yes" : "no"} |
| Charges enabled | ${checks.stripe.account.chargesEnabled ? "yes" : "no"} |
| Payouts enabled | ${checks.stripe.account.payoutsEnabled ? "yes" : "no"} |
| Details submitted | ${checks.stripe.account.detailsSubmitted ? "yes" : "no"} |
| Country visible | ${checks.stripe.account.country ? "yes" : "no"} |
| Error | ${cell(checks.stripe.account.error || "")} |

### Configured Stripe Prices

| Price ID | Status | Active | Recurring | Currency | Result |
|---|---:|---:|---:|---|---|
${checks.stripe.prices
  .map(
    (price) =>
      `| \`${price.id}\` | ${price.status} | ${price.active ? "yes" : "no"} | ${price.recurring ? "yes" : "no"} | ${
        price.currency || ""
      } | ${price.ok ? "pass" : `fail: ${cell(price.error)}`} |`,
  )
  .join("\n")}

## Resend

| Check | Result |
|---|---|
| Domains API status | ${checks.resend.status} |
| API active | ${checks.resend.status === 200 ? "yes" : "no"} |
| Domain checked | \`${checks.resend.domain}\` |
| Domain status | ${checks.resend.domainStatus} |
| Verified | ${checks.resend.ok ? "yes" : "no"} |
| Error | ${cell(checks.resend.error || "")} |

## Production Health

| Endpoint | HTTP status | Health ok | Summary |
|---|---:|---:|---|
| \`/api/health/resend\` | ${checks.production.resend.status} | ${checks.production.resend.healthOk ? "yes" : "no"} | ${cell(
    checks.production.resend.summary,
  )} |
| \`/api/health/ops\` | ${checks.production.ops.status} | ${checks.production.ops.healthOk ? "yes" : "no"} | ${cell(
    checks.production.ops.summary,
  )} |

## Safety Notes

- No Stripe checkout session was created.
- No Stripe webhook event was sent.
- No Resend email was sent.
- This smoke verifies Stripe account/prices, Resend domain auth, and live production Resend health only.
`;
}

function ownerSummary({ ok, checks }) {
  if (ok) return "Pass: Stripe account/prices and Resend domain health are active in this runtime; production Resend health is green.";
  const parts = [];
  if (!checks.env.ok) parts.push(`missing env: ${checks.env.missing.join(", ")}`);
  if (!checks.stripe.ok) parts.push(`Stripe failed status ${checks.stripe.account.status}`);
  if (!checks.resend.ok) parts.push(`Resend failed status ${checks.resend.status}/${checks.resend.domainStatus}`);
  if (!checks.production.resend.ok) parts.push(`production Resend health failed status ${checks.production.resend.status}`);
  if (!checks.production.ops.ok) parts.push(`production ops health failed status ${checks.production.ops.status}`);
  return `Blocked: ${parts.join("; ")}.`;
}

function configuredStripePriceIds() {
  const path = "lib/checkout.ts";
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8");
  return unique(raw.match(/price_[A-Za-z0-9]+/g) || []);
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

function envFormat(formats, name) {
  if (name === "STRIPE_SECRET_KEY") return formats.stripeSecret;
  if (name === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") return formats.stripePublishable;
  if (name === "STRIPE_WEBHOOK_SECRET") return formats.stripeWebhook;
  if (name === "RESEND_API_KEY") return formats.resendApiKey;
  return "";
}

function classifyPrefix(value, prefixes) {
  if (!value) return "missing";
  return prefixes.find((prefix) => value.startsWith(prefix)) || "unexpected";
}

function envSourceLines(loadedEnvFiles) {
  if (SKIP_ENV_FILES) return "- Env file loading skipped; using inherited process env.";
  if (!loadedEnvFiles.length) return "- No env files loaded.";
  return loadedEnvFiles.map((file) => `- ${file}`).join("\n");
}

function summarizeHealth(body) {
  if (!body || typeof body !== "object") return "No JSON body.";
  const parts = [];
  if ("ok" in body) parts.push(`ok=${body.ok}`);
  if (body.domain?.domainStatus) parts.push(`domain=${body.domain.domainStatus}`);
  if (body.services?.resend?.ok !== undefined) parts.push(`resend=${body.services.resend.ok}`);
  if (body.services?.resend?.status) parts.push(`resendStatus=${body.services.resend.status}`);
  if (body.services?.supabase?.status) parts.push(`supabase=${body.services.supabase.status}`);
  return parts.join("; ") || "No health fields.";
}

function safeStripeError(body, status) {
  if (body?.error?.message) return String(body.error.message).slice(0, 240);
  return `HTTP ${status}`;
}

function safeResendError(body, status) {
  return String(body?.message || body?.error || `HTTP ${status}`).slice(0, 240);
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

function unique(items) {
  return [...new Set(items)];
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").slice(0, 240);
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
