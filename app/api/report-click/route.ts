import { after, NextRequest, NextResponse } from "next/server";
import { recordFreeVisibilityClick } from "@/lib/free-visibility-report";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")?.trim() ?? "";
  const target = req.nextUrl.searchParams.get("target")?.trim() || "get_found";
  const destination = new URL("/checkout/get-found-refresh", req.nextUrl.origin);
  destination.searchParams.set("source", "free_visibility_report");
  if (runId) destination.searchParams.set("runId", runId);

  if (runId) {
    after(async () => {
      await recordFreeVisibilityClick({ runId, target });
    });
  }

  return NextResponse.redirect(destination);
}
