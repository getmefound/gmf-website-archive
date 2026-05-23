# GetMeFound Stack Status

Last updated: 2026-05-23

## Live

- Google Workspace is active for `getmefound.ai`.
- GitHub source of truth is `mje-gmf/website`.
- Vercel project is `aoh-inc/getmefound`.
- Production site is live at `https://getmefound.ai`.
- OpenAI, Supabase, and Resend environment variables are saved locally and in Vercel.

## Current Runtime Flow

- `/api/contact` no longer forwards to GHL.
- Contact form submissions are written to Supabase `contact_submissions`.
- Each submission creates an `agent_tasks` row for follow-up.
- Resend sends an internal notification to `mike@getmefound.ai` after `send.getmefound.ai` is verified.
- Health checks are available at:
  - `/api/health/ops`
  - `/api/health/supabase`
  - `/api/health/resend`

## Manual Step Still Needed

Run `supabase/schema.sql` in the Supabase SQL editor for the GetMeFound project.

Until that schema is applied, the site can build and deploy, but Supabase writes from `/api/contact` will be skipped by the app and logged as missing-table errors.

## Resend Status

`send.getmefound.ai` DNS records have been added. Resend may take time to move from pending to verified. When it verifies, contact notifications will start sending without another code change.

## GHL Rule

Do not enable any HighLevel AI features without Mike's explicit manual approval.
