# GMF SOP Testing Backlog

Status: new GBP update and email sender SOPs added; 184 of 186 drafted SOPs desktop-reviewed and safe dry-run complete; 11 live-pilot proof artifacts ready for audit
Owner: Coach/Auditor
Last updated: 2026-05-28
Purpose: activation queue for Drafted SOPs. Use this with SOP 000 to move SOPs through live pilot, audit, and release.

## Counts

| Priority | SOPs Pending Activation |
|---|---:|
| P0 | 108 |
| P1 | 62 |
| P2 | 15 |
| P3 | 1 |

## Gate Status

### Summary

| Gate | Passed / Total | Notes |
|---|---:|---|
| Desktop review | 184 / 186 | New GBP update and email sender SOPs pending review |
| Dry run | 184 / 186 | New GBP update and email sender SOPs pending dry run |
| Live pilot proof ready | 11 / 186 | Ready for Auditor proof review |
| Live pilot in progress | 6 / 186 | Needs authenticated access, real-client completion, queue timer outcome, or runtime follow-up |
| Live pilot not yet tested | 169 / 186 | Must be synthetic-controlled, real low-risk, recurring, or triggered by event type |
| Audit | 0 / 184 | Waiting on proof review |
| Release | 0 / 184 | Waiting on audit pass |

### Desktop Review

| Status | Count |
|---|---:|
| Pass | 184 |
| Pending | 2 |

### Dry Run

| Status | Count |
|---|---:|
| Pass | 184 |
| Pending | 2 |

### Live Pilot

| Status | Count |
|---|---:|
| Pending - first real low-risk event or controlled non-production test required | 42 |
| Pending - first real low-risk event required | 49 |
| Pending - optimization/platform trigger or Mike-approved investigation required | 16 |
| Pending - recurring cycle or first real event required | 62 |
| Pass - Smartlead API/warmup preflight proof ready for audit | 1 |
| Pass - Smartlead readiness proof ready for audit | 1 |
| Pass - weekly safety audit/deep readiness proof ready for audit | 1 |
| Pass - credential rotation/env proof ready for audit | 1 |
| Pass - Resend domain/key health proof ready for audit | 1 |
| Pass - Stripe key/webhook/product proof ready for audit | 1 |
| Pass - security sweep proof ready for audit | 1 |
| Pass - Southington baseline artifact ready for audit | 1 |
| Pass - Southington AI Search readiness artifact ready for audit | 1 |
| Pass - Southington GBP audit artifact ready for audit | 1 |
| Pass - Southington fact-sync artifact ready for audit | 1 |
| In progress - Southington GBP access/fact proof captured; authenticated role pending | 1 |
| In progress - Southington review link captured; authenticated profile match pending | 1 |
| In progress - Southington GBP access gap converted to timed waiting-state rescue | 1 |
| In progress - Southington GBP access gap classified as access_gap and rescue timer set | 1 |
| In progress - agent watchdog report produced after Agent Working runtime gap | 1 |
| In progress - Gmail connector read/search verified and Southington access trail searched | 1 |

### Mike Needed

| Status | Count |
|---|---:|
| Conditional | 29 |
| No | 157 |

## Activation Rule

Drafted SOPs do not become Active until all five gates pass:

1. Desktop review - complete for all drafted SOPs
2. Dry run - complete for all drafted SOPs
3. Live pilot - pending for all drafted SOPs
4. Audit - pending until proof exists
5. Release - pending until audit passes

CSV backlog: docs/sops/SOP_TESTING_BACKLOG.csv

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
