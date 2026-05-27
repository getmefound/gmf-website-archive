import { NextResponse } from "next/server";
import { getReviewEmailReadiness } from "@/lib/review-request-email";

export async function GET() {
  const readiness = getReviewEmailReadiness();

  return NextResponse.json({
    ok: readiness.ok,
    provider: readiness.provider,
    checks: readiness.checks,
    canSendReviewRequests: readiness.ok,
    error: readiness.error,
  });
}
