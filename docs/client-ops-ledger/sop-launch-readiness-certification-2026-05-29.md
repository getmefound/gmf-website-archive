# SOP Launch Readiness Certification - 2026-05-29

Status: active launch rule; May 31 certification complete
Owner: Manager / Elon
Reviewer: Auditor
Purpose: allow GMF to start onboarding real clients Monday without pretending every SOP has already seen a natural live event.

Current certified result: all 187 tracked SOP rows now have terminal operating states. There are 5 Verified, 101 Launch Ready, 54 Trigger Ready, 12 Launch Gate Ready, 9 Parked Not Launch-Critical, 6 Canary Only, 0 Hold, and 0 pending audit/proof. Proof:

- `docs/sops/live-pilots/2026-05-29-launch-readiness-certification-audit.md`
- `docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md`
- `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md`

## Decision

GMF will not wait for every SOP to receive a natural live event before launch.

Instead, launch-critical SOPs can receive a `Launch Ready` certification when they pass controlled proof, Auditor review, and safety gates. The first real Monday clients then become monitored live-pilot evidence.

## Status Definitions

| Status | Meaning | Can Run Monday? |
|---|---|---|
| Verified | Auditor passed real proof or approved controlled proof where controlled proof is sufficient. | Yes |
| Launch Ready | Auditor passed controlled simulation, no-send/no-public-write proof, rollback path, owner visibility, and stop rules. | Yes, with monitoring |
| Trigger Ready | Ready when the scheduled cadence, platform event, client event, or monitoring trigger occurs. | Yes, when triggered |
| Launch Gate Ready | SOP is ready, but the individual live action requires named approval/access/spend/legal/reputation/deploy/data-risk gate. | Yes, after gate |
| Canary Only | Can run on first 1-3 real clients with Manager/Auditor shadowing and proof capture. | Yes, capped |
| Parked Not Launch-Critical | Valid SOP, but not needed for 6/1 launch. | No Monday action |
| Draft/Blocked/Pending/Hold | Missing proof, unsafe boundary, access path, or unresolved gate. | Not allowed after certification |

## What Counts Before Monday

Before Monday, these can certify a launch-critical SOP as `Launch Ready`:

1. Synthetic-company run using the SOP trigger and expected output.
2. No-send rendering for emails, SMS, review requests, and outreach.
3. No-public-write rehearsal for GBP edits, social profiles, review replies, and public claims.
4. Local/API smoke test for forms, queues, webhooks, Supabase writes, report creation, unsubscribe, and stop rules.
5. Auditor proof gate confirming the SOP has owner, next owner, expected receive, escalation, rollback/stop path, and no unsafe live action.

## Monday Canary Rule

The first Monday clients and inbound leads become canary pilots.

| Work Type | Monday Rule |
|---|---|
| Intake, lead record, report generation, client record, internal dashboard updates | Can run automatically after smoke pass |
| Report email, nurture email, client welcome email | Can run after no-send render, sender/domain proof, opt-out/footer proof, and test inbox proof |
| GBP audits and proposed edits | Can run as read-only/proposed edits after Auditor pass |
| Public GBP/social edits, review replies, review requests, live sends, payment/refund actions | Require specific gate or approval before the external action |
| Cold email launch | Requires approval packet, suppression proof, Smartlead deliverability proof, and final owner approval |

## Non-Negotiable Guardrail

The launch does not require every SOP to be fully verified by natural live event. It does require that no irreversible or reputation-sensitive action runs without a passed gate.

## Before-Monday Execution

| Due | Owner | Action | Done Proof |
|---|---|---|---|
| 2026-05-30 10:00 ET | Auditor | Review proof-ready pilots and mark terminal state. | Done early |
| 2026-05-30 14:00 ET | Coach / Systems Director | Run synthetic controlled scenarios and label each using the launch status definitions. | Done early |
| 2026-05-30 18:00 ET | Auditor | Certify launch-critical SOPs and list gated external actions. | Done early |
| 2026-05-30 21:00 ET | Systems Director | Fix client magic-link gate and run build/runtime smoke. | Done |
| 2026-05-31 18:00 ET | Manager / Auditor | Publish Monday go/no-go showing which workflows can run automatically, which are canary, and which require approval. | Sunday go/no-go memo |

## Manager Rule

If a launch-critical SOP is `Canary Only`, Manager does not block the business. Manager caps the run, assigns Auditor shadowing, captures proof from the first real client, and promotes or holds the SOP after evidence.
