# GetMeFound Partner Program — Agent Operating Guide

Status: active
Owner: Mike Egidio
Use: give this to any agent handling partner applications, approvals, link generation, or commission tracking.

---

## Canonical Agent Instruction

Partner applications arrive as Supabase `agent_tasks` rows.

Pick up only tasks where:

- `kind` is `partner_application`
- `status` is `new`

Before processing any application, read this guide. The agent must read the payload fields, decide approve / flag / decline, and update the task.

Applicant emails must be plain English. Do not mention Supabase, task IDs, agent processes, internal scoring, Slack, or any internal system to the applicant. Sign as GetMeFound or Mike Egidio depending on tone.

Live applicant email rules:

- Approved applicants get the approval email and partner link.
- Flagged applicants do not get an email until Mike decides.
- Declined applicants get the decline email.

Core constants:

- Base URL: `https://getmefound.ai`
- Partner link format: `https://getmefound.ai/ref/PARTNERCODE`
- Resend from address: `support@getmefound.ai`
- Mike's email: `mike@getmefound.ai`

---

## What the Program Is

GetMeFound pays approved partners $50 for every Get Found ($149) conversion they drive. Partners get a unique referral link in the format:

```
https://getmefound.ai/ref/PARTNERCODE
```

That link goes to a stripped-down landing page focused on Get Found checkout. The `ref` code is passed to the checkout URL as a UTM parameter for tracking.

No ongoing commission on Stay Found or Always Ready (yet). Flat $50 per Get Found sale. Paid monthly by PayPal or bank transfer.

---

## Application Flow

1. Partner applies at `getmefound.ai/partners`
2. Form submission hits `POST /api/partners`
3. API creates an `agent_tasks` row in Supabase with:
   - `kind: "partner_application"`
   - `status: "new"`
   - `priority: "normal"`
4. Agent picks up the task and reviews the application
5. Agent decides: **approve**, **flag for Mike**, or **decline**
6. Confirmation email already sent to applicant automatically on submission

---

## Application Fields (what the agent receives in payload)

| Field | Description |
|---|---|
| `name` | Applicant's full name |
| `email` | Contact email |
| `partnerType` | One of: `web_designer`, `bookkeeper`, `virtual_assistant`, `business_coach`, `content_creator`, `podcast_host`, `other` |
| `handle` | Social/channel handle or URL (optional — mainly for creators) |
| `audienceSize` | Approximate audience or client count (free text, optional) |
| `howYouWork` | Free text — how they plan to refer businesses |
| `offersGbp` | One of: `no`, `yes_basic`, `yes_full` |
| `submittedAt` | ISO timestamp |

---

## Task Update Contract

On approval:

- send approval email via Resend from `support@getmefound.ai`
- notify Mike on Slack
- set task `status` to `completed`
- write the partner code in task `notes`
- write a `result` payload with at least `decision`, `partnerCode`, `partnerLink`, `emailSent`, and `slackNotified`

On flag:

- post the full application to Slack with the reason for flagging
- do not email the applicant
- set task `status` to `flagged`
- write the flag reason in task `notes`
- write a `result` payload with at least `decision: "flagged"` and `reason`

On decline:

- send the decline email
- set task `status` to `completed`
- write the decline reason in task `notes`
- write a `result` payload with at least `decision: "declined"`, `reason`, and `emailSent`

If any live send or Slack notification fails, do not mark the task completed. Leave the task `status` as `new` or move it to `flagged` with the failure reason in `notes`, depending on risk. If an applicant email already sent but a later step failed, record that partial send in `notes` and `result` so the retry does not send a duplicate email.

---

## Approval Criteria

### Auto-approve if ALL of the following are true:
- `offersGbp` is `no` or `yes_basic` (not `yes_full` — that's a direct competitor)
- `partnerType` is a clear local business touchpoint (web_designer, bookkeeper, virtual_assistant, business_coach, content_creator, podcast_host)
- `howYouWork` is specific and credible — they name a real audience or client type
- No red flags in tone or intent (e.g. "I want to buy it myself" = self-referral risk)

### Flag for Mike if ANY of the following:
- `offersGbp` is `yes_full` — they likely compete with GetMeFound
- `howYouWork` is vague, generic, or sounds like they want a discount for themselves
- Claims extremely high referral volume (100+/month) without credible explanation
- `partnerType` is `other` and the explanation is unclear
- Email domain is the same as a known competitor

### Decline (no further review needed) if:
- They are clearly a local business owner applying to refer themselves
- Email bounces or is invalid
- Submission looks like spam

---

## On Approval — What the Agent Does

1. Generate their partner code: use a slug derived from their name, e.g. `jane-smith` or `janesmith` — lowercase, hyphens, no spaces
2. Their referral link: `https://getmefound.ai/ref/PARTNERCODE`
3. Send approval email via Resend from `support@getmefound.ai`:

**Subject:** You're approved — here's your GetMeFound partner link

**Body:**
```
Hi [NAME],

You're approved as a GetMeFound partner. Here's your referral link:

https://getmefound.ai/ref/PARTNERCODE

Every time someone buys Get Found ($149) through your link, you earn $50. No cap, no minimum.

A few things to know:
- Commissions are tracked by referral code in your link
- Payouts happen monthly by PayPal or bank transfer — reply to this email with your preferred method
- Use the copy on the partners page to help introduce it: getmefound.ai/partners

If you have questions, reply here or email mike@getmefound.ai.

Mike Egidio
Founder, GetMeFound
```

4. Log the approved partner in Supabase `agent_tasks` - update status to `completed` with a note containing their partner code and a `result.partnerCode` value
5. Notify Mike via Slack: "Partner approved: [NAME] — code: [PARTNERCODE]"

---

## On Decline

Send a short, kind decline email:

**Subject:** GetMeFound partner application

**Body:**
```
Hi [NAME],

Thanks for applying to the GetMeFound partner program. After reviewing your application, we don't think it's the right fit at this time — usually because of overlap with services we offer directly.

If your situation changes or you have questions, feel free to reach out at mike@getmefound.ai.

GetMeFound
```

Then update the task status to `completed` and record the decline reason in `notes` and `result`.

---

## On Flag for Mike

Post to Slack with full application payload and reason for flagging. Do not email the applicant yet. Set the task status to `flagged`. Mike will review and reply with approve or decline.

---

## Partner Code Format

- Lowercase only
- Hyphens between words, no spaces, no special characters
- Derived from name: "Jane Smith" → `jane-smith`, "Mike's Blog" → `mikes-blog`
- If name collision, append `-2`, `-3` etc.
- Keep it short and readable — partners say this URL out loud in videos

---

## Tracking & Commissions

Conversions are tracked via UTM parameters on the checkout URL:
- `utm_source=partner`
- `utm_medium=referral`
- `utm_campaign=PARTNERCODE`
- `ref=PARTNERCODE`

Monthly: Mike or an agent reviews GA4 and Stripe for conversions tagged with partner UTMs and pays out accordingly. No automated payout system yet — manual monthly reconciliation.

---

## Who We Want as Partners

Best fit:
- Web designers who build sites but don't do ongoing local marketing
- Bookkeepers and accountants who advise local business owners
- Virtual assistants who work directly for local owners
- Business coaches and consultants (non-competing)
- Content creators and influencers with local business owner audiences (YouTube, TikTok, Instagram, LinkedIn)
- Podcast hosts covering small business, entrepreneurship, local marketing

Not a fit:
- Full-service digital marketing agencies offering GBP/SEO/reputation management
- Local business owners trying to self-refer
- Anyone in a saturated competing trade we're not targeting (HVAC, plumbing, roofing)

---

## Commission Structure

| Event | Amount |
|---|---|
| Get Found conversion ($149) | $50 to partner |
| Stay Found conversion ($99/mo) | Not included (yet) |
| Always Ready conversion ($299/mo) | Not included (yet) |

Payout: monthly, PayPal or bank transfer, no minimum threshold.
