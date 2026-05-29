# SOP 013 - Sending Domain Readiness And Warmup

Status: Drafted
Version: 0.2
Owner: Systems Director
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-013-sending-domain-readiness-and-warmup.md`

## Purpose

Verify sender domains and inboxes before GMF uses them for outbound prospecting.

## Trigger

New outreach domain/mailbox, DNS change, Smartlead inbox change, deliverability warning, or campaign launch review.

## Hard Rules

- Do not send live prospect email from a new or changed sender until DNS, SMTP/IMAP, warmup, reputation, and Smartlead readiness are checked.
- Do not mix client email sending with cold prospecting sender infrastructure.
- Do not use old AOH domains in new GMF outbound unless explicitly approved as a temporary bridge.
- Do not increase send caps without Manager approval and deliverability proof.

## Procedure

1. Confirm sender purpose.
   - Identify domain, mailbox, campaign/lane, and owner.
   - Confirm it is for GMF internal prospecting, not client delivery.

2. Verify DNS and mailbox health.
   - Check SPF, DKIM, DMARC, MX, SMTP, IMAP, and mailbox login status.
   - Record pass/watch/blocker without exposing credentials.

3. Verify Smartlead connection.
   - Confirm the mailbox appears in Smartlead.
   - Confirm warmup is active for the mailbox.

4. Check warmup maturity.
   - Review warmup sent count, spam count, reputation, and recent failures.
   - Apply the current readiness threshold in the sender plan.

5. Set or confirm send cap.
   - Keep caps conservative until warmup and replies prove safe.
   - Any cap increase needs Manager approval.

6. Record status.
   - Update the sender plan/readiness report and Monday job.
   - Route blockers to Systems Director, Manager, or Mike depending on access/spend/risk.

## Required Proof

- DNS check summary
- SMTP/IMAP status
- Smartlead connection status
- Warmup/reputation summary
- Send cap
- Pass/watch/blocker result

## Failure Or Blocker Handling

- DNS fails: no send; Systems Director fixes or routes domain access blocker.
- Spam/reputation risk: Auditor blocks launch.
- Missing mailbox access: Manager escalates to Mike only if owner access is required.
- Warmup immature: set recheck date and keep campaign paused/draft.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded sender readiness, DNS, warmup, and cap controls | Coach |

## Source Documents

- `docs/GETMEFOUND_OUTREACH_SENDER_PLAN.md`
- `docs/GETMEFOUND_FIRST_SMARTLEAD_CAMPAIGN.md`
- `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`
- `docs/sops/SOP-001-smartlead-api-access-readiness.md`

