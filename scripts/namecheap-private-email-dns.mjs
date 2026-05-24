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

  const apply = Boolean(args.apply);
  const domains = String(args.domains ?? DEFAULT_DOMAINS.join(","))
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

  const results = [];
  for (const domain of domains) {
    const currentXml = await namecheap("namecheap.domains.dns.getHosts", splitDomain(domain));
    const currentHosts = extractHosts(currentXml);
    const nextHosts = buildPrivateEmailHosts({ domain, currentHosts });
    const result = { domain, apply, nextHosts };
    if (apply) {
      const xml = await namecheap("namecheap.domains.dns.setHosts", {
        ...splitDomain(domain),
        EmailType: "MX",
        ...hostsToParams(nextHosts),
      });
      result.success = /IsSuccess="true"/i.test(xml);
    }
    results.push(result);
  }

  console.log(JSON.stringify({ ok: true, mode: apply ? "apply" : "dry_run", results }, null, 2));
}

function buildPrivateEmailHosts({ domain, currentHosts }) {
  const base = currentHosts.filter((host) => {
    if (host.type === "MX") return false;
    if (host.type === "MXE") return false;
    if (host.name === "@" && host.type === "TXT" && host.address.toLowerCase().includes("v=spf1")) return false;
    if (host.name === "_dmarc" && host.type === "TXT") return false;
    if (host.name === "mail" && host.type === "CNAME" && host.address.toLowerCase().includes("privateemail.com")) return false;
    return true;
  });

  return [
    ...base,
    { name: "@", type: "MX", address: "mx1.privateemail.com", mxPref: "10", ttl: "1800" },
    { name: "@", type: "MX", address: "mx2.privateemail.com", mxPref: "10", ttl: "1800" },
    { name: "@", type: "TXT", address: "v=spf1 include:spf.privateemail.com ~all", mxPref: "10", ttl: "1800" },
    { name: "_dmarc", type: "TXT", address: `v=DMARC1; p=none; rua=mailto:postmaster@${domain}`, mxPref: "10", ttl: "1800" },
    { name: "mail", type: "CNAME", address: "privateemail.com", mxPref: "10", ttl: "1800" },
  ];
}

function hostsToParams(hosts) {
  const params = {};
  hosts.forEach((host, index) => {
    const n = index + 1;
    params[`HostName${n}`] = host.name;
    params[`RecordType${n}`] = host.type;
    params[`Address${n}`] = host.address;
    params[`MXPref${n}`] = host.mxPref || "10";
    params[`TTL${n}`] = host.ttl || "1800";
  });
  return params;
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

function extractHosts(xml) {
  return [...xml.matchAll(/<host\b([^>]*)\/?>/gi)].map((match) => ({
    name: getXmlAttr(match[1], "Name"),
    type: getXmlAttr(match[1], "Type"),
    address: getXmlAttr(match[1], "Address"),
    mxPref: getXmlAttr(match[1], "MXPref") || "10",
    ttl: getXmlAttr(match[1], "TTL") || "1800",
  }));
}

function splitDomain(domain) {
  const [sld, ...tldParts] = domain.split(".");
  return { SLD: sld, TLD: tldParts.join(".") };
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
Prepare or apply Namecheap Private Email DNS records for outreach domains.

Dry run:
  node scripts/namecheap-private-email-dns.mjs

Apply:
  node scripts/namecheap-private-email-dns.mjs --apply

Records:
  MX @ mx1.privateemail.com priority 10
  MX @ mx2.privateemail.com priority 10
  TXT @ v=spf1 include:spf.privateemail.com ~all
  TXT _dmarc v=DMARC1; p=none; rua=mailto:postmaster@domain
  CNAME mail privateemail.com

DKIM is not added here because Namecheap generates DKIM after a mailbox exists.
`);
}
