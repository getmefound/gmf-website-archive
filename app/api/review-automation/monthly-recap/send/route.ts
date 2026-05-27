import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { validateEmail } from "@/lib/email-validation";
import { getClientHubActivity } from "@/lib/client-hub-activity";
import { getClientHub } from "@/lib/client-hub";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { cleanClientSlug } from "@/lib/review-send-candidates";

type SendMonthlyRecapBody = {
  clientSlug?: unknown;
  toEmail?: unknown;
  commit?: unknown;
  confirm?: unknown;
};

const CONFIRM_TEXT = "SEND_MONTHLY_RECAP";

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendMonthlyRecapBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const clientSlug = cleanClientSlug(body.clientSlug);
  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }

  const client = getClientHub(clientSlug);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Unknown client." }, { status: 404 });
  }

  const toEmail = String(body.toEmail ?? client.email).trim().toLowerCase();
  const emailCheck = validateEmail(toEmail);
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }

  const activity = await getClientHubActivity(clientSlug);
  if (!activity.ok) {
    return NextResponse.json(
      {
        ok: false,
        storageConfigured: activity.storageConfigured,
        error: activity.error ?? "Could not read review activity.",
      },
      { status: activity.storageConfigured ? 502 : 503 },
    );
  }

  const email = buildMonthlyRecapEmail({
    clientName: client.businessName,
    toEmail,
    clientUrl: `https://getmefound.ai/client/${client.slug}`,
    sent: activity.monthly.sent,
    feedback: activity.monthly.feedback,
    privateFeedback: activity.monthly.privateFeedback,
    heldBack: activity.monthly.heldBack,
    uploadedRows: activity.monthly.uploadedRows,
  });

  const commit = body.commit === true;
  if (!commit) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      clientSlug: client.slug,
      clientName: client.businessName,
      to: email.to,
      subject: email.subject,
      previewText: email.text,
      nextStep: `POST again with commit=true and confirm=${CONFIRM_TEXT} after proof check approval.`,
    });
  }

  if (body.confirm !== CONFIRM_TEXT) {
    return NextResponse.json(
      { ok: false, error: `Live recap sends require confirm=${CONFIRM_TEXT}.` },
      { status: 409 },
    );
  }

  const result = await sendGetMeFoundEmail(email);
  return NextResponse.json({
    ok: result.ok,
    dryRun: false,
    clientSlug: client.slug,
    clientName: client.businessName,
    to: email.to,
    subject: email.subject,
    provider: "resend",
    messageId: result.ok ? result.id : "",
    error: result.ok ? undefined : result.error,
  }, { status: result.ok ? 200 : 502 });
}

function buildMonthlyRecapEmail(input: {
  clientName: string;
  toEmail: string;
  clientUrl: string;
  sent: number;
  feedback: number;
  privateFeedback: number;
  heldBack: number;
  uploadedRows: number;
}) {
  const subject = `${input.clientName} review recap`;
  const text = `${input.clientName} review recap

Review requests sent: ${input.sent}
Feedback captured: ${input.feedback}
Private follow-up needed: ${input.privateFeedback}
Held back: ${input.heldBack}
Uploaded customer rows: ${input.uploadedRows}

Client hub:
${input.clientUrl}

GetMeFound`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f4;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#047857;">Review recap</p>
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#0f172a;">${escapeHtml(input.clientName)}</h1>
        ${statRow("Review requests sent", input.sent)}
        ${statRow("Feedback captured", input.feedback)}
        ${statRow("Private follow-up needed", input.privateFeedback)}
        ${statRow("Held back", input.heldBack)}
        ${statRow("Uploaded customer rows", input.uploadedRows)}
        <p style="margin:24px 0 0;">
          <a href="${input.clientUrl}" style="display:inline-block;border-radius:8px;background:#065f46;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Open client hub</a>
        </p>
      </div>
    </div>
  </body>
</html>`;

  return {
    to: input.toEmail,
    subject,
    text,
    html,
  };
}

function statRow(label: string, value: number) {
  return `<p style="margin:0;padding:10px 0;border-top:1px solid #e2e8f0;font-size:15px;line-height:1.4;"><strong>${escapeHtml(label)}:</strong> ${value}</p>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
