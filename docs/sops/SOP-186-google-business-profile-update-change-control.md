# SOP 186 - Google Business Profile Update Change Control

Status: Drafted
Version: 0.1
Owner: Profile Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-186-google-business-profile-update-change-control.md`

## Purpose

Update client Google Business Profiles safely, repeatably, and with proof. This SOP covers the path from profile audit to proposed changes, approval, update submission, Google review/status check, and client-visible completion.

## Covered Master Map Rows

- GBP category and service review
- Hours, phone, website, and description review
- Photo and media check
- Website/profile fact sync
- Weekly GBP post
- Public profile edit approval

## Trigger

- Get Found audit finds a Google Business Profile field that should be updated.
- Stay Found monthly drift check finds stale, missing, or mismatched profile information.
- Client requests a GBP update.
- Weekly GBP post is due.
- Google suggests or applies profile updates that need review.

## Roles

| Role | Responsibility |
|---|---|
| Profile Manager | Owns profile inspection, proposed edits, safe updates, post drafts, and proof capture |
| Account Manager | Gets client approval when a client-owned fact or public promise is changing |
| Systems Director | Maintains OAuth/API tools, access checks, and automation health |
| Auditor | Reviews edit risk, claims, and proof before material public changes |
| Manager | Routes blockers and owner/client-needed decisions |

## Update Lanes

### Lane A - Authenticated Google UI

Use this first for live client work unless Systems Director has proven the API path for that profile and field.

- Client adds GMF as Manager; no password sharing.
- Profile Manager opens the correct profile from the authorized Google account.
- Profile Manager makes approved edits directly in Google Search, Google Maps, or Business Profile controls.
- This lane is required for fields or actions not supported reliably by the API.

### Lane B - Official Google Business Profile API

Use this only after Systems Director has confirmed OAuth/API access, the correct account/location IDs, and field support.

- Read profile facts before writing.
- Use validation or dry-run behavior where supported.
- Submit only approved fields with a narrow update mask.
- Log request intent, response, and follow-up status without storing tokens or secrets in docs.
- If API behavior differs from the Google UI, stop and route to Systems Director/Auditor.

## Hard Rules

- Never ask for a client's Google password.
- Do not edit the wrong profile. Match business name, website, phone, address/service area, and place/profile URL first.
- Do not invent facts. Unknown facts stay unknown until verified from the client, profile access, website, public records, or approved source.
- Do not keyword-stuff names, categories, services, descriptions, or posts.
- Do not show a client address if the business is service-area only and customers do not visit that address.
- Do not make material public edits without approval and proof.
- Do not promise ranking, map-pack placement, AI Overview/AI Mode placement, calls, sales, or review count.
- Google may review profile edits before they appear live; submitted does not equal published.

## Edit Risk Classes

| Risk | Examples | Approval |
|---|---|---|
| Low | typo fix, broken website URL, clearly missing holiday hours, already-approved photo upload, safe weekly post draft | Profile Manager may submit after proof if within approved scope |
| Medium | services, description, appointment URL, business hours, photos showing jobs/team, review link setup | Auditor review or client-approved source required |
| High | business name, primary category, address, service area, phone, ownership, verification, closure, reinstatement, legal/reputation claims | Client approval and Auditor pass required before submission |

For GMF's own profile, Mike approval replaces client approval for public phone, address/service-area, verification, and final publish.

## Procedure

1. Confirm access and identity.
   - Verify Manager/Owner role or approved API OAuth access.
   - Match the profile to the client record and proof artifact.
   - Record profile URL/place ID/location ID when available.

2. Capture before state.
   - Save the current field values in the client proof doc.
   - Use screenshots only when needed; avoid private account details.
   - Record public URL and date/time.

3. Build the edit packet.
   - List each proposed field, current value, proposed value, source of truth, risk class, and reason.
   - Separate safe factual fixes from client-owned decisions.
   - If a fact is missing, exhaust profile access, client website, intake, Slack/Monday/proof docs, and safe public sources before asking the client.

4. Review and approval.
   - Profile Manager can approve low-risk, already-sourced factual corrections.
   - Auditor reviews medium/high-risk edits.
   - Account Manager obtains client approval only when the fact cannot be verified or the change affects business identity, public promise, or reputation.

5. Submit the update.
   - Use Lane A Google UI for normal work.
   - Use Lane B API only when Systems Director has proven the field is supported and safe for that client.
   - Submit the smallest set of approved changes possible.

6. Capture submitted proof.
   - Record fields submitted, date/time, editor/agent, method, and any Google pending/review message.
   - If Google requests verification, identity, phone, video, ownership, or sensitive proof, stop and route as Human Needed.

7. Verify after state.
   - Recheck the profile after Google accepts, rejects, or keeps changes pending.
   - Capture live/pending/rejected status.
   - If Google changes a field independently, record it and decide accept/reject or client ask.

8. Update operating records.
   - Update Monday with status, next owner, proof link, expected receive time, and escalation timer.
   - Update the client hub or report artifact with client-safe status.
   - Hand off to Reporter for before/after visibility snapshot when relevant.

9. Close or rescue.
   - Close only when proof is attached and Auditor-required checks pass.
   - If the task stalls, Manager classifies it as agent-owned, client waiting, platform waiting, or human-needed and sets timers under SOP 181/182/183/184.

## Required Proof

- Correct profile identity proof
- Access role or OAuth/API access proof
- Before-state values
- Proposed edit packet
- Approval or source-of-truth evidence
- Submitted update proof
- After-state live/pending/rejected proof
- Monday/client hub/report update

## Failure Or Blocker Handling

- Access missing or wrong profile: return to SOP 005.
- Business fact conflict: Profile Manager exhausts existing sources; Account Manager asks the client only for the smallest unresolved decision.
- Google requests verification or owner-only action: mark Human Needed for the client; for GMF-owned pages, Manager DMs Mike.
- Edit rejected or profile suspended: stop public changes, route to Auditor/Manager, and open incident/reinstatement path.
- API fails or lacks field support: Systems Director documents the failure and Profile Manager uses the Google UI lane.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Added controlled Google Business Profile update workflow with UI/API lanes, approval gates, and proof requirements | Manager/Profile Manager |

## Source Documents

- `docs/sops/SOP-005-google-business-profile-access-request-verification.md`
- `docs/sops/SOP-006-get-found-fulfillment.md`
- `docs/sops/SOP-172-public-profile-edit-approval.md`
- `docs/sops/SOP-181-waiting-state-sla-and-timer-control.md`
- `docs/sops/SOP-182-agent-to-agent-handoff-and-receive-acknowledgment.md`
- `docs/sops/SOP-183-stuck-agent-timeout-and-rescue.md`
- Google Business Profile owner/manager roles: https://support.google.com/business/answer/3403100
- Google edit profile help: https://support.google.com/business/answer/3039617
- Google Business Information API location patch: https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations/patch
- Google local posts API: https://developers.google.com/my-business/content/posts-data
