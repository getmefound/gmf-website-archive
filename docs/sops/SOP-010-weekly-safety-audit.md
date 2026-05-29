# SOP 010 - Weekly Safety Audit

Status: Drafted
Version: 0.3
Owner: Systems Director/Auditor
Reviewer: Manager
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-010-weekly-safety-audit.md`

## Purpose

Run one weekly pass over the business-critical safety controls so GMF catches access, billing, deliverability, reputation, data, AI-feature, and public-claim risks before they become client or owner problems.

## Covered Master Map Rows

- Weekly safety audit
- Security sweep
- HighLevel AI feature safety check
- GHL bridge smoke check
- Tool cost report watch items
- Human-needed Slack alert rules

## Trigger

Weekly cadence, before a risky deploy/send, or after an incident.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Checks systems, secrets, deploys, sender health, backups, and integrations |
| Auditor | Checks proof, claims, live-send gates, reputation risk, and SOP adherence |
| Manager | Receives pass/watch/blocker report and routes owners |
| Mike | Receives only human-needed/material-risk escalations |

## Hard Rules

- HighLevel AI features remain off unless Mike explicitly authorizes a specific toggle.
- No live Smartlead sends unless readiness and approval gates pass.
- Do not expose secrets in reports.
- Slack is for human-needed items, not routine safety noise.
- Weekly security checks may inspect, inventory, and smoke-test credentials without exposing values.
- Any destructive credential action found during the audit follows SOP 130 and requires explicit Mike approval first.
- Suspected or confirmed secret exposure follows SOP 144 for sweep proof and SOP 176 for incident response.

## Procedure

1. Check live-send gates.
   - Confirm no cold email, review request, SMS, or client/prospect campaign is running without approval.
   - Confirm Smartlead readiness status if prospecting is active or planned.

2. Check HighLevel AI safety.
   - Confirm Conversation AI, AI Employee, Content AI, Auto-Review Replies, and similar paid/auto-reply features are off unless Mike explicitly approved the exact feature.

3. Check access and secrets.
   - Look for missing, expired, exposed, or over-permissioned credentials.
   - Verify no secrets are committed or pasted into docs.
   - Run or review the latest `npm run audit:security` result.
   - Confirm any credential rotation/revocation/deletion follows SOP 130.

4. Check client/reputation risk.
   - Review complaints, bad reviews, private feedback, risky public replies, unresolved blockers, and billing issues.

5. Check proof and dashboards.
   - Sample recent SOP runs for required proof.
   - Check Monday/Mission Control for stale blockers or missing owners.

6. Check deploy/system health.
   - Review recent production changes, env vars, backup needs, Supabase/Vercel issues, Resend/domain health, and report/download paths.
   - Review dependency/vendor/security-update signals and assign scoped updates to Systems Director with rollback proof.

7. Produce safety report.
   - Use pass/watch/blocker.
   - Include owner, next action, due date, and whether Mike is needed.

8. Escalate only human-needed items.
   - Mike gets approvals, access fixes, spend/cap changes, legal/billing/deliverability/reputation/customer-facing risk, and blockers agents cannot clear.

## Required Proof

- Weekly safety report
- Checks performed
- Pass/watch/blocker status
- Open blocker owners
- Mike-needed items, if any
- Confirmation that HighLevel AI features remain off unless explicitly approved
- Security sweep status or link to SOP 144 proof
- Credential/env change status or link to SOP 130 proof when relevant
- System/dependency/vendor update watch items, owner, due date, and rollback path when relevant

## Failure Or Blocker Handling

- Live-send violation: stop send if possible, alert Manager, open incident.
- HighLevel AI feature found on: stop/disable if authorized to do so safely; escalate to Mike/Manager with risk note.
- Secret exposure: treat as incident, run SOP 144, and use SOP 130 for any rotation/revocation/deletion after Mike approval.
- Reputation/client risk: Manager handles before routine reporting continues.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded weekly safety audit controls and escalation boundaries | Coach |
| 0.3 | 2026-05-28 | Linked weekly safety audit to credential rotation, security sweep, incident response, and security-update checks | Coach/Systems Director |

## Source Documents

- `AGENTS.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
- `docs/client-ops-ledger/ghl-replacement-cost-plan.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
