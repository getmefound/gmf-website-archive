# GMF SOP Master Map

Status: first-pass inventory
Owner: Coach
Last updated: 2026-05-27
Purpose: master list of SOPs GMF needs to document from prospecting through delivery, retention, reporting, systems, finance, and owner oversight.

This is the operating backlog for documenting how GetMeFound runs.

Use this file to decide what SOP needs to be written next. Each SOP should eventually become its own focused document or workflow page with trigger, owner, steps, proof, tools, safety rules, and handoff.

Visual companion: `docs/GMF_SOP_VISUAL_MAP.md`

Owner command plan: `docs/GMF_OWNER_COMMAND_PLAN.md`

Agent operating model: `docs/AGENT_OPERATING_MODEL.md`

Agent training escalation protocol: `docs/GMF_AGENT_TRAINING_ESCALATION_PROTOCOL.md`

## Priority Key

| Priority | Meaning |
|---|---|
| P0 | Must exist before live client/prospect risk scales. |
| P1 | Needed for repeatable daily operation. |
| P2 | Needed for optimization, delegation, or scale. |
| P3 | Nice to document after core operations are stable. |

## Status Key

| Status | Meaning |
|---|---|
| Needed | SOP not yet written clearly enough. |
| Drafted | Some source material exists, but it needs a clean SOP. |
| Active | SOP exists and can be used now. |
| Needs Update | SOP exists but contains old AOH/GHL/product language or incomplete rules. |

## SOP Writing Standard

Every SOP should include:

- purpose
- trigger
- owner
- named accountable agent or person, once activated
- support roles
- reviewer
- tools
- prerequisites
- step-by-step procedure
- proof required before done
- what to log
- client/prospect-facing communication rule
- Mike escalation rule
- failure or blocker handling
- version, effective date, and next review date
- source of truth

## SOP Testing And Governance Standard

An SOP is not Active until it has passed these checks:

1. Desktop review: owner and reviewer confirm purpose, trigger, inputs, steps, output, proof, handoff, and escalation path.
2. Dry run: someone other than the writer follows the SOP with a fake or safe case and records every confusing, missing, or slow step.
3. Live pilot: the SOP is used on the first low-risk real case with proof captured.
4. Audit: Auditor checks proof, claims, logs, handoffs, client/prospect language, and risk controls.
5. Publish: current version, owner, effective date, review date, changelog, and archive/replacement links are recorded.

Review cadence:

- P0 or high-risk SOPs: quarterly, and immediately after a tool change, failed handoff, client complaint, billing issue, reputation risk, access issue, live-send change, or legal/privacy concern.
- P1 operational SOPs: semi-annually, and after meaningful process/tool changes.
- P2/P3 SOPs: annually unless the process changes sooner.

Monitoring metrics:

- percent of SOPs with a named owner
- percent of P0 SOPs Active
- percent reviewed by due date
- SOP runs missing required proof
- blocked handoffs by SOP
- incidents tied to missing, unclear, or outdated SOPs
- average days from change request to approved update

Mike involvement rule:

- Mike should review the SOP health dashboard monthly and approve only material decisions: offer/pricing changes, tool spend, legal/privacy risk, refunds/billing exceptions, reputation risk, public promises, credential/access issues, HighLevel AI feature toggles, live prospecting clearance, and direct payment or agentic checkout risk.
- Mike should not be the routine editor, chaser, or QA person for normal SOP upkeep. Manager, Coach, Auditor, and role owners should keep the system current and escalate only decision-grade items.

## 1. Prospecting And Lead Generation

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Ideal customer profile and no-fit rules | P0 | Drafted | Sales Manager | New prospect source, new niche, or campaign idea | Clear target and exclusion rules |
| Offer-lane selection for prospects | P0 | Drafted | Sales Manager | Prospect enters pipeline | Get Found, Stay Found, Always Ready, nurture, or no-fit path |
| Smartlead API access and readiness preflight | P0 | Drafted | Systems Director | Before any live cold prospect sends | Read-only preflight pass and blocker list |
| Sending domain readiness and warmup | P0 | Drafted | Systems Director | New outreach domain or mailbox | Warmup/status proof and safe send cap |
| Prospect source discovery | P1 | Drafted | Scout | Need new prospect batch | Source list with business name, website, location, and fit notes |
| Prospect enrichment and dedupe | P1 | Drafted | Scout | New prospect batch | Cleaned prospect rows |
| Prospect QA and suppression | P0 | Drafted | Sales Manager | Before import or send | Keep/hold decisions and suppression proof |
| Cold email campaign creation | P1 | Drafted | Sales Manager | Approved outreach theme | Campaign draft, sequence, audience, and risk notes |
| Cold email launch approval packet | P0 | Drafted | Manager | Campaign ready to send | Mike-ready approval packet or blocked status |
| Cold email live send guardrail | P0 | Drafted | Manager | Launch request | Safe launch decision, cap, and proof |
| Reply routing and classification | P0 | Drafted | Sales Rep | Prospect replies | Report, book, objection, unsubscribe, no-fit, or nurture status |
| Unsubscribe and do-not-contact handling | P0 | Drafted | Systems Director | Prospect opts out or complains | Suppression logged across tools |
| Campaign daily status and recovery | P1 | Drafted | Manager | Scheduled campaign day | Sent/not sent status and blocker summary |
| Social reach prospecting | P2 | Drafted | Scout | Useful social thread, post, or comment appears | Help-first action and trust signal log |
| Partner program promotion | P2 | Drafted | Sales Manager | Need partner applicants | Partner acquisition plan and approved copy |
| Inbound contact form triage | P1 | Drafted | Sales Rep | Website contact form submitted | Sales/client/support route and reply draft |
| Free visibility check request intake | P0 | Drafted | Sales Rep | Website CTA or manual request | Lead record and report job |
| UCP/agentic commerce prospect fit check | P2 | Drafted | Scout | Prospect sells products, bookings, food delivery, hospitality, or ecommerce | Note whether agentic commerce readiness matters |

## 2. Sales Conversion

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Free visibility scan research | P0 | Drafted | Scout | Free report requested | Public scan notes |
| Prospect visibility report build | P0 | Drafted | Reporter | Scout scan complete | One-page conversion report |
| Prospect report claim audit | P0 | Drafted | Auditor | Report ready | Pass/fail with edits |
| Prospect report delivery email | P0 | Drafted | Sales Rep | Auditor approves report | Report email sent and logged |
| Prospect follow-up cadence | P1 | Drafted | Sales Rep | Report sent | Day 2, Day 7, Day 14, nurture path |
| Orphaned report recovery | P1 | Drafted | Sales Rep | Report sent, no signup | Recovery sequence and status |
| Pricing and checkout link handling | P0 | Drafted | Sales Rep | Prospect asks to buy or asks price | Correct link and plan explanation |
| Abandoned checkout detection | P1 | Drafted | Systems Director | Stripe checkout started but payment not completed | Recoverable checkout event or no-action reason |
| Abandoned cart recovery cadence | P1 | Drafted | Sales Rep | Checkout abandoned with usable contact info | 1-hour/24-hour/72-hour recovery decision |
| Abandoned cart email templates | P1 | Drafted | Sales Manager/Coach | Recovery email due | Approved helper emails by offer |
| Abandoned cart suppression and exit rules | P0 | Drafted | Sales Manager | Prospect buys, opts out, replies, or becomes no-fit | Stop recovery and update status |
| Fit call request handling | P0 | Drafted | Sales Rep | Prospect asks for call | Call requested status and Manager/Mike route |
| Objection handling | P1 | Drafted | Sales Manager | Prospect objects or hesitates | Approved response by objection type |
| Closed-won handoff | P0 | Drafted | Sales Rep | Payment, signed approval, or Mike-approved manual start | Manager onboarding handoff |
| Closed-lost and nurture classification | P1 | Drafted | Sales Rep | Prospect declines, goes quiet, or no-fit | Status and next allowed touch |
| Custom promise approval | P0 | Drafted | Sales Manager | Prospect asks for nonstandard scope | Approved/declined custom promise |
| Upgrade sale from existing client | P1 | Drafted | Sales Manager | Evidence supports expansion | Upgrade angle and Sales Rep email |
| Agentic commerce readiness sales handoff | P2 | Drafted | Sales Manager | Prospect asks about Google UCP, AI shopping, direct checkout, or Merchant Center | Scope as research/advisory unless Mike approves implementation |

Abandoned cart guardrail:

- Do not treat abandoned checkout as a client signup.
- Do not open onboarding until Stripe payment, signed approval, or Mike-approved manual start exists.
- Recovery emails should be helpful and short: "Did checkout fail?" before "Do you want to buy?"
- Stop immediately when the prospect buys, replies no, unsubscribes, asks for a call, or has a support/billing issue.
- If checkout abandonment appears caused by Stripe/site failure, Systems Director owns the fix before Sales Rep sends another link.

## 3. Partner Program

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Partner application intake | P0 | Active | Systems Director | `/api/partners` submission | `agent_tasks` row and confirmation email |
| Partner application review | P0 | Drafted | Sales Manager | New `partner_application` task | Approve, flag, or decline decision |
| Partner code and referral link generation | P0 | Drafted | Sales Manager | Applicant approved | Partner code and `/ref/code` link |
| Approved partner email | P0 | Drafted | Sales Rep | Partner approved | Approval email with link |
| Declined partner email | P1 | Drafted | Sales Rep | Partner declined | Kind decline email |
| Flagged partner escalation | P0 | Drafted | Manager | Applicant needs Mike decision | Slack/Mike packet and no applicant email yet |
| Partner conversion tracking | P1 | Drafted | Systems Director | Partner traffic or sale exists | UTM/ref attribution |
| Monthly partner commission reconciliation | P1 | Drafted | Sales Manager | Monthly payout cycle | Stripe/GA4 review and payout list |
| Partner payout handling | P1 | Drafted | Mike/Sales Manager | Commission approved | PayPal/bank payout proof |

## 4. Signup And Client Onboarding

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Stripe payment to client record | P0 | Drafted | Systems Director | Checkout completes | Client record and onboarding task |
| Manual client start | P0 | Drafted | Manager | Mike approves manual start | Client record without normal checkout |
| Sales-to-client handoff | P0 | Drafted | Manager | Closed won | Onboarding opened and owner assigned |
| Client ID, folder, and hub shell | P0 | Drafted | Systems Director | Onboarding opened | Client folder, slug, hub, magic-link path |
| Magic-link client access | P0 | Drafted | Systems Director | Client hub created | Client access without password account |
| Welcome email | P0 | Drafted | Account Manager | Client record ready | Welcome email and next ask |
| GBP access request | P0 | Drafted | Account Manager | Client needs Google access setup | Client invite instructions |
| Customer list request | P0 | Drafted | Account Manager | Review path included | Customer upload ask |
| Onboarding blocker follow-up | P0 | Drafted | Account Manager | Client action missing | Reminder every two business days |
| Client baseline visibility report | P0 | Drafted | Reporter | Safe public scan available | Client baseline report |
| Onboarding first-14-days status loop | P1 | Drafted | Manager | New client in launch window | Daily/weekly status and blockers |
| Client hub status update | P1 | Drafted | Account Manager | Setup status changes | Client-safe hub status |
| Onboarding done criteria | P0 | Drafted | Auditor | Launch work appears complete | Proof gate pass/fail |

## 5. Get Found Fulfillment

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| GBP access verification | P0 | Drafted | Profile Manager | Client says access sent or setup begins | Correct profile and role confirmed |
| GBP audit | P0 | Drafted | Profile Manager | Access confirmed or public scan allowed | Profile gaps and recommended fixes |
| Google AI Search readiness audit | P0 | Drafted | Profile Manager/Reporter | Client baseline or Get Found work starts | Crawlability, snippet eligibility, facts, content/proof, GBP, and Merchant Center notes |
| GBP category and service review | P0 | Drafted | Profile Manager | GBP audit starts | Category/service update plan |
| Hours, phone, website, and description review | P0 | Drafted | Profile Manager | GBP audit starts | Business fact sync notes |
| Photo and media check | P1 | Drafted | Profile Manager | GBP audit starts | Photo/media recommendation |
| Google Business Profile update change control | P0 | Drafted | Profile Manager | GBP edit, post, profile drift fix, or client-requested change is ready | Approved update packet, submitted proof, and after-state status |
| Review link capture and test | P0 | Drafted | Profile Manager | Correct GBP confirmed | Tested Google review link |
| Website/profile fact sync | P0 | Drafted | Profile Manager | Site/profile mismatch found | Fact sync checklist |
| Crawlability and index eligibility check | P0 | Drafted | Systems Director/Profile Manager | Website visibility work begins | Indexable page, snippet, robots, sitemap, and Search Console notes |
| LocalBusiness schema recommendation | P1 | Drafted | Profile Manager | Website needs structured data | Schema plan or handoff |
| Helpful proof content recommendation | P1 | Drafted | Profile Manager/Coach | Generic or commodity site content found | Specific client proof, story, photo, video, or FAQ recommendation |
| First review request path setup | P0 | Drafted | Reviews Manager | Review link and customer path ready | Safe review request path |
| Before/after visibility snapshot | P0 | Drafted | Reporter | Get Found work complete | Proof snapshot |
| Get Found completion audit | P0 | Drafted | Auditor | Work ready to mark done | Pass/fail and proof |
| Get Found delivery email | P0 | Drafted | Account Manager | Auditor approves completion | Client-safe summary and next action |

## 6. Stay Found Fulfillment

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Weekly customer/job upload | P0 | Drafted | Account Manager | Stay Found client needs review requests | Upload/request reminder |
| Customer list cleaning | P0 | Drafted | Reviews Manager | Customer list received | Clean, held, suppressed counts |
| Review request send candidates | P0 | Drafted | Reviews Manager | Review send window approaches | Eligible send list |
| Review request proof preview | P0 | Drafted | Reviews Manager | Before any live send | Rendered email/link proof |
| Email review request send | P0 | Drafted | Reviews Manager | Send approved and safe | Send log and failure list |
| Follow-up review request send | P1 | Drafted | Reviews Manager | Follow-up due | Suppression-safe follow-up log |
| Private feedback routing | P0 | Drafted | Reviews Manager | Customer leaves low/private feedback | Feedback routed privately |
| Review monitoring | P1 | Drafted | Profile Manager | Recurring service active | New review count and notes |
| Weekly GBP post | P1 | Drafted | Profile Manager | Stay Found weekly cadence | Draft, approval if needed, post proof |
| Monthly profile drift check | P1 | Drafted | Profile Manager | Monthly recurrence | Drift report and fixes/blockers |
| Search Console and AI visibility signal review | P1 | Drafted | Reporter | Monthly recap cycle | Query, page, click, impression, and AI/local observation notes |
| Monthly Stay Found recap | P0 | Drafted | Reporter | Month end | Recap draft |
| Monthly recap audit | P0 | Drafted | Auditor | Recap ready | Claim/proof pass |
| Monthly recap send | P0 | Drafted | Account Manager | Auditor approves recap | Client email and hub update |
| Included hosting update request | P2 | Drafted | Systems Director | Client requests minor site update | Accepted/declined/update path |

## 7. Always Ready Fulfillment

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Always Ready onboarding | P1 | Drafted | Manager | Client buys/upgrades | Expanded onboarding checklist |
| SMS readiness and A2P gate | P0 | Drafted | Systems Director | SMS requested or included | A2P/consent/STOP/HELP pass |
| SMS review request send | P0 | Drafted | Reviews Manager | SMS approved and compliant | Send log and suppression proof |
| Review reply voice profile | P1 | Drafted | Reply Writer | Reply service starts | Client voice profile |
| Review reply drafting | P0 | Drafted | Reply Writer | New review needs response | Draft and risk flags |
| Review reply approval | P0 | Drafted | Account Manager | Draft ready | Approve/reject/post decision |
| Negative review alert | P0 | Drafted | Reviews Manager | 1-4 star or risky review appears | Risk packet and recommended response |
| Public review reply posting | P0 | Drafted | Profile Manager/Reply Writer | Client approves reply | Posted reply proof |
| AI/local answer visibility check | P1 | Drafted | Reporter | Always Ready cycle | Deeper visibility observations |
| Query fan-out topic coverage review | P2 | Drafted | Reporter/Coach | AI/local gap found | Human-useful topic gaps, not spam page list |
| Content and GBP post planning | P1 | Drafted | Profile Manager/Coach | Monthly content cycle | Post/content plan |
| FAQ/schema/location-page recommendation | P2 | Drafted | Profile Manager | AI/search gap found | Recommendation and handoff |
| Voice/lead-response readiness | P2 | Drafted | Systems Director | Client asks or upgrade includes it | Approval-gated readiness plan |
| Monthly strategy call prep | P1 | Drafted | Account Manager | Strategy call due | Agenda and proof packet |
| Strategy call follow-up | P1 | Drafted | Account Manager | Call completed | Summary, decisions, next actions |

## 8. Client Service, Retention, And Expansion

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Client question handling | P0 | Drafted | Account Manager | Client emails a question | Answer, route, or blocker |
| Client call request | P0 | Drafted | Account Manager | Client asks to talk | Call requested status and Manager route |
| Client complaint or reputation risk | P0 | Drafted | Manager | Client is upset or risk appears | Escalation and response plan |
| At-risk client detection | P1 | Drafted | Account Manager | Low activity, complaint, cancellation hint | At-risk status and retention action |
| Cancellation request | P0 | Drafted | Account Manager | Client asks to cancel | Cancel path, final service state, Mike flags |
| Refund or billing exception | P0 | Drafted | Manager/Mike | Refund, charge issue, exception | Owner decision and Stripe action |
| Upgrade opportunity detection | P1 | Drafted | Reporter | Data supports expansion | Evidence item |
| Upgrade timing review | P1 | Drafted | Account Manager | Evidence exists | Relationship timing decision |
| Timed upgrade email cadence | P1 | Drafted | Sales Manager | Client reaches planned lifecycle window | Day 14/30/45/60/75-90 send-or-hold decision |
| Upgrade email suppression and cooldown | P1 | Drafted | Account Manager | Client is blocked, unhappy, new, or recently pitched | Hold/suppress decision |
| Timed upgrade email template library | P1 | Drafted | Sales Manager/Coach | Cadence slot or evidence trigger exists | Approved email by plan, proof signal, and tone |
| Timed upgrade email send and log | P1 | Drafted | Sales Rep | Sales Manager approves angle and Account Manager approves timing | Email sent, held, or call route logged |
| Upgrade recommendation send | P1 | Drafted | Sales Rep | Sales Manager approves angle | Upgrade email/call path |
| Client renewal/recurring health review | P2 | Drafted | Manager | Monthly review cycle | Retention health summary |

Timed upgrade guardrail:

- No upsell in the first 7 days unless the client asks.
- Day 14 should be education only unless the client has an obvious requested need.
- Day 30 can include one specific opportunity inside the monthly recap.
- Day 45-60 can send one strategy insight if there is proof.
- Day 75-90 can recommend Always Ready only when proof and fit are strong.
- Do not send timed upgrade emails to clients with unresolved blockers, active complaints, billing issues, or reputation risk.

## 9. Reporting, Proof, And Dashboards

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Visibility report shared record model | P0 | Drafted | Systems Director | Report created | Supabase report/event records |
| Prospect report artifact generation | P0 | Drafted | Reporter | Prospect report requested | Prospect-safe artifact |
| Client report artifact generation | P0 | Drafted | Reporter | Client baseline or monthly report needed | Client proof artifact |
| Report download/archive | P1 | Drafted | Reporter | Report is ready | Downloadable report and storage link |
| Proof artifact storage | P0 | Drafted | Reporter | Any workflow completes | Proof link/file |
| Mission Control owner summary | P1 | Drafted | Manager | Daily or on demand | Owner-visible status |
| Monday board update | P1 | Drafted | Manager | Job opens, blocks, or completes | Monday status/current owner |
| Morning brief | P2 | Drafted | Manager | Daily scheduled brief | Owner summary |
| Owner inbox morning triage | P0 | Drafted | Manager / Systems Director | Daily morning or owner asks whether email has unhandled work | Coverage audit first; then new/old unaddressed email triage, agent routing, and owner-needed summary |
| Weekly safety audit | P0 | Drafted | Systems Director/Auditor | Weekly cadence | Pass/watch/blocker report |
| Monthly business review | P2 | Drafted | Manager | Month end | Clients, revenue, risk, upgrades, blockers |
| SOP health dashboard | P0 | Drafted | Manager/Coach | Weekly or on demand | SOP counts by status, priority, owner, stale review, and blocked P0 |
| SOP execution proof dashboard | P1 | Drafted | Auditor/Manager | Recurring SOP usage grows | Missing proof, failed handoffs, and audit findings by SOP |
| Agent runtime watchdog and dispatcher | P0 | Drafted | Systems Director / Manager | Agent job marked Agent Working or owner asks why agent stopped | Runtime classification, dispatcher mapping, and proof |
| Waiting state SLA and timer control | P0 | Drafted | Manager | Any job enters a waiting state | Waiting reason, owner, next owner, expected receive time, escalation time, and recovery action |
| Agent-to-agent handoff and receive acknowledgment | P0 | Drafted | Manager | Work passes from one agent to another | Handoff packet, next-agent acknowledgment, due time, and missed-handoff rescue |
| Stuck agent timeout and rescue | P0 | Drafted | Systems Director / Manager | Agent misses heartbeat, due time, or proof update | Stuck classification, rescue route, reassignment/training/repair, and proof |
| Client information request cadence and escalation | P0 | Drafted | Account Manager | Client-provided item is required | Client ask, due date, reminder cadence, alternate path, and escalation decision |
| Business Improvement Auditor daily report | P0 | Drafted | Sentinel (Business Improvement Auditor) | Daily morning or owner asks for improvement audit | Agent efficiency, bottlenecks, prospecting/retention improvements, and owner-needed decisions |

## 10. Systems, Tools, And Data

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Environment variable management | P0 | Drafted | Systems Director | New secret or deploy config | Secret stored and documented without exposure |
| Vercel deploy and rollback | P0 | Drafted | Systems Director | Production change | Deploy proof and rollback path |
| Supabase schema migration | P0 | Drafted | Systems Director | Database change | Migration applied and verified |
| Supabase backup and recovery | P0 | Drafted | Systems Director | Before client volume grows | Backup/PITR proof and recovery path |
| Resend domain and email health | P0 | Drafted | Systems Director | Email send path used | Domain/auth/delivery proof |
| Stripe product and webhook management | P0 | Drafted | Systems Director | Offer/checkout change | Product, price, webhook proof |
| Google Search Central AI guidance monitoring | P1 | Drafted | Scout/Coach | Google updates AI Search, AI Mode, AI Overviews, or Search Console guidance | Plain-English GMF impact note and SOP update recommendation |
| Universal Commerce Protocol monitoring | P2 | Drafted | Scout/Systems Director | Google UCP, Merchant Center, AP2, or agentic checkout changes | Plain-English update and GMF impact note |
| Merchant Center and UCP eligibility check | P2 | Drafted | Systems Director | Client sells eligible products, bookings, or delivery services | Eligibility/readiness checklist, not implementation promise |
| Agentic checkout integration readiness | P3 | Drafted | Systems Director | Mike approves a UCP/AP2 implementation investigation | Technical feasibility, payment risk, and support plan |
| Slack Manager command routing | P1 | Drafted | Manager/Systems Director | Slack command or bot change | Command behavior and eval proof |
| Owner Gmail evidence access | P0 | Drafted | Systems Director / Manager | Agent needs an inbox-accessible fact, invite, notice, receipt, prior instruction, or approved email path | Safe email evidence, no-result proof, or live-send gate |
| Email identity and sender routing | P0 | Drafted | Systems Director / Manager | Agent needs to send, draft, read, or route email | Correct sender lane, monitored reply path, and send/no-send proof |
| Manager eval update loop | P1 | Drafted | Coach | Manager behavior changes | Scenario and passing eval |
| HighLevel AI feature safety check | P0 | Drafted | Systems Director | GHL access, downgrade, or audit | AI toggles confirmed off |
| GHL $97 bridge smoke check | P1 | Drafted | Systems Director | Post-downgrade or monthly | Bridge pass/watch/blocker report |
| Smartlead access/readiness check | P0 | Drafted | Systems Director | Before live prospecting sends | Read-only readiness pass |
| Security sweep | P0 | Drafted | Auditor | Weekly or before deploy | No exposed secret/risk report |
| Data retention and privacy | P1 | Drafted | Systems Director | Client data stored | Retention/deletion rules |
| Client magic-link auth lifecycle | P0 | Drafted | Systems Director | Client hub access changes | Link issue/revoke/refresh process |

## 11. Finance, Admin, And Cost Control

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Daily/weekly revenue reconciliation | P1 | Drafted | Manager | Sales or billing activity | Stripe/revenue status |
| Monthly recurring revenue review | P1 | Drafted | Manager | Month end | Active clients and MRR |
| Tool cost report | P1 | Drafted | Systems Director | Month end | GHL, Smartlead, Resend, Supabase, Vercel, AI cost view |
| Model/tool usage cost tracking | P2 | Drafted | Systems Director | Client activity grows | Cost per client/service |
| Partner commission reconciliation | P1 | Drafted | Sales Manager | Month end | Partner payout list |
| Refund and dispute handling | P0 | Drafted | Manager/Mike | Refund/dispute occurs | Decision, action, and proof |
| Pricing change approval | P0 | Drafted | Sales Manager/Mike | Offer price changes | Approved price and site/docs update |
| Vendor subscription change | P0 | Drafted | Systems Director/Mike | Upgrade/downgrade/cancel tool | Spend decision and rollback risk |
| Legal/privacy copy update | P1 | Drafted | Coach | Offer/data flow changes | Updated terms/privacy copy request |

## 12. Knowledge, Training, And Brand Control

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| SOP creation and update workflow | P0 | Active | Coach | New or changed process | Versioned SOP update |
| SOP owner assignment audit | P0 | Active | Coach | Master map changes or monthly review | No orphan SOPs and named accountable owner for Active SOPs |
| SOP dry-run and pilot test | P0 | Active | Coach/Auditor | SOP drafted and ready to activate | Pass/fail test notes and revision tasks |
| SOP review calendar | P0 | Active | Coach | SOP becomes Active | Next review date, cadence, and reminder/ticket |
| SOP change request intake | P1 | Active | Coach/Auditor | User finds gap, confusion, or process drift | Accepted, deferred, rejected, or escalated change request |
| SOP release and training notice | P1 | Active | Coach | SOP is published or materially changed | Changelog, affected roles, and acknowledgment/training note |
| SOP archive and retirement | P2 | Active | Coach | SOP is replaced or process is retired | Archived old version and replacement/current link |
| Agent training pack update | P0 | Drafted | Coach | Role/process changes | Updated training pack |
| Agent skill-gap training escalation | P0 | Drafted | Coach/Trainer | Agent cannot safely or confidently complete assigned work | Training request, training artifact, agent rerun, and Auditor verification |
| Client-safe language review | P0 | Drafted | Coach/Auditor | Public or client-facing copy changes | Approved wording |
| Offer ladder source-of-truth update | P0 | Drafted | Coach | Offer changes | Docs/site copy alignment |
| Research ingestion from Scout | P1 | Drafted | Coach | Search/Google/platform change found | Plain-English agent instruction |
| Google AI Search myth filter | P1 | Drafted | Coach/Auditor | New AI SEO/AEO/GEO tactic is proposed | Approve, reject, or watch based on official guidance and client risk |
| Agentic commerce/UCP knowledge update | P2 | Drafted | Coach | Google UCP or related protocol changes | Updated sales-safe and client-safe guidance |
| Old AOH/GHL language cleanup | P1 | Drafted | Coach | Rebrand drift found | GMF-safe language |
| Objection and sales script library | P1 | Drafted | Sales Manager/Coach | Repeated sales questions | Approved scripts |
| Client email template library | P1 | Drafted | Account Manager/Coach | Repeated client emails | Approved templates |
| Partner email template library | P1 | Drafted | Sales Manager/Coach | Partner workflow changes | Approved partner templates |

## 13. Audit, Risk, And Escalation

| SOP | Priority | Status | Owner | Trigger | Output |
|---|---:|---|---|---|---|
| Auditor proof gate | P0 | Drafted | Auditor | Workflow ready to mark done | Pass/fail decision |
| Client-facing claim audit | P0 | Drafted | Auditor | Report/email/site copy ready | Claim-safe approval |
| AI visibility claim audit | P0 | Drafted | Auditor | Report, sales copy, or client email mentions AI Search, AI Mode, or AI Overviews | No ranking guarantees, no unsupported hacks, proof-backed wording |
| SOP adherence audit | P0 | Drafted | Auditor | Weekly sample or monthly review | Current SOP compared to actual work and proof |
| Process failure retrospective | P0 | Drafted | Auditor/Manager | Incident, missed step, complaint, or failed handoff | Root cause and SOP/tool/training update |
| Live send approval | P0 | Drafted | Auditor/Manager | Email/SMS/campaign send requested | Send approved or blocked |
| Public profile edit approval | P0 | Drafted | Auditor/Manager | GBP/site/public change requested | Edit approved or held |
| Reputation risk escalation | P0 | Drafted | Auditor/Manager | Bad review, complaint, legal/safety issue | Mike escalation packet |
| Credential/access escalation | P0 | Drafted | Systems Director/Manager | Login/access/billing issue | Mike-only request |
| Human-needed Slack alert | P0 | Drafted | Manager | Human involvement required | Slack post only when needed |
| Incident response | P0 | Drafted | Systems Director/Auditor | Outage, broken send, exposed data, billing risk | Incident log and recovery steps |
| Agentic checkout/payment risk review | P1 | Drafted | Auditor/Systems Director | Any UCP/AP2/direct-checkout implementation is proposed | Payment, privacy, merchant-of-record, refund, and support risk decision |

## Active SOPs

- `SOP 000 - SOP Creation, Testing, Governance, And Review` (covers SOP creation, owner assignment, dry-run/pilot testing, review calendar, change request intake, release notice, and archive/retirement)
- `SOP 045 - Partner Application Intake`

## Next SOPs To Test And Activate

Recommended order:

1. `SOP 001 - Smartlead API Access And Read-Only Readiness`
2. `SOP 002 - Free Visibility Check Intake To Report Delivery`
3. `SOP 003 - Sales To Client Handoff`
4. `SOP 004 - Client Onboarding And Magic-Link Hub Setup`
5. `SOP 005 - Google Business Profile Access Request And Verification`
6. `SOP 006 - Get Found Fulfillment`
7. `SOP 007 - Review Request Send Readiness And Live Send Guardrail`
8. `SOP 008 - Monthly Client Recap`
9. `SOP 009 - Partner Application Review`
10. `SOP 010 - Weekly Safety Audit`

## Source Docs Already Feeding This Map

- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP_INDEX.md`
- `docs/sops/SOP_HEALTH_DASHBOARD.md`
- `docs/sops/SOP_TESTING_BACKLOG.md`
- `docs/sops/SOP_TESTING_BACKLOG.csv`
- `docs/sops/SOP_LIVE_PILOT_QUEUE.md`
- `docs/sops/SOP_LIVE_PILOT_QUEUE.csv`
- `docs/sops/SOP_QUEUE_CONTROL_COVERAGE_AUDIT.md`
- `docs/sops/TEMPLATE-sop-live-pilot-evidence.md`
- `docs/sops/live-pilots/NEXT_ACTION_PACKET.md`
- `docs/sops/live-pilots/FRIEND_TEST_CLIENT_PILOT.md`
- `docs/sops/live-pilots/FRIEND_TEST_CLIENT_INTAKE.md`
- `docs/sops/live-pilots/FRIEND_TEST_CLIENT_REQUEST_TEMPLATE.md`
- `docs/sops/live-pilots/2026-05-27-SOP-005-friend-gbp-access-evidence.md`
- `docs/sops/live-pilots/2026-05-27-SOP-054-friend-manual-client-start-evidence.md`
- `docs/sops/live-pilots/GMF_GBP_SETUP_PILOT.md`
- `docs/sops/live-pilots/GMF_GBP_SETUP_INTAKE.md`
- `docs/sops/live-pilots/GMF_GBP_SETUP_REQUEST_FOR_FACTS.md`
- `docs/sops/SOP_ACTIVATION_BATCH_A_2026-05-27.md`
- `docs/sops/SOP_ACTIVATION_BATCH_B_2026-05-27.md`
- `docs/sops/SOP_ACTIVATION_BATCH_C_2026-05-27.md`
- `docs/sops/SOP_ACTIVATION_BATCH_D_2026-05-27.md`
- `docs/sops/SOP_ACTIVATION_BATCH_E_2026-05-27.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
- `docs/sops/TEMPLATE-gmf-sop.md`
- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/GMF_PARTNER_PROGRAM.md`
- `docs/client-ops-ledger/client-hub-runbook.md`
- `docs/client-ops-ledger/ghl-replacement-cost-plan.md`
- `docs/client-ops-ledger/slack-agent-command-runbook.md`
- `docs/client-ops-ledger/social-reach-pilot-runbook.md`

## External Watch Sources

- Google Search Central: Generative AI Search optimization guide, Search Console updates, and Search ranking updates
- Google Search Central blog: AI Mode, AI Overviews, Search Console, and Search quality guidance
- Google Developers Blog: Universal Commerce Protocol technical updates
- Google Shopping/Keyword blog: Universal Cart, UCP, Merchant Center, and AI shopping updates
- Google Merchant Center help: UCP onboarding and eligibility guidance
- Stripe/payment-provider docs: agentic checkout, wallet, and payment protocol updates

## SOP Governance Research Inputs

- EPA SOP guidance: SOPs should be prepared and used as part of a quality system.
- ISO 9001/document-control guidance: current procedures need approval before use, owner/review accountability, version control, distribution control, and traceable changes.
- Process-governance guidance: process reviews should compare documented work to actual work and end as confirmed, updated, or flagged for redesign.
- Small-business operator discussions: SOPs should start with critical/repeated workflows, stay lightweight enough to use, and be treated as live documents.
- SaaS/operator discussions: documentation alone does not enforce execution; SOPs need checklists, required fields, approvals, proof artifacts, dashboards, or workflow gates close to the actual work.

## Open Questions For Mike

- Should SOP files use numeric IDs, such as `SOP-001-smartlead-readiness.md`, or live grouped by department?
- Should Monday mirror this SOP list as a documentation backlog?
- Which SOP should be written first for actual use this week: prospecting readiness, free visibility checks, or client onboarding?
- Should partner commission reconciliation stay manual monthly, or should Systems Director build a simple monthly report?
