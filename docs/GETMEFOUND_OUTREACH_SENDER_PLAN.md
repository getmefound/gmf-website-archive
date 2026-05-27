# GetMeFound Outreach Sender Plan

Last updated: 2026-05-23

## Status

The GetMeFound production notification path is live:

- Main domain: `getmefound.ai`
- Transactional sender domain: `send.getmefound.ai`
- Resend status: verified
- Current use: internal contact-form notifications to `mike@getmefound.ai`

Do not use the main brand inbox or `send.getmefound.ai` for cold outreach.

Smartlead is the selected warmup/outreach platform for the first GetMeFound outbound test.

Smartlead API access was verified on 2026-05-23. The account currently has no campaigns and three connected outreach email accounts.
Namecheap API access was verified on 2026-05-23. The three outreach domains are owned in Namecheap.
Baseline Namecheap Private Email DNS was applied on 2026-05-23:

- MX: `mx1.privateemail.com`, `mx2.privateemail.com`
- SPF: `v=spf1 include:spf.privateemail.com ~all`
- DMARC monitoring: `p=none`
- `mail` CNAME: `privateemail.com`

`getmefoundlocal.com` mailbox DNS was verified on 2026-05-23:

- MX resolves to `mx1.privateemail.com` and `mx2.privateemail.com`
- SPF resolves to `v=spf1 include:spf.privateemail.com ~all`
- DKIM resolves at `default._domainkey.getmefoundlocal.com`
- DMARC resolves at `_dmarc.getmefoundlocal.com`

`trygetmefound.com` mailbox DNS was verified on 2026-05-23:

- MX resolves to `mx1.privateemail.com` and `mx2.privateemail.com`
- SPF resolves to `v=spf1 include:spf.privateemail.com ~all`
- DKIM resolves at `default._domainkey.trygetmefound.com`
- DMARC resolves at `_dmarc.trygetmefound.com`

`getmefoundnow.com` mailbox DNS was verified on 2026-05-23:

- MX resolves to `mx1.privateemail.com` and `mx2.privateemail.com`
- SPF resolves to `v=spf1 include:spf.privateemail.com ~all`
- DKIM resolves at `default._domainkey.getmefoundnow.com`
- DMARC resolves at `_dmarc.getmefoundnow.com`

The three outreach mailboxes were SMTP/IMAP verified, sent smoke emails to `mike@getmefound.ai`, and were added to Smartlead on 2026-05-23:

| Email | Smartlead ID | Warmup |
|---|---:|---|
| `mike@getmefoundlocal.com` | 18951373 | enabled |
| `mike@trygetmefound.com` | 18951374 | enabled |
| `mike@getmefoundnow.com` | 18951375 | enabled |

Current Smartlead warmup settings:

- Warmup per day: 10
- Daily rampup: 5
- Reply target: 30%
- Auto-adjust warmup: enabled
- Account max send cap from creation: 20/day
- Minimum wait between sends from account creation: 15 minutes

Smartlead draft campaign was created on 2026-05-23:

- `GetMeFound - AI Visibility Audit - Warmup Draft`
- Campaign ID: `3379589`
- No leads, sequences, schedule, or live sending are active yet.

First seed list was prepared from existing inventory on 2026-05-23:

- 3 med-spa prospects
- 3 valid emails after NeverBounce verification
- 3 QA OK rows
- Not imported into Smartlead yet

## Sending Boundary

| Lane | Domain | Status | Use |
|---|---|---|---|
| Brand inbox | `getmefound.ai` | live | Human email, Google Workspace, direct client communication |
| Transactional | `send.getmefound.ai` | live | Website notifications and future app/transactional messages |
| Outreach warmup | `trygetmefound.com`, `getmefoundlocal.com`, `getmefoundnow.com` | warming | Cold or scaled outbound only after Smartlead warmup is healthy and QA-approved |

## Outreach Domain Requirements

Use a separate domain from the main brand domain. Prefer a plain, brand-adjacent `.com` that will not confuse customers if they inspect the sender.

Chosen outreach domains:

- `trygetmefound.com`
- `getmefoundlocal.com`
- `getmefoundnow.com`

Avoid:

- sending cold email from `mike@getmefound.ai`
- sending cold email from `send.getmefound.ai`
- lookalike or misleading domains
- any domain that suggests a different company name unless the rebrand is approved

## DNS Setup

For each outreach domain:

1. Namecheap Private Email MX is configured.
2. SPF is configured.
3. DKIM is configured.
4. DMARC monitoring is configured with `p=none`.
5. Smartlead SMTP/IMAP connection is verified.

## Warmup Ladder

Use the conservative ladder already used by Reach:

| Days | Daily sends per outreach domain |
|---|---:|
| 1-3 | 10-20 |
| 4-6 | 40-50 |
| 7-9 | 80-100 |
| After day 9 | Hold for deliverability review before increasing |

Before increasing volume, check:

- bounces
- spam placement
- replies
- unsubscribes
- complaints
- duplicate prevention
- sender-domain health

## Guardrails

- HighLevel AI features stay OFF unless Mike explicitly authorizes them manually.
- No scaled sending until reply handling, unsubscribe handling, suppression, footer, sender identity, and test inbox delivery pass.
- No old AOH/GHL warmup lane should be resumed while `docs/client-ops-ledger/reach-warmup-autopilot.json` is paused.
- Do not import contacts into GHL or add start-drip tags during the GetMeFound/GHL-exit transition.

## Current Blocker

The next action is to let Smartlead warm the three accounts before adding live prospect campaigns.

Current readiness gate:

```powershell
npm run smartlead:readiness
```

The campaign should stay inactive until every active inbox passes this gate:

- SMTP and IMAP are OK
- Smartlead warmup status is `ACTIVE`
- Smartlead warmup reputation is at least 95
- each inbox has at least 10 warmup emails sent
- spam count is 0

As of 2026-05-23, all three inboxes are healthy but still below the minimum activity threshold. They have only 1 warmup sent each, so live prospect sends are intentionally on hold.

Codex can verify Smartlead API access with:

```powershell
npm run smartlead:check
```

Codex can create the read-only warmup report with:

```powershell
npm run smartlead:warmup-report
```

These checks do not create campaigns, add leads, start live sends, or change DNS.

Campaign draft/spec:

- `docs/GETMEFOUND_FIRST_SMARTLEAD_CAMPAIGN.md`

Active inboxes:

- `mike@trygetmefound.com`
- `mike@getmefoundlocal.com`
- `mike@getmefoundnow.com`

Only the three `mike@...` inboxes are active for the first warmup phase. Do not add the `hello@...` inboxes until the first three show healthy warmup status.

## Inbox Setup Checklist

For each outreach domain:

1. Confirm MX, SPF, DKIM, and DMARC.
2. Confirm SMTP/IMAP login.
3. Confirm each mailbox can send a smoke email.
4. Confirm the mailbox is connected to Smartlead.
5. Confirm warmup is enabled.
6. Keep early live sending low while warmup runs.

Smartlead supports reading email accounts through `GET /api/v1/email-accounts/` and creating SMTP/IMAP accounts through `POST /api/v1/email-accounts/save`. Google/Outlook OAuth or app-password setup may still require manual mailbox authorization in the Smartlead UI or mailbox admin.
