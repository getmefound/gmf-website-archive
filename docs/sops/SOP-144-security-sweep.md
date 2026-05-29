# SOP 144 - Security sweep

Status: Drafted
Version: 0.3
Owner: Auditor
Reviewer: Manager
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-144-security-sweep.md`

## Purpose

Make the `Security sweep` workflow repeatable, auditable, and safe to delegate, especially for exposed secrets, public credential leaks, risky environment variables, unsafe auth paths, and production-change risk.

## Covered Master Map Rows

- Security sweep

## Scope

This SOP covers read-only security scanning and audit proof. Auditor owns the sweep; Systems Director owns fixes for systems, credentials, deploys, and vendor configuration.

The sweep may identify issues, but it does not authorize destructive credential changes. Credential deletion, revocation, rotation, disabling, replacement, or permission reduction follows SOP 130 and requires explicit Mike approval first.

## Trigger

Weekly; before deploy; after credential changes; after suspected secret exposure; after vendor security notice; after any incident involving access, auth, billing, email, payment, or client data.

## Expected Output

No exposed secret/risk report; if risk is found, a hold/block report with owner, severity, affected system, and next action.

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
- Do not print, paste, screenshot, or document raw secret values.
- Read-only scans and non-secret inventory checks may run without Mike approval.
- Destructive credential actions require SOP 130 approval first.
- If any credential is exposed or likely exposed, trigger SOP 176 incident response and SOP 130 credential handling.

## Procedure

1. Define the sweep target.
   - Weekly full sweep, pre-deploy sweep, credential-change sweep, incident sweep, or targeted vendor sweep.

2. Run local exposure checks.
   - Run `npm run audit:security`.
   - Search for raw-key patterns or risky public env names with `rg`.
   - Confirm secret-like values are not in tracked docs, source files, screenshots, CSVs, or proof reports.
   - Confirm `.env.local` and other local secret files are ignored and not staged.

3. Check runtime/config risk without exposing values.
   - Review Vercel env names/environments when needed.
   - Confirm no secret-looking names use `NEXT_PUBLIC_`.
   - Check health endpoints and smoke reports for systems touched by recent work.
   - Review recent proof docs for accidental token/header/key leakage.

4. Check access and auth controls.
   - Look for unprotected internal routes, broad service-role use, weak internal tokens, public magic links, or owner-only access paths exposed to client/public surfaces.
   - Confirm HighLevel AI features remain off under the standing rule when the sweep includes GHL.

5. Classify findings.
   - Pass: no exposed secret or material risk found.
   - Watch: low-risk issue with owner and due date.
   - Hold: do not deploy/send until corrected.
   - Block: incident, suspected exposure, broken auth, payment risk, deliverability risk, or client-data risk.

6. Route fixes.
   - Systems Director fixes configuration/credential/deploy/vendor issues under SOP 130 or vendor-specific SOPs.
   - Auditor verifies proof after fixes.
   - Manager receives only pass/watch/blocker status and owner-needed escalations.

7. Log the audit.
   - Include date/time, target, checks run, pass/watch/block status, owner, next step, and whether Mike approval is needed.
   - Never include raw secrets or one-time codes.

## Required Proof

- Expected output: No exposed secret/risk report
- Work record or Monday item
- Date/time, owner, and status
- Pass/hold/block audit note and required corrections
- Blocker/escalation note if not complete
- Commands/checks run, with non-secret summaries only
- Confirmation that no raw secret values were logged
- Link to incident or SOP 130 proof if exposure/rotation is involved

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

## Standard Checks

| Check | Command or Source | Result To Record |
|---|---|---|
| Local secret pattern sweep | `npm run audit:security` | pass/fail and issue type |
| Tracked file status | `git status --short` | no secret files staged |
| Repo targeted search | `rg "TOKEN|SECRET|API_KEY|PRIVATE_KEY|PASSWORD"` | no raw secret values |
| Public env risk | `rg "NEXT_PUBLIC_.*(TOKEN|SECRET|API_KEY|PRIVATE_KEY|PASSWORD)"` | no risky public names |
| Vercel env inventory | `vercel env ls` | key names/environments only |
| Runtime smoke | applicable `systems:*smoke` script | pass/fail only |

## Related SOPs

- SOP 010 - Weekly Safety Audit
- SOP 130 - Environment Variable Management
- SOP 131 - Vercel Deploy And Rollback
- SOP 174 - Credential/Access Escalation
- SOP 176 - Incident Response

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
| 0.3 | 2026-05-28 | Added concrete exposed-secret sweep, proof, routing, and no-destructive-action controls | Coach/Auditor |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
