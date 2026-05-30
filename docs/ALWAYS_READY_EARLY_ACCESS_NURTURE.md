# Always Ready Early-Access Nurture

Owner: Sales Manager / Systems Director

Purpose: Warm inbound leads from the Always Ready waitlist get a relationship nurture from the primary GetMeFound Resend domain. This is not a SmartLead/cold-domain campaign.

## Trigger

Website waitlist form posts to `/api/waitlist`.

The route normalizes Always Ready page/pricing sources into:

```text
source = always-ready-waitlist
```

It stores the lead in `waitlist_signups`, sends Email 1 immediately, and sets the next nurture send for Day 2. The cron also catches any direct Supabase row with `source=always-ready-waitlist` that has not received Email 1 yet.

## Sequence

| Step | Trigger | Sender | Automation |
| --- | --- | --- | --- |
| Email 1 | Signup | Resend primary GMF domain | Immediate |
| Email 2 | Day 2-3 | Resend primary GMF domain | `/api/always-ready/nurture/cron` |
| Email 3 | Day 5-7 | Resend primary GMF domain | `/api/always-ready/nurture/cron` |
| Email 4 | `stage = spot_opened` | Resend primary GMF domain | Trigger-only, not part of drip |

The Vercel cron checks every 30 minutes and only sends due rows.

## Reply Handling

Inbound reply events post to `/api/always-ready/events`.

Rules:

- `STOP`, unsubscribe, remove me, opt out -> `stage = unsubscribed`, suppress, stop drip.
- `SPOT` -> `stage = spot_requested`, stop drip, create owner-visible task.
- `YES` after Email 4 -> `stage = onboarding`, stop drip, create owner-visible task.
- Any other reply -> `stage = manual_review`, stop drip, create owner-visible task.

## Supabase View

Run `supabase/migrations/003-always-ready-nurture.sql`.

Owner-visible view:

```text
public.always_ready_waitlist_pipeline_view
```

Useful columns:

- `stage`
- `nurture_step`
- `next_send_at`
- `email_1_sent_at`
- `email_2_sent_at`
- `email_3_sent_at`
- `email_4_sent_at`
- `last_reply_intent`
- `can_receive_automation`

## Required Env

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CRON_SECRET` or `GMF_ALWAYS_READY_NURTURE_TOKEN`
- `GMF_ALWAYS_READY_EVENTS_TOKEN` or `GMF_INTERNAL_API_TOKEN`

Optional:

- `GMF_ALWAYS_READY_REPLY_TO_EMAIL`
- `GMF_OWNER_NOTIFICATION_EMAIL`
- `ALWAYS_READY_DEMO_CLIP_URL`
- `ALWAYS_READY_FOUNDING_TERMS`
- `GMF_MAILING_ADDRESS`

## Placeholders

Mike still needs to supply or confirm:

- demo clip link for Email 2
- exact build-fee waiver and start-commitment language for Email 4
- final mailing address if different from the current Miami fallback
