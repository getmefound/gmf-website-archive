# SOP 183 - Stuck Agent Timeout And Rescue

Status: Drafted
Version: 0.1
Owner: Systems Director / Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-183-stuck-agent-timeout-and-rescue.md`

## Purpose

Detect and rescue stuck agent work before it becomes invisible delay for clients, prospects, partners, or Mike.

## Covered Master Map Rows

- Stuck agent timeout and rescue

## Scope

This SOP applies to all GMF agent tasks marked `Agent Working`, `Ready For Review`, `Access Investigation`, or any manual/system task with an overdue next action.

## Trigger

- Agent misses expected receive, due time, or heartbeat
- Job sits in `Agent Working` without new proof
- Agent reports confusion, missing skill, or missing access
- Manager/Auditor sees a stale task
- Mike asks why an agent stopped

## Expected Output

Stuck task classified, rescued, reassigned, trained, repaired, escalated, or honestly blocked with proof.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Runs watchdog, repairs scripts/dispatchers, verifies runtime and integrations |
| Manager | Keeps work moving, reroutes ownership, and protects Mike from routine chasing |
| Stuck agent | States exact blocker and safe work remaining |
| Coach/Trainer | Trains skill/process gaps |
| Auditor | Verifies rescue proof and checks for repeated process failure |
| Mike | Involved only when owner-needed after exhaustion |

## Stuck Classifications

| Classification | Meaning | Rescue Path |
|---|---|---|
| `no_ack` | Next agent did not acknowledge handoff | SOP 182 rescue |
| `no_heartbeat` | Agent working but no proof/status by expected time | Manager check and reroute |
| `skill_gap` | Agent lacks know-how | SOP 178 |
| `access_gap` | Agent lacks access/credential/session | SOP 174 after self-serve checks |
| `runtime_gap` | Script/worker/dispatcher failed or does not exist | SOP 179 |
| `proof_gap` | Work may be done but proof is missing | SOP 166 |
| `client_wait` | Client owes info/access/approval | SOP 184 |
| `owner_needed` | Mike truly needed after exhaustion | SOP 175 |
| `misclassified_waiting` | Monday says Waiting even though an agent/reviewer can continue | Convert to Agent Working, Ready For Review, or Access Investigation |

## Timeout Defaults

| Priority | Heartbeat Required | Rescue Starts |
|---|---:|---:|
| P0 | Every 2 business hours while active | Same business day |
| P1 | Same business day | Next business day |
| P2 | Every 2 business days | Third business day |
| P3 | Weekly review | Next review cycle |

## Procedure

1. Run or inspect the active queue/watchdog.
2. Identify overdue or proofless agent tasks.
3. Classify each stuck item using the table above.
4. Check whether safe work can continue in parallel.
5. Route rescue:
   - no acknowledgment: SOP 182
   - skill gap: SOP 178
   - runtime gap: SOP 179
   - access gap: SOP 174
   - proof gap: SOP 166
   - client wait: SOP 184
   - owner needed: SOP 175
   - misclassified waiting: SOP 181 and SOP 182
6. Update Monday/Mission Control with classification, owner, next action, proof, and next timer.
7. If a task is rescued, assign the next owner and due time.
8. If a task cannot be rescued, record the exhausted path and exact owner-needed ask.
9. Auditor reviews repeated stuck patterns weekly and opens SOP 170 if needed.

## Required Proof

- Queue/watchdog source checked
- Stuck classification
- Owner and reviewer
- Rescue route
- Updated timer
- Proof of rerun, reassignment, training, access path, or escalation

## What To Log

- Stuck since
- Last proof
- Missing proof/action
- Classification
- Rescue owner
- Next check time
- Mike-needed status

## Communication Rule

Do not tell Mike an agent is working unless a real runner/manual owner/proof path exists. If a task is stuck, Manager says it is stuck, states the rescue path, and keeps routine recovery in Monday unless Mike is truly needed.

## Mike Escalation Rule

Mike is not a stuck-agent router. Ask Mike only when the remaining blocker is an owner approval, access fix, spend/cap change, legal/billing/deliverability/reputation/customer-facing risk, public edit, live send, payment, or another decision no agent can clear.

## Failure Or Blocker Handling

If the same SOP or agent gets stuck twice in 30 days:

1. Auditor opens process failure retrospective under SOP 170.
2. Coach updates training/SOP.
3. Systems Director repairs dispatcher/tooling if applicable.
4. Manager assigns a backup owner for the next run.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | In progress - Southington GBP access gap classified as `access_gap` and rescue timer set on 2026-05-28 |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created stuck-agent timeout and rescue control for autonomous operations | Systems Director / Manager |
| 0.2 | 2026-05-28 | Removed Waiting on Agent as a valid active state and added misclassified-waiting rescue | Systems Director / Manager |

## Source Documents

- `docs/GMF_OWNER_COMMAND_PLAN.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/sops/SOP-170-process-failure-retrospective.md`
- `docs/sops/SOP-174-credential-access-escalation.md`
- `docs/sops/SOP-175-human-needed-slack-alert.md`
- `docs/sops/SOP-178-agent-skill-gap-training-escalation.md`
- `docs/sops/SOP-179-agent-runtime-watchdog-and-dispatcher.md`
