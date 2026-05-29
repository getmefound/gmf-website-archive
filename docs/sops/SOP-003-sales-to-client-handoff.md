# SOP 003 - Sales To Client Handoff

Status: Drafted
Version: 0.2
Owner: Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-003-sales-to-client-handoff.md`

## Purpose

Move a closed-won prospect into client onboarding without losing scope, payment proof, promised work, or owner accountability.

## Covered Master Map Rows

- Sales-to-client handoff
- Closed-won handoff
- Stripe payment to client record
- Manual client start

## Trigger

- Stripe checkout completes
- Signed approval exists
- Mike approves a manual client start
- Sales Rep marks opportunity closed-won

## Roles

| Role | Responsibility |
|---|---|
| Sales Rep | Provides sale context, plan, promise notes, and prospect history |
| Manager | Opens onboarding and assigns owners |
| Systems Director | Creates client record/hub shell when needed |
| Account Manager | Owns client communication after handoff |
| Auditor | Checks proof, scope, and unsupported promise risk |
| Mike | Approves manual starts and exceptions |

## Hard Rules

- Do not open onboarding from an abandoned checkout.
- Do not start client work without Stripe payment, signed approval, or Mike-approved manual start.
- Do not carry custom promises into fulfillment unless Sales Manager/Manager approved them.
- After payment, Account Manager owns client communication; Sales Rep does not run onboarding.

## Procedure

1. Verify closed-won proof.
   - Confirm Stripe payment, signed approval, or Mike manual-start approval.
   - Save payment/session/approval reference.

2. Confirm purchased offer.
   - Identify Get Found, Stay Found, Always Ready, or approved custom scope.
   - Note price, billing cadence, start date, and any partner/referral code.

3. Package sales context.
   - Include business name, contact, email, website, location, phone, plan, source, report link, objections, promised next step, and known blockers.

4. Audit promises.
   - Auditor checks for unsupported guarantees, out-of-scope work, risky review language, AI/Search claims, or timeline promises.
   - Risky scope goes to Manager/Sales Manager before onboarding starts.

5. Create onboarding task.
   - Manager opens onboarding with owner, due date, plan, and first client ask.
   - Systems Director creates record/hub shell if not automated.

6. Notify Account Manager.
   - Account Manager receives the handoff packet and owns welcome email.
   - Client should get one clean welcome path, not mixed messages from multiple agents.

7. Close sales lane.
   - Sales Rep updates opportunity to closed-won and stops prospect follow-up.
   - Any upgrade opportunity waits until client proof/timing supports it.

## Required Proof

- Payment/signed/manual-start proof
- Handoff packet
- Onboarding task/client record
- Assigned Account Manager
- Auditor note if any promise was flagged

## Failure Or Blocker Handling

- Payment missing: return to Sales Rep; do not onboard.
- Manual start unclear: Manager asks Mike for explicit approval.
- Custom promise risky: hold and route to Sales Manager/Manager.
- Client contact missing: Sales Rep gets corrected contact before onboarding.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded handoff proof, scope, communication, and onboarding gate rules | Coach |

## Source Documents

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/GMF_MOCK_CLIENT_SIGNUP_TO_UPGRADE_DRAFT.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`

