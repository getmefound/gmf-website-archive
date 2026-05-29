# SOP Activation Batch A - P0 Sales And Prospecting Controls

Status: desktop review and safe dry-run complete
Owner: Coach/Auditor
Date: 2026-05-27
Purpose: activation notes for the first high-risk P0 SOPs in the GMF SOP testing backlog.

## Scope

This batch covers the first 20 P0 drafts from the SOP health dashboard:

1. Ideal customer profile and no-fit rules
2. Offer-lane selection for prospects
3. Smartlead API access and readiness preflight
4. Sending domain readiness and warmup
5. Prospect QA and suppression
6. Cold email launch approval packet
7. Cold email live send guardrail
8. Reply routing and classification
9. Unsubscribe and do-not-contact handling
10. Free visibility check request intake
11. Free visibility scan research
12. Prospect visibility report build
13. Prospect report claim audit
14. Prospect report delivery email
15. Pricing and checkout link handling
16. Abandoned cart suppression and exit rules
17. Fit call request handling
18. Closed-won handoff
19. Custom promise approval
20. Partner application review

## Gate Result

| Gate | Result | Notes |
|---|---|---|
| Desktop review | Pass | Each SOP has owner, trigger, output, hard rules, procedure, proof, communication rules, failure handling, changelog, and source docs |
| Safe dry run | Pass | Each SOP was walked through with a fake/safe scenario and produced the intended next action |
| Live pilot | Pending | Requires real prospect/client/partner/system event or explicit Mike/Manager approval |
| Audit | Pending | Auditor should review the first real execution proof before activation |
| Release | Pending | Do not mark Active until live pilot and audit pass |

## Dry-Run Scenarios

| SOP | Scenario | Expected Result | Dry-Run Result |
|---|---|---|---|
| SOP 011 - Ideal customer profile and no-fit rules | New campaign idea targets local dentists with weak GBP/review footprint | Mark possible fit; check regulated/claim risk before outreach angle | Pass |
| SOP 012 - Offer-lane selection for prospects | Prospect has inconsistent GBP facts and no clear review link | Route to Get Found first | Pass |
| SOP 001 - Smartlead API access and readiness preflight | API key missing/invalid before live send | Block launch; Manager may ask Mike for API key; no send | Pass |
| SOP 013 - Sending domain readiness and warmup | New sender domain added but warmup maturity not proven | Hold campaign; set recheck date | Pass |
| SOP 016 - Prospect QA and suppression | List contains duplicate business, existing client, and opt-out contact | Remove/suppress/hold before import | Pass |
| SOP 018 - Cold email launch approval packet | Campaign copy and audience ready but Smartlead proof missing | Packet incomplete; no launch | Pass |
| SOP 019 - Cold email live send guardrail | Campaign was approved but copy changed after audit | Re-audit required; no send | Pass |
| SOP 020 - Reply routing and classification | Prospect replies "send me the report" | Classify report request; open SOP 002 path | Pass |
| SOP 021 - Unsubscribe and do-not-contact handling | Prospect replies "take me off your list" | Suppress and stop sequences; no argument | Pass |
| SOP 002 - Free visibility check intake to report delivery | Website CTA request comes in with business name/site/location/email | Create report job, Scout scan, Reporter build, Auditor review, Sales Rep send | Pass |
| SOP 027 - Free visibility scan research | Public scan finds weak GBP facts and stale reviews | Record visible gaps and source URLs; no private/client-only audit | Pass |
| SOP 028 - Prospect visibility report build | Scout notes complete for free report | Build short prospect-safe report with 2-3 gaps and Get Found recommendation | Pass |
| SOP 029 - Prospect report claim audit | Draft report says "we can get you ranked" | Block/edit unsupported ranking claim | Pass |
| SOP 030 - Prospect report delivery email | Auditor-approved report ready | Sales Rep sends and logs; Reporter does not send directly | Pass |
| SOP 033 - Pricing and checkout link handling | Prospect asks "how do I buy Get Found?" | Confirm offer, preserve ref code if any, send correct checkout link | Pass |
| SOP 037 - Abandoned cart suppression and exit rules | Prospect starts checkout, then replies "not interested" | Stop recovery and update status | Pass |
| SOP 038 - Fit call request handling | Prospect asks for a call about custom SEO work | Check fit/scope; Sales Manager reviews custom ask before booking | Pass |
| SOP 040 - Closed-won handoff | Stripe payment completes after report follow-up | Package sale context; Manager opens onboarding; stop prospect follow-up | Pass |
| SOP 042 - Custom promise approval | Prospect asks for guaranteed AI Overview visibility | Decline/redirect; no unsupported promise | Pass |
| SOP 009 - Partner application review | Web designer applies with local-business audience and no red flags | Approve path: generate partner code/link and send approval email after task update | Pass |

## Findings

- These SOPs are strong enough for controlled real-world pilot use, but not yet Active.
- The biggest live blockers are Smartlead API/readiness, actual prospect/report events, and Auditor review of first real proof.
- Mike is needed only for Smartlead account/API access, first live prospecting clearance, material pricing/spend/risk exceptions, or flagged partner issues.
- No SOP in this batch should bypass suppression, proof, or Auditor gates.

## Next Action

1. Update `docs/sops/SOP_TESTING_BACKLOG.csv` for this batch:
   - DesktopReview: `Pass`
   - DryRun: `Pass`
   - LivePilot: `Pending`
   - Audit: `Pending`
   - Release: `Pending`
2. Use the first real low-risk event for each SOP as the live pilot.
3. Auditor records pass/hold/block after proof exists.
