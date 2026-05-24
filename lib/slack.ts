type SlackPostResult =
  | { ok: true; ts: string }
  | { ok: false; error: string };

export async function postToSlack(
  channel: string,
  text: string,
): Promise<SlackPostResult> {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  if (!token) return { ok: false, error: "SLACK_BOT_TOKEN not set" };

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel, text }),
    });
    const data = (await res.json()) as { ok: boolean; ts?: string; error?: string };
    if (!data.ok) return { ok: false, error: data.error ?? "Slack error" };
    return { ok: true, ts: data.ts ?? "" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Slack post failed" };
  }
}

export const GMF_MANAGER_CHANNEL = "C0B6Q9DENN4";
