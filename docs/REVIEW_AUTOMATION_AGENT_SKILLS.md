# Review Automation Agent Skills

Status: draft source of truth
Scope: what each agent must know before GMF runs self-serve Review Automation onboarding for real clients.

## Service Principle

The client completes access and intake asynchronously. Agents do the backend setup after the client finishes enough of the onboarding package.

Default path:

1. Client buys Review Automation.
2. Client gets self-serve instructions with screenshots and video.
3. Client fills out business info and invites GMF as Google Business Profile Manager.
4. Profile confirms access.
5. GHL Expert connects GBP inside HighLevel and configures review automation.
6. Sorter/GHL Expert handle customer list and POS/CRM connection as the next phase.
7. Auditor verifies launch.

Base Review Automation is email-only review automation plus a one-time Google Business Profile audit/fix and monthly digest. SMS review requests, Reviews AI, AI-drafted replies, ongoing AI Visibility work, and social review posting belong to AI Visibility or another approved upgrade.

## Scout Skill Pack

Purpose: keep the knowledge current.

Scout must know how to research:

- official HighLevel docs for Reputation, GBP integration, workflows, snapshots, custom values, widgets, webhooks, email sending, and CRM integrations
- official HighLevel docs for Reviews AI, phone/SMS, and social planner as upgrade/service modules
- official Google Business Profile docs for owners/managers, agency invites, verification, reviews, posts, photos, services, and profile edits
- saved GMF Drive/Obsidian SOPs and checklist notes
- edge cases from client onboarding problems

Scout output should be:

- source link
- plain-English summary
- what changed
- what agent needs to learn it
- suggested SOP update

Scout should hand research to Coach, not directly rewrite specialist instructions without review.

## Coach Skill Pack

Purpose: turn raw knowledge into usable training.

Coach must maintain:

- client-facing onboarding instructions
- agent-facing SOPs
- troubleshooting guides
- glossary of GHL/GBP terms
- "done means" checklists
- training examples for each agent

Coach should keep client instructions simple and task-based. Specialist detail belongs in agent SOPs, not client pages.

## Profile Skill Pack

Purpose: own Google Business Profile access and profile readiness.

Profile must know:

- how a client adds GMF as a Google Business Profile Manager
- the difference between Owner and Manager
- what Managers can do and cannot do
- how GMF accepts manager invites
- how to confirm the correct GBP location
- how to check if GBP is verified
- how to find or generate the Google review link
- how to identify if the wrong Google account/location was connected
- how to check basic profile health: name, address, phone, website, hours, categories, services, photos, reviews, unanswered reviews
- when to hand off to GHL Expert

Profile should know that Manager access gives GMF authority over the profile, but does not automatically connect the profile to HighLevel. GHL Expert still needs to connect GBP inside the client subaccount using an GMF Google account with manager access.

Profile "done" means:

- GMF manager invite accepted
- correct business/location confirmed
- GBP verified or verification blocker recorded
- review link captured
- any access/profile blocker assigned to Manager
- GHL Expert notified that GBP is ready to connect

## GHL Expert Skill Pack

Purpose: own HighLevel setup and automation.

GHL Expert must know:

- how to create or confirm the client subaccount
- how to apply the Review Automation snapshot
- how to confirm the review dashboard imported
- how to update business settings
- how to update custom values
- how to connect Google Business Profile inside HighLevel
- how to confirm Google reviews are syncing into Reputation
- how to configure Reputation settings
- how to keep base Review Automation email-only unless the client has AI Visibility
- how to configure Reviews AI and reply tone/signature for AI Visibility upgrades
- how to configure review request workflows
- how to configure trigger links and webhooks
- how to create review widgets
- how to configure email sending basics
- how to configure phone/SMS basics for upgrade plans and other services
- how to connect POS/CRM later through native integration, Zapier, CRM Connector, or manual CSV flow
- how to test the setup before launch

GHL Expert "done" means:

- subaccount exists
- snapshot loaded
- business settings and custom values updated
- GBP connected inside HighLevel
- reviews visible/syncing in Reputation, or blocker recorded
- review request workflow configured
- Reviews AI configured only if AI Visibility or another upgrade is included
- review widget created if included
- launch test passed or blocker assigned
- Auditor notified for verification

## Sorter Skill Pack

Purpose: own customer list readiness.

Sorter must know:

- accepted list formats
- required fields: name, email, phone
- how to clean headers
- how to split combined fields
- how to dedupe
- how to remove bad rows
- how to flag missing consent or risky records
- how to exclude customers the client does not want contacted
- how to prepare a clean import file for GHL Expert

Sorter "done" means:

- list is clean enough to import
- columns are mapped
- exclusions are removed
- risks are documented
- GHL Expert has the prepared list

## Auditor Skill Pack

Purpose: verify setup and monitor early launch.

Auditor must know how to check:

- GBP is connected to the correct client
- reviews are syncing into Reputation
- review link points to the correct profile
- custom values are not blank or wrong
- workflows are active only where intended
- test contact receives the expected message/email
- reply number and links are correct
- Reviews AI tone/signature are correct if the client has AI Visibility
- customer list import did not create obvious bad data
- first 1-2 weeks of send/review activity

Auditor "done" means:

- launch QA passed
- proof notes/screenshots exist
- monitoring cadence is scheduled
- blockers are assigned to Manager or the correct specialist

## Manager Skill Pack

Purpose: keep the client moving.

Manager must know:

- what onboarding items are required before agent setup
- what can wait until after base setup
- when to ask client for missing access
- when to ask Mike for a decision
- how to assign each blocker to the right agent
- how to report status to the client

Manager "done" means:

- client is in the correct stage
- all blockers have one owner
- client has been told what is missing or what is complete
- Mission Control reflects the current truth

## Client Self-Serve Onboarding Sections

Client-facing instructions should be built around these sections:

1. Business information
2. Review request/customer-flow preferences
3. Google Business Profile manager invite to GMF
4. Customer list upload, optional at first
5. POS/CRM information for later integration
6. Upgrade-only reply/SMS/social details, only if included
7. Final confirmation

## Current Research Anchors

- Google says Business Profile Managers can edit profile info, manage posts/photos, respond to reviews, respond to Q&A, and download insights, but cannot add/remove users or remove the profile.
- Google supports agency-style management through organization/business group invites.
- HighLevel says connecting GBP lets businesses sync Google messages, reviews, and reputation data into the CRM.
- Google Business Profile APIs can list, retrieve, and reply to reviews when properly authorized.

## Source Links

- Google Business Profile owner/manager permissions: https://support.google.com/business/answer/3403100
- Google Business Profile agency invites: https://support.google.com/business/answer/7655924
- HighLevel GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- HighLevel Reputation Management docs: https://help.gohighlevel.com/support/solutions/48000449583
- Google review API capabilities: https://developers.google.com/my-business/content/review-data
