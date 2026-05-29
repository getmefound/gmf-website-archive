# SOP 181 - Waiting State SLA And Timer Control

Status: Drafted
Version: 0.1
Owner: Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-181-waiting-state-sla-and-timer-control.md`

## Purpose

Make every true dependency visible, owned, timed, and recoverable so GMF work does not stall silently as client and job volume grows.

## Covered Master Map Rows

- Waiting state SLA and timer control

## Scope

This SOP applies to every GMF job, client, prospect, partner, system task, recurring task, proof review, and agent handoff that is not immediately complete.

`Waiting` is reserved for a true external dependency, scheduled date, or required human decision. It is not used when an internal agent, reviewer, script, or dispatcher can still inspect, verify, draft, test, research, document, route, or rescue the next step.

## Trigger

Any job is tempted to enter a waiting state, including waiting on a client, vendor, platform, approval, recurring date, access, payment, or owner decision.

## Expected Output

A Monday/Mission Control record with dependency reason, owner, next owner, due time, escalation time, proof needed, and recovery action if the timer is missed.

## Roles

| Role | Responsibility |
|---|---|
| Manager | Owns queue health, waiting-state accuracy, and escalation routing |
| Current owner | Records whether the job is internally runnable or truly waiting, and what proof unlocks it |
| Next owner | Acknowledges the handoff and starts the next safe step unless a true dependency blocks it |
| Systems Director | Automates timer checks, watchdogs, and dashboards where possible |
| Auditor | Verifies waiting states are real and not hiding failed execution |
| Mike | Involved only when the owner-needed rule applies |

## Status Rule

If the next step belongs to an agent or reviewer, the job is not waiting. Use one of these active statuses instead:

| State | Use When | Required Control |
|---|---|---|
| `Agent Working` | An internal agent can continue safe work | Owner, next action, proof link, expected update |
| `Ready For Review` | Auditor/reviewer must pass, hold, or request changes | Reviewer, handoff acknowledgment, due time |
| `Access Investigation` | Agent is still exhausting OAuth/API/browser/public/source paths | Agent owner, timer, exhausted-path proof |
| `Blocked - Queue Control` | The row lacks owner, proof, timer, or execution path | Manager/System Director rescue |

## True Waiting Labels

| State | Use When | Default Timer |
|---|---|---:|
| `Waiting on Client` | Client must provide access, facts, approval, list, photos, or decision | Follow SOP 184 cadence |
| `Waiting on Vendor/Platform` | Vendor, API, DNS, Google, Stripe, email provider, or platform must change/respond | Check daily until proof or new ETA |
| `Waiting on Owner` | Mike must approve, decide, fix access, or accept business risk after exhaustion | Same business day for P0; next business day for P1 |
| `Waiting on Human Approval` | A client, partner, vendor, or reviewer outside the active agent lane must approve before a risky action | Same business day for P0; next business day for P1 |
| `Scheduled / Timer` | Job waits for weekly/monthly cadence, cool-down, SLA date, or natural event | Next scheduled cycle date |
| `Blocked` | Work cannot continue safely and no normal waiting path exists | Manager review same business day |
| `Parked` | Work is intentionally deferred and not active | Recheck date required |

## Required Fields

Every waiting job must have:

- current owner
- next owner
- reviewer
- client/prospect/partner/system
- dependency or active-work reason
- required unlock proof
- expected receive time
- escalation time
- next action if missed
- handoff acknowledgment status when the next owner is expected to receive the work
- Mike-needed status
- proof link or notes path

## Procedure

1. When work cannot finish now, current owner first asks: can an agent, script, reviewer, or dispatcher continue safely?
2. If yes, mark `Agent Working`, `Ready For Review`, or `Access Investigation`, assign the next owner, and set the next proof/timer.
3. If no, current owner assigns the precise true waiting state.
4. Current owner records what is missing and what proof will unlock the next step.
5. Current owner sets expected receive time and escalation time.
6. Current owner names the next owner and reviewer.
7. Next owner is assigned before the current owner stops.
8. Manager checks whether Mike is actually needed. If not, work stays agent-owned.
9. If the timer is missed, Manager does not wait for the user to ask. Manager routes the rescue path:
   - agent late: SOP 182 or SOP 183
   - client late: SOP 184
   - access/credential late: SOP 174
   - proof late: SOP 166
   - runtime late: SOP 179
   - skill gap: SOP 178
10. Update Monday/Mission Control after every timer action.

## Timing Defaults

| Priority | Acknowledge By | First Timer Check | Rescue Starts |
|---|---:|---:|---:|
| P0 | 1 business hour | 2 business hours | 4 business hours or same day |
| P1 | 4 business hours | Same business day | Next business day |
| P2 | 1 business day | 2 business days | 3 business days |
| P3 | 2 business days | 5 business days | 7 business days |

Client-facing timers use SOP 184. Live-send, public-edit, billing, legal/privacy, reputation, payment, and credential timers must respect the approval SOPs even if the SLA is missed.

## Required Proof

- Active status or true waiting state and reason
- Current owner and next owner
- Expected receive time and escalation time
- Unlock proof needed
- Timer check result
- Rescue action, if missed

## What To Log

- `Dependency State` or active-work state
- `Current Owner`
- `Next Owner`
- `Handoff Ack`
- `Ack At`
- `Expected Receive`
- `Escalate At`
- `Unlock Proof`
- `Missed Timer Action`
- `Mike Needed`

## Communication Rule

Routine timer movement stays in Monday, Mission Control, proof reports, or on-demand commands. Manager DMs Mike only when the owner-needed rule is met.

## Mike Escalation Rule

Escalate to Mike only for owner approval, access/credential fixes after agent exhaustion, spend/cap changes, pricing, refunds, billing, legal/privacy risk, reputation risk, public promises, public profile edits, HighLevel AI feature toggles, live sends, payments, or blockers agents cannot clear.

## Failure Or Blocker Handling

If a waiting state is being used for internal agent/reviewer work, or has no owner, timer, or next action:

1. Manager converts it to `Agent Working`, `Ready For Review`, `Access Investigation`, or `Blocked - Queue Control`.
2. Manager assigns a current owner and reviewer.
3. Systems Director/Manager maps it to an execution path.
4. Auditor verifies whether the stall exposed a SOP/tool/training gap.
5. Coach updates the SOP/training pack if the process caused the stall.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | In progress - Monday rows corrected so agent-owned work is not labeled waiting on 2026-05-28 |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created global waiting-state timer control after owner asked for non-stopping operation at 50+ client scale | Manager |
| 0.2 | 2026-05-28 | Restricted Waiting to true external/timed dependencies; internal handoffs now use Agent Working, Ready For Review, or Access Investigation | Manager |

## Source Documents

- `docs/AGENT_OPERATING_MODEL.md`
- `docs/GMF_OWNER_COMMAND_PLAN.md`
- `docs/sops/SOP-125-monday-board-update.md`
- `docs/sops/SOP-166-auditor-proof-gate.md`
- `docs/sops/SOP-174-credential-access-escalation.md`
- `docs/sops/SOP-175-human-needed-slack-alert.md`
- `docs/sops/SOP-178-agent-skill-gap-training-escalation.md`
- `docs/sops/SOP-179-agent-runtime-watchdog-and-dispatcher.md`
