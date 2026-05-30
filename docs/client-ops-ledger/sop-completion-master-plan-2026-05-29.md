# SOP Completion Master Plan - 2026-05-29

Status: May 31 certification complete; watchdog remains active
Owner: Manager / Elon
Reviewer: Auditor
Source: `docs/sops/SOP_TESTING_BACKLOG.csv`
Monitor: `/mike-mc/jobs/progress`

## Current State

| Status | Count |
|---|---:|
| Total tracked SOP rows | 187 |
| Verified | 5 |
| Launch Ready | 101 |
| Trigger Ready | 54 |
| Launch Gate Ready | 12 |
| Canary Only | 6 |
| Parked Not Launch-Critical | 9 |
| Hold | 0 |
| Pending proof/audit | 0 |

Terminal state by priority:

| Priority | Terminal Rows |
|---|---:|
| P0 | 109 |
| P1 | 62 |
| P2 | 15 |
| P3 | 1 |

## Completion Rule

Every SOP must end in one of these terminal operating states:

| Terminal State | Meaning |
|---|---|
| Verified | Real or controlled proof is sufficient and Auditor passed it. |
| Launch Ready | Safe to operate inside defined boundaries. |
| Canary Complete | First real client/event ran with proof and Auditor promoted or held it. |
| Parked Not Launch-Critical | Valid SOP, but not needed for 6/1 operations and has a scheduled trigger/date. |
| Retired/Merged | Duplicate or non-useful SOP merged into another SOP with Auditor note. |
| Blocked Owner Needed | Only after agent/tool/doc/public-source exhaustion and exact owner ask is proven. |

No SOP is allowed to sit as vague `Pending` without owner, trigger, proof path, and next review date.

## Lanes To Complete All

### Lane 1 - Former Holds Fixed, Gated, Or Parked

Due: 2026-05-30 18:00 ET
Owner: Systems Director / Manager
Reviewer: Auditor

| SOP | Plan | Launch Impact |
|---|---|---|
| Client magic-link auth lifecycle | Fixed in code; build and runtime smoke passed. | Launch Ready. |
| Vercel deploy and rollback | Launch Gate Ready: production deploy needs clean/scoped release and rollback proof. | Gate controls deploy, not Monday acquisition. |
| Supabase schema migration | Launch Gate Ready: production DB changes need migration/rollback proof. | Gate controls DB changes. |
| Supabase backup and recovery | Launch Gate Ready: provider backup/PITR proof required before high client volume. | Gate controls scale. |
| SMS readiness and A2P gate | Parked because SMS is not used Monday. | Not launch-blocking. |
| SMS review request send | Parked behind SMS readiness and consent proof. | Not launch-blocking. |

### Lane 2 - Complete 6 Canary SOPs With First Real Events

Due: first matching event, then Auditor result within 24 hours
Owner: responsible specialist agent
Reviewer: Auditor

Canary SOPs:

- Client baseline visibility report
- Public review reply posting
- Cancellation request
- Refund or billing exception
- Refund and dispute handling
- Human-needed Slack alert

Rule: canary does not block client acquisition. It caps the first run, records proof, and either promotes to Launch Ready/Verified or becomes Hold before repeat use.

### Lane 3 - Finish The Pending P0 SOPs

Due: complete for May 31 certification
Owner: Manager routes by SOP owner
Reviewer: Auditor

Result: all P0 rows have a terminal operating state. P0 now contains 5 Verified, 80 Launch Ready, 7 Trigger Ready, 9 Launch Gate Ready, 6 Canary Only, and 2 Parked Not Launch-Critical.

### Lane 4 - Burn Down P1/P2/P3 With Weekly Proof Sprints

Due: weekly batches until complete
Owner: Coach / Manager
Reviewer: Auditor

| Batch | Scope | Due |
|---|---|---|
| Batch B | P1 sales, nurture, abandoned cart, upgrade, reporting workflows | 2026-06-07 |
| Batch C | P1/P2 recurring client success and content workflows | 2026-06-14 |
| Batch D | platform-triggered, UCP/agentic commerce, optimization, billing edge cases | 2026-06-21 |
| Batch E | remaining rare-event SOPs and retire/merge review | 2026-06-28 |

## Operating System To Make This Finish

1. Every SOP gets a proof lane: controlled, canary, recurring/event, or retired/merged.
2. Every active SOP job gets Monday queue controls: next owner, expected receive, escalation, unlock proof.
3. Auditor runs a daily pass/hold/block batch during launch week.
4. Agent Ness reports daily on SOP drag: where proof is stuck, who owns it, and what should be cut, parked, or fixed.
5. Manager keeps client acquisition moving while gating only irreversible/customer-risk actions.

## Monday Launch Standard

By 2026-06-01, the business can go live if:

- Get Found intake/report/payment/client-start path is Launch Ready or Canary Only with Auditor shadowing.
- Cold email remains paused until the live-send approval packet is complete and Mike approves final send.
- GBP edits are proposed/read-only unless profile access, fact approval, and public-edit approval pass.
- Client hub access uses signed magic links.
- No SOP row is left as vague pending or hold.

Full certification proof: `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md`

## Next Manager Actions

1. Keep `GMF - Launch readiness holds repair` moving until all 6 holds are fixed or parked.
2. Create or update owner-facing SOP progress on Mission Control using the backlog counts.
3. Rerun watchdog after each certification batch.
4. Convert Monday's first real client/lead actions into canary proof packets.
