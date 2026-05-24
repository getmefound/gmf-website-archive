import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

const buckets = new Map<string, number[]>();
const CANONICAL_INTERNAL_HOST = "mc.getmefound.ai";
const LEGACY_INTERNAL_HOST = "mc.aioutsourcehub.com";

const INTERNAL_SHORT_PATHS: Record<string, string> = {
  "/": "/mike-mc",
  "/ops": "/mike-mc/ops",
  "/jobs": "/mike-mc/jobs",
  "/campaigns": "/mike-mc/campaigns",
  "/team": "/mike-mc/team",
  "/workflows": "/mike-mc/workflows",
  "/clients": "/mike-mc/clients",
  "/setup-jobs": "/mike-mc/setup-jobs",
  "/ghl-exit-ops": "/mike-mc/ghl-exit-ops",
  "/morning-brief": "/mike-mc/morning-brief",
  "/report-flow": "/mike-mc/report-flow",
  "/review-proof": "/mike-mc/review-proof/ai-outsource-hub",
  "/review-replies": "/mike-mc/review-replies/ai-outsource-hub",
};

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function hasInternalReportBypass(req: NextRequest): boolean {
  const expected = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  if (!expected) return false;
  const provided = req.headers.get("x-report-test-bypass-token")?.trim();
  return Boolean(provided && provided === expected);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.nextUrl.hostname.toLowerCase();
  const method = req.method.toUpperCase();

  if (hostname === LEGACY_INTERNAL_HOST) {
    const url = req.nextUrl.clone();
    url.hostname = CANONICAL_INTERNAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (hostname === CANONICAL_INTERNAL_HOST && INTERNAL_SHORT_PATHS[pathname]) {
    const url = req.nextUrl.clone();
    url.pathname = INTERNAL_SHORT_PATHS[pathname];
    return NextResponse.rewrite(url);
  }

  // Only rate-limit form submissions.
  // Do not throttle status polling or webhook callbacks.
  const isReportSubmit = pathname === "/api/report" && method === "POST";
  const isContactSubmit = pathname === "/api/contact" && method === "POST";
  if (!isReportSubmit && !isContactSubmit) {
    return NextResponse.next();
  }
  if (isReportSubmit && hasInternalReportBypass(req)) {
    return NextResponse.next();
  }

  const ip = clientIp(req);
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { ok: false, error: "Please wait before submitting again." },
      { status: 429 },
    );
  }

  recent.push(now);
  buckets.set(ip, recent);

  if (Math.random() < 0.01) {
    for (const [key, value] of buckets) {
      const fresh = value.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) buckets.delete(key);
      else buckets.set(key, fresh);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/ops",
    "/jobs",
    "/campaigns",
    "/team",
    "/workflows",
    "/clients",
    "/setup-jobs",
    "/ghl-exit-ops",
    "/morning-brief",
    "/report-flow",
    "/review-proof",
    "/review-replies",
    "/mike-mc/:path*",
    "/api/report/:path*",
    "/api/contact/:path*",
  ],
};
