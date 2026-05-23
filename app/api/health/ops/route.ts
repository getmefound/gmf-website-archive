import { NextResponse } from "next/server";
import { getEnvChecks } from "@/lib/getmefound-env";
import { getResendDomainStatus } from "@/lib/getmefound-email";
import { supabaseRest } from "@/lib/supabase-rest";

export async function GET() {
  const env = getEnvChecks();
  const resend = await getResendDomainStatus();
  const supabase = await supabaseRest<Array<{ id: string }>>("contact_submissions", {
    query: "select=id&limit=1",
  });

  return NextResponse.json({
    ok: env.every((item) => item.present) && resend.domainStatus === "verified" && supabase.ok,
    env,
    services: {
      resend: {
        ok: resend.ok && resend.domainStatus === "verified",
        status: resend.domainStatus,
      },
      supabase: {
        ok: supabase.ok,
        status: supabase.status,
        contactSubmissionsTable: supabase.ok ? "ready" : "not-ready",
      },
    },
  });
}
