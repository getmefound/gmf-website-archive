# SOP Activation Batch B - Partner, Onboarding, GBP, Review, And Recap Controls

Status: desktop review and safe dry-run complete
Owner: Coach/Auditor
Date: 2026-05-27
Purpose: activation notes for the next high-risk P0 SOPs covering partner approval, client onboarding, Google Business Profile work, review sends, and monthly recaps.

## Scope

This batch covers 35 P0 drafts:

- Partner code and referral link generation
- Approved partner email
- Flagged partner escalation
- Stripe payment to client record
- Manual client start
- Sales-to-client handoff
- Client ID, folder, and hub shell
- Magic-link client access
- Welcome email
- GBP access request
- Customer list request
- Onboarding blocker follow-up
- Client baseline visibility report
- Onboarding done criteria
- GBP access verification
- GBP audit
- Google AI Search readiness audit
- GBP category and service review
- Hours, phone, website, and description review
- Review link capture and test
- Website/profile fact sync
- Crawlability and index eligibility check
- First review request path setup
- Before/after visibility snapshot
- Get Found completion audit
- Get Found delivery email
- Weekly customer/job upload
- Customer list cleaning
- Review request send candidates
- Review request proof preview
- Email review request send
- Private feedback routing
- Monthly Stay Found recap
- Monthly recap audit
- Monthly recap send

## Gate Result

| Gate | Result | Notes |
|---|---|---|
| Desktop review | Pass | Required owner, proof, risk, and handoff structure exists |
| Safe dry run | Pass | Fake partner/client/profile/review scenarios reached correct hold/pass/escalation outcomes |
| Live pilot | Pending | Requires real partner/client/profile/report/send events |
| Audit | Pending | Auditor must review first real proof before activation |
| Release | Pending | Do not mark Active until live pilot and audit pass |

## Dry-Run Scenarios

| Area | Scenario | Expected Result | Dry-Run Result |
|---|---|---|---|
| Partner approval | Approved applicant needs referral link | Generate clean code/link, log task result, send approved email | Pass |
| Partner escalation | Applicant makes unrealistic referral-volume claims | Flag to Manager/Mike; no applicant email yet | Pass |
| Payment/client start | Stripe payment completes | Create client record and onboarding task | Pass |
| Manual start | Mike approves manual start | Manager creates client record without checkout proof and logs approval | Pass |
| Client hub | New client needs hub and magic-link access | Create slug/folder/hub; test magic link before welcome email | Pass |
| Welcome/access asks | Client needs GBP and customer-list instructions | Account Manager sends short client-safe asks and logs due dates | Pass |
| Onboarding blocker | Client has not provided GBP access | Follow up every two business days and keep status blocked | Pass |
| Baseline report | Safe public scan exists | Reporter creates baseline proof artifact; Account Manager owns client delivery | Pass |
| Onboarding done | Launch work appears complete | Auditor verifies proof before done status | Pass |
| GBP verification | Client says invite sent | Profile Manager verifies exact profile and access level | Pass |
| GBP audit | Public profile has category/fact/photo gaps | Profile Manager records fixes and approval needs | Pass |
| AI Search readiness | Site lacks clear crawlable services/location facts | Record crawlability/fact/content proof gaps; no AI ranking promise | Pass |
| Crawlability check | Website visibility work begins | Systems/Profile check index/snippet/robots/sitemap/Search Console notes | Pass |
| Review link | Profile confirmed | Capture and test correct Google review link | Pass |
| Review request setup | Review path included | Reviews Manager verifies link and first safe request path | Pass |
| Get Found completion | Fixes appear done | Auditor proof gate required before delivery email | Pass |
| Customer upload | Stay Found client provides customer list | Account Manager routes to Reviews Manager; consent/source checked | Pass |
| Customer cleaning | List includes duplicate/invalid/suppressed rows | Clean and log counts before send candidates | Pass |
| Review send | Email send requested | Proof preview, suppression, Auditor, and Manager approval required | Pass |
| Private feedback | Customer leaves low/private feedback | Route privately; do not push public review request | Pass |
| Monthly recap | Month-end arrives | Reporter builds proof recap; Auditor reviews; Account Manager sends | Pass |

## Findings

- Partner and onboarding SOPs are ready for controlled pilot with the next real application/signup.
- GBP and Get Found SOPs need real profile/client proof before activation.
- Review-request SOPs must remain Drafted until at least one approved send is audited.
- Monthly recap SOPs need a real client month-end cycle before activation.
- The biggest risk is accidental client-facing send before proof/audit, so Account Manager/Sales Rep send boundaries must stay clear.

## Next Action

1. Update testing backlog rows in this batch:
   - DesktopReview: `Pass`
   - DryRun: `Pass`
   - LivePilot: `Pending`
   - Audit: `Pending`
   - Release: `Pending`
2. Use next real partner application, signup, GBP access event, review send, and monthly recap as live pilots.
3. Auditor records proof and decides whether each SOP can move to Active.
