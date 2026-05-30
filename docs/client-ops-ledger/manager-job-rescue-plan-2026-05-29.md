# Manager Job Rescue Plan - 2026-05-29

Status: active rescue schedule
Owner: Manager / Elon
Reviewer: Auditor
Created: 2026-05-29
Latest watchdog source: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-30T00-17-26-198Z.md`
Monitor: `/mike-mc/jobs/progress`

## Manager Rule

Any row marked overdue, unmapped, missing queue controls, or expected-receive missed is not allowed to sit as passive `Agent Working`.

Manager action is one of:

- reroute to the accountable agent
- assign Auditor review
- map to script/schedule/manual SOP/access lane
- update missing queue controls
- document access exhaustion
- ask Mike only after self-serve exhaustion is proven

Current Mike-needed count: 0.

## Manager Completion Commitment

Mike expects Manager to ensure these jobs get completed, not merely logged. Manager accepts that responsibility.

This rescue plan is not complete until the jobs are Done, held with proof, blocked with documented exhaustion, or converted into a true owner-needed request. Manager will routinely check watchdog and `/mike-mc/jobs/progress` as the listed receive/escalation times come due, then reroute, train, repair, or escalate as needed.

## Rescue Schedule

| Monday ID | Job | Issue | Manager solution | Next owner | Expected receive | Escalate at | Done proof |
|---|---|---|---|---|---|---|---|
| 12125889598 | GMF - GBP read-only verification path setup | Expected receive missed | Merge with authorized-session lane, prove one repeatable read-only verifier path for `profile@getmefound.ai`, or document access exhaustion | Systems Director / Profile Manager | 2026-05-30 09:30 ET | 2026-05-30 11:00 ET | sanitized verifier or controlled-session proof |
| 12142220881 | GMF - GBP authorized browser-session lane | Expected receive missed | Define the controlled browser-session lane, allowed evidence, forbidden secret capture, and rerun path | Systems Director / Profile Manager | 2026-05-30 09:30 ET | 2026-05-30 11:00 ET | browser-session lane proof or owner-needed exhaustion note |
| 12129166954 | Implement queue-control timers and next-agent acknowledgment | Overdue review | Auditor reviews queue-control implementation and either passes, holds, or requests changes | Auditor | 2026-05-30 09:00 ET | 2026-05-30 10:00 ET | Auditor pass/hold/block note |
| 12129929320 | GMF - Business Improvement Auditor morning report | Overdue review | Manager/Auditor approve report quality, Slack path, and daily schedule readiness | Manager / Auditor | 2026-05-30 08:30 ET | 2026-05-30 09:30 ET | approved daily Agent Ness report path |
| 12131426754 | SOP - Google Business Profile update change control | Overdue SOP review | Coach/Auditor run safe dry run and mark SOP 186 pass/hold/block before any live GBP edits | Coach / Auditor | 2026-05-30 09:30 ET | 2026-05-30 11:00 ET | dry-run proof and Auditor result |
| 12134190193 | Systems - GitHub workflow failure notice triage | Missing unlock proof | Add completion proof and keep Auditor review; no owner ask because workflow passed | Auditor | 2026-05-30 09:30 ET | 2026-05-30 10:30 ET | Auditor confirms passing run and no secret exposure |
| 12134169164 | GMF - Owner inbox morning triage | Missing unlock proof | Systems Director produces mailbox/source coverage map and reconnect recommendation | Systems Director, then Auditor | 2026-05-30 09:30 ET | 2026-05-30 10:30 ET | coverage map, gaps, and Auditor result |
| 12141755904 | GMF - Watchdog job-type SLA auto assignment | Needs dispatcher | Systems Director maps job types to default receive/escalate timers and preserves manual timers | Systems Director | 2026-05-30 12:00 ET | 2026-05-30 16:00 ET | watchdog SLA mapping proof and Auditor review |
| 12122979076 | Southington - Review link capture and test | Overdue access/profile proof | Profile Manager uses public GBP plus `profile@getmefound.ai` verifier lane; if auth fails, document exhaustion and route to client/account path | Profile Manager / Systems Director | 2026-05-30 09:30 ET | 2026-05-30 11:00 ET | review link proof or access-exhaustion proof |
| 12122981787 | Southington - GBP audit and proposed edits | Overdue audit proof | Profile Manager completes public/authenticated audit separation; Auditor reviews proposed edits before any live change | Profile Manager / Auditor | 2026-05-30 10:00 ET | 2026-05-30 12:00 ET | audit/proposed edits pass/hold/block |
| 12122987897 | Southington - Complete minimum intake facts | Overdue intake facts | Account/Profile Manager uses public sources, Gmail/proof history, and GBP verifier; ask no Mike unless access exhaustion is proven | Account Manager / Profile Manager | 2026-05-30 10:30 ET | 2026-05-30 12:30 ET | minimum facts filled or documented access failure |
| 12130306844 | GMF - Google Business Profile eligibility and create/claim path | Overdue eligibility decision | Profile Manager finishes eligibility, duplicate check, and create/claim/do-not-create recommendation; Auditor decides | Profile Manager / Auditor | 2026-05-30 11:00 ET | 2026-05-30 13:00 ET | eligibility decision and Auditor result |
| 12133965298 | GMF - Visibility report lead nurture pipeline | Needs dispatcher | Sales Manager maps Claude copy to report-form, report-sent, post-report, reply, opt-out, bounce, purchase stop rules; Systems Director wires only after approval | Sales Manager / Systems Director | 2026-05-30 11:00 ET | 2026-05-30 13:00 ET | stage map, stop rules, sender lane, Auditor approval |
| 12137354411 | GMF - 6/1 cold email copy and nurture sequence | Needs dispatcher | Sales Manager/Coach maps cold and nurture copy to funnel stage, compliance footer, suppression, sender lane, and paused campaign packet | Sales Manager / Coach | 2026-05-30 10:30 ET | 2026-05-30 12:30 ET | approved copy map and paused setup proof |

## Routine Watch

Manager checks `/mike-mc/jobs/progress`:

- after every watchdog run
- after any Monday queue update
- before the morning brief
- before launch gates
- when any job is overdue, owner-needed, unmapped, or missing queue controls

## Completion Rule

This rescue plan is complete when:

- `needs_dispatcher` is 0 or each remaining row has a valid mapped lane
- `queue_control_missing_fields` is 0
- `timer_overdue` rows have been rerouted, reviewed, or escalated with proof
- Mike-needed remains 0 unless a true owner gate is proven
