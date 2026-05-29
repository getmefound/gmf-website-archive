# GBP Read-Only Verification Path

Status: Systems Director draft
Created: 2026-05-28
Owner: Systems Director
Reviewer: Auditor
Applies to: Southington Lawn Service LLC pilot and future GMF client GBP checks

## Purpose

Create a repeatable way for Profile Manager to verify Google Business Profile access, exact profile identity, and core facts without asking Mike to hunt through Google screens.

This is a verification path only. It does not approve public profile edits, review requests, ownership transfers, or automated posting.

## Current Southington State

Known:

- Candidate account: `mike@getmefound.ai`
- Owner correction: Bill manually entered `mike@getmefound.ai` himself in the GBP manager flow; do not treat the missing Gmail invite as disproving this path
- Captured review URL: `https://g.page/r/CYMV7n4MnId_EB0/review`
- Captured place ID: `ChIJxypnrEz5KkYRgxXufgych38`
- Proof file: `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md`

Still open:

- accepted Manager role for `mike@getmefound.ai` or `admin@getmefound.ai`
- exact profile/dashboard URL
- review count/rating
- hours
- address/service-area setting
- primary category and services shown in GBP
- website field

Mike is not needed yet. Systems Director/Profile Manager must first establish the authenticated read-only path below.

Queue-control rescue now active: `docs/sops/live-pilots/2026-05-28-southington-gbp-access-gap-stuck-rescue.md`

| Field | Value |
|---|---|
| Waiting state | `Waiting on Authenticated Access Path` |
| Current owner | Systems Director / Profile Manager |
| Next owner | Auditor after authenticated proof |
| Expected receive | 2026-05-29 12:00 PM ET |
| Escalate/check by | 2026-05-29 3:00 PM ET |
| Missed timer action | Document Path A/Path B failure state and route owner-needed Slack DM only if required |

## Official Google Constraints

Google's Business Profile APIs require:

- a Google Account
- a Google Cloud project
- an Organization account for third-party/partner API access
- an API access request and approval before the APIs can be enabled
- OAuth 2.0 authorization for API requests
- explicit business owner/manager consent for third-party access

Relevant official sources:

- Prerequisites: https://developers.google.com/my-business/content/prereqs
- OAuth overview: https://developers.google.com/my-business/content/oauth-overview
- OAuth setup: https://developers.google.com/my-business/content/oauth-setup
- Accounts: https://developers.google.com/my-business/content/accounts
- Location data: https://developers.google.com/my-business/content/location-data
- API use cases: https://support.google.com/business/answer/6333473

Key operational interpretation:

- GMF should not expect private GBP facts from the repo unless a Google OAuth/API path has been set up.
- API access is not just an API key. It requires Google approval and OAuth consent.
- Google location data can be listed for locations the authenticated user/account can access.
- `metadata.place_id` can be used to match the authenticated location to the public/review-link place ID.
- Profile changes made through the APIs can take effect immediately, so any GMF verifier must default to read-only requests.

## Path A - API Read-Only Verifier

Best long-term path.

Required setup:

1. Google Cloud project approved for Business Profile APIs.
2. OAuth consent configured for GMF.
3. OAuth credential flow for the GMF management account or authorized client/manager account.
4. Stored secrets in environment only, never in docs:
   - `GOOGLE_GBP_CLIENT_ID`
   - `GOOGLE_GBP_CLIENT_SECRET`
   - `GOOGLE_GBP_REFRESH_TOKEN`
   - `GOOGLE_GBP_ACCOUNT_HINT`
5. Read-only verifier script that:
   - obtains an OAuth access token
   - lists accessible accounts/locations
   - uses `accounts/-/locations` where appropriate to include indirectly managed locations
   - requests only read fields
   - filters or matches by `metadata.place_id`
   - writes a proof artifact with no secrets

Minimum read fields:

- `name`
- `title`
- `metadata`
- `storefrontAddress`
- `serviceArea`
- `phoneNumbers`
- `websiteUri`
- `regularHours`
- `categories`
- `profile`

Southington match target:

```text
metadata.place_id="ChIJxypnrEz5KkYRgxXufgych38"
```

Done proof:

- script returns the matching location
- account/role/access path is documented without exposing tokens
- place ID matches the captured review link
- Profile Manager can record facts from read output
- Auditor confirms no write endpoints were used

Current preflight command:

```bash
npm run gbp:readonly-preflight
```

This command is intentionally safe: it checks for required OAuth environment variable names and retests the Southington review-link redirect/place ID. It does not call authenticated GBP APIs, print secret values, store tokens, or write Google data.

2026-05-28 preflight result:

- `GOOGLE_GBP_CLIENT_ID`: missing
- `GOOGLE_GBP_CLIENT_SECRET`: missing
- `GOOGLE_GBP_REFRESH_TOKEN`: missing
- `GOOGLE_GBP_ACCOUNT_HINT`: missing
- `GOOGLE_GBP_API_APPROVED`: missing
- Review link match: pass
- Matched place ID: `ChIJxypnrEz5KkYRgxXufgych38`
- Safe next action: use authenticated browser verification or set up Google Business Profile API approval/OAuth before API verification

## Path B - Authenticated Browser Verification

Short-term fallback if API approval is not ready.

Allowed:

- Profile Manager signs into the authorized GMF Google account through a normal browser session.
- Profile Manager opens Business Profile manager/search UI.
- Profile Manager records only non-sensitive proof:
  - profile name
  - role/access note
  - clean profile/Maps URL
  - review count/rating
  - hours/category/services/website/address-service-area fields
  - screenshots with personal account data cropped or avoided

Not allowed:

- extracting browser cookies
- storing Google session tokens
- asking for or storing passwords
- using Mike's personal browser profile without explicit permission
- making public edits while verifying

Done proof:

- Profile Manager proof note stored in live-pilot docs
- Auditor confirms no sensitive screenshot/token was stored
- Monday item stays `Human Needed = No` unless access fails

## Path C - Client-Originated/Public Fact Fallback

Use this while authenticated access is unavailable.

Allowed:

- Gmail/client-originated signatures
- Yardbook public page
- Yahoo/public directories
- Google public review URL redirects
- Slack history
- existing proof artifacts

Not enough for Done:

- private Manager role
- accepted invite state
- exact GBP dashboard identity
- profile edit readiness

## Southington Next Action

1. Systems Director decides whether current GMF systems can support Path A soon.
2. If Path A is not ready, Profile Manager uses Path B only through a normal authorized sign-in, not by scraping local browser cookies.
3. Profile Manager matches the profile to place ID `ChIJxypnrEz5KkYRgxXufgych38`.
4. Profile Manager records the role, clean profile URL, rating/count, hours, website, address/service-area, category, and services.
5. Auditor reviews the proof.
6. Manager asks Mike only if both Path A and Path B fail, or if public edit/client-facing approval is needed.

## Auditor Guardrails

- No write endpoints in a verifier.
- No token or cookie storage in docs.
- No public edits without SOP 172 approval.
- No HighLevel AI feature toggles.
- No live review requests without consent and send approval.
