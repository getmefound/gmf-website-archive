import { envValue, getSupabaseSecretKey } from "@/lib/getmefound-env";

type SupabaseRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: string;
  body?: unknown;
  prefer?: string;
};

export type SupabaseResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; code?: string };

export function hasSupabaseConfig() {
  return Boolean(envValue("NEXT_PUBLIC_SUPABASE_URL") && getSupabaseSecretKey());
}

function supabaseRestBaseUrl(rawUrl: string) {
  const url = rawUrl.replace(/\/+$/, "");
  return url.endsWith("/rest/v1") ? url : `${url}/rest/v1`;
}

export async function supabaseRest<T>(
  table: string,
  options: SupabaseRequestOptions = {},
): Promise<SupabaseResult<T>> {
  const url = envValue("NEXT_PUBLIC_SUPABASE_URL")?.replace(/\/+$/, "");
  const key = getSupabaseSecretKey();
  if (!url || !key) {
    return { ok: false, status: 0, error: "Supabase environment variables are missing." };
  }

  const query = options.query ? `?${options.query.replace(/^\?/, "")}` : "";
  const response = await fetch(`${supabaseRestBaseUrl(url)}/${table}${query}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      "user-agent": "getmefound-server/1.0",
      ...(options.prefer ? { prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  }).catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Supabase error.";
    return errorResult(message);
  });

  if (!(response instanceof Response)) return response;

  const data = (await response.json().catch(() => null)) as
    | { message?: string; error?: string; code?: string }
    | T
    | null;

  if (!response.ok) {
    const error =
      data && typeof data === "object" && "message" in data
        ? data.message
        : data && typeof data === "object" && "error" in data
          ? data.error
          : "Supabase request failed.";
    const code = data && typeof data === "object" && "code" in data ? data.code : undefined;
    return {
      ok: false,
      status: response.status,
      error: error ?? "Supabase request failed.",
      code,
    };
  }

  return { ok: true, status: response.status, data: data as T };
}

function errorResult(message: string): SupabaseResult<never> {
  return { ok: false, status: 0, error: message };
}
