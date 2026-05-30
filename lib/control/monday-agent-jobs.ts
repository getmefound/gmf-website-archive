const MONDAY_API_URL = "https://api.monday.com/v2";
const DEFAULT_BOARD_NAME = "Agents Jobs";

type MondayColumn = {
  id: string;
  title: string;
};

type MondayItem = {
  id: string;
  name: string;
  group?: { title?: string | null } | null;
  column_values: Array<{
    id: string;
    text?: string | null;
    value?: string | null;
    type?: string | null;
  }>;
};

type MondayBoard = {
  id: string;
  name: string;
  columns: MondayColumn[];
  items_page?: {
    items?: MondayItem[];
  } | null;
};

export type MondayAgentJobRow = {
  id: string;
  name: string;
  group: string;
  status: string;
  humanNeeded: string;
  agentOwner: string;
  reviewer: string;
  nextOwner: string;
  waitingState: string;
  runtimeState: string;
  handoffAck: string;
  ackAt: string;
  expectedReceive: string;
  escalateAt: string;
  unlockProof: string;
  nextAction: string;
  notes: string;
  proofText: string;
};

export type MondayAgentJobsOverview = {
  ok: boolean;
  boardId?: string;
  boardName: string;
  boardUrl?: string;
  error?: string;
  totals: {
    total: number;
    started: number;
    inProgress: number;
    review: number;
    trueWaiting: number;
    humanNeeded: number;
    completed: number;
    needsRescue: number;
  };
  allRows: MondayAgentJobRow[];
  activeRows: MondayAgentJobRow[];
  humanRows: MondayAgentJobRow[];
  reviewRows: MondayAgentJobRow[];
  waitingRows: MondayAgentJobRow[];
  completedRows: MondayAgentJobRow[];
  rescueRows: MondayAgentJobRow[];
};

export async function getMondayAgentJobsOverview(): Promise<MondayAgentJobsOverview> {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  if (!token) return emptyOverview("MONDAY_API_TOKEN is not set.");

  try {
    const board = await getAgentJobsBoard(token);
    if (!board) return emptyOverview("Monday Agents Jobs board was not found.");

    const rows = (board.items_page?.items ?? []).map((item) => toJobRow(item, board.columns));
    const completedRows = rows.filter(isCompleted);
    const humanRows = rows.filter(isHumanNeeded);
    const reviewRows = rows.filter(isReview);
    const waitingRows = rows.filter((row) => isTrueWaiting(row) && !isCompleted(row));
    const rescueRows = rows.filter(isNeedsRescue);
    const activeRows = rows.filter((row) => isActive(row) && !isCompleted(row));
    const startedRows = rows.filter((row) => hasStarted(row) && !isCompleted(row));

    return {
      ok: true,
      boardId: board.id,
      boardName: board.name,
      boardUrl: `https://monday.com/boards/${board.id}`,
      totals: {
        total: rows.length,
        started: startedRows.length,
        inProgress: activeRows.length,
        review: reviewRows.length,
        trueWaiting: waitingRows.length,
        humanNeeded: humanRows.length,
        completed: completedRows.length,
        needsRescue: rescueRows.length,
      },
      allRows: rows,
      activeRows: activeRows.slice(0, 6),
      humanRows: humanRows.slice(0, 8),
      reviewRows: reviewRows.slice(0, 4),
      waitingRows: waitingRows.slice(0, 4),
      completedRows: completedRows.slice(0, 5),
      rescueRows: rescueRows.slice(0, 4),
    };
  } catch (error) {
    return emptyOverview(error instanceof Error ? error.message : "Monday summary failed.");
  }
}

async function getAgentJobsBoard(token: string): Promise<MondayBoard | null> {
  const boardId = process.env.MONDAY_AGENT_JOBS_BOARD_ID?.trim();
  if (boardId) return getBoardDetail(token, boardId);

  const boardName = process.env.MONDAY_AGENT_JOBS_BOARD_NAME?.trim() || DEFAULT_BOARD_NAME;
  const data = await monday<{ boards?: Array<{ id: string; name: string; state?: string }> }>(
    token,
    "query { boards(limit: 500) { id name state } }",
  );
  const board = (data.boards ?? []).find((candidate) => candidate.state === "active" && same(candidate.name, boardName));
  return board ? getBoardDetail(token, board.id) : null;
}

async function getBoardDetail(token: string, boardId: string): Promise<MondayBoard | null> {
  const data = await monday<{ boards?: MondayBoard[] }>(
    token,
    `query ($ids: [ID!]) {
      boards(ids: $ids) {
        id
        name
        columns { id title }
        items_page(limit: 100) {
          items {
            id
            name
            group { title }
            column_values { id text value type }
          }
        }
      }
    }`,
    { ids: [String(boardId)] },
  );
  return data.boards?.[0] ?? null;
}

async function monday<T>(token: string, query: string, variables = {}): Promise<T> {
  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2025-04",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok || body.errors) {
    throw new Error(`Monday API failed: ${response.status}`);
  }
  return body.data as T;
}

function toJobRow(item: MondayItem, columns: MondayColumn[]): MondayAgentJobRow {
  const valuesById = new Map(item.column_values.map((value) => [value.id, readColumnText(value)]));
  const idByTitle = new Map(columns.map((column) => [normalize(column.title), column.id]));
  const value = (title: string) => valuesById.get(idByTitle.get(normalize(title)) ?? "") ?? "";

  return {
    id: item.id,
    name: item.name,
    group: item.group?.title ?? "",
    status: value("Status"),
    humanNeeded: value("Human Needed"),
    agentOwner: value("Agent Owner"),
    reviewer: value("Reviewer"),
    nextOwner: value("Next Owner"),
    waitingState: value("Waiting State"),
    runtimeState: value("Runtime State"),
    handoffAck: value("Handoff Ack"),
    ackAt: value("Ack At"),
    expectedReceive: value("Expected Receive"),
    escalateAt: value("Escalate At"),
    unlockProof: value("Unlock Proof"),
    nextAction: value("Next Action"),
    notes: value("Notes"),
    proofText: value("Proof Link"),
  };
}

function isCompleted(row: MondayAgentJobRow) {
  return same(row.status, "Done") || same(row.group, "Done");
}

function isHumanNeeded(row: MondayAgentJobRow) {
  return same(row.humanNeeded, "Yes") || same(row.status, "Human Needed") || same(row.group, "Human Needed");
}

function isReview(row: MondayAgentJobRow) {
  return same(row.status, "Ready For Review") || same(row.runtimeState, "Manual Audit");
}

function isTrueWaiting(row: MondayAgentJobRow) {
  const combined = `${row.status} ${row.waitingState}`.toLowerCase();
  return /\bwaiting on (client|owner|vendor|platform|human approval)\b/.test(combined) || /\bscheduled|timer\b/.test(combined);
}

function isActive(row: MondayAgentJobRow) {
  return (
    same(row.status, "Agent Working") ||
    same(row.status, "Ready For Review") ||
    same(row.runtimeState, "Access Investigation") ||
    same(row.runtimeState, "Script Runnable") ||
    same(row.runtimeState, "Scheduled Worker") ||
    same(row.runtimeState, "Manual Audit")
  );
}

function hasStarted(row: MondayAgentJobRow) {
  return Boolean(row.status || row.agentOwner || row.nextAction || row.proofText);
}

function isNeedsRescue(row: MondayAgentJobRow) {
  if (!hasStarted(row) && !isCompleted(row)) return true;
  const combined = `${row.status} ${row.waitingState} ${row.runtimeState}`.toLowerCase();
  return /waiting on agent|waiting on proof review|queue control|needs dispatcher|no_ack|no heartbeat/.test(combined);
}

function emptyOverview(error: string): MondayAgentJobsOverview {
  return {
    ok: false,
    boardName: DEFAULT_BOARD_NAME,
    error,
    totals: {
      total: 0,
      started: 0,
      inProgress: 0,
      review: 0,
      trueWaiting: 0,
      humanNeeded: 0,
      completed: 0,
      needsRescue: 0,
    },
    allRows: [],
    activeRows: [],
    humanRows: [],
    reviewRows: [],
    waitingRows: [],
    completedRows: [],
    rescueRows: [],
  };
}

function same(a: string, b: string) {
  return normalize(a) === normalize(b);
}

function normalize(value: string) {
  return String(value ?? "").trim().toLowerCase();
}

function readColumnText(columnValue: MondayItem["column_values"][number]) {
  if (columnValue.type === "long_text" && columnValue.value) {
    try {
      const value = JSON.parse(columnValue.value) as { text?: unknown };
      if (typeof value.text === "string") return value.text;
    } catch {
      // Fall back to monday's text representation below.
    }
  }
  return columnValue.text ?? "";
}
