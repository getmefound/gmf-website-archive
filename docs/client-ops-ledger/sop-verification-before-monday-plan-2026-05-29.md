# SOP Verification Before-Monday Plan - 2026-05-29

Status: complete for May 31 certification; watchdog remains active
Owner: Manager / Elon
Execution owners: Auditor, Coach, Systems Director, Profile Manager, Sales Manager, Reporter
Latest watchdog: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-30T01-18-49-854Z.md`
Monitor: `/mike-mc/jobs/progress`
Launch readiness rule: `docs/client-ops-ledger/sop-launch-readiness-certification-2026-05-29.md`
Full certification proof: `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md`

## Current Count

Verified means Auditor pass or release, not only drafted, desktop-reviewed, or dry-run.

| Gate | Count |
|---|---:|
| SOP markdown files found | 189 |
| SOPs tracked in testing backlog CSV | 187 |
| Desktop review pass | 187 / 187 |
| Dry run pass | 187 / 187 |
| Auditor verified | 5 / 187 |
| Launch Ready | 101 / 187 |
| Trigger Ready | 54 / 187 |
| Launch Gate Ready | 12 / 187 |
| Canary Only | 6 / 187 |
| Parked Not Launch-Critical | 9 / 187 |
| Hold | 0 / 187 |
| Pending audit/proof | 0 / 187 |

## Before-Monday Strategy

No agent is allowed to mark an event-dependent SOP verified from fake proof. The solution is to separate `Verified` from `Launch Ready`.

Before Monday, Manager pushed every SOP into one of six honest states:

| State | Count | Owner | Done Proof |
|---|---:|---|---|
| Verified | 5 | Auditor | Audit pass/release proof |
| Launch Ready | 101 | Auditor / Manager | Controlled proof and Monday status |
| Trigger Ready | 54 | Responsible agent | Backlog row has trigger and owner |
| Launch Gate Ready | 12 | Responsible agent / Manager | Named approval/access/spend/risk gate |
| Canary Only | 6 | Responsible agent | First-client proof packet |
| Parked Not Launch-Critical | 9 | Manager / Coach | Park reason and activation trigger |

## Sprint Schedule

| Due | Work | Owner | Escalation |
|---|---|---|---|
| 2026-05-30 10:00 ET | Audit the proof-ready pilots and record terminal states. | Auditor | Done early |
| 2026-05-30 14:00 ET | Run Synthetic Controlled Test Batch 001 across safe/non-production SOP scenarios. | Coach / Systems Director | Done early |
| 2026-05-30 18:00 ET | Auditor reviews Batch 001 outcomes and updates testing backlog states. | Auditor | Done early |
| 2026-05-30 21:00 ET | Full backlog terminal-state certification, including magic-link code fix and build proof. | Manager / Systems Director | Done |
| 2026-05-31 12:00 ET | Reconcile 189 SOP markdown files vs. 187 activation-backlog rows, including multi-row governance SOPs and any newly added SOPs. | Systems Director / Coach | Manager at 2026-05-31 14:00 ET |
| 2026-05-31 18:00 ET | Publish Sunday go/no-go SOP verification memo for launch-critical SOPs. | Manager / Auditor | Owner decision only if a launch gate requires approval |

## Launch-Critical Rule

For the 6/1 launch, the required standard is not "every SOP in the company is fully verified by natural live event." The required standard is:

1. Launch-critical SOPs have Verified, Launch Ready, Canary Only, or Blocked status.
2. No live send, public profile edit, payment action, or reputation action runs without its guardrail SOP passed or explicitly approved.
3. Every active Monday job has a next owner, expected receive time, escalation time, and unlock proof.
4. Mike is only needed for approval, access failure after exhaustion, spend/cap change, destructive credential action, or public/customer-facing risk.
5. First Monday clients become monitored canary pilots where live evidence is still required.

## Manager Action

Manager has updated the SOP verification jobs in Monday with queue timers and will rerun watchdog after the updates. Any missed timer becomes a rescue action, not passive waiting.
