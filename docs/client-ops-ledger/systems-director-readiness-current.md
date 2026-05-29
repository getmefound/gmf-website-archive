# Systems Director Readiness Check

Generated: 2026-05-28T15:51:53.653Z
Owner agent: Systems Director
Reviewer: Auditor
Human approver: Mike

## Summary

- Pass: 9
- Warn: 5
- Fail: 0
- Skipped: 0


## Watch Items

- GitHub: Repo needs attention: local working tree has uncommitted changes.
- Vercel domains: Production and legacy domains are both still present in the Vercel team.
- Supabase backups: Supabase backup/PITR status cannot be proven from this repo alone.
- VPS backups: Hostinger VPS backup/snapshot status cannot be proven from this repo alone.
- Password manager: Password-manager recovery coverage cannot be proven by agents.
## Checks

| Area | Status | Finding | Proof | Next action |
|---|---|---|---|---|
| GitHub | WARN | Repo needs attention: local working tree has uncommitted changes. | ## main...origin/main<br> M .gitignore<br> M AGENTS.md<br>D  C:Tempcustomfields.json<br>M  CLAUDE.md<br>M  app/about/page.tsx<br> M app/api/agent/slack/route.ts<br>M  app/api/motto-banner/[slug]/route.tsx<br>A  app/api/partners/route.ts<br>M  app/api/team-banner/[slug]/route.tsx<br>M  app/calculator/page.tsx<br>M  app/client/[slug]/page.tsx<br>A  app/client/[slug]/visibility-report/download/route.ts<br>A  app/client/[slug]/visibility-report/page.tsx<br>M  app/contact/page.tsx<br>A  app/partners/page.tsx<br>A  app/ref/[code]/page.tsx<br>M  app/report/ai-visibility/page.tsx<br>M  app/terms/page.tsx<br>M  components/Navbar.tsx<br>A  components/client/ClientReportCenter.tsx<br>M  components/hero/HeroVisualReviews.tsx<br>M  content/blog/46-beats-50-star-rating-sweet-spot.md<br>MM docs/AGENT_OPERATING_MODEL.md<br>M  docs/AOH_OPERATIONS_INDEX.md<br>MM docs/GMF_AGENT_TRAINING_PACK.md<br>M  docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md<br> M docs/GMF_COMPANY_OPERATING_SYSTEM.md<br>M  docs/GMF_MOCK_CLIENT_SIGNUP_TO_UPGRADE_DRAFT.md<br>A  docs/GMF_PARTNER_PROGRAM.md<br>M  docs/GMF_REBRAND_AUDIT.md<br>M  docs/GMF_WEBSITE_MESSAGING_CLIENT_HOME_BRIEF.md<br>MM docs/MANAGER_ROUTING_SKILL_PACK.md<br>M  docs/client-ops-ledger/README.md<br>M  docs/client-ops-ledger/client-hub-runbook.md<br> M docs/client-ops-ledger/client-ops-ledger-data-dictionary.md<br> M docs/client-ops-ledger/client-ops-ledger.csv<br>M  docs/client-ops-ledger/ghl-replacement-cost-plan.md<br> M docs/client-ops-ledger/prospecting-smartlead-preflight-current.md<br>M  docs/client-ops-ledger/review-automation-client-intake.md<br> M docs/client-ops-ledger/slack-agent-command-runbook.md<br> M docs/client-ops-ledger/slack-app-manifest.yml<br> M docs/client-ops-ledger/smartlead-warmup-current.csv<br> M docs/client-ops-ledger/systems-director-readiness-current.md<br>A  lib/visibility-report-artifacts.ts<br> M package-lock.json<br> M package.json<br>M  public/llms.txt<br> M scripts/monday-agent-jobs.mjs<br>M  supabase/schema.sql<br>?? docs/GMF_AGENT_TRAINING_ESCALATION_PROTOCOL.md<br>?? docs/GMF_OWNER_COMMAND_PLAN.md<br>?? docs/GMF_SOP_MASTER_MAP.md<br>?? docs/GMF_SOP_VISUAL_MAP.md<br>?? docs/GMF_TOMORROW_START_PROMPT.md<br>?? docs/client-ops-ledger/api-key-rotation-smoke-current.md<br>?? docs/client-ops-ledger/gmf-testing-status-current.md<br>?? docs/client-ops-ledger/security-sweep-and-update-proof-current.md<br>?? docs/client-ops-ledger/slack-key-rotation-smoke-current.md<br>?? docs/client-ops-ledger/stripe-resend-key-rotation-smoke-current.md<br>?? docs/sops/<br>?? scripts/api-key-rotation-smoke.mjs<br>?? scripts/slack-key-rotation-smoke.mjs<br>?? scripts/stripe-resend-key-rotation-smoke.mjs<br>?? tmp-next-start-3017.err.log<br>?? tmp-next-start-3017.out.log | Codex should separate intentional work from scratch files, then commit/push finished changes. |
| GitHub archive | PASS | Old AOH repo is still present as an archive remote. | Remote: aoh-archive |  |
| Runbooks | PASS | Recovery docs are present and point at the current GMF repo/docs path. | docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md<br>docs/BACKUP_READINESS_CHECKLIST.md<br>docs/LAPTOP_DEATH_RECOVERY.md<br>docs/GETMEFOUND_STACK_STATUS.md |  |
| Vercel link | PASS | Local project is linked to the active GetMeFound Vercel project. | project=getmefound; projectId=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb; orgId=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel owner | PASS | Active Vercel identity matches the protected owner account. | user=mike-egidio; email=mike@aioutsourcehub.com; id=F1j3I59aUYZmc1Gcbc6pJfEU; source=Vercel CLI session |  |
| Vercel team | PASS | Active account is owner of the protected Vercel team. | team=aoh-inc; name=AI Outsource Hub; role=OWNER; id=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel project | PASS | GetMeFound Vercel project is visible from this authenticated runtime. | project=getmefound; id=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb |  |
| Vercel domains | WARN | Production and legacy domains are both still present in the Vercel team. | getmefound.ai=present; aioutsourcehub.com=present | No emergency. Remove or redirect the legacy domain only after Mike approves. |
| VPS/OpenClaw | PASS | VPS is reachable and the required GMF docs copy exists. | /root/gmf-docs/AGENT_OPERATING_MODEL.md<br>/root/gmf-docs/BACKUP_READINESS_CHECKLIST.md<br>/root/gmf-docs/GMF_OPERATIONS_INDEX.md<br>/root/gmf-docs/LAPTOP_DEATH_RECOVERY.md<br>/root/gmf-docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md<br>/root/gmf-docs/MANAGER_ROUTING_SKILL_PACK.md<br>/root/gmf-docs/PP_GHL_WIRING.md<br>/root/gmf-docs/REVIEW_AUTOMATION_AGENT_SKILLS.md<br>/root/gmf-docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md<br>/root/gmf-docs/getmefound/GETMEFOUND_STACK_STATUS.md |  |
| VPS docs path | PASS | Legacy `/root/aoh-docs` path is no longer treated as the active docs path. | active=/root/gmf-docs |  |
| Supabase backups | WARN | Supabase backup/PITR status cannot be proven from this repo alone. | Owner approval needed before enabling paid PITR. | Systems Director should confirm plan/backups in Supabase before onboarding high client volume. |
| VPS backups | WARN | Hostinger VPS backup/snapshot status cannot be proven from this repo alone. | Provider dashboard proof required. | Systems Director should confirm daily VPS backups and define an encrypted offsite OpenClaw backup. |
| Password manager | WARN | Password-manager recovery coverage cannot be proven by agents. | Mike-only verification. | Mike should confirm GitHub, Vercel, Supabase, Hostinger, DNS, Google, Stripe, Slack, Resend, and Smartlead recovery entries exist. |
| Security sweep | PASS | Auditor security sweep passed. | > getmefound-website@0.1.0 audit:security > node scripts/auditor-security-sweep.mjs Auditor security sweep passed. No obvious secret exposure patterns found. |  |

## Mike Approval Required

- Vercel account/team/project/domain deletion, merge, or transfer
- Legacy AOH domain removal or redirect
- Paid Supabase PITR or backup-plan changes
- Paid VPS backup/snapshot changes
- Production token rotation
- Database or VPS restore/overwrite

## Agent-Owned Next Actions

- Systems Director runs this check weekly and summarizes only status/proof, not secrets.
- Auditor reviews warnings before client volume grows or before production-sensitive changes.
- Codex updates scripts, docs, and non-destructive workflows when checks identify drift.
- No agent deletes accounts, projects, domains, databases, or VPS state without Mike's explicit approval.
