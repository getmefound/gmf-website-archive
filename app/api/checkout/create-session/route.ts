import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCheckoutProduct } from "@/lib/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { slug } = body as { slug?: unknown };
  if (typeof slug !== "string") {
    return NextResponse.json({ ok: false, error: "Missing product slug." }, { status: 400 });
  }

  const product = getCheckoutProduct(slug);
  if (!product) {
    return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? "https://getmefound.ai";

  const session = await stripe.checkout.sessions.create({
    mode: product.stripeMode,
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    success_url: `${origin}/checkout/success?product=${product.slug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/${product.slug}`,
    metadata: { product_slug: product.slug, product_name: product.name },
    billing_address_collection: "required",
    customer_email: undefined,
    allow_promotion_codes: false,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
