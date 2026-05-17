# AOH Discovery Round Robin Calendar

Status: ready for GHL Expert build
Owner agent: GHL Expert
Reviewer: Auditor
Client: AOH
Service: Internal Sales Intake

## Goal

Create one central HighLevel booking calendar for visitors who want to see whether AOH fits.

Public booking URL:

- `app.gohighlevel.com/widget/booking/talk`

## Calendar

- Type: Team Calendar / Round Robin distribution
- Customer-facing name: See if AOH fits
- Internal name: Discovery - Round Robin
- Duration: 30 minutes
- Buffer: 15 minutes before and 15 minutes after
- Booking window: 14 days out
- Minimum notice: 4 hours
- Team members: Mike Egidio only for now
- Distribution: Round robin by availability
- Booking URL slug: `talk`

## Booking Page Copy

Headline:

Tell us where you're stuck.

Body:

30 min, no pitch deck. We'll show you what's actually broken in how customers find you or don't, and what we'd fix first.

## Booking Fields

Use native contact fields where possible:

- Name - required
- Business name - required
- Email - required
- Phone - required
- Website - optional

Create custom fields:

- `aoh_bottleneck`
  - Label: What's slipping right now?
  - Type: single select
  - Required: yes
  - Options:
    - Customers aren't finding me online
    - Calls and leads keep slipping through
    - Buried in admin and follow-up
    - Not sure yet - want to look around
- `aoh_discovery_notes`
  - Label: Anything we should know before we talk?
  - Type: textarea
  - Required: no
  - Limit: 500 characters if HighLevel supports the limit in the field/form
  - Placeholder: e.g. tried SEO before, run a 3-location shop, booked solid Mon-Wed only...

## Workflow

Trigger:

- Customer booked appointment
- Calendar: Discovery - Round Robin

Step 1 - Tag contact:

- Always add `discovery-booked`
- If bottleneck is `Customers aren't finding me online`, add `interest-getfound`
- If bottleneck is `Calls and leads keep slipping through`, add `interest-find`
- If bottleneck is `Buried in admin and follow-up`, add `interest-run`
- If bottleneck is `Not sure yet - want to look around`, add `interest-explore`

Step 2 - Move/create opportunity:

- `interest-getfound` -> pipeline `Reviews Outreach`, stage `Demo Booked`
- `interest-find` -> pipeline `Relay / Missed-Call`, stage `Demo Booked`
- `interest-run` -> pipeline `Operations Audit`, stage `Demo Booked`
- `interest-explore` -> pipeline `General Discovery`, stage `Demo Booked`

Step 3 - Internal notification:

Send Slack webhook if connected. If not connected, send email to Mike.

Message:

```text
New discovery booked: {{contact.name}} @ {{contact.company_name}}
Bottleneck: {{custom.aoh_bottleneck}}
Notes: {{custom.aoh_discovery_notes}}
Call time: {{appointment.start_time}}
Website: {{contact.website}}
```

Step 4 - Confirmation email:

- Delay: 5 minutes after booking
- Subject: You're booked - {{appointment.start_time}}

```text
Hey {{contact.first_name}},

You're confirmed: {{appointment.start_time}}.
Call with {{assigned_user.first_name}} from AOH.

What to expect:
- 30 min, conversation not pitch
- We'll dig into "{{custom.aoh_bottleneck}}" and show you what we'd actually fix first
- If we're not the right fit, we'll say so

Before the call - if you have 60 seconds, drop your Google Business Profile link in reply. Saves us 10 min on the call.

- AOH team
support@aioutsourcehub.com
877-521-2224
```

Step 5 - SMS reminder:

- Timing: 24 hours before appointment

```text
Hi {{contact.first_name}}, this is AOH. Reminder your call with {{assigned_user.first_name}} is tomorrow at {{appointment.start_time_short}}. Reply R to reschedule.
```

Step 6 - SMS reminder:

- Timing: 1 hour before appointment

```text
Heads up - your AOH call is in 1 hour. Join link or we'll call you: {{appointment.meeting_url}}
```

## Auditor QA

Auditor must test four bookings, one for each bottleneck answer.

For each test, confirm:

- booking link works
- assigned user is Mike
- appointment lands on the correct calendar
- contact fields populate
- `discovery-booked` tag is added
- correct interest tag is added
- correct opportunity pipeline/stage is created or updated
- internal notification includes name, business, bottleneck, notes, call time, and website
- confirmation email has no broken merge fields
- 24-hour SMS is queued/scheduled
- 1-hour SMS is queued/scheduled
- booking page URL and notification content expose no secrets/tokens

## Source Notes

HighLevel docs to use during setup:

- Booking calendar setup: https://help.gohighlevel.com/support/solutions/articles/155000005061
- Round Robin assignment behavior: https://help.gohighlevel.com/support/solutions/articles/155000002711-managing-team-member-assignments-in-round-robin-calendars
- Customer booked appointment trigger: https://gohighlevelassist.freshdesk.com/support/solutions/articles/155000002675-workflow-trigger-customer-booked-appointment
