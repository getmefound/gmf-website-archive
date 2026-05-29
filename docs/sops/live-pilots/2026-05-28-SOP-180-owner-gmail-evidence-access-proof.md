# SOP 180 Live Pilot Evidence - Owner Gmail Evidence Access

Status: in progress; Auditor review pending
Created: 2026-05-28
Owner: Systems Director / Manager
Reviewer: Auditor
Related SOP: `docs/sops/SOP-180-owner-gmail-evidence-access.md`
Monday item: `GMF - Owner Gmail evidence access rule` / `12126209744`

## Pilot Question

Can Manager use connected Gmail access as a safe evidence source before asking Mike for inbox facts or access clues?

Current answer: yes for read/search evidence. Gmail access is active and useful for business evidence. It does not replace separate signed-in platform access, OAuth grants, API tokens, or account roles for systems such as Google Business Profile.

## Actions Performed

| Action | Result | Safety note |
|---|---|---|
| Gmail connector labels/count check | Connector read access verified without reading message bodies. | Counts only; no private content recorded. |
| Southington client-originated search | Found relevant Southington emails with business contact facts and review URL. | Only business facts/message IDs recorded. |
| Google Business Profile invite search | No Southington GBP invitation found with targeted Google/GBP/invite terms. | No unrelated content recorded. |
| Exact `mike@getmefound.ai` GMB search | No GMB/GBP invite found for `mike@getmefound.ai`, including spam/trash/archive and common Business Profile invite phrases. | Only account setup/test mail found; no security codes recorded. |
| `admin@getmefound.ai` / `mike@getmefound.ai` trail search | Found an earlier `admin@getmefound.ai` delivery failure around mailbox setup and Google Workspace account setup clues. | Security codes and unrelated personal results were not recorded. |
| Outbound send check | No email was sent. | Send remains approval-gated. |
| Monday visibility | Created Monday item `12126209744`, status `Agent Working`, Human Needed `No`, runtime `manual_audit`. | Auditor owns next review. |

## Proof Captured

- SOP 180 created: `docs/sops/SOP-180-owner-gmail-evidence-access.md`
- Owner email rule added to `AGENTS.md`
- Gmail evidence rule added to `docs/AGENT_OPERATING_MODEL.md`
- Manager routing/training updated in `docs/MANAGER_ROUTING_SKILL_PACK.md` and `docs/GMF_AGENT_TRAINING_PACK.md`
- Southington access proof updated: `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md`
- Monday item created: `12126209744`
- Watchdog report generated: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-28T12-06-24-530Z.md`

## Audit Notes

Pass candidates:

- Gmail read/search can now be part of the owner-ask exhaustion gate.
- No password, 2FA, recovery code, or raw login link was requested from Mike.
- No outbound email was sent.
- No security code or unrelated personal content was copied into proof.

Hold items:

- Auditor must review SOP 180 before Active release.
- Systems Director should define whether Gmail label/archive/bulk-label actions need their own approval gate.
- Gmail send capability must remain locked behind live-send SOPs.

## Decision

| Decision | Value |
|---|---|
| Mike needed now? | No |
| Can agents use Gmail search/read before asking Mike for inbox facts? | Yes |
| Can agents send emails freely? | No |
| Can Gmail replace GBP authenticated access? | No |
| Next owner | Auditor |
| Next action | Review proof, mark pass/hold/block, and update Monday |
