# Southington Profile Manager GBP Access Task

Status: Waiting on Authenticated Access Path - access-gap rescue timer active
Owner: Profile Manager
Reviewer: Auditor
Client/system: Southington Lawn Service LLC
Created: 2026-05-27
Last updated: 2026-05-28

Queue-control rescue: `docs/sops/live-pilots/2026-05-28-southington-gbp-access-gap-stuck-rescue.md`

## Operating Rule

Do not ask Mike for Southington GBP facts until Profile Manager has exhausted existing GBP access and documented what can and cannot be verified.

Mike clarified that Profile Manager has access to Southington Lawn Service LLC. Therefore the next action belongs to Profile Manager, not Mike.

## Current Account Candidate

`mike@getmefound.ai`

Original context: the friend may have added/displayed `admin@getmefound.ai`, but Mike answered the Manager Slack ask with `Mike@getmefound.ai`.

Owner correction on 2026-05-28: Bill entered `mike@getmefound.ai` himself in the Google Business Profile manager flow. The missing Gmail invite is not evidence that Bill did not enter the account. The remaining proof gap is authenticated verification of role/access state for `mike@getmefound.ai`.

## 2026-05-28 Read-Only Access Check

Profile Manager/Codex exhausted the current safe read-only paths available in this workspace and connected apps.

Proof file: `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md`

| Source checked | Result |
|---|---|
| Repo/package/env search | No Google Business Profile API client, Google OAuth credential, authenticated browser session, or GBP verifier found. No secrets were printed. |
| Gmail connected app | Found client-originated business contact facts and Google review URL; no Google Business Profile invite email found in accessible inbox. Missing invite email is not treated as disproving access because Bill manually entered `mike@getmefound.ai`. |
| Slack history | Confirmed the current account candidate is `mike@getmefound.ai` and that Profile Manager must exhaust access before any owner ask. |
| Yardbook/public web | Confirmed quote page and service list. |
| HTTP review-link test | `https://g.page/r/CYMV7n4MnId_EB0/review` redirects to a Google write-review URL with place ID `ChIJxypnrEz5KkYRgxXufgych38`. |

Current decision: Mike is not needed yet. The authenticated Manager-role check is still agent-owned; Systems Director/Profile Manager must establish or use a safe read-only GBP verification path before Manager asks Mike for more.

## 2026-05-28 Queue-Control Rescue

This item is now classified under SOP 181/SOP 183:

| Field | Value |
|---|---|
| Waiting state | `Waiting on Authenticated Access Path` |
| Stuck classification | `access_gap` |
| Current owner | Systems Director / Profile Manager |
| Next owner | Auditor after authenticated proof is captured |
| Unlock proof | Authenticated read-only role/profile proof matched to place ID `ChIJxypnrEz5KkYRgxXufgych38` |
| Expected receive | 2026-05-29 12:00 PM ET |
| Escalate/check by | 2026-05-29 3:00 PM ET |
| Missed timer action | Document Path A/Path B failure state, then Manager decides whether a precise Mike DM is justified |

## Facts Captured Without Mike

| Field | Current value | Source/status |
|---|---|---|
| Business name | Southington Lawn Service LLC | Bill Leifert email signature and Yardbook |
| Business contact | Bill Leifert | Client-originated email signature |
| Business phone | `(203) 217-9137` | Client-originated email signature; existing public source |
| Business emails | `southingtonlawn@gmail.com`; `southingtonservices@gmail.com` | Client-originated email signatures |
| Yardbook quote path | `https://www.yardbook.com/new_quote/0716e8aec7d1da94dd809a6fc87fbeb29e357615` | Public page |
| Google review URL | `https://g.page/r/CYMV7n4MnId_EB0/review` | Client-originated email signature; redirect tested |
| Google place ID from review link | `ChIJxypnrEz5KkYRgxXufgych38` | HTTP redirect target |
| Direct write-review URL | `https://search.google.com/local/writereview?placeid=ChIJxypnrEz5KkYRgxXufgych38` | HTTP redirect target |

## Profile Manager Must Verify

- Exact Southington Lawn Service LLC GBP/profile.
- Whether manually entered `mike@getmefound.ai` has accepted access.
- Role shown for the account.
- Clean profile or Maps URL.
- Review count and rating.
- Review link. Current review URL is captured and redirect-tested; still match it against the authenticated profile.
- Public phone shown in GBP.
- Website shown in GBP, or proof there is no owned website connected.
- Hours shown in GBP.
- Address or service-area setting.
- Primary category.
- Services/categories listed in GBP.
- Any photos/posts/profile completeness notes that matter for the Get Found audit.

## Proof To Capture

- Verification note with date.
- Clean profile URL.
- Role/access confirmation note.
- Review baseline.
- Review link test result.
- Fact table for hours, website, phone, address/service area, category, and services.

Do not store passwords or sensitive personal Google account screenshots.

## Mike Can Be Asked Only If

- Profile Manager cannot access the profile.
- The profile shown is the wrong business.
- The account role is missing, pending, or insufficient.
- Public edit approval is needed.
- Client-facing risk, reputation risk, billing/spend, legal/privacy, or Google ownership risk appears.

## Next Handoff

After Profile Manager completes the access check:

1. Auditor reviews proof.
2. Account Manager fills any remaining intake fields from verified facts.
3. Profile Manager captures and tests the review link.
4. Manager asks Mike only for public edit approval or unresolved access failure.

## Current Next Action

Systems Director/Profile Manager owns the access-path gap: create or use a safe authenticated GBP verification method, then match the profile to place ID `ChIJxypnrEz5KkYRgxXufgych38` and capture role/profile proof. Do not ask Mike until that path is exhausted.
