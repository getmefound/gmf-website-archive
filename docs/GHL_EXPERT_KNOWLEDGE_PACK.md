# GHL Expert Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: GHL Expert
Service focus: Review Automation

## Job

GHL Expert owns the HighLevel backend setup after the client completes self-serve onboarding and Profile confirms Google Business Profile access.

GHL Expert does not own Google Business Profile access itself. Profile owns access and hands off when GMF has the correct Google profile authority.

## Core Mental Model

Review Automation needs two separate things:

1. Authority over the Google Business Profile.
2. A HighLevel integration that connects that profile into the client's subaccount.

Profile handles the authority step. GHL Expert handles the HighLevel connection and automation step.

HighLevel's GBP integration is the path that syncs Google messages, reviews, and reputation data into the CRM. Once connected, the Reputation area is where reviews, review requests, widgets, Reviews AI, summaries, and related reputation tools live.

## GMF Plan Boundary

Base Review Automation includes:

- automated email review requests after completed jobs
- one-time Google Business Profile audit/fix
- customer-flow mapping through CRM/POS or a simple form
- monthly digest of what was sent and what came in
- no setup fee, no contract

Base Review Automation does not include:

- SMS review requests
- AI-drafted review replies
- Reviews AI auto-replies
- ongoing AI Visibility work
- social review posting

Those belong to AI Visibility or another upgrade unless Mike explicitly approves an exception.

## Setup Flow

### 1. Confirm client is ready

Required before GHL setup:

- payment/order confirmed by Manager
- business basics submitted
- GMF has GBP manager access or a blocker is recorded
- review request/customer-flow details submitted

Optional but useful:

- customer list
- POS/CRM name
- logo/photo
- social posting access only for upgrade plans

### 2. Create or confirm subaccount

Create the client subaccount or confirm it already exists.

Check:

- business name
- address
- phone
- website
- timezone
- owner/manager user
- billing/rebilling settings if usage costs apply

### 3. Load Review Automation snapshot

Snapshots are reusable templates that copy selected configuration assets from one HighLevel subaccount to another. They can include workflow, triggers, custom fields, custom values, pipelines, tags, trigger links, forms, funnels, email templates, calendars, and other setup assets.

After loading:

- confirm Review Dashboard imported
- confirm workflows imported
- confirm custom values exist
- confirm trigger links exist
- confirm templates exist
- confirm no workflow is accidentally live before QA

### 4. Update custom values

Custom Values are key/value pairs that can be reused across the platform. Update the client's values before turning on workflows.

Typical base Review Automation values:

- business name
- owner name
- business phone
- website
- Google review link
- logo link
- personalized image link
- sending email/domain
- offer/referral text if used

Important rule: if a trigger link should track clicks, insert the actual trigger link into messages, not just a raw custom value URL.

### 5. Connect Google Business Profile inside HighLevel

After Profile confirms GMF has manager access:

1. Open the client subaccount.
2. Go to Settings > Integrations.
3. Connect Google Business Profile.
4. Sign in with the GMF Google account that has manager access.
5. Select the correct business/location.
6. Confirm the profile is connected.

Do not assume manager access means GHL is connected. Manager access only gives the GMF Google account permission to authorize the connection.

### 6. Confirm Reputation sync

Check Reputation after GBP connection:

- Google reviews appear or begin syncing
- correct location is connected
- no missing permissions warning is shown
- review data is visible in Reputation/Reviews
- messages/reputation data are flowing if included

If HighLevel shows missing permissions, use reconnect and grant the missing Google permissions.

### 7. Configure review request settings

Base Review Automation uses email review requests. Review requests can be sent manually or automatically from workflows.

GHL Expert should configure:

- Reputation > Settings > Review Link
- email request templates
- live template
- retry templates
- timing after check-in/trigger
- max retries
- review link token or element

HighLevel email templates can use the Review Link element. SMS review links and SMS templates are upgrade-plan work.

### 8. Configure workflow review requests

Use the workflow action for review requests when requests should be automated.

Common triggers:

- appointment completed
- job completed
- invoice paid
- customer tagged
- POS/CRM webhook received

The Review Request action sends the request through the configured Reputation settings. If the contact has an assigned user, workflow-sent requests can come from that assigned user.

### 9. Configure trigger links and webhooks

Trigger links record clicks in the contact activity timeline and can trigger follow-up workflow steps.

Use cases:

- review link clicked
- customer clicked offer/referral link
- unsubscribe/opt-out by channel
- dynamic URLs through custom values

Inbound webhooks receive data from external systems into HighLevel. Outbound/custom webhooks send data from HighLevel to external systems.

For POS/CRM later:

- use native integrations first when available
- otherwise use Zapier/Make/CRM Connector
- otherwise use inbound webhook into HighLevel
- map first name, last name, phone, email, customer status, and source system ID if available

Always test webhook payloads before launch.

### 10. Configure Reviews AI

Plan gate: Reviews AI belongs to AI Visibility or an approved upgrade, not base Review Automation.

Reviews AI can work in suggestive mode or auto-pilot mode. Reviews AI Agents can be created with tone, sentiment handling, language behavior, and brand instructions.

For GMF default:

- keep instructions short and specific
- use the client's requested tone/language
- configure positive/neutral/negative behavior intentionally
- review generated samples before trusting auto-pilot
- consider auto-replies only for allowed star ratings and sources

Drip Mode can pace replies to old unreplied reviews using caps, cadence, time windows, and AI agent/tone settings. Use this for backlog cleanup, not new-review automation.

### 11. Create review widget

HighLevel widgets can display connected and manual reviews on a website.

Configure:

- widget type: grid, masonry, slider, floating badge, or another approved style
- branding/style
- review source filters
- AI summary behavior if used
- write-a-review link
- embed code

Pass embed code/instructions to Manager or client-facing workflow if included in the plan.

### 12. Import customer list when ready

Sorter owns cleanup. GHL Expert owns import/activation.

Before import:

- Sorter confirms clean columns
- exclusions are removed
- consent/risk notes are documented

Import and launch:

- import contacts
- tag appropriately
- add contacts to workflow from Contacts when drip pacing is needed
- use drip mode/bulk pacing to prevent sending too much at once
- send during appropriate hours

### 13. QA before launch

Before marking done:

- subaccount exists
- snapshot loaded
- custom values updated
- GBP connected to correct location
- reviews visible/syncing, or documented pending state
- Reputation review link is correct
- email templates are assigned
- workflows are configured but not accidentally over-sending
- trigger links point to correct destinations
- webhook tests pass if POS/CRM is connected
- Reviews AI settings match client preference if the client has AI Visibility
- review widget exists if included
- Auditor has enough proof to verify

## Common Blockers

GBP not visible in HighLevel connection:

- GMF may not have accepted the manager invite.
- The wrong GMF Google account may be signed in.
- The client may have invited an individual account instead of the agency/business group.
- Profile should re-check access.

Reviews not syncing:

- wrong location selected
- GBP permissions incomplete
- reconnect needed
- profile not verified
- Google/HighLevel sync delay

Review link wrong:

- custom value not updated
- trigger link points to old URL
- Reputation review link still default/balanced when custom was intended

Workflow fired but no review request sent:

- email request templates not assigned
- channel disabled
- contact missing phone/email
- contact unsubscribed
- workflow action set to wrong review type

Webhook failed:

- wrong URL
- receiving app expects different method/body/auth
- test contact did not include expected object data
- trigger context does not carry needed data

## Source Links

- HighLevel GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- HighLevel Reputation hub: https://help.gohighlevel.com/support/solutions/48000449583
- Review request messages/widget setup: https://help.gohighlevel.com/support/solutions/articles/48000980328-reviews-review-requests-and-the-highlevel-review-widget
- Send review requests: https://help.gohighlevel.com/en/support/solutions/articles/48001222668
- Workflow action - Review Request: https://help.gohighlevel.com/support/solutions/articles/155000003291-workflow-action-review-request
- Guided Review Setup Wizard: https://help.gohighlevel.com/support/solutions/articles/155000005201-guided-review-setup-wizard-reputation-management-
- Reviews AI agents: https://help.gohighlevel.com/en/support/solutions/articles/155000005156
- Reviews AI modes: https://help.gohighlevel.com/support/solutions/articles/155000001074-maximizing-customer-engagement-with-reviews-ai-a-guide-to-suggestive-and-auto-pilot-modes
- Reviews AI Drip Mode: https://help.gohighlevel.com/support/solutions/articles/155000003579-reputation-management-drip-mode-in-reviews-ai
- Review widgets: https://help.gohighlevel.com/support/solutions/articles/155000005684-reputation-management-new-widget-types-full-ai-summary-control
- Manual reviews: https://help.gohighlevel.com/support/solutions/articles/155000007192-manual-reviews-add-manage-offline-reviews
- Multiple review platforms: https://help.gohighlevel.com/support/solutions/articles/155000004584
- Snapshots overview: https://help.gohighlevel.com/support/solutions/articles/48000982511-snapshots-overview
- Create snapshots: https://help.gohighlevel.com/support/solutions/articles/48000982512-creating-new-snapshots-in-highlevel
- Custom values: https://help.gohighlevel.com/support/solutions/articles/155000004705-custom-values-settings
- Trigger links: https://help.gohighlevel.com/support/solutions/articles/48000981404-trigger-links-overview
- Workflow triggers list: https://help.gohighlevel.com/support/solutions/articles/155000002292-a-list-of-workflow-triggers
- Inbound webhook trigger: https://help.gohighlevel.com/support/solutions/articles/155000003147-trigger-inbound-webhook
- Custom webhook action: https://help.gohighlevel.com/support/solutions/articles/155000003305/
- Outbound webhook action: https://help.gohighlevel.com/en/support/solutions/articles/155000003299-actions-webhook
