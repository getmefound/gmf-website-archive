# GMF SOP Visual Map

Status: first visual draft
Owner: Coach
Last updated: 2026-05-27
Purpose: visual companion to `docs/GMF_SOP_MASTER_MAP.md` so Mike and operators can see how the SOP library fits together.

Governed by: `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

## Recommended Visual Stack

GMF should use four views, not one giant diagram:

| View | Best Tool Now | Purpose |
|---|---|---|
| Owner/executive view | This Mermaid map, then optionally Miro/Lucidchart | See the whole business flow, bottlenecks, and risk zones |
| Working board | Monday | Track SOP writing, status, owner, blockers, review dates, and Active/P0 coverage |
| Source of truth | Repo docs / Obsidian-style markdown | Hold approved SOPs, version history, source docs, and operating rules |
| Execution proof | Monday/Supabase/app workflows, later Process Street/Trainual/Waybook if needed | Prove the SOP was followed with checklists, required fields, artifacts, and approvals |

Do not try to make one tool do all four jobs too early. The first win is clarity, not software sprawl.

## Master Business Flow

```mermaid
flowchart LR
  Prospecting["1. Prospecting and Lead Generation"]
  Sales["2. Sales Conversion"]
  Partner["3. Partner Program"]
  Onboarding["4. Signup and Client Onboarding"]
  GetFound["5. Get Found Fulfillment"]
  StayFound["6. Stay Found Fulfillment"]
  AlwaysReady["7. Always Ready Fulfillment"]
  Service["8. Client Service, Retention, and Expansion"]
  Reporting["9. Reporting, Proof, and Dashboards"]
  Systems["10. Systems, Tools, and Data"]
  Finance["11. Finance, Admin, and Cost Control"]
  Knowledge["12. Knowledge, Training, and Brand Control"]
  Audit["13. Audit, Risk, and Escalation"]

  Prospecting --> Sales
  Partner --> Sales
  Sales --> Onboarding
  Onboarding --> GetFound
  GetFound --> StayFound
  StayFound --> AlwaysReady
  AlwaysReady --> Service
  Service --> Sales
  Reporting --> Service
  Reporting --> Knowledge
  Systems --> Prospecting
  Systems --> Onboarding
  Systems --> Reporting
  Finance --> Service
  Knowledge --> Prospecting
  Knowledge --> Sales
  Knowledge --> GetFound
  Audit --> Prospecting
  Audit --> Sales
  Audit --> Onboarding
  Audit --> GetFound
  Audit --> StayFound
  Audit --> AlwaysReady
  Audit --> Reporting
```

## Client Delivery Flow

```mermaid
flowchart LR
  Checkout["Payment or Mike-approved manual start"]
  Handoff["Sales-to-client handoff"]
  Hub["Client ID, folder, hub, magic link"]
  Access["GBP and needed access"]
  Baseline["Baseline visibility report"]
  Fixes["Get Found fixes"]
  Proof["Before/after proof"]
  Recurring["Stay Found recurring work"]
  Strategy["Always Ready strategy"]
  Recap["Monthly recap and client dashboard"]
  Renewal["Retention, renewal, or upgrade"]

  Checkout --> Handoff
  Handoff --> Hub
  Hub --> Access
  Access --> Baseline
  Baseline --> Fixes
  Fixes --> Proof
  Proof --> Recurring
  Recurring --> Strategy
  Strategy --> Recap
  Recap --> Renewal
  Renewal --> Recurring
```

## SOP Activation Flow

```mermaid
flowchart LR
  Need["Needed"]
  Draft["Drafted"]
  Review["Desktop review"]
  DryRun["Dry run"]
  Pilot["Live pilot"]
  AuditGate["Auditor proof gate"]
  Active["Active"]
  Calendar["Review calendar"]
  Change["Change request"]
  Archive["Archive or retire"]

  Need --> Draft
  Draft --> Review
  Review --> DryRun
  DryRun --> Pilot
  Pilot --> AuditGate
  AuditGate --> Active
  Active --> Calendar
  Calendar --> Review
  Active --> Change
  Change --> Draft
  Active --> Archive
```

## Mike View

Mike should see a dashboard, not every working detail.

```mermaid
flowchart TB
  Dashboard["Monthly SOP health dashboard"]
  P0["P0 Active coverage"]
  Stale["Stale or overdue reviews"]
  Risk["Risk and incident findings"]
  Decisions["Decision-grade approvals"]
  Spend["Spend, pricing, billing, refunds"]
  Reputation["Reputation, legal, privacy, public promises"]
  Access["Access, credentials, HighLevel AI toggles"]
  Prospecting["Live prospecting clearance"]
  Payments["Agentic checkout or direct payment risk"]

  Dashboard --> P0
  Dashboard --> Stale
  Dashboard --> Risk
  Dashboard --> Decisions
  Decisions --> Spend
  Decisions --> Reputation
  Decisions --> Access
  Decisions --> Prospecting
  Decisions --> Payments
```

## Tool Notes

- Miro or FigJam is best for workshop-style messy discovery.
- Lucidchart or Visio is best for clean swimlanes, BPMN, and board-ready process diagrams.
- Draw.io/diagrams.net is the best low-cost diagramming fallback.
- Monday or ClickUp is best when the visual needs to become work assignments, status, automations, and owner follow-up.
- Scribe or Tango is best for turning screen-recorded software tasks into step-by-step visual guides.
- Process Street, Trainual, Waybook, SweetProcess, or Whale become relevant when GMF needs read acknowledgments, recurring checklists, training tracking, and proof that the SOP was followed.

Recommendation for GMF now: keep the visual map in docs, mirror the SOP backlog in Monday, and only consider a dedicated SOP platform after the first 25-40 P0/P1 SOPs are tested and Active.
