# SOP 037 - Abandoned Cart Suppression And Exit Rules

Status: Drafted
Version: 0.2
Owner: Sales Manager
Reviewer: Auditor
Approver: Sales Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-037-abandoned-cart-suppression-and-exit-rules.md`

## Purpose

Stop abandoned checkout recovery when continued outreach would be redundant, annoying, unsafe, or wrong.

## Trigger

Prospect buys, opts out, replies, asks for a call, becomes no-fit, or checkout failure appears technical.

## Exit Rules

Stop abandoned cart recovery when:

- Stripe payment completes
- prospect replies no/not interested
- prospect unsubscribes or asks not to be contacted
- prospect asks for a call or human help
- prospect becomes no-fit
- billing/checkout support issue is active
- recovery cadence has completed
- Sales Manager blocks further outreach

## Procedure

1. Check prospect and Stripe/payment status.
2. Check replies, unsubscribe, and support/billing flags.
3. Apply exit reason.
4. Stop automation/manual follow-up.
5. Update prospect status and next owner.

## Required Proof

- Exit reason
- Status update
- Suppression record if applicable
- Owner of next action

## Communication Rule

Abandoned checkout recovery starts helpful: "Did checkout fail?" before "Do you want to buy?" Never imply the prospect is already a client.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Added recovery stop rules and support/billing suppression path | Coach |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`

