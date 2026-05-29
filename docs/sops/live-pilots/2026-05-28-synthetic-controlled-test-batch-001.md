# Synthetic Controlled Test Batch 001

Status: ready to run
Owner: Manager
Execution owners: Coach, Systems Director, Reviews Manager, Account Manager, Reporter, Auditor
Reviewer: Auditor
Date opened: 2026-05-28
Purpose: test the 43 SOPs that can be safely exercised through synthetic scenarios or controlled non-production checks.

## Guardrails

- No live Smartlead sends.
- No live review requests.
- No SMS sends.
- No public Google Business Profile edits.
- No public review replies.
- No Stripe charges, refunds, disputes, or subscription changes.
- No HighLevel AI feature toggles.
- No destructive credential action.
- All company/client data in this batch is synthetic unless explicitly labeled otherwise.

## Synthetic Companies Used

| Synthetic ID | Company | Role In Batch |
|---|---|---|
| SYN-001 | Maple Ridge Lawn & Landscape LLC | GBP/Get Found, AI visibility, review and public-profile approval rehearsal |
| SYN-002 | Oak & Pine Home Services | Pricing, checkout, report artifact, live-send approval rehearsal |
| SYN-003 | Riverbend HVAC & Plumbing | Client question, call request, complaint, incident response rehearsal |
| SYN-004 | Harbor Pet Grooming Studio | Cancellation, refund/billing exception, review alert rehearsal |
| SYN-005 | BrightSmile Dental Studio | Claim audit, reputation risk, compliance-heavy wording rehearsal |

## Run Method

1. Assigned owner opens the SOP and identifies the trigger, decision point, proof requirement, and unsafe action boundary.
2. Owner simulates the trigger with one of the synthetic companies.
3. Owner completes only safe/non-production steps: draft, preview, route, inspect, generate artifact, update proof, or run read-only/local checks.
4. Owner stops before live external action and records the exact blocked live action.
5. Auditor marks the SOP synthetic pass, hold, or SOP update needed.
6. Manager updates the official backlog only as controlled/synthetic proof. Real-live proof is not claimed unless the SOP allows controlled non-production as its live-pilot gate.

## SOPs In This Batch

| Group | SOP | Owner | Synthetic Scenario | Done Proof |
|---|---|---|---|---|
| Reviews/reputation | SMS readiness and A2P gate | Systems Director | SYN-004 phone-review campaign preview | A2P/readiness checklist with no send |
| Reviews/reputation | SMS review request send | Reviews Manager | SYN-004 no-send render preview | Rendered proof and send-block note |
| Reviews/reputation | Review reply drafting | Reply Writer | SYN-005 neutral/negative review draft | Draft with claim-safe language |
| Reviews/reputation | Review reply approval | Account Manager | SYN-005 manager approval route | Approval/hold decision proof |
| Reviews/reputation | Negative review alert | Reviews Manager | SYN-004 negative review simulation | Alert routing proof |
| Reviews/reputation | Public review reply posting | Profile Manager/Reply Writer | SYN-005 public reply rehearsal | Draft proof and public-post block |
| Client care | Client question handling | Account Manager | SYN-003 client asks service/status question | Routed response proof |
| Client care | Client call request | Account Manager | SYN-003 asks for call | Call request log and owner assignment |
| Client care | Client complaint or reputation risk | Manager | SYN-003 complaint escalates risk | Escalation packet proof |
| Client care | Cancellation request | Account Manager | SYN-004 cancellation request | Cancel path draft and flags |
| Finance/risk | Refund or billing exception | Manager/Mike | SYN-004 refund request | Decision packet; no Stripe action |
| Reporting/proof | Visibility report shared record model | Systems Director | SYN-001 report data shape | Local/schema proof |
| Reporting/proof | Prospect report artifact generation | Reporter | SYN-002 free report request | Synthetic report artifact |
| Reporting/proof | Client report artifact generation | Reporter | SYN-001 monthly report draft | Synthetic client report artifact |
| Reporting/proof | Proof artifact storage | Reporter | SYN-001 proof upload/index entry | Proof location and naming check |
| Governance | SOP health dashboard | Manager/Coach | Current backlog count scenario | Dashboard/count proof |
| Systems | Vercel deploy and rollback | Systems Director | Non-production rollback drill | Dry rollback/runbook proof |
| Systems | Supabase schema migration | Systems Director | Local/test migration plan | Migration plan and rollback proof |
| Systems | Supabase backup and recovery | Systems Director | Restore-readiness checklist | Backup/PITR evidence or blocker |
| Systems | HighLevel AI feature safety check | Systems Director | HLG/AI toggle audit drill | Safety check proof; no toggles |
| Systems | Client magic-link auth lifecycle | Systems Director | SYN-001 client hub access lifecycle | Local/non-production auth proof |
| Finance/risk | Refund and dispute handling | Manager/Mike | SYN-004 dispute simulation | Decision packet; no Stripe action |
| Finance/risk | Pricing change approval | Sales Manager/Mike | SYN-002 asks for custom pricing | Approval packet; no price edit |
| Systems/risk | Vendor subscription change | Systems Director/Mike | Tool renewal/change scenario | Approval packet; no vendor change |
| Training | Agent training pack update | Coach | New testing rule added | Training pack diff/proof |
| Training | Client-safe language review | Coach/Auditor | SYN-005 AI-search claim wording | Safe wording audit proof |
| Training | Offer ladder source-of-truth update | Coach | SYN-002 offer/pricing copy mismatch | Source-of-truth update proposal |
| Audit | Auditor proof gate | Auditor | SYN-001 proof-ready workflow | Pass/hold/block decision proof |
| Audit | Client-facing claim audit | Auditor | SYN-005 compliance-heavy claim | Claim audit proof |
| Audit | AI visibility claim audit | Auditor | SYN-001 AI Search copy | Claim audit proof |
| Audit | SOP adherence audit | Auditor | Batch evidence review | Adherence pass/hold proof |
| Audit | Process failure retrospective | Auditor/Manager | Synthetic missed handoff | Retrospective proof |
| Approval | Live send approval | Auditor/Manager | SYN-002 email send request | Approval/deny proof; no send |
| Approval | Public profile edit approval | Auditor/Manager | SYN-001 GBP edit request | Approval/deny proof; no edit |
| Risk | Reputation risk escalation | Auditor/Manager | SYN-005 reputation issue | Escalation packet proof |
| Systems/risk | Credential/access escalation | Systems Director/Manager | Expiring key/access issue | Escalation packet; no destructive action |
| Owner visibility | Human-needed Slack alert | Manager | Approval-needed packet simulation | DM-ready message proof; no spam |
| Incident | Incident response | Systems Director/Auditor | Broken webhook/key smoke failure drill | Incident log and resolution proof |
| Training | Agent skill-gap training escalation | Coach/Trainer | Agent cannot complete GBP proof | Training request and resume proof |
| Queue control | Waiting state SLA and timer control | Manager | SYN-003 job enters `Waiting on Agent` then misses expected receive | Waiting reason, next owner, expected receive, escalation time, and rescue action proof |
| Queue control | Agent-to-agent handoff and receive acknowledgment | Manager | SYN-001 Profile Manager hands audit to Auditor | Handoff packet, acknowledgment, due time, and missed-ack rescue proof |
| Queue control | Stuck agent timeout and rescue | Systems Director / Manager | SYN-002 report job misses heartbeat | Stuck classification, rescue route, reroute/training/repair proof |
| Queue control | Client information request cadence and escalation | Account Manager | SYN-004 client has not sent photos/customer list | Client ask, reminder cadence, safe parallel work, and hold/park decision proof |

## Done Criteria For Batch

This batch is complete when all 43 SOPs have one of these Auditor outcomes:

- Synthetic pass: controlled/non-production proof is sufficient for the live-pilot gate.
- Rehearsal pass, real proof still required: SOP mechanics work, but activation waits for real event.
- Hold: SOP needs wording, ownership, tool, or proof change before activation.
- Blocked: access/tool/customer-risk issue prevents safe completion.

## Backlog Update Rule

After Auditor review, update `docs/sops/SOP_TESTING_BACKLOG.csv` and `docs/sops/SOP_LIVE_PILOT_QUEUE.csv` with the exact outcome. Do not move an SOP to audit pass or release until Auditor has linked proof.
