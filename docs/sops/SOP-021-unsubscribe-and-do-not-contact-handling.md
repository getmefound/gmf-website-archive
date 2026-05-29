# SOP 021 - Unsubscribe And Do-Not-Contact Handling

Status: Drafted
Version: 0.2
Owner: Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-021-unsubscribe-and-do-not-contact-handling.md`

## Purpose

Make opt-outs, complaints, and do-not-contact requests immediate, durable, and respected across GMF prospecting tools.

## Trigger

Prospect or contact unsubscribes, complains, replies no, asks not to be contacted, bounces hard, or is manually suppressed.

## Hard Rules

- Suppression is more important than follow-up.
- Do not argue with opt-outs.
- Do not re-add suppressed contacts through a new list import.
- Do not contact the same person through another channel to avoid the opt-out.
- Complaints and legal threats escalate to Manager/Auditor.
- Cold campaign imports must not bypass Smartlead global blocklists, unsubscribe lists, duplicate-lead protections, or community bounce lists.
- Every commercial cold email must provide a simple opt-out path by reply or one-click/single-page mechanism, and opt-outs must be honored across all outreach domains.

## Procedure

1. Identify suppression type.
   - Unsubscribe, do-not-contact, complaint, hard bounce, no-fit, existing client, partner, manual hold, or legal risk.

2. Suppress the contact.
   - Add email/domain/person/business to the appropriate suppression list/tool.
   - Apply across Smartlead and any GMF prospecting tracker.
   - Confirm the contact cannot be re-imported through another Smartlead campaign or outreach domain.

3. Stop active sequences.
   - Stop current campaign steps and follow-ups.
   - Confirm no queued send remains.

4. Log evidence.
   - Save request, date, source, contact, action taken, and owner.

5. Route risk.
   - Complaint/legal/reputation risk goes to Manager and Auditor.
   - Normal unsubscribe stays logged without Mike unless material risk exists.

6. Audit future imports.
   - Prospect QA must check suppression before any import/send.

## Required Proof

- Suppression record
- Sequence stopped or no active sequence
- Source/request note
- Tool/list updated
- Cross-domain suppression confirmed when the contact came from cold outreach
- Risk escalation if needed

## Failure Or Blocker Handling

- Tool cannot suppress: stop sends and escalate to Systems Director/Manager.
- Accidental send after opt-out: open incident and notify Manager/Auditor.
- Legal/reputation threat: Manager prepares Mike packet.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded opt-out, suppression, stop-send, and complaint controls | Coach |

## Source Documents

- `docs/client-ops-ledger/prospecting-cold-email-operating-plan.md`
- `docs/sops/SOP-016-prospect-qa-and-suppression.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
