# GetMeFound First Smartlead Campaign

Last updated: 2026-05-23

## Status

Smartlead seed campaign is configured but paused while the expanded max-safe Monday send approval packet is built:

- Name: `GetMeFound - AI Visibility Audit - Warmup Draft`
- ID: `3379589`
- Current name in Smartlead: `GetMeFound - CT Med Spa Visibility Seed - 2026-06-01`
- Status: paused pending Mike approval of expanded send packet
- Send window: Monday 2026-06-01, 10:15-11:30 ET
- Live cap: 3 seed leads total
- Sequence: one initial email only; no follow-up steps in this first seed launch
- Superseding approval packet: `docs/client-ops-ledger/smartlead-monday-max-send-approval-packet.md`
- Prior proof: `docs/client-ops-ledger/smartlead-seed-launch-current.md`

Owner approval for the first live send direction was given by Mike in chat, then Mike clarified that he wants the maximum safe per-inbox plan reported before anything sends. Do not resume the campaign until the expanded approval packet is approved.

Readiness command:

```powershell
npm run smartlead:readiness
```

As of 2026-05-29, the three outreach inboxes passed readiness: SMTP/IMAP OK, active warmup, reputation 100, and 0 spam.

First no-spend seed list prepared on 2026-05-23 from existing local inventory:

- Source CSV: `tmp-getmefound-medspa-first-test.csv`
- Verified CSV: `tmp-getmefound-medspa-first-test-verified.csv`
- QA CSV: `tmp-getmefound-medspa-first-test-qa.csv`
- Verification: 3 input, 3 valid, 0 removed
- QA: 3 OK, 0 review rows

These three leads were imported into Smartlead for the approved Monday seed send. Do not add additional leads until the Monday first-window stats and reply/risk review are complete.

## Goal

Book the first GetMeFound sales conversations by offering a small, specific AI/local visibility audit.

## First Niche

Start with one niche at a time. Recommended first test:

- Med spas in Connecticut and nearby Northeast markets

Why:

- High customer lifetime value
- Review recency matters
- Local search and AI recommendation positioning is easy to explain
- Owners understand missed appointment revenue

Fallback niches:

- Dental offices
- Pet grooming / boarding
- HVAC / plumbing

## Lead Rules

Use only leads that pass:

- Business website exists
- Business email is valid or likely valid
- No personal email domains for the first test
- No duplicate business contacts
- Clear local-service fit
- Enough public proof to personalize the first line

First live batch should be tiny:

- 15-30 leads total
- 5-10 leads per sending domain max
- No campaign activation until warmup shows clean activity

Current seed list is intentionally smaller than the first full test:

- Magnolia Med Spa
- The MedSpa Old Wethersfield
- Milford Med Spa

## Sequence Draft

### Email 1

Subject: quick AI visibility check for {{company_name}}

Hi {{first_name}},

I was checking how local med spas show up when people ask Google and AI tools who to trust near {{city}}.

{{company_name}} looks like the kind of business that should be easier to recommend, but I noticed a few visibility gaps I would fix first.

Want me to send over the quick audit?

Mike

### Follow-Up 1

Subject: worth sending?

Hi {{first_name}},

The audit is short. I look at the pieces that help a local business get recommended: Google profile, review freshness, website trust signals, local proof, and AI-readable business facts.

If useful, reply `send` and I will send it over.

Mike

### Follow-Up 2

Subject: should I close the loop?

Hi {{first_name}},

Last note from me.

If getting found in AI/local search is not a priority right now, no problem.

If you want the quick visibility audit for {{company_name}}, reply `send`.

Mike

## Guardrails

- Do not use the main `getmefound.ai` inbox for cold outreach.
- Do not add the `hello@...` inboxes yet.
- Do not turn on link tracking until a custom tracking domain decision is made.
- Do not use misleading urgency.
- Do not claim we ran a deep audit before there is actual evidence.
- Stop follow-up on replies, unsubscribes, bounces, and complaints.

## Next Build Steps

1. Monitor Monday first-window stats after 12:00 ET.
2. Confirm sent count, failures, bounces, replies, complaints, and no unexpected extra sends.
3. Sorter/Sales Rep classify replies and stop manual action on reply, bounce, unsubscribe, complaint, or risk.
4. Auditor reviews first-window proof before any list expansion.
5. Build or expand the 15-30 lead med-spa test list only after the seed review passes.
6. Run email verification and QA for any expanded list.
7. Create a fresh launch packet for any follow-up sequence, volume increase, new niche, or additional senders.
