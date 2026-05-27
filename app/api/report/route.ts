import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate, checkReportDedupe } from "@/lib/rate-limit";
import { saveReportFlowStatus } from "@/lib/report-flow-status";
import { createReportRun, updateReportRun } from "@/lib/report-runs";
import { verifyReportToken } from "@/lib/report-token";
import { createVisibilityReportRequest } from "@/lib/visibility-reports";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

function canBypassTurnstileForInternalTest(req: NextRequest): boolean {
  const expected = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  if (!expected) return false;
  const provided = req.headers.get("x-report-test-bypass-token")?.trim();
  return Boolean(provided && provided === expected);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const {
    email,
    website,
    turnstileToken,
    campaign,
    reportType,
    secondaryReport,
    token,
    businessName,
    businessWebsite,
    businessLocation,
  } = body as {
    email?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
    campaign?: unknown;
    reportType?: unknown;
    secondaryReport?: unknown;
    token?: unknown;
    businessName?: unknown;
    businessWebsite?: unknown;
    businessLocation?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const tokenPayload =
    typeof token === "string" && token.trim().length > 0
      ? verifyReportToken(token)
      : null;

  const emailFromToken = tokenPayload?.email?.trim().toLowerCase() ?? "";
  const submittedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const effectiveEmail = submittedEmail || emailFromToken;
  const effectiveBusinessName =
    (typeof businessName === "string" && businessName.trim()) ||
    tokenPayload?.businessName?.trim() ||
    "";
  const effectiveBusinessWebsite =
    typeof businessWebsite === "string" ? businessWebsite.trim() : "";
  const effectiveBusinessLocation =
    typeof businessLocation === "string" ? businessLocation.trim() : "";

  if (!effectiveEmail) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }
  const v = validateEmail(effectiveEmail);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }
  if (!effectiveBusinessName) {
    return NextResponse.json({ ok: false, error: "Enter your business name." }, { status: 400 });
  }
  if (!tokenPayload && !effectiveBusinessWebsite) {
    return NextResponse.json(
      { ok: false, error: "Enter your website or Google Business Profile link." },
      { status: 400 },
    );
  }
  if (!tokenPayload && !effectiveBusinessLocation) {
    return NextResponse.json(
      { ok: false, error: "Enter your city and state." },
      { status: 400 },
    );
  }

  const normalizedEmail = effectiveEmail;
  const rate = await checkEmailRate(normalizedEmail, 2);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We already have your request. Check your inbox in 10 minutes." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const dedupe = await checkReportDedupe(normalizedEmail, effectiveBusinessName);
  if (!dedupe.ok) {
    return NextResponse.json(
      { ok: false, error: "We already have your request for this business. Check your inbox in 10 minutes." },
      { status: 429, headers: dedupe.retryAfterSec ? { "Retry-After": String(dedupe.retryAfterSec) } : undefined },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const bypass = canBypassTurnstileForInternalTest(req);
  const turnstileOk = bypass
    ? true
    : tokenPayload
      ? true
    : await verifyTurnstile(
        typeof turnstileToken === "string" ? turnstileToken : "",
        ip,
      );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Refresh and try again." },
      { status: 400 },
    );
  }

  const normalizedCampaign =
    campaign === "reviews" || campaign === "ai" || campaign === "organic"
      ? campaign
      : tokenPayload?.campaign === "reviews" ||
          tokenPayload?.campaign === "ai" ||
          tokenPayload?.campaign === "organic"
        ? tokenPayload.campaign
      : "organic";
  const normalizedReportType =
    reportType === "ai_visibility" || reportType === "marketing"
      ? reportType
      : tokenPayload?.reportType === "ai_visibility" || tokenPayload?.reportType === "marketing"
        ? tokenPayload.reportType
      : "marketing";
  const normalizedSecondaryReport = Boolean(secondaryReport);
  const reportLane = tokenPayload ? "campaign_report" : "website_free_report";

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "getmefound.ai";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const reportPath: "/report/marketing" | "/report/ai-visibility" =
    normalizedReportType === "ai_visibility" ? "/report/ai-visibility" : "/report/marketing";
  const reportUrl = new URL(reportPath, `${proto}://${host}`);
  const runId = crypto.randomUUID();
  createReportRun({
    runId,
    email: normalizedEmail,
    businessName: effectiveBusinessName,
    campaign: normalizedCampaign,
    reportType: normalizedReportType,
    secondaryReport: normalizedSecondaryReport,
  });
  reportUrl.searchParams.set("runId", runId);
  reportUrl.searchParams.set("business", effectiveBusinessName);
  reportUrl.searchParams.set("email", normalizedEmail);

  await recordReportFlowStatus({
    runId,
    reportLane,
    reportType: normalizedReportType,
    source: reportLane === "website_free_report" ? "api/report:website" : "api/report:campaign",
    auditUrl: reportUrl.toString(),
    status: "submitted",
    blocker: "",
  });
  await createVisibilityReportRequest({
    runId,
    context: tokenPayload ? "prospect_campaign_reply" : "prospect_free_check",
    businessName: effectiveBusinessName,
    contactEmail: normalizedEmail,
    businessWebsite: effectiveBusinessWebsite,
    businessLocation: effectiveBusinessLocation,
    reportType: normalizedReportType,
    source: reportLane === "website_free_report" ? "api/report:website" : "api/report:campaign",
    campaign: normalizedCampaign,
    auditUrl: reportUrl.toString(),
    metadata: {
      secondaryReport: normalizedSecondaryReport,
      reportLane,
      tokenMode: Boolean(tokenPayload),
    },
  });
  maybeSimulateReportLifecycle({
    runId,
    reportPath,
    host,
    proto,
  });

  return NextResponse.json({
    ok: true,
    auditUrl: reportUrl.toString(),
    runId,
  });
}

async function recordReportFlowStatus(input: {
  runId: string;
  reportLane: "website_free_report" | "campaign_report";
  reportType: "marketing" | "ai_visibility";
  source: string;
  auditUrl: string;
  status: "submitted" | "blocked";
  blocker: string;
}) {
  const saved = await saveReportFlowStatus({
    clientSlug: "getmefound",
    clientName: "GetMeFound",
    reportLane: input.reportLane,
    reportType: input.reportType,
    source: input.source,
    status: input.status,
    runId: input.runId,
    auditUrl: input.auditUrl,
    heatmapUrl: "",
    blocker: input.blocker,
    timestamp: new Date().toISOString(),
  });
  if (!saved.ok) {
    console.error("Report flow status save failed", saved.error);
  }
}

function maybeSimulateReportLifecycle(input: {
  runId: string;
  reportPath: "/report/marketing" | "/report/ai-visibility";
  host: string;
  proto: string;
}): void {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) return;

  // Local dev fallback so the UI flow can be tested end-to-end.
  const base = `${input.proto}://${input.host}`;
  const auditUrl = `${base}${input.reportPath}?runId=${encodeURIComponent(input.runId)}`;
  const heatmapUrl = `${base}${input.reportPath}?runId=${encodeURIComponent(input.runId)}#heatmap`;

  setTimeout(() => {
    updateReportRun(input.runId, {
      reportReadyAt: Date.now(),
      auditUrl,
    });
  }, 2500);

  setTimeout(() => {
    updateReportRun(input.runId, {
      heatmapReadyAt: Date.now(),
      heatmapUrl,
    });
  }, 5500);
}
