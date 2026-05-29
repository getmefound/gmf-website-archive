# SOP 002 - Free Visibility Check Intake To Report Delivery

Status: Drafted
Version: 0.2
Owner: Sales Rep
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-002-free-visibility-check-intake-report-delivery.md`

## Purpose

Turn a free visibility check request into a useful, claim-safe prospect report and sales follow-up without confusing the prospect with a paying client.

## Covered Master Map Rows

- Free visibility check request intake
- Free visibility scan research
- Prospect visibility report build
- Prospect report claim audit
- Prospect report delivery email

## Scope

Covers prospect-facing free report intake, research, report build, audit, delivery, and handoff to follow-up.

Does not cover client onboarding, full client baseline reports, recurring monthly reports, or abandoned checkout recovery.

## Trigger

- Website free visibility check CTA submission
- Manual lead asks for a free report
- Sales Rep requests a scan/report for a qualified prospect
- Warm prospect asks for a visibility scan from outreach

## Roles

| Role | Responsibility |
|---|---|
| Sales Rep | Owns prospect relationship, intake, delivery, and follow-up |
| Scout | Performs public research and fit notes |
| Reporter | Builds the prospect report |
| Auditor | Checks claims, tone, proof, and recommendation before send |
| Sales Manager | Resolves offer-fit or custom-promise questions |

## Hard Rules

- A free report is a sales asset, not a client deliverable.
- Do not open onboarding from a free report alone.
- Do not show the full client-only scoring rubric or full competitor audit.
- Do not send a report until Auditor approves it.
- Do not promise rankings, reviews, revenue, Google placement, AI Overview inclusion, AI Mode visibility, or timelines.
- Sales Rep sends prospect reports. Reporter does not send reports directly.

## Procedure

1. Intake the request.
   - Capture name, business, website, location, email, source, and requested service if known.
   - Create or update the prospect record/report job.
   - If the request is spam, competitor snooping, or no-fit, hold and route to Sales Manager.

2. Confirm report context.
   - Use `prospect_free_check` for website CTA reports.
   - Use `prospect_campaign_reply` for outreach replies asking for a scan.
   - Keep prospect report ownership in Sales Rep lane.

3. Run public scan.
   - Scout checks public website, GBP presence, basic business facts, review freshness, visible trust signals, and nearby competitor clues.
   - Do not use private tools, client credentials, or paid deep audit steps for a free report unless Manager approves.

4. Build the short report.
   - Reporter creates a one-page/short-screen prospect report.
   - Include a simple visibility/AI-readiness score, 2-3 observed gaps, and one clear Get Found recommendation.
   - Use locked or greyed sections only as a light sales cue, not as fake analysis.

5. Audit the report.
   - Auditor checks that all claims are supported by visible proof.
   - Auditor removes guarantees, overstatements, full-client detail, and unsupported AI/Search claims.
   - If the report fails, return to Reporter with edits.

6. Deliver the report.
   - Sales Rep sends the approved report link or attachment.
   - Log sent date, report link, and follow-up date.

7. Start follow-up cadence.
   - Day 0: send report.
   - Day 2: helpful check-in.
   - Day 7: one clear next step.
   - Day 14: final gentle follow-up or nurture.
   - Stop if prospect buys, declines, unsubscribes, asks for a call, or becomes no-fit.

## Required Proof

- Prospect/report record
- Public scan notes
- Report artifact link
- Auditor approval
- Delivery email/log
- Follow-up status

## Communication Rule

Free report emails should be short, useful, and plain-English. Position Get Found as the next step only when the report shows a real visibility foundation gap.

## Failure Or Blocker Handling

- Missing business data: Sales Rep asks one clarifying question.
- No public footprint: Reporter notes limited public data and recommends foundation cleanup.
- Risky claim: Auditor blocks send.
- Prospect asks for custom scope/pricing: Sales Manager reviews before response.
- Prospect pays: stop prospect lane and trigger sales-to-client handoff.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded intake-to-report-delivery workflow and prospect/client separation rules | Coach |

## Source Documents

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/GMF_WEBSITE_MESSAGING_CLIENT_HOME_BRIEF.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

