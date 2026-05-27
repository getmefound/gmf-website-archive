# GHL Exit Migration Plan

Status: urgent GHL exit sprint; $97 bridge active; campaign sending paused
Owner: Manager
Specialists: Systems Director, GHL Expert, Website/Codex, Sender, Auditor
Last updated: 2026-05-24

## Plain-English Decision

AOH should move off GHL as fast as possible because even the $97 bridge is now a
cash-flow problem.

GHL is now a short bridge, but campaign sending is paused during the
NearMeReady rebrand and domain migration:

1. Downgrade to the $97 plan. Done by Mike on 2026-05-21.
2. Do not build new AOH services around GHL.
3. Do not warm or send from old GHL campaign domains.
4. Export and document current GHL assets.
5. Rebuild Review Automation, AI Visibility, Reach, and reports outside GHL.
6. Cancel GHL as soon as the minimum replacement gates below pass, even if old
   GHL history is only archived as metadata.

## Fast-Cancel Path

Current fastest path to canceling GHL:

1. Keep all old GHL Reach lanes paused.
2. Use Smartlead/GetMeFound for new outbound instead of GHL.
3. Use the GetMeFound contact form, Supabase, and Resend for new inbound.
4. Move Review Automation storage to existing Supabase instead of buying Upstash.
5. Use Google Calendar/direct email as the temporary booking path if GHL is canceled before a full booking replacement exists.
6. Archive GHL metadata and stats; do not try to perfectly rebuild all 167 workflows before canceling.

2026-05-23 update:

- Review Automation code now prefers Supabase storage and keeps Upstash only as a fallback.
- `supabase/schema.sql` and `supabase/policies.sql` include the Review Automation tables and service-role policies.
- The Supabase schema was applied and verified.
- `npm run review:storage-check` passes.
- `https://getmefound.ai/api/review-automation/storage-health` returns `ok: true`.
- `https://getmefound.ai/api/review-automation/email-health` returns `ok: true`.
- Review request email sender env is configured locally and in Vercel Production/Development.
- `POST /api/review-automation/send-batch` now blocks live sends if review email sender config is missing.
- Failed provider attempts are no longer treated as terminal sends, so temporary sender failures do not remove customers from future candidate batches.
- A client-zero live send test sent 1 review request to `mike@getmefound.ai` through Resend and logged the send in Supabase.
- A client-zero private feedback test stored a 5-star response and returned the correct Google review URL.
- `/client/ai-outsource-hub` now reads live Supabase Review Automation activity for send and feedback counts.
- `npm run review:send-smoke` exists for repeatable dry-run or one-message live send testing.
- `/api/review-automation/monthly-recap/send` can dry-run or send a protected monthly recap email.
- A client-zero monthly recap email was sent to `mike@getmefound.ai` through Resend.
- `npm run review:recap-smoke` exists for repeatable monthly recap previews or one-recipient live send tests.
- `/api/review-automation/followups/due` returns due follow-up candidates.
- `/api/review-automation/followups/send` can dry-run or send protected follow-up review request emails.
- Follow-up dry run is verified; current client-zero count is 0 due because the first request was sent today.
- Client hub pages now try Supabase `client_profiles` first and fall back to static profiles if the table is missing.
- `supabase/client-profiles.sql` contains the focused client profile/integration table setup.
- `npm run clients:seed` seeded 2 Supabase client profiles and 2 default manual-upload client integration records.
- `/mike-mc/clients` now exists in production as the internal client profile editor. It uses token login with an HTTP-only hashed-cookie session and edits Supabase-backed business info, review link, client status, weekly review goal, and the first POS/CRM/manual-upload integration record.
- Local and production verification passed for `/mike-mc/clients`: no session hides client data; valid session renders AOH, ABC Business, POS/CRM fields, and save controls.
- `/mike-mc/review-proof/[slug]` now exists in production as the internal Review Automation proof page. It uses the same internal hashed-cookie session, shows queued recipients and email previews, and requires `SEND_REVIEW_REQUESTS` before sending an approved batch.
- The send-batch API and proof page now share the same batch helper so dry-runs and UI proof previews stay aligned.
- Local and production verification passed for the proof page and shared send-batch dry-run.
- Customer upload now accepts CSV rows and spreadsheet tab-paste, includes a CSV template download, and links to the internal proof page after a successful upload.
- Customer upload now has a non-saving dry-run check before submit. Production verification passed with two tab-pasted rows and duplicate detection.
- `/mike-mc/clients` now includes Review Reply Voice fields for reply mode, tone, favorite phrases, avoid phrases, and escalation notes.
- `/api/review-automation/reply-draft` now exists in production as a protected draft-only review reply endpoint.
- Reply-draft production dry-run verification passed. It loaded the AI Outsource Hub profile, used `Draft only` mode, included the review text in the prompt, and did not call OpenAI.
- `/mike-mc/review-replies/[slug]` now exists in production as the internal review reply workspace.
- The reply workspace is token-gated, can generate draft-only replies, and records approve/reject/mark-posted decisions as append-only `review_reply_draft` events.
- Client hubs now include an Add-ons and approvals section for Review replies, SMS requests, and POS auto-sync.
- Review reply drafts now include safety scoring, risk flags, and safe-auto-post eligibility. Production dry-run verified that a low-risk 5-star review is still not auto-post eligible while the client remains in `Draft only` mode.
- `/api/review-automation/reply-digest` is live as a protected weekly digest source for drafted, approved, rejected, posted, high-risk, and safe-eligible reply counts.
- `/api/review-automation/integration-event` is live as a protected POS/CRM event intake scaffold. Production dry-run verified with a Square-style invoice-paid event and no storage write.
- POS/CRM intake now creates an idempotency key from client, system, and external event ID. Live duplicate retries are skipped, held events include reasons, and only clean live events are marked send-candidate eligible.
- The same duplicate/eligibility logic is used by the protected API and `/mike-mc/ghl-exit-ops` manual POS event form.
- `GET /api/review-automation/integration-event?client=[slug]` returns protected intake health counts for received, held, duplicate, missing-email, and send-eligible events.
- `/mike-mc/ghl-exit-ops` shows POS/CRM health counts so duplicate retries and held events are visible before POS events are allowed to drive review sends.
- Production POS/CRM dedupe smoke passed: first event stored as received/eligible, exact retry returned duplicate/skipped, and the protected health endpoint returned `ok: true`.
- Review send candidates now include clean POS/CRM integration events only after the client's configured send-delay window passes. Suppressed, already-sent, held, duplicate, and not-yet-eligible events stay out of the proof queue.
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
- `CRON_SECRET` is configured locally and in Vercel Production.
- Production cron verification passed: unauthenticated requests are blocked; authorized check returned 2 clients, 0 needing attention, and sent no email because all clear.
- Client hubs now show a data connection section with current POS/CRM source, connection level, send delay, received/held event counts, latest event date, and an upgrade path for auto-sync.
- Production client hub verification passed for `/client/ai-outsource-hub`: Data connection, current source, POS/CRM auto-sync, and upload controls render.
- Client hub data connection metrics now include a `Clean` count for POS/CRM events that passed duplicate and missing-email checks.
- `/api/review-automation/sms-readiness` is live as a protected SMS compliance scaffold. Production dry-run verified; live SMS remains blocked unless A2P brand, campaign, opt-in, STOP handling, and sample message are all approved/ready.
- `/api/report/ops-status` is live as a protected report-flow replacement scaffold. Production dry-run verified and does not trigger GHL workflows.
- Report-flow status now uses a shared helper for counts, latest report, deliverable-link tracking, and owner summary.
- `/mike-mc/ghl-exit-ops` now shows report-flow planned/submitted/ready/blocked counts and an owner-readable report summary.
- `npm run report:ops-smoke` verifies `/api/report/ops-status` with a protected dry-run and readback against production.
- `/mike-mc/report-flow` is live as the internal report delivery view for owner summary, deliverable links, blockers, and recent report activity.
- Production Report Flow page verification passed: no-token access shows only the gate; bearer-token access renders owner summary and report activity.
- New `/api/report` submissions now record `report_flow_status` events in Supabase, so report requests have a GMF-owned audit trail even while the legacy GHL handoff remains as a bridge.
- Production report ops smoke passed again after the persistence change; no live report request was fired because `/api/report` still bridges to GHL contact/report handoff.
- Client setup jobs are now event-sourced through Supabase `review_automation_events` as `client_setup_update` records.
- `/mike-mc/setup-jobs` is live as the repeatable setup job room for Manager review, GBP access, GBP verification, profile optimization, review link capture, review automation, Systems safety, Auditor gate, and launch-ready status.
- `npm run clients:setup-seed` created the GetMeFound client-zero setup job and profile.
- Production Setup Jobs verification passed: no-token access shows only the gate; bearer-token access renders GetMeFound, GBP access, and Systems safety checks.
- `/mike-mc/workflows` is built as the GMF workflow library. It gives every replacement workflow a uniform name, one-sentence purpose, status, counters, weekly check owner, audit owner, agent handoff path, stall protocol, Mike escalation rule, client email approval rule, and Coach training note.
- Workflow detail pages show the agent-by-agent boxes from start to final outcome so Manager can see who owns the next action and Auditor can identify the exact stalled step.
- `/mike-mc/ghl-exit-ops` is live as the internal UI for POS/CRM event proof, SMS readiness tracking, and report-flow status.
- `/mike-mc/ghl-exit-ops` is linked from the Hub and client editor. Production no-token verification passed: the page shows only the access gate and hides operational forms.
- Internal token-gated pages now accept Bearer-token checks for CLI smoke testing while keeping browser cookie sessions for normal use.
- Production authenticated render verification passed for the client editor, proof page, reply page, and GHL Exit Ops page.

Emergency stop completed on 2026-05-22:

- Reach warmup autopilot disabled.
- Reviews, AI Visibility, and Relay marked paused with `ready_for_import=no`
  and `ready_for_drip=no`.
- 40 contacts removed from Reach workflows/campaigns and AOH campaign tags by
  API.
- GHL workflow definitions still need a visual Draft/Off check in the GHL UI
  because the public workflow status-change API was not authorized.

## Why Not Cancel Immediately

GHL is still being used for:

- active Reach cold email campaigns
- campaign drip workflow starts
- contact import/tagging
- campaign reply routing
- email campaign stats
- website report handoff pieces
- workflow proof while the replacement is being built

Canceling before these are replaced risks losing campaign history, workflow
settings, contacts, and proof.

## Downgrade Status

Current plan:

- $97 Starter plan is active as of 2026-05-21.
- GHL is bridge-only.
- Next job is not another plan decision. Next job is post-downgrade smoke testing.

Post-downgrade smoke checks:

- contacts stay intact
- workflows stay intact
- calendars stay intact
- email stats/history remain visible
- custom fields/values stay intact
- pipelines stay intact
- API keys/access still work enough for export and transition
- existing automations do not stop because of a plan gate
- Reach drips and warmup can still be inspected
- Review email bridge can still send low-volume messages if needed

Repeatable smoke command:

```bash
npm run ghl:smoke-97
```

This runs read-only inventory, Reach readiness, and GHL email stats checks, then
writes one owner report to `docs/client-ops-ledger/outbox/`.

## GHL $97 Bridge Rules

Now that downgrade is done:

- no new client subaccounts
- no GHL SaaS Mode work
- no GHL AI Employee
- no Search Atlas/SEO/heatmap add-ons
- no Premium Prospecting add-on
- no new paid GHL feature unless Mike manually approves
- no client-facing promise that depends on a GHL-only feature
- no separate Calendly, Smartlead/Instantly, or review email sender until GHL
  becomes the bottleneck

GHL is allowed only for:

- keeping current Reach workflows alive while migration is underway
- keeping current booking/calendar links alive if the $97 plan supports them
- sending Review Automation and Reach emails at low volume while replacement is
  being tested
- exporting settings/history
- training GHL Expert on how to translate automations into AOH-owned systems

## Calendar Decision

Do not buy Calendly yet if GHL $97 keeps booking working.

Short-term:

- use the existing GHL booking/calendar links if they survive the downgrade
- keep Google Calendar as the real calendar source wherever possible
- archive the old GHL calendar setup for proof

Buy Calendly only when one of these becomes true:

- GHL $97 removes or breaks booking
- AOH needs cleaner website embeds
- AOH needs routing or round-robin booking
- GHL calendar management becomes slower than the $10-$16/mo Calendly cost

Calendly is the fallback, not the immediate purchase.

## Tool Spend Decision

Do not add replacement tools just to replace GHL.

While GHL $97 works, defer:

- Calendly
- Smartlead or Instantly
- a separate review-request email sender

Use GHL short term for:

- booking links
- current Reach drips
- low-volume Review Automation email sends
- current GHL email stats while campaigns are still there

Approximate cost avoided by waiting:

| Deferred tool | Approx monthly cost avoided |
| --- | ---: |
| Calendly | $10-$12 |
| Smartlead | $39+ |
| Instantly alternative | $47+ |
| Separate review email sender | $0-$20 early |

Bridge decision:

- If GHL $97 works, it is the cheaper and simpler short-term answer.
- If GHL blocks reporting, deliverability, booking, or client scaling, replace
  that one piece only.

## Replacement Workstreams

| Workstream | Replacement target | Exit gate |
| --- | --- | --- |
| Review Automation | AOH client page, Redis/database storage, internal status API, optional GHL/email sender bridge, private feedback page, monthly recap | AOH can run review requests for AOH and 1 pilot client with GHL bridge or without GHL. |
| Client Hub Packaging | GMF client page with base actions, upgrade previews, locked modules, and clear "what we need from you" prompts | A client can understand status, upload customers, see results, and discover upgrades without logging into GHL. |
| POS/CRM Integration Path | Manual upload first, then exports/webhooks/Zapier/direct APIs only where the client plan supports it | GMF can accept customer/job data from a simple upload now, store the first integration plan in Supabase, and has a documented path for connected systems later. |
| SMS Review Requests | Twilio direct, A2P/10DLC registration, opt-in/STOP handling, Supabase send logs | Not part of the base plan; available only as a paid add-on after compliance setup is approved. |
| AI Review Reply Automation | Client voice profile, AI draft replies, approval queue, safe auto-reply rules, Google Business Profile posting path | AOH/GMF can draft review replies in a client's voice, require approval first, then auto-post only safe 5-star replies after trust is earned. |
| AI Visibility | AOH client page, GBP checklist, AI scans, heatmap vendor/API, AI reply drafts, monthly report | AOH can produce one AI Visibility report without GHL/Search Atlas. |
| Reach cold email | Keep GHL drips short term; later Smartlead/Instantly only if GHL becomes the blocker | New campaign can send, stop on reply, track stats, and report without forcing $297/$497. |
| Report routing | AOH database/API tracks report requests and ready state | Website report request no longer needs GHL workflow state. |
| Email stats | Email provider/API stats feed AOH brief | Morning brief can show campaign stats without GHL email stats. |
| Relay | Partner/reseller voice AI platform | Relay does not require GHL subaccounts or GHL phone workflows. |
| Data/archive | Export GHL contacts, workflows, fields, tags, stats, assets | Auditor can find old proof after GHL is canceled. |

## Build Order

### Step 0: AOH Review Automation Core

Owner: Website/Codex
Reviewer: Reviews Manager + Auditor

Built:

- `/client/[slug]/customers` for customer/job list upload.
- `/review/[slug]` for private feedback before Google routing.
- `/review/[slug]/unsubscribe` for customer suppression.
- `/api/review-automation/send-log` for internal send/fail/bounce/click/follow-up events.
- `/api/review-automation/followups/due` for one-follow-up candidate checks.
- `/api/review-automation/send-candidates` for first-send candidate checks.
- Redis-backed event storage through existing Upstash env vars.
- `/api/review-automation/status` for Manager/System status checks.

Rules:

- Slack only gets summaries, not full customer rows.
- Stored suppressions are applied to future customer uploads when Redis is
  configured.
- Send logs are internal-only and protected by the same internal token.
- Bounced send logs automatically hold that email back from future uploads when
  Redis is configured.
- Follow-up candidates are internal-only and protected by the same internal token.
- Send candidates are internal-only, protected by the same internal token, and
  blocked until the verified Google review link exists.
- The status endpoint requires an internal token. Use
  `AOH_INTERNAL_API_TOKEN`, or the existing report bypass token as the bridge
  token while infrastructure is being consolidated.
- Happy customers route to Google only after the verified client review link is saved.
- Base Review Automation uses email review requests, not automated SMS.
- SMS review requests require A2P/10DLC registration, opt-in language, STOP handling, and explicit paid add-on approval.
- GHL remains the sender bridge until AOH has a tested send job.

Current deployment note:

- `REPORT_TEST_BYPASS_TOKEN` exists in Vercel Production and can protect the
  internal status endpoint during the bridge phase.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` were not listed in
  Vercel Production on 2026-05-21, so persistent review event history still
  needs those env vars or a replacement database before live storage is complete.

### Step 1: GHL Inventory And Export

Owner: GHL Expert
Reviewer: Auditor

Repeatable command:

```bash
npm run ghl:exit-inventory
```

This creates a dated, read-only metadata inventory in
`docs/client-ops-ledger/outbox/`. It does not export contacts, customer records,
message bodies, token values, passwords, or HighLevel AI settings.

Current 2026-05-21 inventory snapshot:

- 1 GHL location
- 6 pipelines
- 167 workflows
- 191 custom fields
- 91 custom values
- 10 email workflow campaigns
- 8 calendars
- 228 tags

Post-downgrade requirement:

- Re-run the read-only inventory after the $97 downgrade.
- If inventory still works, mark API metadata access as intact.
- If it fails, Systems Director opens a blocker and prioritizes replacing the
  affected GHL dependency first.
- Use `npm run ghl:smoke-97` as the combined post-downgrade check.

2026-05-22 result:

- `$97` smoke check passed.
- Location, workflows, calendars, pipelines, email campaign metadata, Reach
  readiness, and GHL email stats were still available through read-only checks.
- Reviews and AI Visibility remain drip-ready.
- Relay remains import-ready but not drip-ready until visual sender-domain/warmup
  confirmation is complete.

Review Automation storage readiness:

```bash
npm run review:storage-check
```

This is the Manager/Systems Director check for persistent customer uploads,
private feedback, suppression, bounce holds, send logs, and follow-up history.

Export or document:

- active locations/subaccounts
- contacts and tags
- workflows and triggers
- custom fields and custom values
- pipelines and stages
- email templates
- campaign stats
- active booking links and calendar settings if GHL $97 keeps them working
- report workflow names and callback paths
- wallet/add-ons/current billable features

Done means:

- there is a dated export folder or doc
- no secret values are printed in docs
- Manager knows what still depends on GHL

Contact/customer exports, if needed later, must go to a gitignored folder such
as `data/ghl-exit/YYYY-MM-DD/` and must not be committed.

### Step 2: AOH Review Automation Core

Owner: Website/Codex
Specialists: Sender, Sorter, Profile Manager, Manager

Build:

- client record
- client page
- intake/customer upload
- do-not-contact list
- Google review link field
- private feedback page
- review request email template
- send log
- one follow-up rule
- monthly recap

Done means:

- AOH can send its own review request test outside GHL
- low-rating feedback routes privately
- happy feedback reaches Google review link
- send log and client page update correctly

Current v1 foundation:

- `/client/[slug]/customers` accepts customer/job rows and applies basic
  missing-email, duplicate, and do-not-contact holds.
- Customer uploads and private feedback now save to Upstash Redis when
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
- `/api/review-automation/customers` forwards full packets only to the AOH-owned
  review automation webhook when Redis is not configured; Slack gets summary
  counts.
- `/review/[slug]` collects private feedback before Google.
- `/api/review-automation/feedback` routes 1-3 star feedback privately and only
  sends 4-5 star customers to Google when a verified review link exists.

### Step 2A: GMF Client Hub Package Design

Owner: Website/Codex
Specialists: Manager, Profile Manager, Reporter, Auditor

Base client page should show:

- setup status and blockers
- what AOH/GMF needs from the client
- customer upload/manual list entry
- do-not-contact and exclusion reminders
- Google review link status
- email review request status
- private feedback link
- recent upload/send/feedback summary
- monthly recap
- low-review coaching tips
- support/send-file contact path

Locked or upgrade-preview modules should show:

- AI review replies in the client's voice
- safe 5-star auto-reply mode after trust is earned
- SMS review requests
- POS/CRM auto-sync
- review widget for the client's website
- AI Visibility scan
- local ranking/heatmap report
- competitor review watch
- GBP post/social review repurposing
- listings/citation cleanup
- missed-call/voice AI follow-up
- multi-location reporting

Rules:

- Do not hide the base workflow behind marketing language. The client should
  immediately understand what is done, what is needed, and what results came in.
- Locked modules may be visible, but they must be labeled clearly as upgrade,
  add-on, or coming soon.
- SMS, AI auto-replies, POS auto-sync, heatmaps, listings, and voice AI should
  not be bundled into the cheapest base offer unless the client is paying for
  the setup and usage they create.

Done means:

- the client page feels like the replacement for a GHL subaccount without
  requiring the client to learn GHL
- upgrade modules are visible enough to sell the next plan
- unavailable features do not create accidental service promises

### Step 2B: GMF POS/CRM Integration Ladder

Owner: Systems Director
Specialists: Website/Codex, Sorter, Manager, Auditor

Start with this ladder:

| Level | Connection method | Use when | Offer boundary |
| --- | --- | --- | --- |
| 1 | Manual CSV/upload/paste | Every new client, low budget, first 30 days | Base |
| 2 | Scheduled export import | Client can export weekly/monthly reports from POS/CRM | Base or small add-on |
| 3 | Zapier/Make/webhook | POS/CRM already exposes a trigger for paid invoice, completed job, completed appointment, or fulfilled order | Paid setup |
| 4 | Direct API connector | Several clients use the same system or one client pays enough to justify custom work | Paid setup/custom |
| 5 | SFTP/database/vendor feed | Larger clients with IT/admin support | Custom |

Collect during onboarding:

- POS/CRM/vendor name
- review-ready event, such as job closed, invoice paid, appointment completed,
  order fulfilled, or ticket resolved
- available customer fields
- export format and export frequency
- admin contact who controls the system
- consent/opt-in notes
- whether email, phone, or both are available
- whether the vendor supports API, webhook, Zapier, Make, CSV export, or email reports

Priority systems to research first:

- Square for local POS and appointments
- Stripe for paid invoices/checkouts
- Shopify for fulfilled e-commerce orders
- Jobber and Housecall Pro for home services
- ServiceTitan for larger home-service companies
- Toast for restaurants
- Vagaro, Mindbody, and similar booking systems for salon, spa, and wellness

Rules:

- Sell "we can connect to many systems" carefully, not "we integrate with every
  POS out of the box."
- Manual upload is the default base path.
- Auto-sync is an upgrade because it requires mapping, testing, suppression,
  failure alerts, and ongoing support.
- The first direct connectors should follow actual sold clients, not a generic
  integration wishlist.

### Step 3: AOH AI Visibility Core

Owner: Profile Manager
Specialists: Scout, Reporter, Website/Codex, Auditor

Build:

- AI visibility prompt scan checklist
- GBP/profile health checklist
- heatmap vendor/API test
- AI reply draft workflow
- monthly visibility report page
- upgrade-only SMS plan using Twilio

Done means:

- one AOH AI Visibility report can be generated outside GHL
- heatmap/ranking source is not GHL/Search Atlas
- reply drafts require approval before publishing

### Step 3A: GMF AI Review Reply Automation

Owner: Website/Codex
Specialists: Profile Manager, Reviews Manager, Auditor

Build:

- client voice profile in Supabase
- review record table or extension of `review_automation_events`
- AI draft reply endpoint using the client's voice profile
- approval queue on the GMF client page
- approve, edit, reject, and mark-posted actions
- weekly digest of drafts, approvals, auto-posts, and flagged reviews
- trust levels for graduated automation
- safe auto-reply rules for low-risk 5-star reviews only
- Google Business Profile API posting path after manual approval flow proves safe

Trust levels:

| Level | Behavior |
| --- | --- |
| 1 | Draft only; Mike/client manually posts. |
| 2 | AI drafts; Mike/client approves before posting. |
| 3 | Safe 5-star reviews can auto-post; risky reviews require approval. |
| 4 | Most positive reviews auto-post; exceptions still require approval. |
| 5 | Full autopilot only with explicit manual approval from Mike and the client. |

Rules:

- Start every client at Level 1 or Level 2.
- Do not auto-post 1-4 star replies.
- Do not auto-post reviews mentioning refunds, pricing disputes, injury, legal issues, medical issues, discrimination, harassment, staff accusations, threats, safety, or sarcasm.
- Keep the product promise as "autopilot for praise, human judgment for problems."
- No GHL AI Employee, Reviews AI autopilot, or other HighLevel AI feature may be enabled without Mike's explicit manual authorization.

Done means:

- AOH can generate review replies in the client's voice without GHL.
- AOH can show the client a clean approval queue instead of requiring a GHL login.
- AOH can prove which replies were drafted, approved, rejected, posted, or held.
- Safe auto-posting is optional and gated by trust level.

Current 2026-05-23 progress:

- Client voice profile fields are live in the internal client editor.
- Protected draft endpoint is live at `/api/review-automation/reply-draft`.
- Dry-run mode is verified on production and does not spend OpenAI credits.
- Real generation stores `review_reply_draft` events only after a successful draft.
- The endpoint drafts only. It does not post to Google Business Profile.
- Internal approval workspace is live at `/mike-mc/review-replies/[slug]`.
- Approval, rejection, and posted markers are append-only audit events, not silent overwrites.
- Safety scoring is live for review replies. Risk terms, non-5-star reviews, and non-auto modes prevent auto-post eligibility.

### Step 3B: GMF SMS Review Request Add-On

Owner: Systems Director
Specialists: Website/Codex, Sender, Auditor

Build only after the base email review flow is working.

Product rule:

- SMS review requests are not included in the base Review Automation offer.
- SMS is a paid add-on because automated US business texting requires A2P/10DLC registration, opt-in language, STOP handling, send logs, and carrier compliance.
- Do not pitch SMS as a workaround to A2P. The compliant replacement is Twilio/direct texting infrastructure outside GHL.

Target stack:

- Twilio direct for SMS
- client A2P/10DLC brand/campaign registration
- approved SMS templates
- STOP/unsubscribe handling
- Supabase SMS send/event logs
- client-visible status in GMF

Suggested offer:

- setup fee: `$197-$497`
- monthly add-on: `$29-$79/mo`
- usage: pass-through or included up to a small monthly limit

Done means:

- a client can send compliant SMS review requests without GHL/LC Phone
- STOP requests suppress future messages
- send/fail events are visible in Supabase/GMF
- A2P registration status is tracked before any live SMS send

Current 2026-05-23 progress:

- Protected SMS readiness route is live at `/api/review-automation/sms-readiness`.
- Readiness is tracked as an auditable `sms_compliance_update` event.
- Dry-run verification passed.
- Live SMS send permission stays false until every compliance gate is approved/ready.

### Step 4: Reach Migration

Owner: Sender
Specialists: Scout, Sales Manager, Systems Director, Auditor

Target stack:

- Outscraper/business discovery for leads
- NeverBounce or similar for verification
- Smartlead or Instantly for drip sending
- AOH database for prospects/status
- AOH reply classifier for `send`, `book`, interested, not interested,
  unsubscribe
- AOH/Slack for Manager reporting

Done means:

- one small campaign runs outside GHL
- drip stops on reply
- unsubscribe works
- bounces are visible
- reply routing works
- Manager brief shows stats without GHL

Current 2026-05-23 progress:

- Smartlead has three connected inboxes, but live sends remain blocked by warmup gate.
- Latest readiness check: each inbox has 1 warmup sent, 0 spam, and 100 reputation; target is at least 10 warmup sent per inbox before live prospects.

### Step 5: Report Flow Migration

Owner: Website/Codex
Specialists: Reporter, Auditor

Build:

- report request table
- report status table
- generated report URL storage
- heatmap URL storage
- callback or direct update path
- client/prospect-facing report delivery

Done means:

- website report request can complete without GHL workflow state
- Reporter can open generated links
- Auditor can prove no duplicate sends

Current 2026-05-23 progress:

- Protected report ops endpoint is live at `/api/report/ops-status`.
- Report status can be tracked as `report_flow_status` events without triggering GHL workflows.
- Dry-run verification passed.

Current 2026-05-24 progress:

- Report-flow status is centralized in code so the API and internal ops page use the same counts and owner summary.
- `/mike-mc/ghl-exit-ops` shows planned, submitted, ready, and blocked report counts.
- `npm run report:ops-smoke` passed against production with a dry-run packet and no live storage write.
- `/mike-mc/report-flow` is deployed as the read-only delivery view for audit links, heatmap links, blockers, and recent activity.
- `/api/report` now logs submitted or blocked report-flow status into Supabase for GMF-owned proof.

### Step 6: Cancel GHL

Owner: Systems Director
Approver: Mike

Cancel only when:

- no live Reach campaign depends on GHL
- no client Review Automation setup depends on GHL
- no AI Visibility reporting depends on GHL/Search Atlas
- contacts/workflows/stats have been exported
- replacement stack has run successfully for at least 30 days or Mike approves
  an earlier exit
- Manager can answer "what breaks if GHL is off?" with "nothing client-facing"

## Agent Training Plan

Yes, agents should be involved.

This migration is a training opportunity because every GHL function becomes an
AOH-owned operating skill.

| Agent | Training focus | Why it matters |
| --- | --- | --- |
| Manager | Route GHL-exit work, track blockers, brief Mike simply | Manager becomes the right-hand operator instead of Mike babysitting. |
| Systems Director | Cost, vendor choices, cron jobs, failure alerts, downgrade/cancel gates | Keeps the replacement lean and reliable. |
| GHL Expert | Export GHL assets, translate workflows into AOH specs, inspect what breaks on downgrade | GHL knowledge becomes sellable automation knowledge, not dependency. |
| Website/Codex | Build AOH client pages, APIs, database, cron, logs | This is the new core platform. |
| Sender | Move drips from GHL to Smartlead/Instantly/AOH logic | Reach cannot leave GHL without Sender owning this. |
| Scout | Research vendors, costs, heatmap tools, cold email tools, voice partners | Prevents expensive tool choices. |
| Sorter | Customer/prospect list cleanup and suppression rules | Bad lists break review automation and outreach. |
| Profile Manager | GBP access, profile checks, review link, AI Visibility findings | Replaces GHL reputation dependence. |
| Reporter | Monthly reports, heatmap/visibility summaries, result pages | Makes the service feel premium without GHL dashboards. |
| Auditor | QA, proof, downgrade safety, cancellation readiness | Prevents silent breakage. |

GHL Expert should not disappear. The role changes:

- from "operate GHL forever"
- to "understand GHL well enough to export, replace, and sell automation
  services to clients who still use GHL"

## Owner View

Mike should only need to see:

- GHL plan: $97 bridge / downgrade confirmed / cancel ready
- Replacement status: Review, AI Visibility, Reach, Reports
- Current blocker
- Next safest action
- Monthly cost avoided

Manager command:

```text
Manager, GHL exit status
```

## First 7 Days

Day 1:

- downgrade to $97: done on 2026-05-21
- post-downgrade read-only inventory and smoke check
- export current GHL inventory
- freeze new GHL-dependent work
- keep intake packets flowing to AOH-owned webhooks/Slack before the temporary
  GHL bridge

Days 2-3:

- build AOH Review Automation v1 spec from the client page
- pick database/email sender path
- define first AOH test send
- keep current GHL booking links unless downgrade breaks booking

Days 4-5:

- keep current GHL Reach drips if $97 supports them
- map current GHL tags/workflows to future AOH campaign states

Days 6-7:

- choose heatmap/rank data source for AI Visibility
- create cancellation readiness checklist
- Manager briefs Mike on the first realistic GHL cancellation date
