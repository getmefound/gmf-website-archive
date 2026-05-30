import { createHmac, timingSafeEqual } from "node:crypto";
import { envValueAny } from "@/lib/getmefound-env";

export type ClientMagicLinkPayload = {
  slug: string;
  email?: string;
  exp?: number;
  v?: 1;
};

export type ClientMagicLinkResult =
  | { ok: true; payload: ClientMagicLinkPayload }
  | { ok: false; reason: "missing_token" | "missing_secret" | "bad_format" | "bad_signature" | "wrong_client" | "expired" };

export function createClientMagicLinkToken(input: {
  slug: string;
  email?: string;
  expiresAt?: number;
}) {
  const secret = clientMagicLinkSecret();
  if (!secret) throw new Error("CLIENT_MAGIC_LINK_SECRET, REPORT_LINK_SECRET, or GMF_INTERNAL_API_TOKEN is required.");

  const payload: ClientMagicLinkPayload = {
    slug: cleanClientSlug(input.slug),
    email: input.email?.trim().toLowerCase() || undefined,
    exp: input.expiresAt,
    v: 1,
  };
  const payloadPart = base64Url(JSON.stringify(payload));
  return `${payloadPart}.${signPayload(payloadPart, secret)}`;
}

export function verifyClientMagicLinkToken(token: string | undefined, expectedSlug: string): ClientMagicLinkResult {
  const raw = token?.trim();
  if (!raw) return { ok: false, reason: "missing_token" };

  const secret = clientMagicLinkSecret();
  if (!secret) return { ok: false, reason: "missing_secret" };

  const [payloadPart, signaturePart] = raw.split(".");
  if (!payloadPart || !signaturePart) return { ok: false, reason: "bad_format" };

  const expectedSignature = signPayload(payloadPart, secret);
  if (!safeEqual(signaturePart, expectedSignature)) return { ok: false, reason: "bad_signature" };

  try {
    const payload = JSON.parse(unbase64Url(payloadPart).toString("utf8")) as ClientMagicLinkPayload;
    if (cleanClientSlug(payload.slug) !== cleanClientSlug(expectedSlug)) {
      return { ok: false, reason: "wrong_client" };
    }
    if (payload.exp && Date.now() > payload.exp) return { ok: false, reason: "expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "bad_format" };
  }
}

export function clientAccessTokenFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const value = searchParams.access;
  return Array.isArray(value) ? value[0] : value;
}

export function withClientAccessParam(path: string, accessToken: string | undefined) {
  const token = accessToken?.trim();
  if (!token) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}access=${encodeURIComponent(token)}`;
}

function clientMagicLinkSecret() {
  return envValueAny("CLIENT_MAGIC_LINK_SECRET", "REPORT_LINK_SECRET", "GMF_INTERNAL_API_TOKEN");
}

function cleanClientSlug(value: string) {
  return value.trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}

function signPayload(payloadPart: string, secret: string) {
  return base64Url(createHmac("sha256", secret).update(payloadPart).digest());
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function unbase64Url(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
