import { cleanEnvValue } from "@/lib/env";

export type EnvCheck = {
  name: string;
  present: boolean;
  public: boolean;
};

const REQUIRED_ENV = [
  { name: "NEXT_PUBLIC_SUPABASE_URL", public: true },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", public: true },
  { name: "SUPABASE_SECRET_KEY", public: false },
  { name: "OPENAI_API_KEY", public: false },
  { name: "RESEND_API_KEY", public: false },
  { name: "RESEND_FROM_EMAIL", public: false },
] as const;

export function envValue(name: string) {
  return cleanEnvValue(process.env[name]);
}

export function getEnvChecks(): EnvCheck[] {
  return REQUIRED_ENV.map((item) => ({
    name: item.name,
    public: item.public,
    present: Boolean(envValue(item.name)),
  }));
}

export function getMissingEnv() {
  return getEnvChecks().filter((item) => !item.present);
}

export function requireServerEnv(name: string) {
  const value = envValue(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseSecretKey() {
  return envValue("SUPABASE_SECRET_KEY") || envValue("SUPABASE_SERVICE_ROLE_KEY");
}
