---
name: AOH Agent Company Operating Model
description: Canonical operating model for running AOH as an agent-led company with Mike as President, Manager/Secretary oversight, specialist agents, client job queues, and human approval gates.
type: operating-model
status: active
date-created: 2026-05-20
owner: Mike Egidio
tags: [aoh, agents, operating-model, client-ops-ledger, manager, secretary, jobs]
---

# AOH Agent Company Operating Model

## Why This Exists

AOH is not just building automations. AOH is building a company structure where agents fill operational roles under human leadership.

Mike is the President. Agents should not randomly act. Agents should scan, recommend, prepare, execute approved work, and keep records.

This note is the new operating truth for how AOH should be built.

## Locked Operating Principle

AOH should replicate a practical company hierarchy:

```text
Mike / President
  -> Secretary / Chief of Staff
      -> Manager
          -> Specialist agents
              -> Delivery jobs
                  -> Client records and reports
```

The system should make Mike's day simpler, not make Mike manage every agent directly.

## Role Definitions

| Role | Plain-English job |
|---|---|
| President | Mike. Reviews recommendations, approves client-facing or risky actions, makes business decisions. |
| Secretary / Chief of Staff | Prepares the morning brief, filters noise, groups recommendations, and gives Mike a clean approval queue. |
| Manager | Scans the company, finds work that may need doing, asks specialist agents to investigate, and creates recommendations. |
| GHL Expert | Scans GHL/hub360ai client accounts, workflows, reviews, contacts, opportunities, tags, and account health. |
| AI Visibility Agent | Checks client website, AI visibility work, search visibility, content requirements, and AI-readiness tasks. |
| Reviews Agent | Checks review requests, review counts, reporting cadence, replies, and review automation health. |
| Relay Agent | Checks voice agent call logs, missed calls, routing, fallback behavior, and client issues. |
| Studio | Creates approved content assets. |
| Press | Publishes approved content and verifies scheduled/published status. |
| Hub | Answers account questions by reading the ledger, GHL, Drive, and client profile notes. |
| Auditor | Looks for cost anomalies, repeated failures, stale work, missed reports, and cross-agent risk patterns. |

## Daily Operating Flow

Every morning, Manager scans:

- Client Ops Ledger
- GHL/hub360ai client accounts
- OpenClaw agent jobs and run status
- Slack alerts, approvals, and unresolved threads
- agent logs
- client profile notes
- Drive folders where relevant
- missed reports
- overdue next actions
- clients marked `watch`, `at_risk`, `blocked`, or `human_approval_required=yes`

Manager does not do everything itself. Manager asks specialist agents to investigate the parts they own.

Examples:

- GHL Expert scans all client GHL accounts.
- AI Visibility Agent checks AI visibility client work.
- Reviews Agent checks review delivery.
- Relay Agent checks voice/call delivery.
- Auditor checks cost/risk/failure patterns.

Then Manager creates recommendations.

Secretary turns those recommendations into a clean morning brief for Mike.

## Recommendation vs Job

Do not create permanent jobs for every idea.

Use this distinction:

| Item | Meaning | Permanent? |
|---|---|---|
| Recommendation | An agent thinks work might need to be done. Mike has not approved it yet. | Temporary |
| Job | Mike, Secretary, or Manager approved/assigned the work. | Permanent until completed |
| Log entry | Work is completed and written back to the client profile/ledger. | Permanent |

This prevents the system from creating hundreds of fake tasks.

## Job Lifecycle

Use this status flow:

```text
detected -> recommended -> waiting_approval -> approved -> assigned -> in_progress -> done -> logged
```

Alternative close path:

```text
detected -> recommended -> dismissed
```

## Morning Brief Format

Secretary should prepare a daily brief with these sections:

1. Needs Mike today
2. Client risks
3. Recommended agent jobs
4. Overnight changes
5. Revenue or sales opportunities
6. Items safely handled by agents
7. Items ignored or dismissed

The brief should be plain English and approval-oriented.

Example approval commands Mike should be able to use:

```text
approve 1
approve 1, 3, 5
dismiss 2
ask GHL Expert for more detail on 4
assign 6 to Hub
pause all client-facing actions
```

## Tool Decisions

### Core Operating Stack

| Layer | Tool | Decision |
|---|---|---|
| Client CRM and workflows | GHL / hub360ai | Core system of record for clients, contacts, workflows, reviews, opportunities. |
| Agent runtime | OpenClaw on Hostinger VPS | Core runtime for agents. |
| Agent live interface | OpenClaw Mission Control | Preferred live view for agent jobs, schedules, status, and activity. |
| Human command surface | Slack | Mike and team talk to agents, receive briefs, approve work. |
| Client map | Client Ops Ledger | Cross-system map of clients, agents, links, next actions, risk, and approvals. |
| Knowledge base | Obsidian Oracle | Ground truth, SOPs, operating notes, client profiles, training. |
| Files | Google Drive | Client folders, assets, reports, deliverables. |
| Observability | Langfuse | Roadmap item for agent run traces, costs, errors, and debugging. |
| Automation glue | n8n | Optional later. Use only if OpenClaw/GHL/Slack workflows become too expensive or brittle to hand-build. |
| Work management | ClickUp | Deferred. Do not buy unless human task management becomes painful. |

### ClickUp Decision

ClickUp is mature and useful for conventional agencies, but it is not the default AOH operating layer right now.

Reasons to defer:

- AOH is intentionally agent-heavy.
- OpenClaw Mission Control should be tested first for agent jobs and task visibility.
- GHL already has tasks, pipelines, contacts, and workflows.
- The Client Ops Ledger can handle the first operating layer.
- Adding another paid system too early creates tool clutter.

Add ClickUp only if one of these becomes true:

- humans miss follow-ups
- onboarding steps get lost
- client tasks need a richer nontechnical view
- contractors need a familiar work management system
- OpenClaw/GHL cannot show task ownership and due dates cleanly enough

## Langfuse Decision

Langfuse is a black box recorder for AI agents.

It records:

- what agent ran
- what prompt/instructions it used
- what tools it called
- what model it used
- token usage and estimated cost
- errors
- outputs
- traces across multi-step jobs

Langfuse is not the operating interface. It is the debugging and accountability layer.

Keep Langfuse on the roadmap, but do not let it block the Manager/Secretary/GHL Expert framework.

Install Langfuse when AOH starts asking:

- Why did this agent recommend that?
- What did this client cost in tokens/API calls?
- Which agent keeps failing?
- Which client scans are stale?
- Can a developer debug this without reading raw log files?

## Human Approval Rules

Agents may recommend freely.

Agents need approval before:

- sending client-facing messages
- changing billing, pricing, refunds, cancellations, or contracts
- enabling or toggling any GHL/HighLevel AI feature
- changing live GHL workflows
- starting outreach drips
- publishing public content
- making claims about results
- contacting prospects or clients as AOH

Hard AOH rule:

HighLevel AI features must remain OFF unless Mike explicitly authorizes them manually.

## Setup Checklist

### Phase 1 - Foundation

- [ ] Keep Client Ops Ledger as the client/company source map.
- [ ] Add one client profile note template per real client.
- [ ] Define stable `client_id` format.
- [ ] Add `human_approval_required` gates to the ledger.
- [ ] Create a daily Morning Brief format for Secretary.
- [ ] Define Slack channel or DM destination for Morning Brief.

### Phase 2 - Manager and Specialist Scans

- [ ] Build Manager daily scan.
- [ ] Build GHL Expert daily scan.
- [ ] Build AI Visibility Agent scan.
- [ ] Build Reviews Agent scan.
- [ ] Build Relay Agent scan.
- [ ] Build Auditor exception scan.
- [ ] Have Manager convert findings into recommendations.
- [ ] Have Secretary convert recommendations into the daily brief.

### Phase 3 - Job Queue

- [ ] Create a `recommended_jobs` queue.
- [ ] Create job lifecycle statuses.
- [ ] Add approval commands in Slack.
- [ ] Convert approved recommendations into jobs.
- [ ] Write completed jobs back to Client Ops Ledger and client profile notes.

### Phase 4 - Mission Control

- [ ] Deploy OpenClaw Mission Control.
- [ ] Confirm agent job visibility works.
- [ ] Confirm schedules/cron visibility works.
- [ ] Confirm Slack approvals connect cleanly.
- [ ] Decide whether Mission Control is enough for human task management before considering ClickUp.

### Phase 5 - Observability

- [ ] Add simple logs first.
- [ ] Deploy Langfuse when agent volume makes debugging/cost visibility necessary.
- [ ] Track cost by agent and client.
- [ ] Track failed runs and stale scans.

### Phase 6 - Optional Glue

- [ ] Add n8n only for workflows that are cheaper/easier to maintain there than in OpenClaw code.
- [ ] Add ClickUp only if human task management becomes the bottleneck.

## Build North Star

Mike should wake up and receive a clean brief:

```text
Here is what changed.
Here is what needs your approval.
Here is what agents can handle.
Here is what is risky.
Here is what can wait.
```

Mike approves or redirects.

The agents do the work.

The ledger and client profiles update.

Auditor watches for risk.

Secretary prepares the next brief.

