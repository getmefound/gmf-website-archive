import { NextRequest, NextResponse } from "next/server";
import { createAgentTask } from "@/lib/ops-store";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { envValueAny } from "@/lib/getmefound-env";
import { checkEmailRate } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/email-validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot
  const { name, email, partnerType, handle, audienceSize, howYouWork, offersGbp, website } = body as Record<string, unknown>;
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();

  const rate = await checkEmailRate(normalizedEmail, 2);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Application already submitted. We'll be in touch soon." },
      { status: 429 },
    );
  }

  if (typeof howYouWork !== "string" || howYouWork.trim().length < 20) {
    return NextResponse.json(
      { ok: false, error: "Please tell us a bit more about how you work with local businesses." },
      { status: 400 },
    );
  }

  const submittedAt = new Date().toISOString();
  const partnerReplyTo = envValueAny("GMF_PARTNER_REPLY_TO_EMAIL", "GMF_SUPPORT_EMAIL") || "support@getmefound.ai";
  const opsAlertEmail = envValueAny("GMF_OPS_ALERT_EMAIL", "AOH_OPS_ALERT_EMAIL") || "mike@getmefound.ai";

  const taskResult = await createAgentTask({
    title: `Partner application: ${(name as string).trim()} - ${partnerType ?? "unknown"}`,
    kind: "partner_application",
    priority: "normal",
    source: "website_partners",
    payload: {
      name: (name as string).trim(),
      email: normalizedEmail,
      partnerType: partnerType ?? null,
      handle: handle ?? null,
      audienceSize: audienceSize ?? null,
      howYouWork: (howYouWork as string).trim(),
      offersGbp: offersGbp ?? null,
      submittedAt,
    },
  });

  if (!taskResult.ok) {
    console.error("Partner task save failed", taskResult);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }

  await sendGetMeFoundEmail({
    to: normalizedEmail,
    subject: "We got your GetMeFound partner application",
    text: `Hi ${(name as string).trim()},\n\nThanks for applying to the GetMeFound partner program. We review every application personally and will get back to you within 1-2 business days.\n\nIf you have any questions in the meantime, reply to this email.\n\nGetMeFound Partner Team`,
    replyTo: partnerReplyTo,
  });

  await sendGetMeFoundEmail({
    to: opsAlertEmail,
    subject: `New partner application: ${(name as string).trim()}`,
    text: `New partner application submitted.\n\nName: ${(name as string).trim()}\nEmail: ${normalizedEmail}\nType: ${partnerType ?? "not specified"}\nHandle: ${handle ?? "n/a"}\nAudience/clients: ${audienceSize ?? "not specified"}\nOffers GBP/SEO: ${offersGbp ?? "not specified"}\n\nHow they work with local businesses:\n${(howYouWork as string).trim()}\n\nSubmitted: ${submittedAt}`,
  });

  return NextResponse.json({ ok: true });
}
