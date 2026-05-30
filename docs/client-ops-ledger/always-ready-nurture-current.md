# Always Ready Early-Access Nurture Current

Date: 2026-05-29

## Inspection

- Website waitlist form existed at `components/sections/AlwaysReadyWaitlist.tsx`.
- Intake route existed at `app/api/waitlist/route.ts`.
- Supabase waitlist table migration existed at `supabase/migrations/002-waitlist-signups.sql`, but only stored simple pending rows.
- Resend sender existed through `lib/getmefound-email.ts` using `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
- No Always Ready Resend drip, reply-stage handler, Email 4 trigger, or waitlist pipeline view existed before this pass.

## Built

- `/api/waitlist` now normalizes Always Ready sources to `source=always-ready-waitlist`, stores the lead, and sends Email 1 immediately through Resend.
- `/api/always-ready/nurture/cron` catches unsent direct Supabase waitlist rows, processes due Email 2 and Email 3, and sends Email 4 only when `stage=spot_opened`.
- `/api/always-ready/events` handles replies:
  - `STOP` -> `stage=unsubscribed`, suppress, stop drip.
  - `SPOT` -> `stage=spot_requested`, stop drip, notify owner queue.
  - `YES` after Email 4 -> `stage=onboarding`, stop drip, notify owner queue.
  - Any other reply -> `stage=manual_review`, stop drip, notify owner queue.
- `/unsubscribe?source=always-ready-waitlist&email=...` now suppresses Always Ready waitlist leads.
- `vercel.json` now runs the nurture cron every 30 minutes.
- Supabase migration `003-always-ready-nurture.sql` adds queryable nurture fields and `always_ready_waitlist_pipeline_view`.

## Sender Rule

Always Ready nurture uses the primary Resend/GetMeFound sender path. It does not use SmartLead or cold-outreach subdomains.

## Verification

- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed. Existing Turbopack warning remains in the CBC extract route import trace, unrelated to Always Ready nurture.

## Live Gates

- Run `supabase/migrations/003-always-ready-nurture.sql` in Supabase.
- Confirm production `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, Supabase env vars, and `CRON_SECRET` are live.
- Configure the Resend inbound/reply webhook to post to `/api/always-ready/events`.
- Mike still needs to provide/confirm the demo clip link, final founding terms, and mailing address if different from the Miami fallback.
