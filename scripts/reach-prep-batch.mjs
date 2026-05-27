#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const LANES = new Set(["reviews", "ai", "relay"]);

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const lane = String(args.lane ?? "").toLowerCase();
  if (!LANES.has(lane)) die("Missing or invalid --lane. Use reviews, ai, or relay.");

  const industry = String(args.industry ?? "").trim();
  const area = String(args.area ?? "").trim();
  if (!industry || !area) die("Provide --industry and --area.");

  const limit = String(args.limit ?? "25");
  const prefix = String(args.prefix ?? `tmp-reach-${lane}-next`);
  const verify = Boolean(args.verify);
  const requiredState = String(args.state ?? inferState(area) ?? "").trim();

  const rawJson = `${prefix}.json`;
  const cleanCsv = `${prefix}-clean.csv`;
  const freshCsv = `${prefix}-fresh.csv`;
  const verifiedCsv = `${prefix}-verified.csv`;
  const verifyReport = `${prefix}-verified-report.json`;

  run("node", [
    "scripts/launch-reach-campaign.mjs",
    "--lane",
    lane,
    "--industry",
    industry,
    "--area",
    area,
    "--limit",
    limit,
    "--out",
    rawJson,
  ]);

  run("node", ["scripts/reach-json-to-csv.mjs", "--input", rawJson, "--out", cleanCsv]);
  const freshArgs = ["scripts/reach-filter-fresh-prospects.mjs", "--lane", lane, "--csv", cleanCsv, "--out", freshCsv];
  if (requiredState) freshArgs.push("--state", requiredState);
  run("node", freshArgs);

  if (verify) {
    run("node", [
      "scripts/verify-reach-emails.mjs",
      "--csv",
      freshCsv,
      "--out",
      verifiedCsv,
      "--report",
      verifyReport,
    ]);
    run("node", ["scripts/reach-quality-review.mjs", "--lane", lane, "--csv", verifiedCsv]);
    run("node", [
      "scripts/reach-agent-preflight.mjs",
      "--lane",
      lane,
      "--csv",
      verifiedCsv,
      "--report",
      verifyReport,
    ]);
  } else {
    console.log("");
    console.log("Verification skipped. To finish prep:");
    console.log(`npm run reach:verify -- --csv ${freshCsv} --out ${verifiedCsv} --report ${verifyReport}`);
    console.log(`npm run reach:preflight -- --lane ${lane} --csv ${verifiedCsv} --report ${verifyReport}`);
  }

  console.log("");
  console.log("Prep batch complete. No GHL import or drip start was executed.");
}

function run(command, args) {
  console.log("");
  console.log(`> ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
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

function printHelp() {
  console.log(`
Prepare a fresh Reach campaign batch without GHL import or drip start.

This command can scrape prospects, convert to CSV, remove prior imports/starts,
optionally verify emails, and generate an approval packet.

Examples:
  npm run reach:prep -- --lane reviews --industry "pet boarding" --area "Connecticut" --limit 25
  npm run reach:prep -- --lane relay --industry "veterinary" --area "Connecticut" --limit 25 --verify

Options:
  --lane reviews|ai|relay
  --industry "pet boarding"
  --area "Connecticut"
  --state Connecticut
  --limit 25
  --prefix tmp-reach-reviews-next
  --verify
`);
}

function inferState(area) {
  const normalized = String(area ?? "").trim().toLowerCase();
  const states = {
    ct: "Connecticut",
    connecticut: "Connecticut",
    ny: "New York",
    "new york": "New York",
    nj: "New Jersey",
    "new jersey": "New Jersey",
    ma: "Massachusetts",
    massachusetts: "Massachusetts",
    ri: "Rhode Island",
    "rhode island": "Rhode Island",
  };
  return states[normalized] ?? "";
}

function die(message) {
  console.error(message);
  process.exit(1);
}
