import { envValue } from "@/lib/getmefound-env";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; id: string; status: number }
  | { ok: false; status: number; error: string };

export async function sendGetMeFoundEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = envValue("RESEND_API_KEY");
  const from = envValue("RESEND_FROM_EMAIL");
  if (!apiKey || !from) {
    return { ok: false, status: 0, error: "Resend environment variables are missing." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
    cache: "no-store",
  }).catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Resend error.";
    return new Response(JSON.stringify({ message }), { status: 0 });
  });

  const data = (await response.json().catch(() => null)) as {
    id?: string;
    message?: string;
    error?: string;
  } | null;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: data?.message || data?.error || "Resend rejected the email.",
    };
  }

  return { ok: true, status: response.status, id: data?.id ?? "" };
}

export async function getResendDomainStatus(domain = "send.getmefound.ai") {
  const apiKey = envValue("RESEND_API_KEY");
  if (!apiKey) {
    return { ok: false as const, status: 0, error: "RESEND_API_KEY is missing." };
  }

  const response = await fetch("https://api.resend.com/domains", {
    headers: { authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  }).catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Resend error.";
    return new Response(JSON.stringify({ message }), { status: 0 });
  });

  const data = (await response.json().catch(() => null)) as {
    data?: Array<{ name: string; status: string; capabilities?: Record<string, string> }>;
    message?: string;
  } | null;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: data?.message || "Could not read Resend domains.",
    };
  }

  const match = data?.data?.find((item) => item.name === domain);
  return {
    ok: Boolean(match),
    status: response.status,
    domain,
    domainStatus: match?.status ?? "missing",
    capabilities: match?.capabilities ?? {},
  };
}
