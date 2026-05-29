# SOP 005 - Google Business Profile Access Request And Verification

Status: Drafted
Version: 0.4
Owner: Profile Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-005-google-business-profile-access-request-verification.md`

## Purpose

Request, confirm, and verify Google Business Profile access without asking for passwords or editing the wrong profile.

## Covered Master Map Rows

- GBP access request
- GBP access verification

## Trigger

- New client needs Google Business Profile setup
- Client says access was sent
- Profile work cannot begin because access is missing or wrong

## Roles

| Role | Responsibility |
|---|---|
| Account Manager | Sends client access instructions and reminders |
| Profile Manager | Verifies profile, role, and access level |
| Auditor | Checks proof and wrong-profile risk |
| Manager | Routes unresolved access blockers |

## Hard Rules

- Never ask for the client's Google password.
- Client keeps ownership/control of their Google account and profile.
- Verify exact business name, address/service area, website, and phone before edits.
- Do not edit a GBP unless access, profile identity, and approval path are clear.
- Do not ask Mike for a GBP fact that Profile Manager can verify from existing GBP access.
- If Profile Manager has access, Profile Manager must inspect the profile first and document proof before any owner ask.

## Procedure

1. Prepare the access request.
   - Confirm business name, website, public GBP link if available, and primary contact.
   - Send client instructions to add GMF as a Manager on the correct Google Business Profile.

2. Client instruction text.

```text
We do not need your Google password. Please add our business email as a Manager on your Google Business Profile. That lets us help with profile updates, posts, photos, review links, and visibility checks while you stay in control.
```

3. Track the request.
   - Log sent date and due date.
   - If missing, follow up every two business days through Account Manager.

4. Verify access.
   - Confirm the invitation arrived and was accepted.
   - Confirm role level is sufficient for planned work.
   - Confirm the profile matches the client record.
   - Use existing Profile Manager access before asking the owner for facts.
   - Capture available profile facts from access: clean profile URL, role, review count/rating, review link, website, hours, address/service-area setting, categories, services, and public contact data.
   - If the owner answers only one field, record that partial answer immediately instead of re-asking the whole checklist.
   - If the owner says they need to learn how to verify access, send a short guided walkthrough for the exact screen or account before escalating.

5. Capture proof.
   - Save profile URL, role/access proof, and verification note.
   - Do not store passwords or private Google account screenshots with sensitive personal data.

6. Hand off next step.
   - If access passes, Profile Manager may start GBP audit.
   - If access fails, route blocker to Account Manager or Manager.

## Required Proof

- Access request sent
- Correct GBP/profile URL
- Access role confirmation
- Profile identity verification
- Blocker or pass note

## Failure Or Blocker Handling

- Client cannot find GBP: Account Manager sends simpler instructions or requests a call route.
- Wrong profile invited: stop, document, and request correct profile access.
- Insufficient role: request correct role.
- Ownership issue: Manager escalates only if client cannot resolve and GMF work is blocked.
- Partial owner answer: keep the known field, mark only the missing fields Human Needed, and ask the next smallest question.
- Owner does not know where to verify: Profile Manager sends step-by-step instructions for checking the signed-in Google account, profile controls, People and access, accepted/pending invite, and role.
- Existing access confirmed by owner: switch status to Agent Working and have Profile Manager verify directly before asking Mike again.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded password-free access request and profile verification workflow | Coach |
| 0.3 | 2026-05-27 | Added partial-answer capture and guided owner verification path from Southington pilot | Coach/Profile Manager |
| 0.4 | 2026-05-27 | Added exhaust-access-first rule before asking Mike for GBP facts | Manager/Profile Manager |

## Source Documents

- `docs/client-ops-ledger/gbp-client-access-and-update-test.md`
- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
