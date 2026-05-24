import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { envValueAny } from "@/lib/getmefound-env";

const INTERNAL_TOOL_COOKIE = "gmf_internal_tool";
const INTERNAL_TOOL_SESSION_MAX_AGE = 60 * 60 * 24 * 180;

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
  if (!expected || token !== expected) return false;

  const cookieStore = await cookies();
  cookieStore.set(INTERNAL_TOOL_COOKIE, tokenHash(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: INTERNAL_TOOL_SESSION_MAX_AGE,
  });
  return true;
}

export function expectedInternalToken() {
  return envValueAny("GMF_INTERNAL_API_TOKEN", "AOH_INTERNAL_API_TOKEN", "REPORT_TEST_BYPASS_TOKEN");
}

function tokenHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
