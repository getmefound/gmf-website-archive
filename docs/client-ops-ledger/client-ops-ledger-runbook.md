# Client Ops Ledger Runbook

## What This Is

The Client Ops Ledger is the one-page operating map for AOH clients. It answers the question:

> What clients do we have, what agents are allowed to work on them, what happened last, what happens next, and does a human need to approve anything?

## Where It Lives

Recommended v1 location:

`04 AI Outsource Hub/Operations/Client Ops Ledger/client-ops-ledger.csv`

The CSV can be opened directly from Drive or imported into Google Sheets. The Obsidian notes explain the system; the spreadsheet is the daily interface.

## Mike's Daily View

Open the ledger and sort/filter by:

1. `risk_status` = `at_risk`, `blocked`, or `watch`
2. `human_approval_required` = `yes`
3. `next_action_due` = today or overdue
4. `monthly_recurring_revenue` high to low

If those four filters are clean, the business is probably not on fire.

## Adding a New Client

1. Create a new `client_id`.
2. Add a row to `client-ops-ledger.csv`.
3. Create a client profile note from `client-profile-template.md`.
4. Create or link the GHL/hub360ai sub-account.
5. Create or link the Google Drive folder.
6. Add the service plan and assigned agents.
7. Set `human_approval_required=yes` during onboarding.
8. Set the first `next_action`.

## Agent Behavior

### Manager

- Reads the ledger at the start of each daily brief.
- Prioritizes blocked, at-risk, and approval-required rows.
- Assigns work to the correct agent.
- Writes a concise `next_action` after each meaningful change.

### Hub

- Answers questions from the ledger, GHL, Drive, and client profile note.
- Never treats the ledger as the only source of truth for client performance.
- If data conflicts, reports the conflict instead of guessing.

### Auditor

- Reviews `risk_status`, `monthly_agent_cost_estimate`, missed reports, stale `last_agent_run`, and overdue `next_action_due`.
- Posts exceptions to Slack.
- Does not directly change pricing, billing, AI feature settings, or client-facing promises.

### Delivery Agents

- Only work clients where they are listed in `assigned_agents`.
- Update `last_agent_run` and `next_action` after meaningful work.
- Stop when `human_approval_required=yes` and the action would affect a client, prospect, billing, or live automations.

## Status Rules

| Status | Meaning |
|---|---|
| `prospect` | Not yet a paying client |
| `onboarding` | Paid or committed, setup in progress |
| `active` | Live service delivery |
| `paused` | Temporarily paused by client or AOH |
| `at_risk` | Churn, dissatisfaction, delivery failure, or payment concern |
| `churned` | No longer active |
| `internal` | AOH-owned/internal account |

## Risk Rules

| Risk | Meaning |
|---|---|
| `healthy` | No known issue |
| `watch` | Something may need attention soon |
| `at_risk` | Human owner should intervene |
| `blocked` | Work cannot continue until a human resolves something |
| `unknown` | Not enough information |

## When To Move Beyond CSV

Stay with CSV/Google Sheets until one of these is true:

- More than 15-25 active clients.
- Multiple agents need to update the ledger at the same time.
- You need audit history by field.
- You need permissions by role.
- You need client-specific automation to trigger from ledger changes.

At that point, move the ledger to Postgres on the VPS and keep a read-only dashboard for Mike.

