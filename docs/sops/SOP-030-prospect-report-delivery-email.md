# SOP 030 - Prospect report delivery email

Status: Drafted
Version: 0.3
Owner: Sales Rep
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-030-prospect-report-delivery-email.md`

## Purpose

Send an Auditor-approved prospect visibility report from the correct sales lane, log the send, and start the follow-up cadence without treating the prospect as a client.

## Covered Master Map Rows

- Prospect report delivery email

## Scope

This SOP covers the work from trigger through expected output for the covered master-map row(s). It is a first-pass controlled draft and must pass SOP 000 testing gates before it can become Active.

## Trigger

Auditor approves a prospect visibility report.

## Expected Output

Report email sent, logged, and moved to `report_sent_no_signup` unless the prospect buys, replies, or requests a call immediately.

## Roles

| Role | Responsibility |
|---|---|
| Sales Rep | Owns the prospect relationship and sends the report |
| Reporter | Provides the approved report artifact |
| Auditor | Approves the report and delivery language before send |
| Sales Manager | Resolves fit, pricing, or custom-promise questions |
| Systems Director | Maintains Resend/email logging and sender routing |

## Hard Rules

- Do not perform client/prospect-facing action unless this SOP and required approvals allow it.
- Do not guarantee rankings, reviews, revenue, Google outcomes, AI visibility, approval timelines, or deliverability results.
- Stop and route risk before acting when billing, legal/privacy, reputation, access, deliverability, public claims, or live sends are involved.
- No live send without current approval, suppression checks, proof preview, and a logged owner.
- Treat emerging AI/search/agentic commerce guidance as advisory unless Mike approves implementation or client-facing scope.
- Sales Rep sends prospect reports. Reporter does not send reports directly.
- Use the GMF role/Resend sender lane from SOP 187; do not send routine reports as Mike.
- Do not use cold outreach mailboxes for requested-report delivery.

## Procedure

1. Confirm the prospect record.
   - Verify `visibility_reports.run_id`, business name, contact email, report context, report URL, report type, and source.

2. Confirm Auditor approval.
   - Report status must be `approved_to_send` or equivalent proof must be attached.
   - If not approved, return to Reporter/Auditor.

3. Check suppression and fit.
   - Stop if unsubscribed, bounced, no-fit, existing client, competitor, upset, legal/reputation risk, or duplicate request conflict.

4. Select sender.
   - Default: Resend from `RESEND_FROM_EMAIL` with reply-to `GMF_SALES_REPLY_TO_EMAIL`, `casey@getmefound.ai`, or verified fallback `support@getmefound.ai`.
   - Do not use `mike@getmefound.ai` unless Mike approves owner-branded delivery.

5. Prepare message.
   - Include the report link.
   - Include one sentence naming the biggest visible gap.
   - Include one next action: Get Found checkout, fit call, or reply with questions.
   - Keep the email short.

6. Send and log.
   - Log provider, recipient, subject, status, provider ID if available, sender lane, report run ID, and next due date in `email_events`/events.
   - Update `lead_status` to `report_sent_no_signup`.
   - Schedule SOP 031 follow-up: Day 2, Day 7, Day 14.

## Required Proof

- Report run ID and artifact URL
- Auditor approval proof
- Suppression/fit check
- Sender/reply-to lane
- Suppression/approval proof, preview, send log, and failure list when relevant
- Updated `lead_status`
- Day 2 next due date
- Blocker/escalation note if not complete

## What To Log

- Status: pass, watch, blocked, done, held, or escalated
- Owner/operator
- Related client, prospect, partner, system, report, or financial record
- Output/proof link
- Next owner and due date
- Exception or escalation reason, if any

## Communication Rule

Use GMF-safe language. Keep messages short, specific, and tied to observable facts. Do not send client/prospect-facing communication from this SOP unless the owner role is authorized to do so and all required approvals exist.

## Mike Escalation Rule

Escalate to Mike only for pricing, offers, refunds, billing, commissions, tool spend, legal/privacy risk, reputation risk, public promises, credential ownership, HighLevel AI feature toggles, live prospecting clearance, direct checkout, agentic checkout, payments, or merchant-of-record risk.

## Failure Or Blocker Handling

1. Stop unsafe action.
2. Record what failed or what is missing.
3. Assign the blocker to the correct owner.
4. Notify Manager if timeline, client/prospect experience, billing, access, reputation, or live-send safety is affected.
5. Notify Mike only if the Mike escalation rule applies.
6. Mark this SOP Needs Update if the documented process caused the failure.

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
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded into first-pass role-specific controlled draft | Coach |
| 0.3 | 2026-05-28 | Added requested-report sender, report delivery, logging, and nurture handoff rules | Manager / Sales Manager / Coach |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-031-prospect-follow-up-cadence.md`
- `docs/sops/SOP-187-gmf-email-identity-and-sender-routing.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
