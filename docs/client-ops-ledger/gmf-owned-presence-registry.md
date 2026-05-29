# GMF Owned Presence Registry

Status: draft registry
Owner: Systems Director / Reporter
Reviewer: Auditor
Created: 2026-05-28

Do not store passwords, 2FA codes, recovery codes, API keys, card data, or private identity documents in this registry.

## Control Standard

Each platform needs:

- owner/admin account
- recovery email or business manager control
- public URL
- profile status
- proof link
- next action owner
- public-publish approval state

## Profile Fill Standard

Creating or reserving an account is not enough. Each profile must be filled before it can move to Done:

- brand-safe profile image or logo
- banner/cover image where the platform supports it
- short bio or headline
- long about/description where the platform supports it
- website link
- contact path
- service list or platform-specific categories where supported
- first three posts, or one pinned intro plus two queued posts
- proof that admin/recovery control is held by GMF
- approval state for anything public-facing

If a platform account exists but any of these are missing, mark the fill status as `partial` or `draft`, not Done.

## Profiles

| Platform | Target handle/name | Public URL | Control status | Fill status | Next owner | Notes |
|---|---|---|---|---|---|---|
| Website | GetMeFound | `https://getmefound.ai` | owned | live | Systems Director | Production site and `llms.txt` are live |
| Google Business Profile | GetMeFound | unknown | unknown | hold | Profile Manager | Must pass eligibility/duplicate check before create/claim |
| LinkedIn Company | `getmefoundai` preferred | unknown | unknown | draft | Systems Director / Reporter | Create or claim after authenticated check |
| Facebook Page | `getmefoundai` preferred | unknown | unknown | draft | Systems Director / Reporter | Should sit inside Meta Business Suite |
| Instagram Professional | `getmefoundai` preferred | unknown | unknown | draft | Systems Director / Reporter | Link to Facebook Page/Meta Business Suite |
| YouTube | `@getmefoundai` preferred | unknown | unknown | draft | Systems Director / Studio | Use for explainer/proof videos later |
| TikTok | `@getmefoundai` preferred | unknown | unknown | draft | Studio / Reporter | Optional until short-form plan is approved |
| X | `@getmefoundai` fallback | `https://x.com/getmefound` is not GMF from public check | unavailable for primary handle | hold | Scout | `@GetMeFound` appears occupied by another account |
| Threads | follows Instagram | unknown | unknown | draft | Systems Director / Reporter | Create after Instagram is controlled |

## First Fill Packet

Short bio:

```text
Get found on Google and AI search. Done-for-you profile cleanup, review flow, and visibility reports for local businesses.
```

Long about:

```text
GetMeFound helps local businesses get found, stay trusted, and stay ready as Google and AI change how customers choose who to call. We clean up Google Business Profile details, build review request paths, create visibility reports, and keep owners informed about what changed, what is waiting, and what to improve next.
```

Website:

```text
https://getmefound.ai
```

Contact:

```text
support@getmefound.ai
```

Primary services:

- Google Business Profile cleanup
- Local visibility check
- Review request setup
- Review monitoring
- Monthly visibility report
- AI Search readiness review

## Blockers That Can Require Mike

- Choose or approve a public business phone.
- Choose whether any address can be shown publicly.
- Complete platform identity, captcha, app-only, or 2FA verification.
- Approve public profile creation or public field changes.
- Approve any paid ads, boosted posts, paid verification, or spend.

Everything else remains agent-owned until those blockers are proven.
