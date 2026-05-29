# GMF Monday Go-Live Sprint

Status: active sprint
Owner: Manager / Elon
Reviewer: Auditor
Target launch: Monday 2026-06-01
Created: 2026-05-29

Calendar note: Mike referenced Thursday. The operating calendar for this sprint treats the target as Monday 2026-06-01 and compresses the plan as if time is short.

## Launch Definition

Monday go-live means GMF can publicly accept visibility-report interest, route replies, show owner-visible job status, and begin controlled fulfillment with proof gates.

It does not mean every future automation, every SOP, every social channel, every GBP pathway, and every recurring agent has reached full maturity. Those can continue after launch if the live customer path is safe.

## Job Timing Logic

Jobs get more time only when delay is caused by risk or dependency, not agent convenience.

Use longer timers for:

- public profile edits or anything that can trigger Google/social suspension
- authenticated access, OAuth, or platform verification
- email deliverability, live sends, billing, payment, legal, reputation, or customer-facing risk
- work that depends on a prior agent handoff or proof review
- jobs where a platform or human outside the agent system controls the response

Use shorter timers for:

- drafts, copy, checklists, registry updates, screenshots, public-source research, safe dry runs, and report assembly
- tasks an agent can retry or reroute without Mike
- reversible internal documentation or Mission Control display work

A job may wait only when the next action truly belongs to Mike, a client, a platform, or another outside human. Internal handoffs stay `Agent Working`, `Ready For Review`, or `Reviewer assigned`, not vague Waiting.

## Execution Hierarchy

### Tier 1 - Monday Launch Blockers

These must pass before Monday launch.

| Workstream | Owner Agent | Reviewer | Done Proof | Mike Needed |
|---|---|---|---|---|
| Website and Mission Control owner view | Systems Director / Reporter | Auditor | production pages reachable, current links, no stale GHL-primary positioning | No unless deploy/access fails |
| Visibility-report lead path | Sales Manager / Systems Director | Auditor | request path, report delivery path, and reply routing tested | No unless live send approval or tool access is blocked |
| Sender identity and reply routing | Systems Director / Sales Rep | Auditor | Casey or fallback mailbox can receive/reply; no dead reply-to | Yes only if Casey first-login security gate remains required |
| Monday launch sprint board | Manager | Auditor | active job with owners, timers, proof, and escalation | No |
| Public launch claims and offer copy | Coach / Reporter | Auditor | launch copy checked for unsupported claims and old AOH/GHL language | No unless Mike approval is required for final offer changes |
| Payment or booking next step | Sales Manager / Systems Director | Auditor | prospect can request report and be routed to a human/agent next step | No unless paid checkout must be changed |

### Tier 2 - Launch-Allowed Manual Backing

These can be live with manual or approval-gated operation on Monday.

| Workstream | Owner Agent | Reviewer | Monday Acceptance |
|---|---|---|---|
| GMF social profiles | Systems Director / Reporter / Studio | Auditor | priority profiles checked/created where possible; fill packet ready; public publishing approval-gated |
| GMF Google Business Profile | Profile Manager | Auditor | eligibility decision and create/claim packet ready, or do-not-create path documented |
| Southington pilot | Profile Manager / Reporter | Auditor | report/audit proof usable as internal test-client evidence; public edits held until approved |
| GBP update process | Coach / Profile Manager | Auditor | SOP and safe dry-run reviewed; live updates remain proof/approval gated |
| Owner inbox triage | Systems Director | Auditor | coverage audit complete; if partial, source-system checks remain fallback |

### Tier 3 - Post-Launch Buildout

These improve the machine but should not block Monday unless they protect safety.

- full SOP test coverage
- always-on dispatcher instead of manual watchdog
- every social channel fully populated and posting weekly
- full automated nurture sequencing beyond first safe reply path
- complete email inbox coverage across every alias/source
- advanced analytics and efficiency grading
- deeper client dashboard refinements

## Go / No-Go Checks

### Friday 2026-05-29

- Launch sprint created and visible in Monday.
- Current GMF launch blockers identified.
- Sender/reply route status known.
- Website/MC stale-link scan started.
- Social/GMB jobs assigned to owner agents with proof gates.

### Saturday 2026-05-30

- Website and Mission Control launch view repaired or documented.
- Visibility-report request/reply path tested.
- Public copy checked for GMF/AOH/GHL inconsistencies.
- Social profile inventory and fill packet ready.
- Casey mailbox either verified or fallback reply-to selected.

### Sunday 2026-05-31

- Auditor completes launch-readiness review.
- Manager produces go/no-go memo.
- Only Mike-needed decisions are public approvals, mailbox security gate, public phone/address, spend, or final launch approval.

### Monday 2026-06-01

- If go: launch GMF MVP with controlled intake, proof tracking, and manual-backed delivery.
- If no-go: launch is held only for safety, broken lead path, dead reply routing, payment/booking failure, or unsupported public claims.

## Monday Launch Answer

Possible: yes, as a controlled MVP.

Not realistic by Monday: a fully automated multi-agent company with every SOP live-tested, every GBP/social surface finished, every recurring job scheduled, and every inbox/source fully covered.

Manager decision: treat Monday as a public MVP launch, while post-launch agents continue SOP testing, social buildout, GBP proof, and automation hardening.
