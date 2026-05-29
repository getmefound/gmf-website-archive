# SOP 179 - Agent Runtime Watchdog And Dispatcher

Status: Drafted
Version: 0.1
Owner: Systems Director / Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-179-agent-runtime-watchdog-and-dispatcher.md`

## Purpose

Prevent Monday's `Agent Working` status from becoming fake motion. Every active agent job must have a real execution path: runnable script, scheduled worker, manual agent SOP step with proof, or a true owner-needed blocker.

## Covered Master Map Rows

- Agent runtime watchdog and dispatcher

## Scope

This SOP applies to all GMF Monday `Agents Jobs` rows, Mission Control agent work, recurring runs, pilot tasks, and owner-visible operating statuses.

## Trigger

- A job is marked `Agent Working`
- Mike asks why an agent stopped
- Manager notices a task has a status but no proof, runner, or next execution step
- A recurring/scheduled agent job is introduced
- Agent work needs to be converted from manual Codex execution into real operating cadence

## Expected Output

Watchdog report, runtime classification, dispatcher mapping, Monday update, and proof link showing whether each active job is script-runnable, scheduled, manual-audit, access-blocked, systems-build, owner-needed, or unmapped.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Owns runtime mapping, scripts, scheduled workers, API/readiness checks, and dispatcher design |
| Manager | Owns Monday status accuracy, owner view, and escalation discipline |
| Specialist agent | Executes the mapped SOP step or reports a skill/access blocker |
| Auditor | Verifies proof and prevents fake Done/Working states |
| Mike | Involved only when the owner-needed rule is met |

## Hard Rules

- `Agent Working` is not proof of execution.
- Every `Agent Working` row must map to one of: script, schedule, manual proof step, access blocker, owner-needed blocker, or systems-build task.
- Manager must not imply a background agent is running unless a worker/process/schedule actually exists.
- Manager/Codex must not end a GMF operating turn silently. The end state must be either a direct Mike ask or a clear agent-running status with monitor location and next expected action.
- If a mapped agent, script, schedule, or dispatcher stops before completing the task, Systems Director/Manager repairs it until it works or records a true owner-needed blocker.
- If the task requires authenticated access, mark the access need honestly after self-serve checks are exhausted.
- If Mike is needed, Manager sends the exact Slack DM ask and links the exhausted proof.
- Routine progress stays in Monday, Mission Control, proof reports, or on-demand commands.

## Procedure

1. Run the watchdog:

```bash
npm run agent:watchdog
```

2. Review the generated outbox report.
3. For every `Agent Working` row, classify runtime state:
   - `script_runnable`
   - `scheduled_worker`
   - `manual_audit`
   - `access_blocked`
   - `systems_build`
   - `owner_needed`
   - `needs_dispatcher`
4. If `script_runnable`, run the script and attach output proof.
5. If `scheduled_worker`, verify last run, next run, failure alerts, and proof location.
6. If `manual_audit`, assign Auditor/specialist to review proof and mark pass/hold/block.
7. If `access_blocked`, confirm self-serve paths are exhausted before any owner ask.
8. If `systems_build`, create or update the artifact/script/runner needed.
9. If `needs_dispatcher`, Manager/System Director maps it to one of the valid runtime states.
10. Update Monday with status, runtime note, next action, proof link, and human-needed state.
11. If owner-needed, send Slack DM under SOP 175.
12. Before ending the work turn, Manager reports one of:
   - `Mike needed`: exact request, why agents cannot proceed, and proof exhausted
   - `Agent running`: agent/workstream, monitor location, current status, and next expected action
13. If the watchdog or user reports that an agent stopped early, Systems Director/Manager reruns diagnostics, repairs the mapping/runner/SOP/access path, updates Monday, and reruns the watchdog.

## Required Proof

- Watchdog report path
- Monday item IDs checked
- Runtime state per active item
- Script output, schedule proof, audit note, access proof, or owner-needed Slack link
- Updated Monday item
- Auditor pass/hold/block for workflow completion

## What To Log In Monday

- Agent Owner
- Reviewer
- Status
- Human Needed
- Runtime state
- Next Action
- Proof Link
- Notes explaining why the item is or is not actively running

## Failure Or Blocker Handling

If an item is labeled `Agent Working` but has no runner/proof/manual owner:

1. Do not leave it silently in `Agent Working`.
2. Classify it as `needs_dispatcher` or the closest accurate state.
3. Assign Systems Director/Manager to map execution.
4. If the blocker is access or owner approval, follow SOP 174 or SOP 175.
5. If the gap is agent skill, follow SOP 178.
6. If the runner stopped early, treat it as a runtime incident for this SOP: diagnose, repair, rerun, and attach proof until the task runs or the owner-needed rule is met.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | In progress - watchdog run on 2026-05-28 after Southington agent-runtime gap |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created after Monday `Agent Working` rows were found to be status-only, not live execution | Systems Director / Manager |

## Source Documents

- `docs/GMF_OWNER_COMMAND_PLAN.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/client-ops-ledger/agent-jobs-operating-structure.md`
- `scripts/manager-agent-watchdog.mjs`
- `docs/sops/SOP-125-monday-board-update.md`
- `docs/sops/SOP-175-human-needed-slack-alert.md`
- `docs/sops/SOP-178-agent-skill-gap-training-escalation.md`
