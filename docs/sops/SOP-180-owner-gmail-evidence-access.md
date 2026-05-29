# SOP 180 - Owner Gmail Evidence Access

Status: Drafted
Version: 0.1
Owner: Systems Director / Manager
Reviewer: Auditor
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-180-owner-gmail-evidence-access.md`

## Purpose

Use Mike's connected Gmail access as a safe self-serve evidence source so agents do not interrupt Mike for facts, invitations, notices, receipts, or prior instructions that already exist in email.

## Covered Master Map Rows

- Owner Gmail evidence access

## Scope

This SOP applies to GMF agents using the Gmail connector to search, read, reference, label, archive, or send email while running GMF operations.

## Trigger

- An agent needs a client-originated fact, access invitation, vendor notice, receipt, prior instruction, attachment, or proof that may be in Gmail
- Manager is considering asking Mike for an inbox fact
- A client/access blocker may have originated from a missed, bounced, spammed, trashed, or misrouted email
- GitHub, Vercel, Supabase, Stripe, Resend, Slack, Google, or other system emails report failed jobs, billing risk, key/credential drift, delivery failures, or security notices
- Account Manager, Sales Rep, or Manager needs to send an approved email under another SOP

## Expected Output

Minimum necessary email evidence, recorded safely, plus a decision: fact verified, access path found, no relevant email found, outbound send ready for approval, or true owner-needed blocker.

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Owns connector health, access boundaries, labels, safe tool usage, and GitHub/CI/vendor failure triage from Gmail plus direct system checks |
| Manager | Owns routing, owner-visible status, and Mike escalation discipline |
| Account Manager | Uses approved client email templates and logs client correspondence when allowed |
| Sales Rep | Uses approved prospect/partner emails and logs sales correspondence when allowed |
| Auditor | Reviews proof, privacy, and live-send guardrails |
| Mike | Involved only when the owner-needed rule is met |

## Hard Rules

- Never ask Mike to share email passwords, recovery codes, 2FA codes, backup codes, magic login links, raw cookies, or private tokens.
- Never record, quote, or forward security codes or irrelevant personal/private content in docs, Slack, Monday, proof artifacts, or final notes.
- Use the minimum search and read needed for the business task.
- Search before reading; read only relevant messages or attachments.
- Treat attachments as sensitive and task-scoped.
- Gmail can verify email evidence, but it does not replace a signed-in app session, OAuth grant, API token, account role, or platform permission.
- Sending email is a live-send action and must follow the relevant SOP and approval gate.
- Do not send legal, billing, reputation, refund, client-facing, prospect-facing, review-request, cold outreach, access, or vendor email unless the responsible SOP authorizes it.
- If irrelevant personal emails appear in search results, do not summarize their content beyond "not relevant."

## Procedure

1. Confirm the business question and whether Gmail is a reasonable evidence source.
2. Confirm whether the connector coverage is sufficient for the question. If Mike can see a message that the connector cannot find, route the issue through SOP 188 coverage-gap handling before claiming inbox search is complete.
3. Search Gmail using narrow terms first: client name, system name, sender, recipient, subject, date window, and exact aliases.
4. Include `in:anywhere` only when missed, trashed, spammed, bounced, or archived email is plausible.
5. Prefer message IDs, sender, recipient, subject, date, and business-relevant snippet/facts as proof.
6. Read a message only when the search result is likely relevant.
7. Read attachments only when the task requires the file and the attachment source is trusted.
8. Record only the business fact, not private or unrelated content.
9. If a delivery failure, alias issue, missing invite, or access mismatch is found, route to Systems Director before asking Mike.
10. If a GitHub Actions, Vercel, Supabase, Stripe, Resend, Slack, Google, or other vendor failure notice is found, Systems Director must verify the issue directly in the source system before escalating.
11. If a message needs an answer, draft first under the owning SOP.
12. If a live send is requested, run SOP 171 and the relevant client/prospect/vendor SOP before sending.
13. If Gmail access fails, document connector status and route to Systems Director.
14. Ask Mike only after Gmail, local docs, Slack history, Monday, Mission Control, public sources, and safe read-only checks are exhausted.

## Required Proof

- Search query family used, without exposing private results
- Message IDs or safe links for relevant business emails
- Business fact verified or blocker found
- Attachment name only when relevant
- No security codes or private content copied into proof
- Monday/proof update showing next action
- Auditor pass/hold/block before marking workflow Done

## What To Log

- Workstream/client/system
- Search purpose
- Relevant message IDs
- Verified business facts
- Access or delivery issue found
- Next owner
- Mike needed: yes/no
- Approval status before any live send

## Email Send Guardrail

Gmail send capability exists, but it is not a default permission to email anyone.

Allowed only when all are true:

1. The responsible role is allowed to send that email type.
2. The relevant SOP provides the template, purpose, and stop conditions.
3. Required proof and approvals are complete.
4. Auditor/Manager has cleared live-send risk when the message is client-facing, prospect-facing, vendor-critical, legal, billing, reputation-related, access-related, or review-request-related.
5. The send is logged with message ID, recipient, subject, date, and workflow.

## Failure Or Blocker Handling

If the needed evidence is not found:

1. Expand search terms safely before escalating.
2. Check spam/trash/archive with `in:anywhere` when relevant.
3. Search aliases and alternate client/vendor addresses.
4. Search Slack, Monday, local docs, Mission Control, and public sources.
5. If the issue is deliverability or alias routing, assign Systems Director.
6. If the issue is a missing platform permission, follow SOP 174.
7. If Mike is truly needed, Manager sends the smallest exact Slack DM ask under SOP 175.

## Initial Live Pilot Notes

On 2026-05-28, Manager verified Gmail connector read/search access with a labels-only check, then used targeted Gmail searches for Southington Lawn Service LLC. Relevant business emails were found, no Google Business Profile invite email was found, and an earlier `admin@getmefound.ai` delivery failure was identified as a possible setup clue. No security codes or irrelevant personal details were recorded.

On 2026-05-28, Mike asked which agent should scan for GitHub Actions failure emails. Manager assigned Systems Director. The Gmail connector did not find the referenced GitHub notification in the connected mailbox, so Systems Director verified the issue directly in GitHub Actions and found repeated `Reach Business Discovery First` schedule failures. This confirmed the operating rule: email scan is a signal source, but source-system checks are the proof source.

This also created SOP 188 coverage-gate work: agents must not claim daily inbox triage is complete until connector coverage is tested against known owner-visible messages.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | Pass |
| Dry run | Pass |
| Live pilot | In progress - Gmail connector read/search verified and Southington access trail searched |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-28 | Created after Mike approved using Gmail access to avoid future inbox-fact blockers | Systems Director / Manager |

## Source Documents

- `AGENTS.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/GMF_OWNER_COMMAND_PLAN.md`
- `docs/sops/SOP-171-live-send-approval.md`
- `docs/sops/SOP-174-credential-access-escalation.md`
- `docs/sops/SOP-175-human-needed-slack-alert.md`
- `docs/sops/live-pilots/2026-05-28-southington-profile-manager-access-and-fact-proof.md`
