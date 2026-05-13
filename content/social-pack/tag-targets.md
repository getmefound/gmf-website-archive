# Tag Targets — Week 1 Posts

Strategic accounts to tag (@mention) in either the post body or the first comment to bait reach + engagement. Goal: get the tagged account's followers to see your post in their feed.

## Why tagging matters

- LinkedIn surfaces tagged-account activity to the tagged account's network
- Tagging a competitor (Birdeye, Podium) = their critics may engage
- Tagging an industry org = their members may see it
- Tagging a thought leader = their followers may see it
- Rule: don't tag more than 3-5 accounts per post — looks spammy

## Where to add tags

- **LinkedIn:** in the first comment alongside the link, NOT in post body (LinkedIn algorithm flags posts with too many tags as spam)
- **Facebook:** in the post body, end of post: "—via @Acme Plumbing"
- **Instagram:** in caption, after hashtags

## Per-post targets

### Post 1 — AI recommendation vs Google rank
- **@OpenAI** — they care when their product is named as the future of search
- **@Anthropic** — same
- **@Perplexity AI** — they're hungry for the "AI replaces Google" narrative
- **@Local Search Forum** (LinkedIn group)
- **Comment text suggestion:** "Curious if @OpenAI or @Anthropic teams see local-services adoption faster than other verticals — math is starting to look real."

### Post 2 — After-hours payback
- **@Service Titan** — HVAC/plumbing software, their audience IS our audience
- **@Housecall Pro** — same
- **@CallRail** — call tracking software, complementary not competitive
- **@RingCentral** — phone systems, our audience uses them
- **Comment text suggestion:** "If anyone at @Service Titan or @Housecall Pro has after-hours call data from their customer base — would love to see the real numbers vs the 60-70% voicemail rate I'm using."

### Post 3 — AI search share (1 in 4)
- **@OpenAI**
- **@Google for Small Business** (LinkedIn page)
- **@Search Engine Journal**
- **@Search Engine Land**
- **Comment text suggestion:** "The @Google AI Overview is doing more lift here than ChatGPT in raw volume. But ChatGPT's recommendation is the higher-intent signal. Both matter."

### Post 4 — Med spa math
- **@Aesthetic Record** — med spa software
- **@Boulevard** — med spa scheduling
- **@The Aesthetic Society** — industry org
- **@American Med Spa Association**
- **Comment text suggestion:** "Med spa LTV is wildly underrated in most local-marketing math. One review = compounding bookings. @American Med Spa Association — anyone tracking review-velocity correlation to booking rate?"

### Post 5 — DIY vs DFY
- **@Birdeye** — DIY review software (our competitor)
- **@Podium** — same
- **@Yotpo** — same
- **@NiceJob** — DIY review tool
- **Comment text suggestion:** "Genuinely curious if @Birdeye or @Podium have stats on what % of customers actually run their software 6+ months in. Industry would be better served if those numbers were public."

### Post 6 — 90-day rule
- **@Google for Small Business**
- **@BrightLocal** — local SEO tool
- **@Whitespark** — local SEO consultancy
- **@Sterling Sky** (Joy Hawkins, local SEO authority)
- **Comment text suggestion:** "@Joy Hawkins / @Sterling Sky — your 2024 rank study on recency weighting was the cleanest data I've seen. Recency window holding at ~90 days in your testing?"

### Post 7 — Groomer trust
- **@PetSmart Grooming** — they hire groomers, follow industry chatter
- **@International Society of Canine Cosmetologists**
- **@National Dog Groomers Association of America**
- **@Gingr** — pet business software
- **Comment text suggestion:** "Pickup-ask conversion data is wild — 30-50% vs 5-10% delayed. @Gingr / @PetExec — if either of your platforms surface this in the booking flow, that's the lever."

### Post 8 — Reviews compound
- **@American Dental Association**
- **@Dentaltown**
- **@Henry Schein** (dental supplier, huge audience)
- **@Patterson Dental**
- **Comment text suggestion:** "Patient LTV in dental is the most under-leveraged number in the industry. @Dentaltown — has there been a recent study on review-driven new-patient acquisition cost vs paid ads?"

## How to tag in GHL Social Planner

GHL's CSV/API don't natively support tagging — you have to enter `@AccountName` in the body and GHL's connected platforms convert it to a real tag on publish. Caveats:
- LinkedIn personal: works if you type `@` and GHL's editor resolves the name
- LinkedIn company: works in the body but NOT the API directly — manual entry after schedule
- Facebook: works in body via `@PageName`
- Instagram: only @-mentions to accounts that have tagged you back (Instagram limitation)

**Recommended approach for tags in week 1:**
1. Posts auto-schedule via `node scripts/ghl-schedule-posts.mjs --commit` (no tags in body)
2. After posts publish, manually edit each LinkedIn post to add tags in the first comment
3. ~30 sec per post × 8 posts = 4 min total of manual work for week 1
4. Document tag list in GHL post notes so it's not forgotten

For week 2+, build a follow-up script that uses LinkedIn API directly to add tagged comments. Requires Mike to OAuth-grant LinkedIn API access (separate from GHL).
