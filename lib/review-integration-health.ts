import { listClientAdminRecords } from "@/lib/client-profile-admin";
import { summarizeIntegrationEventHealth } from "@/lib/review-integration-events";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export async function getIntegrationHealthRollup(input?: { staleAfterHours?: number }) {
  const staleAfterHours = clampNumber(input?.staleAfterHours, 1, 168, 48);
  const clients = await listClientAdminRecords();
  if (!clients.ok) return { ok: false as const, error: clients.error };

  const results = await Promise.all(
    clients.records.map(async (record) => {
      const events = await listReviewAutomationRecords({ clientSlug: record.profile.slug, limit: 500 });
      const health = events.ok ? summarizeIntegrationEventHealth(events.records, staleAfterHours) : null;
      const activeAutoSync = isActiveAutoSync(record.integration?.status ?? "", record.integration?.connection_level ?? "");
      const needsAttention =
        Boolean(!events.ok) ||
        Boolean(activeAutoSync && health?.stale) ||
        Boolean((health?.held ?? 0) > 0);

      return {
        clientSlug: record.profile.slug,
        clientName: record.profile.business_name,
        integration: record.integration
          ? {
              systemName: record.integration.system_name,
              connectionLevel: record.integration.connection_level,
              status: record.integration.status,
              sendDelayDays: record.integration.send_delay_days,
            }
          : null,
        activeAutoSync,
        needsAttention,
        health,
        error: events.ok ? "" : events.error,
      };
    }),
  );

  return {
    ok: true as const,
    staleAfterHours,
    totalClients: results.length,
    needsAttention: results.filter((result) => result.needsAttention).length,
    clients: results,
  };
}

function isActiveAutoSync(status: string, connectionLevel: string) {
  const statusClean = status.toLowerCase();
  const connectionClean = connectionLevel.toLowerCase();
  const activeStatus = ["active", "ready", "connected", "live"].some((term) => statusClean.includes(term));
  const automaticConnection = ["webhook", "api", "zapier", "make", "sync"].some((term) => connectionClean.includes(term));
  return activeStatus && automaticConnection;
}

function clampNumber(value: number | undefined, min: number, max: number, fallback: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
