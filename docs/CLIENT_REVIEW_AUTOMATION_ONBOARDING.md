# Client Review Automation Onboarding

Status: draft v1
Audience: client-facing instructions to convert into page, screenshots, and video
Owner agent: Coach
Service: Review Automation

## Purpose

This onboarding is self-serve. The client does not need a default Zoom setup call.

The client buys Review Automation, then completes this checklist so GMF can configure the review request flow.

## Client Promise

Complete the steps below and our setup team will connect your Google Business Profile, configure your review automation, and let you know what is ready or what still needs attention.

## What The Client Must Complete First

Required:

- business information
- Google Business Profile manager invite to GMF
- review request/customer-flow details
- final confirmation

Helpful but can come later:

- customer list if available
- POS/CRM information if the client wants automatic ongoing sends
- logo/team photo

## Step 1: Business Information

Client provides:

- business name
- business address or service area
- business phone
- website
- owner/manager name
- owner/manager email
- best support/contact email
- timezone
- business category/industry

## Step 2: Review Request Preferences

Client chooses:

- how completed customers should enter the review flow
- whether they will provide a customer list, connect a POS/CRM later, or use a simple completed-job form
- whether review requests should start with a past customer list or only new customers going forward
- any customers or customer types to exclude

Client can add notes like:

- "Only send to completed jobs"
- "Do not send to warranty complaints"
- "Start with new customers only"

Review replies in the client's voice, SMS review requests, POS/CRM auto-sync, social review posting, and AI Visibility reports are upgrade/add-on items, not the base Review Automation plan.

## Step 3: Add GMF As Google Business Profile Manager

Client instruction:

1. Go to Google and search for your business while signed into the Google account that manages it.
2. Open your Business Profile.
3. Click Business Profile Settings.
4. Click People and access.
5. Click Add.
6. Enter the GMF manager email.
7. Choose Manager.
8. Send the invite.
9. Return to this onboarding page and confirm you sent it.

Client note:

Do not send your Google password. You are only inviting GMF as a Manager so we can connect your profile and help manage reviews.

## Step 4: Upload Customer List

Client can upload a CSV/spreadsheet now, paste rows from a spreadsheet, or mark "I will provide this later."

Best columns:

- email
- name
- phone
- date of service, if available
- notes, if useful

Client warning:

Do not include customers you do not want contacted for reviews. Remove angry/problem customers before uploading or note them clearly.

Current GMF upload support:

- `/client/[slug]/customers` accepts comma-separated rows and spreadsheet tab-paste.
- `/api/review-automation/customer-template?client=[slug]` downloads the CSV template.
- The upload page can check the list first without saving it, then submit after the row summary looks right.
- After a successful upload, the page links to `/mike-mc/review-proof/[slug]` for internal proof review before any live send.

## Step 5: POS / CRM Information

Client provides:

- POS/CRM name
- what event means a customer is ready for a review request, such as completed appointment, job closed, invoice paid, order fulfilled
- whether they know how to export customers
- whether they have an admin who controls this system
- whether the system supports CSV export, Zapier, Make, webhooks, or API access
- how often GMF should receive completed-customer data

This does not have to block initial backend setup.

Base setup starts with a manual upload or simple send-file flow. Automatic
POS/CRM sync is a paid setup/add-on after GMF confirms the client's system
can safely provide the right customer data.

## Step 6: Upgrade-Only Social / Reply Details

Skip this for the base Review Automation plan. Only collect this if the client bought or upgrades to AI Visibility, Review Intelligence, SMS, or another plan that includes replies, auto-sync, or social review posting.

Client provides:

- Facebook page access status
- Instagram business account access status
- who controls Meta Business Suite
- whether GMF should post 5-star reviews to social/GBP

## Step 7: Final Confirmation

Client confirms:

- business information is accurate
- GMF manager invite was sent
- review request preferences are accurate
- customer list is uploaded or will come later
- POS/CRM information is provided or will come later
- they understand GMF will review setup and contact them if anything is missing

## What Happens After Client Submits

Internal agent flow:

1. Manager checks the onboarding package.
2. Profile accepts/verifies Google Business Profile access.
3. Website/Codex or Systems confirms the GMF client record, review link, storage, and sender path.
4. Sorter cleans the customer list if provided.
5. Sender configures email review requests, send windows, suppression, and logging.
6. Auditor tests the setup.
7. Manager tells the client whether setup is complete or what is still needed.

## Screenshot/Video Requirements

Needed screenshots:

- where to find Business Profile Settings
- People and access
- Add user
- Manager role
- Send invite
- example customer list format

Needed video:

- 3-5 minute walkthrough of the whole onboarding
- separate 60-90 second video just for adding GMF as GBP Manager

## Agent Notes

Coach owns the client-facing copy and video script.

Profile owns the GBP access instructions.

Website/Codex and Systems own the GMF backend setup SOP.

Manager owns the onboarding status and client follow-up.
