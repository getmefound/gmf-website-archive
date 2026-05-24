import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { envValueAny } from "@/lib/getmefound-env";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { buildIntegrationHealthEmail } from "@/lib/review-integration-health-digest";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";

type SendIntegrationHealthBody = {
  toEmail?: unknown;
  commit?: unknown;
  confirm?: unknown;
  staleAfterHours?: unknown;
};

const CONFIRM_TEXT = "SEND_POS_HEALTH_DIGEST";

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendIntegrationHealthBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const staleAfterHours = clampNumber(body.staleAfterHours, 1, 168, 48);
  const rollup = await getIntegrationHealthRollup({ staleAfterHours });
  if (!rollup.ok) return NextResponse.json(rollup, { status: 502 });

  const toEmail = String(body.toEmail ?? envValueAny("GMF_OPS_ALERT_EMAIL", "AOH_OPS_ALERT_EMAIL") ?? "mike@getmefound.ai")
    .trim()
    .toLowerCase();
  const emailCheck = validateEmail(toEmail);
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }

  const email = buildIntegrationHealthEmail({ toEmail, rollup });
  const commit = body.commit === true;

  if (!commit) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      to: email.to,
      subject: email.subject,
      previewText: email.text,
      totalClients: rollup.totalClients,
      needsAttention: rollup.needsAttention,
      nextStep: `POST again with commit=true and confirm=${CONFIRM_TEXT} after proof check approval.`,
    });
  }

  if (body.confirm !== CONFIRM_TEXT) {
    return NextResponse.json({ ok: false, error: `Live digest sends require confirm=${CONFIRM_TEXT}.` }, { status: 409 });
  }

  const result = await sendGetMeFoundEmail(email);
  return NextResponse.json(
    {
      ok: result.ok,
      dryRun: false,
      to: email.to,
      subject: email.subject,
      totalClients: rollup.totalClients,
      needsAttention: rollup.needsAttention,
      provider: "resend",
      messageId: result.ok ? result.id : "",
      error: result.ok ? undefined : result.error,
    },
    { status: result.ok ? 200 : 502 },
  );
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
