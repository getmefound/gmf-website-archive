# GMF Testing Status Current

Owner: Manager / Systems Director / Auditor
Date: 2026-05-29
Mode: safe verification; no destructive credential action; no live sends; no public edits

## Owner Summary

Testing is exhausted for the May 31 launch-readiness pass. Every tracked SOP now has a terminal operating state. Live customer-risk actions remain approval-gated or canary-shadowed by design.

Current status: pass with controlled launch gates.

SOP activation status: 187 tracked SOP rows. Desktop review is 187/187 pass. Dry run is 187/187 pass. Launch-readiness certification now has 5 Verified, 101 Launch Ready, 54 Trigger Ready, 12 Launch Gate Ready, 9 Parked Not Launch-Critical, 6 Canary Only, 0 Hold, and 0 pending audit/proof. The business does not wait for natural live events where controlled proof is enough; first Monday clients become monitored canaries.

Synthetic testing plan: `docs/sops/SOP_SYNTHETIC_TESTING_PLAN.md`. First controlled batch: `docs/sops/live-pilots/2026-05-28-synthetic-controlled-test-batch-001.md`. Results: `docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md`. Full certification proof: `docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md`. Fictitious companies can certify safe mechanics and launch readiness, but they do not approve public edits, live sends, payments, legal/billing/reputation actions, or owner approval decisions.

## Tests Run

| Area | Test | Result | Notes |
|---|---|---|---|
| Production build | `npm run build` | Pass | Next.js `16.2.6`; build completed. |
| Lint | `npm run lint` | Fail | Existing lint issues across tooling/preview/calculator/typewriter files. Not caused by the client ledger row, but not green. |
| Secret exposure | `npm run audit:security` | Pass | No obvious secret exposure patterns found. |
| Dependency audit | `npm audit --omit=dev` | Watch | 0 critical, 0 high, 2 moderate tied to Next nested PostCSS. |
| OpenAI/Supabase | `npm run systems:key-rotation-smoke` | Pass | Keys active; production Supabase/ops health green. |
| Slack | `npm run systems:slack-key-rotation-smoke` | Pass | Bot auth, channel read, and production listener healthy. |
| Stripe/Resend | `npm run systems:stripe-resend-key-rotation-smoke` | Pass | Stripe account/prices and Resend domain/production health green. |
| Smartlead | `npm run prospecting:preflight` | Pass | Ready for tiny seed-test approval packet; no live sends run. |
| Systems readiness | `npm run systems:readiness -- --deep` | Watch | 9 pass, 5 warn, 0 fail, 0 skipped. |
| GBP read-only | `npm run gbp:readonly-preflight` | Partial pass | Southington review link matches place ID; OAuth/API env missing for authenticated GBP proof. |
| Monday board read | `node scripts/monday-agent-jobs.mjs --action list` | Pass | Board reachable; Southington items visible. |
| Client ledger CSV | `Import-Csv docs/client-ops-ledger/client-ops-ledger.csv` | Pass | Southington appears as `GMF-PILOT-001`, `test_client`, MRR `0`. |
| Supabase client registry | Direct read-only REST check | Pass | `client_profiles` and `client_integrations` reachable; Southington not added there yet. |
| Local runtime | `next start -p 3017` smoke | Pass | Home 200, `/mike-mc/clients` gate 200, `/client/ai-outsource-hub` 200, `/client/southington-lawn-service` 404. Server stopped after test. |
| Client hub magic-link gate | Code/build/runtime proof | Pass | `/client/[slug]`, `/client/[slug]/customers`, and report download now require signed access token; `npm run build` passed; unauthenticated hub shows access-required screen and download returns 401. |
| Manager watchdog | `node scripts/manager-agent-watchdog.mjs --json` | Pass | Latest outbox: `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-30T01-18-49-854Z.md`; 34 watched jobs, 0 owner-needed, timers OK in reported rows. |

## SOP Testing Solution

| Step | Owner | Status | Next Proof |
|---|---|---|---|
| Audit the 11 proof-ready SOPs | Auditor | Done in Monday item `12129054167` | `docs/sops/live-pilots/2026-05-29-launch-readiness-certification-audit.md` |
| Run synthetic controlled tests for the 43 eligible SOPs | Coach / Systems Director | Done in Monday item `12129037957` | `docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md` |
| Implement queue-control timers and next-agent acknowledgment | Systems Director / Manager | Ready For Review in Monday item `12129166954` | Auditor review of queue-control fields and watchdog proof |
| Finish the 4 in-progress real-client/system SOPs | Assigned specialist agents | In progress | Authenticated proof or documented access failure |
| Use Southington and GMF as real low-risk pilots where synthetic proof is not enough | Profile Manager / Manager | In progress | Real-client proof artifacts |
| Repair 6 launch holds | Systems Director / Manager / Auditor | Done for May 31 terminal-state gate | SMS parked for Monday, deploy/Supabase remain launch-gated, client magic-link code fixed |
| Remove vague pending rows | Manager / Auditor | Done | 0 pending audit/proof, 0 hold, 187 terminal operating states |

## Queue-Control Enforcement Update

After Mike asked why the Southington authenticated GBP test stopped, Manager/System Director implemented the first queue-control enforcement layer.

| Item | Result |
|---|---|
| Monday queue fields | Added `Waiting State`, `Expected Receive`, `Escalate At`, `Next Owner`, `Handoff Ack`, `Ack At`, `Unlock Proof`, `Runtime State`, and `Last Watchdog` |
| Watchdog | Now watches `Agent Working`, `Waiting...`, `Ready For Review`, `Blocked...`, and `Human Needed` states |
| Southington GBP access | Main and dependent access items now show `Waiting on Access`, unlock proof, next owner, and timers |
| Latest proof | `docs/client-ops-ledger/outbox/manager-agent-watchdog-2026-05-28T16-30-38-906Z.md` |
| Owner-needed count | `0` |

## Known Blockers / Watch Items

| Item | Status | Owner | Why It Is Not Exhausted |
|---|---|---|---|
| Southington authenticated GBP access proof | Blocked on access path | Profile Manager / Systems Director | Workspace lacks GBP OAuth/API/session. Public review link proof passes, but Manager role/profile facts still need authenticated verification. |
| Client hub magic-link protection | Pass | Systems Director / Auditor | Signed access-token gate added to client hub, customer upload, and report download; issue links through approved client email flow. |
| `/mike-mc/clients` complete all-client registry | Needs wiring | Systems Director / Manager | Supabase registry works, but the owner-wide list is split between CSV, Monday, and Supabase. Southington is in CSV/Monday, not Supabase client profiles. |
| Lint suite | Failing | Systems Director / Coach | Existing lint errors are broader than today's changes and need a cleanup batch. |
| Next/PostCSS moderate advisory | Watch | Systems Director | Latest stable Next `16.2.6` still pins nested vulnerable PostCSS; high advisory was patched. |
| Systems readiness warnings | Watch | Systems Director | Readiness has 5 warnings: dirty worktree, legacy Vercel domain still present, Supabase backup/PITR not proven, VPS backups not proven, and password-manager recovery coverage not agent-verifiable. |

## Current Owner View

- Southington Lawn Service LLC is a non-billing friend test-client pilot.
- It is visible in Monday and in `docs/client-ops-ledger/client-ops-ledger.csv`.
- It is not yet visible in the Supabase-backed `/mike-mc/clients` editor by design, because client hub magic-link protection is not finished.
- No live prospect sends, review requests, public GBP edits, or destructive credential actions were run during this test pass.
