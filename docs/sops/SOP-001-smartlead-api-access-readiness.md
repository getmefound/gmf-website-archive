# SOP 001 - Smartlead API Access And Read-Only Readiness

Status: Drafted
Version: 0.2
Owner: Systems Director
Reviewer: Auditor
Approver: Manager; Mike only for API access, account ownership, spend, or live-send clearance
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-001-smartlead-api-access-readiness.md`

## Purpose

Make Smartlead access and readiness checks repeatable before GMF runs any live prospecting sends.

This SOP exists because Smartlead is the cold-outbound rail, but live prospect sends are blocked until API access is current, warmup/readiness is proven, suppression rules are safe, and Manager has a clean approval packet.

## Covered Master Map Rows

- Smartlead API access and readiness preflight
- Smartlead access/readiness check

## Scope

This SOP covers read-only Smartlead access verification, warmup/readiness checks, blocker reporting, and the no-send gate.

It does not cover writing campaigns, importing prospects, sending live campaigns, changing Smartlead billing, buying new sender accounts, or rotating Mike-owned credentials without authorization.

## Trigger

- Before any live cold prospect sends
- When Smartlead API access is missing, expired, or suspected broken
- Before campaign launch approval
- After any sender-domain, mailbox, DNS, SMTP/IMAP, or Smartlead setting change

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Runs read-only checks, verifies configuration, records blockers |
| Manager | Owns the prospecting job status and routes human-needed blockers |
| Auditor | Checks no-send gate, proof, and launch-readiness claims |
| Mike | Provides/authorizes Smartlead account/API access and approves live prospecting clearance |

## Hard Rules

- Do not run live Smartlead prospect sends until this SOP passes and Manager has launch approval.
- Do not import live prospects into Smartlead until readiness passes and suppression/QA is complete.
- Do not send a test to anyone except an approved internal seed/test recipient.
- Do not change Smartlead billing, connected accounts, sender domains, or mailbox credentials without Mike approval.
- Do not expose API keys in docs, screenshots, commits, Slack, or client/prospect messages.
- Routine progress belongs in Monday, Mission Control, or proof reports. Slack/Mike alerts are only for human-needed blockers.

## Tools

- Smartlead account/API
- `.env.local` or approved secret store
- Vercel environment variables when production jobs need access
- `npm run smartlead:check`
- `npm run smartlead:warmup-report`
- `npm run smartlead:readiness`
- `npm run prospecting:preflight`
- Monday `Agents Jobs` board
- `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`
- `docs/client-ops-ledger/monday-prospecting-core-setup.md`
- `docs/GETMEFOUND_OUTREACH_SENDER_PLAN.md`
- `docs/GETMEFOUND_FIRST_SMARTLEAD_CAMPAIGN.md`

## Prerequisites

- Smartlead API key exists in the approved local or production secret store.
- The API key was provided or authorized by Mike.
- Work is linked to a Monday job or internal prospecting task.
- No live-send command is queued.
- Sender domains and mailboxes have a documented readiness target.

## Procedure

1. Confirm the current job.
   - Find the Monday/prospecting job tied to Smartlead readiness.
   - Confirm whether the job is `Human Needed`, `Agent Working`, `Blocked`, or `Ready For Review`.
   - If the blocker is API access, Manager may contact Mike because this is a human-needed access blocker.

2. Verify secret presence without exposing it.
   - Check whether the Smartlead API key exists locally and, if needed, in production.
   - Do not print, paste, or commit the key.
   - If missing or invalid, mark the job `Human Needed` with next action: Mike to generate/confirm a valid Smartlead API key.

3. Run read-only access checks.
   - Run:

```bash
npm run smartlead:check
```

   - Pass means Smartlead API access responds and account data can be read.
   - Fail means stop and log the exact non-secret error.

4. Run warmup/readiness reporting.
   - Run:

```bash
npm run smartlead:warmup-report
npm run smartlead:readiness
```

   - Check all connected inboxes.
   - Confirm warmup status, warmup sent count, spam count, reputation, SMTP/IMAP health, and campaign state.

5. Run the broader prospecting preflight.
   - Run:

```bash
npm run prospecting:preflight
```

   - This should confirm the Smartlead gate plus connected prospecting dependencies.

6. Apply readiness criteria.
   - Smartlead API access must pass.
   - Every sending inbox planned for the campaign must be connected and healthy.
   - Warmup status must be active.
   - Reputation should be at least 95 unless Manager and Auditor document a stricter or updated threshold.
   - Warmup sent count must meet the current readiness target from the outreach sender plan.
   - Spam count must be 0 for the checked warmup window.
   - Campaign must remain draft/paused until live-send approval exists.
   - Suppression and prospect QA SOPs must be ready before import or launch.

7. Record the result.
   - Update `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md` or the current proof location.
   - Update Monday with pass/watch/blocker.
   - Attach command names, timestamps, and non-secret results.

8. Route blockers.
   - API key/account access: Manager routes to Mike.
   - DNS/mailbox/SMTP/IMAP: Systems Director owns fix or routes access blocker.
   - Warmup not mature: Manager leaves campaign on hold and sets recheck date.
   - Reputation/spam issue: Auditor blocks launch and Manager opens recovery task.
   - Missing suppression/prospect QA: Sales Manager owns before any import/send.

9. Prepare launch-readiness handoff only after pass.
   - If all gates pass, Manager may prepare a launch approval packet.
   - Live launch still requires the cold email launch approval and live-send guardrail SOPs.

## Required Proof

- Command result summary for `smartlead:check`
- Command result summary for `smartlead:warmup-report`
- Command result summary for `smartlead:readiness`
- Command result summary for `prospecting:preflight`
- Monday job link or item ID
- Current status: pass, watch, or blocker
- Clear next action and owner
- Confirmation that no live Smartlead prospect send ran during the check

## Pass/Watch/Blocker Definitions

| Status | Meaning |
|---|---|
| Pass | API access, sender health, warmup, reputation, spam, and preflight all satisfy current criteria |
| Watch | Access works but warmup maturity, timing, or a non-critical setup item still needs monitoring |
| Blocker | API access fails, key is missing, sender health fails, spam/reputation risk appears, suppression/QA is incomplete, or live-send approval is missing |

## What To Log

- Date/time of check
- Operator
- Smartlead account/campaign reference, without secrets
- Connected sender inbox count
- Warmup/reputation summary
- Preflight status
- Blocker reason if any
- Next owner
- Recheck date

## Communication Rule

Do not send prospect-facing communication from this SOP.

If Mike is needed, Manager sends a concise human-needed request:

```text
Smartlead API access is blocking the prospecting preflight. Please generate or confirm a valid Smartlead API key, then I will store it securely and rerun the read-only readiness check. No live prospect sends will run until the preflight passes and you approve launch.
```

## Mike Escalation Rule

Escalate to Mike when:

- Smartlead API key is missing, invalid, expired, or needs rotation
- Smartlead billing/account ownership needs action
- mailbox/domain credentials require owner access
- spend/cap increases are needed
- Manager is asking for live prospecting clearance
- deliverability/reputation risk could affect GMF domains

## Failure Or Blocker Handling

1. Stop all launch/import/send activity.
2. Confirm no live prospect sends are queued.
3. Log the blocker with non-secret details.
4. Assign the blocker to Systems Director, Sales Manager, Manager, Auditor, or Mike.
5. Set a recheck date.
6. Keep Slack quiet unless human involvement is required.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pending |
| Dry run | Pending |
| Live pilot | Pending |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded Smartlead readiness gate, no-send rule, command path, blocker handling, and Mike escalation | Coach |

## Source Documents

- `AGENTS.md`
- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
- `docs/client-ops-ledger/prospecting-core-setup-memory.md`
- `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`
- `docs/client-ops-ledger/monday-prospecting-core-setup.md`
- `docs/GETMEFOUND_OUTREACH_SENDER_PLAN.md`
- `docs/GETMEFOUND_FIRST_SMARTLEAD_CAMPAIGN.md`
