# GMF SOP Synthetic Testing Plan

Status: active testing plan
Owner: Manager
Execution owners: Coach, Systems Director, Profile Manager, Sales Manager, Account Manager, Reporter, Auditor
Last updated: 2026-05-29
Purpose: use clearly labeled fictitious companies to pressure-test SOPs without pretending synthetic work is live-client proof.

First execution batch: `docs/sops/live-pilots/2026-05-28-synthetic-controlled-test-batch-001.md`
Before-Monday verification plan: `docs/client-ops-ledger/sop-verification-before-monday-plan-2026-05-29.md`
Batch 001 results: `docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md`
Full certification run: `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md`

## Current Count

| Gate | Passed / Total | Status |
|---|---:|---|
| Desktop review | 187 / 187 | Complete |
| Dry run | 187 / 187 | Complete |
| Verified | 5 / 187 | Proof sufficient for verification |
| Launch Ready after controlled/audit proof | 101 / 187 | Can run within stated boundaries |
| Trigger Ready | 54 / 187 | Ready when scheduled cadence or platform/client event occurs |
| Launch Gate Ready | 12 / 187 | Live action requires named gate before execution |
| Canary Only after controlled/audit proof | 6 / 187 | First real event must be shadowed |
| Parked Not Launch-Critical | 9 / 187 | Not needed for 6/1 launch |
| Hold after controlled proof | 0 / 187 | None |
| Pending live/event/trigger proof | 0 / 187 | None |

## Rule

Synthetic companies are allowed for simulation and controlled non-production testing. They are not allowed to inflate live-pilot completion when the SOP requires real platform access, a real client event, a live send, payment, public edit, legal/billing action, reputation action, or Mike-approved risk decision.

## Synthetic Test Companies

| Synthetic ID | Company | Use Case | Primary SOP Coverage |
|---|---|---|---|
| SYN-001 | Maple Ridge Lawn & Landscape LLC | Local service business similar to Southington, but fully fictitious | GBP/Get Found workflow, AI visibility audits, review request previews, before/after visibility snapshots, free visibility reports |
| SYN-002 | Oak & Pine Home Services | Generic home-services buyer journey | Prospecting, free report request, pricing, checkout, abandoned cart, timed upsell, sales handoff |
| SYN-003 | Riverbend HVAC & Plumbing | Urgent lead-response business | Lead intake, missed-call style routing, reply classification, escalation, client communication SLAs |
| SYN-004 | Harbor Pet Grooming Studio | Review-heavy local service business | Review request drafting, monthly recap, retention, cancellation, customer-safe reporting |
| SYN-005 | BrightSmile Dental Studio | Higher-compliance local business | Claim audit, reputation risk checks, AI-search wording safety, owner approval drills |

All data for these companies is fake. Do not use these names for public Google edits, live sends, ads, payments, review requests, or external customer-facing actions.

## Test Mode Buckets

| Bucket | Count | What It Means | Synthetic Use |
|---|---:|---|---|
| Launch Ready | 101 | Safe to run inside SOP boundary | Controlled proof accepted; proof still logged on run |
| Trigger Ready | 54 | Scheduled or event-driven workflow | Synthetic rehearsal accepted; run on trigger |
| Launch Gate Ready | 12 | Ready, but live action requires named gate | Synthetic proof accepted; gate controls live action |
| Canary Only | 6 | First real event requires shadowing | Synthetic rehearsal accepted; first real event promotes or holds |
| Parked Not Launch-Critical | 9 | Valid but not needed Monday | No launch action until trigger/scope opens |

## Next Steps To Solve

| Step | Owner | Reviewer | Status | Done Proof |
|---|---|---|---|---|
| 1. Auditor accepted the full May 31 certification classification and removed vague pending rows. | Auditor | Manager | Done | `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md` |
| 2. Coach/System Director completed the controlled synthetic batch and carried remaining rows into terminal states. | Coach / Systems Director | Auditor | Done | `docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md` |
| 3. Systems Director fixed client hub magic-link protection and verified the app build. | Systems Director | Auditor | Done | `npm run build` passed; client hub routes require signed access token |
| 4. Profile Manager continues Southington as a real low-risk GBP/Get Found pilot. | Profile Manager | Auditor | Trigger Ready | Authenticated GBP proof or documented access failure |
| 5. Sales Manager prepares the Smartlead seed-test approval packet; no live sends run until approval gate passes. | Sales Manager | Manager | Launch Gate Ready | Approval packet and cap/risk proof |
| 6. Manager keeps Monday/Mission Control updated from the terminal-state backlog and watchdog. | Manager | Auditor | Trigger Ready | Monday items, watchdog outbox, and current status report |
| 7. Auditor shadows the six Canary Only SOPs on first real event and promotes or holds within 24 hours. | Auditor | Manager | Canary Only | First-event proof artifact |

## Immediate Batch Order

1. Systems/security/credential SOPs: run on trigger and record proof.
2. Southington GBP/Get Found real-client SOPs: finish authenticated access proof through existing access paths.
3. First Monday client reports: run as Canary Only where marked, then promote or hold within 24 hours.
4. Client hub/magic-link SOPs: use signed client access links only.
5. Prospecting seed-test SOPs: prepare approval packet, then run only after approval.
6. Recurring SOPs: weekly safety, monthly recap, retention, cancellation, incident drills as cadence or event occurs.

## Owner Ask Standard

Mike is not needed for synthetic data, draft artifacts, read-only checks, public research, Monday updates, proof docs, or agent training. Mike is only needed for explicit approval, access failure after agent exhaustion, spend/cap change, destructive credential action, live send, public edit, payment/billing/legal/reputation risk, or a decision no agent can safely make.
