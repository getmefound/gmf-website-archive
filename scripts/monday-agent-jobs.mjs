#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const API_URL = "https://api.monday.com/v2";
const ALLOWED_ROLES = new Set(["Manager", "Systems Director", "Reporter"]);
const DEFAULT_BOARD_NAME = "Agents Jobs";

const GROUPS = [
  "Human Needed",
  "Agent Working",
  "Waiting on System",
  "Ready for Review",
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
            values: Object.fromEntries(item.column_values.map((value) => [value.id, value.text ?? ""])),
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

    console.log(JSON.stringify({ ok: true, action, board: pickBoard(board), item, writerRole: role }, null, 2));
    return;
  }

  if (action === "update") {
    const item = args["item-id"]
      ? detail.items.find((candidate) => String(candidate.id) === String(args["item-id"]))
      : findItem(detail.items, args.name);
    if (!item) throw new Error("Item not found. Provide --item-id or --name.");

    const updated = await updateItem({ token, boardId: board.id, item, columns: setup.columns, args });
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
  return values;
}

function pickGroup({ groups, args }) {
  if (args.group && groups[String(args.group)]) return groups[String(args.group)];
  if (args["human-needed"] && booleanLabel(args["human-needed"]) === "Yes") return groups["Human Needed"];
  if (args.status && same(args.status, "Done")) return groups.Done;
  if (args.status && same(args.status, "Ready for Review")) return groups["Ready for Review"];
  if (args.status && same(args.status, "Waiting on System")) return groups["Waiting on System"];
  return groups["Agent Working"];
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
  npm run monday:agent-job -- --action update --role Reporter --item-id 123 --status Done --human-needed no --notes "Proof attached."
`);
}
