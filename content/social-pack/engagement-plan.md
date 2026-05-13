# Engagement Plan — From Zero Followers to Outbound-Ready

The posts going live are necessary but not sufficient. With zero followers, organic reach is near-zero unless engagement compounds quickly. This doc is the operating playbook for the next 7 days.

## The single most important rule

**LinkedIn algorithm decision is made in the first 60 minutes after a post publishes.** If the post gets engagement (comments, reactions, dwell time) in that first hour, LinkedIn pushes it to more of your network. If it doesn't, the post dies. Forever.

That means:
- Every post needs a planned engagement push in the first hour
- "Going to bed" or "going out" is not a valid reason to skip — schedule the engagement, not just the post
- Replies within 60 minutes of any comment double the dwell-time signal

## Daily routine (Mon–Fri, ~30 min total)

### Morning (10 min, 8-9am)

1. Open LinkedIn → notifications → reply to anyone who commented/reacted in last 24hr
2. Open LinkedIn home feed → comment substantively on 3 posts from your network (target verticals: HVAC, plumbing, dental, vet, med spa, pet grooming, salon, lawn care)
3. Comment rules:
   - 2+ sentences, no "great post 🔥"
   - Reference something specific from their post
   - Add a contrasting data point or related anecdote
   - Don't pitch AOH unless they pitched you first

### Mid-day (10 min, 12-1pm)

1. New post fires at 1pm (per schedule) — open it within 5 min of publish
2. Reply to your own post with an open-ended question to bait the first comment from a stranger ("What's the after-hours number look like for your business?")
3. Send 5 connection requests with personalized notes — owners in target verticals
4. Personalized note template:
   > "Saw your post about [specific detail from their last 3 posts]. Curious how you're handling [related challenge]. Building something at the AI-meets-local-business intersection — would value your operator's take if open to a connection."

### Afternoon (10 min, 4-5pm)

1. Second post fires (Wed only — most days are 1 post)
2. Reply to any comments on morning's post — every single one
3. Comment on 3 more posts in target verticals
4. End-of-day: log what got engagement, what didn't, in `social-pack/week1-log.md` (file to be created)

## Weekend rhythm (lighter, 10 min/day)

- Sat 10am post (groomer-trust) — light engagement push, comment on 2 posts
- Sun 11am post (reviews-compound) — same
- Goal: don't go dark before Monday outreach kicks in

## What "engagement" actually means

LinkedIn's algorithm weights signals like this (from observed behavior + Microsoft research papers):

| Signal | Weight |
|--------|--------|
| Comment with 5+ words | Highest |
| Reply to your own post within 1hr | Very high |
| Reaction (any) | Low |
| Profile click after read | Medium-high (proxy for "they're interested") |
| Dwell time on post (read all of it) | High |
| Share | Highest |

Implication: **a single thoughtful comment is worth ~20 "likes."** Optimize for comments.

## The 1-hour reply rule

When ANY comment appears on YOUR post:
- If it's within first hour of post publishing → reply within 5 min
- If it's later → reply within 60 min during business hours
- If after-hours → reply first thing next morning (don't skip)

Phone notifications on for LinkedIn during the 1-hour-after-publish window. Off the rest of the time.

## Outbound message templates (post-Monday)

When prospect from mailer/calls connects on LinkedIn:

**Day 0 (immediately after connection accept):**
> Thanks for connecting. No pitch — saw [specific thing about their business / Google profile / industry]. Posted some math on this here recently if interested: [link to relevant post]

**Day 3 (if no reply to Day 0):**
> Quick follow-up — ran the AI-visibility check on [their business name] today. Their Google profile is [specific finding]. No urgency, but happy to send the 1-paragraph summary if useful.

**Day 7 (if still no reply):**
> Last note — if not the right time, no worries. The calculator at aioutsourcehub.com runs the missed-revenue math in 30 seconds if you ever want a number to chew on.

## Don't do

- Don't comment "Great post!" on anything — algorithm flags this as low-quality
- Don't auto-DM new connections with a sales pitch — instant unfollow
- Don't tag more than 5 accounts in any post or comment — spam signal
- Don't post on weekends about AOH product directly (Sat post is groomer-niche, Sun is reviews-philosophy — both passive)
- Don't reply to your own comments more than twice in a thread (looks desperate)

## Measurable goals for week 1

| Metric | Target | How to check |
|--------|--------|--------------|
| LinkedIn profile views | 50+ | LinkedIn → Me → Posts & Activity → Analytics |
| Post impressions (sum across 8 posts) | 1,000+ | Each post → "View analytics" |
| Comments on your posts | 5+ | LinkedIn notifications |
| New connections accepted | 25+ | LinkedIn → Network |
| Comments you left on others' posts | 25+ | Manual log in week1-log.md |
| Calculator link clicks from social | 5+ | GHL or Vercel Analytics → referrer = linkedin.com |

If you hit half these numbers by Friday, the foundation is solid. If you hit less than half, the issue is engagement volume not post quality — increase the daily commenting routine to 45 min.

## Tools to bookmark

- LinkedIn Analytics (per post): click post → "View analytics"
- LinkedIn Profile Analytics: Me → Profile Strength → see who viewed
- Vercel Analytics referrer filter (when site is on Vercel): aioutsourcehub.com Analytics → filter by `linkedin.com` referrer
- GHL Social Planner reporting: Marketing → Social Planner → Analytics

## Week 2+ build queue (proper scope)

These are NOT week 1 deliverables. Documented so they don't get forgotten or treated as "shortcuts."

### Week 2 — Carousels
- Build IG/LinkedIn carousel slide generator route at `/api/social-carousel/[theme]/[slide]`
- 5-7 slides per theme, text-on-image, on-brand
- LinkedIn carousels need PDF upload (single multi-page PDF) — separate route
- Estimate: 4-6 hours dev + 2 hours content per theme

### Week 2 — LinkedIn polls
- Polls don't fit the AOH "we have the math" tone
- Best poll angles: "Which marketing tool do you actually open weekly?" / "Where do customers find you most?"
- GHL Social Planner does NOT support poll creation via API — manual in LinkedIn UI
- Estimate: 15 min/week manual creation

### Week 2 — LinkedIn PDF document posts
- Compile best 3-5 math posts into single PDF "AOH 2026 Local Business Math Playbook"
- Upload as document post on LinkedIn (3× organic reach vs single image)
- Estimate: 2-3 hours design + 30 min upload

### Week 3 — Reels / native video
- Production cost real — needs scripting + recording + editing
- Best ROI when there's a face on camera (Mike or Kip)
- Defer until aoh-studio agent can generate text-on-video automatically
- Estimate: TBD when studio ships

### Week 3 — Repost top performer
- After week 1 data, identify highest-engagement post
- Re-post 21 days later with different opening hook + same content
- Different time slot (if first fired 1pm, retry 8am)
- LinkedIn algorithm doesn't penalize repost after 21+ days

### Week 4 — Per-platform image aspect ratios
- Refactor `/api/social-card/[theme]` route to accept `?ratio=1200x627` / `?ratio=1080x1080` / `?ratio=1080x1350`
- Layout reflow needed (current design is 1080×1080 only)
- Estimate: 3-4 hours dev

### Ongoing — Engagement loop
- Daily routine (above) continues forever
- After 50 followers, ramp commenting to 45 min/day
- After 200 followers, add 1 native video/week
- After 500 followers, test LinkedIn ad amplification on top organic post
