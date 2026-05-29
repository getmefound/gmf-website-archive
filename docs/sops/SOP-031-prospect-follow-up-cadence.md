# SOP 031 - Prospect Follow-Up Cadence

Status: Drafted
Version: 0.4
Owner: Sales Rep
Reviewer: Coach/Auditor
Approver: Sales Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-031-prospect-follow-up-cadence.md`

## Purpose

Turn a requested visibility report into a helpful sales conversation without confusing the prospect with a paying client, over-emailing them, or sending unsupported claims.

## Covered Master Map Rows

- Prospect follow-up cadence
- Orphaned report recovery
- Prospect report delivery email
- Free visibility check request intake

## Scope

This SOP starts when a prospect requests a free visibility report and ends when the prospect buys, books/requests a call, declines, goes to nurture, is marked no-fit, or unsubscribes.

This is for requested/inbound or warm-requested reports. Cold prospecting campaigns stay in Smartlead/outreach SOPs until the prospect requests a report or replies with interest.

## Trigger

- Website free visibility report requested.
- Warm prospect asks for a report from outreach.
- Auditor approves a prospect visibility report for delivery.
- Report was sent and the prospect has not bought or replied.

## Pipeline Source Of Truth

| Layer | Source of truth |
|---|---|
| Report/request record | Supabase `visibility_reports` |
| Report timeline | Supabase `visibility_report_events` |
| Email send log | Supabase `email_events` |
| Agent work/blockers | Monday `Agents Jobs` |
| Owner view | Mission Control `/mike-mc/visibility-reports` |
| Cold outbound only | Smartlead |

## Pipeline Stages

Use these `lead_status` values for prospect report nurture:

| Stage | Meaning | Owner | Next action |
|---|---|---|---|
| `free_check_queued` | Homepage request accepted and queued | Automation | Run fast verification/enrichment/send path |
| `free_check_processing` | Automated report is being enriched/sent | Automation | Complete within five minutes or use safe fallback |
| `free_check_requested` | Manual/warm report requested | Sales Rep | Confirm request and assign Scout/Reporter |
| `report_building` | Manual scan/report in progress | Scout / Reporter | Build public report |
| `report_ready_for_audit` | Report ready but not cleared | Auditor | Audit claims and CTA |
| `approved_to_send` | Auditor approved delivery | Sales Rep | Send report |
| `report_sent_nurture_enrolled` | Automated report sent, no payment/reply yet | Sales Rep / Automation | Start cadence |
| `report_sent_no_signup` | Manual report sent, no payment/reply yet | Sales Rep | Start cadence |
| `follow_up_day_2` | First helpful follow-up due/sent | Sales Rep | Ask if report made sense |
| `follow_up_day_7` | Recommendation follow-up due/sent | Sales Rep | One next step |
| `final_soft_close` | Final direct follow-up due/sent | Sales Rep | Close loop or nurture |
| `nurture` | Low-frequency value-only follow-up | Sales Rep / Sales Manager | Monthly/quarterly useful note |
| `call_requested` | Prospect asked for a call | Sales Rep / Manager | Route call decision |
| `checkout_started` | Prospect started checkout | Systems Director / Sales Rep | Move to abandoned checkout SOP if incomplete |
| `purchased_get_found` | Get Found checkout completed | Manager | Stop nurture and start paid onboarding |
| `closed_won` | Payment/signed approval/manual start | Manager | Sales-to-client handoff |
| `closed_lost` | Prospect declined | Sales Rep | Stop sales cadence |
| `no_fit` | Not a fit | Sales Manager | Stop or no-fit nurture |
| `unsubscribed` | Opted out | Systems Director / Sales Rep | Suppress immediately |

## Roles

| Role | Responsibility |
|---|---|
| Sales Rep | Owns prospect relationship, sends report and follow-up, logs stage |
| Scout | Performs public scan and notes fit/risk |
| Reporter | Builds the prospect report artifact |
| Auditor | Approves report and any claim-heavy follow-up before send |
| Sales Manager | Owns offer fit, recovery angle, no-fit, and upgrade/custom promise questions |
| Systems Director | Maintains Supabase, Resend, event logs, and no-send/suppression controls |
| Manager | Watches blockers and owner-visible status; asks Mike only for decision-grade exceptions |
| Coach | Maintains email templates and safe language |

## Sender Rule

- Sales Rep is the business sender for prospect report emails.
- Use the GMF role-mailbox/Resend lane, not Mike's personal owner identity and not cold-outreach mailboxes.
- Default from path: verified `RESEND_FROM_EMAIL`.
- Default reply-to: `casey@getmefound.ai` once verified; until then use `support@getmefound.ai` or the configured `GMF_SALES_REPLY_TO_EMAIL`.
- Internal alerts can go to `GMF_OPS_ALERT_EMAIL`.
- Mike's `mike@getmefound.ai` is only used for owner-only exceptions, final owner decisions, or if Mike explicitly approves an owner-branded send.

## Timing Cadence

Timing is counted from the report delivery email unless stated otherwise.

| Time | Stage | Email | Sender | Purpose |
|---|---|---|---|---|
| Immediately after homepage request | `free_check_queued` -> `free_check_processing` | Automated visibility report | System via Resend; reply-to Sales Rep lane | Deliver personalized report and one clear Get Found next step |
| Same business day when possible; next business day if manual | `approved_to_send` -> `report_sent_no_signup` | Manual report delivery | Sales Rep via role/Resend lane | Send report and one clear recommended next step |
| 2 business days after delivery | `follow_up_day_2` | Helpful check-in | Sales Rep | Ask whether the report made sense; no pressure |
| 7 calendar days after delivery | `follow_up_day_7` | One fix to prioritize | Sales Rep | Restate one observed gap and Get Found next step |
| 14 calendar days after delivery | `final_soft_close` | Close the loop | Sales Rep | Ask whether to close the file or help with the first step |
| 30+ days after delivery | `nurture` | Low-frequency nurture | Sales Rep / Sales Manager | Useful tip, Google/profile change, seasonal reminder, or new proof |

Homepage automation target is under five minutes. If enrichment is slow or unavailable, the system sends a safe fallback report rather than delaying. Manual reports use the same-business-day rule.

## Email Content Rules

- Keep each email short: one reason, one observation, one next action.
- Mention only facts from the report or visible public evidence.
- Do not repeat the full report in email.
- Do not guarantee rankings, calls, sales, reviews, map-pack placement, AI Overview/AI Mode placement, or timelines.
- Do not mention internal agent names, Monday, Supabase, Mission Control, or SOPs.
- Do not send a checkout link in every email. Use it in report delivery and Day 7 when fit is clear.
- If the prospect asks a question, answer the question and pause the sequence.

## Cadence Detail

### Request Confirmation

Trigger: `free_check_queued` or `free_check_requested`.

Owner: Systems Director for automation; Sales Rep owns the prospect lane.

Message goal:

- confirm request
- for homepage automation, the report email itself is the confirmation
- for manual reports, say the report is being prepared and set expectation for delivery
- invite a correction if business info is wrong

### Report Delivery

Trigger: homepage automation completes, or Auditor sets `report_status = approved_to_send` for manual reports.

Owner: Sales Rep.

Required before send:

- for homepage automation, approved template/guardrails and safe data fallback
- for manual reports, report link/artifact and Auditor approval
- suppression check
- sender/reply-to verified
- stage logged

Message goal:

- deliver the report
- summarize the biggest visible gap in one sentence
- recommend Get Found or a fit call only if report supports it

### Day 2 Helpful Check-In

Trigger: no reply, no payment, no call request, no unsubscribe two business days after delivery.

Owner: Sales Rep.

Message goal:

- ask if the report made sense
- offer to point out the first fix
- no hard pitch

### Day 7 Recommendation

Trigger: no reply/sign-up seven calendar days after delivery.

Owner: Sales Rep.

Message goal:

- name one specific report-backed fix
- link to Get Found checkout or ask if they want the first step handled
- do not introduce new unsupported claims

### Day 14 Final Soft Close

Trigger: no reply/sign-up fourteen calendar days after delivery.

Owner: Sales Rep.

Message goal:

- close the loop kindly
- offer to leave them alone
- keep door open for later
- move to `nurture` if appropriate

### Day 30+ Nurture

Trigger: prospect did not opt out, did not become no-fit, and still has an observable fit.

Owner: Sales Rep; Sales Manager reviews the nurture angle.

Cadence:

- no more than monthly unless the prospect asks for updates
- use useful triggers: Google change, new local profile tip, seasonal review reminder, or updated public gap
- no repeated "checking in" emails without new value

## Stop And Branch Rules

Stop the nurture sequence immediately when:

- prospect buys
- prospect asks for a call
- prospect replies with a question
- prospect declines
- prospect unsubscribes or says stop
- email bounces
- prospect is no-fit
- legal/reputation/billing risk appears
- checkout starts but payment fails; move to abandoned checkout SOP

Branching:

| Event | New status | Owner |
|---|---|---|
| Payment complete | `purchased_get_found` or `closed_won` | Manager opens onboarding |
| Checkout started, no payment | `checkout_started` | Systems Director / Sales Rep run abandoned checkout SOP |
| Call requested | `call_requested` | Sales Rep routes to Manager |
| Custom scope/pricing requested | hold current cadence | Sales Manager decides |
| Client/prospect upset | hold current cadence | Manager/Auditor review |
| Unsubscribe/stop | `unsubscribed` | Systems Director suppresses |

## Required Proof

- Visibility report row/run ID
- Report artifact URL
- Auditor approval event
- Sender/reply-to lane
- Email preview or template used
- Send log in `email_events`
- Updated `lead_status`
- Next due date
- Stop/branch reason when sequence stops

## What To Log

In `visibility_report_events`:

- `requested`
- `email_verified`
- `automation_started`
- `enrichment_succeeded` / `enrichment_fallback`
- `report_building`
- `ready_for_audit`
- `approved_to_send`
- `report_sent`
- `email_click`
- `follow_up_sent`
- `reply_received`
- `call_requested`
- `checkout_started`
- `closed_won`
- `purchase`
- `closed_lost`
- `nurture_started`
- `suppressed`

In Monday:

- active owner
- next action
- due date
- blocker
- proof link
- human needed yes/no

## Mike Escalation Rule

Mike is not involved in routine nurture.

Ask Mike only for:

- custom pricing/offer exception
- legal, billing, reputation, or public promise risk
- prospect asks specifically to talk to Mike
- live prospecting clearance outside this requested-report lane
- tool spend/cap change
- owner-branded email as Mike

## Failure Or Blocker Handling

- Report not ready: Reporter owns correction; Auditor keeps send blocked.
- Sender/reply-to not verified: Systems Director fixes before live send.
- Prospect asks a complex question: Sales Rep drafts; Sales Manager or Coach reviews if needed.
- Claim risk appears: Auditor blocks send and gives exact edits.
- Automation misses due date: Manager opens stuck-agent rescue under SOP 183 and logs recovery.

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
| 0.3 | 2026-05-28 | Added requested visibility report nurture pipeline, timing cadence, sender rules, stop rules, and logging requirements | Manager / Sales Manager / Coach |
| 0.4 | 2026-05-29 | Added automated homepage report statuses, five-minute target, fallback-send rule, click logging, and purchase stop-flow | Systems Director / Elon |

## Source Documents

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/sops/SOP-002-free-visibility-check-intake-report-delivery.md`
- `docs/sops/SOP-030-prospect-report-delivery-email.md`
- `docs/sops/SOP-032-orphaned-report-recovery.md`
- `docs/sops/SOP-171-live-send-approval.md`
- `docs/sops/SOP-187-gmf-email-identity-and-sender-routing.md`
