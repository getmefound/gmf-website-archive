import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { createAgentTask } from "@/lib/ops-store";
import { checkEmailRate } from "@/lib/rate-limit";
import { enrollAlwaysReadyWaitlistLead, normalizeAlwaysReadySource } from "@/lib/always-ready-nurture";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { name, email, businessName, website, source } = body as {
    name?: unknown;
    email?: unknown;
    businessName?: unknown;
    website?: unknown;
    source?: unknown;
  };

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
      { ok: false, error: "Already on the list - we'll be in touch." },
      { status: 429 },
    );
  }

  const originalSource =
    typeof source === "string" && source.trim() ? source.trim() : "always-ready-waitlist";
  const resolvedSource = normalizeAlwaysReadySource(originalSource);
  const submittedAt = new Date().toISOString();

  await createAgentTask({
    title: `Waitlist: ${name.trim()} - ${resolvedSource}`,
    kind: "waitlist_signup",
    priority: "normal",
    source: "website_waitlist",
    payload: {
      name: name.trim(),
      email: normalizedEmail,
      businessName: typeof businessName === "string" ? businessName.trim() : "",
      source: resolvedSource,
      originalSource,
      submittedAt,
    },
  });

  const nurture = await enrollAlwaysReadyWaitlistLead({
    name: name.trim(),
    email: normalizedEmail,
    businessName: typeof businessName === "string" ? businessName.trim() : "",
    source: resolvedSource,
    originalSource,
    submittedAt,
  }).catch((error) => ({
    ok: false as const,
    saved: false,
    error: error instanceof Error ? error.message : "Always Ready nurture failed.",
  }));

  return NextResponse.json({ ok: true, nurtureStarted: nurture.ok, nurture });
}
