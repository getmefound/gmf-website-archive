# SOP 178 - Agent skill-gap training escalation

Status: Drafted
Version: 0.1
Owner: Coach/Trainer
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-178-agent-skill-gap-training-escalation.md`

## Purpose

Make agent skill gaps visible, trainable, testable, and auditable so GMF work keeps moving instead of stalling silently.

## Covered Master Map Rows

- Agent skill-gap training escalation

## Scope

This SOP applies when any GMF agent lacks the skill, context, tool clarity, source confidence, process clarity, or proof path needed to finish assigned work safely.

## Trigger

Any agent cannot safely or confidently complete assigned work using current SOPs, tools, source docs, and available context.

## Expected Output

Training request recorded, Coach/Trainer instruction delivered, agent rerun completed, Auditor verification logged, and Manager owner view updated.

## Roles

| Role | Responsibility |
|---|---|
| Owner | Coach/Trainer owns the training fix |
| Requesting agent | Reports the exact gap and reruns the task after training |
| Manager | Keeps the task assigned, routes training, updates Monday/Mission Control, and asks Mike only when required |
| Auditor | Verifies the rerun before Done |
| Mike | Involved only for owner-required decisions, access, spend, risk, public edits, live sends, or unresolved blockers |

## Hard Rules

- Agents do not silently stall.
- Agents do not guess through risky work.
- Stop only the unsafe or blocked step, not the whole workstream.
- Manager keeps the task owner assigned while training happens.
- Coach/Trainer must create a usable instruction, checklist, worked example, SOP update, tool note, or eval scenario.
- Auditor must verify the rerun before Done.
- Mike is not the training queue manager; Manager is.

## Procedure

1. Agent reports: `Training requested: [Agent] needs [skill/context/tool/process] to complete [task]. Current risk: [low/medium/high]. Safe work continuing: [yes/no]. Mike needed: [no/yes because].`
2. Agent records source docs checked, what is missing, proof/blocker, and next safe work.
3. Manager records owner agent, reviewer, status, blocker, next action, and Mike-needed status in Monday/Mission Control.
4. Manager routes the gap to Coach/Trainer.
5. Coach/Trainer reviews current SOPs, training pack, source docs, examples, and tools.
6. Coach/Trainer delivers the smallest useful training artifact.
7. Requesting agent reruns the blocked step or next safe equivalent using the new training.
8. Auditor verifies pass, hold, or block.
9. Coach/Trainer updates the SOP/training pack if the gap came from missing or unclear documentation.
10. Manager updates the owner view and asks Mike only if the Mike escalation rule applies.

## Required Proof

- Original training request
- Work record or Monday item
- Training artifact link or summary
- Agent rerun output
- Auditor verification note
- SOP/training update link, if required
- Mike escalation note, if required

## What To Log

- Agent requesting training
- Assigned task
- Skill/context/tool/process gap
- Risk level
- Safe work continuing
- Coach/Trainer output
- Auditor result
- Next owner and next action

## Communication Rule

Do not use this SOP to send client/prospect-facing messages. If the skill gap affects a customer-facing message, Manager routes the draft through the authorized sender and Auditor proof gate.

## Mike Escalation Rule

Escalate to Mike only for owner approval, access or credential fixes, spend/cap changes, pricing, refunds, billing, legal/privacy risk, reputation risk, public promises, public Google/profile edits, HighLevel AI feature toggles, live sends, payments, or blockers agents cannot clear.

## Failure Or Blocker Handling

1. Stop unsafe action.
2. Record the failed or missing training step.
3. Assign the correction to Coach/Trainer or the source-doc owner.
4. Auditor marks hold or block.
5. Manager updates Monday/Mission Control.
6. Notify Mike only if the Mike escalation rule applies.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | Pending |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Created from owner autonomy directive and Coach/Trainer review | Coach/Trainer |

## Source Documents

- `docs/GMF_AGENT_TRAINING_ESCALATION_PROTOCOL.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/sops/SOP-156-agent-training-pack-update.md`
- `docs/sops/SOP-166-auditor-proof-gate.md`
