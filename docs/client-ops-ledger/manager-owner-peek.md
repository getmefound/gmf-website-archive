# Manager Owner Peek

Purpose: give Mike enough visibility to trust the agent team without reading every log.

## Current Visibility

| Place | What Mike sees | When to use it |
|---|---|---|
| Slack `#04-aoh-ops` | Manager answers, simple status, blockers, and follow-ups. | Daily conversation with Manager. |
| Mission Control front page | Active jobs, current blocker, agents, spend, and links to rooms. | Quick owner check. |
| Reach job room | Cold email lane status, team handoff, training, and next blocker. | Campaign-specific check. |
| `#04-aoh-ghl-feed` | GHL/system proof and noisier automation evidence. | Only when something needs proof. |
| `#04-aoh-prospects` | Prospect/list work and raw campaign-list discussion. | Only when checking list quality. |
| GitHub Actions + ledger outbox | Exact workflow runs, reports, CSVs, and audit history. | Debugging or proof, not daily owner reading. |

## DM Recommendation

Manager should not DM every agent action. That becomes noise.

Recommended DM policy:

- one short daily owner brief
- urgent exception only
- no raw logs
- no every-row updates
- no every-agent chatter

Example DM:

```text
Reach today: Reviews and AI running. Relay needs 5 more clean contacts. No action needed from Mike unless raising spend or overriding safety.
```

## Commands

```text
Manager, owner peek
Manager, status
Manager, run Reach Cold Email Campaign
Manager, train Reach team
Local Visibility Manager, prepare GBP access test
```

## What Manager Should Bring Mike

Manager should bring Mike:

- decisions that affect spend
- safety overrides
- target/offer changes
- Google Business Profile access blockers
- client-facing risk
- stuck work that agents cannot clear

Manager should not bring Mike:

- every scrape result
- every email verification row
- every internal QA note
- every GitHub workflow line
- every routine auto-run
