import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { createAgentTask, saveContactSubmission } from "@/lib/ops-store";
import { checkEmailRate } from "@/lib/rate-limit";
import { postToSlack, GMF_MANAGER_CHANNEL } from "@/lib/slack";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { name, email, message, website, turnstileToken } = body as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json(
      { ok: false, error: "Your message is too short." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Your message is too long." },
      { status: 400 },
    );
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const rate = await checkEmailRate(normalizedEmail, 3);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "You've sent us a few messages today already. We'll reply soon." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const turnstileOk = await verifyTurnstile(
    typeof turnstileToken === "string" ? turnstileToken : "",
    ip,
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Refresh and try again." },
      { status: 400 },
    );
  }

  const submittedAt = new Date().toISOString();
  const contact = {
    name: name.trim(),
    email: normalizedEmail,
    message: message.trim(),
    source: "getmefound.ai/contact",
    user_agent: req.headers.get("user-agent"),
    ip_hint: ip,
  };

  const contactResult = await saveContactSubmission(contact);
  if (!contactResult.ok) {
    console.error("Supabase contact save failed", contactResult.status, contactResult.error);
  }

  const taskResult = await createAgentTask({
    title: `Follow up with ${contact.name}`,
    kind: "contact_follow_up",
    priority: "normal",
    source: "website_contact",
    payload: {
      ...contact,
      submittedAt,
    },
  });
  if (!taskResult.ok) {
    console.error("Supabase agent task save failed", taskResult.status, taskResult.error);
  }

  const slackMessage = [
    `*New contact from getmefound.ai*`,
    ``,
    `*Name:* ${contact.name}`,
    `*Email:* ${contact.email}`,
    `*Message:* ${contact.message}`,
    ``,
    `*Source:* ${contact.source}`,
    `*Submitted:* ${submittedAt}`,
    ``,
    `Manager — review this. If they seem ready to move forward, draft a reply. Escalate to Mike only if they need a pricing decision or are ready to sign.`,
  ].join("\n");

  const slackResult = await postToSlack(GMF_MANAGER_CHANNEL, slackMessage);
  if (!slackResult.ok) {
    console.error("Slack contact post failed", slackResult.error);
  }

  return NextResponse.json({
    ok: true,
    saved: contactResult.ok,
    taskCreated: taskResult.ok,
    notified: slackResult.ok,
  });
}

