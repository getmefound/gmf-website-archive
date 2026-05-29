# SOP 184 - Client Information Request Cadence And Escalation

Status: Drafted
Version: 0.1
Owner: Account Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-184-client-information-request-cadence-and-escalation.md`

## Purpose

Standardize what happens when GMF needs information, access, approval, photos, customer lists, or decisions from a client, so client-dependent work keeps moving without nagging or disappearing.

## Covered Master Map Rows

- Client information request cadence and escalation

## Scope

This SOP applies to client requests for Google Business Profile access, website/domain facts, hours, service areas, photos, customer lists, approvals, review-send readiness, public-edit approval, billing clarification, and any other client-provided input.

## Trigger

A GMF agent needs a client-provided item before the next step can be safely completed.

## Expected Output

Clear client ask, due date, reminder cadence, alternate self-serve path, escalation route, and final status if the client does not respond.

## Roles

| Role | Responsibility |
|---|---|
| Account Manager | Sends client requests, reminders, and client-safe status updates |
| Specialist agent | Supplies exact needed item, why it matters, and self-serve checks already attempted |
| Manager | Handles risk, relationship, pause, or plan-impact decisions |
| Auditor | Checks wording, proof, and whether reminders were appropriate |
| Mike | Involved only for owner-needed decisions or relationship/material risk |

## Request Types And Cadence

| Request Type | First Ask | Reminder 1 | Reminder 2 | Escalation |
|---|---:|---:|---:|---|
| Access required for launch, such as GBP, website, DNS, Search Console | Day 0 | 2 business days | 5 business days | Day 7 Manager relationship review |
| Customer list/photo/content request | Day 0 | 3 business days | 7 business days | Day 10 adjust scope/status |
| Approval before public edit, review reply, or send | Day 0 | 1 business day | 3 business days | Day 5 hold action and Manager review |
| Billing/refund/legal/reputation decision | Day 0 | Same business day if urgent | Next business day | Manager/Mike path if owner-needed |
| Nice-to-have optimization input | Day 0 | 7 business days | Next monthly recap | Park until next cycle |

## Procedure

1. Specialist agent records the exact item needed and why.
2. Specialist agent documents existing sources checked before asking the client.
3. Account Manager sends one clear ask with:
   - exact request
   - why it matters
   - easiest way to provide it
   - due date
   - what GMF can keep doing meanwhile
4. Account Manager logs `Waiting on Client`, expected receive date, and reminder dates.
5. If the client responds, Account Manager routes the item to the specialist agent and next owner acknowledges under SOP 182.
6. If the client does not respond, Account Manager sends reminders using the cadence table.
7. After the final reminder:
   - continue safe work if possible
   - adjust scope/status if the missing item is optional
   - hold the risky action if approval/access is required
   - route relationship or material risk to Manager
8. Manager asks Mike only if the owner-needed rule applies.

## Client-Safe Ask Pattern

Use this structure:

```text
Quick next step for [business/client]:

To keep [specific work] moving, we need [exact item].

Easiest option: [simple instruction/link].

If you can send it by [date], we can [next action]. While we wait, we will keep working on [safe parallel item].
```

## Hard Rules

- Do not ask the client for something an agent can verify safely from existing access, public sources, prior emails, Monday, Mission Control, proof artifacts, or docs.
- Do not send repeated vague reminders.
- Do not blame the client.
- Do not perform public edits, review sends, billing actions, or risky promises without the required approval.
- Keep safe parallel work moving while waiting.

## Required Proof

- Original ask
- Due date
- Reminder dates
- Client response or no-response proof
- Safe parallel work completed
- Final decision: received, still waiting, held, scope adjusted, escalated, or parked

## What To Log

- Request type
- Client contact
- Exact item requested
- Source paths already checked
- Due date
- Reminder schedule
- Status
- Next owner after response
- Escalation status

## Mike Escalation Rule

Do not ask Mike to chase client information unless the missing item creates material risk, relationship risk, public-edit/live-send/billing/legal/reputation risk, or requires a business decision only Mike can make.

## Failure Or Blocker Handling

If the client does not respond after the cadence:

1. Account Manager marks the missing item and impact.
2. Specialist agent records what safe work can still proceed.
3. Manager decides hold, park, reduce scope, or escalate.
4. Auditor checks whether the request was clear and appropriately timed.
5. Coach updates templates if confusion caused the delay.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | Pending - next real client missing-info request |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created client information request cadence and escalation control for scale | Account Manager |

## Source Documents

- `docs/AGENT_OPERATING_MODEL.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/sops/SOP-005-google-business-profile-access-request-verification.md`
- `docs/sops/SOP-057-gbp-access-request.md`
- `docs/sops/SOP-058-customer-list-request.md`
- `docs/sops/SOP-059-onboarding-blocker-follow-up.md`
- `docs/sops/SOP-175-human-needed-slack-alert.md`
