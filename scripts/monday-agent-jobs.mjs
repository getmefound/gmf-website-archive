#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_URL = "https://api.monday.com/v2";
const ALLOWED_ROLES = new Set(["Manager", "Systems Director", "Reporter"]);
const DEFAULT_BOARD_NAME = "Agents Jobs";
const DEFAULT_OWNER_SLACK_USER_ID = "U0ATPQYFA85"; // Mike

const GROUPS = [
  "Human Needed",
  "01 Prospecting - Cold Email",
  "02 Sales & Signup",
  "03 Client Onboarding",
  "04 Launch / First 14 Days",
  "05 Recurring Runs",
  "06 Client Success / Reports",
  "07 Upsell / Expansion",
  "08 Systems / Incidents",
  "Done",
];

const COLUMNS = [
  ["owner", "Owner", "people"],
  ["status", "Status", "status"],
  ["dueDate", "Due date", "date"],
  ["priority", "Priority", "status"],
  ["notes", "Notes", "long_text"],
  ["agentOwner", "Agent Owner", "text"],
  ["system", "System", "text"],
  ["humanNeeded", "Human Needed", "status"],
  ["proofLink", "Proof Link", "link"],
  ["nextAction", "Next Action", "long_text"],
  ["budget", "Budget USD", "numbers"],
  ["clientId", "Client ID", "text"],
  ["clientName", "Client Name", "text"],
  ["lifecycle", "Lifecycle", "status"],
  ["serviceLine", "Service Line", "status"],
  ["jobType", "Job Type", "status"],
  ["cadence", "Cadence", "status"],
  ["riskLevel", "Risk Level", "status"],
  ["approvalType", "Approval Type", "status"],
  ["reviewer", "Reviewer", "text"],
  ["folderPath", "Client Folder", "text"],
  ["sourceTrigger", "Source / Trigger", "text"],
  ["missionControl", "Mission Control", "link"],
  ["langfuseTrace", "Langfuse Trace", "link"],
  ["waitingState", "Waiting State", "status"],
  ["expectedReceive", "Expected Receive", "text"],
  ["escalateAt", "Escalate At", "text"],
  ["nextOwner", "Next Owner", "text"],
  ["handoffAck", "Handoff Ack", "status"],
  ["ackAt", "Ack At", "text"],
  ["unlockProof", "Unlock Proof", "long_text"],
  ["runtimeState", "Runtime State", "status"],
  ["lastWatchdog", "Last Watchdog", "text"],
];

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

  const action = String(args.action ?? "list").toLowerCase();
  const role = normalizeRole(args.role);
  validateQueueStateArgs(args);
  if (action !== "list" && !ALLOWED_ROLES.has(role)) {
    throw new Error(`Monday write blocked. Allowed writer roles: ${[...ALLOWED_ROLES].join(", ")}.`);
  }

  const token = process.env.MONDAY_API_TOKEN?.trim();
  if (!token) throw new Error("MONDAY_API_TOKEN is not set in .env.local.");

  const boardName = String(process.env.MONDAY_AGENT_JOBS_BOARD_NAME || DEFAULT_BOARD_NAME);
  const board = await getBoard({ token, boardName, boardId: process.env.MONDAY_AGENT_JOBS_BOARD_ID });
  if (!board) throw new Error(`Monday board not found: ${boardName}.`);

  if (action === "setup") {
    const setup = await ensureSetup({ token, boardId: board.id });
    console.log(
      JSON.stringify(
        {
          ok: true,
          action,
          board: pickBoard(board),
          groups: summarizeMap(setup.groups),
          columns: summarizeMap(setup.columns),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (action === "list") {
    const detail = await getBoardDetail({ token, boardId: board.id });
    const columnKeysById = buildColumnKeysById(detail.columns);
    console.log(
      JSON.stringify(
        {
          ok: true,
          action,
          board: pickBoard(detail),
          items: detail.items.map((item) => ({
            id: item.id,
            name: item.name,
            group: item.group?.title ?? "",
            values: buildItemValues({ item, columnKeysById }),
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const setup = await ensureSetup({ token, boardId: board.id });
  const detail = await getBoardDetail({ token, boardId: board.id });

  if (action === "create") {
    const name = required(args.name, "--name is required for create.");
    const existing = findItem(detail.items, name);
    if (existing && !args.upsert) {
      console.log(JSON.stringify({ ok: true, action, skipped: true, reason: "already_exists", item: pickItem(existing) }, null, 2));
      return;
    }

    const item = existing
      ? await updateItem({ token, boardId: board.id, item: existing, columns: setup.columns, args })
      : await createItem({ token, boardId: board.id, groups: setup.groups, columns: setup.columns, args });

    await maybeNotifySlack({ args, action: existing ? "update" : "create", role, board, item });
    console.log(JSON.stringify({ ok: true, action, board: pickBoard(board), item, writerRole: role }, null, 2));
    return;
  }

  if (action === "update") {
    const item = args["item-id"]
      ? detail.items.find((candidate) => String(candidate.id) === String(args["item-id"]))
      : findItem(detail.items, args.name);
    if (!item) throw new Error("Item not found. Provide --item-id or --name.");

    const updated = await updateItem({ token, boardId: board.id, item, columns: setup.columns, args });
    await maybeNotifySlack({ args, action, role, board, item: updated });
    console.log(JSON.stringify({ ok: true, action, board: pickBoard(board), item: updated, writerRole: role }, null, 2));
    return;
  }

  throw new Error(`Unknown action: ${action}. Use list, setup, create, or update.`);
}

async function getBoard({ token, boardName, boardId }) {
  if (boardId) {
    const data = await monday(token, `query ($ids: [ID!]) { boards(ids: $ids) { id name state } }`, {
      ids: [String(boardId)],
    });
    return data.boards?.[0] ?? null;
  }

  const data = await monday(token, `query { boards(limit: 500) { id name state } }`);
  return (data.boards ?? []).find((board) => board.state === "active" && same(board.name, boardName)) ?? null;
}

async function getBoardDetail({ token, boardId }) {
  const data = await monday(
    token,
    `query ($ids: [ID!]) {
      boards(ids: $ids) {
        id
        name
        state
        groups { id title }
        columns { id title type }
        items_page(limit: 100) {
          items {
            id
            name
            group { id title }
            column_values { id text value }
          }
        }
      }
    }`,
    { ids: [String(boardId)] },
  );
  const board = data.boards?.[0];
  if (!board) throw new Error(`Monday board not found by ID: ${boardId}`);
  return {
    ...board,
    items: board.items_page?.items ?? [],
  };
}

async function ensureSetup({ token, boardId }) {
  let detail = await getBoardDetail({ token, boardId });
  const groups = {};
  for (const title of GROUPS) {
    const existing = detail.groups.find((group) => same(group.title, title));
    groups[title] = existing || (await createGroup({ token, boardId, title }));
  }

  detail = await getBoardDetail({ token, boardId });
  const columns = {};
  for (const [key, title, type] of COLUMNS) {
    const existing = detail.columns.find((column) => same(column.title, title));
    columns[key] = existing || (await createColumn({ token, boardId, title, type }));
  }

  return { groups, columns };
}

async function createGroup({ token, boardId, title }) {
  const data = await monday(
    token,
    `mutation ($board: ID!, $title: String!) {
      create_group(board_id: $board, group_name: $title) { id title }
    }`,
    { board: String(boardId), title },
  );
  return data.create_group;
}

async function createColumn({ token, boardId, title, type }) {
  const data = await monday(
    token,
    `mutation ($board: ID!, $title: String!, $type: ColumnType!) {
      create_column(board_id: $board, title: $title, column_type: $type) { id title type }
    }`,
    { board: String(boardId), title, type },
  );
  return data.create_column;
}

async function createItem({ token, boardId, groups, columns, args }) {
  const name = required(args.name, "--name is required for create.");
  const group = pickGroup({ groups, args });
  const values = buildColumnValues({ columns, args });
  const data = await monday(
    token,
    `mutation ($board: ID!, $group: String!, $name: String!, $values: JSON!) {
      create_item(
        board_id: $board,
        group_id: $group,
        item_name: $name,
        column_values: $values,
        create_labels_if_missing: true
      ) { id name }
    }`,
    {
      board: String(boardId),
      group: group.id,
      name,
      values: JSON.stringify(values),
    },
  );
  return pickItem(data.create_item);
}

async function updateItem({ token, boardId, item, columns, args }) {
  const values = buildColumnValues({ columns, args });
  if (Object.keys(values).length) {
    await monday(
      token,
      `mutation ($board: ID!, $item: ID!, $values: JSON!) {
        change_multiple_column_values(
          board_id: $board,
          item_id: $item,
          column_values: $values,
          create_labels_if_missing: true
        ) { id }
      }`,
      {
        board: String(boardId),
        item: String(item.id),
        values: JSON.stringify(values),
      },
    );
  }

  if (args.group) {
    const setup = await ensureSetup({ token, boardId });
    const group = setup.groups[String(args.group)];
    if (!group) throw new Error(`Unknown group: ${args.group}`);
    await monday(
      token,
      `mutation ($item: ID!, $group: String!) {
        move_item_to_group(item_id: $item, group_id: $group) { id }
      }`,
      { item: String(item.id), group: group.id },
    );
  }

  return pickItem(item);
}

function buildColumnValues({ columns, args }) {
  const values = {};
  if (args.owner && same(args.owner, "Mike")) {
    const ownerId = process.env.MONDAY_OWNER_USER_ID || process.env.MONDAY_USER_ID || "104382237";
    values[columns.owner.id] = { personsAndTeams: [{ id: Number(ownerId), kind: "person" }] };
  }
  if (args.status) values[columns.status.id] = { label: String(args.status) };
  if (args.due) values[columns.dueDate.id] = { date: String(args.due) };
  if (args.priority) values[columns.priority.id] = { label: String(args.priority) };
  if (args.notes) values[columns.notes.id] = String(args.notes);
  if (args["agent-owner"]) values[columns.agentOwner.id] = String(args["agent-owner"]);
  if (args.system) values[columns.system.id] = String(args.system);
  if (args["human-needed"]) values[columns.humanNeeded.id] = { label: booleanLabel(args["human-needed"]) };
  if (args.proof) values[columns.proofLink.id] = linkValue(args.proof, args["proof-text"] || "Proof");
  if (args["next-action"]) values[columns.nextAction.id] = String(args["next-action"]);
  if (args.budget !== undefined) values[columns.budget.id] = String(args.budget);
  if (args["client-id"]) values[columns.clientId.id] = String(args["client-id"]);
  if (args["client-name"]) values[columns.clientName.id] = String(args["client-name"]);
  if (args.lifecycle) values[columns.lifecycle.id] = { label: String(args.lifecycle) };
  if (args["service-line"]) values[columns.serviceLine.id] = { label: String(args["service-line"]) };
  if (args["job-type"]) values[columns.jobType.id] = { label: String(args["job-type"]) };
  if (args.cadence) values[columns.cadence.id] = { label: String(args.cadence) };
  if (args.risk) values[columns.riskLevel.id] = { label: String(args.risk) };
  if (args["approval-type"]) values[columns.approvalType.id] = { label: String(args["approval-type"]) };
  if (args.reviewer) values[columns.reviewer.id] = String(args.reviewer);
  if (args["folder-path"]) values[columns.folderPath.id] = String(args["folder-path"]);
  if (args["source-trigger"]) values[columns.sourceTrigger.id] = String(args["source-trigger"]);
  if (args["mission-control"]) values[columns.missionControl.id] = linkValue(args["mission-control"], args["mission-control-text"] || "Mission Control");
  if (args["langfuse-trace"]) values[columns.langfuseTrace.id] = linkValue(args["langfuse-trace"], args["langfuse-trace-text"] || "Langfuse trace");
  if (args["waiting-state"]) values[columns.waitingState.id] = { label: String(args["waiting-state"]) };
  if (args["expected-receive"]) values[columns.expectedReceive.id] = String(args["expected-receive"]);
  if (args["escalate-at"]) values[columns.escalateAt.id] = String(args["escalate-at"]);
  if (args["next-owner"]) values[columns.nextOwner.id] = String(args["next-owner"]);
  if (args["handoff-ack"]) values[columns.handoffAck.id] = { label: String(args["handoff-ack"]) };
  if (args["ack-at"]) values[columns.ackAt.id] = String(args["ack-at"]);
  if (args["unlock-proof"]) values[columns.unlockProof.id] = String(args["unlock-proof"]);
  if (args["runtime-state"]) values[columns.runtimeState.id] = { label: String(args["runtime-state"]) };
  if (args["last-watchdog"]) values[columns.lastWatchdog.id] = String(args["last-watchdog"]);
  return values;
}

function validateQueueStateArgs(args) {
  const status = String(args.status ?? "").trim();
  const waitingState = String(args["waiting-state"] ?? "").trim();
  const combined = `${status} ${waitingState}`.toLowerCase();
  const humanNeeded = args["human-needed"] === undefined ? "" : booleanLabel(args["human-needed"]);

  if (/waiting on agent|waiting on proof review/.test(combined)) {
    throw new Error(
      "Invalid queue state: internal agent/reviewer work must use Agent Working or Ready For Review with Handoff Ack, not Waiting.",
    );
  }

  if (humanNeeded === "No" && /^waiting on access$/i.test(status)) {
    throw new Error(
      "Invalid queue state: use Agent Working + Access Investigation while agents are still exhausting access paths. Use Waiting on Client/Owner only after a true human ask is proven.",
    );
  }

  if (/waiting on authenticated access path/.test(combined) && humanNeeded === "No") {
    throw new Error(
      "Invalid queue state: authenticated access path work is Agent Working / Access Investigation until a client, owner, or vendor must act.",
    );
  }
}

function buildColumnKeysById(columns) {
  const keysByTitle = new Map(COLUMNS.map(([key, title]) => [normalizeTitle(title), key]));
  return Object.fromEntries(
    columns.map((column) => [column.id, keysByTitle.get(normalizeTitle(column.title))]).filter(([, key]) => Boolean(key)),
  );
}

function buildItemValues({ item, columnKeysById }) {
  const values = {};
  for (const columnValue of item.column_values) {
    const text = columnValue.text ?? "";
    values[columnValue.id] = text;
    const key = columnKeysById[columnValue.id];
    if (key) values[key] = text;
  }
  return values;
}

function pickGroup({ groups, args }) {
  if (args.group && groups[String(args.group)]) return groups[String(args.group)];
  if (args["human-needed"] && booleanLabel(args["human-needed"]) === "Yes") return groups["Human Needed"];
  if (args.status && same(args.status, "Done")) return groups.Done;
  if (args.lifecycle && groups[String(args.lifecycle)]) return groups[String(args.lifecycle)];
  return groups["08 Systems / Incidents"];
}

async function monday(token, query, variables = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2025-04",
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!response.ok || body.errors) {
    throw new Error(`Monday API failed: ${JSON.stringify({ status: response.status, errors: body.errors || body })}`);
  }
  return body.data;
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

function normalizeRole(value) {
  return String(value ?? "").trim();
}

function booleanLabel(value) {
  const normalized = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "y"].includes(normalized) ? "Yes" : "No";
}

function linkValue(url, text) {
  if (!/^https?:\/\//i.test(String(url))) return String(url);
  return { url: String(url), text: String(text || url) };
}

function findItem(items, name) {
  if (!name) return null;
  return items.find((item) => same(item.name, name)) ?? null;
}

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function normalizeTitle(value) {
  return String(value ?? "").trim().toLowerCase();
}

function required(value, message) {
  if (!value) throw new Error(message);
  return String(value);
}

function pickBoard(board) {
  return { id: board.id, name: board.name };
}

function pickItem(item) {
  return { id: item.id, name: item.name };
}

function summarizeMap(map) {
  return Object.fromEntries(Object.entries(map).map(([key, value]) => [key, { id: value.id, title: value.title }]));
}

function printHelp() {
  console.log(`
Controlled Monday writer for GMF agent jobs.

Allowed writer roles:
  Manager
  Systems Director
  Reporter

Examples:
  npm run monday:agent-job -- --action setup --role Manager
  npm run monday:agent-job -- --action list
  npm run monday:agent-job -- --action create --role Manager --name "Refresh Smartlead API access" --group "Human Needed" --status "Human Needed" --owner Mike --agent-owner "Manager / Systems Director" --system Smartlead --human-needed yes --priority High --due 2026-05-27 --budget 0 --proof "https://github.com/mje-gmf/website/blob/main/docs/client-ops-ledger/prospecting-smartlead-preflight-current.md" --proof-text "Smartlead preflight report" --next-action "Refresh the Smartlead API key, add it locally and in production, then rerun npm run prospecting:preflight." --upsert
  npm run monday:agent-job -- --action update --role Manager --item-id 123 --status "Agent Working" --waiting-state "Agent-owned access investigation" --runtime-state "Access Investigation" --expected-receive "2026-05-29T12:00:00-04:00" --escalate-at "2026-05-29T15:00:00-04:00" --next-owner "Profile Manager / Systems Director" --unlock-proof "Authenticated read-only proof or documented access-path exhaustion"
  npm run monday:agent-job -- --action create --role Manager --name "Build prospecting Mission Control reports" --group "01 Prospecting - Cold Email" --status "Agent Working" --agent-owner "Reporter / Systems Director" --system "Mission Control" --lifecycle "01 Prospecting - Cold Email" --service-line "Prospecting" --job-type "Reporting" --human-needed no --upsert
  npm run monday:agent-job -- --action update --role Reporter --item-id 123 --status Done --human-needed no --notes "Proof attached."
`);
}

async function maybeNotifySlack({ args, action, role, board, item }) {
  const humanNeeded = args["human-needed"] ? booleanLabel(args["human-needed"]) : "No";
  const routineDmAllowed = process.env.MANAGER_ALLOW_ROUTINE_DM === "true";
  const shouldNotify =
    humanNeeded === "Yes" ||
    ((Boolean(args["notify-slack"]) || process.env.MONDAY_NOTIFY_SLACK_ON_JOB_WRITE === "true") && routineDmAllowed);
  if (!shouldNotify) return;

  const botToken = process.env.SLACK_BOT_TOKEN?.trim();
  if (!botToken) {
    console.warn("Slack notification skipped: SLACK_BOT_TOKEN is not set.");
    return;
  }

  const channel =
    process.env.MANAGER_OWNER_DM_CHANNEL_ID?.trim() ||
    process.env.MANAGER_OWNER_SLACK_USER_ID?.trim() ||
    process.env.AOH_OWNER_SLACK_USER_ID?.trim() ||
    process.env.SLACK_OWNER_USER_ID?.trim() ||
    DEFAULT_OWNER_SLACK_USER_ID;
  const owner = args["agent-owner"] || role;
  const system = args.system || "Agent Jobs";
  const status = args.status || (action === "create" ? "Sent" : "Updated");
  const mondayBoardUrl = `https://monday.com/boards/${board.id}`;

  const message = [
    `*Manager ${humanNeeded === "Yes" ? "human-needed" : "routine"} job ${action === "create" ? "sent" : "updated"}*`,
    `- Job: ${item.name}`,
    `- Status: ${status}`,
    `- Agent owner: ${owner}`,
    `- System: ${system}`,
    `- Human needed: ${humanNeeded}`,
    `- Inspect: ${mondayBoardUrl}`,
  ].join("\n");

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${botToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text: message }),
  });
  const body = await response.json().catch(async () => ({ ok: false, error: await response.text() }));
  if (!response.ok || !body.ok) {
    const reason = body.error || response.status;
    console.warn(`Slack notification skipped: ${reason}`);
    if (reason === "messages_tab_disabled") {
      console.warn("Manager DM blocked: enable the Slack app App Home Messages Tab / DM capability, then rerun the DM smoke test.");
    }
  }
}
