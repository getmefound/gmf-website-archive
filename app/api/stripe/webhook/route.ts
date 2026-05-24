import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseRest } from "@/lib/supabase-rest";
import { postToSlack, GMF_MANAGER_CHANNEL } from "@/lib/slack";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Stripe webhook signature failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    const session =
      event.type === "checkout.session.completed"
        ? (event.data.object as Stripe.Checkout.Session)
        : null;

    if (!session) return NextResponse.json({ ok: true });

    const productSlug = session.metadata?.product_slug ?? "unknown";
    const productName = session.metadata?.product_name ?? "Unknown";
    const customerEmail = session.customer_details?.email ?? null;
    const customerName = session.customer_details?.name ?? null;
    const amountTotal = session.amount_total ? session.amount_total / 100 : null;
    const mode = session.mode;
    const sessionId = session.id;

    await Promise.allSettled([
      saveToSupabase({
        sessionId,
        productSlug,
        productName,
        customerEmail,
        customerName,
        amountTotal,
        mode,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      }),
      notifySlack({ productName, customerEmail, customerName, amountTotal, mode, sessionId }),
    ]);
  }

  return NextResponse.json({ ok: true });
}

async function saveToSupabase(data: {
  sessionId: string;
  productSlug: string;
  productName: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number | null;
  mode: string;
  stripeCustomerId: string | null;
}) {
  const result = await supabaseRest("stripe_orders", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      stripe_session_id: data.sessionId,
      product_slug: data.productSlug,
      product_name: data.productName,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      amount_total: data.amountTotal,
      mode: data.mode,
      stripe_customer_id: data.stripeCustomerId,
      created_at: new Date().toISOString(),
    },
  });
  if (!result.ok) {
    console.error("Stripe order Supabase save failed", result.error);
  }
}

async function notifySlack(data: {
  productName: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number | null;
  mode: string;
  sessionId: string;
}) {
  const amount = data.amountTotal != null ? `$${data.amountTotal.toFixed(2)}` : "unknown";
  const typeLabel = data.mode === "subscription" ? "subscription" : "one-time payment";

  const message = `*New ${typeLabel} — ${data.productName}*

*Customer:* ${data.customerName ?? "not provided"} — ${data.customerEmail ?? "no email"}
*Amount:* ${amount}
*Plan:* ${data.productName}
*Stripe session:* ${data.sessionId}

Manager — new paying client. Start onboarding: collect business details, confirm GBP access, set up their service. Escalate to Mike only if onboarding is blocked.`;

  const result = await postToSlack(GMF_MANAGER_CHANNEL, message);
  if (!result.ok) {
    console.error("Stripe webhook Slack post failed", result.error);
  }
}
