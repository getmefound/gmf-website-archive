# GMF SOP Testing Backlog

Status: May 31 certification complete; 187 of 187 tracked SOPs have desktop review, dry run, and a terminal operating state; no vague pending or hold rows remain
Owner: Coach/Auditor
Last updated: 2026-05-29
Purpose: activation queue for Drafted SOPs. Use this with SOP 000 to move SOPs through live pilot, audit, and release.

Note: 189 individual SOP markdown files exist. The testing backlog CSV currently tracks 187 activation rows; Systems Director/Coach must reconcile file-vs-row coverage before the Sunday launch gate, including multi-row governance SOPs and newly added SOPs.

## Counts

| Priority | Tracked SOPs |
|---|---:|
| P0 | 109 |
| P1 | 62 |
| P2 | 15 |
| P3 | 1 |

## Gate Status

### Summary

| Gate | Passed / Total | Notes |
|---|---:|---|
| Desktop review | 187 / 187 | All tracked rows reviewed |
| Dry run | 187 / 187 | All tracked rows dry-run or controlled-certified |
| Auditor verified | 5 / 187 | Readiness/check SOPs with proof sufficient for verification |
| Launch Ready | 101 / 187 | Controlled or proof-reviewed SOPs can run within stated boundaries |
| Trigger Ready | 54 / 187 | Run when scheduled cadence, platform event, client event, or monitoring trigger occurs |
| Launch Gate Ready | 12 / 187 | SOP ready, but live action still requires named approval/access/spend/risk gate |
| Canary Only | 6 / 187 | First real event can run with Manager/Auditor shadowing |
| Parked Not Launch-Critical | 9 / 187 | Not needed for 6/1 launch; tied to activation trigger |
| Hold | 0 / 187 | No hold rows remain |
| Pending audit/proof | 0 / 187 | No vague pending rows remain |
| Terminal release state | 187 / 187 | Every SOP has an operating state |

### Desktop Review

| Status | Count |
|---|---:|
| Pass | 187 |
| Pending | 0 |

### Dry Run

| Status | Count |
|---|---:|
| Pass | 187 |
| Pending | 0 |

### Live Pilot

| Status | Count |
|---|---:|
| Verified | 5 |
| Launch Ready | 101 |
| Trigger Ready | 54 |
| Launch Gate Ready | 12 |
| Canary Only | 6 |
| Parked Not Launch-Critical | 9 |

### Mike Needed

| Status | Count |
|---|---:|
| Conditional | 30 |
| No | 157 |

## Activation Rule

No SOP may remain in vague `Pending`, `Drafted`, or `Hold` after the May 31 certification run. Each row must be one of:

1. `Verified`
2. `Launch Ready`
3. `Trigger Ready`
4. `Launch Gate Ready`
5. `Canary Only`
6. `Parked Not Launch-Critical`

CSV backlog: docs/sops/SOP_TESTING_BACKLOG.csv
Full certification proof: docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md

## Synthetic Testing Rule

Synthetic companies may be used to test SOP mechanics, handoffs, proof templates, owner visibility, non-production forms, report builds, email drafts, no-send controls, and safe read-only checks.

Synthetic companies must not be used to claim live-pilot proof for real-world permissions, public Google Business Profile edits, live prospect sends, live review requests, payments, legal/billing/reputation decisions, or any customer-facing action that requires a real client, real platform event, or explicit owner approval.

Synthetic testing plan: docs/sops/SOP_SYNTHETIC_TESTING_PLAN.md

## Activation Batches

- docs/sops/SOP_ACTIVATION_BATCH_A_2026-05-27.md
- docs/sops/SOP_ACTIVATION_BATCH_B_2026-05-27.md
- docs/sops/SOP_ACTIVATION_BATCH_C_2026-05-27.md
- docs/sops/SOP_ACTIVATION_BATCH_D_2026-05-27.md
- docs/sops/SOP_ACTIVATION_BATCH_E_2026-05-27.md

## Recommended Live Pilot Order

1. Smartlead/API readiness and no-send controls
2. Free visibility check/report delivery
3. Partner application review
4. Sales-to-client handoff and client hub setup
5. GBP access/Get Found flow
6. Review request send readiness
7. Monthly recap/report artifact flow
8. Weekly safety audit and SOP health dashboard
9. Systems/security/finance controls as real events occur
10. P1/P2 recurring and optimization SOPs as cadence begins
