# SOP 033 - Pricing And Checkout Link Handling

Status: Drafted
Version: 0.2
Owner: Sales Rep
Reviewer: Sales Manager
Approver: Sales Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-033-pricing-and-checkout-link-handling.md`

## Purpose

Give prospects the correct price and checkout path without creating plan confusion or unauthorized discounts.

## Trigger

Prospect asks for price, checkout link, package details, or how to buy.

## Hard Rules

- Use current offer source of truth only.
- Do not discount, bundle, extend payment terms, or promise custom scope without approval.
- Do not treat checkout started as a client start.
- Partner/referral codes must be preserved when applicable.

## Procedure

1. Confirm desired offer lane.
2. Check current price and included scope.
3. Confirm whether referral/partner code applies.
4. Send the correct checkout link with a short explanation.
5. Log link sent, plan, price, and source.
6. If checkout completes, trigger SOP 003.
7. If checkout is abandoned, trigger abandoned checkout SOPs.

## Required Proof

- Price/source checked
- Checkout link sent
- Partner/referral code if any
- Prospect status

## Failure Or Blocker Handling

- Wrong link sent: correct immediately and log.
- Prospect asks for exception: Sales Manager/Mike approval depending on money/scope.
- Stripe issue: Systems Director investigates before another link is pushed.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Added pricing, checkout, referral, and exception controls | Coach |

## Source Documents

- `docs/GMF_OFFER_LADDER_DRAFT.md`
- `docs/GMF_PARTNER_PROGRAM.md`

