# GHL Integrations And Troubleshooting Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: GHL Expert
Scope: integrations, rebilling/wallets, social planner, phone/SMS/email issues, and common HighLevel failure patterns.

## Job

GHL Expert should be able to diagnose why a HighLevel setup is not working before it becomes a client-facing problem.

This pack supports Review Automation, Reach, Relay, Publishing, and future client operations.

## Integration Model

Use the simplest reliable integration path first.

Preferred order:

1. Native HighLevel integration.
2. Google/Facebook/Stripe/direct platform connection.
3. Zapier or Make.
4. CRM Connector or niche-specific connector.
5. Inbound webhook.
6. Manual CSV process with reminders.

Do not block a client launch waiting for the perfect POS/CRM integration if the core service can begin with manual data.

## Google Business Profile Integration

GBP integration connects Google profile interactions to HighLevel.

It can sync:

- reviews
- messages
- reputation data
- Google Search/Maps interactions into the CRM context

Common blockers:

- wrong Google account
- AOH manager invite not accepted
- wrong location selected
- profile not verified
- permissions missing
- token expired or reconnect required

Profile verifies Google access. GHL Expert reconnects/configures inside HighLevel.

## Social Planner

Social Planner is used to schedule and manage social content.

It can connect channels such as:

- Facebook
- Instagram
- Google Business Profile
- LinkedIn
- other supported social channels

Notes:

- Some Social Planner features can be explored before connecting accounts.
- Publishing requires connected accounts.
- GBP posts can be scheduled through HighLevel's GBP Post Scheduler.
- Facebook Post Sync can import past Facebook page posts into Social Planner for management and analytics.
- Mentions/tags vary by channel; Facebook and LinkedIn company pages support mentions, while Instagram/TikTok/GMB may use plain text behavior depending on channel support.

Press owns content publishing. GHL Expert/Profile own connection health.

## Rebilling And Wallets

HighLevel usage costs can flow through agency wallets and/or subaccount wallets depending on rebilling setup.

GHL Expert should understand:

- if no rebilling is enabled, the agency wallet pays for subaccount LC service usage
- agency wallet reloads from agency card when below threshold
- rebilling can pass usage through to the subaccount wallet/card
- SaaS/rebilling modes require valid payment setup
- with markup, agency may charge subaccount wallet at a marked-up price
- some SaaS V2 reselling/rebilling products use subaccount wallet

For AOH:

- Manager owns client payment status
- GHL Expert confirms usage/billing risk before launch
- Auditor watches unusual usage/cost drift

## SMS Delivery Troubleshooting

SMS delivery can fail at multiple layers:

- HighLevel/contact settings
- LC Phone/Twilio layer
- carrier network layer
- compliance/A2P registration
- invalid number or wrong sender number

Check:

- contact is not DND/opted out
- contact phone is mobile/SMS-capable
- from number belongs to the correct location
- from number is SMS-capable
- A2P/10DLC requirements are satisfied for US traffic
- message content is compliant
- conversation screen shows error code/details
- bulk sends are not overloading queues

If a contact opted out, they may need to text START to opt back in, depending on provider/path.

## A2P / 10DLC

For US application-to-person SMS, A2P 10DLC registration is a carrier requirement.

GHL Expert should check:

- business info matches registration
- opt-in language exists
- privacy policy and terms are present
- message use case is accurate
- required footer/opt-out language is present
- DBA/subdomain info is correct
- campaign approval is complete before large-scale sends

Review Automation and Relay should not depend on unapproved SMS at scale.

## Email Delivery Troubleshooting

Email setup should use a dedicated/authenticated sending domain where possible.

Check:

- Settings > Email Services configured
- domain/subdomain added and verified
- sender address is valid
- template links work
- contact email exists
- contact unsubscribed/bounced status
- Bulk Actions stats for error reports
- deliverability warnings/spam complaints

For critical launch tests, send to a known test contact first.

## Phone Number Troubleshooting

Common phone/SMS blockers:

- number is not SMS-capable
- number does not belong to the location
- number is not linked to approved A2P campaign
- from number format is wrong
- number recently moved
- messaging not enabled on the number
- call forwarding is missing or wrong

Check Settings > Phone Numbers and number configuration.

## Integration QA Checklist

Before launch:

- connected accounts are correct
- social/GBP/Google accounts belong to right client
- phone/email/SMS test passes
- A2P status is known if SMS is used
- wallet/rebilling risk is known
- webhook tests pass if used
- POS/CRM integration status is clear
- manual fallback exists if POS/CRM is delayed
- blockers are assigned to Manager/Profile/GHL Expert as appropriate

## Source Links

- GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- Social Planner setup: https://help.gohighlevel.com/support/solutions/articles/155000005063-getting-started-setup-social-planner
- GBP Post Scheduler: https://help.gohighlevel.com/support/solutions/articles/155000007212-google-business-profile-gbp-post-scheduler-in-highlevel
- Facebook Post Sync: https://help.gohighlevel.com/support/solutions/articles/155000007490-facebook-post-sync-in-social-planner
- Mentions/tags in Social Planner: https://help.gohighlevel.com/support/solutions/articles/155000002679--mention-or-tag-profile-in-posts-from-social-planner
- Rebilling/wallets: https://help.gohighlevel.com/support/solutions/articles/155000002095-rebilling-reselling-and-wallets-explained
- SaaS V2 rebilling: https://help.gohighlevel.com/support/solutions/articles/155000005083-reselling-and-rebilling-through-saas-v2-payment-providers
- Email, phone, SMS setup: https://help.gohighlevel.com/support/solutions/articles/155000005058-getting-started-setup-email-phone-and-sms
- SMS delivery troubleshooting: https://help.gohighlevel.com/support/solutions/articles/48000981696-troubleshooting-sms-delivery
- Not SMS-capable from number: https://help.gohighlevel.com/support/solutions/articles/48001180919-error-the-from-phone-number-is-not-a-valid-sms-capable-phone-number-
- A2P approval in 2026: https://help.gohighlevel.com/support/solutions/articles/155000007237-how-to-get-your-phone-number-a2p-approved-in-2026
