# Southington Profile Manager Access And Fact Proof

Status: partial pass; agent-owned verification still open
Created: 2026-05-28
Owner: Profile Manager
Reviewer: Auditor
Client/system: Southington Lawn Service LLC
Related SOPs: SOP 005, SOP 064, SOP 067, SOP 069, SOP 070, SOP 166

## Operating Question

Can Profile Manager verify Southington Google Business Profile facts from existing access without asking Mike?

Current answer: partially. Existing workspace/app access verified several business and review-link facts without Mike. Mike clarified on 2026-05-28 that Bill manually entered `mike@getmefound.ai` himself in the Google Business Profile manager flow. Therefore the missing invite email does not disprove the access path; it only means email is not the proof source. Authenticated Google Business Profile role/access is still not verified from the current Codex tool context because no Google Business Profile API or authenticated browser/session is available through the accessible tools.

Mike is not needed yet. The next step remains agent-owned: Profile Manager/Systems Director must establish or use an authenticated read-only GBP verification path before Manager asks Mike anything else.

## Access Paths Exhausted

| Path | Result | Proof/notes |
|---|---|---|
| Workspace search | No Google Business Profile API client, Google OAuth refresh token, Business Profile API token, or stored browser session found in the repo. | `rg` searches covered Google Business Profile, GBP/GMB, `mybusiness`, `businessprofile`, OAuth, cookies, browser sessions, Playwright, and related terms. |
| Environment key-name check | No GBP/Google OAuth credential names found. | `.env.local` only exposed a matching key name `GHL_GOOGLE_BUSINESS_ID`; no value was printed or stored. |
| Package/dependency check | No `googleapis`, Google Business Profile SDK, Playwright package script, Puppeteer script, or GBP verifier exists in `package.json`. | Package scripts have Monday, Slack/agent, review, Smartlead, GHL, and report tooling only. |
| Gmail connected app | Found client-originated Southington emails with business contact facts and a Google review URL. Did not find Google Business Profile invite emails in the accessible inbox. | Gmail message IDs `19e5f3e8d739c0f0` and `19e5e8548e6902e1`; no invite result for exact Google Business Profile invite searches. |
| Gmail expanded owner-access search | Searched Google Business Profile invite terms, getmefound aliases, `in:anywhere`, and `admin@getmefound.ai`/`mike@getmefound.ai` delivery trails. No Southington GBP invitation was found. A prior `admin@getmefound.ai` delivery failure around mailbox setup was found and treated as a possible routing clue, not proof of current alias failure. | Relevant non-sensitive result: earlier `admin@getmefound.ai` delivery failure existed; no security codes or unrelated personal details recorded. |
| Gmail exact `mike@getmefound.ai` GMB search | Searched `in:anywhere to:mike@getmefound.ai` plus GMB/GBP invitation phrases and Google Business Profile sender patterns. No Southington GMB/GBP invite was found. | Only results to `mike@getmefound.ai` were Google Workspace welcome/setup and Mike's earlier test email. Business Profile sender search only found old unrelated 2021 reports to `4egidio@gmail.com`. |
| Owner correction from Mike | Bill manually entered `mike@getmefound.ai` himself in the Google Business Profile manager flow. | Treat this as the access-source fact. Do not keep treating the missing email invite as evidence against access. |
| Slack history | Confirmed Mike's latest owner answer was the candidate account `mike@getmefound.ai`, followed by the rule that Profile Manager must exhaust access before any further owner ask. | Manager DM channel `D0AU6HJLV41`, 2026-05-27 messages. |
| Public web/source checks | Yardbook quote page is live and confirms service options. | `https://www.yardbook.com/new_quote/0716e8aec7d1da94dd809a6fc87fbeb29e357615` |
| Review-link HTTP check | Google review URL redirects successfully to `search.google.com/local/writereview` with a concrete place ID. | Source review URL: `https://g.page/r/CYMV7n4MnId_EB0/review`; resolved place ID: `ChIJxypnrEz5KkYRgxXufgych38`. |

## Facts Verified Without Mike

| Field | Verified value | Source | Confidence | Notes |
|---|---|---|---|---|
| Business name | Southington Lawn Service LLC | Bill Leifert email signature; Yardbook quote page | High | Matches existing pilot docs. |
| Business contact | Bill Leifert | Bill Leifert email signature | High | Treat as business contact, not necessarily final legal owner field until client-approved. |
| Business phone | `(203) 217-9137` | Bill Leifert email signatures; existing public-source docs | High for current contact fact; client approval still needed before public edits | Signature appears with and without a space. |
| Business emails | `southingtonlawn@gmail.com`; `southingtonservices@gmail.com` | Bill Leifert email signatures | High | `southingtonservices@gmail.com` also appears tied to Yardbook support/Zapier setup. |
| Yardbook quote path | `https://www.yardbook.com/new_quote/0716e8aec7d1da94dd809a6fc87fbeb29e357615` | Yardbook public page | High | Public estimate flow is live. |
| Public service options | Weekly Lawn Maint.; Aeration; Aeration+Overseeding; Dethatching; Fall Cleanup; Spring Cleanup; Other | Yardbook public page | High | Service priority and final GBP wording still need approval before public edits. |
| Google review URL | `https://g.page/r/CYMV7n4MnId_EB0/review` | Bill Leifert email signature | High | Link tested by HTTP redirect. |
| Google write-review place ID | `ChIJxypnrEz5KkYRgxXufgych38` | HTTP redirect from review URL | High | Use for review-link storage and exact-profile matching. |
| Direct write-review URL | `https://search.google.com/local/writereview?placeid=ChIJxypnrEz5KkYRgxXufgych38` | HTTP redirect target | High | Do not send live review requests until consent/send approval exists. |
| Account entered for GBP access | `mike@getmefound.ai` | Mike correction: Bill entered it himself in GBP manager flow | Owner-reported; pending authenticated verification | Missing invite email is not disqualifying. |

## Still Not Verified

| Field | Why not verified yet | Next agent-owned action |
|---|---|---|
| Accepted Manager role for `mike@getmefound.ai` | Bill manually entered the account, but no authenticated GBP dashboard/API/session is available in the current tool context to verify whether the role is accepted, pending, or insufficient. | Profile Manager/Systems Director creates or uses a safe read-only GBP verification path, then captures role proof. |
| Exact clean Google Maps/profile management URL | Public candidate links exist, but private GBP dashboard/profile access is not available. | Match place ID `ChIJxypnrEz5KkYRgxXufgych38` inside GBP/Maps when authenticated access is available. |
| Review count/rating | Review URL confirms the profile target, but count/rating requires live profile panel or authenticated/source-visible page. | Capture from GBP panel or public Maps page once available. |
| Full weekly hours | Existing public clues are partial only. | Pull from GBP if visible; otherwise Account Manager can use client-originated docs/emails/public sources before owner ask. |
| Address/service-area setting | Not available from current sources. | Inspect GBP settings before asking Mike/client. |
| Primary GBP category and service list inside GBP | Yardbook service options are known, but GBP category/services require profile view. | Inspect inside GBP before recommending edits. |
| Owned website/domain | Yardbook quote page and Yardbook Zapier/API context exist; no owned domain confirmed. | Account Manager continues public/source search and Yardbook/client artifact review before owner ask. |

## Decision

| Decision | Value |
|---|---|
| Mike needed now? | Conditional - no additional inbox fact ask is needed, but authenticated GBP verification still needs the separate sign-in/API path already routed by Manager |
| Public edits allowed? | No |
| Live review requests allowed? | No |
| Monday status | Agent Working |
| Auditor status | Hold for authenticated GBP role/profile proof before marking SOP 005 active |

## Next Agent Actions

1. Systems Director uses `docs/sops/live-pilots/2026-05-28-gbp-read-only-verification-path.md` as the access-path plan.
2. Profile Manager uses the review place ID to match the correct profile once authenticated access is available.
3. Profile Manager captures role, clean profile URL, review count/rating, hours, category, services, website, and address/service-area setting.
4. Auditor reviews this proof plus the role/profile proof before SOP 005 can pass.
5. Manager asks Mike only if the authenticated access path fails after Systems Director/Profile Manager exhaust it, or if public edit/client-facing approval is needed.
