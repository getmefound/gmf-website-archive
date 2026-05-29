# GMF Owner Command Plan

Status: active
Owner: Mike
Purpose: give Mike one operating view of what agents are doing, what is blocked, what is ready, and where owner involvement is required.

Training escalation protocol: `docs/GMF_AGENT_TRAINING_ESCALATION_PROTOCOL.md`

Owner communication channel: Manager communicates owner-needed items to Mike by Slack DM only. Routine progress stays in Monday/Mission Control/proof artifacts.
Current delivery status: true Manager/openclaw DM is working. Mike's `Manager, status of latest sop` DM was received and answered. The missed `Manger, what do you need from me` message exposed a too-literal command parser; the router now accepts the common Manager typo and plain owner-needed questions in Mike's DM.
Manager alias status: Mike may address the General Manager as `Manager` or `Elon`; both names route to the Manager/business interface.
Owner Gmail access status: connected Gmail/OAuth read/search is available as a self-serve evidence path. Agents use it before asking Mike for inbox facts, client-originated details, access invitations, vendor notices, receipts, or prior instructions. No passwords, recovery codes, 2FA codes, unrelated personal content, or live sends are allowed in proof without the proper SOP and approval gate.

## Operating Promise

GMF work should move autonomously until a real owner-required blocker appears.

Agents should not stop after drafting a plan. They should execute the safe parts, record proof, update status, and only bring Mike in for decisions, access, approvals, spend, legal/billing/deliverability/reputation risk, public edits, live sends, or unresolved blockers.

Non-stop execution rule: Manager keeps going after each completed step. A finished proof file, Monday update, report draft, or partial verification is not a stopping point by itself. Manager moves to the next safe agent-owned action automatically until the work is Done, the queue is empty, or Mike is genuinely required. When Mike is required, Manager asks him directly with the smallest exact request and the evidence of what was already exhausted.

No silent stop rule: Manager/Codex does not stop without either asking Mike for the exact thing needed or reporting which agent/workstream is still running, where it is visible in Monday/Mission Control/proof, and what the next expected event is. If an agent stops before completing its task, Systems Director/Manager must fix the runtime, schedule, script, SOP, access path, or dispatcher mapping until the task runs or a true owner-needed blocker is proven and escalated.

Universal exhaustion rule: Manager cannot ask Mike for anything on any topic until the assigned agent has exhausted existing access, public sources, workspace docs, Slack history, Monday, Mission Control, proof artifacts, safe read-only checks, and available tools. If an agent can inspect, verify, draft, document, test, research, route, or request training for the next step, Mike is not needed yet.

Mike talks to Manager by Slack DM. Manager runs the business interface, assigns the agents, asks Coach/Trainer to train weak spots, and brings Mike only the decision, blocker, or owner-level status.

## Command Checklist

| Status | Workstream | Owner Agent | Reviewer | Done Proof | Mike Needed |
| --- | --- | --- | --- | --- | --- |
| [x] | Record owner autonomy rule in repo memory | Manager | Auditor | `AGENTS.md` and `docs/AGENT_OPERATING_MODEL.md` updated | No |
| [x] | Make Manager the primary business interface | Manager | Auditor | `AGENTS.md`, `docs/AGENT_OPERATING_MODEL.md`, and this command plan updated | No |
| [x] | Route Manager owner-needed communication to Slack DM only | Manager / Systems Director | Auditor | Rules updated; production deployed; outbound and inbound DM verified; typo/plain-question router fix deployed | No |
| [x] | Add agent skill-gap training rule | Coach/Trainer | Auditor | Training escalation rule added to operating docs | No |
| [x] | Build SOP master inventory | Coach | Auditor | `docs/GMF_SOP_MASTER_MAP.md` and SOP index created | No |
| [x] | Build SOP health/testing dashboard | Reporter | Auditor | `docs/sops/SOP_HEALTH_DASHBOARD.md`, backlog, live pilot queue | No |
| [x] | Start friend test-client pilot | Manager | Auditor | Southington Lawn Service LLC intake and evidence docs started | No |
| [x] | Verify Monday live board connection | Systems Director | Manager | Monday list/setup command succeeded against `Agents Jobs` board `18415045648` | No |
| [x] | Push active SOP/pilot work into Monday | Manager | Reporter | Monday items created for Southington pilot and owner command rhythm | No |
| [ ] | Verify Southington GBP access | Profile Manager / Systems Director | Auditor | Partial proof captured in `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md`; authenticated role/profile proof still pending | No, unless authenticated access path fails or public edit approval is needed |
| [ ] | Complete Southington minimum intake | Account Manager | Manager | Contact, emails, phone, Yardbook services, review URL, and place ID captured; website, service area/address rule, hours, and priority services still need agent verification | No, until Account/Profile Manager exhaust public, client-originated, and GBP-accessible facts |
| [x] | Run Southington baseline visibility scan | Reporter | Auditor | `docs/sops/live-pilots/2026-05-27-southington-baseline-visibility-report.md` stored and Monday updated | No |
| [x] | Run Southington GBP audit | Profile Manager | Auditor | `docs/sops/live-pilots/2026-05-27-southington-gbp-audit-proposed-edits.md` stored and Monday updated | Mike approval before public edits |
| [x] | Run Southington Google AI Search readiness audit | Profile Manager / Reporter | Auditor | `docs/sops/live-pilots/2026-05-27-southington-google-ai-search-readiness-audit.md` stored and Monday updated | No |
| [x] | Capture and test Southington review link | Profile Manager | Auditor | Review URL captured from client-originated email signature and HTTP redirect tested to place ID `ChIJxypnrEz5KkYRgxXufgych38` | No, live review requests still require consent/send approval |
| [x] | Sync website/profile facts | Profile Manager | Auditor | `docs/sops/live-pilots/2026-05-27-southington-website-profile-fact-sync.md` stored and Monday updated | Mike/client approval before public edits |
| [ ] | Convert SOPs from drafted to live-tested | Manager | Auditor | Live pilot evidence attached per SOP | Only for approvals/risk/access |
| [ ] | Establish daily owner command rhythm | Manager | Reporter | Daily status shows active, blocked, done, needs-Mike | No |
| [ ] | Add real agent runtime/watchdog | Systems Director / Manager | Auditor | `npm run agent:watchdog` reports whether Agent Working rows are script-runnable, manual-audit, access-blocked, or unmapped | No, unless owner approval is needed for always-on scheduling |
| [x] | Add Gmail as owner evidence source | Systems Director / Manager | Auditor | Gmail connector read/search verified; owner email access rule added to `AGENTS.md`, `docs/AGENT_OPERATING_MODEL.md`, and SOP 180 | No |
| [x] | Accept `Elon` as Manager alias | Manager / Systems Director | Auditor | Slack and local command routing treat `Elon` as Manager | No |
| [x] | Create independent Business Improvement Auditor | Sentinel (Business Improvement Auditor) | Manager / Auditor | `docs/GMF_BUSINESS_IMPROVEMENT_AUDITOR.md`, `scripts/business-improvement-audit.mjs`, and daily workflow created | No |
| [ ] | Review first Business Improvement Auditor morning report | Sentinel (Business Improvement Auditor) | Manager / Auditor | Current report in `docs/client-ops-ledger/business-improvement-audit-current.md`; Monday item tracks first-run review | No |
| [ ] | Set up GMF owned GBP/social presence | Manager / Profile Manager / Systems Director | Auditor | `docs/GMF_OWNED_PRESENCE_LAUNCH_PLAN.md`, `docs/client-ops-ledger/gmf-owned-presence-registry.md`, and GMF client ledger row created | Only for public phone/address, platform verification, spend, or final public publish approval |

## Active Agent Assignments

| Agent | Owns Now | Current Output |
| --- | --- | --- |
| Manager | Routing, status, blockers, Monday handoff, next actions | Owner command plan, Monday board items, and SOP queue |
| Systems Director | Monday connection, board schema, environment readiness | Monday board verified: `Agents Jobs` / `18415045648` |
| Systems Director / Manager | Gmail evidence path and access safety | Gmail connector read/search verified; no passwords/2FA/raw codes; live sends approval-gated |
| Account Manager | Friend test-client intake and client-facing asks | Southington minimum intake completion from public facts first |
| Profile Manager | GBP access, GBP audit, review link, profile facts | Southington review link and partial facts captured; authenticated GBP role/profile proof still open |
| Reporter | Baseline visibility report, owner dashboard, proof summaries | Southington baseline report task in Monday |
| Auditor | Proof gates, risky action blocks, public-edit guardrails | Evidence review before Done |
| Coach | SOP structure, training, updates from live pilots | Skill-gap training protocol added and SOP 178 drafted |
| Scout | Current Google/Search/commerce research | Research updates when platform rules change |
| Sentinel (Business Improvement Auditor) | Independent review of agent efficiency, process failures, prospecting, retention, and business leverage | Daily report, improvement recommendations, and watchdog-informed operating critique |
| Profile Manager / Systems Director | GMF owned presence setup | GBP eligibility, duplicate check, social handle/account registry, and approval packet |

## Monday Items Created

| Monday Item | Owner Agent | Reviewer |
| --- | --- | --- |
| Southington - Verify GBP Manager access | Profile Manager | Auditor |
| Southington - Complete minimum intake facts | Account Manager | Manager |
| Southington - Baseline visibility report | Reporter | Auditor |
| Southington - GBP audit and proposed edits | Profile Manager | Auditor |
| Southington - Google AI Search readiness audit | Profile Manager / Reporter | Auditor |
| Southington - Review link capture and test | Profile Manager | Auditor |
| Southington - Website/profile fact sync | Profile Manager | Auditor |
| GMF - Owner command rhythm | Manager / Reporter | Auditor |
| GMF - Agent skill-gap training escalation protocol | Coach/Trainer | Auditor |
| GMF - Fix Manager Slack DM delivery | Systems Director | Manager |
| GMF - GBP read-only verification path setup | Systems Director / Profile Manager | Auditor |
| GMF - Agent runtime watchdog and dispatcher | Systems Director / Manager | Auditor |
| GMF - Owner Gmail evidence access rule | Systems Director / Manager | Auditor |
| GMF - Business Improvement Auditor morning report | Sentinel (Business Improvement Auditor) | Manager / Auditor |
| GMF - Owned presence inventory and account registry | Systems Director / Reporter | Auditor |
| GMF - Google Business Profile eligibility and create/claim path | Profile Manager / Systems Director | Auditor |
| GMF - Social profiles create/fill packet | Systems Director / Reporter / Studio | Auditor |

## Communication Chain

| Situation | Mike Talks To | Manager Routes To | What Mike Gets Back |
| --- | --- | --- | --- |
| Business status | Manager by Slack DM | Reporter / Auditor | Owner summary, blockers, proof |
| New client or pilot | Manager by Slack DM | Account Manager / Profile Manager | Intake status, access blocker, next action |
| Google profile work | Manager by Slack DM | Profile Manager / Auditor | Proposed edits and proof before public changes |
| Reports and dashboards | Manager by Slack DM | Reporter | Client-safe report/proof link |
| Tools, credentials, systems | Manager by Slack DM | Systems Director | Exact access need or completed setup |
| SOP/process gaps | Manager by Slack DM | Coach / Auditor | Updated SOP, trained agent, verified next run |
| Agent cannot do task | Manager by Slack DM | Coach/Trainer | Training request, fix, rerun status |
| Business improvement / agent efficiency | Manager or Elon by Slack DM | Sentinel (Business Improvement Auditor) / Council feeds | Daily improvement report, top constraint, prospecting/retention recommendations |

## Mike Involvement Rules

Mike gets involved only after the universal exhaustion rule passes and one of these appears:

- Owner approval is required.
- Access or credentials are missing and Systems Director or the assigned agent cannot resolve from existing access.
- Public Google profile edits are proposed.
- Live sends, review requests, cold outreach, or customer-facing messages need approval.
- Spend, caps, billing, refunds, legal, deliverability, reputation, or customer-facing risk appears.
- Agents cannot resolve a blocker from the workspace, available tools, public sources, or documented process.

When Mike is needed, Manager must ask with:

- what the assigned agent already tried
- why the team cannot safely finish without Mike
- the exact decision or action needed
- why it matters
- the safest recommended answer
- what will happen immediately after Mike responds

## Owner View Standard

Every active item should show:

- task name
- owner agent
- reviewer
- client/system
- status
- blocker
- next action
- Mike needed: yes/no
- proof link
- last updated date

## Immediate Next Moves

1. Auditor reviews the Southington baseline, GBP audit, AI Search readiness audit, and fact-sync artifacts.
2. Manager continues owner-needed communication in Slack DM; routine status stays in Monday/Mission Control/proof artifacts.
3. Systems Director/Profile Manager follows `docs/sops/live-pilots/2026-05-28-gbp-read-only-verification-path.md` to establish or use a safe authenticated read-only GBP verification path; current workspace tools do not expose a GBP API/client/session.
4. Profile Manager matches the authenticated profile to place ID `ChIJxypnrEz5KkYRgxXufgych38` and verifies accepted invite/role for `mike@getmefound.ai`, clean profile URL, review count/rating, hours, website, address/service-area setting, services, and profile notes.
5. Account Manager completes remaining intake facts from Profile Manager output, Yardbook, client-originated Gmail facts, Yahoo Local, and public sources before any owner ask.
6. Manager asks Mike only if Profile Manager cannot access the profile after the authenticated access path is exhausted, the profile is wrong, client approval is needed for a public edit, or a risk/approval item appears.
7. Auditor reviews before any SOP moves from Drafted to Active or before any public Google edit.
8. Systems Director/Manager runs `npm run agent:watchdog` until a scheduled dispatcher exists, so `Agent Working` in Monday does not imply fake background execution.
9. Every Manager stop/end-of-work note must include either a Mike ask or an agent-running status with monitor location and next expected action.
10. Agents use Gmail read/search before asking Mike for inbox-accessible facts, while keeping outbound sends, security codes, credentials, billing/legal, reputation, and customer-facing actions behind the correct approval gates.
11. Business Improvement Auditor runs `npm run agent:business-audit` each morning and sends Mike an independent report on agent efficiency, process improvements, prospecting, retention, and current owner-needed decisions.
