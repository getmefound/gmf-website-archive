#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_PLACE_ID = "ChIJxypnrEz5KkYRgxXufgych38";
const DEFAULT_BUSINESS_NAME = "Southington Lawn Service LLC";
const REQUIRED_ENV = ["GOOGLE_GBP_CLIENT_ID", "GOOGLE_GBP_CLIENT_SECRET", "GOOGLE_GBP_REFRESH_TOKEN"];
const OPTIONAL_ENV = [
  "GOOGLE_GBP_ACCOUNT_HINT",
  "GOOGLE_GBP_API_APPROVED",
  "GOOGLE_GBP_VERIFY_EMAIL",
  "NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL",
  "NEXT_PUBLIC_AOH_GBP_INVITE_EMAIL",
];
const BUSINESS_MANAGE_SCOPE = "https://www.googleapis.com/auth/business.manage";
const ACCOUNT_API = "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO_API = "https://mybusinessbusinessinformation.googleapis.com/v1";
const OAUTH_ENDPOINT = "https://oauth2.googleapis.com/token";
const REPORT_DIR = "docs/client-ops-ledger/outbox";
const CURRENT_REPORT = "docs/client-ops-ledger/gbp-access-verifier-current.md";
const READ_MASK = [
  "name",
  "title",
  "metadata",
  "storefrontAddress",
  "serviceArea",
  "phoneNumbers",
  "websiteUri",
  "regularHours",
  "categories",
  "profile",
  "openInfo",
].join(",");

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const target = {
    businessName: String(args["business-name"] || DEFAULT_BUSINESS_NAME).trim(),
    placeId: String(args["place-id"] || DEFAULT_PLACE_ID).trim(),
    inviteEmail: getConfiguredInviteEmail(args),
  };
  const dryRun = Boolean(args["dry-run"]);
  const noWrite = Boolean(args["no-write"]);
  const asJson = Boolean(args.json);

  const envPresence = Object.fromEntries(
    [...REQUIRED_ENV, ...OPTIONAL_ENV].map((key) => [key, Boolean(process.env[key]?.trim())]),
  );
  const oauthCredentialsPresent = REQUIRED_ENV.every((key) => envPresence[key]);

  const result = {
    ok: false,
    status: "not_started",
    checkedAt: new Date().toISOString(),
    lane: "gbp_api_readonly",
    target,
    envPresence,
    safety: {
      writesGoogleData: false,
      usesWriteEndpoints: false,
      printsSecretValues: false,
      storesTokens: false,
      storesBrowserCookies: false,
      publicEditsApproved: false,
    },
    officialBasis: [
      "Google Business Profile API requests require OAuth authorization.",
      "Google Business Profile locations can be listed for the authenticated user/account.",
      "metadata.place_id is the stable match field when the location appears on Google Maps.",
    ],
    accountsChecked: [],
    locationsChecked: 0,
    matches: [],
    adminCheck: null,
    nextAction: [],
  };

  if (!oauthCredentialsPresent) {
    result.status = "api_oauth_env_missing";
    result.lane = "oauth_or_authorized_browser_required";
    result.nextAction = [
      "Systems Director must establish the one-time approved OAuth/API lane for the GMF GBP access account, or use the authorized browser-session lane.",
      "Profile Manager should not ask Mike to inspect each client profile manually; this is an infrastructure/access-path gap.",
      "For Southington, verify the profile through the authorized GMF account/session and match place ID ChIJxypnrEz5KkYRgxXufgych38.",
    ];
  } else if (dryRun) {
    result.status = "dry_run_ready";
    result.ok = true;
    result.nextAction = [
      "OAuth env names are present. Rerun without --dry-run to list accessible GBP locations read-only.",
    ];
  } else {
    await runApiVerifier({ result, target });
  }

  if (!noWrite) {
    result.report = writeReports(result);
  }

  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(renderConsole(result));
  }
}

async function runApiVerifier({ result, target }) {
  try {
    const token = await fetchAccessToken();
    const accounts = await listAccounts(token);
    result.accountsChecked = accounts.map(summarizeAccount);

    const locationMap = new Map();
    await collectLocations({
      token,
      parent: "accounts/-",
      target,
      locationMap,
      result,
      source: "wildcard",
    });

    for (const account of accounts) {
      if (!account.name) continue;
      await collectLocations({
        token,
        parent: account.name,
        target,
        locationMap,
        result,
        source: account.name,
      });
    }

    const locations = [...locationMap.values()];
    result.locationsChecked = locations.length;
    result.matches = locations.filter((location) => isLocationMatch({ location, target })).map(summarizeLocation);

    if (!result.matches.length) {
      result.status = "location_not_visible_to_authorized_account";
      result.nextAction = [
        "Profile Manager should verify the exact GMF invite email used by the client-facing instructions.",
        "Account Manager should route a corrected client access request if the profile is not visible to the authorized GMF account/session.",
        "Do not ask Mike to inspect the profile unless the authorized account/session itself needs owner recovery or one-time consent.",
      ];
      return;
    }

    const matchedLocation = locations.find((location) => result.matches.some((match) => match.name === location.name));
    result.adminCheck = await listLocationAdminsSafely({ token, locationName: matchedLocation?.name, inviteEmail: target.inviteEmail });

    if (result.adminCheck?.targetEmailVisible) {
      result.ok = true;
      result.status = "access_confirmed";
      result.nextAction = [
        "Profile Manager can capture live GBP facts from the matched location.",
        "Auditor verifies the proof report before any public edit/change-control step.",
      ];
    } else {
      result.ok = true;
      result.status = "location_visible_role_unconfirmed";
      result.nextAction = [
        "Location visibility confirms the authorized account can read the profile.",
        "If exact role proof is required, Profile Manager uses People and access in the authorized browser session or the admins API once available.",
        "Do not block GBP fact capture while exact role label is unavailable; block only public edits that require edit authority proof.",
      ];
    }
  } catch (error) {
    result.status = classifyApiFailure(error);
    result.apiFailure = sanitizeApiFailure(error);
    result.nextAction = [
      "Systems Director repairs the OAuth/API lane or switches Profile Manager to the authorized browser-session lane.",
      "Manager does not ask Mike for per-client profile facts; Mike is needed only for one-time account authorization, account recovery, or approval to change credentials.",
    ];
  }
}

async function fetchAccessToken() {
  const response = await fetch(OAUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_GBP_CLIENT_ID.trim(),
      client_secret: process.env.GOOGLE_GBP_CLIENT_SECRET.trim(),
      refresh_token: process.env.GOOGLE_GBP_REFRESH_TOKEN.trim(),
      grant_type: "refresh_token",
      scope: BUSINESS_MANAGE_SCOPE,
    }),
  });
  const body = await readJson(response);
  if (!response.ok || !body.access_token) {
    throw new ApiError("oauth_token_exchange_failed", response.status, body);
  }
  return body.access_token;
}

async function listAccounts(token) {
  const body = await apiGet({ token, url: `${ACCOUNT_API}/accounts` });
  return Array.isArray(body.accounts) ? body.accounts : [];
}

async function collectLocations({ token, parent, target, locationMap, result, source }) {
  const attempts = [
    { filter: `metadata.place_id="${target.placeId}"`, label: "place_id_filter" },
    { filter: target.businessName ? `title:"${target.businessName}"` : "", label: "title_filter" },
    { filter: "", label: "unfiltered" },
  ];

  for (const attempt of attempts) {
    try {
      const locations = await listLocations({ token, parent, filter: attempt.filter });
      for (const location of locations) {
        const key = location.name || `${source}:${location.title}:${getPlaceId(location)}`;
        if (!locationMap.has(key)) {
          locationMap.set(key, { ...location, _verificationSource: `${source}:${attempt.label}` });
        }
      }
      if (locations.some((location) => isLocationMatch({ location, target }))) return;
    } catch (error) {
      result.locationAttemptFailures = result.locationAttemptFailures || [];
      result.locationAttemptFailures.push({
        parent,
        attempt: attempt.label,
        status: error instanceof ApiError ? error.status : "unknown",
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function listLocations({ token, parent, filter }) {
  const locations = [];
  let pageToken = "";

  do {
    const url = new URL(`${BUSINESS_INFO_API}/${parent}/locations`);
    url.searchParams.set("readMask", READ_MASK);
    url.searchParams.set("pageSize", "100");
    if (filter) url.searchParams.set("filter", filter);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const body = await apiGet({ token, url: url.toString() });
    if (Array.isArray(body.locations)) locations.push(...body.locations);
    pageToken = body.nextPageToken || "";
  } while (pageToken);

  return locations;
}

async function listLocationAdminsSafely({ token, locationName, inviteEmail }) {
  if (!locationName) return { status: "skipped_no_location_name", targetEmailVisible: false };
  try {
    const body = await apiGet({ token, url: `${ACCOUNT_API}/${locationName}/admins` });
    const admins = Array.isArray(body.admins) ? body.admins : [];
    const summarized = admins.map((admin) => summarizeAdmin(admin, inviteEmail));
    return {
      status: "checked",
      count: admins.length,
      targetEmail: inviteEmail,
      targetEmailVisible: summarized.some((admin) => admin.matchesTargetEmail),
      admins: summarized,
    };
  } catch (error) {
    return {
      status: "admin_list_unavailable",
      targetEmail: inviteEmail,
      targetEmailVisible: false,
      failure: sanitizeApiFailure(error),
    };
  }
}

async function apiGet({ token, url }) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const body = await readJson(response);
  if (!response.ok) {
    throw new ApiError("google_api_get_failed", response.status, body);
  }
  return body;
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

function summarizeAccount(account) {
  return {
    name: account.name || null,
    type: account.type || null,
    role: account.role || null,
    accountName: account.accountName || null,
    verificationState: account.verificationState || null,
  };
}

function summarizeLocation(location) {
  return {
    name: location.name || null,
    title: location.title || null,
    placeId: getPlaceId(location),
    mapsUri: location.metadata?.mapsUri || location.metadata?.maps_url || null,
    source: location._verificationSource || null,
    openStatus: location.openInfo?.status || null,
    hasWebsite: Boolean(location.websiteUri),
    hasRegularHours: Boolean(location.regularHours),
    hasServiceArea: Boolean(location.serviceArea),
    hasStorefrontAddress: Boolean(location.storefrontAddress),
    primaryCategory: location.categories?.primaryCategory?.displayName || location.categories?.primaryCategory?.name || null,
  };
}

function summarizeAdmin(admin, inviteEmail) {
  const rawEmail = getAdminEmail(admin);
  return {
    name: admin.name || null,
    role: admin.role || admin.adminRole || null,
    email: redactEmail(rawEmail),
    matchesTargetEmail: Boolean(rawEmail && same(rawEmail, inviteEmail)),
    pending: Boolean(admin.pendingInvitation || admin.invitation),
  };
}

function getAdminEmail(admin) {
  return admin.email || admin.account || admin.admin || admin.user?.emailAddress || admin.profile?.emailAddress || null;
}

function getPlaceId(location) {
  return (
    location.metadata?.placeId ||
    location.metadata?.place_id ||
    location.metadata?.mapsPlaceId ||
    location.metadata?.maps_place_id ||
    null
  );
}

function isLocationMatch({ location, target }) {
  const placeId = getPlaceId(location);
  if (target.placeId && placeId && same(placeId, target.placeId)) return true;
  if (!target.businessName || !location.title) return false;
  return normalize(location.title).includes(normalize(target.businessName));
}

function writeReports(result) {
  mkdirSync(REPORT_DIR, { recursive: true });
  const timestamp = result.checkedAt.replace(/[:.]/g, "-");
  const jsonPath = join(REPORT_DIR, `gbp-access-verifier-${timestamp}.json`);
  const mdPath = join(REPORT_DIR, `gbp-access-verifier-${timestamp}.md`);
  const markdown = renderMarkdown(result);
  writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(mdPath, markdown);
  writeFileSync(CURRENT_REPORT, markdown);
  return { jsonPath, mdPath, currentReport: CURRENT_REPORT };
}

function renderMarkdown(result) {
  const lines = [
    "# GBP Access Verifier Report",
    "",
    `Generated: ${result.checkedAt}`,
    `Status: ${result.status}`,
    `OK: ${result.ok ? "yes" : "no"}`,
    "",
    "## Target",
    "",
    `- Business: ${result.target.businessName}`,
    `- Place ID: ${result.target.placeId}`,
    `- GMF access email: ${result.target.inviteEmail}`,
    "",
    "## Safety",
    "",
    "- Read-only verification only.",
    "- No Google write endpoints used.",
    "- No OAuth secret, refresh token, access token, browser cookie, password, or 2FA code stored.",
    "- Public edits still require GBP change-control approval.",
    "",
    "## API Lane",
    "",
    `- OAuth env present: ${REQUIRED_ENV.every((key) => result.envPresence[key]) ? "yes" : "no"}`,
    `- Accounts checked: ${result.accountsChecked.length}`,
    `- Locations checked: ${result.locationsChecked}`,
    "",
    "## Matches",
    "",
  ];

  if (result.matches.length) {
    for (const match of result.matches) {
      lines.push(`- ${match.title || "(untitled)"} (${match.name || "no location id"})`);
      lines.push(`  - Place ID: ${match.placeId || "not returned"}`);
      lines.push(`  - Source: ${match.source || "not recorded"}`);
      lines.push(`  - Website present: ${match.hasWebsite ? "yes" : "no"}`);
      lines.push(`  - Hours present: ${match.hasRegularHours ? "yes" : "no"}`);
      lines.push(`  - Address/service area present: ${match.hasStorefrontAddress || match.hasServiceArea ? "yes" : "no"}`);
      lines.push(`  - Primary category: ${match.primaryCategory || "not returned"}`);
    }
  } else {
    lines.push("- No matching location returned to the authorized API account.");
  }

  lines.push("", "## Admin/Role Check", "");
  if (result.adminCheck) {
    lines.push(`- Status: ${result.adminCheck.status}`);
    lines.push(`- Target email visible: ${result.adminCheck.targetEmailVisible ? "yes" : "no"}`);
    if (Array.isArray(result.adminCheck.admins)) {
      for (const admin of result.adminCheck.admins) {
        lines.push(`- Admin: ${admin.email || "redacted/unknown"} / role ${admin.role || "unknown"} / target ${admin.matchesTargetEmail ? "yes" : "no"}`);
      }
    }
  } else {
    lines.push("- Not checked.");
  }

  if (result.apiFailure) {
    lines.push("", "## API Failure", "", `- Status: ${result.apiFailure.status || "unknown"}`, `- Reason: ${result.apiFailure.message || "unknown"}`);
  }

  lines.push("", "## Next Action", "");
  for (const action of result.nextAction) lines.push(`- ${action}`);

  lines.push(
    "",
    "## Official Basis",
    "",
    "- Google owner/manager roles and People and access: https://support.google.com/business/answer/3403100",
    "- Google OAuth requirement for GBP APIs: https://developers.google.com/my-business/content/implement-oauth",
    "- Google location list and metadata.place_id matching: https://developers.google.com/my-business/content/location-data",
    "- Google Account Management API/admin resources: https://developers.google.com/my-business/reference/accountmanagement/rest",
    "",
  );

  return `${lines.join("\n")}\n`;
}

function renderConsole(result) {
  const reportLine = result.report ? `\nReport: ${result.report.currentReport}` : "";
  return [
    `GBP access verifier: ${result.status}`,
    `OK: ${result.ok ? "yes" : "no"}`,
    `Target: ${result.target.businessName} / ${result.target.placeId}`,
    `Matches: ${result.matches.length}`,
    `Next: ${result.nextAction[0] || "none"}`,
    reportLine,
  ].join("\n");
}

function classifyApiFailure(error) {
  if (!(error instanceof ApiError)) return "verifier_runtime_error";
  if (error.status === 401) return "oauth_token_invalid_or_revoked";
  if (error.status === 403) return "api_not_enabled_quota_zero_or_permission_denied";
  if (error.status === 404) return "api_resource_not_found";
  return "google_api_failure";
}

function sanitizeApiFailure(error) {
  if (!(error instanceof ApiError)) {
    return { message: error instanceof Error ? error.message : String(error) };
  }
  return {
    message: error.message,
    status: error.status,
    reason: error.body?.error?.status || error.body?.error || null,
    details: sanitizeDetails(error.body?.error?.details || error.body?.details || null),
  };
}

function sanitizeDetails(details) {
  if (!Array.isArray(details)) return null;
  return details.map((detail) => ({
    type: detail["@type"] || null,
    reason: detail.reason || null,
    domain: detail.domain || null,
    metadata: detail.metadata ? Object.fromEntries(Object.keys(detail.metadata).map((key) => [key, "[redacted]"])) : null,
  }));
}

function getConfiguredInviteEmail(args) {
  return String(
    args["invite-email"] ||
      process.env.GOOGLE_GBP_VERIFY_EMAIL ||
      process.env.NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL ||
      process.env.NEXT_PUBLIC_AOH_GBP_INVITE_EMAIL ||
      "profile@getmefound.ai",
  )
    .trim()
    .toLowerCase();
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index++;
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
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function same(a, b) {
  return normalize(a) === normalize(b);
}

function redactEmail(email) {
  if (!email || !String(email).includes("@")) return null;
  const [local, domain] = String(email).split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

function printHelp() {
  console.log(`
Read-only Google Business Profile access verifier.

Examples:
  npm run gbp:access-verify -- --json
  npm run gbp:access-verify -- --place-id ChIJxypnrEz5KkYRgxXufgych38 --business-name "Southington Lawn Service LLC"
  npm run gbp:access-verify -- --dry-run --no-write

Required env for API lane:
  GOOGLE_GBP_CLIENT_ID
  GOOGLE_GBP_CLIENT_SECRET
  GOOGLE_GBP_REFRESH_TOKEN

Optional env:
  GOOGLE_GBP_VERIFY_EMAIL
  NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL
  GOOGLE_GBP_ACCOUNT_HINT
`);
}

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
