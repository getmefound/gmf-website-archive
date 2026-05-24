import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { envValueAny } from "@/lib/getmefound-env";

const INTERNAL_TOOL_COOKIE = "gmf_internal_tool";
const INTERNAL_TOOL_SESSION_MAX_AGE = 60 * 60 * 24 * 180;
const INTERNAL_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const INTERNAL_LOGIN_MAX_FAILURES = 8;

const failedInternalLogins = new Map<string, number[]>();

export async function hasInternalToolSession() {
  const expected = expectedInternalToken();
  if (!expected) return { ok: false as const, message: "Internal token is not configured." };

  const bearer = (await headers()).get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (bearer && bearer === expected) return { ok: true as const };

  const token = (await cookies()).get(INTERNAL_TOOL_COOKIE)?.value ?? "";
  if (token !== tokenHash(expected)) return { ok: false as const, message: "Access required." };

  return { ok: true as const };
}

export async function startInternalToolSession(token: string) {
  const expected = expectedInternalToken();
  const credential = token.trim();
  const loginKey = await internalLoginKey();
  if (!expected || loginIsBlocked(loginKey) || !isValidInternalCredential(credential, expected)) {
    recordFailedLogin(loginKey);
    return false;
  }

  failedInternalLogins.delete(loginKey);

  const cookieStore = await cookies();
  cookieStore.set(INTERNAL_TOOL_COOKIE, tokenHash(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: INTERNAL_TOOL_SESSION_MAX_AGE,
  });
  return true;
}

export function expectedInternalToken() {
  return envValueAny("GMF_INTERNAL_API_TOKEN", "REPORT_TEST_BYPASS_TOKEN");
}

function expectedOwnerPin() {
  return envValueAny("GMF_OWNER_PIN");
}

function isValidInternalCredential(credential: string, expected: string) {
  const ownerPin = expectedOwnerPin();
  return secureCompare(credential, expected) || Boolean(ownerPin && secureCompare(credential, ownerPin));
}

async function internalLoginKey() {
  const headerStore = await headers();
  const fwd = headerStore.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

function loginIsBlocked(key: string) {
  const recent = recentFailedLogins(key);
  failedInternalLogins.set(key, recent);
  return recent.length >= INTERNAL_LOGIN_MAX_FAILURES;
}

function recordFailedLogin(key: string) {
  const recent = recentFailedLogins(key);
  recent.push(Date.now());
  failedInternalLogins.set(key, recent);
}

function recentFailedLogins(key: string) {
  const now = Date.now();
  return (failedInternalLogins.get(key) ?? []).filter((time) => now - time < INTERNAL_LOGIN_WINDOW_MS);
}

function secureCompare(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  return tokenHash(a) === tokenHash(b);
}

function tokenHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
