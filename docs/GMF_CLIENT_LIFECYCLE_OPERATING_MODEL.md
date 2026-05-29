# GMF Client Lifecycle Operating Model

Status: active source of truth
Owner: Mike Egidio
Recorded: 2026-05-27
Scope: free visibility checks, sales handoff, client onboarding, client correspondence, recurring service, and upgrade path.

## Core Decision

GMF runs like a normal service company with agent labor behind the scenes.

The client or prospect should experience one clear front door:

- prospects hear from Sales Rep
- paying clients hear from Account Manager
- specialists never email clients directly
- Manager routes work only when prerequisites are met
- Supabase stores lifecycle status and events
- Monday shows agent jobs and blockers
- Mission Control shows owner views
- Resend sends relationship emails
- Smartlead stays for cold outbound prospecting

## Public Offer Ladder

GMF public offers are:

1. Get Found - $149 one-time setup, visibility baseline, and first review path.
2. Stay Found - $99/mo ongoing review and Google visibility upkeep.
3. Always Ready - $299/mo full reputation, AI visibility, content/readiness, and higher-touch strategy.

Older internal names such as `Review Power` and `AI Ready Bundle` are now capabilities or historical labels, not the public ladder.

## Company Roles

### Manager

Runs the operating system.

Manager:

- receives handoffs from Sales Rep, Sales Manager, Account Manager, and specialists
- checks prerequisites before assigning execution work
- assigns owner agent and reviewer
- keeps blocked work visible
- asks Mike only for owner-level decisions
- keeps Monday and Mission Control aligned

Manager should not assign GBP execution work until `admin@getmefound.ai` is added as Manager on the Google Business Profile. Manager may still assign safe setup work such as client ID, client folder, client hub, baseline scan, and onboarding checklist.

### Sales Manager

Owns revenue strategy.

Sales Manager:

- owns offer fit, pricing logic, upgrade strategy, and sales standards
- manages Sales Rep work
- decides upgrade angle
- reviews sales performance and orphaned report recovery

Sales Manager does not chase Google access, customer lists, or routine setup blockers.

### Sales Rep

Owns prospect communication before payment and approved upgrade conversations.

Sales Rep:

- handles free visibility check follow-up
- emails prospects
- sends free reports after Auditor approval
- answers plan questions
- sends checkout links
- marks won/lost/nurture status
- handles upgrade emails or calls when Sales Manager approves the angle

Sales Rep exits day-to-day communication after payment. If a paying client asks a pricing or upgrade question, Account Manager routes it back to Sales Rep or Sales Manager.

### Account Manager

Owns client communication after signup.

Account Manager is the new operating name for the old Client Success role.

Account Manager:

- sends welcome email
- asks for Google Business Profile access
- asks for customer lists
- repeats blocker correspondence until prerequisites are met
- sends setup status updates
- sends monthly recaps
- handles client questions
- watches retention risk
- tells Sales Manager when upgrade timing feels appropriate

Account Manager does not decide pricing or custom scope without Sales Manager or Manager.

### Profile Manager

Owns Google Business Profile and local visibility work.

Profile Manager:

- checks GBP access
- identifies missing access blockers
- records exact client action needed
- updates categories, services, hours, review link, profile facts, and drift checks after access is ready

Profile Manager does not email the client.

### Reviews Manager

Owns review request setup and review-flow health.

Reviews Manager:

- manages customer upload path
- checks clean/held rows
- prepares review request readiness
- handles suppressions and do-not-contact rules
- blocks SMS until consent/A2P readiness is complete

Reviews Manager does not email the client.

### Systems Director

Owns technical setup, dashboards, compliance, tools, and safety.

Systems Director:

- creates or validates client ID, client folder, client hub, Supabase rows, and tool health
- checks Resend, Supabase, Vercel, Stripe, A2P, backups, and secrets
- records technical blockers for Account Manager to translate to the client

Systems Director does not email the client.

### Scout

Owns research and public visibility scans.

Scout:

- runs public free-check and baseline visibility research
- checks Google/search/AI visibility observations
- passes findings to Reporter, Profile Manager, Sales Rep, or Account Manager

Scout does not email the prospect or client.

### Reporter

Owns proof, dashboards, reports, and Mission Control summaries.

Reporter:

- turns specialist work into client-safe proof
- builds free visibility reports
- builds baseline reports
- builds monthly recaps
- updates Mission Control summaries
- prepares upgrade evidence

Reporter does not send reports directly. Sales Rep sends prospect reports. Account Manager sends client reports.

### Auditor

Owns quality and risk gates.

Auditor:

- checks reports and client/prospect emails before send
- blocks unsupported claims, ranking guarantees, risky SMS, unapproved public edits, and unclear asks
- confirms proof exists before Manager marks work done

### Coach

Owns SOPs, training, offer language, and client-safe wording.

Coach:

- keeps source docs current
- updates scripts and templates
- turns research into agent instructions
- keeps old AOH/GHL terms from leaking into GMF client language

### Reply Writer

Owns review reply drafts when included in scope.

Reply Writer:

- drafts replies in client voice
- flags sensitive topics
- records approve/reject/post decisions
- does not auto-post by default

## Free Visibility Check Workflow

Trigger:

- website CTA form submitted
- manual lead asks for a free report
- Sales Rep requests a report for a qualified prospect

Workflow:

1. Website or Sales Rep creates a Supabase lead/opportunity record.
2. Monday item is created in `02 Sales & Signup`.
3. Sales Rep sends confirmation email.
4. Scout runs public visibility scan.
5. Reporter builds the free visibility report.
6. Auditor checks report claims and recommendation.
7. Sales Rep emails the report.
8. Sales Rep gives the next best action: Get Found checkout, Stay Found checkout, Always Ready fit call, or no-fit/nurture.

Free visibility reports are sales assets. They do not go to Account Manager unless the prospect becomes a paying client.

## Shared Visibility Report Engine

GMF treats visibility reports as one reusable engine with different contexts.

This matters because the report checks may be similar, but the owner, recipient, and next action are different.

| Context | Audience | Front-office owner | Purpose | Next owner |
|---|---|---|---|---|
| `prospect_free_check` | Prospect | Sales Rep | Website CTA report used to start a sales conversation | Sales Rep |
| `prospect_campaign_reply` | Prospect | Sales Rep | Warm prospect asked for a scan/report from outreach | Sales Rep |
| `client_onboarding_baseline` | Client | Account Manager | Paid-client baseline used to prove starting point and guide launch work | Account Manager |
| `client_recurring_check` | Client | Account Manager | Monthly/quarterly visibility drift check | Account Manager |

Shared report records live in Supabase `visibility_reports`.

Required fields:

- `run_id`
- `report_context`
- `audience`
- `report_status`
- `lead_status`
- `client_lifecycle`
- `owner_role`
- `business_name`
- `contact_email`
- `business_website`
- `business_location`
- `client_slug` when client exists
- `report_type`
- `source`
- `audit_url`
- `next_action`
- `blocker`

Shared report events live in Supabase `visibility_report_events`.

The website free-check route now writes the same shared model as future onboarding baselines. That keeps prospecting and onboarding connected without confusing who owns the relationship.

## Visibility Report Artifact Shape

The shared report engine has two depths.

Prospect reports are sales assets. They should show a small, credible 2026 AI/search readiness gap and make Get Found the obvious next step.

Client reports are proof assets. They should show the full baseline, work completed, blockers, movement, and next actions.

Research basis:

- Google's AI features guidance says AI Mode and AI Overviews use standard Search fundamentals: crawlable/indexable pages, helpful visible content, page experience, structured data that matches visible content, and current Business Profile data.
- Google's local ranking guidance centers on relevance, distance, and prominence. GMF can improve the controllable parts: complete profile information, hours, reviews/replies, photos, website clarity, and consistency.
- Google I/O 2026 expanded AI Mode, conversational follow-up, and local agentic behavior such as booking/calling in select service categories. The report should show whether the business gives Google/AI enough clear public evidence to recommend it.
- BrightLocal 2026 research shows reviews and AI recommendations both matter, but reviews should be one signal in the prospect report, not the whole report.

Prospect report sections:

1. Quick read: one score, one sentence, one primary gap.
2. What Google/AI can understand: profile facts, website facts, service/location clarity.
3. Competitor contrast: two or three competitors, one sentence each.
4. Proof freshness: newest visible review/activity summarized lightly.
5. Locked roadmap: what Get Found unlocks.
6. Recommended next action: Get Found checkout or fit call.

Prospect matrix columns:

| Signal | Why it matters now | Your visible status | Competitor clue | Unlocked with Get Found |
|---|---|---|---|---|
| Google profile clarity | Google needs complete business facts before it can confidently match the business. | Pass / weak / missing | Competitors show clearer categories, services, hours, or photos. | Profile cleanup |
| Website/profile match | AI and Search trust the business more when the site and profile agree. | Pass / weak / missing | Competitors have cleaner matching facts. | Fact sync |
| Service + location clarity | AI Mode handles longer, specific questions, so services and locations must be obvious. | Pass / weak / missing | Competitors explain services more clearly. | Baseline site fixes |
| Public proof freshness | Recent visible proof reduces buyer doubt. | Pass / weak / missing | Competitors look more active. | First review path |
| AI/search readiness | Google says AI features use standard Search fundamentals plus crawlable, visible, useful content. | Pass / weak / missing | Competitors provide clearer answer-ready content. | Before/after snapshot |

Internal prospect scoring rubric:

Score the prospect and top visible competitors with the same lightweight 100-point rubric.

Do not show this full rubric in the prospect-facing report. Reporter uses it to calculate the score consistently.

| Signal | Points |
|---|---:|
| Google profile clarity | 20 |
| Website/profile match | 20 |
| Service + location clarity | 20 |
| Public proof freshness | 20 |
| AI/search readiness | 20 |

Status bands:

| Points | Label |
|---:|---|
| 16-20 | Strong |
| 11-15 | Fair |
| 6-10 | Weak |
| 0-5 | Missing |

Prospect reports show only the prospect score, local competitor average, top visible competitor score, and 2-3 short competitor clues. They should not show the full scoring rubric or a full competitor audit.

Prospect reports should not include full review tables, response-rate analysis, sentiment summaries, private feedback, or recurring-service metrics. That depth is for clients after signup.

Prospect locked cards:

- Included with Get Found: profile cleanup, website/profile fact sync, review link capture, first review request path, before/after snapshot.
- Available after Get Found: monthly visibility checks, recurring review requests, monthly report, deeper AI answer monitoring, guarded reply/voice readiness.

Client baseline reports show:

- starting status
- full matrix with evidence
- healthy signals
- blockers
- GMF work now
- client action needed
- proof that will be compared later

Client recurring reports show:

- visibility movement
- profile fixes completed
- website/profile consistency changes
- Google post/profile activity
- review count change and freshness
- review requests sent
- private feedback captured
- unanswered reviews resolved
- competitor gap
- recommended next actions

## Custom Client Home Page

Every paid client should eventually get a custom interactive home page at `/client/[client-slug]`.

This page is the client-facing home base, not a software dashboard. It should make the owner feel that GMF is handling the work and only needs them when a clear action is required.

The page should show:

- business name, logo, plan, and status
- one plain-English current status sentence
- the single next client action, if any
- active service proof counters
- customer/job upload path
- baseline and report links
- visibility score and competitor gap for paying clients
- review requests, new reviews, private feedback, held-back rows, and review link status when included
- Google profile access, profile fixes, posts, services, photos, and drift checks when included
- approval queue for review replies, SMS readiness, profile edits, or public-facing changes
- greyed-out next capabilities that can be unlocked with Stay Found or Always Ready

Interaction rules:

- clients can upload, approve, update, and view proof
- do not show internal agent names, raw logs, internal tools, debug traces, or queue mechanics
- prefill everything GMF already knows
- one client action per card
- full competitor/scoring detail is client-only after signup, not part of the free prospect report
- upgrade previews should be useful but restrained; proof comes before upsell

## Orphaned Report Workflow

An orphaned report is a free visibility report that was requested and delivered, but the prospect did not sign up.

Owner:

- Sales Rep

Supervisor:

- Sales Manager

Status:

- `report_sent_no_signup`

Follow-up cadence:

- Day 0: send report
- Day 2: one helpful follow-up
- Day 7: one short reminder with the recommended next step
- Day 14: final soft close
- Day 30+: low-frequency nurture only if subscribed/appropriate

Orphaned reports stay in the sales lane, not client onboarding.

Detailed requested-report nurture rules live in `docs/sops/SOP-031-prospect-follow-up-cadence.md`.

Operating defaults:

- Sales Rep owns all prospect report delivery and nurture emails.
- Scout researches, Reporter builds, Auditor approves, and Sales Manager reviews offer angle.
- Emails use the GMF role/Resend lane, not Mike's owner email and not cold-outreach mailboxes.
- Default cadence after report delivery: Day 2 helpful check-in, Day 7 one recommended next step, Day 14 final soft close, Day 30+ low-frequency nurture only if there is real value.
- Pipeline status stays in Supabase `visibility_reports.lead_status`; events go in `visibility_report_events`; sends go in `email_events`; Monday mirrors active jobs/blockers; Mission Control shows `/mike-mc/visibility-reports`.

## Sales To Client Handoff

Sales Rep secures the client when one of these happens:

- Stripe payment completes
- signed approval is received
- Mike approves a manual start
- client verbally agrees and Sales Manager approves next action

Handoff:

1. Sales Rep marks opportunity `closed_won` or `signup_started`.
2. Manager checks plan, payment/approval, contact info, source, and next blocker.
3. Manager opens client onboarding.
4. Systems Director creates client ID/folder/hub shell and magic-link access.
5. Account Manager sends welcome, dashboard magic link, and access request.
6. Specialists begin only the work whose prerequisites are satisfied.

Sales Rep does not own routine client service after this point.

## Client Onboarding Prerequisite Rules

Manager may assign safe setup immediately:

- client ID
- client folder
- Supabase client profile
- client hub shell and magic-link access
- public baseline scan
- welcome email draft
- onboarding checklist

Manager should not assign execution work blocked by missing access:

- no GBP edits until `admin@getmefound.ai` is accepted as Manager
- no review request sends until review link, customer list, suppressions, and proof checks are ready
- no SMS until A2P/consent/STOP/HELP readiness is confirmed
- no public client claim or profile change without proof and approval path

## Access Blocker Example

If Google Business Profile manager access is missing:

1. Profile Manager records blocker: `gbp_access`.
2. Profile Manager records exact needed action: "Invite `admin@getmefound.ai` as Manager in Google Business Profile."
3. Manager keeps GBP execution unassigned or blocked.
4. Account Manager emails the client.
5. Account Manager follows up every two business days while blocked, with no more than one ask per email.
6. Once access is confirmed, Manager assigns Profile Manager execution.

## Client Communication Rules

Default communication is email.

Phone calls happen only when the prospect or client requests one.

Call-request trigger examples:

- "Can you call me?"
- "Let's talk."
- "Can we schedule a call?"
- "I'd rather discuss by phone."
- "Have Mike call me."

Call workflow:

1. Sales Rep or Account Manager marks `call_requested`.
2. Manager is notified.
3. Manager notifies Mike if the call needs owner involvement.
4. Mike decides whether to take the call or delegate it.

No specialist agent emails prospects or clients directly.

## Upgrade Workflow

Upgrade opportunities work like a normal account expansion process.

1. Specialist notices opportunity.
2. Reporter turns it into proof.
3. Auditor checks the claim.
4. Account Manager judges relationship timing.
5. Sales Manager decides upgrade angle.
6. Sales Rep emails the upgrade recommendation or handles the requested call.
7. If client upgrades, Manager opens Always Ready workflow.

Always Ready upgrade messaging starts with evidence, not pressure.

No upsell in the first 7 days unless the client asks.

Recommended upgrade rhythm:

- Day 14: education only if useful
- Day 30: one specific opportunity in first monthly recap
- Day 45-60: one strategy insight if data supports it
- Day 75-90: Always Ready recommendation if proof and fit are strong

## Supabase Status Model

Supabase is the operating database.

Use structured status fields instead of loose GHL-style tags.

Recommended lead status values:

```text
free_check_requested
report_building
report_ready_for_audit
report_sent_no_signup
follow_up_day_2
follow_up_day_7
final_soft_close
nurture
closed_won
closed_lost
no_fit
```

Recommended client lifecycle values:

```text
paid_needs_onboarding
waiting_gbp_access
waiting_customer_list
waiting_a2p_info
launch_first_14_days
live_recurring
upgrade_candidate
at_risk
cancelled
```

Recommended blocker values:

```text
none
gbp_access
customer_list
a2p_info
billing
client_approval
tool_access
custom_scope
reputation_risk
```

Recommended communication status values:

```text
draft_needed
draft_ready
audit_needed
approved_to_send
sent
reply_received
call_requested
waiting_response
closed
```

Monday should mirror the important status, owner, next action, human-needed flag, due date, and proof link. Monday is not the data warehouse.

## Data Ownership

| Layer | Source of truth |
|---|---|
| Billing | Stripe |
| Client profile/status/events | Supabase |
| Agent jobs/blockers | Monday |
| Owner dashboard | Mission Control reading Supabase/Monday |
| Files/reports/screenshots | VPS/Drive/storage |
| Relationship email sends/logs | Resend plus Supabase `email_events` |
| Cold outbound | Smartlead |
| Notifications | Slack |

## Model Cost Policy

Routine work should use low-cost models where quality is sufficient.

Use low-cost models for:

- classification
- first-pass summaries
- checklist updates
- routine draft emails
- internal handoff notes
- basic report assembly

Use stronger models for:

- code changes
- security/recovery
- final client-facing claims
- sensitive reputation issues
- complex research
- upgrade recommendations with risk

Track costs per client in Supabase over time:

- model tokens
- search calls
- browser/report runs
- Resend emails
- SMS sends
- report generation
- human-needed events

## Owner Visibility

Mike should be able to monitor without operating the system manually.

Mission Control should show:

- free visibility checks requested
- reports being built
- orphaned reports
- new paying clients
- waiting on GBP access
- waiting on customer list
- launch blocked
- live recurring clients
- upgrade candidates
- at-risk clients
- human-needed decisions

Slack should show:

- new paying client
- job sent
- human needed
- call requested
- report ready
- payment/reputation/security issue
