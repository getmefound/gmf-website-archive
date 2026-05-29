# GHL Replacement And Cost Plan

Status: $97 bridge active  
Owner: Manager  
Specialists: GHL Expert, Systems Director, Website/Codex, Auditor  
Last updated: 2026-05-21

## Owner Summary

GHL should not be the long-term center of GMF if clients are going to use GMF client pages instead of GHL subaccounts.

Best path:

1. Downgrade from the $497 plan as soon as no active feature requires it. Done on 2026-05-21.
2. Keep the cheapest useful GHL plan while GMF proves Review Automation and Reach.
3. Build the GMF-owned replacement in phases.
4. Do not buy per-client GHL AI, SEO heatmaps, or SaaS features unless a client is paying enough to justify that exact add-on.

Recommended current decision:

- Use $97 Starter while GMF has 1-3 GHL-backed locations. This is now active.
- While $97 works, do not buy Calendly, Smartlead/Instantly, or a separate
  review-request email sender.
- Use $297 Unlimited only if GMF needs more GHL locations before the GMF-built backend is ready.
- Avoid $497 Agency Pro unless GMF is reselling GHL as software or needs marked-up rebilling/SaaS Mode.

Cheapest short-term stack:

| Need | Short-term tool | Extra monthly cost |
| --- | --- | ---: |
| Booking | GHL calendar/booking if it survives downgrade | $0 beyond GHL |
| Reach cold email drips | Current GHL workflows | $0 beyond GHL + usage |
| Review request email | LC Email/GHL bridge while GMF tests | usage only |
| Client page/status | GMF website | $0 beyond current hosting |

Tools to defer:

| Deferred tool | Why defer |
| --- | --- |
| Calendly | Not needed if GHL $97 booking works. |
| Smartlead/Instantly | Not needed until GHL cold email becomes a deliverability/reporting/scaling blocker. |
| Separate review email sender | Not needed until GMF Review Automation needs better logs, bounce events, or independence from GHL. |

## Review Automation Promise

This is the promise GMF needs to fulfill for the base Review Automation offer before deciding what GHL can be replaced with.

Current public promise from pricing, checkout, onboarding, and agent docs:

| Promise | What it means operationally | Base or upgrade? |
| --- | --- | --- |
| Automated email review requests after every job | A completed customer/job should trigger an email asking for a Google review. | Base |
| Google Business Profile audit + fix | GMF checks the client's GBP basics and fixes/flags profile gaps in week 1. | Base |
| Google Business Profile connection/access | Client adds GMF as GBP Manager; GMF captures the correct review link and can help with profile work. | Base |
| Monthly recap | Client gets a simple summary of what went out, what came in, and what needs attention. | Base |
| Client does not learn software | Client uses GMF page/email/text, not GHL dashboards. | Base |
| Cancel anytime/no contract | Operationally means no long onboarding lock-in and easy offboarding. | Base |
| Replies in client's voice | AI or GMF-drafted public review replies. | AI Visibility/upgrade |
| SMS review requests | Text-message review requests, A2P/10DLC registration, opt-out handling, and compliance setup. | Upgrade/add-on |
| Social review posting | Turning reviews into social/GBP posts. | Upgrade/custom |
| AI Visibility/rankings/heatmaps | AI search, local ranking, competitor monitoring. | Upgrade/custom |

Copy alignment note:

- Some social/blog copy says GMF "filters unhappy customers privately" before sending the rest to Google.
- If GMF keeps saying that publicly, the base product needs a private feedback step before the Google link, such as "How did we do?" with happy customers routed to Google and unhappy customers routed to the owner.
- If GMF wants the simplest $49/mo product, public copy should say "email review requests and follow-up" instead of promising advanced filtering.

Recommended product boundary:

- Base Review Automation should include email requests, light private feedback routing, GBP audit/fix, review link setup, client page, and monthly recap.
- SMS review requests should not be included in the cheap base plan. They are an upgrade/add-on because US business texting requires A2P/10DLC registration, opt-in language, STOP handling, and carrier compliance.
- AI Visibility should include AI review response drafts/replies, deeper profile/AI visibility work, and heatmap/ranking reports. SMS can be bundled only when the price covers compliance setup and usage.

## Best Non-GHL Fulfillment Model For Review Automation

Goal: fulfill the $49/mo promise without needing GHL subaccounts for every client.

Recommended stack:

| Job | Best non-GHL fulfillment | Estimated cost profile | Notes |
| --- | --- | --- | --- |
| Client page | GMF website route like `/client/[slug]`, protected by magic link before real data. | Mostly existing website cost. | This becomes the client's "dashboard" without calling it software. Do not use password-based client hub access. |
| Intake/setup form | GMF form/API writes to database and alerts Manager. | Mostly existing website cost. | Pre-fill from signup/order data where possible. |
| Client/customer database | Postgres/Supabase/Neon tables for clients, jobs/customers, exclusions, review links, sends, events. | About $25-$100/mo early stage depending on provider/usage. | One shared GMF database is cheaper than one GHL subaccount per client. |
| Customer/job upload | CSV upload to GMF page, plus manual paste/list option. | Low. Storage may be pennies to low dollars at first. | Must include do-not-contact and bad-fit exclusions. |
| Google review link | Store URL captured from GBP or public profile. | Free. | The review link is enough to send email requests without GHL. |
| GBP audit/fix | Profile Manager checklist, screenshots, and manual profile updates through Google access. | Labor/agent time, not platform-heavy. | This does not require GHL. |
| Review request email | Use GHL/LC Email as bridge, then move to transactional/email API only when needed. | Low at review volume. GHL LC Email is $0.675/1,000, external email APIs are also low. | Needs unsubscribe, bounce tracking, templates, and sender domain setup before full GHL exit. |
| Private feedback filter | GMF-hosted landing page asks for rating/feedback before showing Google link to happy customers. | Mostly existing website cost. | This supports the "filter unhappy privately" promise without GHL. |
| Follow-up cadence | GMF cron/workflow sends a gentle follow-up if no click/review after X days. | Low. | Start simple: one follow-up. |
| Send windows | GMF scheduler respects timezone and business hours. | Low. | Prevents awkward sends. |
| Suppression/DND | GMF database stores unsubscribed, excluded, bounced, complaint, and do-not-contact statuses. | Low. | Required before replacing GHL safely. |
| Monthly recap | GMF generates an email/client-page summary. | Low. | Start with "requests sent, clicks, reviews reported, issues, next action." |
| Low-review tips | Rule-based tips on client page when weekly/monthly review goal is low. | Free/low. | Already started on client page. |
| Manager alerts | Slack/email alert when setup is blocked, review count is low, or sends fail. | Low. | Keeps Mike from babysitting. |
| AI response drafts | OpenAI/Gemini draft reply on demand, approval required. | Usage-based and likely low. | Upgrade feature; do not auto-publish at first. |
| SMS | Twilio directly if/when sold. | Usage-based plus A2P/10DLC registration and compliance/admin. | Upgrade only. Do not add to the base plan. |
| Heatmaps/rankings | Vendor/export/manual report only for AI Visibility clients. | Per report or paid plan. | Do not pay per-client GHL/Search Atlas for base reviews. |

Minimum GMF-owned Review Automation v1:

1. Client record and client page.
2. Intake form with GBP access confirmation and customer upload.
3. Customer/job table with exclusion flags.
4. Review link storage.
5. Email template and send log.
6. Private feedback page that can route happy customers to Google.
7. One follow-up email.
8. Unsubscribe/suppression.
9. Monthly recap.
10. Manager/Auditor proof log.

Build status:

- Client page exists at `/client/[slug]`.
- Customer upload v1 exists at `/client/[slug]/customers`.
- Customer rows are summarized and cleaned before outreach.
- Customer uploads and feedback can save into existing Upstash Redis when
  configured, so no new storage vendor is required for the first test.
- Full customer rows are not posted to Slack.
- Private feedback v1 exists at `/review/[slug]`.
- Unsubscribe/suppression v1 exists at `/review/[slug]/unsubscribe`.
  Stored suppressions are applied to future customer uploads when Redis is
  configured.
- Internal send-log v1 exists at `/api/review-automation/send-log`.
  GHL exports/webhooks or the future GMF sender can record sent, failed,
  bounced, clicked, and follow-up events there.
- Bounced send logs automatically add the email to the client suppression list
  when Redis is configured.
- Follow-up due v1 exists at `/api/review-automation/followups/due`.
  It reads internal send logs and returns customers due for one gentle follow-up.
- Send-candidate v1 exists at `/api/review-automation/send-candidates`.
  It prepares eligible customers from the latest upload and blocks when storage
  or the verified Google review link is missing.
- Manager/internal summary status exists at `/api/review-automation/status`.
  It returns summary records only by default and requires an internal token.
  Use `AOH_INTERNAL_API_TOKEN`, or the existing report bypass token as the
  bridge token while GMF is consolidating infrastructure.
- Google routing waits for a verified per-client review link.

This v1 fulfills the actual $49/mo promise without GHL.

What not to build into v1:

- Full CRM.
- Full pipeline/opportunity system.
- SMS.
- AI auto-replies.
- Heatmaps.
- Social posting.
- Client login with heavy permissions.
- POS/CRM integrations for every client on day one.

## Client Hub Offer Map

The GMF client page should replace the feeling of a GHL subaccount without
making the client learn software.

Included in base Review Automation:

| Client page area | Purpose |
| --- | --- |
| Setup status | Shows whether GBP access, review link, sender, and customer flow are ready. |
| Needed from you | Gives the client the next small action instead of sending them into a dashboard. |
| Upload customers | Lets the client upload or paste recent completed customers/jobs. |
| Review link status | Confirms the correct Google destination is stored. |
| Email review requests | Shows simple sent/fail/held status for email review requests. |
| Private feedback | Routes unhappy feedback privately before asking happy customers for Google reviews. |
| Do-not-contact/exclusions | Reminds the client not to upload customers who should not be contacted. |
| Monthly recap | Shows requests sent, feedback, review movement, blockers, and next action. |
| Low-review tips | Gives practical actions when reviews are lagging. |
| Support/send-file link | Gives a simple way to send files or ask for help. |

Visible but locked upgrade modules:

| Locked module | Why it helps sell the next plan | Suggested boundary |
| --- | --- | --- |
| AI review replies | Client sees how GMF can reply in their voice without GHL. | AI Visibility/Review Intelligence |
| Safe 5-star auto-replies | Shows future autopilot value after trust is earned. | Higher tier or explicit add-on |
| SMS review requests | Valuable, but requires A2P/10DLC, STOP handling, and logs. | Paid SMS add-on |
| POS/CRM auto-sync | Removes manual uploads. | Paid setup/add-on |
| Review website widget | Turns good reviews into website proof. | Upgrade or setup fee |
| AI Visibility scan | Shows whether the business appears in AI answers. | AI Visibility |
| Local ranking/heatmap report | Gives local SEO proof without GHL/Search Atlas. | AI Visibility/local SEO |
| Competitor review watch | Shows review gap versus nearby competitors. | AI Visibility/local SEO |
| Social/GBP review posts | Repurposes 5-star reviews into posts. | Upgrade/custom |
| Listings/citation cleanup | Fixes directory consistency. | Local SEO add-on |
| Missed-call/voice AI follow-up | Captures missed leads. | Separate Relay/voice plan |
| Multi-location reporting | Helps owners with more than one location. | Higher tier |

Label locked modules as one of:

- Included
- Upgrade
- Add-on
- Coming soon
- Custom

Do not label a module as available until GMF can actually fulfill it.

## POS/CRM Connection Strategy

GHL feels strong because it has many integrations. GMF should not try to copy
every integration on day one. The practical replacement is a ladder.

| Level | Method | Cost/offer logic |
| --- | --- | --- |
| 1 | Manual upload, paste, or send-file workflow | Base plan. Fastest way to go live. |
| 2 | Scheduled export import | Base or small add-on if the client can export clean files. |
| 3 | Zapier/Make/native webhook | Paid setup because mapping and testing are required. |
| 4 | Direct API connector | Paid/custom; build only for common systems or clients who fund it. |
| 5 | SFTP/vendor feed/database export | Custom for larger clients. |

Data GMF needs from each client:

- POS/CRM system name
- review-ready trigger
- available fields: name, email, phone, job/order/date, location, amount if needed
- export/API/webhook/Zapier/Make availability
- admin contact for that system
- consent and do-not-contact rules
- desired send delay after the event
- location mapping for multi-location clients

Recommended connector priority:

| System type | Examples | Why it matters |
| --- | --- | --- |
| Payments/invoices | Stripe, Square | Easy review-ready trigger: paid invoice or completed checkout. |
| E-commerce | Shopify | Clear trigger: fulfilled order. |
| Local appointments/POS | Square, Vagaro, Mindbody | Good fit for salons, spas, wellness, fitness, local service. |
| Home services | Jobber, Housecall Pro, ServiceTitan | High review value; job-completed events matter. |
| Restaurants | Toast, Square | High volume, but compliance and data access may be harder. |

Sales language:

"We start with a simple upload so you can go live quickly. If your POS or CRM
supports exports, webhooks, Zapier, or an API, we can add an auto-sync path as a
paid setup so review requests go out after the right customer event."

## POS/CRM Integration Risk Register

POS integration is not a reason to avoid the GMF plan, but it is a reason to
avoid promising universal auto-sync in the base offer.

| Risk | Why it matters | GMF mitigation |
| --- | --- | --- |
| API access may be plan-gated | Some systems expose APIs only on higher client plans. | Ask for POS plan name during onboarding; quote auto-sync only after access is confirmed. |
| Not every event exists | The POS may have payments but no clean "job completed" event. | Define the review-ready event before setup: paid invoice, closed job, fulfilled order, completed appointment, or manual approval. |
| Webhooks can duplicate events | Many webhook systems deliver at least once, not exactly once. | Store external event IDs and make imports idempotent. |
| Webhooks can arrive out of order | A customer update can arrive before the related job/order is ready. | Queue events, re-check state before sending, and delay review requests. |
| Webhooks can be disabled after failures | Some vendors disable failing endpoints or stop retrying. | Respond quickly, process async, and add health alerts/reconciliation. |
| Polling/Zapier limits can miss volume spikes | Polling triggers may cap items per poll or run on plan-dependent intervals. | Use direct webhooks where possible; add daily reconciliation imports. |
| Customer consent may be unclear | POS data does not always prove marketing/SMS consent. | Email in base; SMS only after explicit opt-in/compliance review. |
| Wrong timing can annoy customers | Restaurants, med spas, and home services have different "ready" moments. | Per-client send delay and exclusion rules. |
| Location mapping can be messy | Multi-location accounts may mix customers under one POS. | Store location IDs and require mapping before sending. |
| API keys create security liability | Client API keys can expose customer and revenue data. | Prefer OAuth where available; store secrets outside git; allow revocation; limit scopes. |
| HIPAA/regulated industries need extra care | Health/wellness clients may include sensitive service data. | Avoid storing service notes; keep only name/contact/date/location and route edge cases to manual review. |
| Review gating policy risk | Sending only happy customers to Google can violate platform policy. | Do not suppress unhappy customers from public review options; use private feedback for service recovery, but do not selectively solicit only positives. |

Build requirements before any direct connector goes live:

- inbound event table with raw payload reference
- normalized customer/job table
- idempotency key per source event
- suppression check before every send
- configurable send delay
- daily reconciliation job for systems that support polling/export
- failure alert when events stop arriving
- per-client "last successful sync" on the client hub
- manual override/hold button before live sending

## Review Automation Fulfillment Jobs Outside GHL

| Fulfillment job | Owner | GMF-built process | Done means |
| --- | --- | --- | --- |
| Payment/order confirmed | Manager | Stripe/checkout event creates client record and setup status. | Client exists in GMF system with plan, owner, email, and status. |
| Client setup page created | Website/Codex | Generate `/client/[slug]` page from client record. | Client sees service status and what is needed. |
| Intake collected | Manager/Coach | GMF form collects business info, review flow, exclusions, customer source, GBP invite confirmation. | Required setup fields complete or blockers shown. |
| GBP access accepted | Profile Manager | Accept/check Manager access in Google; capture proof. | Correct profile/location confirmed. |
| GBP audit/fix | Profile Manager | Run profile checklist: name, category, services, hours, phone, site, photos, posts, review link, unanswered reviews. | Fixes made or client/Mike blockers listed. |
| Review link captured | Profile Manager | Store Google review URL in GMF client record. | Test link opens the correct review destination. |
| Customer list cleaned | Sorter | Normalize CSV/list, dedupe, remove exclusions, flag missing email. | Clean sendable customer list exists. |
| Review email written | Coach/Sender | Use approved template with business name, customer name, and review link/private feedback link. | Test email renders cleanly. |
| Email sender configured | Systems Director/Sender | Configure domain/sender in chosen email provider. | SPF/DKIM/DMARC pass, test email delivered. |
| Review request sent | Sender/System | Cron/API sends only eligible customers during approved window. | Send log shows success/fail per customer. |
| Follow-up sent | Sender/System | One follow-up to non-click/non-response customers after configured delay. | Follow-up respects suppression and does not over-send. |
| Private feedback handled | Sorter/Manager | Low-rating/private feedback gets routed to owner/Manager, not Google-first. | Unhappy feedback is visible and not pushed publicly by automation. |
| New reviews tracked | Profile Manager/Auditor | Start manual check or API/vendor check; record review count and new review notes. | Monthly recap has review outcome data. |
| Monthly recap sent | Manager | Generate simple summary and email/client-page update. | Client sees what went out, what came in, and what is needed. |
| Low-review coaching | Manager/Coach | If review count is below goal, page shows simple owner tips. | Client gets practical next action, not internal tooling detail. |
| QA and proof | Auditor | Check sends, links, suppressions, GBP link, and summary accuracy. | Client can be marked live/healthy. |

## Review Automation Status Loop

Manager should not ask Mike to babysit review jobs.

Current v1 loop:

1. Client uploads customers at `/client/[slug]/customers`.
2. GMF stores the full packet in Redis if configured.
3. Slack receives only a short summary.
4. Client feedback lands at `/review/[slug]`.
5. Customer unsubscribe requests land at `/review/[slug]/unsubscribe`.
6. Sender/GHL bridge can log send events to `/api/review-automation/send-log`.
7. Manager/System can check `/api/review-automation/followups/due?client=[slug]` for follow-up candidates.
8. Sender/System can check `/api/review-automation/send-candidates?client=[slug]` before any send.
9. Happy feedback routes to Google only after the verified Google review link is saved.
10. Manager/System can check `/api/review-automation/status?client=[slug]` with an internal token.

What this gives Mike:

- Customer uploads happened or did not happen.
- Feedback came in or did not come in.
- Counts and summaries.
- No private customer list dumped into Slack.

Still needed before removing GHL from Review Automation sending:

- Verified Google review link for each client.
- Monthly recap.

## GHL-Free Cost View For Review Automation

Assumptions for a 50-client base Review Automation scenario:

- Each client sends 50-300 review request emails/month.
- Base plan uses email, not SMS.
- SMS is a paid add-on only because A2P/10DLC is required for automated US business texting.
- AI reply drafting is upgrade-only.
- Heatmaps/rankings are upgrade-only.
- Clients do not log into GHL.

Likely monthly platform cost without GHL:

| Cost bucket | Rough expectation |
| --- | --- |
| Database/app storage | Low; likely one paid database tier is enough early. |
| Email sending | Low; 50 clients x 300 emails = 15,000 emails/month, still inexpensive with most email APIs. |
| File uploads | Low if only CSV/logo files. |
| AI usage | Near zero for base plan; usage-based for upgrades. |
| SMS | Zero for base plan. Usage-based only for AI Visibility or higher plan. |
| Heatmaps | Zero for base plan. Per-report/vendor cost only when sold. |

Business conclusion:

- GHL is convenient, but not economically required for base Review Automation.
- The hard parts are not expensive software; they are workflow reliability, deliverability, suppression, proof, and GBP/review tracking.
- Build GMF Review Automation around those jobs first.

## Known GHL Cost Points

As of 2026-05-21, based on HighLevel official docs:

| Item | GHL cost | Notes |
| --- | ---: | --- |
| Starter plan | $97/mo | Best for GMF/pilot use if location limit is enough. |
| Unlimited plan | $297/mo | Use only if GMF needs more locations before our backend is ready. |
| Agency Pro/SaaS plan | $497/mo | Not needed unless selling GHL as software/subaccounts. |
| LC Email | $0.675 per 1,000 emails | Cheap enough. Not a major reason to leave GHL. |
| Email validation | $2.50 per 1,000 validations | Use sparingly; NeverBounce/other verifiers may still be better for Reach. |
| Reviews AI pay-per-use | about $0.01 per review response generation | Good for low-volume manual/suggestive replies. |
| AI Employee Unlimited | $97/mo per enabled subaccount | Do not enable by default. 50 clients would be $4,850/mo. |
| SEO powered by Search Atlas | $79/mo per enabled subaccount | Do not enable broadly. 50 clients would be $3,950/mo. |
| Premium Prospecting | $29/mo per enabled subaccount | Avoid unless it clearly beats our own sourcing. |
| Workflow premium actions | $0.01 per execution, with optional bundles | Avoid premium triggers/actions when our own API can do the work. |

External replacement cost references:

| Item | Outside option | Cost signal |
| --- | --- | --- |
| SMS | Twilio directly | US SMS listed at $0.0083 outbound/inbound before carrier fees. |
| Email API | SendGrid/Twilio SendGrid, Postmark, Resend, SES | Usually cheap at GMF volume; choose after deliverability testing. |
| Database/client hub | Supabase/Neon/Postgres | Supabase Pro starts at $25/mo; GMF may already cover website hosting separately. |
| Heatmaps/local rankings | BrightLocal, Local Falcon, Places Scout, outsourced reporting | Buy only for paid AI Visibility clients or monthly reporting clients. |

## GHL Task Map

| Current GHL job | Why GMF uses it | Current cost risk | Build elsewhere? | Recommendation |
| --- | --- | --- | --- | --- |
| Client subaccounts | Separates settings, contacts, reputation, workflows by client. | Starter is limited; Unlimited may be needed if we keep this model. | Yes. Store clients, contacts, jobs, review links, sends, and stats in GMF database. | Replace over time. Do not make subaccounts the client product. |
| Contact database | Stores leads/customers, tags, DND, history. | Low direct cost, but locks us into GHL workflows. | Yes. Build GMF contacts table with tags, status, consent, DND, source, and client ID. | Replace for Review Automation first. |
| Email review requests | Sends review request emails. | LC Email is cheap. Main risk is dependency and workflow complexity. | Yes, later. Use an email API with templates, unsubscribe handling, logs, and retries only when needed. | Keep GHL $97 bridge first. Build GMF sender only when deliverability/logging or cancellation requires it. |
| SMS review requests | Upgrade feature, not base Review Automation. | SMS usage plus compliance/A2P complexity. | Yes, but needs Twilio, opt-out handling, A2P, logs. | Delay. Add only for higher-priced plans. |
| Review link storage | Stores and injects Google review links. | Low. | Yes. Store per client in GMF. | Replace immediately in GMF client hub. |
| Google Business Profile connection | Pulls/replies to reviews through reputation tools. | Valuable, but tied to subaccount model. | Possibly. Use Google Business Profile APIs where available and/or manual first. | Research/build carefully. This is the hardest replacement piece. |
| Reputation/review dashboard | Shows review count, requests, responses, status. | Low direct cost, but clients will not use GHL dashboard. | Yes. This belongs on the GMF client page. | Replace. Already started with client hub. |
| Reviews AI suggestive replies | Drafts review replies. | Pay-per-use is cheap; AI Employee $97/subaccount is expensive. | Yes. Use OpenAI/Gemini to draft replies with approval gates. | Replace. Do not enable GHL AI Employee by default. |
| Reviews AI auto-pilot | Auto-replies to reviews. | Brand and cost risk. | Yes, but should still require approval at first. | Do not sell autopilot until manual approval flow works. |
| Review widget | Embeds reviews on website. | Low value unless included in package. | Yes. Build simple GMF widget or use Google embeds/manual highlights. | Replace later. Not urgent. |
| Reach cold email contact import | Imports verified cold prospects into GHL. | Low platform cost, but workflow lock-in. | Yes. Build GMF campaign database and sender integration. | Keep short term. Replace after Review Automation core. |
| Reach drip workflows | Sends cold emails, waits, stops on replies. | GHL does this well today. | Yes, but requires careful unsubscribe, reply detection, suppression, and warmup logic. | Keep on GHL $97 for now unless cost, reporting, or deliverability blocks us. Replace later with Smartlead/Instantly only if needed. |
| Reach reply routing | Tags warm replies, routes report/book requests. | Low cost but workflow complexity. | Yes. Use inbound email parser/webhook + GMF routing. | Replace after first real campaign proof. |
| Email campaign stats | Reads GHL email stats for morning brief. | Low. | Yes. Email providers expose events/stats. | Replace when email sending moves off GHL. |
| Report flow/opportunities | Website adds contacts/tags; GHL workflows deliver report and track opportunity. | Low to medium; premium webhook actions can add cost. | Yes. GMF already owns website/API. Store report request state in GMF. | Replace. GHL can remain temporary tracker. |
| Calendar booking | Booking link/calendar routing. | Low. | Yes, later. Use Calendly with Google Calendar only if GHL $97 booking is not good enough. | Keep GHL booking short term if it works. Do not buy Calendly yet. |
| Conversations/inbox | Central reply inbox. | Useful if all channels live in GHL. | Partly. Use email inbox + Slack summaries first. | Keep only while using GHL sending. |
| Missed-call/Relay phone flows | Possible future Relay product. | Phone/SMS usage and AI can add up. | Yes with Twilio, but operationally more sensitive. | Keep separate from Review Automation decision. |
| Heatmaps/local SEO | AI Visibility reports and sales proof. | Search Atlas at $79/subaccount becomes too expensive at 50 clients. | Yes. Use external reports only for paid scans or monthly clients. | Do not keep GHL for heatmaps. Outsource or replace. |
| Online listings | Citation/listing service. | $30/mo if enabled. | Yes, via BrightLocal/Whitespark/manual VA process. | Do not enable broadly. Sell separately. |
| Premium prospecting | Prospecting reports, widgets, audits. | $29/subaccount. | Yes. GMF discovery pipeline already exists. | Avoid. |

## 50 Client Scenarios

### Scenario A: Keep GHL as backend for 50 clients

Likely monthly cost:

- $297/mo Unlimited base plan, or $497/mo if SaaS/rebilling is used.
- Email usage is small.
- Reviews AI pay-per-use can stay tiny if only drafting occasional replies.
- Do not enable AI Employee Unlimited by default.
- Do not enable Search Atlas/SEO heatmaps by default.

Good:

- Fastest path to support 50 clients if workflows are already solid.
- GHL already handles many operational edges.

Bad:

- GMF becomes dependent on GHL subaccounts and workflows.
- Client pages become a front-end over a hidden GHL system.
- Add-ons can explode cost if enabled per client.

Verdict:

- Acceptable bridge.
- Not the long-term target.

### Scenario B: Remove GHL completely before 50 clients

Likely monthly platform cost:

- Database/app: about $25-$100+/mo depending on stack and usage.
- Email API: likely low at review-request volume.
- SMS: usage-based if GMF sells SMS review requests.
- AI reply drafts: usage-based and likely low if using OpenAI/Gemini directly.
- Heatmaps: outsourced or bought only when needed.

Good:

- GMF owns the product.
- Client experience stays on GMF pages.
- Cleaner margins at 50+ clients.

Bad:

- We must build the workflow engine, logs, suppression, delivery proof, reply handling, Google review data, approvals, and alerts.
- Biggest risk is Google Business Profile review sync/reply capability.

Verdict:

- Best long-term.
- Do not cut over until 3-5 clients run successfully for 30 days.

### Scenario C: Hybrid

Use GHL only as a temporary backend while GMF owns the client page, intake, status, and reporting.

Good:

- Lowest risk right now.
- Lets GMF sell while building.
- Lets agents learn the process with real client data.

Bad:

- Some double-entry until replacement is complete.

Verdict:

- Recommended.

### Scenario D: Cheapest $97 Bridge

Use GHL $97 for booking, current Reach drips, current Review Automation email
sends, and email stats while GMF owns client pages, intake, private feedback,
customer upload, and reporting.

Good:

- avoids Calendly, Smartlead/Instantly, and separate email sender cost for now
- keeps active campaigns moving
- lets GMF keep building without rushing the cutover

Bad:

- still depends on GHL for some live sending and booking
- not enough for many separate client subaccounts
- reporting/API limits may still force replacement later

Verdict:

- Best immediate cost-control move.
- Replace only the piece that breaks or blocks growth.

## Replacement Build Plan

### Phase 1: GMF Review Core

Goal: replace enough GHL work that Review Automation can run from GMF.

Build:

- Client record
- Client page
- Customer/job upload
- Google review link storage
- Do-not-contact list
- Review request email template
- Email send log
- Weekly review goal/status
- Manager alert when reviews are low
- Manual approval before first live send
- Simple morning/client summary

Keep GHL for:

- Existing cold email Reach workflows
- Temporary review backend if needed
- Existing email stats until GMF sender is live
- Calendars/booking if $97 keeps them working

### Phase 2: GMF Review Automation Sender

Build:

- Email provider integration
- Unsubscribe handling
- Bounce/event handling
- Customer suppression rules
- Send windows by timezone
- Retry/follow-up rules
- Owner/client visible logs
- Slack/Manager exception alerts

Cutover test:

- GMF runs itself first.
- Then 1 pilot client.
- Then 3-5 clients for 30 days.

### Phase 3: GMF Review Intelligence

Build:

- Pull or enter new Google reviews
- AI draft responses
- Owner approval flow
- Approved public reply process
- Review trends and low-review coaching
- Client voice profile
- Trust levels for graduated automation
- Safe 5-star auto-replies after approval history proves the voice

Rule:

- Do not auto-publish replies until manual approval proves safe.
- Never auto-publish 1-4 star replies or reviews involving refunds, legal, safety, medical, discrimination, harassment, staff accusations, threats, or sarcasm.
- Position the system as "autopilot for praise, human judgment for problems."

### Phase 4: Replace Reach GHL Dependency

Build:

- Campaign contact table
- Suppression/unsubscribe table
- Cold email provider integration
- Drip scheduler
- Reply parser
- Warm reply routing
- Report/book intent classification
- Stats and Manager brief

Keep GHL until:

- Drip stop-on-reply is proven.
- Unsubscribe is proven.
- Deliverability is acceptable.
- Reply routing is proven.
- Or until GHL $97 cannot support the active campaign workflow.

### Phase 5: Replace GHL Reporting/Heatmap Dependency

Build or outsource:

- One-time heatmap/vendor report generation
- AI Visibility report storage
- Competitor snapshot
- Client page upsell preview

Rule:

- Do not pay $79/client/mo for Search Atlas unless that client is paying for a plan that covers it.

## Decision Rules

Downgrade to $97:

- Done by Mike on 2026-05-21.
- Watch for broken booking, workflows, stats, API access, or current drips.
- Do not add new GHL-dependent services.

Move to $297 when:

- GMF needs more GHL-backed locations before the GMF replacement is ready.
- The added client revenue clearly covers the $200/mo difference.

Stay away from $497 unless:

- GMF sells GHL as a client software portal.
- GMF needs marked-up rebilling inside GHL.
- GMF needs SaaS Mode as the product.

Enable AI Employee Unlimited only when:

- The client pays for it.
- Their expected usage would exceed pay-per-use.
- Mike manually approves the feature.

Enable SEO/Search Atlas only when:

- The client pays for AI Visibility or a local SEO plan that covers it.
- GMF has a reporting reason that cannot be handled cheaper elsewhere.

## Immediate Action List

1. Systems Director checks current GHL plan and all enabled add-ons.
2. GHL Expert lists which subaccounts/locations exist and what each one is used for.
3. GHL Expert confirms whether any live workflow requires $297 or $497 features.
4. Website/Codex scopes GMF Review Core tables and API routes.
5. Manager records $97 downgrade done.
6. GHL Expert and Systems Director run post-downgrade smoke checks: booking, workflows, contacts, stats, API access, and current drips.
7. Auditor creates a monthly GHL cost report: base plan, wallet usage, AI, SEO, phone, email, validation, premium workflow actions.
8. Do not buy Calendly, Smartlead/Instantly, or a separate email sender until a specific blocker appears.

Repeatable check:

```bash
npm run ghl:smoke-97
```

This gives Manager one pass/watch/blocker report for the $97 bridge.

Latest result:

- 2026-05-22: pass. The checked GHL bridge surfaces still worked after the
  downgrade. Keep GHL at $97 while GMF Review Automation and Reach replacements
  are tested.

Review storage check:

```bash
npm run review:storage-check
```

This confirms whether the required Upstash Redis env vars are present locally
and in Vercel without printing secret values.

## Sources

- HighLevel Pricing Guide: https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide
- HighLevel Reviews AI pricing/modes: https://help.gohighlevel.com/support/solutions/articles/155000001074-maximizing-customer-engagement-with-reviews-ai-a-guide-to-suggestive-and-auto-pilot-modes
- HighLevel pricing page: https://www.gohighlevel.com/pricing
- Twilio US SMS pricing: https://www.twilio.com/en-us/sms/pricing/us
- SendGrid pricing: https://sendgrid.com/en-us/pricing
- Supabase pricing: https://supabase.com/pricing
