# SOP 004 - Client Onboarding And Magic-Link Hub Setup

Status: Drafted
Version: 0.2
Owner: Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-004-client-onboarding-magic-link-hub-setup.md`

## Purpose

Create the client operating shell after signup: client ID, folder, hub, magic-link access path, onboarding status, and proof locations.

## Covered Master Map Rows

- Client ID, folder, and hub shell
- Magic-link client access
- Client hub status update
- Client baseline visibility report handoff

## Trigger

Onboarding opens after a valid closed-won handoff.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Creates client record, slug, hub path, magic-link access, and storage references |
| Account Manager | Sends welcome and owns client-safe status updates |
| Reporter | Creates baseline/client report artifacts when assigned |
| Auditor | Checks access safety and client-facing copy |
| Manager | Owns onboarding status and blocker routing |

## Hard Rules

- Do not describe client access as password-based.
- Do not expose another client's report, slug, private notes, upload links, or proof artifacts.
- Do not issue magic-link access before the client record and correct contact are confirmed.
- Do not put secrets, internal risk notes, or private credentials on the client hub.

## Procedure

1. Confirm onboarding is authorized.
   - Verify SOP 003 handoff proof exists.
   - Confirm client name, primary contact, email, website, location, plan, and partner/referral code if any.

2. Create client ID and slug.
   - Use a clear, stable slug.
   - Check for collisions with existing clients/prospects.
   - Log client ID, slug, and owner.

3. Create folder/storage shell.
   - Create or identify storage for assets, reports, proof, uploads, and exports.
   - Record folder link in the internal client record.

4. Create client hub shell.
   - Include plan, status, what is done, what is waiting, reports, proof, customer upload path, and next useful opportunity.
   - Keep internal notes separate.

5. Configure magic-link access.
   - Issue access only for the correct client contact.
   - Use revocable/refreshable link rules from the auth lifecycle SOP.
   - Test access in a safe way before sending.

6. Set onboarding status.
   - Status starts as setup/open, waiting-on-client, in-progress, ready-for-audit, or done.
   - Add first blockers and first requested client action.

7. Hand off to Account Manager.
   - Account Manager sends welcome email and first ask.
   - Systems Director stays owner of access/auth blockers.

## Required Proof

- Client record
- Client slug
- Folder/storage link
- Hub URL/path
- Magic-link access test result
- Onboarding status
- Assigned Account Manager

## Failure Or Blocker Handling

- Duplicate slug: choose a clear alternative and log alias.
- Wrong contact: hold magic link until corrected.
- Hub data mismatch: Auditor blocks send until fixed.
- Magic link fails: Systems Director resolves before client email.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded onboarding shell, magic-link, hub safety, and handoff rules | Coach |

## Source Documents

- `docs/client-ops-ledger/client-hub-runbook.md`
- `docs/GMF_WEBSITE_MESSAGING_CLIENT_HOME_BRIEF.md`
- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

