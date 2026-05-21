---
name: AOH Agent Model Routing and Morning Brief
description: Plain-English operating note for which agent work uses no LLM, cheap models, standard models, strong models, or Mike; also covers Morning Brief ownership and current key status.
type: reference
status: active
date: 2026-05-21
agent-readers: [manager, systems-director, ghl-expert, scout, sender, sales-manager, coach]
team-readers: [mike]
tags: [aoh, agents, model-routing, morning-brief, cost-control]
---

# AOH Agent Model Routing and Morning Brief

## Owner answer

The agent team should not use expensive AI models by habit.

Default rule:

> Use the cheapest reliable method that can complete the step safely.

Most Reach and Morning Brief work currently runs through scripts, ledgers, CSVs, and API checks. That means many jobs use **no LLM at all**.

## Model tiers

| Tier | Use | Examples |
|---|---|---|
| No LLM | Deterministic work | CSV cleanup, dedupe, counts, imports, scheduled jobs, API checks. |
| Cheap model | Low-risk language and classification | first-pass summaries, obvious fit checks, simple reply labels, first-pass news scan. |
| Standard model | Judgment work | campaign angles, reply triage, sales judgment, Morning Brief synthesis. |
| Strong model | Risky or complex work | production code, GHL workflow risk, approval packets, sensitive client-facing decisions. |
| Human | Business decision | spend changes, drip starts, live prospect/client action, HighLevel AI feature authorization. |

## Provider map

| Provider | Best use |
|---|---|
| Gemini Flash | Cheap/high-volume work. `GEMINI_API_KEY` is configured in Vercel Production as of 2026-05-21. |
| OpenAI | Default fallback and strong-work provider once `OPENAI_API_KEY` is configured. |
| Claude | Optional second strong reviewer for strategy, writing, code review, and tricky GHL decisions. |

Do not hard-code a permanent winner. Systems Director refreshes this when pricing or model quality changes.

## Current key status

As of 2026-05-21, the AOH website/Vercel project has GHL, Slack, Outscraper, cron, GitHub, OpenClaw, and Gemini keys.

The same check did **not** show these provider keys in the website/Vercel project:

```text
OPENAI_API_KEY
ANTHROPIC_API_KEY
```

This does not mean Mike has no accounts. It means this app is not yet wired to use those providers in production.

Important: a paid Gemini app plan is not the same as a server API key. Server agents need an API key added to the app environment. That part is now done for Gemini.

Ignore/delete the accidental generic variable name:

```text
APIKeys_05_21_26_openclaw_agents
```

Code should use `GEMINI_API_KEY`, not the generic name.

## Claude decision

Claude is optional for v1.

Keep Claude if Mike wants a second strong reviewer for:

- strategy
- writing
- coding review
- complex GHL decisions

Claude is not required for:

- Reach autopilot
- Morning Brief v1
- CSV cleanup
- GHL read-only checks
- scheduled scripts

## Morning Brief ownership

Manager sends the final brief.

Specialists feed it:

| Agent | Feeds |
|---|---|
| GHL Expert | GHL campaign stats, workflow proof, email stats exports/API, readiness checks. |
| Sales Manager | What campaign numbers mean and what to do next. |
| Scout / Market Watcher | industry news, competitor signals, niche opportunities. |
| Systems Director | cron reliability, source health, cost risk, failed jobs. |

Current command:

```text
Manager, morning brief
```

Current local generator:

```bash
npm run ghl:email-stats
npm run morning:brief
```

Current source files:

```text
docs/client-ops-ledger/morning-brief-current.md
docs/client-ops-ledger/morning-brief-sources.json
docs/client-ops-ledger/ghl-email-stats-current.csv
docs/client-ops-ledger/ghl-email-stats-template.csv
docs/client-ops-ledger/owner-morning-brief-product-research.md
```

The brief is now split into a Commercial Brief and a Custom Layer. Commercial is what most clients can buy. Custom is where inbox, calendar, GHL/CRM, GBP, ads, call tracking, or payment integrations are added.

## Slack command to remember

```text
Manager, model routing
```

This explains which jobs use no LLM, cheap models, standard models, strong models, or Mike.

## Safety hard stops

Agents must stop before:

- importing contacts into GHL
- starting an outreach drip
- changing a live GHL workflow
- sending a prospect/client-facing message
- enabling or toggling any HighLevel AI feature
- exceeding the approved job budget

HighLevel AI features remain OFF unless Mike explicitly authorizes them manually.

## Code/doc references

- `docs/client-ops-ledger/agent-model-routing-policy.md`
- `docs/client-ops-ledger/morning-brief-skill-pack.md`
- `docs/client-ops-ledger/slack-agent-command-runbook.md`
- `scripts/morning-brief.mjs`
