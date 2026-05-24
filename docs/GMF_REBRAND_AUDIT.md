# GetMeFound Rebrand Audit

Last updated: 2026-05-24

This audit separates safe brand cleanup from identifiers that still need a planned migration. The goal is to remove client-facing AOH language without breaking live bridges, old logs, or external account wiring.

## Changed in the current codebase pass

- Current website copy, landing metadata, blog/social pack copy, client hub labels, Mission Control labels, workflow names, and review automation source strings now point at GetMeFound / GMF.
- Internal API auth now prefers `GMF_INTERNAL_API_TOKEN` while still accepting `AOH_INTERNAL_API_TOKEN` and `REPORT_TEST_BYPASS_TOKEN` during the transition.
- Review automation env reads now prefer `GMF_*` names for webhook, sender, reply-to, model, TTL, GBP invite, and ops alert settings while keeping old `AOH_*` fallbacks.
- GitHub smoke and automation metadata now uses GetMeFound / GMF where it is only a label or public base URL.
- The workflow library now uses business-family names such as `Launch 01: Client Setup` and `Serve 01: Review Launch` instead of `GMF-WF-*`.

## Kept on purpose for now

- `AOH_*` environment variable names remain as fallbacks until every local, Vercel, and external secret is migrated to `GMF_*`.
- Lowercase `aoh_*` GHL tags, custom fields, and old custom values remain untouched because changing them without a GHL migration can break automations.
- Old outreach sending domains such as `mail.getaioutsourcehub.com` and `mail.myaioutsourcehub.com` remain in readiness/runbook data until the Smartlead sender strategy replaces them.
- The legacy client slug `ai-outsource-hub` remains as the client-zero data key so existing Supabase records, routes, and proof pages do not lose history.
- `aoh-inc` remains where it is an external GitHub/Vercel organization or archived remote name.
- Historical logs, outbox reports, archived handoff docs, and old campaign runbooks keep original names so they remain accurate records of what happened.
- Obsidian sync paths still reference the old vault folder and note names until we do a separate Obsidian rename with backlink checks.
- Legacy logo asset filenames such as `aoh-icon-*` stay until new GMF logo assets are generated and all image references are switched.
- VPS OpenClaw runtime still uses `hubgateway.aioutsourcehub.com` and the `__aoh-token-bootstrap` wrapper route. This is a live gateway bridge and should not be renamed until DNS, Traefik, Vercel `NEXT_PUBLIC_OPENCLAW_URL`, and browser token-storage keys are migrated together.

## Copied Knowledge Locations

- Repo source: `docs/GMF_REBRAND_AUDIT.md`
- Obsidian copy: `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Rebrand Audit.md`
- VPS copy: `/root/aoh-docs/getmefound/GMF_REBRAND_AUDIT.md`

## Next migration decisions

- Add `GMF_*` values in Vercel and local `.env.local`, then remove old `AOH_*` fallbacks after a green production check.
- Decide whether to migrate the client-zero slug from `ai-outsource-hub` to `getmefound`, including Supabase records and existing route links.
- Generate GMF logo/icon assets, then replace old `aoh-*` image filenames and scripts.
- Rename current docs from `AOH_*` to `GMF_*` only after updating every code link, Obsidian link, and runbook reference.
- Plan an Obsidian vault/note rename pass for `04 AI Outsource Hub` and the AOH training notes.
- Retire old sending domains after Smartlead sender domains are fully warmed and production campaigns no longer reference the old domains.
- Plan a VPS gateway migration from `hubgateway.aioutsourcehub.com` to a GMF-owned host only after DNS and Traefik are ready.
