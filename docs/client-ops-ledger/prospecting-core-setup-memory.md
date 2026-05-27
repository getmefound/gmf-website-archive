# Prospecting Core Setup Memory

Status: active owner preference
Owner: Manager
Recorded: 2026-05-27

## Mike's Direction

Mike wants the core prospecting operating setup built before campaign work continues.

The operating model is:

- agents run the jobs
- Manager only contacts Mike when human involvement is required
- Slack is for human-needed alerts and on-demand questions
- Monday is the close-monitoring work board
- Mission Control is the owner report surface
- Langfuse is the agent trace/debug layer
- Smartlead is the send/deliverability system

Do not treat chat history as the only source of truth. This file, the prospecting operating plan, the agent job queue, and the Monday-ready seed file are the durable memory for this setup.

## Core Setup Order

1. Create/confirm Monday structure for prospecting jobs.
2. Add the first human-needed job: refresh Smartlead API access.
3. Store Smartlead API access locally and in production only after Mike provides/authorizes it.
4. Re-run `npm run prospecting:preflight`.
5. If preflight passes, let agents proceed to target/list/copy/seed-test planning.
6. If preflight fails, Manager reports only the human-needed blocker.

## Manager Contact Rule

Manager may contact Mike only for:

- approval before live prospect or client action
- spend or cap increase
- broken account/API access
- legal, billing, deliverability, reputation, or customer-facing risk
- a blocker agents cannot clear themselves

Routine progress should go to Monday, Mission Control, proof files, or on-demand Slack.

## First Human Job

Title: Refresh Smartlead API access

Why human is needed: Smartlead account/API access is controlled by Mike. Agents cannot safely create or rotate account credentials without owner authorization.

Proof required before done:

- new Smartlead API key exists in the secure store
- local `.env.local` has `SMARTLEAD_API_KEY`
- Vercel production has `SMARTLEAD_API_KEY`
- `npm run prospecting:preflight` passes or shows a new non-access blocker

## Live Monday Status

Live Monday write is not connected yet in this workspace. The first item is queued in:

- `docs/client-ops-ledger/monday-prospecting-core-setup-import.csv`
- `docs/client-ops-ledger/agent-jobs.csv`

When Monday access exists, this job should be item #1 on the prospecting board.
