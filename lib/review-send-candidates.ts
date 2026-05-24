import { getClientHubProfile, getClientIntegrationSettings } from "@/lib/client-profile-store";
import type { ReviewCustomerPacket, ReviewIntegrationEventPacket, ReviewSendLogPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords, listReviewSuppressions, type ReviewAutomationRecord } from "@/lib/review-automation-store";

export type ReviewSendCandidate = {
  name: string;
  email: string;
  phone: string;
  jobDate: string;
  notes: string;
  source?: "customer_upload" | "integration_event";
  sourceId?: string;
  eligibleAt?: string;
};

export type ReviewSendCandidateResult =
  | {
      ok: true;
      clientSlug: string;
      clientName: string;
      googleReviewUrl: string;
      sourceUploadAt: string;
      totalCandidates: number;
      candidates: ReviewSendCandidate[];
    }
  | { ok: false; status: number; storageConfigured?: boolean; blocked?: boolean; blocker?: string; error: string };

export async function getReviewSendCandidates(input: {
  clientSlug: string;
  limit?: number;
}): Promise<ReviewSendCandidateResult> {
  const clientSlug = cleanClientSlug(input.clientSlug);
  const limit = Math.min(500, Math.max(1, Math.floor(input.limit ?? 300)));
  if (!clientSlug) {
    return { ok: false, status: 400, error: "Missing client." };
  }

  const client = await getClientHubProfile(clientSlug);
  if (!client) {
    return { ok: false, status: 404, error: "Unknown client." };
  }
  if (!client.googleReviewUrl) {
    return {
      ok: false,
      status: 409,
      blocked: true,
      blocker: "google_review_link_missing",
      error: "Add the verified Google review link before building a send batch.",
    };
  }

  const result = await listReviewAutomationRecords({ clientSlug, limit });
  if (!result.ok) {
    return {
      ok: false,
      status: result.configured ? 502 : 503,
      storageConfigured: result.configured,
      error: result.error,
    };
  }

  const sentOrTerminalEmails = new Set(
    result.records
      .filter((record) => record.eventType === "send_log")
      .map((record) => record.payload as ReviewSendLogPacket)
      .filter((log) => ["sent", "bounced", "followup_sent"].includes(log.status))
      .map((log) => log.customerEmail.toLowerCase()),
  );
  const suppressedEmailsResult = await listReviewSuppressions(clientSlug);
  const suppressedEmails = new Set(suppressedEmailsResult.ok ? suppressedEmailsResult.emails.map((email) => email.toLowerCase()) : []);

  const latestUpload = result.records.find((record) => record.eventType === "customer_upload")?.payload as
    | ReviewCustomerPacket
    | undefined;
  const uploadCandidates =
    latestUpload?.rows
      .filter((row) => !row.suppressed)
      .filter((row) => row.email && !sentOrTerminalEmails.has(row.email.toLowerCase()))
      .filter((row) => !suppressedEmails.has(row.email.toLowerCase()))
      .map((row) => ({
        name: row.name,
        email: row.email,
        phone: row.phone,
        jobDate: row.jobDate,
        notes: row.notes,
        source: "customer_upload" as const,
        sourceId: latestUpload.timestamp,
      })) ?? [];
  const integrationCandidates = await buildIntegrationCandidates({
    clientSlug,
    records: result.records,
    sentOrTerminalEmails,
    suppressedEmails,
  });
  const allCandidates = dedupeCandidates([...uploadCandidates, ...integrationCandidates]);
  const candidates = allCandidates.slice(0, limit);
  const latestIntegrationAt = integrationCandidates.map((candidate) => candidate.sourceId ?? "").sort().at(-1) ?? "";

  return {
    ok: true,
    clientSlug,
    clientName: client.businessName,
    googleReviewUrl: client.googleReviewUrl,
    sourceUploadAt: [latestUpload?.timestamp ?? "", latestIntegrationAt].sort().at(-1) ?? "",
    totalCandidates: allCandidates.length,
    candidates,
  };
}

export function cleanClientSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/[^a-z0-9-]/gi, "")
    .slice(0, 80)
    .toLowerCase();
}

async function buildIntegrationCandidates(input: {
  clientSlug: string;
  records: ReviewAutomationRecord[];
  sentOrTerminalEmails: Set<string>;
  suppressedEmails: Set<string>;
}) {
  const settingsBySystem = new Map<string, Awaited<ReturnType<typeof getClientIntegrationSettings>>>();
  const candidates: ReviewSendCandidate[] = [];

  for (const record of input.records) {
    if (record.eventType !== "integration_event") continue;
    const packet = record.payload as ReviewIntegrationEventPacket;
    const email = packet.customerEmail.trim().toLowerCase();
    if (!packet.sendCandidateEligible || packet.status !== "received") continue;
    if (!email || input.sentOrTerminalEmails.has(email) || input.suppressedEmails.has(email)) continue;

    const settingsKey = packet.systemName.trim().toLowerCase();
    let settings = settingsBySystem.get(settingsKey);
    if (!settings) {
      settings = await getClientIntegrationSettings({ clientSlug: input.clientSlug, systemName: packet.systemName });
      settingsBySystem.set(settingsKey, settings);
    }

    const eligibleAt = addDays(packet.occurredAt || packet.timestamp, settings.sendDelayDays);
    if (!eligibleAt || Date.parse(eligibleAt) > Date.now()) continue;

    candidates.push({
      name: packet.customerName,
      email,
      phone: packet.customerPhone,
      jobDate: packet.occurredAt,
      notes: `${packet.systemName} ${packet.eventType}`.trim(),
      source: "integration_event",
      sourceId: packet.timestamp,
      eligibleAt,
    });
  }

  return candidates;
}

function dedupeCandidates(candidates: ReviewSendCandidate[]) {
  const seenEmails = new Set<string>();
  return candidates.filter((candidate) => {
    const email = candidate.email.toLowerCase();
    if (!email || seenEmails.has(email)) return false;
    seenEmails.add(email);
    return true;
  });
}

function addDays(value: string, days: number) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "";
  return new Date(timestamp + days * 24 * 60 * 60 * 1000).toISOString();
}
