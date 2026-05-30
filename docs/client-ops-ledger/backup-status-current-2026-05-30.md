# Backup Status Current - 2026-05-30

Owner: Systems Director / Manager
Reviewer: Auditor
Mode: non-destructive backup/readiness check

## Direct Answer

The launch work is now backed in the agent-owned places we can safely control: GitHub main, a GitHub backup branch, a verified git bundle, source zip backups, Obsidian, Google Drive, Proton Drive, iCloud Drive, and a Vercel preview deployment. VPS/provider-level backups and Supabase backup/PITR proof still need provider access proof; no paid or destructive backup changes were made.

## Backed Now

| Destination | Status | Proof |
|---|---|---|
| GitHub main | Backed | `origin/main` is pushed and includes the launch backup work plus this current backup-status report. Verify exact restore HEAD with `git rev-parse HEAD` after cloning/restoring. |
| GitHub backup branch | Backed | `origin/backup/gmf-launch-20260530-080040` at commit `d4b1f1200cb85b07831c8eaba19e56306dd7bcac` |
| Local portable backup | Backed | `C:\Users\micha\Documents\GMF Backups\2026-05-30-0800-aoh-website` |
| Obsidian portable backup | Backed | `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Backups\2026-05-30-0800-aoh-website-portable` |
| Google Drive portable backup | Backed | `G:\My Drive\GMF Backups\2026-05-30-0800-aoh-website` and `H:\My Drive\GMF Backups\2026-05-30-0800-aoh-website` |
| Proton Drive portable backup | Backed | `C:\Users\micha\Proton Drive\ctlkng4fun\GMF Backups\2026-05-30-0800-aoh-website` |
| iCloud Drive portable backup | Backed | `C:\Users\micha\iCloudDrive\GMF Backups\2026-05-30-0800-aoh-website` |
| Git bundle restore check | Pass | `git bundle verify` passed for `aoh-website-all-refs.bundle`; bundle records complete history and 21 refs |
| Vercel preview | Backed | `dpl_5mWX4H1ePbN5tBeJjar3T8qceQgW`, Ready, `https://getmefound-o25k051l1-aoh-inc.vercel.app` |
| Obsidian docs snapshot | Backed | `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Backups\2026-05-30 aoh-website launch snapshot` |
| Security sweep | Pass | `npm run audit:security` passed after renaming a false-positive public OAuth endpoint constant |
| Local build | Pass | `npm run build` passed before preview deployment |
| Vercel project identity | Pass | `aoh-inc/getmefound`, project id `prj_NyxkjegahECBSR2MYZ4wTGVG0tMb` |

## Still Not Fully Proven

| Destination / System | Status | Why |
|---|---|---|
| Production Vercel | Not updated | Preview was deployed; production deploy remains gated until release approval. |
| `aoh-archive` Git remote | Blocked | Push to archive remote failed with GitHub `403` for the current credential/user. `origin` is backed. |
| VPS `/root/gmf-docs` | Not current/proven | SSH to alias `atlantis` failed from this runtime; latest attempt hit key-agent/signing or timeout issues. |
| Hostinger VPS snapshots | Not proven | Requires provider dashboard/API proof; no destructive or paid change made. |
| Supabase backups/PITR | Not proven | Requires Supabase plan/dashboard/API backup proof; paid PITR changes require Mike approval. |
| Password manager recovery | Not agent-verifiable | Requires owner/provider verification that recovery entries exist. |

## Actions Taken

1. Ran current Systems Director readiness check.
2. Fixed the security sweep false positive in `scripts/gbp-access-verifier.mjs`.
3. Confirmed `npm run audit:security` passes.
4. Created and verified a GitHub backup branch.
5. Confirmed `origin/main` is updated with the latest backup commit.
6. Created a verified portable git bundle and source zip.
7. Copied portable backups to local Documents, Obsidian, Google Drive, Proton Drive, and iCloud Drive.
8. Created an Obsidian docs snapshot with 709 docs files and a manifest.
9. Deployed a Vercel preview from the current working tree.
10. Confirmed Vercel preview status is Ready.
11. Attempted archive remote backup; push was blocked by GitHub permissions.
12. Attempted VPS verification through SSH; access did not complete.

## Next Safe Actions

- Keep the GitHub backup branch and portable bundle until after launch stabilization.
- Do not deploy production until the release gate passes.
- Repair or replace `aoh-archive` access if that remote is still expected to mirror this repo.
- Systems Director needs to repair the `atlantis` SSH path or use provider dashboard proof for VPS backup status.
- Systems Director needs Supabase backup/PITR proof before high client volume.
- Mike only needs to be involved if provider dashboards require owner login/paid backup changes or password-manager recovery verification.
