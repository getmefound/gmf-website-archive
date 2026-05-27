import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";
import { envValueAny } from "@/lib/getmefound-env";
import { supabaseRest } from "@/lib/supabase-rest";

type IntakePayload = {
  businessName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  gbpLink?: unknown;
  accessStatus?: unknown;
  accessRole?: unknown;
  serviceIntent?: unknown;
  customerSystem?: unknown;
  notes?: unknown;
  authorized?: unknown;
  inviteEmail?: unknown;
  websiteTrap?: unknown;
};

type CleanIntake = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  gbpLink: string;
  accessStatus: string;
  accessRole: string;
  serviceIntent: string;
  customerSystem: string;
  notes: string;
  inviteEmail: string;
  source: string;
  timestamp: string;
};

const ACCESS_STATUS = new Set(["added", "need_help", "not_sure"]);
const ACCESS_ROLE = new Set(["manager", "owner", "not_sure"]);
const SERVICE_INTENT = new Set(["review_automation", "gbp_update", "ai_visibility", "not_sure"]);

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as IntakePayload | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof body.websiteTrap === "string" && body.websiteTrap.trim()) {
    return NextResponse.json({ ok: true });
  }

  const businessName = cleanText(body.businessName, 120);
  const contactName = cleanText(body.contactName, 100);
  const phone = cleanText(body.phone, 60);
  const website = cleanText(body.website, 250);
  const gbpLink = cleanText(body.gbpLink, 300);
  const customerSystem = cleanText(body.customerSystem, 160);
  const notes = cleanText(body.notes, 1200);
  const inviteEmail = cleanText(body.inviteEmail, 160) || defaultInviteEmail();
  const accessStatus = cleanEnum(body.accessStatus, ACCESS_STATUS, "not_sure");
  const accessRole = cleanEnum(body.accessRole, ACCESS_ROLE, "not_sure");
  const serviceIntent = cleanEnum(body.serviceIntent, SERVICE_INTENT, "review_automation");

  if (businessName.length < 2) {
    return NextResponse.json({ ok: false, error: "Add the business name." }, { status: 400 });
  }
  if (contactName.length < 2) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  if (body.authorized !== true) {
    return NextResponse.json(
      { ok: false, error: "Confirm you are authorized to request setup." },
      { status: 400 },
    );
  }

  const emailCheck = validateEmail(body.email);
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }
  const email = String(body.email).trim().toLowerCase();
  const rate = await checkEmailRate(email, 5);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We received a few submissions already. We will follow up soon." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const payload: CleanIntake = {
    businessName,
    contactName,
    email,
    phone,
    website,
    gbpLink,
    accessStatus,
    accessRole,
    serviceIntent,
    customerSystem,
    notes,
    inviteEmail,
    source: "getmefound.ai/intake/review-automation",
    timestamp: new Date().toISOString(),
  };

  await saveToSupabase(payload);

  return NextResponse.json({ ok: true });
}
function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanEnum(value: unknown, allowed: Set<string>, fallback: string) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().toLowerCase();
  return allowed.has(cleaned) ? cleaned : fallback;
}

function defaultInviteEmail() {
  return envValueAny("GMF_GBP_INVITE_EMAIL", "AOH_GBP_INVITE_EMAIL") || "mike@getmefound.ai";
}

async function saveToSupabase(payload: CleanIntake) {
  const result = await supabaseRest("intake_submissions", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      business_name: payload.businessName,
      contact_name: payload.contactName,
      email: payload.email,
      phone: payload.phone || null,
      website: payload.website || null,
      gbp_link: payload.gbpLink || null,
      access_status: payload.accessStatus,
      service_intent: payload.serviceIntent,
      notes: payload.notes || null,
      created_at: payload.timestamp,
    },
  });
  if (!result.ok) {
    console.error("Intake Supabase save failed", result.error);
  }
}
