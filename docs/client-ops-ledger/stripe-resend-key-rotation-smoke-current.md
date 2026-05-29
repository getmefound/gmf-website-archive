# Stripe And Resend Key Rotation Smoke Check

Date: 2026-05-28T19:30:10.150Z
Owner: Systems Director
Mode: read-only; no key values, headers, tokens, or secret fingerprints printed

## Owner Summary

Pass: Stripe account/prices and Resend domain health are active in this runtime; production Resend health is green.

## Env Sources Loaded

- .env.prod
- .env.vercel
- .env.vercel.local
- .env.local

## Required Key Names

| Env var | Present | Format |
|---|---:|---|
| STRIPE_SECRET_KEY | yes | sk_live_ |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | yes | pk_live_ |
| STRIPE_WEBHOOK_SECRET | yes | whsec_ |
| RESEND_API_KEY | yes | re_ |
| RESEND_FROM_EMAIL | yes |  |

## Stripe

| Check | Result |
|---|---|
| Account API status | 200 |
| Account API active | yes |
| Charges enabled | yes |
| Payouts enabled | yes |
| Details submitted | yes |
| Country visible | yes |
| Error |  |

### Configured Stripe Prices

| Price ID | Status | Active | Recurring | Currency | Result |
|---|---:|---:|---:|---|---|
| `price_1TakBqLyThSzGsL4l30CMrei` | 200 | yes | no | usd | pass |
| `price_1Tb0VDLyThSzGsL4BAWAI6sD` | 200 | yes | yes | usd | pass |
| `price_1TbSBfLyThSzGsL40nKPg4cB` | 200 | yes | no | usd | pass |
| `price_1TakBsLyThSzGsL409oKbEZG` | 200 | yes | yes | usd | pass |

## Resend

| Check | Result |
|---|---|
| Domains API status | 200 |
| API active | yes |
| Domain checked | `send.getmefound.ai` |
| Domain status | verified |
| Verified | yes |
| Error |  |

## Production Health

| Endpoint | HTTP status | Health ok | Summary |
|---|---:|---:|---|
| `/api/health/resend` | 200 | yes | ok=true; domain=verified |
| `/api/health/ops` | 200 | yes | ok=true; resend=true; resendStatus=verified; supabase=200 |

## Safety Notes

- No Stripe checkout session was created.
- No Stripe webhook event was sent.
- No Resend email was sent.
- This smoke verifies Stripe account/prices, Resend domain auth, and live production Resend health only.
