# Slack Key Rotation Smoke Check

Date: 2026-05-28T15:43:58.304Z
Owner: Systems Director
Mode: read-only; no token, signing secret, headers, or secret fingerprints printed

## Owner Summary

Pass: Slack bot token is active, channel read works, and the production listener is healthy for this runtime.

## Env Sources Loaded

- .env.prod
- .env.vercel
- .env.vercel.local
- .env.local

## Required Key Names

| Env var | Present |
|---|---:|
| SLACK_BOT_TOKEN | yes |
| SLACK_SIGNING_SECRET | yes |

## Slack Bot Token

| Check | Result |
|---|---|
| `auth.test` status | 200 |
| Token active | yes |
| Team ID visible | yes |
| Bot/user ID visible | yes |
| Error |  |

## Slack Channel Read

| Check | Result |
|---|---|
| Channel ID | `C0ATTA4NBR8` |
| `conversations.history` status | 200 |
| Read active | yes |
| Messages visible in sample | 1 |
| Error |  |

## Production Listener

| Check | Result |
|---|---|
| Listener URL | `https://getmefound.ai/api/agent/slack` |
| GET status | 200 |
| GET active | yes |
| Signed POST status | 200 |
| Signed POST active | yes |
| Error |  |

## Safety Notes

- No Slack messages were posted.
- No Slack token or signing secret values were printed.
- The signed POST uses Slack's URL-verification shape and only expects the challenge text back.
