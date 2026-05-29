# SOP 175 - Human-needed Slack alert

Status: Drafted
Version: 0.5
Owner: Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-175-human-needed-slack-alert.md`

## Purpose

Make the `Human-needed Slack alert` workflow repeatable, auditable, and safe to delegate.

## Covered Master Map Rows

- Human-needed Slack alert

## Scope

This SOP covers the work from trigger through expected output for the covered master-map row(s). It is a first-pass controlled draft and must pass SOP 000 testing gates before it can become Active.

## Trigger

Human involvement required

## Expected Output

Slack DM to Mike only when needed

## Roles

| Role | Responsibility |
|---|---|
| Owner | Manager owns the outcome and keeps this SOP current |
| Operator | Performs the work and reports gaps or blockers |
| Reviewer | Auditor checks proof, quality, and risk controls |
| Approver | Manager approves activation or material changes |

## Hard Rules

- Do not perform client/prospect-facing action unless this SOP and required approvals allow it.
- Do not guarantee rankings, reviews, revenue, Google outcomes, AI visibility, approval timelines, or deliverability results.
- Stop and route risk before acting when billing, legal/privacy, reputation, access, deliverability, public claims, or live sends are involved.
- Manager owner-needed alerts go to Mike by Slack DM only, not shared Slack channels, unless Mike explicitly approves a channel exception.
- Routine progress belongs in Monday, Mission Control, proof reports, or on-demand commands, not proactive DMs.
- A ChatGPT/user-authored Slack message does not prove Manager bot DM delivery. Manager/openclaw bot delivery must be tested directly.
- Universal owner-ask exhaustion gate: do not send any human-needed alert until the assigned agent has exhausted existing access, public sources, workspace docs, Slack history, Monday, Mission Control, proof artifacts, safe read-only checks, available tools, and Coach/Trainer help for skill gaps.

## Procedure

1. Confirm the job, owner, deadline, risk, blocker, and whether human involvement is actually required.
2. Require the assigned agent to exhaust self-serve paths before escalation: existing access, tools, docs, Slack history, Monday, Mission Control, proof artifacts, public sources, and safe read-only checks.
3. If the issue is a skill gap, route to Coach/Trainer before asking Mike.
4. Route routine work to the right role and keep routine status in Monday/Mission Control.
5. Escalate only approvals, access fixes, spend/cap changes, legal/billing/deliverability/reputation/customer-facing risk, or blockers agents cannot clear after exhaustion.
6. Send the owner-needed alert to Mike by Slack DM only.
7. Record pass/watch/blocker status, next owner, what was already tried, and Slack DM proof/link if available.
8. Follow up until the blocker is cleared or explicitly parked.

## Delivery Failure Handling

If Slack returns `messages_tab_disabled`, `channel_not_found`, `not_in_channel`, or another DM delivery error:

1. Mark the human-needed Slack alert as blocked.
2. Record the exact Slack error.
3. Assign Systems Director to fix Slack app DM capability.
4. Keep the underlying work item visible in Monday.
5. Do not use shared-channel fallback unless Mike explicitly approves that exception.

## Required Proof

- Expected output: Slack DM to Mike only when needed
- Work record or Monday item
- Date/time, owner, and status
- Slack DM link or send confirmation, if available
- Blocker/escalation note if not complete

## What To Log

- Status: pass, watch, blocked, done, held, or escalated
- Owner/operator
- Related client, prospect, partner, system, report, or financial record
- Output/proof link
- Next owner and due date
- Exception or escalation reason, if any

## Communication Rule

Use GMF-safe language. Keep messages short, specific, and tied to observable facts. Manager alerts to Mike must be Slack DM only. Do not send client/prospect-facing communication from this SOP unless the owner role is authorized to do so and all required approvals exist.

## Mike Escalation Rule

Escalate to Mike only after the owner-ask exhaustion gate passes and the remaining issue is pricing, offers, refunds, billing, commissions, tool spend, legal/privacy risk, reputation risk, public promises, credential ownership, HighLevel AI feature toggles, live prospecting clearance, direct checkout, agentic checkout, payments, merchant-of-record risk, or another decision only Mike can safely make.

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
| 0.3 | 2026-05-27 | Updated Manager human-needed alerts to Slack DM only | Manager |
| 0.4 | 2026-05-27 | Added handling for Manager bot DM failure and ChatGPT/user-authored message false positives | Manager |
| 0.5 | 2026-05-27 | Added universal owner-ask exhaustion gate before any Manager ask to Mike | Manager |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
