# SOP Activation Batch C - Client Service, Systems, Finance, Audit, And Escalation Controls

Status: desktop review and safe dry-run complete
Owner: Coach/Auditor
Date: 2026-05-27
Purpose: activation notes for remaining P0 SOPs covering client service, systems, finance, proof, and escalation risk.

## Scope

This batch covers the remaining P0 drafts:

- SMS readiness and A2P gate
- SMS review request send
- Review reply drafting
- Review reply approval
- Negative review alert
- Public review reply posting
- Client question handling
- Client call request
- Client complaint or reputation risk
- Cancellation request
- Refund or billing exception
- Visibility report shared record model
- Prospect report artifact generation
- Client report artifact generation
- Proof artifact storage
- Weekly safety audit
- SOP health dashboard
- Environment variable management
- Vercel deploy and rollback
- Supabase schema migration
- Supabase backup and recovery
- Resend domain and email health
- Stripe product and webhook management
- HighLevel AI feature safety check
- Smartlead access/readiness check
- Security sweep
- Client magic-link auth lifecycle
- Refund and dispute handling
- Pricing change approval
- Vendor subscription change
- Agent training pack update
- Client-safe language review
- Offer ladder source-of-truth update
- Auditor proof gate
- Client-facing claim audit
- AI visibility claim audit
- SOP adherence audit
- Process failure retrospective
- Live send approval
- Public profile edit approval
- Reputation risk escalation
- Credential/access escalation
- Human-needed Slack alert
- Incident response

## Gate Result

| Gate | Result | Notes |
|---|---|---|
| Desktop review | Pass | Drafts include owners, hard rules, proof, failure handling, and escalation boundaries |
| Safe dry run | Pass | Fake/safe scenarios reached correct block/route/approve outcomes |
| Live pilot | Pending | Requires real client/system/finance/send/risk event or controlled non-production test |
| Audit | Pending | Auditor must review first real proof before activation |
| Release | Pending | Do not mark Active until live pilot and audit pass |

## Dry-Run Scenarios

| Area | Scenario | Expected Result | Dry-Run Result |
|---|---|---|---|
| SMS/A2P | Client asks for SMS review requests | Systems checks A2P/consent/STOP/HELP before any send | Pass |
| SMS send | SMS request is approved but suppression proof is missing | Block send | Pass |
| Review replies | New 5-star review needs response | Reply Writer drafts; Account Manager approves before posting | Pass |
| Negative review | 2-star review appears | Risk packet to Manager/Auditor; no rushed public reply | Pass |
| Client question | Client asks status | Account Manager answers or routes; updates client record | Pass |
| Client call | Client asks to talk | Account Manager logs request and routes to Manager if needed | Pass |
| Complaint/risk | Client is upset about billing or results | Manager owns escalation; no upsell/review asks | Pass |
| Cancellation | Client asks to cancel | Account Manager routes cancel path and flags Manager/Mike where needed | Pass |
| Refund/billing | Charge issue appears | Manager/Mike decision required before money action | Pass |
| Reports/proof | Report artifact created | Systems/Reporter stores record, artifact, proof, and archive link | Pass |
| Weekly safety | Safety check finds HighLevel AI feature on | Block/escalate; feature must remain off unless Mike explicitly authorized | Pass |
| SOP dashboard | Weekly SOP review requested | Dashboard shows status, owners, stale reviews, blockers | Pass |
| Env vars | New API key needed | Store in approved secret path; no secret in docs/Slack/commit | Pass |
| Deploy/rollback | Production change planned | Verify build/deploy/rollback proof before done | Pass |
| Supabase | Schema change needed | Migration proof and backup/recovery consideration required | Pass |
| Resend/email | Email path used | Domain/auth/delivery proof checked | Pass |
| Stripe | Offer/checkout changes | Product/price/webhook proof and approval required | Pass |
| Magic-link auth | Client hub access changes | Issue/revoke/refresh safely; no cross-client access | Pass |
| Pricing/vendor | Offer price or tool subscription change | Manager/Mike approval route | Pass |
| Training/source truth | Offer or role changes | Coach updates source docs and training pack | Pass |
| Claim audits | Report mentions AI visibility | Auditor removes unsupported guarantees/hacks | Pass |
| Process failure | Failed handoff occurs | Retrospective creates SOP/tool/training update | Pass |
| Live send | Any campaign/send requested | Approval, preview, suppression, and proof gates required | Pass |
| Profile edit | GBP/site public edit requested | Confirm profile, approval, proof, and rollback/hold path | Pass |
| Reputation escalation | Bad review/legal threat appears | Manager/Auditor prepare Mike packet if material | Pass |
| Credential escalation | Login/billing access issue blocks work | Systems/Manager route Mike-only request | Pass |
| Slack alert | Routine progress update exists | No Slack alert; use Monday/Mission Control | Pass |
| Incident | Outage/exposed data/broken send occurs | Stop unsafe action, log incident, route owner/Mike if material | Pass |

## Findings

- These SOPs are structurally ready for controlled live pilots, but many should stay Drafted until a real event occurs.
- Financial, vendor, pricing, refund, access, incident, and reputation SOPs should not be forced into fake activation. Their first real event should be treated as the live pilot.
- Systems SOPs can use controlled non-production smoke tests when available.
- HighLevel AI safety remains a standing P0 control: do not enable any HighLevel AI feature without explicit Mike authorization.
- Slack rules are clear: routine status stays in Monday/Mission Control; Mike gets only human-needed items.

## Next Action

1. Update testing backlog rows in this batch:
   - DesktopReview: `Pass`
   - DryRun: `Pass`
   - LivePilot: `Pending`
   - Audit: `Pending`
   - Release: `Pending`
2. Treat first real incident, refund, deploy, profile edit, send, or complaint as a controlled live pilot.
3. Auditor decides whether to activate or revise after proof exists.
