import type { ReviewSmsCompliancePacket } from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type SmsReadinessSnapshot = {
  ok: boolean;
  storageConfigured: boolean;
  ready: boolean;
  latest: ReviewSmsCompliancePacket | null;
  checklist: Array<{ label: string; done: boolean }>;
  error?: string;
};

export async function getSmsReadiness(clientSlug: string): Promise<SmsReadinessSnapshot> {
  const result = await listReviewAutomationRecords({ clientSlug, limit: 100 });
  if (!result.ok) {
    return {
      ok: false,
      storageConfigured: result.configured,
      ready: false,
      latest: null,
      checklist: buildSmsChecklist(null),
      error: result.error,
    };
  }

  const latest = result.records.find((record) => record.eventType === "sms_compliance_update")?.payload as
    | ReviewSmsCompliancePacket
    | undefined;

  return {
    ok: true,
    storageConfigured: true,
    ready: Boolean(latest?.liveSendingAllowed),
    latest: latest ?? null,
    checklist: buildSmsChecklist(latest),
  };
}

export function buildSmsChecklist(packet?: ReviewSmsCompliancePacket | null) {
  return [
    { label: "A2P brand approved", done: packet?.brandStatus === "approved" },
    { label: "A2P campaign approved", done: packet?.campaignStatus === "approved" },
    { label: "Opt-in language approved", done: packet?.optInStatus === "approved" },
    { label: "STOP handling ready", done: packet?.stopHandlingStatus === "ready" },
    { label: "Sample SMS approved", done: packet?.sampleMessageStatus === "approved" },
  ];
}
