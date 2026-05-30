# Systems Director Readiness Check

Generated: 2026-05-30T11:58:31.905Z
Owner agent: Systems Director
Reviewer: Auditor
Human approver: Mike

## Summary

- Pass: 7
- Warn: 6
- Fail: 0
- Skipped: 0


## Watch Items

- GitHub: Repo needs attention: local working tree has uncommitted changes.
- Vercel domains: Production and legacy domains are both still present in the Vercel team.
- VPS/OpenClaw: Could not verify VPS docs copy from this runtime.
- Supabase backups: Supabase backup/PITR status cannot be proven from this repo alone.
- VPS backups: Hostinger VPS backup/snapshot status cannot be proven from this repo alone.
- Password manager: Password-manager recovery coverage cannot be proven by agents.
## Checks

| Area | Status | Finding | Proof | Next action |
|---|---|---|---|---|
| GitHub | WARN | Repo needs attention: local working tree has uncommitted changes. | ## main...origin/main<br> M app/api/waitlist/route.ts<br> M app/client/[slug]/customers/page.tsx<br> M app/client/[slug]/page.tsx<br> M app/client/[slug]/visibility-report/download/route.ts<br> M app/client/[slug]/visibility-report/page.tsx<br> M app/mike-mc/jobs/page.tsx<br> M app/mike-mc/page.tsx<br> M app/unsubscribe/route.ts<br> M components/client/ClientReportCenter.tsx<br> M docs/AGENT_OPERATING_MODEL.md<br> M docs/client-ops-ledger/gmf-smartlead-draft-current.md<br> M docs/client-ops-ledger/gmf-testing-status-current.md<br> M docs/client-ops-ledger/smartlead-deliverability-audit-current.md<br> M docs/client-ops-ledger/systems-director-readiness-current.md<br> M docs/sops/SOP_SYNTHETIC_TESTING_PLAN.md<br> M docs/sops/SOP_TESTING_BACKLOG.csv<br> M docs/sops/SOP_TESTING_BACKLOG.md<br> M lib/control/monday-agent-jobs.ts<br> M next.config.ts<br> M scripts/gbp-access-verifier.mjs<br> M vercel.json<br>?? app/api/always-ready/<br>?? app/mike-mc/jobs/progress/<br>?? components/client/ClientAccessRequired.tsx<br>?? docs/ALWAYS_READY_EARLY_ACCESS_NURTURE.md<br>?? docs/GMF_AGENT_SKILL_REPAIR_PLAYBOOK.md<br>?? docs/client-ops-ledger/always-ready-nurture-current.md<br>?? docs/client-ops-ledger/manager-job-rescue-plan-2026-05-29.md<br>?? docs/client-ops-ledger/manager-skill-gap-dispatch-current.md<br>?? docs/client-ops-ledger/sop-completion-master-plan-2026-05-29.md<br>?? docs/client-ops-ledger/sop-launch-readiness-certification-2026-05-29.md<br>?? docs/client-ops-ledger/sop-verification-before-monday-plan-2026-05-29.md<br>?? docs/sops/live-pilots/2026-05-29-full-sop-certification-run.md<br>?? docs/sops/live-pilots/2026-05-29-launch-readiness-certification-audit.md<br>?? docs/sops/live-pilots/2026-05-29-synthetic-controlled-batch-001-results.md<br>?? lib/always-ready-nurture.ts<br>?? lib/client-magic-link.ts<br>?? lib/control/job-progress.ts<br>?? supabase/migrations/003-always-ready-nurture.sql<br>?? tmp-watchdog-after-rescue-2.json<br>?? tmp-watchdog-after-rescue.json<br>?? tmp-watchdog-current.json<br>?? tmp-watchdog-sop-check.json | Codex should separate intentional work from scratch files, then commit/push finished changes. |
| GitHub archive | PASS | Old AOH repo is still present as an archive remote. | Remote: aoh-archive |  |
| Runbooks | PASS | Recovery docs are present and point at the current GMF repo/docs path. | docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md<br>docs/BACKUP_READINESS_CHECKLIST.md<br>docs/LAPTOP_DEATH_RECOVERY.md<br>docs/GETMEFOUND_STACK_STATUS.md |  |
| Vercel link | PASS | Local project is linked to the active GetMeFound Vercel project. | project=getmefound; projectId=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb; orgId=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel owner | PASS | Active Vercel identity matches the protected owner account. | user=mike-egidio; email=mike@aioutsourcehub.com; id=F1j3I59aUYZmc1Gcbc6pJfEU; source=Vercel CLI session |  |
| Vercel team | PASS | Active account is owner of the protected Vercel team. | team=aoh-inc; name=AI Outsource Hub; role=OWNER; id=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel project | PASS | GetMeFound Vercel project is visible from this authenticated runtime. | project=getmefound; id=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb |  |
| Vercel domains | WARN | Production and legacy domains are both still present in the Vercel team. | getmefound.ai=present; aioutsourcehub.com=present | No emergency. Remove or redirect the legacy domain only after Mike approves. |
| VPS/OpenClaw | WARN | Could not verify VPS docs copy from this runtime. | spawnSync C:\Windows\System32\OpenSSH\ssh.exe ETIMEDOUT | Systems Director should verify SSH/provider access before client volume grows. |
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
