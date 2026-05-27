# GMF Post-Prospecting Workflow Draft

Status: draft for Mike approval
Owner: Mike Egidio
Prepared: 2026-05-27
Scope: starts when a prospect leaves prospecting. Prospecting itself is intentionally excluded.

## Executive Decision

The next system GMF needs is not another marketing page. It is the post-prospecting operating layer:

1. A prospect becomes a sales/signup opportunity.
2. Manager classifies the opportunity.
3. Agents build a client readiness record before delivery starts.
4. Mike sees a detailed Mission Control page for the full account path.
5. The client gets a custom dashboard once they pay or enter onboarding.
6. The chosen offer then determines the delivery workflow.

This lets GMF sell a simple offer while agents do a much deeper set of visibility, reputation, compliance, and AI-readiness jobs behind the scenes.

## Research Basis

### What Google Officially Says Matters

Google local ranking is still built around relevance, distance, and prominence. GMF cannot change distance, so agents should repeatedly improve relevance and prominence.

Source:
https://support.google.com/business/answer/7091/improve-your-local-ranking-on-google

Google specifically tells businesses to keep profile information complete and accurate, verify the business, keep hours current, respond to reviews, add photos/videos, and use products where applicable.

Source:
https://support.google.com/business/answer/7091/improve-your-local-ranking-on-google

For AI Overviews and AI Mode, Google says normal SEO fundamentals still matter. It emphasizes crawlability, indexability, useful content, internal links, page experience, textual content, high-quality images/videos, structured data that matches visible text, current Merchant Center data, and current Business Profile data.

Sources:
https://developers.google.com/search/docs/appearance/ai-features
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Google LocalBusiness structured data helps Google understand business hours, departments, reviews where applicable, and other business details. Structured data should be validated and match visible page content.

Source:
https://developers.google.com/search/docs/appearance/structured-data/local-business

Google review guidance allows businesses to ask customers for reviews, but incentives are prohibited. Replies to reviews are public and help build trust.

Source:
https://support.google.com/business/answer/3474122

### What AI/LLM Systems Need

OpenAI says public websites can appear in ChatGPT search if they are discoverable and do not block `OAI-SearchBot`. It also notes ChatGPT referrals can be tracked with `utm_source=chatgpt.com`.

Source:
https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

Anthropic documents separate bots for training, user-directed browsing, and search. Blocking `Claude-SearchBot` or `Claude-User` may reduce visibility in Claude search/user-requested retrieval.

Source:
https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

Perplexity recommends allowing `PerplexityBot` and gives WAF/IP guidance so content can be surfaced in Perplexity search results.

Source:
https://docs.perplexity.ai/docs/resources/perplexity-crawlers

The `llms.txt` proposal is a root-level Markdown file at `/llms.txt` that gives LLMs a curated map of important pages and context. It is a proposal, not a Google ranking requirement. GMF should treat it as a cheap optional agent-readable layer, not the main lever.

Source:
https://llmstxt.org/

Agent-friendly sites are also accessible, semantic sites. Google's web.dev guidance says agents inspect screenshots, HTML, and the accessibility tree, and recommends stable layouts, semantic buttons/links, proper labels, and visible actionable elements.

Source:
https://web.dev/articles/ai-agent-site-ux

### What UCP Means For GMF

Google's Universal Commerce Protocol is aimed at agentic commerce. UCP lets agents, platforms, and businesses interact through a common standard from discovery to checkout and beyond. It is expanding first through shopping, lodging, and food.

Sources:
https://ucp.dev/
https://blog.google/products-and-platforms/products/shopping/ucp-updates/
https://blog.google/products-and-platforms/products/shopping/shopping-updates-google-marketing-live/

GMF implication:

- For most local service businesses, UCP is not an immediate launch requirement.
- For retail, ecommerce, restaurants, lodging, and booking-heavy clients, agents should check Merchant Center, products/services, availability, pricing, return/shipping policies where relevant, feeds, and booking/order paths.
- For all local businesses, GMF should prepare the same underlying facts UCP-style systems need: services, prices/ranges, hours, service areas, availability rules, booking/quote path, cancellation policy, FAQs, and escalation rules.

### Message-Board Pattern

Across Local Search Forum and Reddit/local SEO threads, the recurring practical pattern is:

- categories and services matter a lot
- review velocity and review quality matter
- website and GBP facts must match
- citations/NAP consistency still removes hidden friction
- Google posts usually help freshness/engagement more than direct rank
- photos help trust and engagement even when rank impact is indirect
- AI visibility work is not just an `llms.txt`; it is crawlable, useful, well-structured, entity-consistent content with third-party trust signals
- A2P approval problems often come from mismatched legal name/EIN/domain, weak opt-in proof, missing privacy/terms pages, or sample messages that do not match the use case

Sources:
https://localsearchforum.com/threads/ai-question-curious-thoughts-on-how-we-now-navigate-local-seo-in-the-new-ai-era.63094/
https://localsearchforum.com/threads/ai-usage-for-local-seo.63169/
https://www.reddit.com/r/GoogleMyBusiness/comments/1tk9k5g/whats_the_one_change_you_made_to_a_google/
https://www.reddit.com/r/localseo/comments/1sk1s46/ai_search_visibility/
https://www.reddit.com/r/twilio/comments/1s1onpj/i_built_an_opensource_a2p_10dlc_prescanner_after/
https://www.reddit.com/r/smallbusiness/comments/1rznapo/twilio_is_super_frustrating/

## The Bigger Offer Insight

GMF should not sell "we post once a week" as the real value.

The real value is:

GMF continuously improves the public facts, proof, reputation, structure, and readiness signals that help Google, AI systems, and customers understand, trust, and choose the business.

Because agents run the checks, the service can include more work than a normal agency would manually do at the same price. The client does not need to see every task, but GMF needs the task library internally.

## Post-Prospecting Trigger

This workflow starts from one of these events:

- prospect books a discovery call
- prospect replies positively and asks for pricing
- prospect completes checkout
- prospect manually signs up after a call
- Mike manually tells Manager to create a client opportunity

Prospecting rows stay in the prospecting group. A new post-prospecting record starts here.

## Required Records Created After Prospecting

### 1. Sales Opportunity Record

System of record: Monday `Agents Jobs`, group `02 Sales & Signup`

Required fields:

- prospect/business name
- website
- Google Business Profile URL if known
- owner/contact name
- email
- phone
- source channel
- likely offer
- next action
- human needed yes/no
- proof link

### 2. Client Candidate Folder

System of record: VPS/Drive once the lead is serious enough.

Folder status:

- `candidate` before payment
- upgraded to real `Client ID` after payment

Recommended pattern:

```text
/root/gmf-candidates/YYYY-MM-business-slug/
```

After payment:

```text
/root/gmf-clients/GMF-0001-business-slug/
```

### 3. Visibility Readiness Snapshot

System of record: generated report/proof document.

This is not full delivery. It is the pre-sale/pre-onboarding scan used to decide plan fit.

The snapshot should include:

- website crawl/index status
- Google Business Profile presence
- NAP consistency obvious mismatches
- review count/rating/review recency
- category/service clarity
- major missing trust signals
- LocalBusiness/schema presence
- robots/sitemap/crawler status
- `llms.txt` presence
- AI search answer spot-checks
- top next risk/blocker

### 4. Client Dashboard Shell

System of record: `/client/[slug]`

Created after payment or at serious onboarding stage.

The dashboard should show:

- plan
- onboarding status
- what GMF is doing
- what the client needs to provide
- review/request status
- access status
- compliance status
- proof/report links
- monthly progress once live

### 5. Owner Detail Page

System of record: separate Mission Control page.

Recommended route:

```text
/mike-mc/client-journey
```

Purpose:

Mike can inspect every client from sales handoff through onboarding, launch, recurring work, reports, and upsell without reading raw logs.

## Universal Post-Prospecting Workflow

This happens before the service-specific workflow begins.

### Step 1: Manager Opens Opportunity

Agent: Manager

Input:

- source from prospecting/booked call/checkout/manual owner instruction

Manager does:

- creates Monday item in `02 Sales & Signup`
- names current stage
- assigns likely service fit
- assigns Sales Manager or Client Success
- creates or links proof folder
- records whether Mike is needed

Proof:

- Monday item exists
- next action is clear
- owner is assigned

Mike contact rule:

- do not contact Mike unless pricing, promise, access, or judgment is needed

### Step 2: Sales Manager Qualifies Fit

Agent: Sales Manager

Sales Manager checks:

- business type
- service area
- urgency
- existing Google presence
- owner pain: invisible, stale, few reviews, wrong facts, AI readiness, calls not converting
- likely plan: Get Found, Stay Found, Always Ready
- obvious exclusions: illegal business, reputation crisis beyond scope, client wants guarantees, client wants spam/fake reviews

Output:

- fit status: good fit, maybe, not fit
- likely plan
- one-sentence reason
- questions for call or checkout follow-up

Proof:

- qualification note
- website/GBP links saved

### Step 3: Scout Runs Public Visibility Snapshot

Agent: Scout

Scout checks:

- website live and crawlable
- sitemap/robots basics
- title/meta basics
- Google indexed pages using safe checks
- Google Business Profile found or missing
- public reviews: count, rating, recency, unanswered review sample
- categories/services visible in GBP where possible
- citations/directories visible in quick search
- social/profile consistency if obvious
- competitors if easy to identify
- AI answer spot-checks for brand/service/location

Output:

- public readiness snapshot
- red/yellow/green risk summary
- suggested plan fit

Proof:

- snapshot saved to candidate/client folder
- link added to Monday

### Step 4: Profile Manager Checks Google/Local Fit

Agent: Profile Manager

Profile Manager checks:

- correct GBP likely identified
- duplicate/wrong listings possible
- primary category appears sensible
- service categories/services are thin/missing/confused
- hours/services/website/phone consistency
- photos/logo/activity signals
- public Q&A/posts if available
- review link availability after access

Output:

- GBP readiness note
- access needed list
- profile risk list

Proof:

- profile check saved
- blocker recorded if access is needed

### Step 5: Systems Director Creates Technical Readiness Shell

Agent: Systems Director

Systems Director checks:

- client slug availability
- dashboard shell requirements
- folder path
- Search Console/Analytics access needed
- website tech stack if visible
- robots/sitemap basics
- structured data test path
- `llms.txt`/machine-readable page opportunity
- email/SMS sender requirements
- A2P/10DLC likely requirements if SMS is part of the plan
- Merchant Center/UCP relevance if retail, food, lodging, booking, ecommerce, or inventory matters

Output:

- technical readiness checklist
- access requests needed
- compliance prerequisites

Proof:

- tech readiness note saved
- Monday proof link added

Mike contact rule:

- ask Mike only for credentials, tool spend, domain/security decisions, or approval to create paid tooling

### Step 6: Client Success Prepares Client-Facing Next Step

Agent: Client Success

Client Success prepares:

- plain-English plan recommendation
- what GMF will do first
- what the client needs to provide
- timeline expectation
- dashboard link if already created
- call/checkout follow-up email

Output:

- client-safe email/update draft

Proof:

- draft saved
- Manager review pending or complete

### Step 7: Auditor Reviews Claims And Risk

Agent: Auditor

Auditor checks:

- no ranking/revenue/review-count guarantees
- no fake review/gated review strategy
- no SMS promise before compliance
- no live AI voice promise before approval
- no unsupported AI visibility claim
- no public edit without access/approval
- source links and facts are reasonable

Output:

- pass
- correction needed
- hold for Mike

Proof:

- audit note

### Step 8: Manager Sends Or Assigns Final Pre-Onboarding Action

Agent: Manager

Manager decides:

- ready to sell/checkout
- ready to onboard after payment
- needs client info
- needs Mike
- not fit

Manager sends:

- Slack only if human needed or important job sent
- Monday status update always
- client email/update only after review

Proof:

- final action recorded
- next workflow selected

## What Gets Created After Payment

Once payment or signed approval is confirmed:

1. Client ID
2. client folder
3. client dashboard
4. Monday onboarding item in `03 Client Onboarding`
5. plan-specific workflow item
6. proof/report folder
7. dashboard access link
8. first client email/update

Recommended Client ID:

```text
GMF-0001
```

Recommended client folder:

```text
/root/gmf-clients/GMF-0001-business-slug/
```

Recommended subfolders:

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

## Universal Visibility Job Library

These are jobs GMF agents can do/check/update/fix. Plan-specific packaging comes next.

### Business Facts

- verify legal/public business name
- verify DBA/brand name
- verify address or service area
- verify phone
- verify website
- verify email/contact path
- verify hours and special hours
- verify services
- verify service areas
- verify pricing/ranges if client wants public pricing
- verify booking/quote path
- verify cancellation/policy facts where relevant

### Google Business Profile

- find correct GBP
- check verification status
- check manager access
- check owner/client access blocker
- check primary category
- check secondary categories
- check services list
- check description
- check hours and special hours
- check website and appointment links
- check phone consistency
- check photos/logo
- check posts
- check Q&A
- check products/menu/bookings where relevant
- check duplicate/suspicious listings
- capture review link

### Website And SEO Basics

- check website live
- check HTTPS
- check indexability
- check robots.txt
- check sitemap
- check page titles/descriptions
- check LocalBusiness structured data
- check Organization structured data
- check FAQ/service content clarity
- check internal links
- check location/service pages
- check NAP consistency on site
- check page speed basics
- check mobile usability basics
- check accessibility/agent-friendly structure
- check contact forms/click-to-call
- check analytics/search console access

### AI/LLM Readiness

- check `llms.txt` presence
- draft/update `llms.txt` when useful
- optional `/llm.txt` redirect or duplicate for common typo
- check if important pages are text-readable
- check OpenAI/Claude/Perplexity crawler access where client wants AI visibility
- check AI answer spot tests for brand/service/location
- check entity consistency across site, GBP, directories, and social profiles
- check whether service explanations are specific enough for answer engines
- check if pages have unique, experience-based proof instead of generic commodity copy
- check agent-friendly HTML/accessibility tree basics

### Reviews And Reputation

- capture Google review link
- check review count
- check rating
- check review recency
- check review velocity
- check unanswered reviews
- draft review replies
- flag sensitive reviews
- monitor new reviews
- create review request templates
- clean customer list
- suppress do-not-contact
- send email review requests after approval
- send SMS review requests only after compliance
- track request/response/feedback proof
- produce monthly review summary

### A2P / SMS Compliance

- collect legal business name
- collect EIN/business registration info when needed
- check public website matches brand
- check privacy policy URL
- check terms URL
- check opt-in language
- check consent storage path
- check STOP/HELP handling
- write sample messages
- align sample messages with use case
- submit or assist A2P/10DLC registration
- track campaign status
- block SMS sends until ready

Twilio source for A2P requirements:
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/collect-business-info
https://help.twilio.com/articles/11847054539547
https://www.twilio.com/en-us/changelog/a2p-10dlc-campaign-registration-will-require-privacy-policy-and-

### Merchant / Booking / UCP Readiness

Use when client type warrants it.

- determine if UCP/Merchant Center applies
- check Google Merchant Center access
- check product feed
- check product structured data
- check price/availability consistency
- check shipping details
- check return policy structured data
- check booking/order/quote path
- check menu/products/services where relevant
- check conversational product/service attributes where available
- record if not applicable

### Client Dashboard

- create client dashboard shell
- add plan
- add status
- add next client action
- add access checklist
- add review/request status
- add proof links
- add monthly recap area
- add upgrade preview
- add client upload path
- add compliance status
- add report history

### Owner/Mission Control

- create owner detail row
- show stage
- show agent chain
- show blockers
- show proof completeness
- show dashboard status
- show plan fit
- show risk
- show next action
- show last client update
- show next recurring run
- show upgrade path

## Client Dashboard Recommendation

Every paid client should eventually have a custom dashboard.

Public/client-facing route:

```text
/client/[client-slug]
```

Client dashboard sections:

1. Current plan and status
2. What GMF is doing now
3. What we need from client
4. Google access/profile status
5. Review request status
6. A2P/SMS readiness if applicable
7. AI visibility/readiness status if applicable
8. Proof and monthly reports
9. Upload area for customer lists/assets
10. Upgrade preview

Owner-only route:

```text
/mike-mc/client-journey
```

Owner page sections:

1. All active opportunities after prospecting
2. Newly paid clients waiting onboarding
3. Onboarding blockers
4. Agent chain per client
5. Proof required vs proof complete
6. Plan-specific workflow status
7. Client dashboard link/status
8. Last client update
9. Risk and human-needed queue
10. Upsell/readiness opportunities

## Proposed Mission Control Page Detail

Page name:

```text
Client Journey
```

Route:

```text
/mike-mc/client-journey
```

Primary table:

| Client/Prospect | Stage | Plan Fit | Manager Decision | Agent Owner | Reviewer | Human Needed | Dashboard | Proof | Last Update |
|---|---|---|---|---|---|---|---|---|---|

Stages:

- Sales Opportunity
- Payment Pending
- Paid / Needs Client ID
- Onboarding
- Access Waiting
- Launching
- Live
- Recurring
- At Risk
- Upgrade Candidate

Detail drawer per client:

- timeline
- agent handoff chain
- access checklist
- visibility snapshot
- A2P/SMS checklist
- dashboard preview
- plan-specific jobs
- client messages
- audit notes

## Human Needed Rules

Manager should only contact Mike when:

- pricing or promise is unclear
- payment/refund/billing issue exists
- credentials/access can only be provided by Mike
- tool spend is needed
- client asks for custom scope
- public profile edit is risky
- first live campaign needs approval
- SMS compliance is incomplete
- review reply/live voice behavior needs approval
- legal/reputation/safety issue exists

Everything else should be done by agents and made visible in Monday/Mission Control.

## First Implementation Recommendation

Do not jump straight into every service workflow.

Build this order:

1. Finalize this post-prospecting workflow.
2. Add/adjust Monday fields/groups only if needed.
3. Build `/mike-mc/client-journey` as owner detail page.
4. Expand client dashboard fields.
5. Define plan-specific workflows for Get Found.
6. Define plan-specific workflows for Stay Found.
7. Define plan-specific workflows for Always Ready.

That order gives GMF a real operating spine before the plan details sprawl.

## Approval Questions For Mike

1. Should every paying client get a dashboard by default?
2. Should serious unpaid opportunities get a private candidate folder before payment, or only after payment?
3. Should SMS/A2P be considered part of Stay Found by default, but blocked until compliant?
4. Should `/mike-mc/client-journey` be the separate owner page for this flow?
5. Should UCP/Merchant Center be a conditional readiness job only for retail, food, lodging, ecommerce, and booking-heavy clients?

## Recommended Answer

Recommended default:

- yes, every paying client gets a dashboard
- candidate folders can be created for serious opportunities, but Client IDs wait for payment
- SMS/A2P is part of Stay Found capability, blocked until compliant
- `/mike-mc/client-journey` is the owner page
- UCP/Merchant Center is conditional, not universal

This keeps GMF powerful without overpromising.
