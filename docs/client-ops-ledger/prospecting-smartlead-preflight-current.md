# Prospecting Smartlead Preflight

Date: 2026-05-27
Mode: read-only

## Summary

NOT READY for Smartlead live prospect sends.
Human needed: yes

## Checks

| Check | Status | Detail |
|---|---|---|
| Smartlead API access | FAIL | /email-accounts/: 401 {"message":"Invalid API Key"} |
| Warmup snapshot | WARN | Warmup snapshot is from 2026-05-24, not 2026-05-27. |

## Mailboxes

| Email | Status | Warmup Sent | Spam | Reputation | Blockers |
|---|---|---:|---:|---:|---|
| mike@getmefoundnow.com | hold | 9 | 0 | 100 | needs at least 10 warmup sent |
| mike@trygetmefound.com | hold | 9 | 0 | 100 | needs at least 10 warmup sent |
| mike@getmefoundlocal.com | hold | 9 | 0 | 100 | needs at least 10 warmup sent |

## Manager Contact Rule

Manager should contact Mike only if human involvement is required. This preflight allows contact when API access is missing or rejected, because agents cannot clear that safely themselves.

## Next Action

Refresh Smartlead API access, store the key locally and in production, then re-run this preflight.