# Full SOP Certification Run - 2026-05-29

Status: complete for May 31 launch gate
Owner: Manager / Elon
Reviewer: Auditor
Source: `docs/sops/SOP_TESTING_BACKLOG.csv`
Mode: controlled certification, no live prospect sends, no public GBP edits, no payments/refunds, no destructive credential actions

## Result

All 187 tracked SOP rows are now in terminal operating states. There are no vague pending rows, no draft rows, no desktop-review gaps, no dry-run gaps, and no hold rows in the backlog.

| Gate | Result |
|---|---:|
| Tracked SOP rows | 187 |
| Desktop review pass | 187 |
| Dry run pass | 187 |
| Pending audit/proof | 0 |
| Hold | 0 |
| Terminal operating state assigned | 187 |

## Terminal State Counts

| State | Count | Meaning |
|---|---:|---|
| Verified | 5 | Real proof already sufficient and Auditor verified. |
| Launch Ready | 101 | Safe to run inside the SOP boundary with proof logging. |
| Trigger Ready | 54 | Ready to run when the scheduled cadence, platform event, client event, or monitoring trigger occurs. |
| Launch Gate Ready | 12 | SOP is ready, but each live action still requires its named approval, access, spend, legal, reputation, deployment, or data-risk gate. |
| Parked Not Launch-Critical | 9 | Not needed for 6/1 launch; activation is tied to a future channel/tool/client scope decision. |
| Canary Only | 6 | First real event must be shadowed by Manager/Auditor before repeat use. |

## Launch Gates That Remain Intentional

These are not stuck jobs. They are controlled gates for actions that should never run automatically.

| SOP | Owner | Gate |
|---|---|---|
| Cold email launch approval packet | Manager | Campaign approval packet before live send. |
| Cold email live send guardrail | Manager | Mike approval, cap, suppression, and deliverability proof before send. |
| Custom promise approval | Sales Manager | Nonstandard scope requires approval. |
| Flagged partner escalation | Manager | Owner decision before applicant response. |
| Partner payout handling | Sales Manager / Mike | Payout proof and approval before money moves. |
| Google Business Profile update change control | Profile Manager | Public edit approval and proof before posting changes. |
| Email review request send | Reviews Manager | Approved send window and suppression proof before live send. |
| Vercel deploy and rollback | Systems Director | Clean/scoped release and rollback plan before production deploy. |
| Supabase schema migration | Systems Director | Migration, rollback, and approval gate before production DB change. |
| Supabase backup and recovery | Systems Director | Provider backup/PITR proof before high client volume. |
| Legal/privacy copy update | Coach | Claim/privacy review before publishing. |
| Agentic checkout/payment risk review | Auditor / Systems Director | Explicit approval before UCP/AP2/payment implementation. |

## Parked For Monday

These are valid SOPs, but they are not required to start 6/1 client acquisition and fulfillment.

| SOP | Why Parked |
|---|---|
| Social reach prospecting | Not required for Monday cold-email/report launch. |
| UCP/agentic commerce prospect fit check | Advisory only until the product scope opens. |
| Agentic commerce readiness sales handoff | Advisory only until a prospect asks. |
| SMS readiness and A2P gate | SMS is not used for Monday launch. |
| SMS review request send | Blocked behind SMS readiness and consent. |
| Universal Commerce Protocol monitoring | Research trigger only. |
| Merchant Center and UCP eligibility check | Client-specific future trigger. |
| Agentic checkout integration readiness | Explicit owner-approved investigation only. |
| GHL $97 bridge smoke check | GHL is not the active operating stack. |

## Canary SOPs

These can start, but the first real event is shadowed and must be promoted or held within 24 hours.

| SOP | Shadow Rule |
|---|---|
| Client baseline visibility report | First Monday client report gets Auditor fact/wording check. |
| Public review reply posting | First public reply needs manual approval and proof. |
| Cancellation request | First cancellation is Manager/Auditor shadowed. |
| Refund or billing exception | No Stripe action without approval. |
| Refund and dispute handling | No Stripe action without approval. |
| Human-needed Slack alert | First owner-needed DM is watched for delivery. |

## Client Hub Security Fix

The client magic-link gap was fixed in code during this certification run.

Proof:

- Added signed client access token utilities in `lib/client-magic-link.ts`.
- Added an access-required screen in `components/client/ClientAccessRequired.tsx`.
- Protected `/client/[slug]`, `/client/[slug]/customers`, and `/client/[slug]/visibility-report/download`.
- Preserved the token through client hub upload and report download links.
- Ran `npm run build`; result: pass on Next.js 16.2.6.
- Runtime smoke on `next start -p 3021`: unauthenticated `/client/ai-outsource-hub` returned 200 with the access-required screen; unauthenticated report download returned 401.

Operating note: issue client hub links only through the approved client email flow. The owner dashboard token-removal rule is unaffected.

## Done Definition

For May 31, "ready to go live" means:

1. No SOP row sits in vague pending/draft/hold.
2. Launch-critical SOPs have either proof, code/build proof, a canary rule, or a named live-action gate.
3. Irreversible or customer-risk actions remain approval-gated.
4. Parked items cannot silently block Monday work.
5. Watchdog and Monday show active owners, expected receive times, escalation times, and proof requirements.

No Mike action is needed from this certification run.
