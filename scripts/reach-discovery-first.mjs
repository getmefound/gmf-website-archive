#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const CONFIG_PATH = "docs/client-ops-ledger/reach-discovery-first.json";
const OUTBOX = "docs/client-ops-ledger/outbox";
const OUTSCRAPER_API_BASE = "https://api.outscraper.com";

const LANES = ["reviews", "ai", "relay"];
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "aol.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "comcast.net",
  "optonline.net",
  "msn.com",
  "live.com",
  "proton.me",
  "protonmail.com",
]);
const REJECTED_EMAIL_PREFIXES = new Set(["noreply", "no-reply", "donotreply", "do-not-reply", "example", "test"]);
const EMAIL_ROLE_PRIORITY = new Map([
  ["office", 50],
  ["info", 48],
  ["hello", 46],
  ["contact", 44],
  ["frontdesk", 44],
  ["reception", 42],
  ["appointments", 40],
  ["admin", 38],
  ["manager", 36],
  ["sales", 34],
  ["support", 28],
]);

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

  const config = readJson(String(args.config ?? CONFIG_PATH));
  if (config.enabled !== true) die("Reach discovery-first config is not enabled.");

  mkdirSync(OUTBOX, { recursive: true });
  const date = String(args.date ?? easternDate()).trim();
  const laneKeys = selectLanes(args, config);
  const allowSpend = hasSpendApproval(args, config);
  const planOnly = Boolean(args["plan-only"] ?? args.planOnly);
  const runBudget = createRunBudget(config, args);
  const reports = [];

  for (const laneKey of laneKeys) {
    reports.push(await runLane({ laneKey, config, args, date, allowSpend, planOnly, runBudget }));
  }

  const summaryPath = resolve(OUTBOX, `reach-discovery-summary-${date}.md`);
  writeFileSync(summaryPath, renderSummary({ date, reports, config, allowSpend, planOnly, runBudget }));
  console.log("");
  console.log(`Discovery summary: ${summaryPath}`);
}

async function runLane({ laneKey, config, args, date, allowSpend, planOnly, runBudget }) {
  const laneConfig = config.lanes?.[laneKey];
  if (!laneConfig?.enabled) die(`Lane is not enabled: ${laneKey}`);

  const limitPerSearch = numberArg(args.limit, config.guardrails?.discovery_limit_per_search ?? 20);
  const maxLaneBusinesses = numberArg(args["max-businesses"], config.guardrails?.max_discovered_businesses_per_lane ?? 120);
  const minScore = numberArg(args["min-score"], laneConfig.min_fit_score ?? config.guardrails?.min_fit_score ?? 65);
  const crawlEnabled = args.crawl !== false && args.crawl !== "false";
  const crawlLimit = numberArg(args["crawl-limit"], config.guardrails?.crawl_top_per_lane ?? 60);
  const estimatedRecords = Math.min(maxLaneBusinesses, limitPerSearch * (laneConfig.searches?.length ?? 0));
  const estimatedSpend = estimateMapsSpend(config, estimatedRecords);
  const blockers = [];

  if (planOnly) blockers.push("Plan-only mode; no Outscraper or website crawl was run.");
  if (!allowSpend && !planOnly) blockers.push(spendApprovalMessage(config));
  if (!hasEnv("OUTSCRAPER_API_KEY") && !planOnly) {
    blockers.push("OUTSCRAPER_API_KEY is not set; paid discovery is held and no Outscraper request was made.");
  }
  if (!reserveAllowsSpend(config, runBudget, estimatedSpend) && !planOnly) {
    blockers.push("Budget reserve guard would be crossed by this lane's estimated discovery spend.");
  }

  let discovered = [];
  const attempts = [];
  if (!blockers.length) {
    for (const search of laneConfig.searches ?? []) {
      if (discovered.length >= maxLaneBusinesses) break;
      const remainingRunRecords = recordsRemaining(config, runBudget);
      if (remainingRunRecords <= 0) break;
      const limit = Math.min(limitPerSearch, maxLaneBusinesses - discovered.length, remainingRunRecords);
      if (limit <= 0) break;

      const query = String(args.query ?? `${search.industry}, ${search.area}, USA`);
      const rows = await scrapeBusinesses({ query, limit, args });
      spendRecords(runBudget, rows.length);
      attempts.push({ query, requested: limit, returned: rows.length });
      discovered.push(...rows.map((row) => normalizeBusiness({ row, laneKey, search, query })));
    }
  }

  discovered = dedupeBusinesses(discovered)
    .map((business) => ({ ...business, ...scoreBusiness(business, laneKey, laneConfig) }))
    .sort((a, b) => Number(b.lead_score) - Number(a.lead_score));

  const scoredPath = `tmp-reach-discovery-${laneKey}-${date}-businesses.csv`;
  writeCsv(scoredPath, discovered);

  let crawled = [];
  if (!blockers.length && crawlEnabled) {
    const crawlTargets = discovered
      .filter((row) => Number(row.lead_score) >= minScore && row.website)
      .slice(0, crawlLimit);
    crawled = await crawlBusinessEmails({ rows: crawlTargets, args, config });
  }

  const emailByKey = new Map(crawled.map((row) => [businessKey(row), row]));
  const candidates = discovered
    .map((row) => {
      const emailData = emailByKey.get(businessKey(row)) ?? {};
      const email = String(emailData.email ?? "").trim().toLowerCase();
      const status = discoveryStatus({ row, email, minScore });
      return {
        ...row,
        email,
        email_source: emailData.email_source ?? "",
        email_confidence: emailData.email_confidence ?? "",
        email_domain_type: email ? (PERSONAL_EMAIL_DOMAINS.has(emailDomain(email)) ? "personal" : "business") : "",
        discovery_status: status,
      };
    })
    .filter((row) => row.discovery_status === "candidate")
    .sort((a, b) => Number(b.lead_score) - Number(a.lead_score));

  const candidatesPath = `tmp-reach-discovery-${laneKey}-${date}-candidates.csv`;
  writeCsv(candidatesPath, candidates);

  const report = {
    date,
    lane: laneKey,
    label: laneConfig.label ?? laneKey,
    status: blockers.length ? "held" : "prepared",
    spendApproved: allowSpend,
    estimatedRecords,
    estimatedSpend,
    attempts,
    discoveredCount: discovered.length,
    candidateCount: candidates.length,
    minScore,
    scoredPath,
    candidatesPath,
    blockers,
  };

  const reportPath = resolve(OUTBOX, `reach-discovery-${laneKey}-${date}.md`);
  writeFileSync(reportPath, renderLaneReport(report));
  console.log("");
  console.log(`${report.label} discovery report: ${reportPath}`);
  return { ...report, reportPath };
}

async function scrapeBusinesses({ query, limit, args }) {
  const apiKey = requiredEnv("OUTSCRAPER_API_KEY");
  const url = new URL("/google-maps-search", OUTSCRAPER_API_BASE);
  url.searchParams.append("query", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("async", "false");
  url.searchParams.set("dropDuplicates", "true");
  url.searchParams.set("region", "US");

  console.log(`Scraping business discovery query: ${query}`);
  console.log(`Limit: ${limit}. Enrichment: off.`);

  const timeoutMs = boundedNumber(args.timeoutMs ?? args["timeout-ms"], 30_000, 240_000, 120_000);
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  if (!res.ok) die(`Outscraper failed ${res.status}: ${text.slice(0, 500)}`);
  const data = parseJson(text);
  return flattenOutscraperData(data?.data);
}

function normalizeBusiness({ row, laneKey, search, query }) {
  return {
    name: pick(row, ["name", "business_name", "company_name", "company", "title"]),
    email: "",
    phone: pick(row, ["phone", "phone_1", "phone_number"]),
    website: cleanUrl(pick(row, ["site", "website", "domain"])),
    address: pick(row, ["full_address", "address"]),
    city: pick(row, ["city", "borough"]),
    state: pick(row, ["us_state", "state", "region"]) || search.state || "",
    niche: pick(row, ["type", "category", "niche_vertical", "industry"]) || search.industry || "",
    rating: pick(row, ["rating", "prospect_rating", "gbp_rating"]),
    reviewCount: pick(row, ["reviews", "review_count", "prospect_review_count", "gbp_review_count"]),
    lastReviewDate: pick(row, ["last_review_date", "gbp_last_review"]),
    reviewsLink: pick(row, ["reviews_link", "location_link", "prospect_link"]),
    competitorName: "",
    competitorReviewCount: "",
    lane: laneKey,
    sourceQuery: query,
  };
}

function scoreBusiness(row, laneKey, laneConfig) {
  let score = 0;
  const reasons = [];
  const reviewCount = Number(String(row.reviewCount ?? "").replace(/[^\d.]/g, ""));
  const rating = Number(String(row.rating ?? "").replace(/[^\d.]/g, ""));
  const niche = String(row.niche ?? "").toLowerCase();
  const name = String(row.name ?? "").toLowerCase();
  const keywords = laneConfig.keywords ?? [];

  addScore(Boolean(row.website), 25, "has_website");
  addScore(Boolean(row.phone), laneKey === "relay" ? 12 : 6, "has_phone");
  addScore(Boolean(row.city && row.state), 8, "has_location");
  addScore(keywords.some((keyword) => niche.includes(keyword.toLowerCase()) || name.includes(keyword.toLowerCase())), 20, "matches_lane_keyword");

  if (laneKey === "reviews") {
    addScore(Number.isFinite(reviewCount) && reviewCount >= 20 && reviewCount <= 500, 15, "review_count_in_serviceable_range");
    addScore(Number.isFinite(reviewCount) && reviewCount < 150, 10, "review_gap_visible");
    addScore(Number.isFinite(rating) && rating >= 4.0 && rating < 4.8, 8, "good_business_with_review_headroom");
  } else if (laneKey === "ai") {
    addScore(Number.isFinite(reviewCount) && reviewCount >= 25, 10, "enough_market_signal");
    addScore(/senior|assisted|law|dental|med spa|chiro/.test(niche), 14, "high_value_local_vertical");
    addScore(Number.isFinite(rating) && rating >= 4.2, 6, "credible_reputation");
  } else if (laneKey === "relay") {
    addScore(/emergency|veterinary|hvac|plumb|electric|roof|contractor/.test(niche), 18, "call_urgent_vertical");
    addScore(Boolean(row.phone), 10, "phone_driven_business");
    addScore(Number.isFinite(reviewCount) && reviewCount >= 25, 8, "active_local_demand");
  }

  if (!row.website) addScore(true, -30, "missing_website");
  if (/government|school|university|hospital|municipal|department/.test(niche)) addScore(true, -20, "likely_poor_fit_entity");

  return {
    lead_score: Math.max(0, Math.min(100, score)),
    fit_reasons: reasons.join(";"),
  };

  function addScore(condition, points, reason) {
    if (!condition) return;
    score += points;
    reasons.push(reason);
  }
}

async function crawlBusinessEmails({ rows, args, config }) {
  const results = [];
  const timeoutMs = boundedNumber(args["crawl-timeout-ms"], 2000, 20000, config.guardrails?.crawl_timeout_ms ?? 8000);
  for (const row of rows) {
    const found = await findWebsiteEmail(row.website, timeoutMs);
    if (found.email) {
      results.push({ ...row, ...found });
      console.log(`EMAIL ${found.email} ${row.name}`);
    } else {
      console.log(`NOEMAIL ${row.website} ${row.name}`);
    }
  }
  return results;
}

async function findWebsiteEmail(website, timeoutMs) {
  const root = cleanUrl(website);
  if (!root) return {};
  const urls = candidateUrls(root);
  const found = [];
  for (const url of urls) {
    const html = await fetchText(url, timeoutMs);
    if (!html) continue;
    for (const email of extractEmails(html)) {
      found.push({ email, source: url });
    }
  }
  const best = chooseEmail(found, root);
  return best
    ? {
        email: best.email,
        email_source: best.source,
        email_confidence: best.score,
      }
    : {};
}

function candidateUrls(root) {
  let base;
  try {
    base = new URL(root);
  } catch {
    return [];
  }
  const paths = ["", "/contact", "/contact-us", "/about", "/about-us", "/team", "/staff"];
  return [...new Set(paths.map((path) => new URL(path, base).toString()))];
}

async function fetchText(url, timeoutMs) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GMF reach discovery contact crawler" },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") ?? "";
    if (type && !/text\/html|text\/plain|application\/xhtml/i.test(type)) return "";
    return (await res.text()).slice(0, 1_000_000);
  } catch {
    return "";
  }
}

function extractEmails(html) {
  const text = decodeEntities(String(html).replace(/\s*\[\s*at\s*\]\s*/gi, "@").replace(/\s*\(\s*at\s*\)\s*/gi, "@"));
  const emails = [];
  for (const match of text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
    const email = match[0].toLowerCase().replace(/[),.;:]+$/g, "");
    if (isUsableEmail(email)) emails.push(email);
  }
  return [...new Set(emails)];
}

function chooseEmail(found, website) {
  const websiteDomain = rootDomainFromUrl(website);
  const scored = [];
  for (const item of found) {
    const email = item.email.toLowerCase();
    const local = email.split("@")[0] ?? "";
    const domain = emailDomain(email);
    let score = 10;
    if (rootDomain(domain) === websiteDomain) score += 45;
    if (!PERSONAL_EMAIL_DOMAINS.has(domain)) score += 20;
    score += EMAIL_ROLE_PRIORITY.get(local) ?? 0;
    if (/contact/i.test(item.source)) score += 10;
    if (/about|team|staff/i.test(item.source)) score += 4;
    scored.push({ ...item, score });
  }
  return scored.sort((a, b) => b.score - a.score)[0] ?? null;
}

function discoveryStatus({ row, email, minScore }) {
  if (Number(row.lead_score) < minScore) return "low_score";
  if (!row.website) return "missing_website";
  if (!email) return "no_email_found";
  if (PERSONAL_EMAIL_DOMAINS.has(emailDomain(email))) return "personal_email_held";
  return "candidate";
}

function isUsableEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const local = email.split("@")[0] ?? "";
  const domain = emailDomain(email);
  if (REJECTED_EMAIL_PREFIXES.has(local)) return false;
  if (/\.(png|jpg|jpeg|gif|webp|svg|css|js)$/i.test(domain)) return false;
  return true;
}

function selectLanes(args, config) {
  const laneArg = String(args.lane ?? "all").toLowerCase();
  const laneParts = laneArg
    .split(/[,+]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const lanes = laneParts.length === 0 || laneParts.includes("all") ? LANES : [...new Set(laneParts)];
  for (const lane of lanes) {
    if (!LANES.includes(lane)) die("Missing or invalid --lane. Use reviews, ai, relay, all, or comma list.");
    if (config.lanes?.[lane]?.enabled !== true) die(`Lane disabled in config: ${lane}`);
  }
  return lanes;
}

function hasSpendApproval(args, config) {
  if (args["allow-spend"] || args.allowSpend) return true;
  const envName = String(config.guardrails?.spend_approval_env ?? "REACH_DISCOVERY_ALLOW_SPEND");
  return /^(1|true|yes|y|approved)$/i.test(String(process.env[envName] ?? "").trim());
}

function spendApprovalMessage(config) {
  const envName = String(config.guardrails?.spend_approval_env ?? "REACH_DISCOVERY_ALLOW_SPEND");
  return `Paid business discovery is held. Approve with --allow-spend or ${envName}=yes.`;
}

function createRunBudget(config, args) {
  const balance = numberArg(args.balance, config.budget?.outscraper_balance_usd ?? 0);
  const maxSpend = numberArg(args["max-spend"], config.budget?.max_daily_outscraper_spend_usd ?? 0);
  const reserve = numberArg(args.reserve, config.budget?.reserve_balance_usd ?? 0);
  const maxRecords = numberArg(
    args["max-records"],
    config.guardrails?.max_discovered_businesses_per_run ?? Math.floor(maxSpend / costPerMapRecord(config)),
  );
  return { balance, maxSpend, reserve, maxRecords, recordsUsed: 0 };
}

function recordsRemaining(config, budget) {
  const spendRemainingRecords = Math.floor(Math.max(0, budget.maxSpend - estimateMapsSpend(config, budget.recordsUsed)) / costPerMapRecord(config));
  return Math.max(0, Math.min(budget.maxRecords - budget.recordsUsed, spendRemainingRecords));
}

function reserveAllowsSpend(config, budget, estimatedSpend) {
  return budget.balance - budget.reserve - estimateMapsSpend(config, budget.recordsUsed) - estimatedSpend >= 0;
}

function spendRecords(budget, records) {
  budget.recordsUsed += Math.max(0, Number(records) || 0);
}

function estimateMapsSpend(config, records) {
  return records * costPerMapRecord(config);
}

function costPerMapRecord(config) {
  return Number(config.pricing_assumptions?.outscraper_maps_per_1000 ?? 3) / 1000;
}

function renderLaneReport(report) {
  return `# Reach Business Discovery - ${report.label}

Date: ${report.date}
Lane: ${report.lane}
Status: ${report.status}
Spend approved: ${report.spendApproved ? "yes" : "no"}
Estimated discovery records: ${report.estimatedRecords}
Estimated Outscraper spend: $${report.estimatedSpend.toFixed(2)}
Minimum fit score: ${report.minScore}

## Results

| Item | Count |
|---|---:|
| Businesses discovered | ${report.discoveredCount} |
| Candidate emails found | ${report.candidateCount} |

## Outputs

- Scored businesses: \`${report.scoredPath}\`
- Candidate CSV: \`${report.candidatesPath}\`

## Blockers

${report.blockers.length ? report.blockers.map((item) => `- ${item}`).join("\n") : "- None"}

## Searches

| Query | Requested | Returned |
|---|---:|---:|
${report.attempts.map((item) => `| ${cell(item.query)} | ${item.requested} | ${item.returned} |`).join("\n") || "| None | | |"}

## Safety

- This script did not import contacts to GHL.
- This script did not add start tags.
- This script did not enable or change HighLevel AI features.
- Candidate emails still need verification and QA before live send.
`;
}

function renderSummary({ date, reports, config, allowSpend, planOnly, runBudget }) {
  const validationPerEmail = Number(config.pricing_assumptions?.ghl_email_validation_per_1000 ?? 2.5) / 1000;
  const sendPerEmail = Number(config.pricing_assumptions?.lc_email_send_per_1000 ?? 0.675) / 1000;
  const candidates = reports.reduce((sum, report) => sum + report.candidateCount, 0);
  const estimatedValidation = candidates * validationPerEmail;
  const estimatedSend = candidates * sendPerEmail;
  const actualDiscoverySpend = estimateMapsSpend(config, runBudget.recordsUsed);
  return `# Reach Business Discovery Summary

Date: ${date}
Mode: ${planOnly ? "plan-only" : allowSpend ? "approved spend" : "held"}

| Lane | Status | Businesses | Candidates | Report |
|---|---|---:|---:|---|
${reports
  .map((report) => `| ${report.label} | ${report.status} | ${report.discoveredCount} | ${report.candidateCount} | ${basename(report.reportPath)} |`)
  .join("\n")}

## Cost Guard

- Configured Outscraper balance: $${Number(config.budget?.outscraper_balance_usd ?? 0).toFixed(2)}
- Daily Outscraper cap: $${Number(config.budget?.max_daily_outscraper_spend_usd ?? 0).toFixed(2)}
- Reserve balance: $${Number(config.budget?.reserve_balance_usd ?? 0).toFixed(2)}
- Discovered records this run: ${runBudget.recordsUsed}
- Estimated discovery spend this run: $${actualDiscoverySpend.toFixed(2)}
- Estimated validation cost for found candidates: $${estimatedValidation.toFixed(2)}
- Estimated LC Email send cost for found candidates: $${estimatedSend.toFixed(2)}

## Next Step

Run candidate CSVs through fresh filtering, verification, quality review, then the guarded warmup/import path. Do not import or send directly from discovery output.
`;
}

function dedupeBusinesses(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const key = businessKey(row);
    if (!key) continue;
    const current = byKey.get(key);
    if (!current || (row.website && !current.website)) byKey.set(key, row);
  }
  return [...byKey.values()];
}

function businessKey(row) {
  const websiteDomain = rootDomainFromUrl(row.website);
  if (websiteDomain) return `site:${websiteDomain}`;
  const name = String(row.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const city = String(row.city ?? "").toLowerCase().trim();
  return `${name}|${city}`;
}

function writeCsv(path, rows) {
  const headers = [
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
    "lead_score",
    "fit_reasons",
    "discovery_status",
    "email_source",
    "email_confidence",
    "email_domain_type",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row?.[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) die(`JSON not found: ${absolute}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
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

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim();
  }
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) die(`${name} is not set.`);
  return value;
}

function hasEnv(name) {
  return Boolean(process.env[name]?.trim());
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function flattenOutscraperData(data) {
  if (!Array.isArray(data)) return [];
  if (data.every((item) => Array.isArray(item))) return data.flat();
  return data;
}

function pick(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function cleanUrl(value) {
  if (!value) return "";
  try {
    return new URL(value).toString();
  } catch {
    try {
      return new URL(`https://${value}`).toString();
    } catch {
      return "";
    }
  }
}

function boundedNumber(value, min, max, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function numberArg(value, fallback) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : Number(fallback);
}

function emailDomain(email) {
  return String(email).split("@")[1]?.toLowerCase() ?? "";
}

function rootDomainFromUrl(value) {
  const text = cleanUrl(value);
  if (!text) return "";
  try {
    return rootDomain(new URL(text).hostname);
  } catch {
    return rootDomain(text);
  }
}

function rootDomain(hostname) {
  const host = String(hostname ?? "")
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  const parts = host.split(".").filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join(".") : host;
}

function decodeEntities(value) {
  return value
    .replace(/&#64;|&commat;/gi, "@")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ");
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function easternDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

function printHelp() {
  console.log(`
Build Reach candidate lists with business discovery first.

This script does not import contacts, start drips, or change HighLevel settings.

Plan only:
  npm run reach:discover -- --lane all --plan-only

Run paid business discovery after approval:
  npm run reach:discover -- --lane all --allow-spend

Options:
  --lane all|reviews|ai|relay
  --limit 20
  --max-businesses 120
  --max-spend 5
  --min-score 65
  --crawl true|false
  --crawl-limit 60
  --allow-spend
  --plan-only
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
