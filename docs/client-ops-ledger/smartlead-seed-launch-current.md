# Smartlead Seed Launch Proof

Status: paused - superseded by max-safe send approval packet
Launch date: 2026-06-01
Send window: 10:15-11:30 America/New_York
Campaign ID: 3379589
Campaign: GetMeFound - CT Med Spa Visibility Seed - 2026-06-01
Owner approval: Mike approved Monday mid-morning sends from the three outreach inboxes in chat, then clarified that he wants the max-safe per-inbox plan reviewed before sending.

Current hold: campaign `3379589` is paused. Do not send until Mike approves the expanded approval packet in `docs/client-ops-ledger/smartlead-monday-max-send-approval-packet.md`.

## Safety Gates

- Smartlead preflight: pass
- Sender readiness: pass
- Live cap: 3 seed leads total
- Sending accounts: 3 outreach inboxes
- Main `getmefound.ai` inbox: not used for cold outreach
- Sequence: one initial email only; no follow-up steps in this seed launch
- Opt-out language: included in body
- Internal test email: completed before activation

## Sender Assignment

| Lead | Prospect Email | Assigned Sender |
|---|---|---|
| Magnolia Med Spa | amanda@magnoliamedspact.com | mike@getmefoundnow.com |
| The MedSpa Old Wethersfield | feelgood@ctfacialmedspa.com | mike@trygetmefound.com |
| Milford Med Spa | frontdesk@holistichealingpartners.com | mike@getmefoundlocal.com |

## Smartlead Actions

- add_sequence: skipped (sequence_already_exists)
- link_sender_accounts: completed
- add_leads: skipped (target_leads_already_exist)
- assign_sender: completed
- assign_sender: completed
- assign_sender: completed
- update_schedule: completed
- update_settings: completed
- send_internal_test_email: completed
- activate_campaign: completed

## Monitoring

- Systems Director checks Smartlead first-window stats Monday after 12:00 ET.
- Sorter/Sales Rep watches replies and stops manual follow-up on replies, bounces, unsubscribes, or complaints.
- Manager escalates only if deliverability/reputation risk, angry reply, billing/spend, or owner-level sales decision appears.
