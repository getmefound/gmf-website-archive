# GMF Email Sender Registry

Status: draft registry
Owner: Systems Director / Manager
Reviewer: Auditor
Created: 2026-05-28

Do not store passwords, recovery codes, 2FA codes, API keys, DKIM private keys, or private inbox content in this registry.

## Current Rule

Agents do not routinely send as Mike.

- Mike email: owner identity, vendor/Google account control, final approvals, and high-risk exceptions.
- Paid sales email exception: one dedicated client-facing Google Workspace sales mailbox is allowed if Mike approves the seat, because sales replies, calendar, deliverability, and inbox separation justify it.
- Role email: routine business communication.
- Resend: app-generated and logged system/transactional mail.
- Outreach mailboxes: prospecting only, never client service.
- Do not buy a separate paid Google Workspace seat for each role address unless Manager and Mike approve the cost and reason.
- Do not create fake human proof around a sales mailbox. No fake biography, fake headshot, fake LinkedIn, fake employment history, or claim that a human personally performed automated work.

## Recommended No-Extra-Seat Setup

Use aliases first.

Google Workspace supports alternate email aliases on a user account. For GMF's current size, route role addresses like `sales@`, `clients@`, `profile@`, `reviews@`, `partners@`, and `billing@` into the existing owner/admin mailbox or a verified support mailbox.

Use a Google Group or Collaborative Inbox only when there are multiple humans who need assignment, shared ownership, or team-level visibility.

Use Resend for app-generated sending and logging, with `reply-to` set to a monitored role alias. Resend is not the inbox.

Important: an email alias is not a separate Google Account. Do not rely on an alias for Google Business Profile manager access, Google login, Drive ownership, Workspace admin, or vendor account ownership. For those, use the real Google account `mike@getmefound.ai` unless a paid admin account is later approved.

## Recommended Paid Sales Seat

Best first paid seat: `casey@getmefound.ai`.

Use first name `Casey`, last name `Morgan`, username `casey`, and display name `Casey Morgan` when Google Workspace requires a first/last name.

Use it as the real client-facing Sales Rep inbox for visibility-report leads, fit-call scheduling, quote questions, partner replies, and warm prospect conversations. Route aliases like `reports@`, `partners@`, or `sales@` into this inbox if that keeps operations simpler.

The point is a clean named GMF-controlled inbox, not a fabricated human profile. Do not create a fake biography, fake headshot, fake LinkedIn, fake employment history, or any other external proof that pretends this is a separate human employee. If a prospect asks, answer truthfully that Casey is GMF's sales desk/agent identity.

If a prospect asks whether AI or automation is involved, Sales Rep answers truthfully: GMF uses agents and automation behind the scenes with Manager/Sales oversight and human accountability for approvals.

## Name Selection Rationale

Recommended name: `Casey Morgan`.

Why this name:

- The sender identity should feel like a person, not a department blast.
- The first name is short, familiar, easy to spell, and relatively gender-neutral.
- The last name is common, easy to pronounce, and not strongly tied to a celebrity or promotional term.
- The email `casey@getmefound.ai` avoids role words like `sales`, `info`, `marketing`, `promo`, or `no-reply`.
- The signature and display context should still connect to the brand: `Casey at GetMeFound` or `Casey Morgan | GetMeFound`.

Research basis:

- Mailchimp sender-name guidance says sender names shape first impression, should be recognizable/relevant, and generic names like `Info` or `No Reply` can reduce engagement: https://mailchimp.com/resources/sender-name/
- Campaign Monitor notes sender trust is a major driver of opens and recommends an effective, consistent from name/address: https://help.campaignmonitor.com/articles/Knowledge/from-name-and-address
- NextAfter sender-name testing supports that a more person-like sender presentation can improve email engagement in some contexts: https://www.nextafter.com/experiments/how-presentation-of-a-sender-name-impacted-open-rates-on-a-survey/
- Industrial marketing research found that changing only the sender name affected response behavior, which supports treating the name as an operating variable: https://doi.org/10.1016/0019-8501(94)90011-6
- Field research on gendered sender names shows that name gender can change response behavior and treatment, so GMF should prefer a neutral, low-friction name and measure reply quality: https://www.cambridge.org/core/journals/american-political-science-review/article/silenced-text-field-experiments-on-gendered-experiences-of-political-participation/E008099CDD9573F7D8ADB128919EFDC4

## Sender Registry

| Address / setting | Lane | Current status | Owner | Use | Notes |
|---|---|---|---|---|---|
| `mike@getmefound.ai` | Owner identity | known owner address | Mike / Manager | Google/vendor ownership, owner approvals, internal alerts fallback | Not routine agent sending |
| `support@getmefound.ai` | Role mailbox | used in site/docs; routing must be verified | Account Manager / Systems Director | Public support/contact and fallback reply-to | Prefer alias or group; verify monitored inbox before relying on replies |
| `admin@getmefound.ai` | Platform/admin | candidate; routing must be verified | Systems Director | Receiving admin notices only if mailbox/alias works | Alias is not a Google login; do not use for GBP manager access unless it is a real account |
| `casey@getmefound.ai` | Paid sales mailbox | created by owner; verification in progress | Sales Rep / Sales Manager | Visibility report delivery, prospect follow-up, fit calls, checkout questions | Internal test sent 2026-05-28; do not use live until receive/send, recovery, and reply-to proof pass |
| `sales@getmefound.ai` | Alias / internal routing | optional alias/group | Sales Rep / Sales Manager | Internal routing or catch-all for people who type sales@ | Avoid as primary external sender |
| `reports@getmefound.ai` | Role mailbox | optional alias/group | Sales Rep / Reporter | Report-specific replies if separate from sales inbox | Optional; do not use until monitored |
| `clients@getmefound.ai` | Role mailbox | recommended alias/group | Account Manager | Client onboarding, setup updates, recaps | Create as alias/group before use |
| `profile@getmefound.ai` | Role mailbox | recommended alias/group | Account Manager / Profile Manager | GBP access instructions and profile-work replies | Account Manager sends; Profile Manager supplies facts |
| `reviews@getmefound.ai` | Role mailbox | recommended alias/group | Reviews Manager / Account Manager | Review-request replies and feedback routing | Create as alias/group before use |
| `partners@getmefound.ai` | Role mailbox | recommended alias/group | Sales Rep / Sales Manager | Partner applicant replies | `GMF_PARTNER_REPLY_TO_EMAIL` should point here once monitored |
| `billing@getmefound.ai` | Role mailbox | recommended alias/group | Manager / Systems Director | Billing questions and failed-payment replies | Create as alias/group before use |
| `RESEND_FROM_EMAIL` | Resend system | present in current env proof | Systems Director | App-generated emails | From address is environment-controlled |
| `GMF_PARTNER_REPLY_TO_EMAIL` | Resend reply-to | optional env | Systems Director / Sales Manager | Partner application replies | Falls back to `GMF_SUPPORT_EMAIL` then `support@getmefound.ai` |
| `GMF_OPS_ALERT_EMAIL` | Internal alert recipient | optional env | Systems Director / Manager | Internal notifications | Falls back to `AOH_OPS_ALERT_EMAIL`, then `mike@getmefound.ai` |

## Verification Needed

Systems Director should verify for each role mailbox before live use:

- mailbox or alias exists
- receive test passes
- reply/send path is allowed if needed
- recovery/admin owner is recorded in password manager, not docs
- responsible role is named
- Resend reply-to routes to a monitored inbox

## Latest Resend Proof

2026-05-28: `npm run systems:stripe-resend-key-rotation-smoke` passed. Stripe account/prices and Resend domain health are active in the local runtime; production Resend health is green. The check did not send an email.
