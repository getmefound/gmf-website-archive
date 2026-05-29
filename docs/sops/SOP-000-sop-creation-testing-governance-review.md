# SOP 000 - SOP Creation, Testing, Governance, And Review

Status: Active
Version: 1.1
Owner: Coach
Reviewer: Auditor
Approver: Manager for normal releases; Mike for material business risk
Effective date: 2026-05-27
Next review: 2026-08-27
Source of truth: `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

## Purpose

Define how GMF creates, tests, activates, reviews, updates, and retires SOPs.

This SOP prevents the business from becoming dependent on memory, chat history, one-off decisions, or undocumented shortcuts.

## Scope

Applies to every GMF operating SOP, including prospecting, sales, partner workflows, onboarding, fulfillment, reporting, systems, finance, client service, training, audit, and escalation.

## Roles

| Role | Responsibility |
|---|---|
| Coach | Owns SOP standards, template, changelog, training notes, and review calendar |
| SOP owner | Accountable for operational accuracy and keeping the SOP current |
| Operator | Follows the SOP and reports gaps, confusion, and drift |
| Auditor | Checks proof, claims, risk controls, and whether actual work matches the SOP |
| Manager | Approves normal SOP activation and monitors SOP health |
| Mike | Approves only material business-risk decisions |

## Mike Escalation Rule

Before any SOP routes an ask to Mike, the assigned agent must pass the universal owner-ask exhaustion gate.

The agent must first exhaust:

- existing account/tool access
- public sources
- local workspace docs
- Slack history
- Monday
- Mission Control
- proof artifacts
- safe read-only checks or dry-runs
- drafts that can be prepared before approval
- Coach/Trainer help for skill gaps

Escalate to Mike only when the SOP change affects:

- pricing, offers, refunds, billing, or commissions
- tool spend or vendor commitments
- legal, privacy, compliance, or data-retention risk
- reputation risk or public review handling
- public/client-facing promises
- credentials, access ownership, or account recovery
- HighLevel AI feature toggles
- live prospecting clearance
- direct checkout, agentic checkout, payments, or merchant-of-record risk

Normal SOP drafting, formatting, review reminders, and proof checks should stay with Coach, Manager, Auditor, and the assigned role owner.

Do not write SOPs that ask Mike for information, status, or manual steps an agent can inspect, verify, draft, document, test, research, or route.

## SOP Statuses

| Status | Meaning |
|---|---|
| Needed | SOP is identified but not written clearly enough to use |
| Drafted | Source material exists, but testing or proof is incomplete |
| Active | SOP has passed review, dry run, pilot, audit, and release |
| Needs Update | SOP exists but no longer matches reality, risk rules, tools, or language |
| Archived | SOP was replaced or retired and should not be used for current work |

## Required SOP Metadata

Every SOP must include:

- title and SOP number
- status
- version
- owner
- reviewer
- approver
- effective date
- next review date
- purpose
- scope
- trigger
- prerequisites
- tools
- step-by-step procedure
- required proof
- logging rules
- client/prospect-facing communication rule
- Mike escalation rule
- failure or blocker handling
- changelog
- source documents

## File Naming

Use this pattern for controlled SOPs:

`docs/sops/SOP-###-short-kebab-name.md`

Examples:

- `SOP-000-sop-creation-testing-governance-review.md`
- `SOP-001-smartlead-api-access-readiness.md`
- `SOP-002-free-visibility-check-intake-report-delivery.md`

Use `SOP-000` only for this governance SOP.

## SOP Creation Procedure

1. Identify the need.
   - Create or update a row in `docs/GMF_SOP_MASTER_MAP.md`.
   - Assign priority, status, owner role, trigger, and expected output.

2. Confirm scope.
   - Decide whether this needs a full SOP, checklist, template, dashboard rule, or visual map.
   - Keep one SOP focused on one repeatable workflow.

3. Draft from source truth.
   - Use existing docs, actual tool behavior, current offer rules, and recent operator decisions.
   - Do not invent steps that the business cannot actually perform.

4. Assign owner and reviewer.
   - Every SOP needs one accountable owner.
   - Committee ownership is not allowed for Active SOPs.
   - Multiple support roles are fine, but one owner must be accountable.

5. Add proof requirements.
   - Define what proves the work happened.
   - Examples: report link, screenshot, Supabase row, Monday item, Stripe event, email log, send log, audit note, or client hub update.

6. Add risk controls.
   - Include suppression, approval, escalation, access, spend, claim, privacy, and client-facing language rules where relevant.

7. Link visuals when useful.
   - Use `docs/GMF_SOP_VISUAL_MAP.md` for top-level maps.
   - Add Mermaid, Miro, Lucidchart, or screenshot links only when the visual helps someone execute or review the process.

8. Move to Drafted.
   - Drafted means the SOP can be reviewed, not that it can be trusted in live work yet.

## SOP Testing Procedure

An SOP cannot become Active until all five gates pass:

1. Desktop review
   - Owner and reviewer read the SOP.
   - Confirm purpose, trigger, inputs, steps, outputs, proof, handoffs, and escalation path.

2. Dry run
   - Someone other than the writer follows the SOP using a fake or safe case.
   - Record every missing step, unclear instruction, unnecessary step, and tool mismatch.

3. Low-risk live pilot
   - Run the SOP on a real case with low customer/prospect/reputation risk.
   - Capture the required proof exactly as written.

4. Auditor proof gate
   - Auditor checks proof, claims, logs, handoffs, client/prospect wording, and risk controls.
   - If proof is missing, the SOP stays Drafted or becomes Needs Update.

5. Release approval
   - Manager approves normal releases.
   - Mike approves material-risk changes only.

## Publishing Procedure

When an SOP becomes Active:

1. Set status to `Active`.
2. Set version to `1.0` or the next major/minor version.
3. Set effective date.
4. Set next review date.
5. Add changelog entry.
6. Update `docs/GMF_SOP_MASTER_MAP.md`.
7. Add or update the Monday SOP backlog item.
8. Notify affected roles with a short release note.
9. Add training or acknowledgment if the change affects customer-facing work, live sends, billing, access, reputation, or compliance.

## Review Cadence

| SOP Type | Review Cadence |
|---|---|
| P0 or high-risk | Quarterly |
| P1 operational | Semi-annually |
| P2/P3 optimization | Annually |
| Any SOP affected by a real change | Immediately |

Immediate review triggers:

- tool change
- failed handoff
- client complaint
- billing/refund issue
- reputation risk
- access or credential issue
- live-send process change
- legal/privacy concern
- public promise change
- audit finding
- operator reports that the SOP no longer matches reality

## Change Request Procedure

When someone finds a gap:

1. Capture the change request.
   - Include SOP number, issue, source, risk, affected roles, and suggested fix if known.

2. Classify the change.
   - Minor: typo, wording, formatting, link, small clarification.
   - Moderate: step change, tool field change, new proof requirement, handoff adjustment.
   - Major: workflow redesign, approval path change, client/prospect impact, spend/risk/legal change.

3. Decide the path.
   - Minor changes can be approved by Coach.
   - Moderate changes need owner and Auditor review.
   - Major changes need Manager approval and Mike approval when the Mike escalation rule applies.

4. Update and test.
   - Moderate and major changes must pass the relevant dry-run, pilot, or audit gate before release.

5. Communicate the release.
   - Tell affected roles what changed, why it changed, what they need to do, and where the current SOP lives.

## Archive And Retirement Procedure

Archive an SOP when it is replaced, obsolete, or no longer part of GMF operations.

1. Change status to `Archived`.
2. Add retirement date.
3. Add reason for retirement.
4. Link the replacement SOP if one exists.
5. Remove the old SOP from normal working views.
6. Keep the archived copy available for audit/history.

## Monday Board Columns

Mirror the SOP backlog in Monday with these fields:

- SOP number
- SOP name
- department/group
- priority
- status
- owner role
- named owner
- reviewer
- approver
- next review date
- last reviewed date
- source doc link
- visual link
- proof requirement
- blocker
- Mike decision needed

## SOP Health Dashboard

Manager and Coach should monitor:

- total SOPs by status
- P0 SOPs Active vs Drafted/Needed
- SOPs with no named owner
- SOPs overdue for review
- SOPs with missing proof in recent runs
- blocked handoffs by SOP
- audit findings by SOP
- average days from change request to approved update
- Mike decision items open

## Failure Handling

If an SOP fails during execution:

1. Stop if there is client, prospect, billing, privacy, reputation, or send risk.
2. Log the failure against the SOP.
3. Capture what happened, what proof is missing, and who is blocked.
4. Route to the SOP owner and Auditor.
5. Escalate to Manager or Mike only if the Mike escalation rule applies.
6. Mark the SOP `Needs Update` if the failure came from unclear, outdated, missing, or unrealistic instructions.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 1.0 | 2026-05-27 | Initial Active SOP for GMF SOP governance | Coach |
| 1.1 | 2026-05-27 | Added universal owner-ask exhaustion gate before routing any SOP ask to Mike | Manager/Coach |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
