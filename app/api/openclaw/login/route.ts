import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const OPENCLAW_BASE = "https://hubgateway.aioutsourcehub.com";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) {
    return new Response(auth.message, {
      status: auth.status,
      headers: auth.headers,
    });
  }

  const token = process.env.OPENCLAW_TOKEN?.trim();
  if (!token) {
    return new Response("OpenClaw login is not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const action = `${OPENCLAW_BASE}/login`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="referrer" content="no-referrer" />
  <title>Opening OpenClaw...</title>
</head>
<body>
  <form id="openclaw-login" method="post" action=${JSON.stringify(action)}>
    <input type="hidden" name="token" value=${JSON.stringify(token)} />
    <noscript>
      <button type="submit">Open OpenClaw</button>
    </noscript>
  </form>
  <script>
    document.getElementById("openclaw-login").submit();
  </script>
</body>
</html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; message: string; headers: HeadersInit } {
  const expectedUser = process.env.OPENCLAW_LOGIN_USER?.trim() || "mike";
  const expectedPassword = process.env.OPENCLAW_LOGIN_PASSWORD?.trim() || "";

  if (!expectedPassword) {
    return {
      ok: false,
      status: 503,
      message: "OpenClaw login is locked until OPENCLAW_LOGIN_PASSWORD is configured.",
      headers: lockedHeaders(),
    };
  }

  const header = req.headers.get("authorization") ?? "";
  const credentials = readBasicAuth(header);
  if (!credentials) {
    return {
      ok: false,
      status: 401,
      message: "OpenClaw login requires authorization.",
      headers: challengeHeaders(),
    };
  }

  const validUser = safeCompare(credentials.user, expectedUser);
  const validPassword = safeCompare(credentials.password, expectedPassword);
  if (!validUser || !validPassword) {
    return {
      ok: false,
      status: 401,
      message: "OpenClaw login requires authorization.",
      headers: challengeHeaders(),
    };
  }

  return { ok: true };
}

function readBasicAuth(header: string): { user: string; password: string } | null {
  if (!header.toLowerCase().startsWith("basic ")) return null;

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const splitAt = decoded.indexOf(":");
    if (splitAt < 0) return null;
    return {
      user: decoded.slice(0, splitAt),
      password: decoded.slice(splitAt + 1),
    };
  } catch {
    return null;
  }
}

function safeCompare(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function challengeHeaders(): HeadersInit {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
    "WWW-Authenticate": 'Basic realm="GMF OpenClaw", charset="UTF-8"',
  };
}

function lockedHeaders(): HeadersInit {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  };
}
