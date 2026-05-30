import { after, NextRequest } from "next/server";
import { recordAlwaysReadyUnsubscribe } from "@/lib/always-ready-nurture";
import { recordFreeVisibilityUnsubscribe } from "@/lib/free-visibility-report";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")?.trim() ?? "";
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? "";
  const source = req.nextUrl.searchParams.get("source")?.trim() ?? "";

  if (runId || email) {
    after(async () => {
      if (source === "always-ready-waitlist") {
        await recordAlwaysReadyUnsubscribe({ email });
      } else {
        await recordFreeVisibilityUnsubscribe({ runId, email });
      }
    });
  }

  return new Response(renderUnsubscribePage(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function renderUnsubscribePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Unsubscribed - GetMeFound</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #0e1117; color: #f6f7fb; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      section { max-width: 560px; border: 1px solid rgba(255,255,255,.14); border-radius: 14px; padding: 32px; background: #171b24; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0; color: rgba(246,247,251,.76); line-height: 1.55; }
      a { color: #62d491; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>You are unsubscribed.</h1>
        <p>We will stop GetMeFound follow-up emails for this visibility check. If this was a mistake, email <a href="mailto:support@getmefound.ai">support@getmefound.ai</a>.</p>
      </section>
    </main>
  </body>
</html>`;
}
