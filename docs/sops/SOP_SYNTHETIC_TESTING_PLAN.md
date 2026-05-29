# GMF SOP Synthetic Testing Plan

Status: active testing plan
Owner: Manager
Execution owners: Coach, Systems Director, Profile Manager, Sales Manager, Account Manager, Reporter, Auditor
Last updated: 2026-05-28
Purpose: use clearly labeled fictitious companies to pressure-test SOPs without pretending synthetic work is live-client proof.

First execution batch: `docs/sops/live-pilots/2026-05-28-synthetic-controlled-test-batch-001.md`

## Current Count

| Gate | Passed / Total | Status |
|---|---:|---|
| Desktop review | 184 / 184 | Complete |
| Dry run | 184 / 184 | Complete |
| Live-pilot proof ready | 11 / 184 | Ready for Auditor review |
| Live-pilot in progress | 6 / 184 | Agent-owned follow-up |
| Live-pilot not yet tested | 167 / 184 | Needs synthetic-controlled, real low-risk, recurring, or triggered proof |
| Audit | 0 / 184 | Pending |
| Release | 0 / 184 | Pending |

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
| Proof-ready live pilots | 11 | A real or controlled proof artifact already exists and needs Auditor review | No synthetic work needed |
| In progress | 6 | Agent already has a real workstream open | Synthetic may rehearse missing proof only |
| Controlled non-production eligible | 41 | SOP can be advanced with a no-send/no-public-write/non-production test | Yes, run synthetic controlled tests next |
| Real low-risk event required | 48 | SOP needs a real lead, client, buyer, reply, access event, or owner-safe business event | Synthetic rehearsal only; activation needs real proof |
| Recurring cycle or first real event required | 62 | SOP needs weekly/monthly cadence or a real incident/request | Synthetic rehearsal only; activation waits for cycle/event |
| Platform trigger or Mike-approved investigation | 16 | SOP needs a platform issue, optimization trigger, or explicit risk approval | Synthetic drill only; activation needs real trigger or approval |

## Next Steps To Solve

| Step | Owner | Reviewer | Status | Done Proof |
|---|---|---|---|---|
| 1. Auditor reviews the 11 proof-ready SOPs first and marks pass/fail without waiting on Mike. | Auditor | Manager | Next | Updated backlog rows and proof report links |
| 2. Coach runs synthetic controlled test batch 001 for 43 total controlled/queue-control SOPs using SYN-001 through SYN-005; 41 remain pending and 2 now have Southington live-pilot rescue proof in progress. | Coach | Auditor | Ready to run | `docs/sops/live-pilots/2026-05-28-synthetic-controlled-test-batch-001.md` |
| 3. Systems Director runs non-production/safe checks for technical SOPs: forms, webhooks, client registry, magic-link gating, report generation, no-send email rendering, and smoke tests. | Systems Director | Auditor | Next | Command output summarized in proof artifacts |
| 4. Profile Manager continues Southington as the real low-risk pilot for GBP/Get Found SOPs, using existing access paths before asking Mike. | Profile Manager | Auditor | In progress | Authenticated GBP role/fact proof or documented access failure |
| 5. Sales Manager prepares a tiny Smartlead seed-test approval packet, but no live sends run until approval rules are satisfied. | Sales Manager | Manager | Blocked until approval packet | Approval packet and cap/risk proof |
| 6. Manager updates Monday/Mission Control with pass, in-progress, and blocked counts so Mike can monitor without reading raw logs. | Manager | Auditor | Next | Monday items and current status report |
| 7. Auditor promotes only verified SOPs to audit pass and release queue; synthetic-only rehearsal remains labeled synthetic. | Auditor | Manager | Ongoing | Audit status and release status updated |

## Immediate Batch Order

1. Systems/security/credential SOPs already proof-ready: audit and release review.
2. Southington GBP/Get Found real-client SOPs: finish authenticated access proof.
3. Controlled synthetic batch: free report, partner, checkout, abandoned cart, timed upsell, client handoff, report generation.
4. Client hub/magic-link SOPs: implement/test protection before adding Southington to Supabase client profiles.
5. Prospecting seed-test SOPs: prepare approval packet, then run only after approval.
6. Recurring SOPs: weekly safety, monthly recap, retention, cancellation, incident drills as the cycle or event occurs.

## Owner Ask Standard

Mike is not needed for synthetic data, draft artifacts, read-only checks, public research, Monday updates, proof docs, or agent training. Mike is only needed for explicit approval, access failure after agent exhaustion, spend/cap change, destructive credential action, live send, public edit, payment/billing/legal/reputation risk, or a decision no agent can safely make.
