# SOP 009 - Partner Application Review

Status: Drafted
Version: 0.2
Owner: Sales Manager
Reviewer: Manager
Approver: Sales Manager; Mike for flagged decisions
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-009-partner-application-review.md`

## Purpose

Review partner applications consistently, approve good-fit referral partners, decline no-fit applicants kindly, and escalate risky applications before sending a decision.

## Covered Master Map Rows

- Partner application intake
- Partner application review
- Partner code and referral link generation
- Approved partner email
- Declined partner email
- Flagged partner escalation

## Trigger

New Supabase `agent_tasks` row where `kind` is `partner_application`.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Ensures application intake creates task and confirmation email |
| Sales Manager | Reviews application and makes approve/decline/flag decision |
| Sales Rep | Sends approved/declined emails only after decision |
| Manager | Escalates flagged applications to Mike |
| Mike | Decides unclear, risky, or material partner exceptions |

## Hard Rules

- Do not approve self-referral abuse.
- Do not approve applicants who create brand, legal, spam, or reputation risk.
- Do not send approval/decline email while status is flagged.
- Partner payout is manual monthly unless Mike approves automation.
- Commission promise remains the approved source-of-truth amount.

## Procedure

1. Find the application task.
   - Check `agent_tasks` for `kind: "partner_application"` and `status: "new"`.
   - Confirm submitted fields are present.

2. Review fit.
   - Good-fit examples: web designers, bookkeepers, virtual assistants, business coaches, content creators, podcast hosts, or trusted local-business service providers.
   - Check how they work with local businesses and whether the audience is credible.

3. Check red flags.
   - Self-referral intent
   - Unrealistic volume claims
   - Spammy or deceptive marketing
   - Overlap/conflict with GMF services
   - Unclear partner type
   - Brand/reputation concern

4. Decide.
   - Approve: applicant is credible and fits program.
   - Decline: applicant is not a fit but does not need escalation.
   - Flag: Mike decision needed.

5. Approved path.
   - Generate partner code from name or brand: lowercase, simple, no spaces.
   - Create referral link: `https://getmefound.ai/ref/PARTNERCODE`.
   - Update task with decision, code, link, and result payload.
   - Sales Rep sends approved partner email.

6. Declined path.
   - Update task with decline reason.
   - Sales Rep sends kind decline email.

7. Flagged path.
   - Do not email applicant yet.
   - Manager prepares Mike packet with application details, concern, and recommendation.

## Required Proof

- Application task
- Decision
- Partner code/link if approved
- Email sent status
- Flag packet if escalated
- Task result payload

## Failure Or Blocker Handling

- Missing fields: Sales Rep asks one clarification or Sales Manager holds.
- Code collision: choose a clear alternate and log it.
- Payout/commission question: route to Sales Manager/Mike.
- High-risk applicant: Manager escalates before any response.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded partner review, approve/decline/flag paths, and task proof rules | Coach |

## Source Documents

- `docs/GMF_PARTNER_PROGRAM.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `app/api/partners/route.ts`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

