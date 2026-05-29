# Smartlead Monday Max-Safe Send Approval Packet

Status: held - superseded by 2026-06-01 GMF prospecting launch revision
Owner: Sales Manager
Supporting agents: Systems Director / Scout / Coach
Reviewer: Auditor
Manager: Elon
Requested by: Mike
Target report to Mike: 2026-05-28 22:45 ET
Send target: Monday 2026-06-01 mid-morning, only after Mike approval

Owner review note: Mike's 2026-05-29 instruction supersedes the older med-spa/dental/home-services targeting packet. Campaign stays paused. No Monday send approval exists yet for the rebuilt campaign.

## Current Hold

Campaign `3379589` is paused. Nothing is approved to send until Mike reviews and approves the expanded launch packet.

The prior 3-lead med-spa seed setup and this older five-niche packet are superseded by Mike's corrected 2026-05-29 direction:

- do not target saturated home-services/dental/legal/realtor lanes
- prioritize pet care, specialty fitness/wellness, beauty/personal care, and a small test bucket
- use low-cost Outscraper base Google Maps data for the whole list
- verify every email with the approved NeverBounce fallback for the 6/1 MVP
- suppress any lead with blank/stale personalization fields
- send a 4-email plain-text sequence through Smartlead only after approval

New launch source of truth: `docs/client-ops-ledger/gmf-2026-06-01-prospecting-agent-launch-plan.md`

Historical five-niche research packet: `docs/client-ops-ledger/smartlead-five-niche-targeting-research-2026-05-28.md`

Read-only safety check after the five-niche packet:

- Campaign `3379589`: `PAUSED`
- Smartlead campaign cap still shown as `max_leads_per_day: 3`
- Minimum time between emails still shown as `20` minutes
- Sender readiness check: all 3 inboxes ready for a tiny seed-list test, with 0 spam and 100 reputation

## Agent Assignments

| Agent | Owns | Output |
|---|---|---|
| Sales Manager | send cap, niche, offer angle, go/no-go recommendation | approval packet recommendation |
| Systems Director | Smartlead state, sender limits, schedule, campaign safety | mailbox/readiness proof |
| Scout | lead inventory, niche fit, candidate list size | QA candidate pool |
| Coach | email content, claim safety, opt-out language | copy draft |
| Auditor | deliverability, compliance, unsupported claims, stop rules | approve/hold/block |
| Manager / Elon | owner report and final approval routing | Mike-facing packet |

## Current Mailbox Facts

| Inbox | Smartlead ID | Warmup Sent | Spam | Reputation | Max Email Per Day | Current Status |
|---|---:|---:|---:|---:|---:|---|
| `mike@getmefoundnow.com` | 18951375 | 45 | 0 | 100 | 20 | ready for tiny seed |
| `mike@trygetmefound.com` | 18951374 | 43 | 0 | 100 | 20 | ready for tiny seed |
| `mike@getmefoundlocal.com` | 18951373 | 43 | 0 | 100 | 20 | ready for tiny seed |

The accounts are healthy, but they were connected on 2026-05-23, so they are not yet at the 14+ day warmup maturity recommended by Smartlead for normal live campaigns.

## Send-Cap Reasoning

Smartlead's docs point in two directions:

- Technical/send-setting guidance allows campaign scheduling and sender rotation, and mentions daily new-lead caps in the 20-50 per-account range once accounts are properly warmed.
- Warmup guidance says live campaigns should start after 14+ days of warmup, newer domains may need 21-30 days, and first campaigns should start at 10-15 new leads per day with gradual increases.

Therefore, the launch packet will separate three numbers:

| Option | Monday Send Count | Per Inbox | Recommendation |
|---|---:|---:|---|
| Conservative maximum-safe | 30 | 10 each | Recommended if Mike wants the strongest Monday send without being reckless |
| Aggressive early test | 45 | 15 each | Possible only if Mike accepts higher deliverability risk |
| Technical account ceiling | 60 | 20 each | Not recommended Monday because it consumes each inbox's full configured daily cap during early warmup |

Sales Manager's working recommendation is **30 total Monday sends**, spread 10 per inbox, unless Scout/Auditor find the candidate list quality cannot support 30.

## Niche Direction

Working launch target is now GMF local-business visibility, not the older med-spa test.

Priority order:

| Tier | Niche family | Examples | Monday use |
|---:|---|---|---|
| 1 | Pet care | dog grooming, dog daycare/boarding, dog training, mobile groomers, pet sitting | Primary list build |
| 2 | Specialty fitness/wellness | yoga, pilates, barre, martial arts, dance, climbing, personal-training studios | Secondary list build |
| 3 | Beauty/personal care | lash/brow, spray tan, massage therapy, esthetics | Third list build |
| Test | Other local schools/vendors | tutoring, music, swim, detailing/tint, event vendors | Small test bucket only |

Scout should build the candidate pool from the new config. Do not pad the list with dental, legal, realtor, home-services, or old med-spa rows unless Mike separately approves an exception.

## Copy Direction

Email should stay plain text, short, no tracking links, no fake deep-audit claim, and no guarantee.

Draft direction must be rewritten by segment. Example shape only:

```text
Subject: quick Google visibility note for {{company_name}}

Hi there,

I was checking how {{category}} businesses show up around {{city}}.

{{company_name}} has {{review_count}} Google reviews, which is below the local trust threshold I would want before sending more traffic there.

Want me to send over the quick visibility check?

If this is not useful, reply stop and I will close the loop.

Mike
```

Coach/Auditor still need to review final copy before Mike approval.

## Required Before Mike Approval

- final candidate list count and QA result under the new target config
- exact proposed cap based on Smartlead warmup/account capacity
- sender assignment by inbox
- Smartlead schedule window
- final 4-email sequence and subject variants
- suppression/unsubscribe handling
- NeverBounce verifier proof
- CAN-SPAM physical postal address/footer proof using `13727 SW 152nd St. #1236, Miami, FL 33177`
- Smartlead deliverability audit proof: `npm run smartlead:deliverability-audit -- --campaign-id <id>` must be PASS; WATCH requires Auditor approval; HOLD blocks launch
- no open/click tracking unless explicitly approved, plain text, one CTA link max, no attachments/images/URL shorteners, stop on any reply
- stop rules
- monitoring owner and Monday first-window check time
- Auditor recommendation: approve / approve with cap / hold / block

## Stop Rules

Pause immediately on:

- bounce spike
- complaint
- unsubscribe issue
- angry/confused reply
- wrong niche/list issue
- unexpected extra sends
- Smartlead sender/reputation warning
- deliverability audit returns HOLD or campaign settings drift after approval

## Current Recommendation

Rebuild the approval packet from `docs/client-ops-ledger/gmf-2026-06-01-prospecting-agent-launch-plan.md`.

Do not send anything before Mike approves the final packet.
