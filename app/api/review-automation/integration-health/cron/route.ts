import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { envValueAny } from "@/lib/getmefound-env";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { buildIntegrationHealthEmail } from "@/lib/review-integration-health-digest";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";

export async function GET(req: NextRequest) {
  const auth = authorizeCron(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const staleAfterHours = clampNumber(req.nextUrl.searchParams.get("staleAfterHours"), 1, 168, 48);
  const sendAllClear = req.nextUrl.searchParams.get("sendAllClear") === "1";
  const rollup = await getIntegrationHealthRollup({ staleAfterHours });
  if (!rollup.ok) return NextResponse.json(rollup, { status: 502 });

  if (!rollup.needsAttention && !sendAllClear) {
    return NextResponse.json({
      ok: true,
      sent: false,
      reason: "No POS/CRM sync issues detected.",
      totalClients: rollup.totalClients,
      needsAttention: rollup.needsAttention,
      staleAfterHours: rollup.staleAfterHours,
    });
  }

  const toEmail = (envValueAny("GMF_OPS_ALERT_EMAIL", "AOH_OPS_ALERT_EMAIL") || "mike@getmefound.ai").trim().toLowerCase();
  const emailCheck = validateEmail(toEmail);
  if (!emailCheck.ok) return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 500 });

  const email = buildIntegrationHealthEmail({ toEmail, rollup });
  const send = await sendGetMeFoundEmail(email);

  return NextResponse.json(
    {
      ok: send.ok,
      sent: send.ok,
      to: email.to,
      subject: email.subject,
      totalClients: rollup.totalClients,
      needsAttention: rollup.needsAttention,
      staleAfterHours: rollup.staleAfterHours,
      messageId: send.ok ? send.id : "",
      error: send.ok ? undefined : send.error,
    },
    { status: send.ok ? 200 : 502 },
  );
}

function authorizeCron(req: NextRequest) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return { ok: false as const, error: "CRON_SECRET is not configured.", status: 503 };

  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (bearer !== expected) return { ok: false as const, error: "Unauthorized.", status: 401 };
  return { ok: true as const };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
