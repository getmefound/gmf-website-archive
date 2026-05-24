#!/usr/bin/env node

const baseUrl = process.env.REPORT_SMOKE_BASE_URL || "https://getmefound.ai";
const token = process.env.REPORT_TEST_BYPASS_TOKEN;

if (!token) {
  console.error("REPORT_TEST_BYPASS_TOKEN is required.");
  process.exit(1);
}

const now = new Date();
const suffix = now.toISOString().replace(/[:.]/g, "-");
const body = {
  email: `weekly-report-smoke+${suffix}@getmefound.ai`,
  businessName: `GMF Internal Weekly Report Smoke ${suffix}`,
  campaign: "organic",
  visualVariant: "reviews",
  reportType: "marketing",
  secondaryReport: true,
};

const res = await fetch(new URL("/api/report", baseUrl), {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-report-test-bypass-token": token,
    "x-report-test-strict": "1",
  },
  body: JSON.stringify(body),
});

const data = await res.json().catch(() => null);

if (!res.ok || !data?.ok || !data?.ghlForward?.ok) {
  console.error("Report smoke test failed.");
  console.error(
    JSON.stringify(
      {
        status: res.status,
        ok: data?.ok,
        error: data?.error,
        runId: data?.runId,
        ghlForward: data?.ghlForward,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log("Report smoke test passed.");
console.log(
  JSON.stringify(
    {
      runId: data.runId,
      auditUrl: data.auditUrl,
      ghlForward: data.ghlForward,
    },
    null,
    2,
  ),
);
