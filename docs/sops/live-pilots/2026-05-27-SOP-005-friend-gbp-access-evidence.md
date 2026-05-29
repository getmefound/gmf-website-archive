# Live Pilot Evidence - SOP 005 Friend GBP Access

SOP: SOP 005 - Google Business Profile Access Request And Verification
Pilot date: 2026-05-27
Operator: TBD
Owner role: Profile Manager
Reviewer/Auditor: Auditor
Client/prospect/partner/system: Friend test client
Pilot type: First real low-risk event
Status: agent-working; partial pass for client-originated facts and review-link capture, hold for authenticated GBP role/profile proof

## Trigger

Mike reported that he verbally asked the friend to change/add GMF Google Business Profile access for Southington Lawn Service LLC and the friend did it.

Mike provided a Google local/search profile link and said the friend added alias `admin@getmefound.ai`, but it may have displayed or added as `mike@getmefound.ai`. Mike later answered the Manager Slack ask with `Mike@getmefound.ai`; treat `mike@getmefound.ai` as the current account candidate. Mike then clarified that Profile Manager has access and should get the needed facts directly.

## Scope Check

- SOP applies: yes
- Current version used: SOP 005 v0.2
- Required approvals existed before action: pending confirmation
- Mike approval needed: no, unless profile ownership/access issue appears
- If yes, proof of Mike approval: not applicable

## Steps Followed

| Step | Completed | Notes |
|---|---|---|
| Trigger confirmed | Yes | Mike reported verbal approval/change already happened |
| Context gathered | Partial | Business name, provided Google link, and current account candidate `mike@getmefound.ai` recorded; role/profile still unverified |
| Risk/blocker check completed | Agent-owned | Existing workspace/Gmail/Slack/public paths were exhausted on 2026-05-28; authenticated GBP role/profile proof still requires Profile Manager/Systems Director access path |
| Work completed or held | Held for public edits | Internal verification/audit can proceed after access is confirmed; public edits need specific approval logged |
| Proof captured | Partial | `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md` captures source checks, business facts, review URL, and place ID; role proof still pending |
| Status/handoff logged | Yes | Pilot evidence file created |
| SOP gaps flagged | No | Current SOP covers this path |

## Required Proof

Attach or link the proof required by the SOP:

- Business name: Southington Lawn Service LLC
- Google Business Profile URL: Provided Google local/search link from Mike; still needs clean GBP/Maps profile URL confirmation
- Email/account invited as Manager: Current candidate `mike@getmefound.ai` from Mike's Slack reply; originally reported alias was `admin@getmefound.ai`
- Invite accepted: yes/no
- Role shown as Manager or Owner:
- Correct profile verified: yes/no
- Profile identity proof: Google review URL from Bill Leifert signature redirects to place ID `ChIJxypnrEz5KkYRgxXufgych38`; use this to match the authenticated GBP
- Access screenshot or confirmation note: pending authenticated GBP access path
- Gmail/invite search note: accessible Gmail search did not find a matching Google Business Profile invitation; verify inside Google account/profile directly
- Client-originated contact facts: Bill Leifert; `southingtonlawn@gmail.com`; `southingtonservices@gmail.com`; `(203) 217-9137`
- Review URL captured/tested: `https://g.page/r/CYMV7n4MnId_EB0/review`
- Direct write-review URL: `https://search.google.com/local/writereview?placeid=ChIJxypnrEz5KkYRgxXufgych38`
- Consent basis: verbal approval reported by Mike

## Result

| Decision | Choose One |
|---|---|
| Pass |  |
| Pass with minor edits |  |
| Hold | X |
| Block |  |
| Needs SOP update |  |

## Auditor Notes

Hold for activation until Profile Manager verifies from authenticated GBP access:

- the exact business/profile is correct
- access invite was accepted
- role is Manager or approved equivalent
- the correct account is used, with current candidate `mike@getmefound.ai`
- GMF does not have or need the friend's Google password
- no public edits are made before approval

Verbal approval is enough to continue the access-verification pilot and internal audit. It is not enough to make broad public changes without recording the proposed edit and approval.

## Current Agent-Owned Action

Profile Manager must confirm inside Google Business Profile before asking Mike:

- exact Southington Lawn Service LLC profile
- whether `mike@getmefound.ai` has Manager access on the correct profile
- whether any invite is accepted or still pending
- review count/rating visible in the profile panel
- clean profile URL, if available
- review link match to place ID `ChIJxypnrEz5KkYRgxXufgych38`
- hours, website, address/service-area setting, categories, and services

Mike is needed only if Profile Manager cannot access the profile, finds the wrong profile, needs public edit approval, or finds a risk item.

## 2026-05-28 Access Exhaustion Note

Profile Manager/Codex checked repo tooling, env key names, package dependencies, accessible Gmail, Slack history, public Yardbook, and the Google review-link redirect. No Google Business Profile API credential, OAuth token, authenticated browser session, or invite email was available through the current tools.

Decision: do not ask Mike yet. Systems Director/Profile Manager must first create or use a safe read-only authenticated GBP verification path. Manager asks Mike only if that path fails or if public edit/client-facing approval is required.

## Workflow Gap Found

Mike answered only the email/account question in Slack. The Manager bot treated the standalone email as a generic Manager command and replied with a help card instead of recording the partial intake answer.

Adjustment:

- Record partial intake answers immediately.
- Keep the item Human Needed only for missing private fields.
- If Mike says he needs to learn more, Manager/Profile Manager must provide a short, guided GBP verification walkthrough instead of repeating the whole intake list.
- If Mike states the agent has access, change the next step to Agent Working and require the agent to exhaust that access before any owner ask.

## Release Decision

- Move SOP to Active: no
- Keep Drafted: yes
- Mark Needs Update: no
- Next owner: Profile Manager
- Next due date: after invite/account/profile verification

## Changelog Entry To Add If Activated

| Version | Date | Change | Owner |
|---|---|---|---|
| 1.0 | YYYY-MM-DD | Activated after friend test-client GBP access verification pilot and audit | Profile Manager |
