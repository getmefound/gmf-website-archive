import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await forwardToGHL({
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      source: "getmefound.ai/newsletter",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

type NewsletterPayload = {
  email: string;
  timestamp: string;
  source: string;
};

async function forwardToGHL(payload: NewsletterPayload): Promise<void> {
  const url = process.env.GHL_NEWSLETTER_WEBHOOK_URL ?? process.env.GHL_WEBHOOK_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("GHL newsletter webhook responded", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("GHL newsletter webhook failed", err);
  }
}
