# GMF Client Ops Ledger

This folder contains the v1 operating ledger for running GMF clients with agents.

The ledger is intentionally spreadsheet-first. Mike should be able to open it, scan every client, and know:

- who the client is
- what service plan they are on
- where their data lives
- which agents are assigned
- what happened most recently
- what needs a human decision
- whether the account is healthy, stuck, or at risk

## Files

| File | Purpose |
|---|---|
| `client-ops-ledger.csv` | Main spreadsheet-style control surface. Import/open in Google Sheets. |
| `client-ops-ledger-data-dictionary.md` | Explains every column and allowed values. |
| `client-profile-template.md` | Per-client profile template for Obsidian. Use one note per client. |
| `client-ops-ledger-runbook.md` | How Mike, Manager, Auditor, Hub, and delivery agents should use the ledger. |
| `aoh-agent-company-operating-model.md` | Canonical company hierarchy: Mike as President, General Manager, specialist agents, recommendations, jobs, approvals. |
| `mike-daily-agent-quickstart.md` | Plain-English daily guide for Mike to talk to agents, run Reach checks, and issue safe approvals in Slack. |
| `agent-model-routing-policy.md` | Cost-control policy for choosing no LLM, cheap, standard, strong, or human decision tiers. |
| `morning-brief-skill-pack.md` | Morning Brief ownership, knowledge-source rules, and productization path. |
| `morning-brief-current.md` | Current generated owner brief for Mike. |
| `morning-brief-sources.json` | News/RSS and GHL stats source configuration for the Morning Brief. |
| `ghl-email-stats-template.csv` | Template for GHL email performance stats before API/export automation is wired. |
| `reach-campaign-agent-runbook.md` | Safe agent workflow for Reach email campaign prep, approval, import, drip start, and logging. |
| `presence-refresh-product-runbook.md` | One-time setup add-on for stale social/website presence before Reach campaigns. |
| `social-reach-pilot-runbook.md` | Guarded Social Reach pilot: listening, opportunity scoring, helpful drafts, and human-approved posting. |
| `ghl-replacement-cost-plan.md` | Planning map for what GMF uses GHL for, what each area costs, and what to keep, replace, or avoid at 50+ clients. |
| `ghl-exit-migration-plan.md` | Parallel plan to downgrade GHL to $97, freeze new GHL dependency, rebuild core services outside GHL, train agents, and cancel when safe. |
| `mission-control-job-flow-index.md` | Mission Control job index links and the split between Commercial Reach and optional custom agent/CRM work. |
| `slack-agent-command-runbook.md` | How Mike talks to Manager, GHL Expert, Sales Manager, and approval gates through Slack-ready commands. |
| `prospecting-core-setup-memory.md` | Durable memory for Mike's prospecting operating preference: core setup first, Manager only interrupts for human-needed blockers. |
| `prospecting-cold-email-operating-plan.md` | Current cold email prospecting plan and first Smartlead readiness gate. |
| `agent-jobs-operating-structure.md` | Scalable Monday/agent job structure for prospecting, signup, onboarding, recurring runs, reporting, upkeep, and upsell. |
| `monday-prospecting-core-setup.md` | Monday board shape and first human-needed prospecting job. |
| `monday-prospecting-core-setup-import.csv` | Monday-ready first job import row for Smartlead API access. |
| `agent-jobs-template.csv` | Starter job queue format for agent work, budgets, approvals, and next actions. |
| `agent-jobs.csv` | Current working job queue for agent work. |
| `daily-brief-template.md` | Manager daily brief format for Mike approvals and status. |
| `daily-brief-current.md` | Current Manager brief for today's campaign readiness work. |
| `sending-domain-readiness.csv` | Per-lane subdomain warmup/readiness checklist. |
| `sending-domain-readiness-checklist.md` | GHL Expert signoff checklist before approving start-drip. |

## Recommended Workflow

1. Keep `client-ops-ledger.csv` as the human-readable source of truth until GMF has enough clients to justify Postgres.
2. Create one Obsidian client profile note per paying client using `client-profile-template.md`.
3. Give every client a stable `client_id` before any agent touches the account.
4. Require all agent runs to write back to the ledger through a controlled workflow, not by freeform editing.
5. Route every agent job through `agent-model-routing-policy.md` so cheap/no-LLM steps stay cheap.
6. Use `reach-campaign-agent-runbook.md` before any agent prepares, imports, or starts a Reach email campaign.
7. Use `presence-refresh-product-runbook.md` and `/lp/presence-refresh` for the 10 social post + 5 blog launch special before selling it live.
8. Use `ghl-replacement-cost-plan.md` before changing GHL plans, enabling GHL add-ons, or deciding whether to build a GMF-owned replacement.
9. Use `ghl-exit-migration-plan.md` as the source of truth for downgrading to $97, exporting GHL, rebuilding Review Automation/AI Visibility/Reach outside GHL, and cancellation gates.
10. Use `mike-daily-agent-quickstart.md` for daily Slack usage, then `slack-agent-command-runbook.md`, `npm run agent:brief`, and `npm run morning:brief` for deeper setup and command details.
11. Keep the legacy Obsidian synced routing note current when model/provider or Morning Brief ownership changes until the Obsidian rename pass is complete.
12. Use `agent-jobs-operating-structure.md` before adding more Monday boards, groups, or recurring agent jobs.
13. Move to a real database only after the spreadsheet becomes painful, likely around 15-25 active clients.

## Higher-Level Truth

Before building more client ops automation, read `aoh-agent-company-operating-model.md`. The ledger is one part of a larger company operating model:

Mike reviews and approves. Manager scans the company, prepares the brief, and routes specialist agents to investigate. Approved recommendations become jobs. Completed jobs update the ledger and client profiles.

For outreach campaigns, the extra rule is:

> Agents may research, clean, verify, and prepare. The approved Reach warmup autopilot may import/start ready lanes inside guardrails; anything outside that still needs Mike approval.
