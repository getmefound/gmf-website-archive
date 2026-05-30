# GMF Agent Skill Repair Playbook

Status: active training addendum
Owner: Coach/Trainer
Reviewer: Auditor
Created: 2026-05-29
Source dispatch: `docs/client-ops-ledger/manager-skill-gap-dispatch-current.md`

## Purpose

Give each agent the exact operating skill needed to keep GMF jobs moving without asking Mike for routine work.

This playbook is used when watchdog finds `needs_dispatcher`, `timer_overdue`, `queue_control_missing_fields`, `access_blocked`, or proof-ready work that has not been closed.

## Universal Agent Rule

If the agent cannot finish a job, the agent must produce one of these outputs before stopping:

- proof completed
- reroute request to the next agent
- training request
- access exhaustion note
- owner-needed escalation draft, only after self-serve paths are exhausted

No job may sit at `Agent Working` with no runner, no proof, no next owner, and no timer.

## Skill 1 - Dispatcher Mapping

Owner: Systems Director / Manager

Use when: watchdog marks a row `needs_dispatcher`.

Checklist:

1. Read the Monday item name, group, next action, proof, unlock proof, and notes.
2. Choose exactly one execution lane:
   - runnable script
   - scheduled worker
   - manual SOP/proof step
   - access-blocked lane
   - owner-needed lane
   - systems-build lane
3. Set or confirm:
   - `Runtime State`
   - `Waiting State`
   - `Expected Receive`
   - `Escalate At`
   - `Next Owner`
   - `Unlock Proof`
4. If it is manual work, the next action must name what the agent will inspect, draft, test, document, or route.
5. Attach proof or a proof target.
6. Rerun watchdog.

Done proof:

- watchdog no longer shows the row as unmapped, or the row has a documented owner-needed blocker
- Mission Control job progress page shows owner, next owner, timer, and proof target

## Skill 2 - Timer Rescue

Owner: Manager / Auditor / Systems Director

Use when: watchdog marks a row `timer_overdue` or `expected_receive_missed`.

Checklist:

1. Open the job progress row.
2. Check whether proof exists.
3. If proof exists, route to Auditor and set `Ready For Review`.
4. If proof does not exist, reroute to the accountable agent with a new receive/escalate time.
5. If the agent lacks ability, open a training request.
6. If access or approval is the blocker, document exhausted paths before marking owner-needed.
7. Rerun watchdog after the update.

Done proof:

- old missed timer is replaced by review, reroute, training request, access exhaustion, or owner-needed escalation proof

## Skill 3 - GBP Authorized Verification Lane

Owner: Systems Director / Profile Manager

Use when: a Google Business Profile job requires authenticated proof.

Checklist:

1. Use the configured GMF access identity, currently `profile@getmefound.ai`, as the first candidate.
2. Try approved read-only verifier path:
   - `npm run gbp:access-verify`
   - GBP OAuth/API if configured
   - controlled authorized browser session if OAuth/API is unavailable
3. Verify only minimum facts needed:
   - profile access present or absent
   - business name/place match
   - role level
   - visible profile facts needed by the SOP
4. Do not record secrets, cookies, recovery codes, screenshots with private data, or 2FA codes.
5. If access fails, check Gmail/Slack/docs/Monday/proof history before asking Mike or client.
6. Ask Mike only for one-time account authorization, corrected access, public edit approval, or platform identity verification after proof of exhaustion.

Done proof:

- sanitized access proof or access-exhaustion proof attached
- profile place/name matches the job
- Auditor pass/hold/block recorded

## Skill 4 - Public Profile Fill Proof

Owner: Systems Director / Reporter / Studio

Use when: GMF social or owned-presence profiles are being created, claimed, or filled.

Checklist:

1. Confirm account ownership or creation path.
2. Record platform, handle, URL, admin/recovery owner, and proof link without secrets.
3. Fill or prepare:
   - profile image/logo
   - banner/cover where supported
   - short bio/headline
   - long about/description
   - website link
   - contact path
   - service/category fields
   - first three posts or one pinned intro plus two queued posts
4. Clean old AOH/GHL pricing or wording before public use.
5. Route any public publish/edit action through Auditor/Manager approval.

Done proof:

- registry row has URL, control status, fill status, proof, next owner, and approval state
- no profile is marked Done if it is empty or only reserved

## Skill 5 - Copy-To-Campaign Mapping

Owner: Sales Manager / Coach / Sender / Systems Director

Use when: cold email, nurture, or upsell copy exists but is not safely wired.

Checklist:

1. Assign each email to one stage:
   - cold prospect
   - reply-YES report send
   - homepage form report delivery
   - post-report nurture
   - Get Found buyer upsell
   - Always Ready waitlist
2. Confirm sender lane:
   - Smartlead cold subdomains for cold prospecting
   - Resend primary domain for inbound opt-ins/system mail
   - sales mailbox for approved human prospect replies
3. Confirm stop rules:
   - any reply
   - opt-out
   - hard bounce
   - form fill
   - purchase
   - manual hold
4. Confirm compliance:
   - physical mailing address
   - honest from name
   - non-deceptive subject
   - unsubscribe/STOP
   - no testimonials until true customers exist
   - no ranking guarantees
5. Build only paused campaigns until Auditor passes and Mike approves live sends.

Done proof:

- mapped copy packet
- stop-rule proof
- suppression proof
- paused campaign/send setup proof
- Auditor recommendation before live send

## Skill 6 - Audit Throughput

Owner: Auditor / Agent Ness

Use when: proof-ready jobs sit open.

Checklist:

1. For each proof-ready row, choose exactly one result:
   - Pass
   - Hold
   - Block
   - Changes requested
2. Record what proof was reviewed.
3. If Hold or Block, state the smallest next action and next owner.
4. If Pass, mark Done only when the Done proof matches the SOP.
5. Agent Ness reports recurring causes in the morning brief.

Done proof:

- Monday item has review result, next owner if not done, proof link, and updated timer if work continues

## Current Active Training Requests

1. Systems Director: dispatcher mapping and authorized-session proof standards.
2. Profile Manager: repeatable GBP verifier lane.
3. Sales Manager / Coach / Sender: stage mapping and deliverability guardrails.
4. Reporter / Studio: platform-specific profile fill and proof checklist.
5. Auditor / Agent Ness: review-throughput rules.

## Rerun Requirement

After applying any skill above, rerun:

```bash
npm run agent:watchdog -- --json
```

The row is not repaired until watchdog output and Mission Control progress agree.
