# Reach Warmup Autopilot Summary

Date: 2026-05-20
Requested action: auto

| Lane | Status | Warmup day | Quota | Selected | Report |
|---|---|---:|---|---:|---|
| AI Visibility | executed | 1 | 10-20 | 17 | reach-warmup-ai-2026-05-20.md |

## Guardrail Meaning

- The runner keeps refilling bad or risky emails until it reaches the daily quota or hits max attempts/scrape caps.
- It will not loop forever.
- It will not reuse contacts already imported or started in prior GHL result files.
- It will not start drip unless the lane is marked ready_for_drip=yes.
- HighLevel AI features must stay OFF.
