# SOP 130 - Environment variable management

Status: Drafted
Version: 0.3
Owner: Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-130-environment-variable-management.md`

## Purpose

Make the `Environment variable management` workflow repeatable, auditable, and safe to delegate, including API key rotation, suspected exposure checks, webhook/signing-secret replacement, and production smoke verification.

## Covered Master Map Rows

- Environment variable management

## Scope

This SOP covers secrets and runtime configuration for GMF systems, including local `.env.local`, Vercel environment variables, Supabase keys, OpenAI keys, Slack tokens/signing secrets, Stripe keys/webhooks, Resend keys, Smartlead keys, Google/OAuth credentials, cron/internal tokens, and similar vendor credentials.

It covers read-only inventory, approved rotation, replacement, revocation, environment updates, deploy verification, and proof logging. It does not allow raw secret values to be copied into docs, Slack, Monday, screenshots, or final reports.

## Trigger

New secret or deploy config; credential rotation; suspected exposure; expired key; vendor security notice; production deploy requiring env changes; weekly safety audit finding.

## Expected Output

Secret stored, rotated, or verified without exposure; affected runtimes smoke-tested; old credential action documented; proof logged without secret values.

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
- Never expose credentials, API keys, magic links, tokens, or private access details in client-facing or public records.
- Read-only inventory, format checks, vendor health checks, and smoke tests may run without asking Mike when no secret values are exposed and no destructive action is taken.
- Any destructive credential action requires explicit Mike approval first. This includes deleting, revoking, disabling, expiring, regenerating, rotating, replacing, or permission-reducing API keys, OAuth clients, webhooks, signing secrets, app tokens, service-role keys, connected apps, payment keys, DNS authentication records, or production environment variables.
- Before asking for destructive-action approval, Systems Director must state the exact credential/action, checks exhausted, why it is believed safe, what could break, and the verification/rollback plan.
- If a credential is confirmed or reasonably suspected exposed, treat it as a security incident and coordinate with SOP 176.
- Do not place secret-like values in `NEXT_PUBLIC_` variables.

## Procedure

1. Classify the request.
   - Identify system, credential type, environments, owner, blast radius, and whether the action is read-only or destructive.
   - Identify connected SOPs: SOP 144 for exposed-secret sweep, SOP 176 for incident response, SOP 010 for weekly safety audit, and the vendor-specific SOP if one exists.

2. Exhaust read-only checks first.
   - Search repo references with `rg`.
   - Check local env key names without printing values.
   - Check Vercel env names/environments where applicable.
   - Check vendor inventory by key name/id when approved access exists.
   - Review relevant proof docs, Monday item, Slack history, Gmail/vendor notices, and health endpoints.

3. If no destructive action is needed, document the current state.
   - Record key name, environment, status, health check, owner, and next review date.
   - Do not log raw values, headers, tokens, webhook secrets, refresh tokens, private keys, or magic links.

4. If rotation/replacement is needed, prepare the approval packet before acting.
   - Exact credential/action.
   - Why it is needed.
   - Systems likely affected.
   - Existing access checked.
   - New key install order.
   - Smoke test command or endpoint.
   - Old key revoke/delete timing.
   - Rollback/incident plan.

5. After Mike approves the destructive part, rotate in this order unless a vendor requires otherwise.
   - Create or obtain replacement credential.
   - Update local `.env.local` if local runtime is part of the proof path.
   - Update Vercel Production/Preview/Development as appropriate.
   - Redeploy or restart the affected runtime if needed.
   - Run vendor/API smoke tests and production health checks.
   - Revoke/delete the old credential only after the replacement proves live and Mike approved that destructive action.
   - Rerun smoke tests after revocation/deletion.

6. If exposure is suspected or confirmed, switch to incident mode.
   - Stop sharing the exposed material.
   - Preserve only minimal non-secret evidence.
   - Identify affected systems and environments.
   - Rotate affected credentials after approval unless delay increases material risk.
   - Check logs and recent activity where available.
   - Open or update the incident record under SOP 176.

7. Record proof.
   - Proof must show key name/id where safe, environment names, timestamps, commands/endpoints used, pass/fail status, and next owner.
   - Proof must never include secret values, raw headers, one-time codes, refresh tokens, private keys, or webhook signing secrets.

## Required Proof

- Expected output: Secret stored, rotated, or verified without exposure
- Work record or Monday item
- Date/time, owner, and status
- Configuration/check result, non-secret logs, and rollback note when relevant
- Blocker/escalation note if not complete
- Approval proof for any destructive credential action
- Smoke test or health-check proof after update and after old-key revocation/deletion when applicable
- Explicit note that no raw secret values were logged

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

## Standard Checks And Scripts

Use the narrowest applicable check. Do not print secret values.

| Check | Command or Source | Owner |
|---|---|---|
| Secret exposure scan | `npm run audit:security` | Auditor |
| OpenAI/Supabase runtime smoke | `npm run systems:key-rotation-smoke` | Systems Director |
| Slack runtime smoke | `npm run systems:slack-key-rotation-smoke` | Systems Director |
| Stripe/Resend runtime smoke | `npm run systems:stripe-resend-key-rotation-smoke` | Systems Director |
| System readiness sweep | `npm run systems:readiness` | Systems Director |
| Vercel env inventory | `vercel env ls` | Systems Director |
| Repo reference search | `rg "KEY_NAME|vendor|credential"` | Systems Director/Auditor |

## Related SOPs

- SOP 010 - Weekly Safety Audit
- SOP 131 - Vercel Deploy And Rollback
- SOP 133 - Supabase Backup And Recovery
- SOP 134 - Resend Domain And Email Health
- SOP 135 - Stripe Product And Webhook Management
- SOP 144 - Security Sweep
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
| 0.3 | 2026-05-28 | Added explicit API/key rotation, exposure-response, Mike approval, and smoke-test rules | Coach/Systems Director |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

