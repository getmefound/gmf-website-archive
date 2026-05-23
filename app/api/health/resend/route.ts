import { NextResponse } from "next/server";
import { getEnvChecks } from "@/lib/getmefound-env";
import { getResendDomainStatus } from "@/lib/getmefound-email";

export async function GET() {
  const env = getEnvChecks().filter((item) => item.name.includes("RESEND"));
  const domain = await getResendDomainStatus();

  return NextResponse.json({
    ok: env.every((item) => item.present) && domain.ok && domain.domainStatus === "verified",
    env,
    domain,
  });
}
