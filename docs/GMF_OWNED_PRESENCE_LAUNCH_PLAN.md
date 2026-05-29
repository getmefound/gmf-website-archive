# GMF Owned Presence Launch Plan

Status: active setup plan
Owner: Manager / Profile Manager
Reviewer: Auditor
Created: 2026-05-28
Purpose: set up and fill GetMeFound's own Google Business Profile and social profiles as a client-zero delivery workflow.

## Executive Read

GMF needs its own public presence filled out before scaling client work. This is both brand trust and a live test of the same work sold to clients.

Do not create or publish anything public without proof and approval gates. Drafting, inventory, handle checks, account registry, asset prep, and profile copy can proceed without Mike.

Completion rule: a created but empty profile is not Done. A social profile only counts as complete when it has the right ownership proof, profile image, banner or cover where supported, bio/about copy, website/contact path, service details, and first content ready for approval or scheduling.

## Current Inventory

| Surface | Current read | Owner | Status |
|---|---|---|---|
| Website | `https://getmefound.ai` is the production site and `public/llms.txt` exists | Systems Director / Reporter | Live |
| Client ledger | GMF did not have its own current internal client row before this plan | Manager | Fixing |
| Google Business Profile | Existing public GMF profile not proven from public search; old AOH client-zero docs say AOH/GMF profile access existed but current authenticated proof is not attached | Profile Manager | Needs eligibility + authenticated proof |
| X / Twitter | `@GetMeFound` appears occupied by a non-GMF account named "Definitive Enter LLC" | Scout | Use alternate handle unless recovered |
| LinkedIn company | Public search did not prove a current GMF company page | Scout / Systems Director | Needs authenticated platform check |
| Facebook Page | Public search did not prove a current GMF page | Scout / Systems Director | Needs authenticated platform check |
| Instagram | Public search did not prove a current GMF profile | Scout / Systems Director | Needs authenticated platform check |
| YouTube | Public search did not prove a current GMF channel | Scout / Systems Director | Needs authenticated platform check |
| TikTok | Public search did not prove a current GMF profile | Scout / Systems Director | Needs authenticated platform check |
| Assets/copy | Internal social/profile assets already exist in `app/preview/social-pack`, `app/preview/team-profiles`, `lib/social-pack.ts`, and `lib/team-pack.ts` | Studio / Reporter | Reuse and clean up |

## Google Business Profile Risk Rule

Google Business Profile is for businesses with a real-world customer interaction model. Google says online-only businesses are not eligible, and service-area businesses should not show an address if they do not serve customers at that address.

Therefore GMF must not fake a storefront or virtual office. Profile Manager must classify GMF as one of these before creation/claim:

1. **Eligible storefront/hybrid**: real staffed customer location with signage or real customer visits.
2. **Eligible service-area business**: GMF goes to customers or serves customers at their locations, with a real base address used for verification but hidden if customers do not visit.
3. **Not eligible for GBP**: GMF is online-only. In this case, do not create a GBP; focus on website, social profiles, citations, schema, and AI/search visibility.

## Recommended Handle Strategy

Use one handle family wherever available:

| Priority | Handle | Reason |
|---|---|---|
| 1 | `getmefoundai` | Short, brand + domain hint, appears cleaner than `getmefound` from public checks |
| 2 | `getmefoundhq` | Good fallback for social if AI handle is taken |
| 3 | `getmefoundlocal` | Good fallback if platform wants a service-oriented handle |

Avoid `getmefound` unless GMF can prove ownership or recover it. Public X evidence points to a different owner.

## Agent Assignments

| Agent | Owns | Proof |
|---|---|---|
| Manager / Elon | Route work, prevent stalls, owner gates only when real | Monday items and owner command plan updated |
| Systems Director | Account registry, recovery emails, 2FA/admin control, no secrets in docs | Access-control checklist with no passwords stored |
| Profile Manager | GBP eligibility, create/claim plan, categories, services, photos, posts, review link | GBP intake and proof artifacts |
| Studio / Reporter | Profile copy, banners, logo, profile images, first post pack | Copy/assets packet |
| Scout | Public handle availability and competitor/presence scan | Handle inventory |
| Auditor | Public profile edit approval, Google eligibility/suspension risk, claim checks | Pass/hold/block review |
| Agent Ness | Daily critique of progress and business leverage | Morning audit recommendation |

## Build Sequence

### Phase 1 - Inventory And Account Control

- Check public web for existing profiles.
- Check authenticated owner accounts where available.
- Create a GMF owned-presence registry with platform, URL, owner/admin, recovery method, status, and proof link.
- Do not store passwords, 2FA codes, API keys, or recovery codes in docs.
- Use a business-controlled admin email for each platform when possible.

Done proof:

- Registry row for each surface.
- Status is `owned`, `needs create`, `needs claim`, `blocked`, or `do not create`.

### Phase 2 - GBP Eligibility And Setup

- Confirm whether GMF is eligible under Google rules.
- If eligible, decide address visibility and service area before creating/claiming.
- Confirm public phone, website, category, hours, services, and description.
- Create or claim only after duplicate/profile search.
- Capture profile access and verification proof.

Done proof:

- Eligibility classification.
- Create/claim decision.
- Approved business facts.
- Verification path and proof screenshots.

Mike needed only if:

- public address choice is required
- public phone choice is required
- Google asks for owner-only identity/video verification
- Profile Manager is ready to publish public fields
- eligibility is ambiguous after evidence review

### Phase 3 - Social Profiles

Priority order:

1. LinkedIn Company Page
2. Facebook Page
3. Instagram Professional account linked to Meta Business Suite
4. YouTube handle/channel
5. TikTok business profile
6. X only if clean handle is available; otherwise reserve fallback
7. Threads follows Instagram after Meta setup

Each profile gets:

- profile image
- banner/cover where supported
- bio/about text
- website link
- contact email/path
- services
- first three posts or pinned intro
- admin/recovery proof

Done proof:

- public URL
- admin control proof
- profile fields filled, not left as placeholders
- profile image and banner/cover proof where supported
- first post draft approved, scheduled, or explicitly held for public approval
- proof artifact attached to the registry and Monday job

### Phase 4 - First Content Pack

Start with five reusable posts:

1. What GetMeFound does
2. Why Google profile completeness matters
3. Why review recency matters
4. AI Search readiness for local businesses
5. Free visibility check / Get Found offer

Reuse existing social-pack content only after GMF rebrand and claim review. Old broad "AOH" and old pricing language must be checked before publishing.

### Phase 5 - Monitoring Cadence

| Cadence | Owner | Check |
|---|---|---|
| Weekly | Reporter / Studio | New post, broken links, profile completeness |
| Monthly | Profile Manager / Auditor | GBP/social fact sync, category/services, NAP, review link |
| Daily | Agent Ness | Whether owned presence is improving acquisition/retention |
| On platform change | Scout / Coach | Update SOPs and agent training |

## Public Copy Draft

Short bio:

```text
GetMeFound helps local businesses clean up their Google presence, strengthen review flow, and stay ready for AI-powered search.
```

Long description:

```text
GetMeFound helps local businesses get found, stay trusted, and stay ready as Google and AI change how customers choose who to call. We clean up Google Business Profile details, build review request paths, create visibility reports, and keep owners informed about what changed, what is waiting, and what to improve next.
```

Services:

- Google Business Profile cleanup
- Local visibility checks
- Review request setup
- Review monitoring
- Monthly visibility reports
- AI Search readiness review

## Immediate Next Actions

1. Manager creates/updates Monday jobs for GMF owned presence.
2. Profile Manager completes GBP eligibility and duplicate-profile check.
3. Systems Director builds account-control registry.
4. Studio/Reporter cleans the profile copy/assets packet.
5. Auditor reviews the GBP eligibility decision before any public profile creation or edit.
