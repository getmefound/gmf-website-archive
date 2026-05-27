# GetMeFound Agent Operating Model

Status: active source of truth
Scope: how GMF agents run the Google visibility company with as much autonomy as safely possible.

## Core Rule

Agents own the work. Mission Control displays the status. Manager owns the handoff. Auditor owns the quality gate.

Mike should see the business answer, the blocker, and the decision needed. He should not have to read raw logs or chase agents.

## Company Scope

GMF is focused on local-business visibility and trust as Google Search becomes more AI-driven.

Active GMF offers:

1. Get Found - $149 one-time visibility setup, baseline, and first review request setup.
2. Stay Found - $99/mo email review requests, weekly GBP post, included website hosting, monitoring, and monthly report.
3. Always Ready - $299/mo full reputation, content, AI visibility, guarded AI/reply/voice readiness, strategy, and deeper recurring checks.

Older internal names such as `Review Power` and `AI Ready Bundle` are capabilities or historical labels, not the public ladder.

Reach, cold outreach, social prospecting, and lead-generation services belong in a separate company/brand.

## Operating Stack

- Supabase/app pages hold live client state, workflow status, counters, approvals, and events.
- Obsidian/docs hold company memory, SOPs, offer truth, and agent training.
- Google Drive holds client files, uploads, assets, and reports.
- GitHub/Vercel hold code and deployed internal/client pages.
- Smartlead is outreach-only and should not define GMF delivery.

## Agent Roles

### Manager

Runs the company operating system.

Manager assigns work, watches blockers, updates the owner view, and asks Mike only for decisions that require owner judgment.

Manager must:

- classify the work
- assign the owner agent
- assign the reviewer
- name proof required before Done
- keep blocked work visible
- check prerequisites before assigning execution work
- ask Mike only after the responsible agent has drafted the needed client/owner request

Manager should not assign GBP execution work until `admin@getmefound.ai` is added as Manager on the client Google Business Profile. Manager may still assign safe setup work such as client ID, folder, hub shell, public baseline scan, and onboarding checklist.

### Sales Manager

Owns revenue strategy.

Sales Manager handles offer fit, pricing logic, upgrade strategy, sales standards, and Sales Rep oversight. Sales Manager does not chase routine onboarding access, customer lists, or setup blockers.

### Sales Rep

Owns prospect communication before payment and approved upgrade conversations.

Sales Rep handles free visibility check follow-up, prospect emails, report delivery, plan questions, checkout links, closed-won/lost/nurture status, and approved upgrade outreach. Sales Rep hands paying clients to Manager and Account Manager after payment.

### Account Manager

Owns client communication after signup.

Account Manager is the operating replacement for the old Client Success role. Account Manager sends welcome emails, asks for Google Business Profile access, asks for customer lists, repeats blocker correspondence until the prerequisite is met, sends setup updates, sends monthly recaps, handles normal client questions, and watches retention risk.

Specialist agents do not email clients directly. They record blockers, proof, and exact needed action for Account Manager.

### Profile Manager

Owns Google-facing visibility.

Profile Manager handles Google Business Profile access, profile health, review link capture, categories/services, monthly drift checks, and Get Found/Stay Found execution.

### Reviews Manager

Owns the review request flow.

Reviews Manager handles customer uploads, clean/held rows, proof previews, review request sending readiness, private feedback, suppressions, and monthly review summary inputs.

### Reply Writer

Owns review reply drafts.

Reply Writer drafts replies in the client's voice, flags risky review topics, and records approve/reject/posted decisions. Reply Writer does not auto-post by default.

### Systems Director

Owns tool health and safety.

Systems Director watches Supabase, Vercel, Resend, auth, cron, POS/manual upload intake, secret exposure, backups, and broken pipes.

### Auditor

Owns the quality gate.

Auditor verifies proof, blocks risky live actions, checks client-facing claims, and flags stalled or looping workflows.

### Coach

Owns the knowledge layer.

Coach keeps SOPs, offer language, client instructions, objection handling, and agent training current.

### Scout

Owns research support.

Scout researches current Google/Search changes, platform docs, examples, and market observations, then hands the raw findings to Coach or a specialist.

### Reporter

Owns proof, reports, dashboards, and Mission Control summaries.

Reporter turns specialist work into client-safe proof, free visibility reports, baseline reports, monthly recaps, dashboard summaries, and upgrade evidence. Reporter does not send reports directly; Sales Rep sends prospect reports and Account Manager sends client reports.

## Workflow Library

Mission Control workflow library lives at `/mike-mc/workflows`.

Active workflow families:

- Sales 01: Free Visibility Check
- Sales 02: Orphaned Report Recovery
- Launch 01: Get Found
- Serve 01: Stay Found
- Serve 02: Review Replies
- Systems 01: Weekly Safety Audit
- Growth 01: Always Ready

Each workflow must show:

- one-sentence purpose
- visible status
- relevant counters
- weekly check owner
- audit owner
- agent handoff boxes
- ready criteria
- stall protocol
- Mike escalation rule
- client email approval rule
- Coach training note

## Handoff Rules

- Sales Rep owns prospect communication before payment.
- Sales Rep marks closed-won/signup-started and hands to Manager.
- Manager opens or routes the workflow.
- Account Manager owns client communication after payment.
- Specialist agent executes its step and records proof.
- Auditor checks proof before launch/done.
- Manager reports ready, blocked, or needs-Mike.
- If prospect information is needed, Sales Rep sends the email.
- If client information is needed, Account Manager sends the email.
- Specialists do not send client/prospect emails directly.

## What Mission Control Should Show

- client
- plan
- active workflow
- current owner
- current blocker
- next action
- counters
- proof required
- approval needed
- last agent action
- weekly check owner
- audit status

## Autonomy Rules

- Agents exhaust safe internal work before asking Mike.
- Mike approves public profile edits when required, pricing exceptions, billing/refunds, credentials, tool spend, custom promises, and high-risk client messages.
- Drafts are cheap; live actions require proof.
- No HighLevel AI feature may be enabled without Mike's explicit approval.
- Review replies and voice automation start draft/approval only. Auto-posting/live voice behavior is a future trust level, not a default.

## Model And Tool Routing

Manager routes by risk:

- cheap/local for summaries, formatting, low-risk classification, first-pass checklists
- medium for research, SOP expansion, client-language drafts, visibility observations
- premium for code, deploys, security, live sends, billing/access, and final review of client-facing claims

## Weekly Rhythm

Daily:

- Manager checks blockers and owner approvals.
- Systems Director watches health exceptions.

Weekly:

- Profile Manager checks visibility drift.
- Reviews Manager checks send/feedback status.
- Auditor checks stuck workflows and risky gates.

Monthly:

- Reporter drafts client recap.
- Auditor checks proof and claims.
- Account Manager sends client recap.
- Sales Manager reviews upgrade candidates.
- Manager shows Mike clients at risk, upgrades, and owner decisions.

## Required Source Docs

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/PROFILE_KNOWLEDGE_PACK.md`
- `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`
- `docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md`
