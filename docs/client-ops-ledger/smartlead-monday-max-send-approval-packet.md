# Smartlead Monday Max-Safe Send Approval Packet

Status: ready for owner review; final candidate QA pending
Owner: Sales Manager
Supporting agents: Systems Director / Scout / Coach
Reviewer: Auditor
Manager: Elon
Requested by: Mike
Target report to Mike: 2026-05-28 22:45 ET
Send target: Monday 2026-06-01 mid-morning, only after Mike approval

Owner review note: Mike asked to review this in full tomorrow morning before making the send/niche/volume decision. Campaign stays paused. No Monday send approval exists yet for the expanded campaign.

## Current Hold

Campaign `3379589` is paused. Nothing is approved to send until Mike reviews and approves the expanded launch packet.

The prior 3-lead seed setup is superseded by Mike's corrected direction: use the most we can safely send from each warmed-up outreach account, but report the parameters, niche, list, and email content before sending.

Sales Manager five-niche research packet: `docs/client-ops-ledger/smartlead-five-niche-targeting-research-2026-05-28.md`

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
| `mike@getmefoundnow.com` | 18951375 | 38 | 0 | 100 | 20 | ready for tiny seed |
| `mike@trygetmefound.com` | 18951374 | 36 | 0 | 100 | 20 | ready for tiny seed |
| `mike@getmefoundlocal.com` | 18951373 | 38 | 0 | 100 | 20 | ready for tiny seed |

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

Working niche: **medical spas / aesthetic clinics**.

Reasoning:

- existing inventory already shows roughly 30 med-spa/spa candidates
- strong fit with Google profile quality, review freshness, trust, and AI/local visibility
- high customer lifetime value makes a small visibility fix believable
- current sequence can be adapted without changing the offer

Five researched niches:

| Rank | Niche | Monday Fit | Decision |
|---:|---|---|---|
| 1 | Medical spas / aesthetic clinics | Hot | Primary Monday recommendation |
| 2 | Dentists / cosmetic and implant dental | Hot | Second test |
| 3 | Pet grooming / boarding / daycare | Warm | Reply-friendly fallback |
| 4 | Home services: HVAC / plumbing / roofing | Hot | Build fresh QA batch |
| 5 | Assisted living / senior living | Warm | High value, but more sensitive copy/routing |

Scout should expand and QA the med-spa pool first. If the med-spa list cannot support 20-30 clean sends, Sales Manager should either reduce the Monday cap or ask Mike to approve a second niche before mixing copy.

## Copy Direction

Email should stay plain text, short, no tracking links, no fake deep-audit claim, and no guarantee.

Draft direction:

```text
Subject: quick visibility check for {{company_name}}

Hi there,

I was checking how local med spas show up when people ask Google and AI tools who to trust near {{city}}.

{{company_name}} looks like the kind of business that should be easier to recommend, but I noticed a few visibility gaps I would fix first.

Want me to send over the quick audit?

If this is not useful, reply stop and I will close the loop.

Mike
```

Coach/Auditor still need to review final copy before Mike approval.

## Required Before Mike Approval

- final candidate list count and QA result
- exact proposed cap: 30, 45, or hold
- sender assignment by inbox
- Smartlead schedule window
- final email copy
- suppression/unsubscribe handling
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

## Current Recommendation

Get Mike the approval packet by **10:45 PM ET tonight** based on Mike's owner-stated Thursday 2026-05-28 planning clock.

Do not send anything before Mike approves the final packet.
