# SOP 187 - GMF Email Identity And Sender Routing

Status: Drafted
Version: 0.3
Owner: Systems Director / Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-187-gmf-email-identity-and-sender-routing.md`

## Purpose

Define which email identity GMF agents use so the business can operate without casually impersonating Mike, losing replies, hurting deliverability, or mixing owner-only actions with routine client work.

## Covered Master Map Rows

- Email identity and sender routing
- Owner Gmail evidence access
- Resend domain and email health
- Client email template library
- Partner email template library
- Live send approval

## Trigger

- An agent needs to send, draft, read, or route email.
- A workflow needs a from address, reply-to address, or monitored inbox.
- A platform asks for an owner email, admin email, or verification address.
- A new GMF role mailbox or alias is created.

## Sender Lanes

| Lane | Use | Default owner | Examples |
|---|---|---|---|
| Owner identity | Owner-only platform control, final approvals, identity/2FA/video verification, legal, billing, reputation risk | Mike / Manager | `mike@getmefound.ai` |
| Paid sales mailbox | Client-facing sales conversations where inbox separation, deliverability, calendar, and reply handling justify one Google Workspace seat | Sales Manager / Sales Rep | approved named sales mailbox such as `casey@getmefound.ai` |
| Role mailbox | Human business communication by role | Account Manager, Sales Rep, Manager | `support@`, `clients@`, `profile@`, `reviews@`, `partners@`, `billing@` |
| Resend system | App-generated, transactional, notification, review request, report, client hub, partner confirmation | Systems Director | verified GMF sending domain and approved from/reply-to |
| Outreach mailbox | Cold prospecting only, with deliverability controls | Sales Manager / Systems Director | Smartlead-managed outreach inboxes |

## Hard Rules

- Agents do not routinely send as Mike.
- A client-facing sales mailbox may be paid and dedicated if Mike approves the seat.
- The recommended paid mailbox is a clean named inbox, not a role-word inbox. Current approved candidate: `casey@getmefound.ai`.
- Use first name `Casey`, last name `Morgan`, username `casey`, and display name `Casey Morgan` if Google Workspace requires a first/last name.
- Route `reports@` and `partners@` into the paid mailbox unless separate inboxes become operationally necessary.
- A sales identity may use a stable name/display identity, but it must not have a fake biography, fake headshot, fake LinkedIn profile, fake employment history, fake calendar availability, or claim that a human personally performed work that was actually automated.
- Prefer role-based or brand-based display names like `GetMeFound Sales` or `GMF Visibility Team`. Use a named sales display only after Manager approves the exact name and the identity rules in this SOP.
- Name choice is an operating variable. Use `Casey Morgan` until reply-rate data proves a better GMF-owned sales desk identity.
- If a prospect directly asks whether AI is involved, answer truthfully: GMF uses agents and automation behind the scenes, with Manager/Sales oversight and human accountability for approvals.
- Mike's email can be searched/read for approved evidence under SOP 180, but live sends from Mike require explicit approval or an owner-only workflow.
- Specialists do not email clients directly. They prepare proof, blockers, and exact requested action for Account Manager.
- Sales Rep owns prospect and partner applicant email before payment or approval handoff.
- Account Manager owns client email after signup.
- Resend must use a verified domain and a monitored reply-to path.
- No live client, prospect, review-request, partner, vendor-critical, legal, billing, reputation, or access email goes out without the relevant SOP and send log.
- Do not use cold outreach mailboxes for client service.
- Do not use Mike's personal/owner mailbox for cold outreach.
- Do not store passwords, recovery codes, API keys, 2FA codes, or raw login links in docs, Slack, Monday, or proof artifacts.

## Recommended GMF Mailbox Map

| Address | Purpose | Notes |
|---|---|---|
| `mike@getmefound.ai` | Owner identity and final owner decisions | Not routine agent sending |
| `casey@getmefound.ai` | Primary client-facing Sales Rep mailbox | Best paid-seat candidate if Mike wants a dedicated sales inbox/calendar without using `sales@` |
| `sales@getmefound.ai` | Optional internal alias only | Avoid as primary external sender because role-word inboxes can feel lower-trust |
| approved named sales mailbox | Sales Rep display identity | Use only as a real GMF-controlled sales identity; no fake personal backstory |
| `support@getmefound.ai` | Public support/contact fallback | Already used across site/docs |
| `admin@getmefound.ai` | Platform/admin invites only if a real mailbox or alias exists | Must be monitored before use |
| `clients@getmefound.ai` | Client onboarding, setup updates, monthly recaps | Account Manager lane |
| `profile@getmefound.ai` | GBP/access-related client instructions if separate from clients inbox | Account Manager sends; Profile Manager supplies facts |
| `reviews@getmefound.ai` | Review-request replies and feedback routing | Reviews Manager/Account Manager lane |
| `partners@getmefound.ai` | Partner applications and partner support | Sales Rep/Sales Manager lane |
| `billing@getmefound.ai` | Billing questions, receipts, failed payments | Manager/Systems Director lane |
| `no-reply@getmefound.ai` or configured Resend from | Transactional no-reply only | Reply-to must still be monitored when a reply is expected |

Systems Director must verify each mailbox/alias exists, receives mail, can be recovered, and has routing ownership before agents rely on it.

## Procedure

1. Classify the email purpose.
   - Owner-only, role-human, system/transactional, or cold outreach.

2. Pick the sender lane.
   - Owner identity: use Mike only when platform/decision risk requires Mike.
   - Role mailbox: use the role address for normal client/prospect/vendor communication.
   - Resend: use for app-generated sends and logged relationship mail.
   - Outreach mailbox: use only for approved prospecting campaigns.

3. Confirm routing.
   - Verify the from address, reply-to, monitored inbox, and responsible role.
   - If routing cannot be proven, Systems Director owns the fix before live send.

4. Draft before sending.
   - Use the relevant email template SOP when available.
   - Keep language specific, factual, short, and claim-safe.
   - Specialists provide facts; Account Manager or Sales Rep owns the send.

5. Run live-send guard.
   - Check approvals, suppression/stop rules, proof preview, client/prospect status, and risk.
   - Use SOP 171 for live-send approval when the message is externally visible or risk-bearing.

6. Send and log.
   - Record sender, recipient, subject, date/time, workflow, message ID when available, and proof link.
   - Update Monday/client hub/report if the email changes status or ownership.

7. Handle replies.
   - Route replies to the responsible role.
   - Account Manager handles client replies.
   - Sales Rep handles prospect/partner replies.
   - Manager handles owner-needed decisions.

## Mike Needed Rule

Mike is needed only when:

- a platform requires the owner identity or owner inbox
- Google/vendor verification requires owner-only action, 2FA, video, or identity proof
- legal, billing, reputation, refund, public promise, or customer-facing risk requires owner decision
- an email must genuinely be sent as Mike and no role mailbox is appropriate

Before asking Mike, agents must exhaust Gmail evidence, docs, Monday, Mission Control, Slack, role mailbox routing checks, Resend health checks, and safe drafts.

## Required Proof

- Sender lane selected
- From and reply-to verified
- Owning role identified
- Draft/preview saved when needed
- Approval gate result
- Send log or no-send reason
- Reply routing owner
- Monday/proof update

## Failure Or Blocker Handling

- Mailbox missing: Systems Director creates or repairs alias/mailbox/routing before live send.
- Reply-to unmonitored: hold send until monitored routing exists.
- Resend domain or key fails: follow SOP 134 and environment/key rotation checks.
- Need to send as Mike: Manager prepares smallest exact draft and asks Mike only after proof shows no role mailbox is appropriate.
- Sensitive owner/account email appears: do not copy private content; record only task-relevant business fact.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pending |
| Dry run | Pending |
| Live pilot | Pending |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created sender identity policy after Mike asked whether agents use Mike email, their own GMF email, or Resend | Manager / Systems Director |
| 0.2 | 2026-05-28 | Added one-seat paid sales mailbox exception and blocked fake-person sales identities | Manager / Systems Director |
| 0.3 | 2026-05-28 | Switched recommended paid sales mailbox from role-word `sales@` to named inbox `casey@getmefound.ai` | Manager / Systems Director |

## Source Documents

- `docs/AGENT_OPERATING_MODEL.md`
- `docs/sops/SOP-171-live-send-approval.md`
- `docs/sops/SOP-180-owner-gmail-evidence-access.md`
- `docs/sops/SOP-134-resend-domain-and-email-health.md`
- `docs/sops/SOP-164-client-email-template-library.md`
- `docs/sops/SOP-165-partner-email-template-library.md`
- Mailchimp sender-name guidance: https://mailchimp.com/resources/sender-name/
- Campaign Monitor from-name guidance: https://help.campaignmonitor.com/articles/Knowledge/from-name-and-address
- NextAfter sender-name experiment: https://www.nextafter.com/experiments/how-presentation-of-a-sender-name-impacted-open-rates-on-a-survey/
- Chawla and Nataraajan sender-name response study: https://doi.org/10.1016/0019-8501(94)90011-6
- American Political Science Review gendered sender-name field experiment: https://www.cambridge.org/core/journals/american-political-science-review/article/silenced-text-field-experiments-on-gendered-experiences-of-political-participation/E008099CDD9573F7D8ADB128919EFDC4
