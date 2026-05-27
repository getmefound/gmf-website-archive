#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_BASE = "https://api.namecheap.com/xml.response";
const DEFAULT_DOMAINS = ["trygetmefound.com", "getmefoundlocal.com", "getmefoundnow.com"];

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

  requireEnv("NAMECHEAP_API_USER");
  requireEnv("NAMECHEAP_USERNAME");
  requireEnv("NAMECHEAP_API_KEY");
  requireEnv("NAMECHEAP_CLIENT_IP");

  const domains = String(args.domains ?? DEFAULT_DOMAINS.join(","))
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

  const owned = await namecheap("namecheap.domains.getList", {
    PageSize: "100",
  });
  const ownedDomains = extractOwnedDomains(owned);

  const checks = [];
  for (const domain of domains) {
    const [sld, ...tldParts] = domain.split(".");
    const tld = tldParts.join(".");
    const isOwned = ownedDomains.includes(domain);
    const row = { domain, owned: isOwned };
    if (isOwned) {
      const dns = await namecheap("namecheap.domains.dns.getHosts", {
        SLD: sld,
        TLD: tld,
      });
      row.hosts = extractHosts(dns);
    }
    checks.push(row);
  }

  console.log(JSON.stringify({ ok: true, mode: "read_only", domains: checks }, null, 2));
}

async function namecheap(command, params = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set("ApiUser", process.env.NAMECHEAP_API_USER.trim());
  url.searchParams.set("UserName", process.env.NAMECHEAP_USERNAME.trim());
  url.searchParams.set("ApiKey", process.env.NAMECHEAP_API_KEY.trim());
  url.searchParams.set("ClientIp", process.env.NAMECHEAP_CLIENT_IP.trim());
  url.searchParams.set("Command", command);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { headers: { accept: "application/xml" } });
  const xml = await response.text();
  if (!response.ok) throw new Error(`${command}: HTTP ${response.status} ${xml.slice(0, 300)}`);
  const status = xml.match(/<ApiResponse\b[^>]*\bStatus="([^"]+)"/i)?.[1];
  if (status && status !== "OK") {
    const errors = [...xml.matchAll(/<Error\b[^>]*>([^<]*)<\/Error>/gi)]
      .map((match) => decodeXml(match[1]))
      .join("; ");
    throw new Error(`${command}: ${status} ${errors || xml.slice(0, 300)}`);
  }
  return xml;
}

function extractOwnedDomains(xml) {
  return [...xml.matchAll(/<Domain\b([^>]*)\/?>/gi)]
    .map((match) => getXmlAttr(match[1], "Name").toLowerCase())
    .filter(Boolean);
}

function extractHosts(xml) {
  return [...xml.matchAll(/<host\b([^>]*)\/?>/gi)].map((match) => ({
    name: getXmlAttr(match[1], "Name"),
    type: getXmlAttr(match[1], "Type"),
    address: getXmlAttr(match[1], "Address"),
    mxPref: getXmlAttr(match[1], "MXPref"),
  }));
}

function getXmlAttr(attrs, key) {
  const match = attrs.match(new RegExp(`\\b${key}="([^"]*)"`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function decodeXml(value) {
  return String(value)
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function requireEnv(name) {
  if (!process.env[name]?.trim()) throw new Error(`${name} is not set.`);
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

function printHelp() {
  console.log(`
Run a read-only Namecheap API check.

Usage:
  node scripts/namecheap-check.mjs
  node scripts/namecheap-check.mjs --domains trygetmefound.com,getmefoundlocal.com

This reads your Namecheap domain list and DNS host records. It does not create,
edit, or delete DNS records.
`);
}
