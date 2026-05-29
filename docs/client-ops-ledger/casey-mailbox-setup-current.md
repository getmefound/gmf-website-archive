# Casey Mailbox Setup Proof

Status: Verification in progress
Owner: Systems Director
Reviewer: Auditor
Started: 2026-05-28
Mailbox: `casey@getmefound.ai`

Do not store passwords, recovery codes, 2FA codes, raw login links, or private inbox content in this proof file.

## Assignment

Systems Director owns setup verification for the GMF client-facing Sales Rep mailbox.

Sales Manager may not use the mailbox for live prospect, partner, or client communication until Auditor verifies the required proof gates.

## Current State

- Mike confirmed the mailbox was created.
- The temporary credential was provided directly by Mike and must not be copied into docs, Slack, Monday, or proof artifacts.
- Google/Workspace instruction email to `mike@getmefound.ai` has not yet been found in the connected Gmail search.
- Internal test email was sent to `casey@getmefound.ai` on 2026-05-28 from the connected Gmail account.
- No delivery-failure/bounce email was visible in the connected Gmail search as of 2026-05-28T20:18:51-04:00.

## Required Proof Gates

| Gate | Owner | Status | Proof rule |
|---|---|---|---|
| Account exists | Systems Director | Watch | No bounce to internal test; authenticated Workspace proof still required |
| Receive test | Systems Director | Watch | No bounce visible; authenticated inbox confirmation still required |
| Send test | Systems Director | Pending | Send a harmless internal reply/test from Casey after safe login is available |
| Recovery owner | Systems Director | Pending | Recovery/admin control confirmed without storing recovery secrets |
| Calendar available | Systems Director | Pending | Calendar can accept fit-call use or booking routing is documented |
| Signature | Sales Manager / Auditor | Pending | Signature identifies GMF and does not create fake human proof |
| Resend reply-to | Systems Director | Pending | `GMF_SALES_REPLY_TO_EMAIL` or workflow reply-to routes to `casey@getmefound.ai` only after receive proof |
| Live-use approval | Auditor | Pending | SOP 187 proof complete |

## Setup Rules

- Do not create a fake profile, fake headshot, fake LinkedIn, fake biography, or fake employment history.
- Do not claim a human personally performed automated work.
- Display context may be `Casey Morgan | GetMeFound` or `Casey at GetMeFound`.
- If a prospect asks whether AI or automation is involved, answer truthfully that GMF uses agents and automation behind the scenes with Manager/Sales oversight.

## Next Action

Systems Director watches for delivery failure or instruction email, then verifies authenticated mailbox access and recovery hygiene before enabling live sends or Resend reply-to.

Because the temporary password was shared in chat, live use requires a clean credential state: password reset or password-manager control, recovery admin confirmation, and no stored secret values in docs, Slack, Monday, or proof.
