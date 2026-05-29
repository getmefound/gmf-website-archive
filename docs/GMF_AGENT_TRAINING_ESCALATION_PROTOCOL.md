# GMF Agent Training Escalation Protocol

Status: active
Owner: Coach/Trainer
Reviewer: Auditor
Purpose: make agent skill gaps visible, trainable, and testable so GMF work does not stall silently.

## Core Rule

If an agent lacks the skill, context, process, tool access, or confidence to complete assigned work, the agent must request training instead of stopping or guessing.

Required phrase:

`Training requested: [agent] needs [skill/context/tool/process] to complete [task].`

## When To Trigger

Trigger this protocol when an agent:

- cannot complete a task using the current SOP
- does not know which tool or source of truth to use
- is uncertain whether an action is safe
- finds conflicting instructions
- lacks client/account access
- cannot prove Done
- repeats a mistake from a prior run
- needs current research before acting

## Owner Flow

Mike does not manage the training queue directly.

Manager owns routing. Coach/Trainer owns training. Auditor owns proof that training worked.

## Procedure

1. Agent reports the training request in plain language.
2. Manager records the task, blocker, owner agent, reviewer, and risk level.
3. Manager decides whether Mike is needed. Most training gaps do not need Mike.
4. Coach/Trainer reviews the relevant SOPs, source docs, tool docs, and examples.
5. Coach/Trainer creates or updates the instruction, checklist, prompt, template, or SOP.
6. Assigned agent reruns the task using the updated training.
7. Auditor verifies the next run, checks proof, and decides whether the gap is closed.
8. Manager updates the owner view with trained, blocked, or needs-Mike.

## Done Proof

A training escalation is Done only when these exist:

- the original training request
- the updated instruction/SOP/checklist/template
- the rerun output from the agent
- Auditor pass/fail
- next action if fail

## Mike Escalation Rule

Manager brings Mike in only if the training gap requires:

- owner judgment
- pricing, billing, refund, or spend decision
- credential/access fix
- public client/prospect/customer-facing action
- reputation, legal, privacy, deliverability, or customer-facing risk
- a custom promise or exception

## Standard Training Request Format

| Field | Required Content |
| --- | --- |
| Agent | Who is blocked |
| Task | What they were assigned |
| Gap | Skill/context/tool/process missing |
| Risk | What could go wrong if they guess |
| Needed Training | What Coach/Trainer must provide |
| Mike Needed | Yes/no and why |
| Next Safe Work | What can continue while training happens |

## Standard Manager Response

Manager replies with:

- assigned Coach/Trainer action
- reviewer
- expected Done proof
- whether Mike is needed
- what work continues in parallel

## Operating Note

Skill gaps are not failures. Hidden gaps are failures. GMF improves when agents surface the gap, get trained, and rerun the work with proof.
