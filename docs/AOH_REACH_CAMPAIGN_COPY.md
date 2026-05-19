# AOH Reach Campaign Copy Drafts

Status: controlled-pilot copy, not approved for scaled send
Owner: Sender
Reviewer: Coach + Auditor
Last updated: 2026-05-19

## Rules Before Use

- Reply-first. No price in Email 1. No product pitch in Email 1.
- Email 1 job: get the `send` reply only.
- Price and product explanation live in report delivery email only.
- No links in Email 1, 2, or 3. Links only in report delivery (after reply).
- No `{{contact.first_name}}` — outscraper does not pull owner name from Google Maps.
- Do not broadly headline `$1 for first 2 months` — second $1 month is conditional on testimonial only.
- No guaranteed rankings or AI citation promises.
- Include physical mailing address and unsubscribe in every email footer.
- Use warmed sending domains only. One domain per lane.

## Reply Routing

- `send` → trigger report delivery email for that lane
- `book` → send `{{custom_values.aoh_discovery_calendar_link}}`
- unclear positive → human review queue, no automation
- STOP / unsubscribe / remove me / not interested / wrong person → suppress immediately

---

## Campaign 1 — Review Automation

Domain: `mail.aioutsourcehubs.com`
Offer (report delivery only): First month $1

### Email 1 — Day 0

```
Subject: {{contact.prospect_review_count}} reviews vs {{contact.competitor_review_count}} — {{contact.company_name}}

I ran a quick scan on {{contact.company_name}}.

{{contact.competitor_name}} has {{contact.competitor_review_count}} Google reviews. You have {{contact.prospect_review_count}}.

Most businesses close a gap like that in about 60 days. Want me to send what I found?

Mike
AI Outsource Hub · 877-521-2224
```

### Email 2 — Day 3

```
Subject: re: {{contact.company_name}}

Still happy to send what I found on {{contact.company_name}}.

One thing worth knowing: the last Google review posted was {{contact.last_review_date}}. That gap tends to cost rankings quietly over time.

Want the details?

Mike
```

### Email 3 — Day 10

```
Subject: closing the loop

Last note from me on {{contact.company_name}}.

If reviews aren't a focus right now, no problem. Happy to send what I found when the timing is better.

Mike
```

### Report Delivery — fires after `send` reply

```
Subject: re: {{contact.company_name}} scan

Here's what I found: {{contact.report_url}}

{{contact.prospect_review_count}} reviews at {{contact.prospect_rating}} stars puts {{contact.company_name}} behind {{contact.competitor_name}}. The scan shows exactly where the gap is.

We fix this with automated review requests after every job — replies written in your voice, nothing for your team to manage. First month is $1 to see it move.

Worth 10 minutes to walk through what we'd fix first?

Mike
AI Outsource Hub · 877-521-2224
```

---

## Campaign 2 — AI Visibility

Domain: `mail.getaioutsourcehub.com`
Offer (report delivery only): No setup fee for first 3 CT businesses

Use Email 1A or 1B based on the AI scenario field per contact.

### Email 1A — Day 0 (competitor ahead)

```
Subject: {{contact.competitor_name}} shows up in ChatGPT. {{contact.company_name}} doesn't.

I ran a free AI search scan on {{contact.company_name}}.

When someone in {{contact.city}} asks ChatGPT or Google AI for a {{contact.niche_vertical}}, {{contact.competitor_name}} comes up. You don't.

Want me to send what I found?

Mike
AI Outsource Hub · 877-521-2224
```

### Email 1B — Day 0 (nobody owns it)

```
Subject: no {{contact.niche_vertical}} in {{contact.city}} owns AI search yet

I ran a free AI search scan on {{contact.company_name}}.

No {{contact.niche_vertical}} in {{contact.city}} is showing up consistently when people use ChatGPT or Google AI. First business to fix that tends to lock it in.

Want me to send what I found?

Mike
AI Outsource Hub · 877-521-2224
```

### Email 2 — Day 3

```
Subject: re: {{contact.company_name}}

Still have the AI scan queued for {{contact.company_name}} if you want it.

AI search results for {{contact.niche_vertical}} in {{contact.city}} aren't crowded yet. Whoever moves first tends to stay there.

Want me to send what I found?

Mike
```

### Email 3 — Day 10

```
Subject: last note

Last one from me on {{contact.company_name}}.

If AI search visibility becomes a priority later, I'll still have the scan.

Mike
```

### Report Delivery — fires after `send` reply

```
Subject: re: {{contact.company_name}} AI scan

Here's the scan: {{contact.report_url}}

It shows how {{contact.company_name}} appears when people use AI to search for {{contact.niche_vertical}} in {{contact.city}}, and what's missing that AI systems need to recommend you.

We get businesses cited in ChatGPT, Google AI, and Perplexity — reviews managed and replied to in your voice. No setup fee for the first 3 businesses in the CT area.

Worth a 10-minute walkthrough?

Mike
AI Outsource Hub · 877-521-2224
```

---

## Campaign 3 — Relay

Domain: `mail.myaioutsourcehub.com`
Offer (report delivery only): ROI calculator + product explanation

### Email 1 — Day 0

```
Subject: {{contact.company_name}} — calls after 5pm

When someone calls {{contact.company_name}} at 7pm on a Friday and no one picks up — they call the next {{contact.niche_vertical}} in Google. That job is gone.

I put together the missed-call math for {{contact.niche_vertical}} businesses in {{contact.city}}. Want me to send it?

Mike
AI Outsource Hub · 877-521-2224
```

### Email 2 — Day 3

```
Subject: re: {{contact.company_name}}

Still happy to send the missed-call estimate for {{contact.company_name}}.

Most {{contact.niche_vertical}} businesses miss 3–5 jobs a month to unanswered calls. At your average job value, that adds up fast.

Worth seeing the math?

Mike
```

### Email 3 — Day 10

```
Subject: last note

Not going to keep nudging on {{contact.company_name}}.

If missed calls become worth solving, I'm here.

Mike
```

### Report Delivery — fires after `send` reply

```
Subject: re: {{contact.company_name}} missed-call estimate

Here's the calculator: https://aioutsourcehub.com/calculator

For a {{contact.niche_vertical}} handling 15–20 calls a week, missing 20% after hours is typically 3–5 jobs a month going to whoever picks up.

We answer every call in your company voice, qualify the lead, book straight into your calendar — 24/7. Most clients cover the cost in month one.

Worth 10 minutes?

Mike
AI Outsource Hub · 877-521-2224
```

---

## Auditor Checks Before Any Send

- merge fields render correctly for blank city, blank competitor, blank review count
- footer with unsubscribe and physical address renders in all emails
- from name and from email match the warmed sender domain for that lane
- no price or product pitch appears in Email 1, 2, or 3
- no links appear in Email 1, 2, or 3
- report delivery fires exactly once per `send` reply — no duplicates
- `book` reply sends `{{custom_values.aoh_discovery_calendar_link}}`
- suppression keywords trigger immediate suppress with no further sends
- Campaign 2 scenario field (competitor_ahead vs nobody_optimized) routes to correct Email 1 variant
- daily send caps set per domain before arming
