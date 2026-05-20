# AOH Client Ops Ledger

This folder contains the v1 operating ledger for running AOH clients with agents.

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
| `aoh-agent-company-operating-model.md` | Canonical company hierarchy: Mike as President, Secretary, Manager, specialist agents, recommendations, jobs, approvals. |

## Recommended Workflow

1. Keep `client-ops-ledger.csv` as the human-readable source of truth until AOH has enough clients to justify Postgres.
2. Create one Obsidian client profile note per paying client using `client-profile-template.md`.
3. Give every client a stable `client_id` before any agent touches the account.
4. Require all agent runs to write back to the ledger through a controlled workflow, not by freeform editing.
5. Move to a real database only after the spreadsheet becomes painful, likely around 15-25 active clients.

## Higher-Level Truth

Before building more client ops automation, read `aoh-agent-company-operating-model.md`. The ledger is one part of a larger company operating model:

Mike reviews and approves. Secretary prepares the brief. Manager scans the company. Specialist agents investigate. Approved recommendations become jobs. Completed jobs update the ledger and client profiles.
