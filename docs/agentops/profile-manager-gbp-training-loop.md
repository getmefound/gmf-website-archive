# Profile Manager GBP Training Loop

Status: v1 client-zero
Owner: Profile Manager
Reviewer: Manager
Last updated: 2026-05-21

## Plain-English Goal

Train the Google Business Profile agent on AOH first.

The agent should learn how to get access, inspect the profile, draft a safe update, and explain the process to a business owner before AOH asks a client to do the same thing.

## What The Agent Must Know

- "GMB" is the old common name. Use "Google Business Profile" or "GBP" with clients.
- AOH access is already confirmed for the client-zero test.
- The client should add the AOH business-domain Google login under Business Profile settings -> People and access.
- Default access is Manager.
- No one should share a Google password.
- Manager access is enough for normal profile work.
- Owner access is only for admin/ownership work and needs separate approval.
- Public profile changes, posts, photos, services, and description edits need Mike approval during the AOH test.
- GHL Expert helps only if the profile needs to connect into HighLevel.
- HighLevel AI features stay OFF unless Mike manually approves them.

## AOH Client-Zero Run

Current input needed:

- AOH Business Profile link or search name
- final public-publish approval only

Profile Manager run:

1. Treat AOH access as confirmed for the client-zero test.
2. For future clients, confirm the role is Manager unless Mike specifically approved Owner.
3. Check profile basics: name, service area/address, phone, website, hours, categories, services, photos, posts, review link, and unanswered reviews.
4. Draft one safe update.
5. List proof needed for the future client instructions.
6. Send Manager a recommendation.
7. Manager asks Mike only for the final public-publish decision.
8. Log what worked and what needs to be clearer for clients.

## Review Link Skill

Profile Manager must be able to find the direct Google review request link without asking Mike to hunt for it.

Click path:

1. Log into the Google account that has access to AOH's profile.
2. Search Google for `AI Outsource Hub`.
3. Open the Business Profile controls for the correct AOH profile.
4. Select `Read reviews`.
5. Select `Get more reviews`.
6. Copy the review link. If Google shows a QR/share panel, copy the link from that panel.

Acceptable labels Google may show:

- `Get more reviews`
- `Ask for reviews`
- `Share review form`
- review QR code/share link

Proof before handoff:

- Link opens the Google review flow for AI Outsource Hub.
- Business name is correct.
- Link is public, not an admin-only URL.
- No profile edits, posts, replies, or settings changes were made.

If blocked, report only:

- Which logged-in account was checked.
- Whether AOH profile controls were visible.
- Whether reviews were visible.
- Which button/step was missing.
- Screenshot needed from Mike if the authenticated profile cannot be opened by the agent.

## Required Response Format

```text
Profile Manager - GBP client-zero status

Access:
- Confirmed for AOH client-zero, blocked, or needs owner action

Profile gaps:
- Top gaps or "not fully inspected from Slack yet"

Agent-prepared draft:
- One safe AOH update ready for Mike to approve or revise

Proof needed:
- Screenshots or checks needed before publishing

Manager recommendation:
- Publish, revise, or hold

Next handoff:
- ...
```

## What Good Looks Like

- Mike can understand the status in under 30 seconds.
- A future client can follow the invite instructions without a call.
- The agent never asks for a password.
- The agent team does the prep work without asking Mike for every small decision.
- The agent does not publish anything public without the final owner approval phrase.
- The process can be reused for Review Automation, AI Visibility, and any local profile service AOH sells.

## Sources

- Google Business Profile owner and manager access: https://support.google.com/business/answer/3403100
- Google Business Profile edits: https://support.google.com/business/answer/3039617
- Google Business Profile posts: https://support.google.com/business/answer/7342169
- Google review link / QR code requests: https://support.google.com/business/answer/16816815
- Google tips to get more reviews: https://support.google.com/business/answer/3474122
