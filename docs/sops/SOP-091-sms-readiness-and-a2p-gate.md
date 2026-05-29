# SOP 091 - SMS readiness and A2P gate

Status: Drafted
Version: 0.2
Owner: Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-091-sms-readiness-and-a2p-gate.md`

## Purpose

Make the `SMS readiness and A2P gate` workflow repeatable, auditable, and safe to delegate.

## Covered Master Map Rows

- SMS readiness and A2P gate

## Scope

This SOP covers the work from trigger through expected output for the covered master-map row(s). It is a first-pass controlled draft and must pass SOP 000 testing gates before it can become Active.

## Trigger

SMS requested or included

## Expected Output

A2P/consent/STOP/HELP pass

## Roles

| Role | Responsibility |
|---|---|
| Owner | Systems Director owns the outcome and keeps this SOP current |
| Operator | Performs the work and reports gaps or blockers |
| Reviewer | Auditor checks proof, quality, and risk controls |
| Approver | Manager approves activation or material changes |

## Hard Rules

- Do not perform client/prospect-facing action unless this SOP and required approvals allow it.
- Do not guarantee rankings, reviews, revenue, Google outcomes, AI visibility, approval timelines, or deliverability results.
- Stop and route risk before acting when billing, legal/privacy, reputation, access, deliverability, public claims, or live sends are involved.
- No live send without current approval, suppression checks, proof preview, and a logged owner.

## Procedure

1. Confirm the system, environment, owner, access boundary, and risk class before changing anything.
2. Check current configuration, logs, secrets, webhooks, integrations, backups, and rollback path where relevant.
3. Make only approved, scoped changes; do not expose secrets or enable paid/AI features without authorization.
4. Verify with a read-only check, dry run, smoke test, or controlled test record.
5. Record proof, rollback notes, blockers, and next owner.

## Required Proof

- Expected output: A2P/consent/STOP/HELP pass
- Work record or Monday item
- Date/time, owner, and status
- Configuration/check result, non-secret logs, and rollback note when relevant
- Suppression/approval proof, preview, send log, and failure list when relevant
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

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
