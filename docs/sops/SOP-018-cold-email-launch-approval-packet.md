# SOP 018 - Cold Email Launch Approval Packet

Status: Drafted
Version: 0.2
Owner: Manager
Reviewer: Auditor
Approver: Mike for first/live prospecting clearance
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-018-cold-email-launch-approval-packet.md`

## Purpose

Prepare one clear approval packet before any GMF cold email campaign can launch.

## Trigger

Campaign is drafted and the team wants live prospecting approval.

## Hard Rules

- No launch packet, no live send.
- First live Smartlead prospecting clearance requires Mike approval.
- The packet must prove Smartlead readiness, sender readiness, list QA, suppression, copy approval, send cap, reply routing, and stop rules.
- The packet must include Smartlead deliverability audit proof: `npm run smartlead:deliverability-audit -- --campaign-id <id>`.
- Routine progress should stay in Monday/Mission Control unless a human decision is required.

## Procedure

1. Confirm campaign basics.
   - Name, audience, niche, source, offer angle, sender inboxes, daily cap, start date, and owner.

2. Attach readiness proof.
   - Smartlead preflight pass.
   - Sender domain/warmup pass.
   - Prospect QA/suppression pass.
   - Copy/claim audit pass.
   - Reply routing owner.
   - Unsubscribe handling owner.
   - Deliverability audit PASS, or Auditor-signed WATCH exception.

3. Check campaign copy.
   - Short, true, useful, no guarantees, no fake personalization, no misleading urgency.
   - Plain text, one CTA link max, no attachments/images/URL shorteners.
   - Clear opt-out language and physical mailing address.

4. Confirm operational limits.
   - Daily cap, seed/test send, stop-on-reply, stop-on-risk rules, monitoring cadence, and recheck date.

5. Prepare approval recommendation.
   - `Approve`, `Approve with cap`, `Hold`, or `Block`.
   - Include exact human decision needed.

6. Route to Mike/Manager.
   - Mike approves first live clearance or material-risk launches.
   - Manager can approve later low-risk sends only inside Mike-approved boundaries.

## Required Proof

- Launch packet
- Readiness links
- Copy draft
- Audience/list QA result
- Suppression result
- Deliverability audit result
- Proposed cap
- Approval decision

## Failure Or Blocker Handling

- Any missing proof: packet is incomplete.
- Any readiness blocker: no launch.
- Any reputation/legal/deliverability risk: Auditor blocks and Manager escalates if needed.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded launch packet requirements and Mike approval gate | Coach |

## Source Documents

- `AGENTS.md`
- `docs/client-ops-ledger/prospecting-cold-email-operating-plan.md`
- `docs/sops/SOP-001-smartlead-api-access-readiness.md`
