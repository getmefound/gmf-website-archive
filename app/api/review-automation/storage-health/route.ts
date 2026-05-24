import { NextResponse } from "next/server";
import { checkReviewAutomationStorage } from "@/lib/review-automation-store";

export async function GET() {
  const result = await checkReviewAutomationStorage();
  return NextResponse.json(result);
}
