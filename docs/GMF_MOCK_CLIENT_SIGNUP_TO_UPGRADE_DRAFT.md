# GMF Mock Client Signup To Upgrade Draft

Status: draft for Mike approval
Owner: Mike Egidio
Prepared: 2026-05-27
Scope: starts after prospecting, when a prospect signs up or becomes a sales/signup opportunity.

## Short Answer

No, the full mock client run-through was not fully documented before this draft.

Pieces already exist:

- Stripe checkout and success page.
- Stripe webhook that logs the order/subscription and posts a Manager alert in Slack.
- Client hub at `/client/[slug]`.
- Customer upload page at `/client/[slug]/customers`.
- Monday `Agents Jobs` groups for Sales, Onboarding, Launch, Recurring Runs, Reports, Upsell, and Systems.
- Draft post-prospecting workflow.

The missing piece was the complete story:

1. What the client sees.
2. What gets built behind the scenes.
3. Which agent owns each step.
4. When the client hears from GMF.
5. How GMF earns the right to recommend Always Ready at $299/mo without pestering the client.

This document is that missing operating draft.

## Recommendation On Another Agent

Do not add a new standalone agent yet.

Use these roles now:

- Sales Manager owns the move from qualified prospect to paid client.
- Manager owns the operating handoff and routing.
- Client Success owns all normal correspondence after signup.
- Reporter owns reports, client hub summaries, and Mission Control summaries.
- Auditor owns proof and risk gates.

Add a future `Onboarding Coordinator` only when onboarding volume becomes too much for Client Success, roughly when GMF has 20 to 30 active onboarding clients or when more than 5 clients are waiting on access at the same time.

For now, `Onboarding Coordinator` should be a sub-role of Client Success, not a new agent.

## Current Setup Check

### Already Wired

Client pays through Stripe checkout.

Current behavior:

- `app/checkout/[product]/page.tsx` redirects to Stripe checkout.
- `app/checkout/success/page.tsx` tells the client payment is confirmed and GMF will email within one business day.
- `app/api/stripe/webhook/route.ts` records Stripe orders/subscriptions in Supabase.
- The webhook posts to the GMF Manager Slack channel with "new paying client" instructions.
- `/client/[slug]` already shows plan, review status, data connection, client-needed items, upload link, upgrades, SMS readiness, and AI visibility preview.
- `/client/[slug]/customers` already supports customer upload for review automation.
- `scripts/monday-agent-jobs.mjs` already supports Monday groups for signup, onboarding, launch, recurring runs, client success, and upsell.

### Not Fully Wired Yet

These are still operating/documentation gaps:

- Automatic client ID creation after payment.
- Automatic client folder creation.
- Automatic Monday item creation from Stripe checkout.
- Automatic client hub creation for every new paying client.
- Automatic welcome email with the correct dashboard link.
- Automatic "first 14 days" launch checklist.
- Formal client communication cadence.
- Formal upgrade readiness score.
- Owner-only `/mike-mc/client-journey` page.

## Mock Client

Example client:

```text
Business: Ridgeview Plumbing
Owner: Sarah
Location: New Haven, CT
Plan bought first: Stay Found
Goal: more reviews, better Google visibility, less owner follow-up work
Upgrade target: Always Ready after proof and trust exist
```

## Client Journey Overview

The correct client experience should feel simple:

1. Client pays.
2. Client receives confirmation.
3. Client receives a short welcome email with a dashboard link and only the actions needed now.
4. GMF builds the behind-the-scenes account shell.
5. Client gives Google access and customer list or upload path.
6. GMF launches first value.
7. Client receives proof, not noise.
8. GMF runs recurring work quietly.
9. Client receives a monthly recap.
10. GMF recommends Always Ready only when there is a clear reason.

The client should not feel like they bought software. They should feel like they hired a quiet operator.

## What The Client Sees

### Minute 0: Checkout Success Page

Current client-facing page:

- payment confirmed
- receipt from Stripe
- GMF will email within one business day
- setup or first cycle will begin

Recommended improvement later:

- add client dashboard link when the client hub exists
- add "what we need next" in 2 or 3 bullets
- add "no need to create another account" reassurance

### Same Business Day: Welcome Email

Owner: Client Success

Purpose:

- confirm plan
- explain what GMF is doing first
- give dashboard link
- ask for only the current blockers

Client sees:

- "We received your Stay Found signup."
- "Your client hub is here: [dashboard link]."
- "We need Google Business Profile access."
- "Upload or send your customer list when ready."
- "You do not need to log in daily. We will only ask when something blocks setup."

### Day 1-2: Access Request

Owner: Client Success

Client sees:

- simple Google Business Profile manager invite instructions
- warning not to send passwords
- upload link for customers
- reminder that email review requests can start before SMS

### Day 3-5: Blocker Reminder Only If Needed

Owner: Client Success

Client sees this only if something is blocking work:

- one short reminder
- one clear action
- no upsell
- no "just checking in" message

### First Launch Proof

Owner: Reporter, sent by Client Success

Client sees:

- what is live
- what was fixed
- what is still waiting
- proof link or screenshot
- next expected update

### Month 1 Recap

Owner: Reporter drafts, Client Success sends

Client sees:

- review requests sent
- new reviews or feedback captured
- Google profile upkeep completed
- issues found and fixed
- what GMF is doing next month
- one optional "next opportunity" if it is genuinely relevant

### Upgrade Education

Owner: Client Success plus Sales Manager

Client sees upgrade messaging only after GMF has proof.

Upgrade education should be framed as:

- "Here is what we are seeing."
- "Here is what is not covered in your current plan."
- "Here is why Always Ready would help."
- "No action needed unless you want us to expand into this."

## What Gets Built Behind The Client

### Minute 0-10: Payment Record

Agent: Systems Director
Reviewer: Auditor

Built:

- Stripe order/subscription saved.
- Slack Manager notice posted.
- billing status recorded.
- source trigger saved as `Stripe checkout`.

Proof:

- Stripe session ID.
- Supabase order/subscription record.
- Slack message link if available.

### Minute 10-30: Manager Opens Client Job

Agent: Manager
Reviewer: Auditor

Built:

- Monday item in `03 Client Onboarding`.
- plan set to Get Found, Stay Found, or Always Ready.
- human needed set to No unless access/pricing/custom scope is blocked.
- next action assigned.
- proof link placeholder created.

Proof:

- Monday item URL.
- next action visible.

### First Hour: Client ID And Folder

Agent: Systems Director
Reviewer: Auditor

Built:

```text
Client ID: GMF-0001
Folder: /root/gmf-clients/GMF-0001-ridgeview-plumbing/
```

Folder sections:

```text
01-intake
02-access
03-assets
04-workflows
05-proof
06-reports
07-exports
08-compliance
09-dashboard
99-archive
```

Proof:

- folder path in Monday.
- folder path in Mission Control.

### Same Day: Client Hub Shell

Agent: Reporter
Technical owner: Systems Director
Reviewer: Auditor

Built:

- `/client/ridgeview-plumbing`
- plan/status
- needed-from-client checklist
- customer upload link
- review status placeholder
- data connection status
- SMS/A2P readiness area
- upgrade preview area
- report history placeholder

Proof:

- client hub link.
- screenshot or internal check.

### Same Day: Intake And Access Checklist

Agent: Client Success
Reviewer: Manager

Built:

- client-facing access request.
- GBP manager invite instructions.
- customer list upload instructions.
- support email path.
- what is optional vs required.

Proof:

- welcome email saved.
- sent email recorded.

### Day 1: Visibility Baseline

Agent: Scout
Reviewer: Auditor

Built:

- Google Business Profile status.
- review count/rating/review recency.
- website crawl/index basics.
- LocalBusiness/schema check.
- sitemap/robots check.
- AI answer spot check.
- `llms.txt` presence.
- Google/AI crawler access check where useful.
- competitor snapshot if obvious.

Proof:

- baseline report in `05-proof`.
- key findings in Mission Control.

### Day 1-3: GBP And Local Facts Setup

Agent: Profile Manager
Reviewer: Auditor

Built:

- correct GBP identified.
- manager access accepted.
- category/service/hours/photo/post risks listed.
- review link captured.
- public edits queued, not made without approval rules.

Proof:

- access status.
- change checklist.
- review link.

### Day 1-5: Review Flow Setup

Agent: Reviews Manager
Reviewer: Auditor

Built:

- review request template.
- customer list upload path.
- suppression rules.
- send delay.
- held-row logic.
- proof queue before live sends.

Proof:

- test customer or dry-run proof.
- send-readiness note.

### Day 1-10: SMS/A2P Readiness If Plan Includes SMS

Agent: Systems Director
Supporting agent: Reviews Manager
Reviewer: Auditor

Built:

- legal business name/EIN collection path.
- website/privacy/terms check.
- opt-in proof.
- STOP/HELP handling.
- sample messages.
- registration status.
- SMS blocked until compliant.

Important:

- Email review requests can launch before SMS.
- SMS must not launch until A2P/10DLC and consent requirements are ready.

Proof:

- A2P checklist in `08-compliance`.
- SMS readiness status in client hub.

### Day 3-14: First Value Launch

Agent: Profile Manager and Reviews Manager
Reviewer: Auditor
Client-facing owner: Client Success

Built based on plan:

- Get Found: baseline fixes and before/after snapshot.
- Stay Found: review request system, weekly profile upkeep, monthly report path.
- Always Ready: Stay Found plus AI voice/readiness, content/answer checks, deeper recurring visibility work.

Proof:

- first launch report.
- client hub updated.
- Monday job moved to `04 Launch / First 14 Days` or `05 Recurring Runs`.

## Plan-Specific Workflow

### Get Found

Purpose:

- one-time visibility and trust setup.

Agent sequence:

1. Manager opens onboarding.
2. Systems Director creates client ID/folder/hub.
3. Scout runs baseline.
4. Profile Manager fixes or queues Google/local facts.
5. Reviews Manager sets first review request path.
6. Auditor checks proof.
7. Reporter creates before/after snapshot.
8. Client Success sends completion note.
9. Sales Manager schedules soft Stay Found follow-up only after proof.

Upgrade path:

- Day 7-14: "We completed the setup. To keep it from going stale, Stay Found handles the monthly upkeep."
- No Always Ready push unless the baseline shows obvious AI/phone/content readiness gaps.

### Stay Found

Purpose:

- monthly visibility upkeep, reviews, Google profile freshness, and reporting.

Agent sequence:

1. Manager opens recurring workflow.
2. Systems Director confirms hub, folder, billing, backups, and sender path.
3. Profile Manager runs weekly GBP/profile checks.
4. Reviews Manager manages customer intake and review requests.
5. Reporter creates monthly recap.
6. Auditor checks claims and proof.
7. Client Success sends recap and manages normal correspondence.
8. Sales Manager reviews upgrade signals monthly.

Upgrade path:

- Day 14: education only if relevant.
- Day 30: first report may include one "next opportunity."
- Day 45-60: Client Success may send a short strategy insight if a real gap is found.
- Day 75-90: Sales Manager may recommend Always Ready if proof says the client is ready.

### Always Ready

Purpose:

- full visibility, reputation, AI readiness, content/answer checks, and voice/lead handling readiness.

Agent sequence:

1. Manager opens Always Ready workflow.
2. Systems Director confirms technical stack, privacy/security, dashboards, and integrations.
3. Scout runs AI/local answer visibility checks.
4. Profile Manager handles GBP/local content and profile drift.
5. Reviews Manager handles review flow, SMS if compliant, feedback, suppressions.
6. Reply Writer drafts review replies when allowed by approval rules.
7. Coach keeps service facts, FAQs, voice/tone, and objection handling current.
8. Reporter creates monthly strategy report.
9. Auditor gates live behavior and risky client-facing claims.
10. Client Success communicates what changed and what needs approval.

Upgrade path:

- Already upgraded. The goal becomes retention, proof, referrals, and selective add-ons.

## Client Communication Cadence

Rule: GMF should communicate when it creates clarity, needs action, or proves value.

### Setup Period

| Timing | Message | Owner | Send only if |
|---|---|---|---|
| Immediately | Stripe receipt/confirmation | Stripe/site | Always |
| Same business day | Welcome and dashboard link | Client Success | Always after signup |
| Day 1-2 | Access request | Client Success | Needed access exists |
| Day 3-5 | Blocker reminder | Client Success | Client has not completed required action |
| Day 7 | Setup status | Client Success | There is progress, proof, or blocker |
| Launch day | First proof update | Reporter/Client Success | First value delivered |

### Recurring Period

| Timing | Message | Owner | Send only if |
|---|---|---|---|
| Weekly | Short status | Client Success | Meaningful progress or blocker |
| Monthly | Recap/report | Reporter/Client Success | Always for monthly clients |
| Event-based | Alert | Client Success | Bad review, access broken, payment issue, urgent client risk |
| Upgrade | Strategy insight | Sales Manager/Client Success | Data supports it |

### Do-Not-Disturb Rules

- No more than one "ask" email every two business days while blocked.
- Bundle requests. Do not send three separate emails when one clean email works.
- Maximum three client tasks in one email.
- No generic "checking in" emails.
- No upsell in the first 7 days unless the client asked.
- Do not send SMS to the client or their customers unless consent/compliance is confirmed.
- Mike is not contacted for routine progress. Mike is contacted only for pricing, promise, access, legal/reputation risk, billing, spend, or custom scope.

## Upgrade To Always Ready

The $299/mo upgrade should not be a drip that annoys clients.

The correct strategy is value-first:

1. Prove the base plan works.
2. Show a gap the base plan does not cover.
3. Explain the business risk or opportunity.
4. Offer Always Ready as the cleanest next step.
5. Stop if the client is not interested.

### Upgrade Signals

Client becomes an Always Ready candidate when at least two are true:

- review flow is live and client sees value.
- GBP/profile work exposes recurring content or service clarity gaps.
- AI/local answer checks do not mention the business for obvious service/location prompts.
- competitors are better represented in Google/AI answers.
- client has missed-call, after-hours, FAQ, or lead response problems.
- client asks about AI voice, lead follow-up, content, or ranking beyond reviews.
- client wants more proactive strategy.
- client has multiple locations or higher lifetime value per lead.
- SMS/A2P and compliance work is important enough to justify deeper management.

### Upgrade Cadence

| Time | Upgrade posture |
|---|---|
| Day 0-7 | No upgrade push. Build trust. |
| Day 14 | Education only: "This is available later if useful." |
| Day 30 | First report can include one specific opportunity. |
| Day 45-60 | Send one strategy insight if data supports it. |
| Day 75-90 | Offer an Always Ready review if the client has proof and fit. |
| Any time | Upgrade immediately only if the client asks or a major opportunity/risk appears. |

### Always Ready Upgrade Email Rule

The email must include:

- the observation
- the evidence
- why it matters
- what Always Ready would add
- no pressure

It must not include:

- ranking guarantees
- revenue guarantees
- fear-based urgency without proof
- repeated follow-ups after no response

## Drip Email Library

These are not cold prospecting emails. These are customer lifecycle messages.

| Email | Trigger | Owner | Purpose |
|---|---|---|---|
| Welcome | signup/payment | Client Success | confirm plan and dashboard |
| Access needed | missing GBP/customer list | Client Success | unblock setup |
| Setup status | day 7 or blocker | Client Success | reduce uncertainty |
| Launch proof | first value delivered | Reporter/Client Success | prove work |
| First monthly recap | day 30 | Reporter/Client Success | retention proof |
| Opportunity insight | day 45-60 if real gap | Sales Manager/Client Success | soft upgrade education |
| Always Ready recommendation | day 75-90 or trigger | Sales Manager | upgrade offer |
| Payment issue | Stripe failure | Client Success | billing recovery |
| Win-back | cancellation scheduled | Client Success | one genuine check-in |

## Agent Responsibility Map

| Work | Primary agent | Reviewer | Client-facing sender |
|---|---|---|---|
| Sales handoff | Sales Manager | Manager | Sales Manager |
| Payment/account creation | Systems Director | Auditor | none |
| Monday job routing | Manager | Auditor | none |
| Client ID/folder | Systems Director | Auditor | none |
| Client hub | Reporter/Systems Director | Auditor | Client Success |
| Welcome/access email | Client Success | Manager | Client Success |
| GBP profile work | Profile Manager | Auditor | Client Success |
| Review request setup | Reviews Manager | Auditor | Client Success |
| A2P/SMS readiness | Systems Director | Auditor | Client Success |
| Baseline/AI visibility scan | Scout | Auditor | Client Success |
| Monthly recap | Reporter | Auditor | Client Success |
| Upgrade recommendation | Sales Manager | Manager/Auditor | Sales Manager or Client Success |
| Sensitive review/reputation issue | Auditor | Manager | Client Success after approval |

## Owner Visibility

Mike should be able to see this at three levels.

### Slack

Slack should show only:

- new paying client
- job sent to an agent
- human needed
- blocked job
- report ready
- payment failure/dispute

Slack should not be the full system of record.

### Monday

Monday should show:

- current job
- agent owner
- client ID
- plan/service line
- status
- next action
- human needed yes/no
- proof link
- due date
- risk level

### Mission Control

Mission Control should show:

- client journey stage
- setup progress
- access blockers
- agent chain
- proof completeness
- recurring run health
- latest client update
- upgrade readiness
- human-needed queue

Recommended page:

```text
/mike-mc/client-journey
```

## Compliance And Source Notes

These sources shape the workflow:

- Google Business Profile: complete and accurate profile info, verification, hours, reviews, photos, relevance, distance, and prominence matter for local visibility.
  - https://support.google.com/business/answer/7091/improve-your-local-ranking-on-google
- Google AI search guidance: focus on helpful non-commodity content, crawlability, indexing, semantic structure, page experience, and accurate local/ecommerce details. `llms.txt` is not required for Google AI search, but can still be a cheap non-Google LLM helper.
  - https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google LocalBusiness structured data: use valid structured data that matches real business details and visible content.
  - https://developers.google.com/search/docs/appearance/structured-data/local-business
- FTC CAN-SPAM: customer marketing emails need truthful headers/subject lines, opt-out handling when commercial, and careful treatment of mixed transactional/promotional messages.
  - https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- Twilio A2P/10DLC: SMS requires brand/campaign readiness, consent, opt-in/opt-out/help details, privacy language, and SMS should not be sent until compliant.
  - https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
  - https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/quickstart

## Approval Decisions For Mike

Recommended defaults:

1. Every paid client gets a client hub.
2. Every paid client gets a client ID and folder before delivery starts.
3. Client Success owns all normal client correspondence after signup.
4. Sales Manager owns upgrades, but only after Client Success/Reporter have proof.
5. Reporter owns monthly client recaps and owner Mission Control summaries.
6. No new standalone agent yet; add Onboarding Coordinator later when volume demands it.
7. Always Ready upsell begins with proof and timing, not daily drip pressure.
8. Build `/mike-mc/client-journey` before adding more complex service workflows.

## First Build Sequence After Approval

1. Add this journey to the operating docs as approved source of truth.
2. Update old offer names in `docs/AGENT_OPERATING_MODEL.md` so Review Power/AI Ready Bundle align with current public offers.
3. Build `/mike-mc/client-journey`.
4. Add automatic Monday client onboarding item from Stripe checkout.
5. Add automatic client hub creation path.
6. Add welcome/access email templates.
7. Add upgrade readiness scoring for Always Ready.
8. Add monthly report and client communication cadence into recurring runs.

