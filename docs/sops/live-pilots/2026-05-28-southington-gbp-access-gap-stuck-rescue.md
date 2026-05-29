# Southington GBP Access Gap Stuck Rescue

Status: rescued into timed access-gap workflow
Created: 2026-05-28
Owner: Manager
Execution owners: Systems Director / Profile Manager
Reviewer: Auditor
Client/system: Southington Lawn Service LLC
Related SOPs: SOP 181, SOP 182, SOP 183, SOP 005, SOP 064, SOP 174, SOP 179

## Why This Looked Stopped

The Southington authenticated inside-GBP test stopped because it reached an `access_gap`:

- public/read-only checks passed
- review link/place ID matched `ChIJxypnrEz5KkYRgxXufgych38`
- existing repo/env/tooling has no Google Business Profile OAuth/API credentials
- current agent context has no authenticated Google Business Profile browser session
- Google Business Profile manager facts require an authenticated account linked to the profile

The failure was not that the public audit stopped. The public audit is done and proof-ready.

The failure was that the authenticated verification step was left as a general next action instead of a timed waiting/rescue state with owner, next owner, expected receive time, escalation time, and missed-timer action.

## Queue-Control Classification

| Field | Value |
|---|---|
| Waiting state | `Waiting on Authenticated Access Path` |
| Stuck classification | `access_gap` |
| Current owner | Systems Director / Profile Manager |
| Next owner | Auditor after authenticated proof is captured |
| Reviewer | Auditor |
| Mike needed now | No |
| Human-needed reason | None yet; Path A/Path B must be exhausted first |
| Unlock proof | Authenticated read-only role/profile proof matched to place ID `ChIJxypnrEz5KkYRgxXufgych38` |
| Expected receive | 2026-05-29 12:00 PM ET |
| Escalate/check by | 2026-05-29 3:00 PM ET |
| Missed timer action | Manager classifies as `access_gap still open`, Systems Director documents Path A API feasibility and Path B browser-session attempt status, then Manager decides whether a precise Mike DM is justified |

## Enforcement Added After Stop Was Identified

Mike asked why this stopped. The operational answer was that the item had a next-action note but no enforced waiting-state/timer fields. Manager/System Director corrected that on 2026-05-28:

| Enforcement | Result |
|---|---|
| Monday queue-control fields | Added `Waiting State`, `Expected Receive`, `Escalate At`, `Next Owner`, `Handoff Ack`, `Ack At`, `Unlock Proof`, `Runtime State`, and `Last Watchdog` |
| Monday item state | `Southington - Verify GBP Manager access` moved to `Waiting on Access` |
| Dependent access items | GBP read-only path, review-link capture, GBP audit/proposed edits, and minimum intake facts also moved to `Waiting on Access` with timers |
| Watchdog behavior | `scripts/manager-agent-watchdog.mjs` now watches `Waiting...`, `Ready For Review`, `Blocked...`, and `Human Needed` states, not only `Agent Working` |
| Latest watchdog proof | `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-28T16-30-38-906Z.md` |
| Latest watchdog result | Southington access items show `timer_ok`; owner-needed count remains zero |

## Current Proof Already Captured

| Proof | Path |
|---|---|
| Public GBP audit/proposed edits | `docs/sops/live-pilots/2026-05-27-southington-gbp-audit-proposed-edits.md` |
| Public live audit refresh | `docs/sops/live-pilots/2026-05-28-southington-gbp-public-live-audit-refresh.md` |
| Profile Manager access/fact proof | `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md` |
| Read-only verification path | `docs/sops/live-pilots/2026-05-28-gbp-read-only-verification-path.md` |

## What Continues Next

Systems Director/Profile Manager must run this sequence before asking Mike:

1. Confirm whether Path A is feasible now:
   - Google Business Profile API approval exists or not
   - OAuth app/client exists or not
   - refresh-token path exists or not
   - no secrets printed or documented
2. If Path A is not feasible, use Path B:
   - normal authorized Google sign-in only
   - no password/cookie/token storage
   - inspect Business Profile UI for Southington
   - match place ID `ChIJxypnrEz5KkYRgxXufgych38`
3. Capture non-sensitive profile facts:
   - account/role/access note
   - clean profile URL
   - review count/rating
   - hours
   - category/services
   - website
   - address/service-area
   - photo/profile completeness notes
4. Auditor reviews proof.
5. Profile Manager prepares edits only after SOP 172 public-profile edit approval.

## If Timer Misses

If no authenticated proof exists by the escalation/check time:

1. Manager does not leave the item in generic `Agent Working`.
2. Systems Director records exactly which path failed:
   - Path A: missing Google API approval/OAuth/token
   - Path B: no accessible authorized browser session or account access
3. Manager sends Mike a Slack DM only if the remaining blocker requires his action, such as:
   - sit for authorized Google sign-in/2FA
   - confirm access invitation/account state
   - approve public edit or client-facing action
4. If Mike is not needed, the work remains assigned with a new timer and alternate route.

## Done Criteria

This rescue is done when one of these is true:

- Pass: authenticated read-only profile proof is captured and Auditor accepts it.
- Hold: safe path exists but awaiting scheduled authenticated access window.
- Block: both Path A and Path B fail after documented attempts and Manager sends a precise owner-needed Slack DM.
- SOP update needed: the timer/rescue path exposes a missing field, automation, or training gap.
