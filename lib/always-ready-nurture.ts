import { createAgentTask, logEmailEvent } from "@/lib/ops-store";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { envValueAny } from "@/lib/getmefound-env";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

const ALWAYS_READY_SOURCE = "always-ready-waitlist";
const DEFAULT_REPLY_TO = "casey@getmefound.ai";
const DEFAULT_OWNER_NOTIFY_EMAIL = "mike@getmefound.ai";
const DEFAULT_MAILING_ADDRESS = "13727 SW 152nd St. #1236, Miami, FL 33177";

type WaitlistRow = {
  id?: string;
  email: string;
  name: string;
  first_name?: string;
  business_name?: string;
  source: string;
  status?: string;
  stage?: string;
  nurture_step?: number;
  next_send_at?: string | null;
  drip_stopped_at?: string | null;
  unsubscribed_at?: string | null;
  suppressed_at?: string | null;
  email_1_sent_at?: string | null;
  email_2_sent_at?: string | null;
  email_3_sent_at?: string | null;
  email_4_sent_at?: string | null;
  resend_message_ids?: Record<string, string>;
  last_reply_at?: string | null;
  last_reply_text?: string;
  last_reply_intent?: string;
  submitted_at?: string | null;
  metadata?: Record<string, unknown>;
};

type SendStep = 1 | 2 | 3 | 4;

type SendResult = {
  ok: boolean;
  step: SendStep;
  email: string;
  skipped?: string;
  error?: string;
  providerId?: string;
};

export function normalizeAlwaysReadySource(source?: string) {
  const clean = source?.trim() || ALWAYS_READY_SOURCE;
  return clean.startsWith("always-ready") ? ALWAYS_READY_SOURCE : clean;
}

export async function enrollAlwaysReadyWaitlistLead(input: {
  name: string;
  email: string;
  businessName?: string;
  source?: string;
  submittedAt?: string;
  originalSource?: string;
}) {
  const email = normalizeEmail(input.email);
  const source = normalizeAlwaysReadySource(input.source);
  const submittedAt = input.submittedAt || new Date().toISOString();
  const firstName = firstNameFrom(input.name);
  const businessName = cleanText(input.businessName) || "your business";

  const existing = await getWaitlistLead(email, source);
  const existingRow = existing.ok ? existing.data : null;
  const alreadySent = Boolean(existingRow?.email_1_sent_at);

  const upsert = await supabaseRest<WaitlistRow[]>("waitlist_signups", {
    method: "POST",
    query: "on_conflict=email,source",
    prefer: "return=representation,resolution=merge-duplicates",
    body: {
      email,
      name: cleanText(input.name),
      first_name: firstName,
      business_name: businessName,
      source,
      status: existingRow?.status || "nurture_active",
      stage: existingRow?.stage || "signed_up",
      nurture_step: existingRow?.nurture_step ?? 0,
      next_send_at: existingRow?.next_send_at ?? null,
      submitted_at: existingRow?.submitted_at || submittedAt,
      metadata: {
        ...(existingRow?.metadata || {}),
        originalSource: input.originalSource || input.source || source,
        latestSignupAt: submittedAt,
      },
    },
  });

  if (!upsert.ok) {
    await createAgentTask({
      title: `Always Ready waitlist save failed - ${businessName}`,
      kind: "always_ready_waitlist_storage_failure",
      priority: "high",
      source: "website/waitlist",
      payload: {
        email,
        businessName,
        error: upsert.error,
        nextAction:
          "Systems Director checks Supabase waitlist_signups migration/env before asking Mike.",
      },
    });
    return { ok: false as const, saved: false, error: upsert.error };
  }

  const row = upsert.data[0] ?? {
    email,
    name: cleanText(input.name),
    first_name: firstName,
    business_name: businessName,
    source,
  };

  if (alreadySent || row.drip_stopped_at || row.unsubscribed_at || row.suppressed_at) {
    return { ok: true as const, saved: true, email1: { ok: true, skipped: "already_enrolled" } };
  }

  const email1 = await sendAlwaysReadyNurtureEmail(row, 1);
  return { ok: email1.ok as true | false, saved: true, email1 };
}

export async function processAlwaysReadyNurtureQueue(input: { limit?: number; dryRun?: boolean } = {}) {
  const limit = Math.min(250, Math.max(1, input.limit ?? 100));
  const rows = await listAlwaysReadyWaitlistRows(limit);
  if (!rows.ok) return { ok: false as const, error: rows.error, processed: [] as SendResult[] };

  const now = new Date();
  const processed: SendResult[] = [];

  for (const row of rows.data) {
    const nextStep = nextDueStep(row, now);
    if (!nextStep) continue;

    if (input.dryRun) {
      processed.push({ ok: true, step: nextStep, email: row.email, skipped: "dry_run" });
      continue;
    }

    processed.push(await sendAlwaysReadyNurtureEmail(row, nextStep));
  }

  return { ok: true as const, checked: rows.data.length, processed };
}

export async function handleAlwaysReadyReply(input: {
  email: string;
  replyText: string;
  eventType?: string;
  payload?: Record<string, unknown>;
}) {
  const email = normalizeEmail(input.email);
  const replyText = input.replyText.trim();
  const now = new Date().toISOString();
  if (!email) return { ok: false as const, error: "Missing reply email." };

  const lead = await getWaitlistLead(email, ALWAYS_READY_SOURCE);
  const row = lead.ok ? lead.data : null;
  const intent = classifyAlwaysReadyReply(replyText, row);
  const patch = stagePatchForReply(intent, replyText, now);

  const update = await updateWaitlistLead(email, ALWAYS_READY_SOURCE, patch);
  await logEmailEvent({
    provider: "resend",
    event_type: intent === "stop" ? "unsubscribe" : "always_ready_reply",
    to_email: email,
    status: "sent",
    payload: {
      intent,
      eventType: input.eventType || null,
      replyText: replyText.slice(0, 1000),
      payload: scrubPayload(input.payload || {}),
    },
  });

  if (intent !== "stop") {
    await notifyOwnerOfAlwaysReadyReply({
      email,
      businessName: row?.business_name || "",
      firstName: row?.first_name || firstNameFrom(row?.name || ""),
      intent,
      replyText,
    });
  }

  return {
    ok: update.ok,
    intent,
    stage: patch.stage,
    stopped: Boolean(patch.drip_stopped_at),
    error: update.ok ? undefined : update.error,
  };
}

export async function recordAlwaysReadyUnsubscribe(input: { email?: string }) {
  const email = normalizeEmail(input.email || "");
  if (!email) return { ok: false as const, error: "Missing email." };
  const now = new Date().toISOString();
  const update = await updateWaitlistLead(email, ALWAYS_READY_SOURCE, {
    status: "unsubscribed",
    stage: "unsubscribed",
    drip_stopped_at: now,
    unsubscribed_at: now,
    suppressed_at: now,
    last_reply_intent: "unsubscribe_link",
    updated_at: now,
  });
  await logEmailEvent({
    provider: "website",
    event_type: "unsubscribe",
    to_email: email,
    status: "sent",
    payload: { source: ALWAYS_READY_SOURCE, unsubscribedAt: now },
  });
  return update;
}

async function sendAlwaysReadyNurtureEmail(row: WaitlistRow, step: SendStep): Promise<SendResult> {
  const suppressed = await isSuppressed(row.email);
  if (suppressed) {
    await updateWaitlistLead(row.email, ALWAYS_READY_SOURCE, {
      status: "suppressed",
      stage: "suppressed",
      drip_stopped_at: new Date().toISOString(),
      suppressed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { ok: true, step, email: row.email, skipped: "suppressed" };
  }

  const rendered = renderAlwaysReadyEmail(row, step);
  const sent = await sendWithRetry({
    to: row.email,
    subject: rendered.subject,
    text: rendered.text,
    replyTo: envValueAny("GMF_ALWAYS_READY_REPLY_TO_EMAIL", "GMF_SALES_REPLY_TO_EMAIL", "RESEND_REPLY_TO_EMAIL") || DEFAULT_REPLY_TO,
  });

  await logEmailEvent({
    provider: "resend",
    event_type: `always_ready_email_${step}`,
    to_email: row.email,
    subject: rendered.subject,
    status: sent.ok ? "sent" : "failed",
    provider_id: sent.ok ? sent.id : undefined,
    error: sent.ok ? undefined : sent.error,
    payload: {
      source: ALWAYS_READY_SOURCE,
      step,
      businessName: row.business_name || "",
      stageBefore: row.stage || "",
      attempts: sent.attempts,
      placeholderState: rendered.placeholderState,
    },
  });

  if (!sent.ok) {
    await createAgentTask({
      title: `Always Ready nurture email failed - ${row.business_name || row.email}`,
      kind: "always_ready_nurture_send_failure",
      priority: "high",
      source: "resend/always-ready-nurture",
      payload: {
        email: row.email,
        businessName: row.business_name || "",
        step,
        error: sent.error,
        nextAction: "Systems Director checks Resend/domain/env and reruns the nurture queue.",
      },
    });
    return { ok: false, step, email: row.email, error: sent.error };
  }

  const now = new Date().toISOString();
  const ids = { ...(row.resend_message_ids || {}), [`email_${step}`]: sent.id };
  const update = await updateWaitlistLead(row.email, ALWAYS_READY_SOURCE, {
    status: step === 4 ? "spot_opened" : "nurture_active",
    stage: step === 4 ? "email_4_sent" : `email_${step}_sent`,
    nurture_step: step,
    next_send_at: nextSendAfter(step),
    [`email_${step}_sent_at`]: now,
    resend_message_ids: ids,
    updated_at: now,
  });

  return {
    ok: update.ok,
    step,
    email: row.email,
    providerId: sent.id,
    error: update.ok ? undefined : update.error,
  };
}

function renderAlwaysReadyEmail(row: WaitlistRow, step: SendStep) {
  const firstName = row.first_name || firstNameFrom(row.name) || "there";
  const businessName = cleanText(row.business_name) || "your business";
  const footer = footerFor(row.email);
  const demoClipUrl = envValueAny("ALWAYS_READY_DEMO_CLIP_URL", "GMF_ALWAYS_READY_DEMO_CLIP_URL");
  const configuredFoundingTerms = envValueAny("ALWAYS_READY_FOUNDING_TERMS", "GMF_ALWAYS_READY_FOUNDING_TERMS");
  const foundingTerms =
    configuredFoundingTerms ||
    "the build fee waived with a short start commitment, and your rate locked for the first 12 months";

  if (step === 1) {
    return {
      subject: "you're on the Always Ready early-access list",
      placeholderState: { demoClipConfigured: Boolean(demoClipUrl), foundingTermsConfigured: Boolean(configuredFoundingTerms) },
      text: [
        `Hi ${firstName},`,
        "",
        "You're on the list - thanks for raising your hand.",
        "",
        `Quick why-this-matters: right now, every call you miss - after hours, when you're slammed, weekends - is a customer who just calls someone else. Always Ready puts an AI agent on your line that answers 24/7, gives your real prices and hours, and books the appointment. It also gets ${businessName} ready for what's coming: Google is rolling out AI that calls businesses to check availability for customers.`,
        "",
        "I'll keep you posted as spots open. Reply anytime with questions.",
        "- Mike",
        "",
        footer,
      ].join("\n"),
    };
  }

  if (step === 2) {
    const demoLine = demoClipUrl ? demoClipUrl : "Demo clip is being finalized - I will send it as soon as it is ready.";
    return {
      subject: "what it sounds like when AI books your next customer",
      placeholderState: { demoClipConfigured: Boolean(demoClipUrl), foundingTermsConfigured: Boolean(configuredFoundingTerms) },
      text: [
        `Hi ${firstName},`,
        "",
        `The idea in 30 seconds: a customer asks their AI to find and book a service. That AI calls around. ${businessName}'s Always Ready agent picks up, answers with your real hours and pricing, and books the slot - while you're with a client or closed.`,
        "",
        demoLine,
        "",
        "No missed call, no voicemail, no lost job. That's the whole point. More soon.",
        "- Mike",
        "",
        footer,
      ].join("\n"),
    };
  }

  if (step === 3) {
    return {
      subject: "the math on missed calls",
      placeholderState: { demoClipConfigured: Boolean(demoClipUrl), foundingTermsConfigured: Boolean(configuredFoundingTerms) },
      text: [
        `Hi ${firstName},`,
        "",
        "A missed call usually isn't a missed call - it's a missed customer. For most local businesses that's real money walking out every week.",
        "",
        `Always Ready answers every one, 24/7, and books it. We hand-build and train each agent, so we onboard a small group at a time - and the businesses ready before Google's AI-calling rolls out are the ones it learns to trust first.`,
        "",
        `Want me to hold an early-access spot for ${businessName} (with founding pricing - I'll explain)? Just reply "SPOT" and I'll set it aside.`,
        "- Mike",
        "",
        footer,
      ].join("\n"),
    };
  }

  return {
    subject: `your Always Ready spot is open, ${firstName}`,
    placeholderState: { demoClipConfigured: Boolean(demoClipUrl), foundingTermsConfigured: Boolean(configuredFoundingTerms) },
    text: [
      `Hi ${firstName},`,
      "",
      `Good news - I can onboard ${businessName} for Always Ready now.`,
      "",
      `Here's the early-access founding deal: everything in Stay Found, your AI call agent built and trained on your services, prices, and hours, ${foundingTerms}.`,
      "",
      `Want me to start your build? Reply "YES" and I'll send the simple onboarding steps.`,
      "- Mike",
      "",
      footer,
    ].join("\n"),
  };
}

function nextDueStep(row: WaitlistRow, now: Date): SendStep | null {
  if (row.unsubscribed_at || row.suppressed_at) return null;
  if (row.stage === "spot_opened" && !row.email_4_sent_at) return 4;
  if (row.drip_stopped_at) return null;
  if (!row.email_1_sent_at && (!row.stage || row.stage === "signed_up" || row.stage === "pending")) return 1;

  const dueAt = row.next_send_at ? new Date(row.next_send_at) : null;
  const isDue = dueAt ? dueAt.getTime() <= now.getTime() : false;
  if (!isDue) return null;

  if (row.email_1_sent_at && !row.email_2_sent_at) return 2;
  if (row.email_2_sent_at && !row.email_3_sent_at) return 3;
  return null;
}

async function listAlwaysReadyWaitlistRows(limit: number) {
  const query = new URLSearchParams({
    select: "*",
    source: `eq.${ALWAYS_READY_SOURCE}`,
    order: "created_at.asc",
    limit: String(limit),
  });
  return supabaseRest<WaitlistRow[]>("waitlist_signups", { query: query.toString() });
}

async function getWaitlistLead(email: string, source: string) {
  const query = new URLSearchParams({
    select: "*",
    email: `eq.${email}`,
    source: `eq.${source}`,
    limit: "1",
  });
  const result = await supabaseRest<WaitlistRow[]>("waitlist_signups", { query: query.toString() });
  if (!result.ok) return result;
  const row = result.data[0];
  return row
    ? { ok: true as const, status: result.status, data: row }
    : { ok: false as const, status: 404, error: "Always Ready waitlist lead not found." };
}

async function updateWaitlistLead(email: string, source: string, body: Record<string, unknown>) {
  return supabaseRest("waitlist_signups", {
    method: "PATCH",
    query: `email=eq.${encodeURIComponent(email)}&source=eq.${encodeURIComponent(source)}`,
    body,
    prefer: "return=minimal",
  });
}

function classifyAlwaysReadyReply(replyText: string, row: WaitlistRow | null) {
  const text = replyText.trim().toLowerCase();
  if (/\b(stop|unsubscribe|remove me|opt out|do not contact|don't contact)\b/.test(text)) return "stop";
  if (/^spot[.!?\s]*$/i.test(text)) return "spot_requested";
  if (/^(yes|yes please|yep|yeah|sure|start|let'?s do it|send it|ok|okay)[.!\s]*$/i.test(text)) {
    return row?.email_4_sent_at || row?.stage === "email_4_sent" || row?.stage === "spot_opened"
      ? "onboarding"
      : "manual_review";
  }
  return "manual_review";
}

function stagePatchForReply(intent: string, replyText: string, now: string) {
  const base = {
    drip_stopped_at: now,
    last_reply_at: now,
    last_reply_text: replyText.slice(0, 1000),
    last_reply_intent: intent,
    updated_at: now,
  };

  if (intent === "stop") {
    return {
      ...base,
      status: "unsubscribed",
      stage: "unsubscribed",
      unsubscribed_at: now,
      suppressed_at: now,
    };
  }
  if (intent === "spot_requested") {
    return { ...base, status: "spot_requested", stage: "spot_requested" };
  }
  if (intent === "onboarding") {
    return { ...base, status: "onboarding", stage: "onboarding" };
  }
  return { ...base, status: "manual_review", stage: "manual_review" };
}

async function notifyOwnerOfAlwaysReadyReply(input: {
  email: string;
  businessName: string;
  firstName: string;
  intent: string;
  replyText: string;
}) {
  const title =
    input.intent === "spot_requested"
      ? `Always Ready spot requested - ${input.businessName || input.email}`
      : input.intent === "onboarding"
        ? `Always Ready onboarding YES - ${input.businessName || input.email}`
        : `Always Ready reply needs review - ${input.businessName || input.email}`;

  await createAgentTask({
    title,
    kind: "always_ready_waitlist_reply",
    priority: input.intent === "manual_review" ? "normal" : "high",
    source: "resend/always-ready-reply",
    payload: {
      email: input.email,
      businessName: input.businessName || null,
      firstName: input.firstName || null,
      intent: input.intent,
      replyText: input.replyText,
      nextAction:
        input.intent === "spot_requested"
          ? "Sales Manager decides when to set stage=spot_opened for the manual spot-open email."
          : input.intent === "onboarding"
            ? "Sales Manager sends onboarding steps and starts Always Ready intake."
            : "Sales Manager reviews and replies manually. Do not continue the drip.",
    },
  });

  const notifyTo = envValueAny("GMF_OWNER_NOTIFICATION_EMAIL", "OWNER_NOTIFICATION_EMAIL") || DEFAULT_OWNER_NOTIFY_EMAIL;
  await sendGetMeFoundEmail({
    to: notifyTo,
    subject: title,
    replyTo: envValueAny("GMF_ALWAYS_READY_REPLY_TO_EMAIL", "GMF_SALES_REPLY_TO_EMAIL", "RESEND_REPLY_TO_EMAIL") || DEFAULT_REPLY_TO,
    text: [
      title,
      "",
      `Lead: ${input.firstName || "Unknown"} <${input.email}>`,
      `Business: ${input.businessName || "Unknown"}`,
      `Intent: ${input.intent}`,
      "",
      "Reply:",
      input.replyText,
    ].join("\n"),
  });
}

async function isSuppressed(email: string) {
  if (!hasSupabaseConfig()) return false;
  const query = new URLSearchParams({
    select: "id",
    to_email: `eq.${email.trim().toLowerCase()}`,
    event_type: "in.(unsubscribe,do_not_contact,hard_bounce,complaint)",
    limit: "1",
  });
  const result = await supabaseRest<Array<{ id: string }>>("email_events", { query: query.toString() });
  return result.ok && result.data.length > 0;
}

async function sendWithRetry(input: {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
}): Promise<{ ok: true; id: string; attempts: number } | { ok: false; error: string; attempts: number }> {
  let lastError = "Unknown send failure.";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = await sendGetMeFoundEmail(input);
    if (result.ok) return { ok: true, id: result.id, attempts: attempt };
    lastError = result.error;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 800 : 2_000));
  }
  return { ok: false, error: lastError, attempts: 3 };
}

function nextSendAfter(step: SendStep) {
  if (step === 1) return addDaysIso(2);
  if (step === 2) return addDaysIso(3);
  return null;
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function footerFor(email: string) {
  const address = envValueAny("GMF_MAILING_ADDRESS", "GMF_PHYSICAL_ADDRESS", "MAILING_ADDRESS") || DEFAULT_MAILING_ADDRESS;
  return `Mike Egidio | GetMeFound, a service of AI Outsource Hub LLC | ${address} | Not interested? Reply "STOP" or unsubscribe: ${unsubscribeUrl(email)}`;
}

function unsubscribeUrl(email: string) {
  const base =
    envValueAny("GMF_PUBLIC_SITE_URL", "NEXT_PUBLIC_SITE_URL") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://getmefound.ai");
  const url = new URL("/unsubscribe", base.replace(/\/+$/, ""));
  url.searchParams.set("source", ALWAYS_READY_SOURCE);
  url.searchParams.set("email", email);
  return url.toString();
}

function firstNameFrom(name: string) {
  return cleanText(name).split(/\s+/).filter(Boolean)[0] || "there";
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function scrubPayload(payload: Record<string, unknown>) {
  const copy = { ...payload };
  delete copy.token;
  delete copy.api_key;
  delete copy.apiKey;
  delete copy.authorization;
  return copy;
}
