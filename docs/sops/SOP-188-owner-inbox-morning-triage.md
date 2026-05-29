# SOP 188 - Owner Inbox Morning Triage

Status: Drafted - Coverage Gate Required
Version: 0.2
Owner: Manager / Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-188-owner-inbox-morning-triage.md`

## Purpose

Create a controlled path toward daily owner-level inbox triage, starting with a coverage audit that proves which mailbox, labels, aliases, and message classes the connected Gmail tool can actually see.

## Covered Master Map Rows

- Owner inbox morning triage
- Owner Gmail evidence access
- Morning brief
- Incident response
- Monday board update

## Scope

This SOP covers safe Gmail search/read triage for business operations after connector coverage is proven. It does not grant blanket permission to read, summarize, archive, label, reply to, or send every email.

Until the coverage gate passes, this SOP is a pilot and gap-detection workflow only. Manager must not promise full morning inbox triage.

## Trigger

- Daily morning operating cycle.
- Mike asks whether email has unhandled work.
- A failure notice, client reply, prospect reply, vendor warning, billing issue, access invite, or older email may have been missed.

## Expected Output

A short Manager-owned morning inbox section only after coverage is proven. Before then, expected output is a coverage report showing:

- which Gmail account/mailbox appears connected
- which system labels are visible
- which known messages are searchable
- which owner-visible messages are not searchable
- which source systems must be checked directly
- whether morning triage is reliable, partial, or blocked

When coverage is proven, the daily output includes:

- urgent owner-needed items
- agent-routed work
- system/vendor failures
- client/prospect replies
- stale unaddressed threads
- no-action/no-result proof when nothing relevant is found

## Roles

| Role | Responsibility |
|---|---|
| Manager / Elon | Owns the owner-facing summary and decides what reaches Mike |
| Systems Director | Scans system/vendor/security/GitHub/Vercel/Supabase/Stripe/Resend/Google/tool notices and verifies in source systems |
| Account Manager | Handles client/service/onboarding replies |
| Sales Rep | Handles prospect/partner/sales replies |
| Auditor | Reviews privacy, proof, escalation discipline, and missed-item patterns |
| Agent Ness | Uses triage results as one input to business improvement reporting |

## Hard Rules

- Do not claim full email visibility. Agents can see only the Gmail account/mailbox/labels exposed by the connected Gmail connector.
- Do not run or sell this as full inbox triage until a coverage audit passes.
- If Mike shows a specific email that the connector cannot find, mark a coverage gap and do not treat Gmail search as complete for that message class.
- Do not read private/personal email unless it is clearly business-relevant to GMF operations.
- Do not record security codes, passwords, raw login links, recovery codes, unrelated personal content, private attachments, or sensitive inbox text in docs, Slack, Monday, Mission Control, or proof files.
- Email search is a signal source. Source systems are the proof source for GitHub, Vercel, Supabase, Stripe, Resend, Slack, Google, Smartlead, and other platform failures.
- Sending email remains a live-send action and must follow the relevant send SOP.
- Mike sees only the business item, responsible agent, next action, and owner-needed decision.

## Coverage Gate

Before daily triage is treated as reliable, Systems Director must run a coverage audit.

Required checks:

| Check | Pass condition |
|---|---|
| Connected account identity | Connector profile/account identity is known or clearly inferred without exposing private content |
| Label/count visibility | `INBOX`, `UNREAD`, `SENT`, `SPAM`, and `TRASH` counts are visible |
| Known-message retrieval | At least three Mike-provided business emails from different sources are searchable by sender/subject/date |
| Alias coverage | `mike@getmefound.ai`, `admin@getmefound.ai`, and other GMF aliases are tested for recent business mail routing |
| System notice coverage | Known GitHub/Vercel/Supabase/Stripe/Resend/Google notices are searched and compared against source-system evidence |
| Coverage-gap log | Any message Mike can see but the connector cannot find is recorded as a gap |
| Auditor review | Auditor confirms the pilot did not expose private content or overclaim coverage |

Until all pass conditions are met, output must say `partial inbox visibility only`.

## Daily Search Buckets

Systems Director and Manager use narrow search families first, then broaden only when needed.

| Bucket | Owner | Examples |
|---|---|---|
| New unread business mail | Manager | unread/newer-than filters, excluding obvious personal/promotional categories when possible |
| System/vendor failures | Systems Director | GitHub, Vercel, Supabase, Stripe, Resend, Slack, Google, Smartlead, domain/DNS, billing, webhooks |
| Client or onboarding replies | Account Manager | known client names, `clients@`, `support@`, intake replies, setup questions |
| Prospect and partner replies | Sales Rep | visibility report replies, partner applications, checkout questions, fit-call asks |
| Older unaddressed threads | Manager / responsible role | unread older than 2 days, starred/important, sent messages with no response, owner asks not closed |
| Security/billing/legal/reputation | Manager / Systems Director / Auditor | payment failures, security alerts, account changes, complaints, reviews, legal/privacy terms |

## Procedure

1. Confirm connector coverage.
   - Use label/count checks and targeted searches.
   - If a message Mike can see is not searchable through the connector, record a coverage gap.
   - Stop short of "daily triage reliable" until the Coverage Gate passes.

2. Run daily search buckets.
   - Start with unread and newer-than windows.
   - Search high-risk senders/systems directly.
   - Search older unresolved windows such as unread older than two days, important older mail, and recent sent messages without obvious closure.

3. Classify each business-relevant item.
   - `owner_needed`
   - `agent_routed`
   - `source_system_check_required`
   - `reply_draft_needed`
   - `no_action`
   - `coverage_gap`

4. Verify source systems for platform alerts.
   - GitHub email means check GitHub Actions directly.
   - Stripe email means check Stripe directly.
   - Resend email means check Resend/domain health directly.
   - Google/GBP email means check Google/GBP access path directly when available.

5. Route work.
   - Systems Director owns technical/platform notices.
   - Account Manager owns client replies.
   - Sales Rep owns prospect/partner replies.
   - Manager owns owner-needed decisions.

6. Produce the owner summary.
   - Include at most the highest-signal items unless Mike asks for more.
   - Include who owns each item, current status, next action, and whether Mike is needed.
   - Do not paste private email bodies.

7. Update Monday/proof.
   - Create or update jobs for actionable items.
   - Record no-result or coverage-gap proof when relevant.
   - Mark stale email items with expected receive/escalate times so they cannot silently stop.

## Required Proof

- Coverage status: reliable, partial, or blocked
- Search families used, without exposing private content
- Relevant business message IDs or safe references only when needed
- Classification and owner
- Source-system verification for platform alerts
- Monday item or no-action reason
- Coverage gap note if Mike can see email but connector cannot
- Auditor review for first live pilots and any privacy/security concern

## Mike Needed Rule

Mike is needed only when:

- the connector cannot access a mailbox/account where business-critical emails live
- an owner-only approval, account verification, legal/billing/reputation decision, spend/cap change, or credential step is required
- the email requires a genuine owner reply as Mike
- the agent cannot verify a critical message after exhausting Gmail, source systems, Slack, Monday, Mission Control, docs, and public/read-only checks

## Coverage Limits

Current known limit: the connected Gmail connector can see large mailbox counts and search/read accessible messages, but it did not find the GitHub notification Mike showed on 2026-05-28. Systems Director verified the underlying GitHub issue directly in GitHub Actions. Therefore this SOP is not Active and cannot be treated as full inbox coverage until the coverage gate passes.

Possible reasons a visible Gmail UI message is not found by the connector:

- the browser is showing a different Google account than the connector
- the message is in a delegated/shared inbox, Google Group, alias route, or Workspace account not exposed to the connector
- the message is in GitHub notification UI, not the connected mailbox
- the message went to a forwarding/list address that is not searchable in the connected account
- the connector has search/read access to one mailbox but not every account Mike can view in Chrome

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pending |
| Dry run | Pending |
| Live pilot | Coverage gate required - GitHub failure email coverage gap found and source-system verification succeeded |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created after Mike asked for Elon/Manager to scan morning email for new and stale unaddressed items | Manager / Systems Director |
| 0.2 | 2026-05-28 | Added coverage gate and clarified this is not reliable full inbox triage until connector visibility is proven | Manager / Systems Director |

## Source Documents

- `docs/sops/SOP-180-owner-gmail-evidence-access.md`
- `docs/sops/SOP-126-morning-brief.md`
- `docs/sops/SOP-125-monday-board-update.md`
- `docs/sops/SOP-176-incident-response.md`
- `docs/client-ops-ledger/github-workflow-failure-triage-current.md`
