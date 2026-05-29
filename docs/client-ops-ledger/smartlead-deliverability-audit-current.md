# Smartlead Deliverability Audit

Date: 2026-05-29
Mode: read-only; no settings changed and no email sent
Auditor: Systems Director / Sender / Auditor

## Universal Cold Email Guardrail

- Use outreach domains only, never the main `getmefound.ai` brand domain for cold prospecting.
- Use only warmed Smartlead inboxes with SMTP/IMAP connected, clean warmup, and conservative caps.
- Disable open and click tracking unless Manager and Auditor approve a tracked test with a proper tracking domain.
- Send plain-text-leaning email, one CTA link max, no attachments, no images, no URL shorteners.
- Stop the sequence on any reply, form fill, purchase, unsubscribe, complaint, hard bounce, or manual suppression.
- Include clear opt-out language and the physical mailing address in every commercial cold email.
- Required footer address: 13727 SW 152nd St. #1236, Miami, FL 33177
- Honor global suppression, unsubscribe, duplicate, and community bounce lists; never bypass them during import.
- Default early launch cap: no more than 30 new prospects/day across the first campaign unless Mike approves a higher cap after proof.

## Campaign Summary

| Campaign | Status | Leads | Senders | Sequences | Daily Cap | Aggregate |
|---|---|---:|---:|---:|---:|---|
| GetMeFound - CT Med Spa Visibility Seed - 2026-06-01 (3379589) | PAUSED | 3 | 3 | 1 | 3 | HOLD |

## Findings

### GetMeFound - CT Med Spa Visibility Seed - 2026-06-01 (3379589)

| Status | Check | Detail |
|---|---|---|
| PASS | launch state | Campaign is PAUSED; no accidental live send. |
| PASS | tracking | Open and click tracking are disabled. |
| PASS | plain text | Campaign is set to send as plain text. |
| PASS | stop rule | Sequence stops on reply. |
| PASS | daily cap | Campaign cap is 3/day, within 30/day guardrail. |
| PASS | sender mike@getmefoundnow.com | SMTP is connected. |
| PASS | sender mike@getmefoundnow.com | IMAP is connected. |
| PASS | sender mike@getmefoundnow.com | Uses outreach domain getmefoundnow.com. |
| PASS | sender mike@getmefoundnow.com | No tracking domain is set. |
| PASS | sender mike@getmefoundnow.com | Mailbox cap is 20/day. |
| PASS | sender mike@trygetmefound.com | SMTP is connected. |
| PASS | sender mike@trygetmefound.com | IMAP is connected. |
| PASS | sender mike@trygetmefound.com | Uses outreach domain trygetmefound.com. |
| PASS | sender mike@trygetmefound.com | No tracking domain is set. |
| PASS | sender mike@trygetmefound.com | Mailbox cap is 20/day. |
| PASS | sender mike@getmefoundlocal.com | SMTP is connected. |
| PASS | sender mike@getmefoundlocal.com | IMAP is connected. |
| PASS | sender mike@getmefoundlocal.com | Uses outreach domain getmefoundlocal.com. |
| PASS | sender mike@getmefoundlocal.com | No tracking domain is set. |
| PASS | sender mike@getmefoundlocal.com | Mailbox cap is 20/day. |
| PASS | sequence 1 | Opt-out/stop language exists. |
| HOLD | sequence 1 | Add physical mailing address: 13727 SW 152nd St. #1236, Miami, FL 33177. |
| PASS | sequence 1 | Link count is 0. |

## Operating Interpretation

- `PASS`: campaign matches the deliverability profile.
- `WATCH`: not automatically blocked, but Auditor must review before increasing volume or launching.
- `HOLD`: do not activate or send until corrected and re-audited.

