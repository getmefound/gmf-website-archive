import { NextRequest, NextResponse } from "next/server";
import { handleAlwaysReadyReply } from "@/lib/always-ready-nurture";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const event = normalizeAlwaysReadyEvent(body);
  if (!event.email) {
    return NextResponse.json({ ok: false, error: "Missing reply email." }, { status: 400 });
  }
  if (!event.replyText) {
    return NextResponse.json({ ok: true, skipped: "no_reply_text" });
  }

  const result = await handleAlwaysReadyReply({
    email: event.email,
    replyText: event.replyText,
    eventType: event.eventType,
    payload: body,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

function normalizeAlwaysReadyEvent(body: Record<string, unknown>) {
  const eventType = pickString(body, ["type", "event", "event_type", "eventType"]) || "";
  const email =
    pickString(body, ["email", "from", "from_email", "reply_from", "sender"]) ||
    pickNestedString(body, ["data", "from"]) ||
    pickNestedString(body, ["data", "from_email"]) ||
    pickNestedString(body, ["data", "email"]) ||
    pickNestedString(body, ["email", "from"]) ||
    "";
  const replyText =
    pickString(body, ["text", "body", "message", "reply_text", "replyText"]) ||
    pickNestedString(body, ["data", "text"]) ||
    pickNestedString(body, ["data", "body"]) ||
    pickNestedString(body, ["data", "message"]) ||
    pickNestedString(body, ["reply", "body"]) ||
    "";

  return {
    eventType,
    email: normalizeEmail(email),
    replyText: stripHtml(replyText).trim(),
  };
}

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected =
    process.env.GMF_ALWAYS_READY_EVENTS_TOKEN?.trim() ||
    process.env.GMF_PROSPECTING_EVENTS_TOKEN?.trim() ||
    process.env.GMF_INTERNAL_API_TOKEN?.trim();
  const provided =
    req.headers.get("x-gmf-always-ready-events-token")?.trim() ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    req.nextUrl.searchParams.get("token")?.trim() ||
    req.nextUrl.searchParams.get("gmf_token")?.trim();

  if (expected) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Unauthorized" };
  }

  if (process.env.NODE_ENV !== "production") return { ok: true };
  return { ok: false, status: 503, error: "GMF_ALWAYS_READY_EVENTS_TOKEN or GMF_INTERNAL_API_TOKEN is not configured." };
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function pickNestedString(record: Record<string, unknown>, path: string[]) {
  let cursor: unknown = record;
  for (const key of path) {
    const next = asRecord(cursor)[key];
    if (next === undefined) return "";
    cursor = next;
  }
  return typeof cursor === "string" && cursor.trim() ? cursor.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeEmail(value: string) {
  const match = value.trim().toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match?.[0] ?? "";
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}
