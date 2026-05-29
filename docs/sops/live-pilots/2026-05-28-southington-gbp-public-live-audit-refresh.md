# Southington GBP Public Live Audit Refresh

Status: public/read-only live audit complete; authenticated GBP manager audit still pending
Created: 2026-05-28
Owner agent: Profile Manager
Reviewer: Auditor
Client/system: Southington Lawn Service LLC
Related SOPs: SOP 005, SOP 064, SOP 066, SOP 067, SOP 068, SOP 069, SOP 070, SOP 172

## Direct Answer

GMF can and did run a live Southington GBP audit in the safe public/read-only sense.

GMF cannot yet complete the authenticated Google Business Profile manager audit or perform profile edits from the current agent tool context because no Google Business Profile OAuth/API credentials, authenticated browser session, or accepted-role proof is available to the agent.

No public profile edits were made.

## Live Checks Run

| Check | Result | Proof |
|---|---|---|
| Review link redirect | Pass | `https://g.page/r/CYMV7n4MnId_EB0/review` redirects to Google write-review flow |
| Place ID match | Pass | Resolved place ID is `ChIJxypnrEz5KkYRgxXufgych38` |
| GBP API/OAuth credential presence | Blocked | `GOOGLE_GBP_CLIENT_ID`, `GOOGLE_GBP_CLIENT_SECRET`, `GOOGLE_GBP_REFRESH_TOKEN`, `GOOGLE_GBP_ACCOUNT_HINT`, and `GOOGLE_GBP_API_APPROVED` are not present |
| Public audit artifact | Complete | `docs/sops/live-pilots/2026-05-27-southington-gbp-audit-proposed-edits.md` |
| Authenticated role/profile proof | Pending | Need read-only verification from the Google account/profile manager path |

## Command Evidence

Command:

```powershell
npm run gbp:readonly-preflight
```

Result summary:

```json
{
  "ok": true,
  "status": "api_oauth_env_missing",
  "oauthCredentialsPresent": false,
  "reviewLink": {
    "reviewUrl": "https://g.page/r/CYMV7n4MnId_EB0/review",
    "expectedPlaceId": "ChIJxypnrEz5KkYRgxXufgych38",
    "placeId": "ChIJxypnrEz5KkYRgxXufgych38",
    "matchesExpectedPlaceId": true
  },
  "safety": {
    "writesGoogleData": false,
    "printsSecretValues": false,
    "storesTokens": false
  }
}
```

## Current GBP Audit Findings

| Area | Status | Action |
|---|---|---|
| Business identity | Working fact | Southington Lawn Service LLC is the target business. |
| Review link | Verified | Use place ID `ChIJxypnrEz5KkYRgxXufgych38` to match the correct authenticated profile. |
| Phone | Working fact | `(203) 217-9137` appears in client-originated/public facts; confirm before profile edit. |
| Services | Draft-ready | Yardbook/public facts support lawn maintenance, mowing/trimming, aeration, overseeding, dethatching, spring cleanup, fall cleanup, and possibly shrub trimming if confirmed. |
| Category | Needs authenticated check | Confirm current primary/secondary GBP categories before recommending changes. |
| Hours | Needs authenticated check | Do not rely on one public hours clue. |
| Website | Needs decision | Confirm whether GBP should point to owned site, Yardbook quote page, or GMF-hosted page. |
| Address/service area | Needs authenticated check | Confirm whether address is hidden and which service areas are set. |
| Photos/media | Needs intake/authenticated check | Capture current photo baseline before recommending uploads. |
| Review count/rating | Needs profile panel/authenticated check | Review link is verified, but count/rating still needs visible profile proof. |

## Why Authenticated Live Test Is Blocked

Google requires a signed-in account linked to the Business Profile to edit or fully manage business info. Google Business Profile API access also requires OAuth authorization and API setup. The current agent workspace has neither a GBP OAuth token nor an authenticated Google session.

Therefore, the safe agent boundary is:

- allowed now: public audit, review-link test, proposed edits, claim-safe draft, proof artifact, Monday status, Auditor handoff
- not allowed/possible from current tools: verify accepted Manager role, inspect private GBP settings, capture complete profile internals, make public edits, respond to reviews, upload photos, or send review requests

## Next Agent-Owned Steps

1. Systems Director establishes a safe authenticated read-only GBP verification path using `docs/sops/live-pilots/2026-05-28-gbp-read-only-verification-path.md`.
2. Profile Manager matches place ID `ChIJxypnrEz5KkYRgxXufgych38` inside GBP.
3. Profile Manager captures role, clean profile URL, review count/rating, primary category, services, hours, website, address/service-area setting, and photo baseline.
4. Auditor reviews the public audit plus authenticated proof.
5. Only after approval, Profile Manager can prepare public edits. No edits happen automatically.

## Owner Ask Status

Mike is not needed for the public/read-only audit. Mike is only needed if the authenticated access path fails after Systems Director/Profile Manager exhaust it, or if approval is needed before a public edit, live review request, billing action, or reputation-risk action.
