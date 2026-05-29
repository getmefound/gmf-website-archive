# NeverBounce And Postal Footer Proof

Date: 2026-05-29
Owner: Systems Director
Reviewer: Auditor
Mode: read-only / no live sends

## Summary

Mike approved using the existing NeverBounce verifier for the 6/1 GMF prospecting MVP.

The prior physical mailing address was found in repo history/docs and can be used in the cold-email footer unless Mike later replaces it:

```text
13727 SW 152nd St. #1236
Miami, FL 33177
```

## NeverBounce Check

Safe read-only account-info check:

- `NEVERBOUNCE_API_KEY` exists in local `.env.local`.
- NeverBounce account-info endpoint returned HTTP 200.
- API status returned `success`.
- Subscription type returned `pay_as_you_go`.
- Paid credits are available.
- No prospect emails were verified during this access check.
- No live emails were sent.

## Address Source

Address was found in:

- `docs/AOH_SESSION_HANDOFF_2026-05-17.md`

Original field:

- `{{custom_values.aoh_physical_mailing_address}}`

Original value:

- `13727 SW 152nd St. #1236, Miami, FL 33177`

## Launch Use

For the 6/1 GMF MVP:

- Use NeverBounce for email verification.
- Drop invalid, unknown, catch-all, disposable, or risky emails unless Auditor approves a narrow exception.
- Include the Miami footer address in all commercial cold emails.
- Keep Smartlead paused until the final launch packet and Mike approval are complete.
