import type {
  ReviewAutomationEventType,
  ReviewAutomationPacket,
  ReviewCustomerPacket,
  ReviewFeedbackPacket,
  ReviewIntegrationEventPacket,
  ClientSetupJobPacket,
  ReviewReplyDraftPacket,
  ReviewSendLogPacket,
  ReviewSmsCompliancePacket,
  ReviewSuppressionPacket,
  ReportFlowStatusPacket,
} from "@/lib/review-automation";
import { cleanEnvValue } from "@/lib/env";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

export type ReviewAutomationRecord = {
  id: string;
  eventType: ReviewAutomationEventType;
  clientSlug: string;
  clientName: string;
  createdAt: string;
  summary: Record<string, unknown>;
  payload: ReviewAutomationPacket;
};

type StorageResult =
  | { ok: true; configured: true; id: string; status?: number }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; id: string; status?: number; error: string };

type ReviewAutomationSummaryResult =
  | {
      ok: true;
      configured: true;
      index: string;
      records: Array<Omit<ReviewAutomationRecord, "payload">>;
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string; status?: number };

type ReviewAutomationRecordResult =
  | {
      ok: true;
      configured: true;
      index: string;
      records: ReviewAutomationRecord[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string; status?: number };

const DEFAULT_TTL_DAYS = 90;
const EVENTS_TABLE = "review_automation_events";
const SUPPRESSIONS_TABLE = "review_automation_suppressions";

type SupabaseReviewEventRow = {
  id: string;
  created_at: string;
  event_type: ReviewAutomationEventType;
  client_slug: string;
  client_name: string;
  summary: Record<string, unknown>;
  payload: ReviewAutomationPacket;
};

type SupabaseSuppressionRow = {
  customer_email: string;
};

export async function saveReviewAutomationEvent(
  eventType: ReviewAutomationEventType,
  payload: ReviewAutomationPacket,
): Promise<StorageResult> {
  if (hasSupabaseConfig()) {
    return saveReviewAutomationEventToSupabase(eventType, payload);
  }

  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  const id = `${Date.now()}-${crypto.randomUUID()}`;

  if (!url || !token) {
    return { ok: false, configured: false, error: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set." };
  }

  const record = buildRecord({ id, eventType, payload });
  const ttlSec = storageTtlDays() * 24 * 60 * 60;
  const key = eventKey(id);
  const clientIndex = clientIndexKey(record.clientSlug);

  const commands = [
    ["SET", key, JSON.stringify(record), "EX", String(ttlSec)],
    ["LPUSH", clientIndex, id],
    ["LTRIM", clientIndex, "0", "499"],
    ["LPUSH", globalIndexKey(), id],
    ["LTRIM", globalIndexKey(), "0", "999"],
  ];

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown storage error.");
  });

  if (response instanceof Error) {
    return { ok: false, configured: true, id, error: response.message };
  }
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      id,
      status: response.status,
      error: (await response.text().catch(() => "")).slice(0, 300),
    };
  }

  return { ok: true, configured: true, id, status: response.status };
}

export async function saveReviewSuppression(packet: ReviewSuppressionPacket): Promise<StorageResult> {
  if (hasSupabaseConfig()) {
    const eventResult = await saveReviewAutomationEventToSupabase("suppression_update", packet);
    const suppressionResult = await supabaseRest<Array<{ id: string }>>(SUPPRESSIONS_TABLE, {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: {
        client_slug: packet.clientSlug,
        customer_email: packet.customerEmail.toLowerCase(),
        reason: packet.reason || null,
        source: packet.source || null,
      },
    });

    if (!suppressionResult.ok) {
      return {
        ok: false,
        configured: true,
        id: eventResult.ok ? eventResult.id : `${Date.now()}-${crypto.randomUUID()}`,
        status: suppressionResult.status,
        error: suppressionResult.error,
      };
    }

    return eventResult;
  }

  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  const id = `${Date.now()}-${crypto.randomUUID()}`;

  if (!url || !token) {
    return { ok: false, configured: false, error: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set." };
  }

  const record = buildRecord({ id, eventType: "suppression_update", payload: packet });
  const ttlSec = storageTtlDays() * 24 * 60 * 60;
  const key = eventKey(id);
  const clientIndex = clientIndexKey(record.clientSlug);

  const result = await runRedisPipeline<unknown[]>(url, token, [
    ["SET", key, JSON.stringify(record), "EX", String(ttlSec)],
    ["LPUSH", clientIndex, id],
    ["LTRIM", clientIndex, "0", "499"],
    ["LPUSH", globalIndexKey(), id],
    ["LTRIM", globalIndexKey(), "0", "999"],
    ["SADD", suppressionKey(packet.clientSlug), packet.customerEmail],
  ]);

  if (!result.ok) return { ok: false, configured: true, id, status: result.status, error: result.error };
  return { ok: true, configured: true, id, status: result.status };
}

export async function listReviewSuppressions(clientSlug: string) {
  if (hasSupabaseConfig()) {
    const query = new URLSearchParams({
      select: "customer_email",
      client_slug: `eq.${clientSlug}`,
      order: "created_at.desc",
      limit: "1000",
    });
    const result = await supabaseRest<SupabaseSuppressionRow[]>(SUPPRESSIONS_TABLE, { query: query.toString() });
    if (!result.ok) {
      return { ok: false as const, configured: true as const, emails: [], status: result.status, error: result.error };
    }

    return {
      ok: true as const,
      configured: true as const,
      emails: result.data.map((row) => String(row.customer_email).toLowerCase()),
    };
  }

  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!url || !token) {
    return { ok: false as const, configured: false as const, emails: [], error: "Storage is not configured." };
  }

  const result = await runRedisPipeline<string[][]>(url, token, [["SMEMBERS", suppressionKey(clientSlug)]]);
  if (!result.ok) {
    return { ok: false as const, configured: true as const, emails: [], status: result.status, error: result.error };
  }

  return {
    ok: true as const,
    configured: true as const,
    emails: Array.isArray(result.values[0]) ? result.values[0].map((email) => String(email).toLowerCase()) : [],
  };
}

export async function listReviewAutomationSummaries(input: {
  clientSlug?: string;
  limit?: number;
}): Promise<ReviewAutomationSummaryResult> {
  const result = await listReviewAutomationRecords(input);
  if (!result.ok) return result;

  return {
    ok: true,
    configured: true,
    index: result.index,
    records: result.records.map(({ payload, ...summary }) => {
      void payload;
      return summary;
    }),
  };
}

export async function listReviewAutomationRecords(input: {
  clientSlug?: string;
  limit?: number;
}): Promise<ReviewAutomationRecordResult> {
  if (hasSupabaseConfig()) {
    const limit = Math.min(500, Math.max(1, Math.floor(input.limit ?? 20)));
    const query = new URLSearchParams({
      select: "id,created_at,event_type,client_slug,client_name,summary,payload",
      order: "created_at.desc",
      limit: String(limit),
    });
    if (input.clientSlug) query.set("client_slug", `eq.${input.clientSlug}`);

    const result = await supabaseRest<SupabaseReviewEventRow[]>(EVENTS_TABLE, { query: query.toString() });
    if (!result.ok) {
      return { ok: false, configured: true, status: result.status, error: result.error };
    }

    return {
      ok: true,
      configured: true,
      index: input.clientSlug ? `supabase:${EVENTS_TABLE}:${input.clientSlug}` : `supabase:${EVENTS_TABLE}:all`,
      records: result.data.map(recordFromSupabaseRow),
    };
  }

  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!url || !token) {
    return { ok: false, configured: false, error: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set." };
  }

  const limit = Math.min(500, Math.max(1, Math.floor(input.limit ?? 20)));
  const index = input.clientSlug ? clientIndexKey(input.clientSlug) : globalIndexKey();
  const idsResult = await runRedisPipeline<string[][]>(url, token, [["LRANGE", index, "0", String(limit - 1)]]);

  if (!idsResult.ok) return { ok: false, configured: true, status: idsResult.status, error: idsResult.error };

  const ids = Array.isArray(idsResult.values[0]) ? idsResult.values[0] : [];
  if (!ids.length) {
    return { ok: true, configured: true, index, records: [] };
  }

  const recordResult = await runRedisPipeline<string[]>(
    url,
    token,
    ids.map((id) => ["GET", eventKey(id)]),
  );
  if (!recordResult.ok) return { ok: false, configured: true, status: recordResult.status, error: recordResult.error };

  const records = recordResult.values
    .map((value) => parseRecord(value))
    .filter((record): record is ReviewAutomationRecord => Boolean(record));

  return { ok: true, configured: true, index, records };
}

export async function checkReviewAutomationStorage() {
  if (hasSupabaseConfig()) {
    const id = crypto.randomUUID();
    const payload = {
      clientSlug: "storage-health",
      clientName: "Storage Health",
      timestamp: new Date().toISOString(),
      submittedBy: "system",
      submittedEmail: "system@getmefound.ai",
      source: "storage-health",
      summary: { totalRows: 0, sendableRows: 0, suppressedRows: 0, missingEmailRows: 0, duplicateEmailRows: 0 },
      rows: [],
    } satisfies ReviewCustomerPacket;
    const save = await supabaseRest<SupabaseReviewEventRow[]>(EVENTS_TABLE, {
      method: "POST",
      prefer: "return=representation",
      body: {
        id,
        event_type: "customer_upload",
        client_slug: payload.clientSlug,
        client_name: payload.clientName,
        created_at: payload.timestamp,
        summary: summarizePayload("customer_upload", payload),
        payload,
      },
    });
    if (!save.ok) return { ok: false as const, configured: true as const, provider: "supabase", stage: "write", status: save.status, error: save.error };

    const query = new URLSearchParams({ select: "id", id: `eq.${id}`, limit: "1" });
    const read = await supabaseRest<Array<{ id: string }>>(EVENTS_TABLE, { query: query.toString() });
    if (!read.ok || read.data[0]?.id !== id) {
      return {
        ok: false as const,
        configured: true as const,
        provider: "supabase",
        stage: "read",
        status: read.status,
        error: read.ok ? "Health record was not readable." : read.error,
      };
    }

    const cleanup = await supabaseRest<null>(EVENTS_TABLE, { method: "DELETE", query: `id=eq.${id}` });
    return {
      ok: cleanup.ok,
      configured: true as const,
      provider: "supabase",
      stage: cleanup.ok ? "ready" : "cleanup",
      status: cleanup.status,
      error: cleanup.ok ? undefined : cleanup.error,
    };
  }

  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!url || !token) {
    return { ok: false as const, configured: false as const, provider: "none", stage: "env", error: "No review automation storage is configured." };
  }

  const key = `review-automation:health:${crypto.randomUUID()}`;
  const value = new Date().toISOString();
  const write = await runRedisPipeline(url, token, [["SET", key, value, "EX", "60"]]);
  if (!write.ok) return { ok: false as const, configured: true as const, provider: "upstash", stage: "write", status: write.status, error: write.error };

  const read = await runRedisPipeline<unknown[]>(url, token, [["GET", key]]);
  const cleanup = await runRedisPipeline(url, token, [["DEL", key]]);
  const readValue = read.ok && Array.isArray(read.values) ? read.values[0] : null;

  return {
    ok: read.ok && readValue === value,
    configured: true as const,
    provider: "upstash",
    stage: read.ok && readValue === value ? "ready" : "read",
    status: read.status ?? write.status ?? cleanup.status,
    error: read.ok && readValue === value ? undefined : "Health record was not readable.",
  };
}

async function saveReviewAutomationEventToSupabase(
  eventType: ReviewAutomationEventType,
  payload: ReviewAutomationPacket,
): Promise<StorageResult> {
  const id = crypto.randomUUID();
  const record = buildRecord({ id, eventType, payload });
  const result = await supabaseRest<SupabaseReviewEventRow[]>(EVENTS_TABLE, {
    method: "POST",
    prefer: "return=representation",
    body: {
      id,
      event_type: eventType,
      client_slug: record.clientSlug,
      client_name: record.clientName,
      created_at: record.createdAt,
      summary: record.summary,
      payload: record.payload,
    },
  });

  if (!result.ok) return { ok: false, configured: true, id, status: result.status, error: result.error };
  return { ok: true, configured: true, id, status: result.status };
}

function recordFromSupabaseRow(row: SupabaseReviewEventRow): ReviewAutomationRecord {
  return {
    id: row.id,
    eventType: row.event_type,
    clientSlug: row.client_slug,
    clientName: row.client_name,
    createdAt: row.created_at,
    summary: row.summary ?? {},
    payload: row.payload,
  };
}

async function runRedisPipeline<T>(
  url: string,
  token: string,
  commands: string[][],
): Promise<{ ok: true; values: T; status: number } | { ok: false; error: string; status?: number }> {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown storage error.");
  });

  if (response instanceof Error) return { ok: false, error: response.message };
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: (await response.text().catch(() => "")).slice(0, 300),
    };
  }

  const json = (await response.json().catch(() => null)) as Array<{ result?: unknown; error?: string }> | null;
  if (!Array.isArray(json)) {
    return { ok: false, status: response.status, error: "Redis pipeline returned an unexpected response." };
  }

  const failed = json.find((item) => item?.error);
  if (failed?.error) {
    return { ok: false, status: response.status, error: failed.error };
  }

  return { ok: true, status: response.status, values: json.map((item) => item.result) as T };
}

function buildRecord({
  id,
  eventType,
  payload,
}: {
  id: string;
  eventType: ReviewAutomationEventType;
  payload: ReviewAutomationPacket;
}): ReviewAutomationRecord {
  return {
    id,
    eventType,
    clientSlug: payload.clientSlug,
    clientName: payload.clientName,
    createdAt: "timestamp" in payload ? payload.timestamp : new Date().toISOString(),
    summary: summarizePayload(eventType, payload),
    payload,
  };
}

function summarizePayload(eventType: ReviewAutomationEventType, payload: ReviewAutomationPacket) {
  if (eventType === "customer_upload") {
    const packet = payload as ReviewCustomerPacket;
    return {
      submittedBy: packet.submittedBy,
      submittedEmail: packet.submittedEmail,
      ...packet.summary,
    };
  }

  if (eventType === "private_feedback") {
    const packet = payload as ReviewFeedbackPacket;
    return {
      rating: packet.rating,
      shouldRouteToGoogle: packet.shouldRouteToGoogle,
      hasFeedback: Boolean(packet.feedback.trim()),
      hasCustomerEmail: Boolean(packet.customerEmail.trim()),
    };
  }

  if (eventType === "send_log") {
    return summarizeSendLog(payload as ReviewSendLogPacket);
  }

  if (eventType === "review_reply_draft") {
    const packet = payload as ReviewReplyDraftPacket;
    return {
      rating: packet.rating,
      reviewerName: packet.reviewerName,
      mode: packet.mode,
      status: packet.status,
      model: packet.model,
      riskLevel: packet.safety?.riskLevel ?? "unknown",
      autoPostEligible: Boolean(packet.safety?.autoPostEligible),
    };
  }

  if (eventType === "integration_event") {
    const packet = payload as ReviewIntegrationEventPacket;
    return {
      systemName: packet.systemName,
      externalEventId: packet.externalEventId,
      eventType: packet.eventType,
      customerEmail: maskEmail(packet.customerEmail),
      status: packet.status,
      holdReason: packet.holdReason,
      duplicate: Boolean(packet.duplicate),
      sendCandidateEligible: Boolean(packet.sendCandidateEligible),
    };
  }

  if (eventType === "sms_compliance_update") {
    const packet = payload as ReviewSmsCompliancePacket;
    return {
      provider: packet.provider,
      brandStatus: packet.brandStatus,
      campaignStatus: packet.campaignStatus,
      optInStatus: packet.optInStatus,
      stopHandlingStatus: packet.stopHandlingStatus,
      liveSendingAllowed: packet.liveSendingAllowed,
    };
  }

  if (eventType === "report_flow_status") {
    const packet = payload as ReportFlowStatusPacket;
    return {
      reportLane: packet.reportLane,
      reportType: packet.reportType,
      status: packet.status,
      runId: packet.runId,
      hasAuditUrl: Boolean(packet.auditUrl),
      hasHeatmapUrl: Boolean(packet.heatmapUrl),
      blocker: packet.blocker,
    };
  }

  if (eventType === "client_setup_update") {
    const packet = payload as ClientSetupJobPacket;
    return {
      jobId: packet.jobId,
      actor: packet.actor,
      stepKey: packet.stepKey,
      status: packet.status,
      hasBlocker: Boolean(packet.blocker),
      hasProof: Boolean(packet.proofUrl),
    };
  }

  const packet = payload as ReviewSuppressionPacket;
  return {
    customerEmail: maskEmail(packet.customerEmail),
    hasReason: Boolean(packet.reason.trim()),
    source: packet.source,
  };
}

function summarizeSendLog(payload: ReviewSendLogPacket) {
  return {
    customerEmail: maskEmail(payload.customerEmail),
    status: payload.status,
    provider: payload.provider,
    hasMessageId: Boolean(payload.messageId),
    hasDetail: Boolean(payload.detail),
  };
}

function parseRecord(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value) as ReviewAutomationRecord;
    if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

function storageTtlDays() {
  const value = Number(process.env.GMF_REVIEW_AUTOMATION_STORAGE_TTL_DAYS ?? process.env.AOH_REVIEW_AUTOMATION_STORAGE_TTL_DAYS);
  return Number.isFinite(value) && value > 0 ? Math.min(365, Math.floor(value)) : DEFAULT_TTL_DAYS;
}

function eventKey(id: string) {
  return `review-automation:event:${id}`;
}

function clientIndexKey(clientSlug: string) {
  return `review-automation:index:client:${clientSlug}`;
}

function globalIndexKey() {
  return "review-automation:index:all";
}

function suppressionKey(clientSlug: string) {
  return `review-automation:suppression:${clientSlug}`;
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "hidden";
  return `${name.slice(0, 2)}***@${domain}`;
}
