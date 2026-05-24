# GetMeFound Agent Operating Model

Status: draft source of truth
Scope: how GetMeFound agents own knowledge, hand off work, and show progress in Mission Control.

## Core Rule

Agents own the knowledge. Mission Control displays the work.

Mission Control should show who owns a task, what is blocked, what is done, and what needs Mike. It should not be the only place where the actual job knowledge lives.

## Knowledge Flow

1. Scout researches current docs, saved training, examples, and edge cases.
2. Coach turns raw research into SOPs, checklists, and training material.
3. Specialist agents learn only the parts they need to execute their job.
4. Manager assigns work, watches blockers, and keeps client status moving.
5. Auditor verifies the work and catches drift after launch.

## Review Automation Service Flow

1. Client buys Review Automation.
2. Client completes self-serve onboarding.
3. Manager confirms the onboarding package is complete enough to begin.
4. Profile confirms Google Business Profile access and profile health.
5. GHL Expert creates/configures the HighLevel setup.
6. Sorter prepares any customer list.
7. GHL Expert launches review workflows when ready.
8. Auditor checks the setup and first-run behavior.
9. Manager reports completion or requests missing client items.

## What The Client Does

The client should not need a Zoom setup call as the default path.

They receive written instructions with screenshots and a video. Their work is to provide access and information:

- business basics
- Google Business Profile manager invite to GetMeFound
- how completed customers should enter the review flow
- customer list, if available now
- POS/CRM name and integration details, if known
- reply/SMS/social details only if the client has AI Visibility or another upgrade

The required first launch dependency is Google Business Profile access. A customer list and POS/CRM connection can be handled as follow-up work if needed.

## Agent Roles

### Manager

Owns orchestration. Manager decides what is ready, who owns the next step, and when Mike needs to be involved.

Manager does not do specialist setup unless explicitly assigned.

Manager is also the model/tool router. Manager decides whether a task should use a cheap/local model, Gemini/DeepSeek/Grok-style credit model, or a premium build/review model such as Codex or Claude Code.

Manager must route by risk:

- low-risk summaries, formatting, and first drafts can use cheap/local models
- research and SOP expansion can use medium/credit models
- production code, GHL live workflows, outbound campaign launch, security, billing, and client launch decisions require premium review

Manager cannot mark work Done until the required proof exists. The detailed routing rules live in `docs/MANAGER_ROUTING_SKILL_PACK.md`.

Manager also has a GHL overview layer. Manager is not GHL Expert, but must understand the GHL map well enough to supervise subaccounts, snapshots, custom values, workflows, calendars, pipelines, Reputation/GBP connection, webhooks, and report/heatmap proof. The detailed supervision checklist lives in `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`.

### Scout

Owns research. Scout finds current platform docs, saved training, videos, edge cases, and examples.

Scout does not become the permanent owner of GHL or Google Business Profile knowledge.

### Coach

Owns the knowledge library. Coach cleans Scout's research into SOPs, checklists, client instructions, and agent training.

Coach makes the knowledge usable by the specialist agents.

### Profile

Owns Google Business Profile access and health.

Profile verifies the client added GetMeFound as a manager, confirms the correct business/location, checks verification status, finds the review link, and hands off to GHL Expert when GHL can be connected.

### GHL Expert

Owns HighLevel setup and automations.

GHL Expert creates/configures subaccounts, applies snapshots, updates custom values, connects GBP inside HighLevel, configures Reputation/email review workflows/widgets, and tests technical readiness. Reviews AI/SMS work belongs to AI Visibility or an approved upgrade.

### Sorter

Owns customer list readiness.

Sorter cleans, maps, dedupes, and prepares customer lists for import.

### Press

Owns publishing after setup.

Press handles approved review/social/GBP posting workflows, but does not own Google Business Profile access or HighLevel setup.

### Auditor

Owns verification and drift checks.

Auditor checks that the setup works, reviews are syncing, workflows fire correctly, and post-launch monitoring is healthy.

Auditor also owns security drift. Before deploys and during daily checks, Auditor should look for:

- tokens or credentials in URLs
- hardcoded secrets in source code
- secret-like values in screenshots or public docs
- `NEXT_PUBLIC_*` variables that contain token, secret, password, API key, or private key material
- stale or exposed tokens that need rotation
- public operator pages that should require auth

## Handoff Rules

- Profile hands off to GHL Expert only after GetMeFound has GBP manager access or a clear blocker is recorded.
- GHL Expert hands off to Sorter when a customer list needs cleanup.
- Sorter hands back to GHL Expert when the list is ready to import.
- GHL Expert hands off to Auditor before launch is marked done.
- Auditor hands off to Manager when setup is verified or when a blocker needs client/Mike action.
- Manager hands off model/tool selection before work begins and records the reviewer/proof required before Done.

## Mission Control Should Show

- client
- service
- plan
- onboarding status
- missing client items
- current owner
- next agent
- blockers
- last agent action
- next expected action
- launch readiness
- post-launch monitoring status
- model/tool tier used when the work is agent-driven
- proof required before Done

## Workflow Library

Mission Control now has a workflow library at `/mike-mc/workflows`.

Each workflow must have:

- uniform name such as `Launch 01: Client Setup`
- one-sentence purpose
- short workflow description
- visible status: ready, working, blocked, manual, or planned
- relevant counters
- weekly check owner
- audit owner
- agent-by-agent handoff boxes
- ready criteria
- stall protocol
- Mike escalation rule
- client email approval rule
- Coach training note

If a workflow stops:

1. Auditor names the stalled step and responsible agent.
2. Responsible agent says what they are doing to fix it.
3. If the fix needs client information, the responsible agent drafts the client email.
4. Manager asks Mike to approve that exact email or approve a different message.
5. Manager keeps the workflow visible until the blocker clears or the workflow is intentionally paused.

Coach owns the workflow knowledge layer. Coach should keep the workflow pages aligned with SOPs and make sure each specialist agent knows only the parts they need to execute.

## Auditor Security Checklist

Run this before pushing operator/security-sensitive changes:

```powershell
npm run audit:security
npm run lint
npm run build
```

If the sweep fails, fix the exposure before deploy. If a token was already visible in a URL, screenshot, browser history, or git history, move it to an env var and rotate the token at the source system.

## Sources To Keep Attached To Skills

- Google Business Profile owner/manager permissions: https://support.google.com/business/answer/3403100
- Google Business Profile agency invites: https://support.google.com/business/answer/7655924
- HighLevel GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- HighLevel Reputation Management docs: https://help.gohighlevel.com/support/solutions/48000449583
- Google review API capabilities: https://developers.google.com/my-business/content/review-data
- Manager routing and model/tool selection: `docs/MANAGER_ROUTING_SKILL_PACK.md`
- Manager GHL supervision overview: `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`
