# SOP 007 - Review Request Send Readiness And Live Send Guardrail

Status: Drafted
Version: 0.2
Owner: Reviews Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-007-review-request-send-readiness-live-send-guardrail.md`

## Purpose

Prevent unsafe review-request sends by requiring consent, clean recipient lists, tested links, proof previews, suppression checks, and live-send approval.

## Covered Master Map Rows

- Weekly customer/job upload
- Customer list cleaning
- Review request send candidates
- Review request proof preview
- Email review request send
- Follow-up review request send
- Private feedback routing
- Live send approval

## Trigger

- Stay Found client submits customer list
- Review request send window approaches
- Follow-up review request is due
- Manager requests review-send readiness check

## Roles

| Role | Responsibility |
|---|---|
| Account Manager | Requests/uploads customer list and handles client blockers |
| Reviews Manager | Cleans list, selects eligible sends, prepares proof preview, sends only after approval |
| Auditor | Checks consent, suppression, claims, links, and preview |
| Manager | Approves live send or blocks it |

## Hard Rules

- No live review request send without proof preview and approval.
- Do not send to suppressed, opted-out, invalid, duplicated, risky, or unclear contacts.
- Do not ask only happy customers for public reviews while routing unhappy customers elsewhere in a way that violates platform rules.
- Do not promise a review, rating, or Google outcome.
- Keep private feedback private and route it safely.

## Procedure

1. Receive customer list.
   - Confirm client, source, list date, and whether contacts are recent real customers.
   - If consent/source is unclear, hold the list.

2. Clean list.
   - Remove duplicates, invalid emails, internal contacts, suppressed contacts, known complaints, active disputes, and obvious risk rows.
   - Record counts: received, eligible, held, suppressed, invalid.

3. Confirm review link and destination.
   - Test Google review link.
   - Confirm it belongs to the correct GBP.

4. Prepare send candidates.
   - Build the eligible send list.
   - Apply cadence and cooldown rules.
   - Exclude anyone recently sent or blocked.

5. Create proof preview.
   - Render the exact email/SMS if applicable.
   - Check merge fields, client name, business name, links, unsubscribe/stop language where needed, and tone.

6. Auditor review.
   - Auditor checks link, recipient counts, suppression, language, and proof.
   - Failed preview returns to Reviews Manager.

7. Manager live-send approval.
   - Manager approves, caps, delays, or blocks the send.
   - If blocked, record reason and owner.

8. Send and log.
   - Send only the approved audience and approved copy.
   - Save send log, failures, bounces, replies, and next follow-up date.

9. Route responses.
   - Public reviews go to review monitoring.
   - Low/private feedback goes to private feedback routing and risk review.

## Required Proof

- Uploaded list/source
- Clean/held/suppressed counts
- Tested review link
- Proof preview
- Auditor approval
- Manager approval
- Send log and failure list

## Failure Or Blocker Handling

- Consent unclear: hold and ask Account Manager/client.
- Wrong review link: stop and return to Profile Manager.
- Suppression mismatch: block send until resolved.
- Complaint/reputation risk: Manager/Auditor review before any further send.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded review send readiness, suppression, proof preview, and live-send approval gates | Coach |

## Source Documents

- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/client-ops-ledger/review-automation-client-intake.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

