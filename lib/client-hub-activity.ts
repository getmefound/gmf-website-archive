import type {
  ReviewCustomerPacket,
  ReviewFeedbackPacket,
  ReviewSendLogPacket,
  ReviewSuppressionPacket,
} from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type ClientHubActivitySnapshot = {
  ok: boolean;
  storageConfigured: boolean;
  latestUploadAt: string;
  weekly: {
    sent: number;
    feedback: number;
  };
  monthly: {
    customerUploads: number;
    uploadedRows: number;
    sendableRows: number;
    sent: number;
    failed: number;
    bounced: number;
    clicked: number;
    feedback: number;
    privateFeedback: number;
    suppressions: number;
    heldBack: number;
  };
  error?: string;
};

export async function getClientHubActivity(clientSlug: string): Promise<ClientHubActivitySnapshot> {
  const result = await listReviewAutomationRecords({ clientSlug, limit: 500 });
  if (!result.ok) {
    return {
      ok: false,
      storageConfigured: result.configured,
      latestUploadAt: "",
      weekly: { sent: 0, feedback: 0 },
      monthly: emptyMonthly(),
      error: result.error,
    };
  }

  const now = Date.now();
  const weekCutoff = now - 7 * 24 * 60 * 60 * 1000;
  const monthCutoff = now - 30 * 24 * 60 * 60 * 1000;
  const weeklyRecords = result.records.filter((record) => Date.parse(record.createdAt) >= weekCutoff);
  const monthlyRecords = result.records.filter((record) => Date.parse(record.createdAt) >= monthCutoff);

  const monthlyUploads = monthlyRecords
    .filter((record) => record.eventType === "customer_upload")
    .map((record) => record.payload as ReviewCustomerPacket);
  const monthlyFeedback = monthlyRecords
    .filter((record) => record.eventType === "private_feedback")
    .map((record) => record.payload as ReviewFeedbackPacket);
  const monthlyLogs = monthlyRecords
    .filter((record) => record.eventType === "send_log")
    .map((record) => record.payload as ReviewSendLogPacket);
  const monthlySuppressions = monthlyRecords
    .filter((record) => record.eventType === "suppression_update")
    .map((record) => record.payload as ReviewSuppressionPacket);
  const weeklyLogs = weeklyRecords
    .filter((record) => record.eventType === "send_log")
    .map((record) => record.payload as ReviewSendLogPacket);
  const weeklyFeedback = weeklyRecords.filter((record) => record.eventType === "private_feedback");
  const latestUpload = result.records.find((record) => record.eventType === "customer_upload");
  const bounced = monthlyLogs.filter((log) => log.status === "bounced").length;
  const failed = monthlyLogs.filter((log) => log.status === "failed").length;
  const suppressions = monthlySuppressions.length;

  return {
    ok: true,
    storageConfigured: true,
    latestUploadAt: latestUpload?.createdAt ?? "",
    weekly: {
      sent: weeklyLogs.filter((log) => log.status === "sent").length,
      feedback: weeklyFeedback.length,
    },
    monthly: {
      customerUploads: monthlyUploads.length,
      uploadedRows: monthlyUploads.reduce((sum, upload) => sum + upload.summary.totalRows, 0),
      sendableRows: monthlyUploads.reduce((sum, upload) => sum + upload.summary.sendableRows, 0),
      sent: monthlyLogs.filter((log) => log.status === "sent").length,
      failed,
      bounced,
      clicked: monthlyLogs.filter((log) => log.status === "clicked").length,
      feedback: monthlyFeedback.length,
      privateFeedback: monthlyFeedback.filter((item) => !item.shouldRouteToGoogle).length,
      suppressions,
      heldBack: bounced + failed + suppressions,
    },
  };
}

function emptyMonthly() {
  return {
    customerUploads: 0,
    uploadedRows: 0,
    sendableRows: 0,
    sent: 0,
    failed: 0,
    bounced: 0,
    clicked: 0,
    feedback: 0,
    privateFeedback: 0,
    suppressions: 0,
    heldBack: 0,
  };
}
