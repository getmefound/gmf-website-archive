# API Key Rotation Smoke Check

Date: 2026-05-28T15:44:00.889Z
Owner: Systems Director
Mode: read-only; no secret values printed

## Owner Summary

Pass: OpenAI and Supabase keys are present and active in this runtime; production Supabase and ops health are green.

## Env Sources Loaded

- .env.prod
- .env.vercel
- .env.vercel.local
- .env.local

## Required Key Names

| Env var | Present |
|---|---:|
| OPENAI_API_KEY | yes |
| NEXT_PUBLIC_SUPABASE_URL | yes |
| SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY | yes |

## OpenAI

| Check | Result |
|---|---|
| Endpoint | `GET /v1/models` |
| Status | 200 |
| Active | yes |
| Model count visible | 120 |
| Duration ms | 690 |
| Error |  |

## Supabase

| Check | Result |
|---|---|
| REST root status | 200 |
| `tooling_status` read status | 200 |
| Active | yes |
| REST root ok | yes |
| App table read ok | yes |
| Duration ms | 2028 |
| Error |  |

### Supabase Candidate Checks

| Key env | Format | Header mode | REST root | App table read | Result |
|---|---|---|---:|---:|---|
| SUPABASE_SECRET_KEY | sb_secret | apikey-only | 200 | 200 | pass |
| SUPABASE_SECRET_KEY | sb_secret | bearer-same | 200 | 200 | pass |
| SUPABASE_SERVICE_ROLE_KEY | sb_secret | apikey-only | 200 | 200 | pass |
| SUPABASE_SERVICE_ROLE_KEY | sb_secret | bearer-same | 200 | 200 | pass |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | sb_publishable | apikey-only | 401 | 200 | fail |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | sb_publishable | bearer-same | 401 | 200 | fail |

## Production Health

| Endpoint | HTTP status | Health ok | Summary |
|---|---:|---:|---|
| `/api/health/supabase` | 200 | yes | ok=true; database=200 |
| `/api/health/ops` | 200 | yes | ok=true; resend=true; supabase=200 |

## Safety Notes

- No key values, tokens, headers, or secret fingerprints were printed.
- No writes were made to OpenAI or Supabase.
- Supabase check verifies both project REST auth and the app-critical `tooling_status` read used by the health route.
