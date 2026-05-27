# GetMeFound Stack Status

Last updated: 2026-05-24

## Live

- Google Workspace is active for `getmefound.ai`.
- GitHub source of truth is `mje-gmf/website`.
- Vercel project is `aoh-inc/getmefound`.
- Production site is live at `https://getmefound.ai`.
- OpenAI, Supabase, and Resend environment variables are saved locally and in Vercel.
- Vercel Production no longer lists GHL API/webhook env keys. Local old GHL credentials still exist and should be archived or removed after exports are complete.
- Public report and presence-refresh booking links now route to `/contact` instead of the old GHL calendar. Use this as the free fallback until a Google Calendar appointment page is created.
- Supabase schema and RLS policies are applied and verified.
- Resend domain `send.getmefound.ai` is verified.
- Review Automation storage is live on Supabase.
- Review request email sending is configured through Resend with a dedicated review sender.
- Protected Review Automation endpoints currently accept `GMF_INTERNAL_API_TOKEN` first and keep `AOH_INTERNAL_API_TOKEN` as a backward-compatible fallback.
- Outreach sender domains, Namecheap Private Email DNS, and Smartlead warmup accounts are configured.

## Current Runtime Flow

- `/api/contact` no longer forwards to GHL.
- Contact form submissions are written to Supabase `contact_submissions`.
- Each submission creates an `agent_tasks` row for follow-up.
- Resend sends internal notifications to `mike@getmefound.ai`.
- Review Automation can build review request batches and send through Resend after internal-token approval.
- Health checks are available at:
  - `/api/health/ops`
  - `/api/health/supabase`
  - `/api/health/resend`
  - `/api/review-automation/storage-health`
  - `/api/review-automation/email-health`

## Verification

- `/api/health/ops` returns `ok: true`.
- `/api/health/supabase` returns `ok: true`.
- `/api/health/resend` returns `ok: true`.
- `/api/review-automation/storage-health` returns `ok: true`.
- `/api/review-automation/email-health` returns `ok: true`.
- Protected Review Automation status, monthly recap, send-candidates, and send-batch dry-run endpoints accept the internal token.
- A client-zero live Review Automation test sent 1 review request to `mike@getmefound.ai` through Resend and logged the send in Supabase.
- A client-zero private feedback smoke test stored a 5-star response and returned the correct Google review URL.
- `/client/ai-outsource-hub` now reads live Supabase Review Automation activity instead of only static placeholder counts.
- A protected monthly recap send endpoint is live at `/api/review-automation/monthly-recap/send`.
- A client-zero recap email was sent to `mike@getmefound.ai` through Resend.
- Protected follow-up discovery and follow-up send dry-run endpoints are live at `/api/review-automation/followups/due` and `/api/review-automation/followups/send`.
- Follow-up dry run currently returns 0 due customers, which is correct because the first test review request was sent today.
- Client hubs now try Supabase `client_profiles` first and fall back to the static profiles in code if the table is not available.
- `supabase/schema.sql` and `supabase/client-profiles.sql` include the new `client_profiles` and `client_integrations` tables.
- `npm run clients:seed` seeded 2 client profiles and 2 default manual-upload client integrations into Supabase.
- Internal client profile editor is deployed at `/mike-mc/clients`; it uses a token login with an HTTP-only hashed-cookie session, reads Supabase client profiles, and can update client setup, review link, and POS/CRM connection fields.
- Local and production editor verification passed: no session shows only the access gate; valid session renders GetMeFound, ABC Business, POS/CRM fields, and save controls.
- Internal Review Automation proof page is deployed at `/mike-mc/review-proof/[slug]`; it uses the same internal session, shows queued recipients and email previews, and requires `SEND_REVIEW_REQUESTS` before sending an approved batch.
- Local and production proof-page verification passed: no session hides proof data; valid session renders GetMeFound proof controls; shared send-batch dry-run still returns `ok: true`.
- Customer upload now supports both CSV rows and tab-pasted spreadsheet rows.
- Customer upload page includes a CSV template download at `/api/review-automation/customer-template?client=[slug]` and links to the internal proof page after a successful upload.
- Customer upload has a non-saving `Check list` dry-run path before `Submit customer list`.
- Production dry-run verification passed: a two-row spreadsheet paste stayed two rows, one duplicate was held back, and no row was stored.
- Internal client editor now includes a Review Reply Voice section for reply mode, tone, favorite phrases, avoid phrases, and escalation notes.
- Protected review reply draft endpoint is deployed at `/api/review-automation/reply-draft`.
- Production dry-run verification passed for reply drafting: it loaded the GetMeFound client profile, used `Draft only` mode, included the live review text in the prompt, and made no OpenAI spend.
- Internal review reply workspace is deployed at `/mike-mc/review-replies/[slug]`.
- Review reply workspace is token-gated, lets Mike generate draft-only replies, and records approve/reject/mark-posted decisions as append-only audit events.
- Client hubs now show an Add-ons and approvals strip for Review replies, SMS requests, and POS auto-sync so locked/next-step value is visible without a GHL login.
- Review reply drafts now include safety scoring with risk flags and safe-auto-post eligibility checks. Production dry-run verified: low-risk 5-star review stayed non-auto-post because the client mode is still `Draft only`.
- Protected reply digest endpoint is live at `/api/review-automation/reply-digest`.
- Protected POS/CRM event intake scaffold is live at `/api/review-automation/integration-event`; production dry-run verified with a Square-style paid-invoice event.
- POS/CRM intake now builds an idempotency key from client, source system, and external event ID; duplicate live webhook/import retries are skipped instead of creating duplicate send candidates.
- `/api/review-automation/integration-event?client=[slug]` now returns protected POS/CRM intake health counts for received, held, duplicate, and send-eligible events.
- `/mike-mc/ghl-exit-ops` now shows POS/CRM health counts so held events and duplicate retries are visible before any auto-send workflow is built.
- Production POS/CRM dedupe smoke passed: first event stored as received/eligible, exact retry returned duplicate/skipped, and the protected health endpoint returned `ok: true`.
- Review send candidates now include clean POS/CRM integration events only after the client's configured send-delay window passes; suppressed, already-sent, held, duplicate, and not-yet-eligible events stay out of the proof queue.
- Production send-candidate smoke passed: the newly received POS smoke event did not enter the candidate queue immediately because the configured delay gate had not passed.
- `/api/review-automation/integration-health` now returns a protected all-client POS/CRM health rollup for stale active auto-syncs, held events, and storage errors.
- Production integration-health smoke passed with 2 Supabase client profiles and 0 clients needing attention.
- `/mike-mc/ghl-exit-ops` now surfaces the all-client POS/CRM sync health rollup, including active sync count, attention count, stale threshold, and latest event dates.
- Production authenticated render verification passed for the new POS/CRM sync health panel on `/mike-mc/ghl-exit-ops`.
- GHL Exit Ops POS/SMS forms now derive the client name server-side from Supabase, so switching clients cannot save events under the wrong business name.
- `/api/review-automation/integration-health/send` now provides a protected POS/CRM sync health email digest. It is dry-run by default and requires `commit=true` plus `confirm=SEND_POS_HEALTH_DIGEST` before sending.
- Production POS/CRM health digest dry-run passed: 2 client profiles, 0 needing attention, no email sent.
- `npm run review:integration-health-smoke` now repeats the POS/CRM health digest dry-run from the terminal; add `-- --commit` only after proof approval.
- `/api/review-automation/integration-health/cron` is live as a Vercel Cron target for daily POS/CRM sync health checks. It requires `CRON_SECRET` and emails only when a client sync needs attention.
- `CRON_SECRET` is now configured locally and in Vercel Production.
- Production cron verification passed: unauthenticated requests are blocked; authorized check returned 2 clients, 0 needing attention, and sent no email because all clear.
- Client hubs now show a data connection section with current POS/CRM source, connection level, send delay, received/held event counts, latest event date, and an upgrade path for auto-sync.
- Production client hub verification passed for `/client/ai-outsource-hub`: Data connection, current source, POS/CRM auto-sync, and upload controls render.
- Client hub data connection metrics now include a `Clean` count for POS/CRM events that passed duplicate and missing-email checks.
- Client hub SMS add-on status now reads live SMS readiness events and shows either `Ready` or the current checklist count such as `0/5 ready`.
- Production verification passed: `/api/review-automation/sms-readiness?client=ai-outsource-hub` returns the 5-item checklist and `/client/ai-outsource-hub` renders the dynamic SMS readiness card.
- Client hub Review Replies card now reads live reply digest counts and shows pending draft count when reply decisions are waiting.
- Production verification passed: `/api/review-automation/reply-digest?client=ai-outsource-hub&days=30` returns digest counts and `/client/ai-outsource-hub` renders the dynamic Review Replies card.
- Protected SMS readiness scaffold is live at `/api/review-automation/sms-readiness`; production dry-run verified and live sending remains blocked until A2P, opt-in, STOP handling, and sample message approval are all complete.
- Protected report-flow ops status scaffold is live at `/api/report/ops-status`; production dry-run verified and does not trigger GHL workflows.
- Report-flow status now uses a shared helper for counts, latest report, deliverable-link tracking, and owner summary.
- `/mike-mc/ghl-exit-ops` now shows report-flow planned/submitted/ready/blocked counts and an owner-readable report summary.
- `npm run report:ops-smoke` now verifies `/api/report/ops-status` with a protected dry-run and readback against production.
- Production report-flow smoke passed on 2026-05-24: dry-run packet accepted, stored report count read successfully, and no live report record was created.
- Internal Report Flow delivery view is live at `/mike-mc/report-flow`; it shows owner summary, deliverable links, blockers, and recent report activity without needing GHL.
- Production Report Flow page verification passed: no-token access shows only the gate; bearer-token access renders owner summary and report activity.
- New `/api/report` submissions now record `report_flow_status` events in Supabase, so report requests have a GMF-owned audit trail. The code still contains the legacy GHL handoff path, but Production currently has no GHL env keys listed.
- Production report ops smoke passed again on 2026-05-24; the check used protected dry-run status only and did not trigger a live report request.
- Client setup jobs are now event-sourced through Supabase `review_automation_events` as `client_setup_update` records.
- Internal setup job room is live at `/mike-mc/setup-jobs`; it tracks Manager, Profile Manager, Reviews Manager, Systems Director, Auditor, and launch-gate checks.
- `npm run clients:setup-seed` created the GetMeFound client-zero setup job and profile.
- Production Setup Jobs verification passed: no-token access shows only the gate; bearer-token access renders GetMeFound, GBP access, and Systems safety checks.
- Internal workflow library is built at `/mike-mc/workflows`; it lists business-family workflow names, one-sentence purpose, counters, status, weekly check owner, audit owner, stall protocol, Mike/client-email approval rule, and Coach training notes.
- Workflow detail pages show each agent handoff from start to final outcome, including proof owed and what happens if the workflow stalls.
- Rebrand pass is deployed to production: current website copy, Mission Control labels, workflow names, review automation source strings, and active agent training docs now use GetMeFound / GMF.
- Production rebrand verification passed on 2026-05-24 for `/mike-mc/workflows`, `/mike-mc/ops`, `/lp/reviews`, `/lp/presence-refresh`, and `/client/ai-outsource-hub`.
- Supabase client-zero profile row `ai-outsource-hub` was updated to display GetMeFound while keeping the legacy slug for route/data compatibility.
- Rebrand audit is documented in `docs/GMF_REBRAND_AUDIT.md`; remaining old-name references are compatibility fallbacks, live GHL/send-domain bridges, historical logs, old doc filenames, Obsidian paths, or legacy logo asset filenames.
- VPS access is confirmed through the existing `atlantis` SSH alias. No OpenClaw runtime settings were changed during the rebrand pass; the current GMF status and rebrand audit were copied to `/root/aoh-docs/getmefound/`.
- Internal GHL Exit Ops page is deployed at `/mike-mc/ghl-exit-ops` and linked from `/mike-mc` and `/mike-mc/clients`.
- Production no-token verification passed for `/mike-mc/ghl-exit-ops`: it shows only the access gate and hides POS/SMS/report forms.
- Internal token-gated pages now support Bearer-token verification for CLI smoke tests while keeping browser cookie sessions.
- Production authenticated render verification passed for `/mike-mc/ghl-exit-ops`, `/mike-mc/clients`, `/mike-mc/review-proof/ai-outsource-hub`, and `/mike-mc/review-replies/ai-outsource-hub`.
- A production `/api/contact` smoke test saved the contact, created the follow-up task, logged the email event, and sent the internal Resend notification. Smoke-test database rows were removed afterward.
- Smartlead has three connected outreach inboxes warming and one drafted campaign shell. No live prospect sends are active.
- 2026-05-24 Smartlead readiness is still `NOT READY`: each inbox has 9 warmup sent, 0 spam, and 100 reputation; target is at least 10 with 0 spam before any live prospect sends.

## Next Queue

1. Export GHL data before cancellation: contacts, conversations, appointments, workflows, forms, funnels/pages, templates, pipelines, custom fields, media, and reports.
2. Keep public report requests as a GMF-owned manual/internal workflow or hide the report flow until fully automated reporting is off GHL.
3. Let Smartlead warm the three outreach inboxes and review `npm run smartlead:warmup-report` before adding live leads.
4. Build and QA a tiny 15-30 lead first test list before activating any campaign. Use `docs/GETMEFOUND_FIRST_SMARTLEAD_CAMPAIGN.md`.
5. Prepare the first real client/pilot customer batch using the customer template, then review `/mike-mc/review-proof/[slug]` before any live send.
6. Use `npm run review:recap-smoke` to preview or send a one-recipient monthly recap.
7. Re-check follow-up due candidates after the configured wait window before sending follow-ups.
8. Replace `/contact` with a Google Calendar appointment page when the free calendar link is ready.
9. Keep each workflow checked weekly by its named owner.
10. Keep GHL AI features off unless Mike explicitly authorizes them manually.

## GHL Rule

Do not enable any HighLevel AI features without Mike's explicit manual approval.
