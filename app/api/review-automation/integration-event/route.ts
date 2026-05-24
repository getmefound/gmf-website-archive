import { NextRequest, NextResponse } from "next/server";
import { getClientHubProfile } from "@/lib/client-profile-store";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import type { ReviewIntegrationEventPacket } from "@/lib/review-automation";
import { assessIntegrationEvent, summarizeIntegrationEventHealth } from "@/lib/review-integration-events";
import { listReviewAutomationRecords, saveReviewAutomationEvent } from "@/lib/review-automation-store";
import { cleanClientSlug } from "@/lib/review-send-candidates";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const clientSlug = cleanClientSlug(req.nextUrl.searchParams.get("client") ?? "");
  if (!clientSlug) return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });

  const result = await listReviewAutomationRecords({ clientSlug, limit: 500 });
  if (!result.ok) {
    return NextResponse.json({ ok: false, storageConfigured: result.configured, error: result.error }, { status: result.configured ? 502 : 503 });
  }

  return NextResponse.json({
    ok: true,
    clientSlug,
    health: summarizeIntegrationEventHealth(result.records),
  });
}

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });

  const clientSlug = cleanClientSlug(stringFrom(body.clientSlug));
  const client = await getClientHubProfile(clientSlug);
  if (!client) return NextResponse.json({ ok: false, error: "Unknown client." }, { status: 404 });

  const customerEmail = stringFrom(body.customerEmail).trim().toLowerCase();
  const externalEventId = stringFrom(body.externalEventId).slice(0, 160);
  const systemName = stringFrom(body.systemName).slice(0, 120) || "Unknown POS/CRM";
  const occurredAt = stringFrom(body.occurredAt) || new Date().toISOString();
  const dryRun = body.dryRun !== false;
  const decision = await assessIntegrationEvent({
    clientSlug: client.slug,
    systemName,
    externalEventId,
    customerEmail,
    occurredAt,
    dryRun,
  });

  const packet = {
    clientSlug: client.slug,
    clientName: client.businessName,
    systemName,
    connectionLevel: stringFrom(body.connectionLevel).slice(0, 80) || "webhook_or_import",
    eventKey: decision.eventKey,
    externalEventId,
    eventType: stringFrom(body.eventType).slice(0, 120) || "completed_job",
    customerName: stringFrom(body.customerName).slice(0, 160),
    customerEmail,
    customerPhone: stringFrom(body.customerPhone).slice(0, 80),
    occurredAt,
    status: decision.status,
    holdReason: decision.holdReason,
    duplicate: decision.duplicate,
    duplicateOf: decision.duplicateOf,
    sendCandidateEligible: decision.sendCandidateEligible,
    metadata: objectFrom(body.metadata),
    timestamp: new Date().toISOString(),
  } satisfies ReviewIntegrationEventPacket;

  if (dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, packet, wouldStore: decision.holdReasons.length === 0 });
  }

  if (decision.duplicate) {
    return NextResponse.json({ ok: true, dryRun: false, duplicate: true, skipped: true, duplicateOf: decision.duplicateOf, packet });
  }

  const save = await saveReviewAutomationEvent("integration_event", packet);
  if (!save.ok) {
    return NextResponse.json({ ok: false, storageConfigured: save.configured, error: save.error }, { status: save.configured ? 502 : 503 });
  }

  return NextResponse.json({ ok: true, dryRun: false, id: save.id, packet });
}

function stringFrom(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function objectFrom(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
