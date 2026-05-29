# Client Ops Ledger Data Dictionary

## Purpose

The Client Ops Ledger is AOH's account control table. It is not a CRM replacement. GHL remains the client/contact/workflow system of record. The ledger is the cross-system map that tells humans and agents where each client's stuff lives and what needs to happen next.

## Column Definitions

| Column | Meaning | Suggested values |
|---|---|---|
| `client_id` | Stable internal ID. Never reuse. | `AOH-001`, `REV-001`, `RELAY-001` |
| `client_name` | Public business/client name. | Plain business name |
| `status` | Current account state. | `prospect`, `onboarding`, `active`, `paused`, `at_risk`, `churned`, `internal` |
| `client_type` | Whether this is a paying client, test client, prospect, or internal account. | `client`, `test_client`, `prospect`, `internal`, `partner` |
| `primary_contact` | Main human contact. | Name |
| `primary_email` | Main email. | Email |
| `primary_phone` | Main phone. | Phone |
| `service_plan` | Current AOH offer. | `Reviews`, `AI Visibility`, `Relay`, `Studio`, `Reach`, `Full Service`, combinations allowed |
| `monthly_recurring_revenue` | Current monthly recurring revenue. | Number only |
| `setup_fee` | Setup fee charged. | Number only |
| `contract_start` | Date service started. | `YYYY-MM-DD` |
| `renewal_or_review_date` | Next account review or renewal. | `YYYY-MM-DD` |
| `ghl_location_id` | GHL/hub360ai location ID. | Exact ID |
| `ghl_subaccount_url` | Direct link to the GHL sub-account. | URL |
| `drive_folder_url` | Client Drive folder. | URL |
| `obsidian_profile_path` | Client profile note path in Oracle. | Relative Obsidian path |
| `slack_channel` | Internal or client-facing Slack channel. | `#client-name` or blank |
| `clickup_space_or_folder` | Project/task workspace for delivery. | URL or folder/list name |
| `n8n_workflows` | Automation workflows tied to this client. | Semicolon-separated list |
| `assigned_agents` | Agents allowed to work this account. | Semicolon-separated list |
| `manager_owner` | Agent or human accountable for orchestration. | `Manager`, `Mike`, etc. |
| `human_owner` | Human accountable for the relationship. | `Mike`, `Kip`, `Teri` |
| `last_client_touch` | Most recent human/client interaction. | `YYYY-MM-DD` |
| `last_agent_run` | Most recent automated/agent run. | `YYYY-MM-DD` |
| `next_action` | One concrete next action. | Short plain-language task |
| `next_action_owner` | Who owns the next action. | Human or agent |
| `next_action_due` | Due date for next action. | `YYYY-MM-DD` |
| `risk_status` | Health of the account. | `healthy`, `watch`, `at_risk`, `blocked`, `unknown` |
| `risk_reason` | Why the account is not healthy. | Short explanation |
| `human_approval_required` | Whether an agent needs approval before acting. | `yes`, `no` |
| `approval_reason` | What needs approval and why. | Short explanation |
| `last_report_sent` | Last client report date. | `YYYY-MM-DD` |
| `report_frequency` | Reporting cadence. | `weekly`, `monthly`, `quarterly`, `none` |
| `kpi_primary` | Main account KPI. | `new reviews`, `booked calls`, `missed calls recovered`, etc. |
| `kpi_current` | Current KPI value. | Number or short metric |
| `kpi_target` | Target KPI value. | Number or short metric |
| `monthly_agent_cost_estimate` | Estimated monthly AI/API cost for this client. | Number only |
| `notes` | Short context for humans. | Keep brief |

## Hard Rules

- Do not store API keys, passwords, private tokens, or payment details in the ledger.
- Do not enable or toggle HighLevel AI features from the ledger. Mike must explicitly authorize those manually.
- Every client must have a `client_id` before agents work the account.
- Every agent should update `last_agent_run`, `next_action`, and `risk_status` when it performs meaningful work.
- `human_approval_required=yes` blocks live customer-facing actions until Mike or the assigned human owner approves.
