# SOP 166 - Auditor proof gate

Status: Drafted
Version: 0.2
Owner: Auditor
Reviewer: Manager
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-166-auditor-proof-gate.md`

## Purpose

Make the `Auditor proof gate` workflow repeatable, auditable, and safe to delegate.

## Covered Master Map Rows

- Auditor proof gate

## Scope

This SOP covers the work from trigger through expected output for the covered master-map row(s). It is a first-pass controlled draft and must pass SOP 000 testing gates before it can become Active.

## Trigger

Workflow ready to mark done

## Expected Output

Pass/fail decision

## Roles

| Role | Responsibility |
|---|---|
| Owner | Auditor owns the outcome and keeps this SOP current |
| Operator | Performs the work and reports gaps or blockers |
| Reviewer | Manager checks proof, quality, and risk controls |
| Approver | Manager approves activation or material changes |

## Hard Rules

- Do not perform client/prospect-facing action unless this SOP and required approvals allow it.
- Do not guarantee rankings, reviews, revenue, Google outcomes, AI visibility, approval timelines, or deliverability results.
- Stop and route risk before acting when billing, legal/privacy, reputation, access, deliverability, public claims, or live sends are involved.

## Procedure

1. Confirm the workflow, claim, artifact, send, edit, or decision being reviewed.
2. Check required proof, source records, client/prospect-facing language, approval path, and risk controls.
3. Mark pass, pass with edits, hold, or block.
4. Explain the exact reason for any hold/block and assign the correction owner.
5. Log the audit result and whether SOP/update/escalation is needed.

## Training Rerun Verification

When a task went through agent skill-gap training, Auditor must verify the rerun before Done.

Auditor checks:

1. The original training request is recorded.
2. Coach/Trainer delivered an instruction, checklist, example, SOP update, tool note, or eval scenario.
3. The assigned agent reran the task or next safe equivalent using the new training.
4. The rerun output includes required proof and does not create new client, public-profile, billing, legal/privacy, deliverability, reputation, or live-send risk.
5. Any remaining gap has a new owner and next action.

Auditor verification format:

`Training verification: pass/hold/block. Evidence: [proof]. Agent may resume: [yes/no]. SOP/training update required: [yes/no + file].`

## Required Proof

- Expected output: Pass/fail decision
- Work record or Monday item
- Date/time, owner, and status
- Pass/hold/block audit note and required corrections
- Training rerun verification note, when applicable
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
| 0.3 | 2026-05-27 | Added training rerun verification gate | Auditor |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
