# GMF Queue Control Coverage Audit

Status: current
Owner: Manager
Reviewer: Auditor
Last updated: 2026-05-28
Purpose: answer whether GMF has SOPs for waiting states, stuck agents, handoffs, client-request timing, and non-stop operations at 50+ client scale.

## Decision

The operating pattern is now documented, but it was not fully in place before this audit.

Before this audit, GMF had several partial controls for blockers, follow-ups, escalation, Monday updates, proof gates, and runtime watchdogs. The missing layer was a global waiting-state timer model that required expected receive time, next-agent acknowledgment, missed-timer rescue, and client request cadence across all jobs.

Four P0 SOPs were added to close that gap:

| SOP | Owner | Purpose |
|---|---|---|
| SOP 181 - Waiting State SLA And Timer Control | Manager | Every waiting state gets an owner, next owner, expected receive time, escalation time, and rescue action |
| SOP 182 - Agent To Agent Handoff And Receive Acknowledgment | Manager | Next agent must acknowledge receipt and due time before work can disappear between roles |
| SOP 183 - Stuck Agent Timeout And Rescue | Systems Director / Manager | Missed heartbeat/due/proof becomes classified and rescued |
| SOP 184 - Client Information Request Cadence And Escalation | Account Manager | Client asks get due dates, reminders, safe parallel work, and escalation rules |

## Existing Related SOPs Found

These SOPs already covered pieces of the non-stop pattern:

| SOP | Coverage |
|---|---|
| SOP 005 - Google Business Profile Access Request And Verification | Access request logging and two-business-day follow-up |
| SOP 031 - Prospect Follow-Up Cadence | Prospect report follow-up timing |
| SOP 035 - Abandoned Cart Recovery Cadence | 1-hour/24-hour/72-hour abandoned checkout follow-up |
| SOP 037 - Abandoned Cart Suppression And Exit Rules | Stops recovery when prospect buys/replies/opts out/no-fit |
| SOP 059 - Onboarding Blocker Follow-Up | Reminder every two business days for missing onboarding action |
| SOP 061 - Onboarding First-14-Days Status Loop | Launch-window status cadence |
| SOP 077 - Weekly Customer/Job Upload | Recurring review-list request cadence |
| SOP 081 - Follow-Up Review Request Send | Review request follow-up timing |
| SOP 010 - Weekly Safety Audit | Weekly stale blocker and risk review |
| SOP 125 - Monday Board Update | Job opens/blocks/completes with owner and next action |
| SOP 128 - SOP Health Dashboard | SOP status and blocked P0 visibility |
| SOP 129 - SOP Execution Proof Dashboard | Missing proof and failed handoff visibility |
| SOP 166 - Auditor Proof Gate | Prevents Done without proof |
| SOP 170 - Process Failure Retrospective | Root cause after incident, missed step, complaint, or failed handoff |
| SOP 174 - Credential/Access Escalation | Access blocker escalation after self-serve checks |
| SOP 175 - Human-Needed Slack Alert | Mike escalation only after exhaustion |
| SOP 178 - Agent Skill-Gap Training Escalation | Agents request training instead of silently stalling |
| SOP 179 - Agent Runtime Watchdog And Dispatcher | `Agent Working` must map to real execution/proof/blocker |

## Count

| Category | Count |
|---|---:|
| Existing partial timing/blocker/handoff/escalation SOPs | 18 |
| New global queue-control SOPs added | 4 |
| Total SOPs now covering the non-stop operating pattern | 22 |

## Implementation Status

The SOPs now exist and the first enforcement layer is implemented.

Completed on 2026-05-28:

1. Monday fields added: `Waiting State`, `Expected Receive`, `Escalate At`, `Next Owner`, `Handoff Ack`, `Ack At`, `Unlock Proof`, `Runtime State`, and `Last Watchdog`.
2. `scripts/monday-agent-jobs.mjs` updated so Manager/System Director/Reporter can write those fields.
3. `scripts/manager-agent-watchdog.mjs` updated to watch `Agent Working`, `Waiting...`, `Ready For Review`, `Blocked...`, and `Human Needed` states.
4. Watchdog now reports queue-control fields, flags missing waiting fields, and flags missed expected-receive/escalation timers.
5. Southington GBP access items were moved from generic `Agent Working` to `Waiting on Access` with timers and unlock proof.

Current proof:

- Watchdog output: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-28T16-30-38-906Z.md`
- Southington rescue proof: `docs/sops/live-pilots/2026-05-28-southington-gbp-access-gap-stuck-rescue.md`

Remaining implementation work:

1. Auditor reviews the first queue-control implementation proof and marks pass/hold/block.
2. Systems Director extends Mission Control UI/reporting to display the same queue-control fields.
3. Systems Director schedules the watchdog or dispatcher so this check runs without manual prompting.
4. Coach/Systems Director runs the synthetic controlled scenarios for handoff acknowledgment and client missing-info cadence.
5. Manager reports queue health daily/on demand without asking Mike unless the owner-needed rule applies.

## Core Rule

Nothing sits in `waiting`, `agent working`, `blocked`, or `ready for review` without:

- owner
- next owner
- expected receive time
- escalation time
- handoff acknowledgment when the next owner is ready to receive
- required proof
- next action if late
- Mike-needed status

If one of those fields is missing, the queue-control SOP treats the job as blocked by process, not as normal waiting.
