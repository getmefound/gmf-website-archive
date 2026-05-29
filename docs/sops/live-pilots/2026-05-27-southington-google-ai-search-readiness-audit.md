# Southington Lawn Service LLC Google AI Search Readiness Audit

Status: ready for Auditor review
Created: 2026-05-27
Owner agent: Profile Manager / Reporter
Reviewer: Auditor
Client/system: Southington Lawn Service LLC
Related SOPs: SOP 065, SOP 071, SOP 072, SOP 073, SOP 086, SOP 098, SOP 168

## Scope

This audit checks whether Southington Lawn Service LLC has the public signals Google Search and AI-powered search experiences can understand. It does not claim rankings, traffic, AI Overview inclusion, or lead outcomes.

No public Google Business Profile edit, site edit, review request, or client-facing send was performed.

## Official Guidance Used

- Google Search Central AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central fundamentals: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Business Profile help, edit business info: https://support.google.com/business/answer/3039617
- Google Business Profile help, service-area businesses: https://support.google.com/business/answer/9157481

Operating interpretation: Google AI/search readiness starts with crawlable, helpful, consistent, accurate public information. For GMF, the safe work is improving business facts, service/location clarity, structured public proof, review paths, and consistency. GMF must not promise rankings or AI placement.

## Public Inputs Used

- Baseline report: `docs/sops/live-pilots/2026-05-27-southington-baseline-visibility-report.md`
- Intake: `docs/sops/live-pilots/FRIEND_TEST_CLIENT_INTAKE.md`
- Yardbook quote page: https://www.yardbook.com/new_quote/0716e8aec7d1da94dd809a6fc87fbeb29e357615
- Yahoo Local listing: https://local.yahoo.com/info-163422658-southington-lawn-service-southington
- Google search candidate: https://www.google.com/search?q=southington+lawn+service
- Google Maps search candidate: https://www.google.com/maps/search/?api=1&query=Southington%20Lawn%20Service%20LLC%20Southington%20CT
- Client-originated Gmail signatures from Bill Leifert with business contact facts and review URL
- Tested Google review URL: https://g.page/r/CYMV7n4MnId_EB0/review
- Review-link place ID: `ChIJxypnrEz5KkYRgxXufgych38`

## Readiness Scorecard

| Signal | Status | Evidence | Risk | Recommended Work |
|---|---|---|---|---|
| Crawlable owned website | Missing / unknown | No owned domain confirmed. Yardbook quote page exists, but ownership/control and crawl strategy are unknown. | AI/search systems may only see third-party fragments. | Confirm owned site/domain or decide whether a lightweight GMF-hosted service page is needed. |
| GBP fact completeness | Partial | Google local/search profile appears to exist, but Manager access, exact profile URL, category, hours, review count, and review link are not verified. | Profile may be incomplete or inconsistent. | Verify profile access, category, services, hours, phone, website, service area, review link. |
| NAP consistency | Partial | Phone/location appear in public source; exact address/service-area display not confirmed. | Inconsistent address or phone can weaken trust. | Confirm phone, address visibility rule, service area, and website before edits. |
| Service specificity | Fair | Quote page lists concrete lawn services. | Services may not be reflected cleanly in GBP/site. | Draft GBP service list and service-page/section recommendations. |
| Location clarity | Fair | Southington, CT 06489 visible publicly. | Service radius and nearby towns are unknown. | Confirm service areas and priority towns. |
| Helpful proof content | Weak | Quote page has service options, but no confirmed owned proof content, project examples, FAQ, photos, or before/after assets. | AI/search has limited evidence for local answers. | Request/collect photos, service descriptions, FAQs, seasonal service notes, and project proof after approval. |
| Reviews and freshness | Partial | Review URL is captured and redirect-tested, but review count/rating/recent reviews are not verified from the profile panel. | Cannot assess trust/freshness yet. | Match the captured review link/place ID to the authenticated profile, then capture review count/rating. |
| Structured data/schema | Unknown | No owned site confirmed, so LocalBusiness schema cannot be assessed. | Missing schema may reduce machine-readable clarity if there is a site. | If owned/hosted page exists, recommend LocalBusiness/Service schema and consistent NAP. |
| Merchant/agentic commerce relevance | Low for now | Lawn service is appointment/quote based, not standard product checkout. | UCP/Merchant Center likely not immediate priority. | Watch only; do not sell agentic checkout readiness as core need. |

## Recommended AI/Search Readiness Work

1. Confirm exact GBP profile, Manager access, and account alias through authenticated read-only access.
2. Confirm whether the business has an owned website/domain.
3. Confirm full weekly hours and service-area display rule.
4. Draft a clean service list for GBP and future website/service page use.
5. Match captured review link/place ID and capture review count/rating for baseline proof.
6. Draft a simple local service proof plan: service descriptions, seasonal FAQs, before/after photos, service areas, and finished-job examples.
7. If there is no owned site, recommend a lightweight GMF-hosted service page or starter site before making deeper AI/Search claims.

## Claim-Safe Client Language

Safe:

> We checked the public signals Google and AI-powered search can read today. The main opportunity is making the business facts, services, service areas, review path, and proof content more complete and consistent.

Unsafe:

> We can make you rank in AI Overviews.

Unsafe:

> This will guarantee more leads from Google AI.

## Auditor Hold Points

- Do not claim AI Overview, AI Mode, map pack, or ranking gains.
- Do not recommend UCP/agentic checkout as a priority for this client unless a specific booking/payment use case appears.
- Do not edit GBP facts until the exact profile, Manager access, and client approval are confirmed.
- Do not use review count/rating in client-facing material until verified from the live GBP panel.

## Facts Still Needed Before Public Work

These are not owner asks yet. Profile Manager/Account Manager must exhaust authenticated GBP access, Yardbook/client artifacts, public sources, Slack history, and proof files before Manager asks Mike or the client.

- Exact GBP profile URL from inside Google Business Profile
- Whether `admin@getmefound.ai` or `mike@getmefound.ai` has Manager access
- Owned website/domain, if any
- Full weekly hours
- Whether the address should be hidden as a service-area business
- Priority services and service towns
- Approval before public profile edits or live review requests
