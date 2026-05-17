# GHL Calendars And Conversations Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: GHL Expert
Scope: HighLevel booking calendars, appointment management, calendar sync, phone, SMS, email, and conversation basics.

## Job

GHL Expert should know how calendars and communication settings affect booking, reminders, Relay, Reach handoffs, and client follow-up.

## Booking Calendars

HighLevel booking calendars define how appointments are accepted and displayed.

Calendar setup includes:

- calendar type
- host/team member
- friendly calendar name
- custom URL
- appointment duration
- availability
- booking rules
- location or meeting link
- reminders
- embed/link sharing

Personal booking calendars are the foundation for one-to-one scheduling.

Round Robin team calendars should be used when a booking page may eventually distribute appointments across multiple team members. For AOH's internal discovery calendar, start with Mike as the sole team member, use availability-based distribution, and leave the structure ready for later team expansion.

For the AOH `Discovery - Round Robin` calendar, GHL Expert owns:

- calendar creation
- booking slug
- custom booking fields
- appointment-booked workflow
- tag routing
- pipeline/stage movement
- confirmation email
- reminder SMS steps
- internal notification

Auditor must review the build with test bookings before Manager marks it live.

## Connected, Linked, And Conflict Calendars

Connected calendars authorize HighLevel to access an external calendar account such as Google, Office 365, or Outlook.

Linked calendars import events and availability into HighLevel.

Conflict calendars block HighLevel booking slots when external calendar events overlap.

Write-back can create HighLevel bookings on the external calendar. Use write-back carefully, usually on one primary calendar, to avoid duplicates.

## Manual Booking

HighLevel can manually book appointments from:

- Conversations
- Contacts
- Calendar view
- Opportunities

Manual booking is useful when:

- a lead agrees by phone/SMS
- a client cannot book themselves
- a team member needs to lock a slot
- GHL Expert needs to QA reminders or booking logic

Manual bookings should include:

- correct calendar
- correct contact
- title
- date/time
- timezone
- location/meeting link
- notes if needed

## Appointment Notes

Appointment notes capture internal context tied to a calendar event. They can flow across related contact, opportunity, and conversation records.

Use notes for:

- meeting context
- call summary
- client preferences
- handoff details
- follow-up instructions

## Reminder Workflows

Appointment workflows commonly handle:

- confirmation messages
- reminders
- no-show follow-up
- reschedule links
- internal notifications
- post-appointment review requests

Calendar QA should include test bookings and reminder timing checks.

## Email, Phone, And SMS Setup

HighLevel communication setup includes:

- dedicated email domain for deliverability
- phone number setup
- call forwarding
- SMS setup
- one-to-one contact communication
- bulk SMS/email, only when consent and pacing are handled

GHL Expert should test communication channels before launch.

## Conversations

Conversations centralize SMS, email, calls, and other customer communication.

Use conversations for:

- client/lead replies
- booking from a message thread
- contact context
- handoff to Scheduler/Booker/Relay

For AOH, Conversations matter for Relay and Reach because replies and calls need to become tasks, bookings, or opportunities.

## QA Checklist

Before calendar/conversation setup is considered ready:

- calendar exists
- team member/host is correct
- availability is correct
- booking link works
- conflict calendars are connected if needed
- write-back is enabled only where intended
- test appointment creates correctly
- reminders fire correctly
- phone number configured if needed
- email/SMS send test passes
- conversation record shows the expected activity

## Common Blockers

Double booking:

- conflict calendar missing or wrong
- write-back duplicated events
- availability too broad

Appointment reminders not sending:

- workflow inactive
- wrong trigger
- missing phone/email
- channel not configured

Booking link wrong:

- wrong calendar URL
- wrong host/team member
- calendar not published/available

SMS/email failure:

- phone/email setup incomplete
- contact unsubscribed
- sending domain not configured
- bulk send/pacing issue

## Source Links

- Setup booking calendar: https://help.gohighlevel.com/support/solutions/articles/155000005061
- Round Robin team assignments: https://help.gohighlevel.com/support/solutions/articles/155000002711-managing-team-member-assignments-in-round-robin-calendars
- Customer booked appointment trigger: https://gohighlevelassist.freshdesk.com/support/solutions/articles/155000002675-workflow-trigger-customer-booked-appointment
- Manual booking appointments: https://help.gohighlevel.com/support/solutions/articles/48001209829
- Linked and conflict calendars: https://help.gohighlevel.com/en/support/solutions/articles/155000002374
- Appointment notes: https://help.gohighlevel.com/support/solutions/articles/155000003444
- Email, phone, SMS setup: https://help.gohighlevel.com/support/solutions/articles/155000005058-getting-started-setup-email-phone-and-sms
