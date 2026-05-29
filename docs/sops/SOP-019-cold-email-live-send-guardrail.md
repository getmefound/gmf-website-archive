# SOP 019 - Cold Email Live Send Guardrail

Status: Drafted
Version: 0.2
Owner: Manager
Reviewer: Auditor
Approver: Manager inside Mike-approved launch boundaries
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-019-cold-email-live-send-guardrail.md`

## Purpose

Control the final go/no-go decision immediately before a cold email campaign sends.

## Trigger

Campaign launch request, scheduled send window, or paused campaign restart.

## Hard Rules

- Do not send if Smartlead readiness is stale, failed, or missing.
- Do not send if suppression/list QA is missing.
- Do not send if copy was changed after approval without re-audit.
- Do not send if reply routing and unsubscribe handling are not ready.
- Do not send above the approved cap.

## Procedure

1. Confirm approval packet.
   - Verify SOP 018 packet exists and approval is current.

2. Recheck readiness age.
   - Confirm Smartlead/sender/list/copy proof is still current.
   - If stale, rerun relevant preflight.

3. Confirm campaign state.
   - Campaign is draft/paused until final approval.
   - Audience count and sender inboxes match approval packet.

4. Confirm stop rules.
   - Stop on complaint, unsubscribe spike, bounce/reputation issue, wrong audience, broken links, or unexpected reply routing failure.

5. Approve launch.
   - Manager records exact cap, date/time, campaign, and owner.
   - If first live send or outside approved boundary, Mike approval required.

6. Monitor first send window.
   - Confirm sends started as expected.
   - Check failures, bounces, replies, complaints, and Smartlead status.

## Required Proof

- Final go/no-go note
- Approval packet link
- Current readiness proof
- Campaign ID/name
- Approved cap
- First-window monitoring note

## Failure Or Blocker Handling

- Any mismatch: pause/hold.
- Complaint or deliverability issue: stop, record, route to Auditor/Manager.
- Wrong audience or broken link: stop and open incident.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded final launch gate, cap, stop rules, and monitoring proof | Coach |

## Source Documents

- `AGENTS.md`
- `docs/sops/SOP-018-cold-email-launch-approval-packet.md`
- `docs/sops/SOP-001-smartlead-api-access-readiness.md`

