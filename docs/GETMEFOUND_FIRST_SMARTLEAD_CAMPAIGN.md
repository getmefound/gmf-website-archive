# GetMeFound First Smartlead Campaign

Last updated: 2026-05-23

## Status

Smartlead draft campaign created:

- Name: `GetMeFound - AI Visibility Audit - Warmup Draft`
- ID: `3379589`
- Status: draft

Do not activate this campaign until sender warmup is healthy and the first lead list passes QA.

Readiness command:

```powershell
npm run smartlead:readiness
```

As of 2026-05-23, the draft is not ready for live prospect sending yet because each inbox has only 1 Smartlead warmup send. DNS, SMTP, IMAP, Smartlead status, and reputation are healthy.

First no-spend seed list prepared on 2026-05-23 from existing local inventory:

- Source CSV: `tmp-getmefound-medspa-first-test.csv`
- Verified CSV: `tmp-getmefound-medspa-first-test-verified.csv`
- QA CSV: `tmp-getmefound-medspa-first-test-qa.csv`
- Verification: 3 input, 3 valid, 0 removed
- QA: 3 OK, 0 review rows

Do not import these leads into Smartlead until warmup has more activity and the send test is approved.

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

1. Let Smartlead warmup reach at least 10 sent emails per inbox with 0 spam.
2. Re-run `npm run smartlead:readiness`.
3. Build or expand the 15-30 lead med-spa test list.
4. Run email verification and QA.
5. Add sequence and sender accounts to the draft campaign.
6. Import only the QA-approved leads.
7. Send one Smartlead test email to Mike before activation.
8. Activate only after warmup and test email checks are clean.
