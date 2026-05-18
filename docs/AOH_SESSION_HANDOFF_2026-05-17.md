# AOH Session Handoff - 2026-05-17

## Safe stop state

Stop point: Mike paused for the night while building the `/aoh-talk` Discovery calendar.

Do not publish, send, enroll contacts, or enable HighLevel AI. The system is intentionally paused in a safe state.

## Completed today

- Renamed the old GHL subaccount `Review Boost` to `AOH Client Template Lab`.
- Updated Mission Control/job references to `AOH Client Template Lab`.
- Added `AGENTS.md` rule: never enable HighLevel AI features without Mike's explicit manual approval.
- Turned off/avoided HighLevel AI features in the template lab after Mike noticed AI was enabled.
- Created and verified 6 AOH custom values in GHL:
  - `{{custom_values.aoh_business_name}}` = `AI Outsource Hub`
  - `{{custom_values.aoh_support_email}}` = `support@aioutsourcehub.com`
  - `{{custom_values.aoh_support_phone}}` = `877-521-2224`
  - `{{custom_values.aoh_logo_url}}` = `https://aioutsourcehub.com/team/mike.jpg`
  - `{{custom_values.aoh_discovery_calendar_link}}` = `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
  - `{{custom_values.aoh_physical_mailing_address}}` = `13727 SW 152nd St. #1236, Miami, FL 33177`
- Created and verified 9 Reach custom fields in GHL:
  - `{{contact.run_id}}` - Single line
  - `{{contact.report_url}}` - Single line
  - `{{contact.prospect_review_count}}` - Number
  - `{{contact.prospect_rating}}` - Number
  - `{{contact.last_review_date}}` - Single line
  - `{{contact.competitor_name}}` - Single line
  - `{{contact.competitor_review_count}}` - Number
  - `{{contact.niche_vertical}}` - Single line
  - `{{contact.nap_issue_count}}` - Number
- Created and verified 4 Reach tags:
  - `reach_enrolled`
  - `reach_error_compliance`
  - `reach_error_data`
  - `reach_replied`
- Created GHL draft workflow shell:
  - Name: `Reach Campaign - Draft Skeleton`
  - Trigger: tag added `reach_enrolled`
  - Status: Draft/unpublished
  - Contains note placeholders, not Send Email nodes
  - Mike visually confirmed: Draft, no Send Email, no enrolled contacts, no publish
- Updated Mission Control/jobs page status:
  - GHL fields/values/tags verified
  - Draft workflow skeleton exists
  - Live sending remains blocked
- Updated all public booking links in the website/repo from the old Hub360 URL to:
  - `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- Verified `npm run build` after website changes.
- Pushed latest commits to GitHub.

## Current blockers superseded by 2026-05-18 verification

- `/aoh-talk` public URL now loads and resolves to GHL calendar id
  `1Xq9XMNFjvxgxQj9kNLY`.
- `aoh_discovery_calendar_link` is populated in the active production location.
- `aoh_logo_url` is populated in the active production location.
- `aoh_physical_mailing_address` is populated in the active production
  location.
- Website visitor report intake, AI visibility intake, and combined report
  delivery workflows are published in the active production location.
- Combined report delivery was tested on a contact with both URLs and executed:
  wait -> branch -> send email -> update opportunity -> add tag -> finish.

## Remaining blockers

- Reach workflow must remain Draft. Do not publish.
- No Send Email nodes yet.
- No contact enrollment or test workflow runs yet.
- Vercel/GHL data-flow direction still needs final engineering decision:
  - Preferred current direction: Vercel updates GHL contact via API, writes fields, then applies `reach_enrolled` tag.

## Calendar build target

Calendar:
- Customer-facing name: `See if AOH fits`
- Internal name: `Discovery - Round Robin`
- Type: Team Calendar / Round Robin
- Duration: 30 minutes
- Buffer: 15 minutes before and 15 minutes after
- Booking window: 14 days out
- Minimum notice: 4 hours
- Team member: Mike Egidio only for now
- Distribution: round robin by availability
- Slug: `aoh-talk`
- Public URL target: `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`

Recommended calendar description:

```text
Most local businesses are leaking customers in one of four places: reviews, search visibility, follow-up, or missed calls.

In 30 minutes, we’ll look at your business and find the first obvious leak. No long questionnaire. No generic audit. Just a practical look at where customers may be dropping off and what AOH would fix first.

If there’s a simple DIY fix, we’ll tell you. If it makes sense for us to handle it, we’ll show you the cleanest next step.
```

Short version if GHL limits space:

```text
Find the first obvious leak in 30 minutes: reviews, visibility, follow-up, or missed calls. We’ll show you what we’d fix first, and if there’s a simple DIY fix, we’ll tell you.
```

Recommended logo URL for calendar/custom value:

```text
https://aioutsourcehub.com/logos/aoh-wordmark-dark-h480.png
```

If GHL requires square/avatar logo:

```text
https://aioutsourcehub.com/logos/aoh-icon-400-navy.png
```

Recommended lowest-friction booking form:
- Required: Name
- Required: Email
- Required: Phone
- Optional: Business name
- Required qualifying question:

```text
What should we look at first?
```

Choices:
- Google reviews
- Google / AI visibility
- More leads
- Missed calls
- Not sure

Do not ask for website/GBP link on the booking form. Ask after booking in the confirmation email.

Recommended confirmation message:

```text
You’re booked.

Before the call, reply to the confirmation email with your website or Google Business Profile link if you have it. That helps us look at the right business before we talk.

No prep required. We’ll keep it practical.
```

Redirect:
- Prefer no redirect/default GHL confirmation.
- If GHL requires redirect, use `https://aioutsourcehub.com` for now.
- Later build a dedicated `/thanks` page.

## Tomorrow pickup order

1. Keep the `Reach Campaign - Draft Skeleton` unpublished until final launch
   approval.
2. Have GHL Expert/Auditor verify:
   - calendar public page
   - form fields
   - confirmation message
   - calendar does not expose internal "Template Lab" language
3. Resume Reach workflow work only after final Sender/Coach/Auditor approval
   of the reply-first campaign copy and merge fields.

## Hard rules

- Do not publish `Reach Campaign - Draft Skeleton`.
- Do not add Send Email nodes yet.
- Do not enroll contacts.
- Do not click Test Workflow.
- Do not enable HighLevel AI features.
- Do not use placeholders in outbound email footers.
- Mike should be final approver, not technical investigator, whenever agents can do the work.
