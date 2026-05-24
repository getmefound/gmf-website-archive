import type { ReviewIntegrationEventPacket } from "@/lib/review-automation";
import { cleanText } from "@/lib/review-automation";
import { listReviewAutomationRecords, type ReviewAutomationRecord } from "@/lib/review-automation-store";

export type IntegrationEventDecision = {
  eventKey: string;
  status: ReviewIntegrationEventPacket["status"];
  holdReason: string;
  holdReasons: string[];
  duplicate: boolean;
  duplicateOf?: string;
  sendCandidateEligible: boolean;
};

export type IntegrationEventHealth = {
  total: number;
  received: number;
  held: number;
  dryRun: number;
  duplicates: number;
  sendCandidateEligible: number;
  missingEmail: number;
  latestAt: string;
  stale: boolean;
  systems: Array<{ systemName: string; count: number; latestAt: string }>;
};

export async function assessIntegrationEvent(input: {
  clientSlug: string;
  systemName: string;
  externalEventId: string;
  customerEmail: string;
  occurredAt: string;
  dryRun: boolean;
}) {
  const systemName = cleanSystemName(input.systemName);
  const externalEventId = cleanText(input.externalEventId, 160);
  const eventKey = buildIntegrationEventKey(input.clientSlug, systemName, externalEventId);
  const holdReasons: string[] = [];

  if (!externalEventId) holdReasons.push("missing_external_event_id");
  if (!input.customerEmail.trim()) holdReasons.push("missing_customer_email");
  if (isFarFutureDate(input.occurredAt)) holdReasons.push("future_occurred_at");

  const duplicateRecord = externalEventId
    ? await findDuplicateIntegrationEvent({
        clientSlug: input.clientSlug,
        systemName,
        externalEventId,
      })
    : null;

  if (duplicateRecord) holdReasons.push("duplicate_external_event_id");

  const duplicate = Boolean(duplicateRecord);
  const status = input.dryRun ? "dry_run" : holdReasons.length ? "held" : "received";
  const sendCandidateEligible = !input.dryRun && holdReasons.length === 0;

  return {
    eventKey,
    status,
    holdReason: holdReasons.join(","),
    holdReasons,
    duplicate,
    duplicateOf: duplicateRecord?.id,
    sendCandidateEligible,
  } satisfies IntegrationEventDecision;
}

export async function findDuplicateIntegrationEvent(input: {
  clientSlug: string;
  systemName: string;
  externalEventId: string;
}) {
  const externalEventId = cleanText(input.externalEventId, 160);
  if (!externalEventId) return null;

  const result = await listReviewAutomationRecords({ clientSlug: input.clientSlug, limit: 500 });
  if (!result.ok) return null;

  const eventKey = buildIntegrationEventKey(input.clientSlug, input.systemName, externalEventId);
  return (
    result.records.find((record) => {
      if (record.eventType !== "integration_event") return false;
      const packet = record.payload as ReviewIntegrationEventPacket;
      if (packet.status === "dry_run") return false;
      return (packet.eventKey || buildIntegrationEventKey(record.clientSlug, packet.systemName, packet.externalEventId)) === eventKey;
    }) ?? null
  );
}

export function summarizeIntegrationEventHealth(records: ReviewAutomationRecord[], staleAfterHours = 48) {
  const packets = records
    .filter((record) => record.eventType === "integration_event")
    .map((record) => record.payload as ReviewIntegrationEventPacket);
  const latestAt = packets
    .map((packet) => packet.timestamp)
    .filter(Boolean)
    .sort()
    .at(-1) ?? "";
  const systemMap = new Map<string, { systemName: string; count: number; latestAt: string }>();

  for (const packet of packets) {
    const key = cleanSystemName(packet.systemName).toLowerCase();
    const current = systemMap.get(key) ?? { systemName: packet.systemName || "Unknown POS/CRM", count: 0, latestAt: "" };
    current.count += 1;
    if (!current.latestAt || packet.timestamp > current.latestAt) current.latestAt = packet.timestamp;
    systemMap.set(key, current);
  }

  return {
    total: packets.length,
    received: packets.filter((packet) => packet.status === "received").length,
    held: packets.filter((packet) => packet.status === "held").length,
    dryRun: packets.filter((packet) => packet.status === "dry_run").length,
    duplicates: packets.filter((packet) => packet.duplicate || packet.holdReason.includes("duplicate_external_event_id")).length,
    sendCandidateEligible: packets.filter((packet) => packet.sendCandidateEligible).length,
    missingEmail: packets.filter((packet) => packet.holdReason.includes("missing_customer_email")).length,
    latestAt,
    stale: latestAt ? Date.now() - Date.parse(latestAt) > staleAfterHours * 60 * 60 * 1000 : true,
    systems: [...systemMap.values()].sort((left, right) => right.latestAt.localeCompare(left.latestAt)),
  } satisfies IntegrationEventHealth;
}

export function buildIntegrationEventKey(clientSlug: string, systemName: string, externalEventId: string) {
  const cleanClient = cleanText(clientSlug, 120).toLowerCase();
  const cleanSystem = cleanSystemName(systemName).toLowerCase();
  const cleanEvent = cleanText(externalEventId, 160).toLowerCase();
  return `${cleanClient}:${cleanSystem}:${cleanEvent}`;
}

function cleanSystemName(systemName: string) {
  return cleanText(systemName, 120) || "Unknown POS/CRM";
}

function isFarFutureDate(value: string) {
  if (!value) return false;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;
  return timestamp - Date.now() > 24 * 60 * 60 * 1000;
}
