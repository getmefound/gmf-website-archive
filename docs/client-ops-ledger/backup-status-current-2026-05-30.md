# Backup Status Current - 2026-05-30

Owner: Systems Director / Manager
Reviewer: Auditor
Mode: non-destructive backup/readiness check

## Direct Answer

Not everything was backed everywhere when Mike asked. The newest launch work was still local-only. Agent-owned backups have now been completed for GitHub, Obsidian docs, and a Vercel preview deployment. VPS/provider-level backups still need access/provider proof.

## Backed Now

| Destination | Status | Proof |
|---|---|---|
| GitHub backup branch | Backed | `origin/backup/gmf-launch-20260530-080040` at commit `8d02b4dd4dc071e1f22f8f074afcd8769e15595b` |
| Vercel preview | Backed | `dpl_5mWX4H1ePbN5tBeJjar3T8qceQgW`, Ready, `https://getmefound-o25k051l1-aoh-inc.vercel.app` |
| Obsidian docs snapshot | Backed | `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Backups\2026-05-30 aoh-website launch snapshot` |
| Security sweep | Pass | `npm run audit:security` passed after renaming a false-positive public OAuth endpoint constant |
| Local build | Pass | `npm run build` passed before preview deployment |
| Vercel project identity | Pass | `aoh-inc/getmefound`, project id `prj_NyxkjegahECBSR2MYZ4wTGVG0tMb` |

## Still Not Fully Proven

| Destination / System | Status | Why |
|---|---|---|
| `main` branch | Not updated | Local working tree remains dirty by design; backup was pushed to a non-main branch so unreviewed work did not hit production branch. |
| Production Vercel | Not updated | Preview was deployed; production deploy remains gated until release approval. |
| VPS `/root/gmf-docs` | Not current/proven | SSH to alias `atlantis` failed from this runtime; latest attempt hit key-agent/signing or timeout issues. |
| Hostinger VPS snapshots | Not proven | Requires provider dashboard/API proof; no destructive or paid change made. |
| Supabase backups/PITR | Not proven | Requires Supabase plan/dashboard/API backup proof; paid PITR changes require Mike approval. |
| Password manager recovery | Not agent-verifiable | Requires owner/provider verification that recovery entries exist. |

## Actions Taken

1. Ran current Systems Director readiness check.
2. Fixed the security sweep false positive in `scripts/gbp-access-verifier.mjs`.
3. Confirmed `npm run audit:security` passes.
4. Created a GitHub backup branch from the current working tree without pushing to `main`.
5. Created an Obsidian docs snapshot with 709 docs files and a manifest.
6. Deployed a Vercel preview from the current working tree.
7. Confirmed Vercel preview status is Ready.
8. Attempted VPS verification through SSH; access did not complete.

## Next Safe Actions

- Keep the GitHub backup branch until the launch work is reviewed and merged.
- Do not deploy production until the release gate passes.
- Systems Director needs to repair the `atlantis` SSH path or use provider dashboard proof for VPS backup status.
- Systems Director needs Supabase backup/PITR proof before high client volume.
- Mike only needs to be involved if provider dashboards require owner login/paid backup changes or password-manager recovery verification.
