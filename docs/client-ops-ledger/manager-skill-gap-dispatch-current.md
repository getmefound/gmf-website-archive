# Manager Skill-Gap Dispatch

Status: active
Owner: Manager / Elon
Reviewer: Auditor
Created: 2026-05-29
Latest watchdog: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-29T23-44-10-099Z.md`

## Manager Answer

Mike should not need to train the agents. The current blockers are internal operating gaps, not owner knowledge gaps.

Manager does not need more skills from Mike right now. The agents need the following internal skills enforced, trained, or mapped so jobs complete instead of sitting under `Agent Working`.

## Current Skill And Routing Gaps

| Gap | Affected agents | Affected jobs | Current risk | Required fix | Done proof |
|---|---|---|---|---|---|
| Dispatcher mapping | Systems Director / Manager / Sales Manager / Coach | needs_dispatcher rows: watchdog SLA auto assignment, visibility report lead nurture pipeline, 6/1 cold email copy and nurture sequence | Job says active but has no runner/SOP step mapped | Map each row to script, scheduled worker, manual SOP proof step, or owner-needed blocker | Monday runtime state, next owner, expected receive, escalation, unlock proof, and proof link updated |
| Timer rescue discipline | Manager / Auditor / Systems Director | 7 timer-overdue rows | Missed receive/escalation times can hide stalled work | Run missed-timer action: reroute, train, repair, document access failure, or escalate only after exhaustion | Watchdog count reduced or each overdue row has rescue action recorded |
| GBP authenticated access lane | Systems Director / Profile Manager | GBP read-only verification, Southington access verification, GMF GBP eligibility | Profile work cannot scale if Mike manually checks every profile | Establish repeatable GBP OAuth/API verifier or controlled authorized browser-session lane for `profile@getmefound.ai` | Sanitized proof that the lane can verify access/profile facts without exposing secrets |
| Public profile setup/fill skill | Systems Director / Reporter / Studio | GMF social profiles create and fill packet, owned presence registry | Profiles can be created but incomplete, which does not count as done | Platform-specific checklist for profile image, cover, bio, website, contact, services, first posts, admin proof | Registry shows profile URL, admin proof, fill proof, and Auditor approval/hold |
| Copy-to-campaign mapping | Sales Manager / Coach / Sender / Systems Director | 6/1 cold email copy, visibility report nurture, Smartlead seed launch | Draft copy exists but cannot launch safely until stage/stop-rule/sender mapping is explicit | Map each email to stage, sender lane, stop condition, suppression rule, compliance footer, and approval state | Approved copy packet and paused Smartlead/Resend setup proof before live send |
| Audit throughput | Auditor / Agent Ness | proof-ready live pilots, morning report, queue-control review | Work is ready for review but not being closed or sent back with changes | Auditor must mark pass/hold/block; Agent Ness critiques process and recommends fixes | Audit result attached to Monday and Mission Control progress page |

## Immediate Manager Assignments

### 1. Systems Director

Owns:

- dispatcher mapping for `needs_dispatcher` rows
- GBP authorized access lane
- watchdog SLA auto-assignment
- production proof for new Mission Control job-progress page

Training requested:

`Training requested: Systems Director needs dispatcher-mapping and authorized-session proof standards to complete runtime repair and GBP verification work. Current risk: medium. Safe work continuing: yes. Mike needed: no.`

### 2. Profile Manager

Owns:

- Southington GBP access verification through `profile@getmefound.ai`
- GMF GBP eligibility/create-or-do-not-create decision
- repeatable client GBP access check

Training requested:

`Training requested: Profile Manager needs repeatable GBP verifier lane training to complete client profile access checks without asking Mike. Current risk: high for scale, low for safe read-only work. Safe work continuing: yes. Mike needed: no unless Google requires identity/2FA/video verification or public edit approval.`

### 3. Sales Manager / Coach / Sender

Owns:

- 6/1 cold email copy-to-campaign mapping
- visibility report nurture mapping
- Smartlead paused approval packet
- no live sends until Auditor recommendation and Mike approval

Training requested:

`Training requested: Sales Manager, Coach, and Sender need stage-mapping and deliverability guardrail training to convert draft copy into approved Smartlead/Resend sequences. Current risk: medium. Safe work continuing: yes. Mike needed: no until final live-send approval.`

### 4. Reporter / Studio

Owns:

- GMF social fill packet cleanup
- profile image/banner/copy/services/first-post packet
- profile registry proof updates

Training requested:

`Training requested: Reporter/Studio need platform-specific social profile fill and proof checklist training to complete public profile setup packets. Current risk: low until public publishing. Safe work continuing: yes. Mike needed: no until public profile creation/edit approval, identity/captcha/2FA, or spend.`

### 5. Auditor / Agent Ness

Owns:

- overdue proof review
- pass/hold/block decisions
- daily operating critique

Training requested:

`Training requested: Auditor and Agent Ness need review-throughput rules to prevent proof-ready work from sitting open. Current risk: medium. Safe work continuing: yes. Mike needed: no.`

## Manager Rule Applied

No owner ask is justified right now. All current gaps can be handled by agent training, dispatcher mapping, proof review, or authenticated access-path setup.

Mike becomes needed only if:

- Google or a platform requires identity, 2FA, captcha, video, or account recovery
- a public profile field/edit/create action needs owner approval
- live outbound send approval is ready
- spend/cap/legal/billing/reputation risk appears
- all self-serve access paths fail and proof is attached

## Next Operating Step

Manager routes the five training requests to Coach/Trainer and Systems Director, then reruns watchdog after the dispatcher/timer updates. Mission Control progress page is the monitor:

`/mike-mc/jobs/progress`
