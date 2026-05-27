import { NextRequest, NextResponse } from "next/server";
import { getClientHubProfile } from "@/lib/client-profile-store";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import type { ReviewSmsCompliancePacket } from "@/lib/review-automation";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";
import { cleanClientSlug } from "@/lib/review-send-candidates";
import { buildSmsChecklist, getSmsReadiness } from "@/lib/review-sms-readiness";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const clientSlug = cleanClientSlug(req.nextUrl.searchParams.get("client"));
  const result = await getSmsReadiness(clientSlug);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.storageConfigured, error: result.error },
      { status: result.storageConfigured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    ready: result.ready,
    latest: result.latest,
    checklist: result.checklist,
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

  const brandStatus = enumFrom(body.brandStatus, ["not_started", "drafting", "submitted", "approved", "rejected"], "not_started");
  const campaignStatus = enumFrom(body.campaignStatus, ["not_started", "drafting", "submitted", "approved", "rejected"], "not_started");
  const optInStatus = enumFrom(body.optInStatus, ["missing", "drafted", "approved"], "missing");
  const stopHandlingStatus = enumFrom(body.stopHandlingStatus, ["missing", "planned", "ready"], "missing");
  const sampleMessageStatus = enumFrom(body.sampleMessageStatus, ["missing", "drafted", "approved"], "missing");
  const liveSendingAllowed =
    brandStatus === "approved" &&
    campaignStatus === "approved" &&
    optInStatus === "approved" &&
    stopHandlingStatus === "ready" &&
    sampleMessageStatus === "approved";

  const packet = {
    clientSlug: client.slug,
    clientName: client.businessName,
    provider: enumFrom(body.provider, ["twilio", "manual", "unknown"], "twilio"),
    brandStatus,
    campaignStatus,
    optInStatus,
    stopHandlingStatus,
    sampleMessageStatus,
    liveSendingAllowed,
    notes: stringFrom(body.notes).slice(0, 500),
    timestamp: new Date().toISOString(),
  } satisfies ReviewSmsCompliancePacket;

  if (body.dryRun !== false) {
    return NextResponse.json({ ok: true, dryRun: true, packet, checklist: buildSmsChecklist(packet) });
  }

  const save = await saveReviewAutomationEvent("sms_compliance_update", packet);
  if (!save.ok) {
    return NextResponse.json({ ok: false, storageConfigured: save.configured, error: save.error }, { status: save.configured ? 502 : 503 });
  }

  return NextResponse.json({ ok: true, dryRun: false, id: save.id, packet, checklist: buildSmsChecklist(packet) });
}

function stringFrom(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function enumFrom<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}
