import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await supabaseRest("newsletter_subscribers", {
      method: "POST",
      prefer: "resolution=ignore-duplicates",
      body: {
        email,
        source: "getmefound.ai/newsletter",
        created_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
