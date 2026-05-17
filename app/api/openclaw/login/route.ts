import { NextResponse } from "next/server";

const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "http://2.24.198.207:56006";

export async function GET() {
  try {
    const loginUrl = `${OPENCLAW_BASE}/login`;
    console.log("🔓 OpenClaw login", { url: loginUrl, token: OPENCLAW_TOKEN.slice(0, 5) + "..." });

    // POST token to OpenClaw login endpoint (must be absolute URL)
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(OPENCLAW_TOKEN)}`,
      redirect: "manual",
    });

    console.log("📡 OpenClaw response", { status: res.status });

    // Extract Set-Cookie header from OpenClaw response
    const setCookie = res.headers.get("set-cookie");
    const location = res.headers.get("location");

    console.log("🍪 Cookie:", setCookie ? "present" : "none", "| Location:", location);

    // Session is in the connect.sid cookie, redirect to OpenClaw homepage
    // (ignore location header which contains fragment)
    const redirectUrl = `${OPENCLAW_BASE}/`;
    console.log("🔄 Redirect to:", redirectUrl, "| With cookie:", setCookie ? "yes" : "no");

    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Forward the session cookie so user stays logged in after redirect
    if (setCookie) {
      redirectResponse.headers.set("set-cookie", setCookie);
      console.log("✅ Session cookie forwarded");
    }

    return redirectResponse;
  } catch (error) {
    console.error("❌ OpenClaw login failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
