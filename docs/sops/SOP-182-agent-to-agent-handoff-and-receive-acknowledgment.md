# SOP 182 - Agent To Agent Handoff And Receive Acknowledgment

Status: Drafted
Version: 0.1
Owner: Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-182-agent-to-agent-handoff-and-receive-acknowledgment.md`

## Purpose

Ensure the next agent is assigned, aware, and actively starting before the current agent stops, so handoffs do not disappear between roles.

## Covered Master Map Rows

- Agent-to-agent handoff and receive acknowledgment

## Scope

This SOP applies whenever GMF work passes from one agent/role to another: Scout to Reporter, Reporter to Auditor, Auditor to Account Manager, Systems Director to Manager, Profile Manager to Reviews Manager, Sales Rep to Manager, or any similar transition.

## Trigger

An agent completes, blocks, or pauses a step that requires another agent to act next. This is an active handoff, not a waiting state.

## Expected Output

A handoff packet with current proof, next owner, expected receive time, acceptance/acknowledgment, due time, and missed-handoff rescue path.

## Roles

| Role | Responsibility |
|---|---|
| Sending agent | Delivers complete handoff packet and does not abandon the task without a next owner |
| Receiving agent | Acknowledges receipt, accepts or rejects completeness, and starts the next safe step |
| Manager | Owns queue continuity and resolves missed/unclear handoffs |
| Auditor | Checks proof completeness and failed-handoff patterns |
| Coach | Updates training/SOP if handoffs fail repeatedly |

## Handoff Packet

Every handoff must include:

- client/prospect/partner/system
- related SOP
- current status
- work completed
- proof link/path
- current blocker, if any
- exact next action
- receiving agent
- reviewer
- due time
- expected receive/acknowledgment time
- risk flags
- Mike-needed status

## Timing

| Priority | Receiver Acknowledgment | If No Acknowledgment | Rescue |
|---|---:|---|---|
| P0 | 1 business hour | Manager pings/updates Monday | Reassign or route to SOP 178/179 same day |
| P1 | 4 business hours | Manager checks by end of business day | Reassign next business day |
| P2 | 1 business day | Manager checks next business day | Reassign after 2 business days |
| P3 | 2 business days | Manager checks on next review cycle | Reassign if still stale |

## Procedure

1. Sending agent completes current safe work or records blocker.
2. Sending agent creates the handoff packet.
3. Sending agent assigns the receiving agent and reviewer in Monday/Mission Control.
4. Sending agent sets expected receive time and due time.
5. Receiving agent acknowledges:
   - `Accepted - starting`
   - `Accepted - scheduled/timer`
   - `Rejected - missing proof`
   - `Blocked - needs access`
   - `Training requested`
6. If accepted, the Monday status must be `Agent Working` or `Ready For Review`, not `Waiting on Agent`.
7. If rejected or blocked, Manager routes the missing piece back to the correct owner without asking Mike unless the owner-needed rule applies.
8. If no acknowledgment by timer, Manager starts rescue:
   - reroute to backup/Manager
   - request Coach/Trainer under SOP 178
   - repair dispatcher under SOP 179
   - escalate credential/access under SOP 174
9. Auditor samples handoffs weekly and records failed handoffs by SOP.

## Required Proof

- Handoff packet
- Receiver acknowledgment or missed acknowledgment note
- Next owner and due time
- Proof link/path
- Rescue action if late

## What To Log

- Sending agent
- Receiving agent
- Ack status
- Ack time
- Due time
- Missing proof, if any
- Next action
- Escalation path

## Communication Rule

Internal handoff movement stays in Monday/Mission Control. Client-facing or Mike-facing communication happens only through the authorized role and the relevant approval SOP.

## Mike Escalation Rule

Do not ask Mike because an agent failed to acknowledge a handoff. Manager must first reroute, train, repair the dispatcher, or classify the true blocker. Ask Mike only if the owner-needed rule remains after that.

## Status Rule

Agent-to-agent movement should not appear in Monday as `Waiting`. The correct owner-visible statuses are:

- `Agent Working` when the next agent is acting.
- `Ready For Review` when Auditor/reviewer is acting.
- `Blocked - Queue Control` when the handoff lacks proof, owner, or timer.
- `Waiting on Client`, `Waiting on Owner`, or `Waiting on Vendor/Platform` only after the internal rescue path is exhausted or the dependency is truly external.

## Failure Or Blocker Handling

If a handoff is incomplete:

1. Receiving agent rejects with the exact missing proof.
2. Manager assigns the smallest next correction.
3. Sending agent or correct owner fixes the packet.
4. Receiving agent acknowledges again.
5. Repeated failed handoffs trigger SOP 170 process failure retrospective.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | Pending - next multi-agent handoff |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created handoff receive acknowledgment control for multi-client scale | Manager |
| 0.2 | 2026-05-28 | Clarified that agent handoffs are active work, not Waiting states | Manager |

## Source Documents

- `docs/AGENT_OPERATING_MODEL.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/sops/SOP-125-monday-board-update.md`
- `docs/sops/SOP-166-auditor-proof-gate.md`
- `docs/sops/SOP-170-process-failure-retrospective.md`
- `docs/sops/SOP-178-agent-skill-gap-training-escalation.md`
- `docs/sops/SOP-179-agent-runtime-watchdog-and-dispatcher.md`
