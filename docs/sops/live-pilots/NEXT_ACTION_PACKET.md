# GMF Pilot Next Action Packet

Status: live pilot running in Monday and docs
Owner: Manager/Coach
Created: 2026-05-27
Purpose: exact next steps after identifying a friend test client and GMF GBP setup as live SOP pilot candidates.

## Immediate Next Steps

1. Verify friend GBP Manager access.
2. Fill the friend test-client intake.
3. Record manual non-billing client start approval.
4. Create the client pilot shell.
5. Run the baseline visibility report.
6. Run GBP/Get Found audit steps.
7. Capture proof and Auditor decision.
8. Promote SOPs from Drafted to Active only after live pilot proof passes.

## Step 1 - Verify Friend GBP Manager Access

Profile Manager owns this first. Do not ask Mike until Profile Manager exhausts existing access.

Profile Manager must retrieve or verify:

- business name
- Google Business Profile URL
- email/account that was invited as Manager
- whether the invite was accepted
- role shown for the account
- review count/rating visible in the GBP panel
- review link
- website, hours, address/service-area setting, categories, and services visible in GBP

Current pilot business:

- Southington Lawn Service LLC
- Provided Google local/search link is recorded in `docs/sops/live-pilots/FRIEND_TEST_CLIENT_INTAKE.md`
- Invited account: Mike answered the Slack ask with `Mike@getmefound.ai`; use `mike@getmefound.ai` as the current account candidate. Original note said the friend may have added/displayed `admin@getmefound.ai`, so Profile Manager verifies the actual accepted account and role inside GBP.
- Access direction: Mike says Profile Manager has access and can get what is needed.
- Consent note: Mike reports this was handled verbally with the friend

Profile Manager verifies:

- correct business/profile
- correct role
- no password sharing
- no public edits before approval

Evidence file:

- `docs/sops/live-pilots/2026-05-27-SOP-005-friend-gbp-access-evidence.md`

Current status:

- Agent-owned verification. On 2026-05-28, Profile Manager/Codex exhausted workspace repo/env, package dependencies, accessible Gmail, Slack history, Yardbook/public web, and a Google review-link HTTP redirect.
- Captured without Mike: Bill Leifert contact/signature facts, `southingtonlawn@gmail.com`, `southingtonservices@gmail.com`, `(203) 217-9137`, Yardbook quote path, Google review URL, and place ID `ChIJxypnrEz5KkYRgxXufgych38`.
- Still not captured: accepted Manager role, clean authenticated GBP/profile URL, review count/rating, hours, GBP category/services, website, and address/service-area setting.
- No Google Business Profile API credential, authenticated browser session, or invite email was available from current tools. This is not an owner ask yet; Systems Director/Profile Manager must first establish or use a safe read-only GBP verification path.
- Monday items should remain Agent Working until Profile Manager proves access failure, wrong profile, or an owner/public-edit approval need.

## Step 2 - Fill Friend Intake

Use:

- `docs/sops/live-pilots/FRIEND_TEST_CLIENT_INTAKE.md`

Public/client-originated facts already captured:

- Yardbook quote page found for Southington Lawn Service LLC.
- Client-originated contact found: Bill Leifert.
- Business emails found: `southingtonlawn@gmail.com` and `southingtonservices@gmail.com`.
- Phone found from email signatures and public source: `(203) 217-9137`; confirm before profile edits.
- Services found from quote page: Weekly Lawn Maint., Aeration, Aeration+Overseeding, Dethatching, Fall Cleanup, Spring Cleanup, Other.
- Location clue: Southington, CT 06489; exact address and service-area display need confirmation.
- Partial hours clue: Wednesday 8:00 AM - 5:00 PM; full weekly hours need confirmation.
- Review URL captured from client-originated signature: `https://g.page/r/CYMV7n4MnId_EB0/review`.
- Review URL redirect tested to place ID `ChIJxypnrEz5KkYRgxXufgych38`.

Minimum required:

- owner name
- business name
- website or confirmed no owned website
- primary service/category
- phone
- email/contact
- service area or address rules
- current GBP link
- what we are allowed to change publicly

Current remaining confirmations:

- exact GBP profile URL from inside Google Business Profile
- whether `mike@getmefound.ai` has Manager access on the correct profile
- review count/rating from the live GBP panel
- full weekly hours
- whether the address should be hidden as a service-area business
- owned website/domain, if any
- final approved service list and service areas

## Step 3 - Manual Non-Billing Client Start

Because this is a friend test client, do not fake a Stripe payment.

Record it as:

- manual start
- non-billing pilot
- Mike-approved test client
- no paid client claim

SOPs involved:

- SOP 003 - Sales To Client Handoff
- SOP 040 - Closed-Won Handoff
- SOP 054 - Manual Client Start

## Step 4 - Create Client Pilot Shell

Create:

- test client ID
- folder/proof location
- client hub shell or placeholder
- magic-link test path if applicable
- onboarding status

SOPs involved:

- SOP 004 - Client Onboarding And Magic-Link Hub Setup
- SOP 055 - Magic-Link Client Access
- SOP 062 - Client Hub Status Update

## Step 5 - Baseline Visibility Report

Reporter runs a safe public scan:

- website
- GBP/profile
- business facts
- services/location clarity
- review freshness
- photos/media
- obvious crawlability/index clues
- competitor context only if useful

Do not make edits yet.

SOPs involved:

- SOP 060 - Client Baseline Visibility Report
- SOP 065 - Google AI Search Readiness Audit
- SOP 071 - Crawlability And Index Eligibility Check

## Step 6 - GBP/Get Found Work

Profile Manager prepares recommendations:

- category/services
- hours/phone/website/description
- website/profile fact sync
- review link
- photo/media
- public edit list

Public edits require friend approval first.

SOPs involved:

- SOP 005 - GBP Access Request And Verification
- SOP 006 - Get Found Fulfillment
- SOP 064 - GBP Audit
- SOP 066 - GBP Category And Service Review
- SOP 067 - Hours, Phone, Website, And Description Review
- SOP 069 - Review Link Capture And Test
- SOP 070 - Website/Profile Fact Sync
- SOP 172 - Public Profile Edit Approval

## Step 7 - Review Path

Only continue into live review requests if:

- friend approves
- customer list is real
- consent/source is clear
- suppression checks pass
- proof preview is approved
- Manager approves live send

SOPs involved:

- SOP 007 - Review Request Send Readiness And Live Send Guardrail
- SOP 074 - First Review Request Path Setup
- SOP 078 - Weekly Customer/Job Upload
- SOP 079 - Customer List Cleaning
- SOP 080 - Review Request Send Candidates
- SOP 081 - Email Review Request Send

## Step 8 - GMF GBP Setup In Parallel

Fill:

- `docs/sops/live-pilots/GMF_GBP_SETUP_INTAKE.md`

Needed from Mike:

- public business name
- website
- phone/contact path
- service area or address decision
- category
- hours
- Google owner account
- whether a GMF GBP already exists

Do not create duplicate profiles. Do not keyword-stuff the business name. Do not show an address unless it is eligible and approved.

## What Profile Manager Needs To Do Now

Minimum before any further owner ask:

1. Confirm whether `mike@getmefound.ai` has accepted GBP Manager access on the correct Southington profile.
2. Confirm the clean GBP/Maps profile URL for Southington Lawn Service LLC.
3. Match the authenticated GBP to place ID `ChIJxypnrEz5KkYRgxXufgych38`.
4. Capture review count/rating and confirm the captured review link.
5. Capture website, phone, service area/address rule, hours, preferred services, categories, and profile notes from GBP and public sources.
6. Return only true gaps to Manager.

Everything else can be handled from the workflow after those facts exist.

## Owner Learning Follow-Up

Mike answered the email/account question and then clarified that Profile Manager has access. Manager should not guide Mike through GBP screens unless Profile Manager cannot use access directly.

First guided check for Mike:

1. Open Google while signed into `mike@getmefound.ai`.
2. Search Google for `Southington Lawn Service LLC`.
3. If Google shows "You manage this Business Profile" or an edit/profile dashboard, open it.
4. Check People and access, or the profile settings access area.
5. Report only these fields back to Manager:
   - role shown for `mike@getmefound.ai`
   - whether invite is accepted or pending
   - clean profile URL
   - review count/rating shown in the profile panel

Use the guided check only if Profile Manager cannot access GBP and Mike must personally verify access.

## First SOPs Likely To Activate

If the friend pilot goes cleanly, these are the first likely activations:

- SOP 005 - GBP Access Request And Verification
- SOP 060 - Client Baseline Visibility Report
- SOP 064 - GBP Audit
- SOP 065 - Google AI Search Readiness Audit
- SOP 069 - Review Link Capture And Test
- SOP 070 - Website/Profile Fact Sync
- SOP 166 - Auditor Proof Gate
- SOP 167 - Client-Facing Claim Audit

## Stop Conditions

Stop and ask for approval before:

- public GBP edits
- review request sends
- SMS sends
- checkout/payment changes
- HighLevel AI feature toggles
- agentic checkout/payment work
- anything that could affect reputation, billing, privacy, or Google profile ownership
