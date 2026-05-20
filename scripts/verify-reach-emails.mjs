#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const NEVERBOUNCE_API_BASE = "https://api.neverbounce.com";
const HUNTER_API_BASE = "https://api.hunter.io";

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

  const csv = String(args.csv ?? "").trim();
  if (!csv) die("Missing --csv path.");

  const provider = String(args.provider ?? "neverbounce").toLowerCase();
  if (!["neverbounce", "hunter"].includes(provider)) {
    die("--provider must be neverbounce or hunter.");
  }

  const rows = readCsv(csv);
  const emailField = String(args.emailField ?? args["email-field"] ?? "email");
  const out = String(args.out ?? csv.replace(/\.csv$/i, "-verified.csv"));
  const reportOut = String(args.report ?? out.replace(/\.csv$/i, "-report.json"));
  const keepUnknown = Boolean(args["keep-unknown"]);
  const keepCatchAll = Boolean(args["keep-catchall"]);

  const verifier =
    provider === "hunter"
      ? verifyWithHunter(requiredEnv("HUNTER_API_KEY"))
      : verifyWithNeverBounce(requiredEnv("NEVERBOUNCE_API_KEY"));

  const report = [];
  const keptRows = [];

  for (const row of rows) {
    const email = String(row[emailField] ?? "").trim().toLowerCase();
    if (!email) continue;
    const result = await verifier(email);
    const decision = decide({ provider, result, keepUnknown, keepCatchAll });
    report.push({ email, decision, ...result });
    if (decision === "keep") keptRows.push(row);
    console.log(`${decision.toUpperCase()} ${email} ${result.status ?? ""}`);
  }

  writeCsv(out, keptRows);
  writeFileSync(reportOut, JSON.stringify(report, null, 2));

  console.log("");
  console.log(`Input: ${rows.length}`);
  console.log(`Kept: ${keptRows.length}`);
  console.log(`Removed: ${rows.length - keptRows.length}`);
  console.log(`Verified CSV: ${out}`);
  console.log(`Verification report: ${reportOut}`);
}

function verifyWithNeverBounce(apiKey) {
  return async (email) => {
    const url = new URL("/v4/single/check", NEVERBOUNCE_API_BASE);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("email", email);
    const res = await fetch(url, { method: "POST" });
    const text = await res.text();
    const data = parseJson(text) ?? {};
    if (!res.ok || data.status !== "success") {
      return { provider: "neverbounce", status: "api_error", error: text.slice(0, 300) };
    }
    return {
      provider: "neverbounce",
      status: data.result,
      flags: Array.isArray(data.flags) ? data.flags : [],
      suggestedCorrection: data.suggested_correction ?? "",
    };
  };
}

function verifyWithHunter(apiKey) {
  return async (email) => {
    const url = new URL("/v2/email-verifier", HUNTER_API_BASE);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("email", email);
    const res = await fetch(url);
    const text = await res.text();
    const data = parseJson(text) ?? {};
    if (!res.ok || !data.data) {
      return { provider: "hunter", status: "api_error", error: text.slice(0, 300) };
    }
    return {
      provider: "hunter",
      status: data.data.status,
      score: data.data.score,
      disposable: data.data.disposable,
      webmail: data.data.webmail,
      mxRecords: data.data.mx_records,
      smtpCheck: data.data.smtp_check,
      acceptAll: data.data.accept_all,
      block: data.data.block,
    };
  };
}

function decide({ provider, result, keepUnknown, keepCatchAll }) {
  if (result.status === "api_error") return "remove";
  if (provider === "neverbounce") {
    if (result.status === "valid") return "keep";
    if (result.status === "catchall") return keepCatchAll ? "keep" : "remove";
    if (result.status === "unknown") return keepUnknown ? "keep" : "remove";
    return "remove";
  }
  if (provider === "hunter") {
    if (result.status === "valid") return "keep";
    if (result.status === "accept_all") return keepCatchAll ? "keep" : "remove";
    if (result.status === "unknown") return keepUnknown ? "keep" : "remove";
    return "remove";
  }
  return "remove";
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) die(`CSV not found: ${absolute}`);
  const rows = parseCsv(readFileSync(absolute, "utf8"));
  console.log(`Loaded ${rows.length} rows from ${basename(path)}.`);
  return rows;
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((h) => h.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

function writeCsv(path, rows) {
  if (!rows.length) {
    writeFileSync(path, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
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

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function printHelp() {
  console.log(`
Verify Reach CSV emails before adding drip start tags.

NeverBounce:
  npm run reach:verify -- --csv tmp-reach-reviews-clean.csv

Hunter:
  npm run reach:verify -- --provider hunter --csv tmp-reach-reviews-clean.csv

Options:
  --provider neverbounce|hunter
  --csv file.csv
  --out file-verified.csv
  --report file-report.json
  --keep-unknown
  --keep-catchall
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
