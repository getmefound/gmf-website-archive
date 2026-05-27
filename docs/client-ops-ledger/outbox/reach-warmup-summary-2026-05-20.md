# Reach Warmup Autopilot Summary

Date: 2026-05-20
Requested action: auto

| Lane | Status | Warmup day | Quota | Selected | Report |
|---|---|---:|---|---:|---|
| Reviews | blocked | 1 | 10-20 | 1 | reach-warmup-reviews-2026-05-20.md |
| AI Visibility | held | 1 | 10-20 | 0 | reach-warmup-ai-2026-05-20.md |

## Guardrail Meaning

- The runner keeps refilling bad or risky emails until it reaches the daily quota or hits max attempts/scrape caps.
- It will not loop forever.
- It will not call Outscraper when balance protection is on unless spend is explicitly approved.
- It will not exceed the run-level Outscraper scrape cap across all lanes.
- It will not reuse contacts already imported or started in prior GHL result files.
- In start mode, it reuses prior imported contacts instead of scraping new contacts.
- It will not start drip unless the lane is marked ready_for_drip=yes.
- HighLevel AI features must stay OFF.
