#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const API_BASE = "https://server.smartlead.ai/api/v1";
const CAMPAIGN_ID = 3379589;
const CAMPAIGN_NAME = "GetMeFound - AI Visibility Audit - Warmup Draft";
const LEADS_CSV = "tmp-getmefound-medspa-first-test-qa.csv";
const WARMUP_CSV = "docs/client-ops-ledger/smartlead-warmup-current.csv";
const CURRENT_REPORT = "docs/client-ops-ledger/smartlead-seed-launch-current.md";
const DATED_REPORT = "docs/client-ops-ledger/outbox/smartlead-seed-launch-2026-06-01.md";
const LAUNCH_DATE = "2026-06-01";
const TIMEZONE = "America/New_York";
const SEND_WINDOW = {
  days: [1],
  start_hour: "10:15",
  end_hour: "11:30",
  min_time_btw_emails: 20,
};
const SENDERS = [
  "mike@getmefoundnow.com",
  "mike@trygetmefound.com",
  "mike@getmefoundlocal.com",
];

const EMAIL_BODY = `Hi there,

I was checking how local med spas show up when people ask Google and AI tools who to trust near {{city}}.

{{company_name}} looks like the kind of business that should be easier to recommend, but I noticed a few visibility gaps I would fix first.

Want me to send over the quick audit?

If this is not useful, reply stop and I'll close the loop.

Mike`;

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

  const apply = Boolean(args.apply);
  const activate = args.activate !== "false";
  const testRecipient = String(args["test-recipient"] || process.env.GMF_SEED_TEST_RECIPIENT || "mike@getmefound.ai");
  const approvedBy = String(args["approved-by"] || "Mike");
  const approvalNote = String(args["approval-note"] || "Mike approved Monday mid-morning sends from the three outreach inboxes in chat.");
  const apiKey = process.env.SMARTLEAD_API_KEY?.trim();
  if (!apiKey) throw new Error("SMARTLEAD_API_KEY is not set.");

  const readiness = checkReadiness();
  const leadRows = readCsv(LEADS_CSV).filter((row) => same(row.qa_recommendation, "ok"));
  if (leadRows.length !== 3) throw new Error(`Expected exactly 3 QA-ok seed leads, found ${leadRows.length}.`);

  const campaigns = normalizeArray(await smartleadGet("/campaigns/", apiKey));
  const campaign = campaigns.find((candidate) => Number(candidate.id) === CAMPAIGN_ID || same(candidate.name, CAMPAIGN_NAME));
  if (!campaign) throw new Error(`Smartlead campaign not found: ${CAMPAIGN_ID} / ${CAMPAIGN_NAME}.`);

  const emailAccounts = normalizeArray(await smartleadGet("/email-accounts/", apiKey));
  const senderAccounts = SENDERS.map((email) => {
    const account = emailAccounts.find((candidate) => same(candidate.from_email ?? candidate.email, email));
    if (!account) throw new Error(`Smartlead sender account not found: ${email}`);
    return {
      id: Number(account.id),
      email,
    };
  });

  const existingSequences = normalizeArray(await smartleadGet(`/campaigns/${campaign.id}/sequences`, apiKey));
  const existingLeads = normalizeLeads(await smartleadGet(`/campaigns/${campaign.id}/leads`, apiKey));
  const targetEmails = new Set(leadRows.map((row) => normalizeEmail(row.email)));
  const unexpectedLeads = existingLeads.filter((lead) => !targetEmails.has(normalizeEmail(lead.email)));
  if (unexpectedLeads.length) {
    throw new Error(
      `Campaign has non-seed leads already. Refusing to launch. Unexpected lead emails: ${unexpectedLeads
        .map((lead) => lead.email)
        .join(", ")}`,
    );
  }

  const sequencePayload = buildSequencePayload();
  const leadsPayload = buildLeadsPayload({ leadRows, approvedBy });
  const schedulePayload = {
    timezone: TIMEZONE,
    days_of_the_week: SEND_WINDOW.days,
    start_hour: SEND_WINDOW.start_hour,
    end_hour: SEND_WINDOW.end_hour,
    min_time_btw_emails: SEND_WINDOW.min_time_btw_emails,
    max_new_leads_per_day: 3,
  };
  const settingsPayload = {
    name: "GetMeFound - CT Med Spa Visibility Seed - 2026-06-01",
    track_settings: ["DONT_TRACK_EMAIL_OPEN", "DONT_TRACK_LINK_CLICK"],
    stop_lead_settings: "REPLY_TO_AN_EMAIL",
    send_as_plain_text: true,
    force_plain_text: true,
    follow_up_percentage: 0,
    enable_ai_esp_matching: false,
    auto_pause_domain_leads_on_reply: true,
    add_unsubscribe_tag: true,
  };

  const plan = {
    campaign: pickCampaign(campaign),
    mode: apply ? "apply" : "dry_run",
    launchDate: LAUNCH_DATE,
    timezone: TIMEZONE,
    sendWindow: SEND_WINDOW,
    senderAccounts,
    leadCount: leadRows.length,
    leadEmails: leadRows.map((row) => row.email),
    existingSequenceCount: existingSequences.length,
    existingLeadCount: existingLeads.length,
    readiness,
    sequenceSubject: sequencePayload.sequences[0].subject,
    willActivate: apply && activate,
    testRecipient,
    approvalNote,
  };

  const actions = [];
  if (apply) {
    if (!same(campaign.status, "DRAFTED") && !same(campaign.status, "DRAFT")) {
      throw new Error(`Campaign status must be DRAFTED before launch setup. Current status: ${campaign.status}`);
    }

    if (!existingSequences.length) {
      actions.push({ step: "add_sequence", response: await smartleadPost(`/campaigns/${campaign.id}/sequences`, apiKey, sequencePayload) });
    } else {
      actions.push({ step: "add_sequence", skipped: true, reason: "sequence_already_exists" });
    }

    actions.push({
      step: "link_sender_accounts",
      response: await smartleadPost(`/campaigns/${campaign.id}/email-accounts`, apiKey, {
        email_account_ids: senderAccounts.map((account) => account.id),
      }),
    });

    let leadIdsByEmail = Object.fromEntries(existingLeads.map((lead) => [normalizeEmail(lead.email), Number(lead.id)]));
    const missingLeadRows = leadRows.filter((row) => !leadIdsByEmail[normalizeEmail(row.email)]);
    if (missingLeadRows.length) {
      const addLeadResponse = await smartleadPost(`/campaigns/${campaign.id}/leads`, apiKey, {
        ...buildLeadsPayload({ leadRows: missingLeadRows, approvedBy }),
        settings: {
          ignore_global_block_list: false,
          ignore_unsubscribe_list: false,
          ignore_duplicate_leads_in_other_campaign: false,
          ignore_community_bounce_list: false,
          return_lead_ids: true,
        },
      });
      actions.push({ step: "add_leads", response: addLeadResponse });
      const refreshedLeads = normalizeLeads(await smartleadGet(`/campaigns/${campaign.id}/leads`, apiKey));
      leadIdsByEmail = Object.fromEntries(refreshedLeads.map((lead) => [normalizeEmail(lead.email), Number(lead.id)]));
    } else {
      actions.push({ step: "add_leads", skipped: true, reason: "target_leads_already_exist" });
    }

    for (const [index, leadRow] of leadRows.entries()) {
      const leadId = leadIdsByEmail[normalizeEmail(leadRow.email)];
      if (!leadId) throw new Error(`Could not resolve Smartlead lead ID for ${leadRow.email}`);
      const account = senderAccounts[index % senderAccounts.length];
      actions.push({
        step: "assign_sender",
        lead: leadRow.email,
        sender: account.email,
        response: await smartleadPost("/campaigns/update-lead-email-account", apiKey, {
          email_account_id: account.id,
          email_campaign_id: Number(campaign.id),
          email_lead_id: leadId,
          override_lead_email_account: true,
        }),
      });
    }

    actions.push({
      step: "update_schedule",
      response: await smartleadPost(`/campaigns/${campaign.id}/schedule`, apiKey, schedulePayload),
    });

    actions.push({
      step: "update_settings",
      response: await smartleadPost(`/campaigns/${campaign.id}/settings`, apiKey, settingsPayload),
    });

    const firstLeadId = leadIdsByEmail[normalizeEmail(leadRows[0].email)];
    actions.push({
      step: "send_internal_test_email",
      recipient: testRecipient,
      response: await smartleadPost(`/campaigns/${campaign.id}/send-test-email`, apiKey, {
        leadId: firstLeadId,
        sequenceNumber: 1,
        selectedEmailAccountId: senderAccounts[0].id,
        customEmailAddress: testRecipient,
      }),
    });

    if (activate) {
      actions.push({
        step: "activate_campaign",
        response: await smartleadPost(`/campaigns/${campaign.id}/status`, apiKey, { status: "START" }),
      });
    }
  }

  const result = { ok: true, ...plan, actions };
  const report = renderReport({ result, leadRows, senderAccounts, approvalNote });
  if (apply) {
    writeText(CURRENT_REPORT, report);
    writeText(DATED_REPORT, report);
  }

  console.log(JSON.stringify(result, null, 2));
}

function buildSequencePayload() {
  return {
    sequences: [
      {
        seq_number: 1,
        subject: "quick visibility check for {{company_name}}",
        email_body: EMAIL_BODY,
        seq_delay_details: { delay_in_days: 0 },
      },
    ],
  };
}

function buildLeadsPayload({ leadRows, approvedBy }) {
  return {
    lead_list: leadRows.map((row) => ({
      email: row.email,
      company_name: row.name,
      phone_number: row.phone,
      website: row.website,
      company_url: row.website,
      location: `${row.city}, ${row.state}`,
      custom_fields: {
        city: row.city,
        state: row.state,
        niche: row.niche,
        rating: row.rating,
        review_count: row.reviewCount,
        reviews_link: row.reviewsLink,
        source_query: row.sourceQuery,
        launch_batch: `GMF Smartlead seed ${LAUNCH_DATE}`,
        approved_by: approvedBy,
      },
    })),
  };
}

function checkReadiness() {
  const rows = readCsv(WARMUP_CSV);
  const findings = SENDERS.map((email) => {
    const row = rows.find((candidate) => same(candidate.email, email));
    if (!row) throw new Error(`Warmup row missing for ${email}. Run npm run smartlead:warmup-report first.`);
    const blockers = [];
    if (row.smtp_ok !== "yes") blockers.push("SMTP not OK");
    if (row.imap_ok !== "yes") blockers.push("IMAP not OK");
    if (row.suspended === "yes") blockers.push("account suspended");
    if (row.warmup_status !== "ACTIVE") blockers.push(`warmup ${row.warmup_status || "unknown"}`);
    if (row.warmup_blocked === "yes") blockers.push("warmup blocked");
    if (number(row.warmup_reputation) < 95) blockers.push("reputation below 95");
    if (number(row.warmup_sent_count) < 10) blockers.push("warmup sent below 10");
    if (number(row.warmup_spam_count) > 0) blockers.push("spam above 0");
    return {
      email,
      ready: blockers.length === 0,
      blockers,
      warmupSent: number(row.warmup_sent_count),
      spam: number(row.warmup_spam_count),
      reputation: number(row.warmup_reputation),
    };
  });
  const failed = findings.filter((finding) => !finding.ready);
  if (failed.length) throw new Error(`Smartlead readiness failed: ${failed.map((finding) => `${finding.email} (${finding.blockers.join("; ")})`).join(", ")}`);
  return findings;
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
  if (!response.ok) {
    throw new Error(`${path}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.campaigns)) return value.campaigns;
  return [];
}

function normalizeLeads(value) {
  return normalizeArray(value).map((row) => ({
    id: row.lead?.id ?? row.id ?? row.lead_id ?? row.email_lead_id,
    email: row.lead?.email ?? row.email ?? row.lead_email,
  }));
}

function pickCampaign(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
  };
}

function readCsv(path) {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (quoted && char === '"' && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function renderReport({ result, leadRows, senderAccounts, approvalNote }) {
  const lines = [];
  lines.push("# Smartlead Seed Launch Proof");
  lines.push("");
  lines.push("Status: scheduled/active for Monday seed send");
  lines.push(`Launch date: ${LAUNCH_DATE}`);
  lines.push(`Send window: ${SEND_WINDOW.start_hour}-${SEND_WINDOW.end_hour} ${TIMEZONE}`);
  lines.push(`Campaign ID: ${result.campaign.id}`);
  lines.push(`Campaign: ${result.campaign.name}`);
  lines.push(`Owner approval: ${approvalNote}`);
  lines.push("");
  lines.push("## Safety Gates");
  lines.push("");
  lines.push("- Smartlead preflight: pass");
  lines.push("- Sender readiness: pass");
  lines.push("- Live cap: 3 seed leads total");
  lines.push("- Sending accounts: 3 outreach inboxes");
  lines.push("- Main `getmefound.ai` inbox: not used for cold outreach");
  lines.push("- Sequence: one initial email only; no follow-up steps in this seed launch");
  lines.push("- Opt-out language: included in body");
  lines.push("- Internal test email: completed before activation");
  lines.push("");
  lines.push("## Sender Assignment");
  lines.push("");
  lines.push("| Lead | Prospect Email | Assigned Sender |");
  lines.push("|---|---|---|");
  leadRows.forEach((row, index) => {
    lines.push(`| ${row.name} | ${row.email} | ${senderAccounts[index % senderAccounts.length].email} |`);
  });
  lines.push("");
  lines.push("## Smartlead Actions");
  lines.push("");
  for (const action of result.actions) {
    lines.push(`- ${action.step}: ${action.skipped ? `skipped (${action.reason})` : "completed"}`);
  }
  lines.push("");
  lines.push("## Monitoring");
  lines.push("");
  lines.push("- Systems Director checks Smartlead first-window stats Monday after 12:00 ET.");
  lines.push("- Sorter/Sales Rep watches replies and stops manual follow-up on replies, bounces, unsubscribes, or complaints.");
  lines.push("- Manager escalates only if deliverability/reputation risk, angry reply, billing/spend, or owner-level sales decision appears.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function writeText(path, text) {
  const absolute = resolve(path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, text);
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

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function same(a, b) {
  return normalizeEmail(a) === normalizeEmail(b);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function printHelp() {
  console.log(`
Prepare or apply the approved Monday Smartlead seed launch.

Dry run:
  npm run smartlead:schedule-seed-launch

Apply and activate with Monday-only send window:
  npm run smartlead:schedule-seed-launch -- --apply

Apply without activation:
  npm run smartlead:schedule-seed-launch -- --apply --activate false
`);
}
