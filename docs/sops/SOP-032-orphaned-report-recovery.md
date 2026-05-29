# SOP 032 - Orphaned Report Recovery

Status: Drafted
Version: 0.3
Owner: Sales Rep
Reviewer: Sales Manager / Auditor
Approver: Sales Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-032-orphaned-report-recovery.md`

## Purpose

Recover value from free visibility reports that were requested and delivered but did not become clients, without chasing, spamming, or confusing the prospect with an active client.

## Covered Master Map Rows

- Orphaned report recovery
- Prospect follow-up cadence
- Closed-lost and nurture classification

## Scope

This SOP starts after SOP 031 reaches Day 14 final soft close or when a report is older than 14 days with no signup, no reply, and no clear outcome.

## Trigger

- `lead_status = final_soft_close` and no reply/payment.
- Report older than 14 days with `report_sent_no_signup`.
- Sales Manager requests a review of orphaned reports.
- Manager or Sentinel flags orphaned reports as a conversion leak.

## Roles

| Role | Responsibility |
|---|---|
| Sales Rep | Owns recovery classification and any approved nurture email |
| Sales Manager | Reviews fit, recovery angle, and whether to continue or close |
| Reporter | Provides updated visible proof only if a new report angle is justified |
| Auditor | Reviews any new claim-heavy or risk-bearing message |
| Systems Director | Ensures suppression, send logs, and pipeline status work |
| Manager | Monitors owner-visible conversion leak and stuck recovery work |

## Recovery Classifications

| Classification | Meaning | Next action |
|---|---|---|
| `nurture` | Fit remains, no urgency or no response | Low-frequency value-only nurture |
| `closed_lost` | Prospect declined or clearly chose not to proceed | Stop sales follow-up |
| `no_fit` | Wrong business, too small, wrong geography, risky, competitor, or bad data | Suppress or no-fit nurture only |
| `refresh_needed` | Report is stale or original data was weak | Reporter may refresh public proof before one new email |
| `call_requested` | Prospect asked to talk | Route to Manager/Sales Rep call path |
| `checkout_started` | Started checkout but did not pay | Move to abandoned checkout SOP |

## Procedure

1. Review the orphaned report.
   - Check report date, report link, business fit, source, last email, replies, bounces, unsubscribes, and checkout status.

2. Classify the outcome.
   - Choose exactly one recovery classification.
   - Do not keep a prospect in active follow-up forever.

3. Check suppression and risk.
   - Stop if unsubscribed, bounced, no-fit, upset, legal/reputation risk, or existing client conflict.

4. Decide whether there is a real reason to contact again.
   - Good reason: new Google/profile change, seasonal timing, obvious report-backed gap, fresh public proof, or prospect engaged previously.
   - Bad reason: "just checking in" with no new value.

5. Draft or hold.
   - Sales Rep drafts only if there is a useful reason.
   - Sales Manager approves the angle.
   - Auditor reviews if the message adds new claims or risk.

6. Send or move to nurture.
   - If sending, use the role/Resend lane defined in SOP 187.
   - If not sending, update stage to `nurture`, `closed_lost`, or `no_fit`.

7. Log recovery result.
   - Update `visibility_reports.lead_status`.
   - Add `visibility_report_events` entry.
   - Log any send in `email_events`.
   - Mirror important blockers/leaks in Monday.

## Recovery Timing

| Timing | Action |
|---|---|
| Day 14 after report delivery | Final soft close under SOP 031 |
| Day 30 | One useful nurture email if fit remains |
| Day 60-90 | Optional second nurture if there is a new useful reason |
| Quarterly | Sales Manager reviews orphaned report list for patterns |

Do not exceed one nurture email per month unless the prospect replies or asks for updates.

## Required Proof

- Original report URL/run ID
- Last send date
- Last stage
- Suppression check
- Recovery classification
- Sales Manager angle decision
- Send/no-send reason
- Updated pipeline status

## Mike Escalation Rule

Mike is not involved in orphaned report recovery unless:

- prospect explicitly asks for Mike
- custom pricing/offer exception is proposed
- legal, reputation, billing, or public promise risk exists
- Sales Manager wants to change the offer or guarantee language

## Failure Or Blocker Handling

- No clear stage: Sales Rep reconstructs from `visibility_report_events`, `email_events`, and Monday.
- Missing report URL: Reporter attempts recovery; if not found, classify as `refresh_needed` or `closed_lost`.
- Bounce/unsubscribe: Systems Director suppresses and logs.
- Automation missed a due date: Manager opens stuck-agent rescue under SOP 183.

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
|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded into first-pass role-specific controlled draft | Coach |
| 0.3 | 2026-05-28 | Added orphaned report classification, recovery timing, nurture limits, and logging requirements | Manager / Sales Manager / Coach |

## Source Documents

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/sops/SOP-031-prospect-follow-up-cadence.md`
- `docs/sops/SOP-035-abandoned-cart-recovery-cadence.md`
- `docs/sops/SOP-171-live-send-approval.md`
- `docs/sops/SOP-187-gmf-email-identity-and-sender-routing.md`
