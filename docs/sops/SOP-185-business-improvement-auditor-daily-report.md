# SOP-185 Business Improvement Auditor Daily Report

Source of truth: `docs/sops/SOP-185-business-improvement-auditor-daily-report.md`

## Status

Drafted

## Purpose

Give Mike a daily independent read on whether the agent business is actually improving: agent efficiency, bottlenecks, stalled work, prospecting quality, retention risk, and the next highest-leverage process improvement.

## Trigger

- Every business morning
- Mike asks for agent efficiency, process improvement, prospecting, retention, or business audit status
- Watchdog detects owner-needed, overdue, stopped, missing timer, or unmapped work

## Owner

Agent Ness (Business Improvement Auditor)

## Reviewer

Manager / Auditor

## Required Inputs

- `npm run agent:watchdog -- --json`
- Monday Agents Jobs board
- `docs/client-ops-ledger/client-ops-ledger.csv`
- `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`
- `docs/client-ops-ledger/gmf-testing-status-current.md`
- `docs/client-ops-ledger/systems-director-readiness-current.md`
- current proof/outbox artifacts

## Steps

1. Run the watchdog and confirm watched job counts, owner-needed items, queue-control gaps, and timers.
2. Read the client ledger and separate paid clients, test clients, internal demos, onboarding clients, and at-risk clients.
3. Read prospecting readiness and identify the next safe acquisition move.
4. Identify the single main operating constraint.
5. Score agent efficiency.
6. Recommend the top process improvements.
7. Name the next owner for each recommendation.
8. Separate owner-needed decisions from routine agent-owned work.
9. Store the current report and outbox proof.
10. Send the report to Mike on the configured morning destination.

## Script

```text
npm run agent:business-audit
```

With Slack delivery:

```text
npm run agent:business-audit -- --post-slack
```

## Output

- `docs/client-ops-ledger/business-improvement-audit-current.md`
- `docs/client-ops-ledger/outbox/business-improvement-audit-*.md`
- watchdog outbox proof

## Pass Criteria

- Report generated without exposing secrets.
- Watchdog proof is linked.
- Owner-needed count is explicit.
- Overdue/missing-timer work is explicit.
- Prospecting and retention recommendations are present.
- Every improvement recommendation has a responsible owner or routing path.
- Business Improvement Auditor does not self-approve its own recommendations.

## Fail / Rescue

If the report cannot run:

1. Systems Director checks script/runtime/env failure.
2. Manager creates or updates a Monday item with queue-control timer.
3. Auditor checks whether missing proof creates client or owner risk.
4. Manager asks Mike only if a required access/approval path is exhausted.

## Live Pilot

In progress - first report generated from the 2026-05-28 watchdog and Southington access-gap state.
