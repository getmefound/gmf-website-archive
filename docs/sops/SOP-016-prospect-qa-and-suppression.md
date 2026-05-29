# SOP 016 - Prospect QA And Suppression

Status: Drafted
Version: 0.2
Owner: Sales Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-016-prospect-qa-and-suppression.md`

## Purpose

Prevent bad-fit, duplicate, risky, or suppressed prospects from entering outreach or sales follow-up.

## Trigger

Before prospect import, campaign launch, report delivery, or manual outreach.

## Hard Rules

- Do not import prospects before suppression and QA pass.
- Do not contact unsubscribed, opted-out, complained, no-fit, existing client, active partner, or explicitly blocked contacts.
- Do not contact businesses where the source is unclear or legally/reputationally risky.
- Do not use scraped/private/purchased data unless Sales Manager and Auditor approve source risk.

## Procedure

1. Confirm source.
   - Record source, date, niche, location, and reason the list exists.

2. Dedupe.
   - Remove duplicate business names, domains, emails, phone numbers, and known owner contacts.

3. Fit check.
   - Confirm local-business fit, likely GBP/reputation relevance, and no obvious no-fit category.

4. Suppression check.
   - Check unsubscribe, do-not-contact, complaint, bounced, no-fit, client, partner, and internal suppression lists.

5. Risk check.
   - Hold legal, medical, financial, children-related, crisis/safety, franchise/corporate, or brand-sensitive prospects unless approved.

6. Approve or hold.
   - Mark each row keep, hold, suppress, no-fit, duplicate, or needs review.
   - Only keep rows can move to import or send approval.

## Required Proof

- Original source
- Cleaned prospect list
- Suppression result
- Keep/hold counts
- Risk notes
- Sales Manager approval

## Failure Or Blocker Handling

- Suppression uncertainty: hold the prospect.
- Source risk: Auditor reviews before use.
- Existing client/partner found: suppress and notify Manager if duplicate workflow risk exists.
- Complaint history: suppress permanently unless Mike approves a narrow exception.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded QA, suppression, source, and risk controls | Coach |

## Source Documents

- `docs/client-ops-ledger/prospecting-cold-email-operating-plan.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

