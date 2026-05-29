@AGENTS.md

## Design & Messaging Rules (from Mike)

- **Always research before making design decisions.** Never guess on colors, layouts, spacing, or animations. Search for expert best practices first — every time. If unsure, research it. Don't ask Mike for design opinions; he expects you to bring expert-backed recommendations.
- **Target market:** Any local business owner who relies on Google to bring in customers. Exclude highly saturated, commoditized trades (HVAC, plumbing, roofing, etc.) — not because they can't use the product, but because they're oversaturated with marketing offers and harder to reach. Use deep grounded tones (blues, dark greens, slate) that communicate trust. Never use bright/playful colors.
- **Color palette:** The site uses dark navy/green (#1a2332, #162420) and cream/light backgrounds. Accent is muted green. Stick to this palette.
- **Section heights:** Keep sections compact. Use py-8 to py-12 on mobile, md:py-12 to md:py-16 on desktop. Never use py-20+ unless it's the hero.
- **Alternating backgrounds:** Sections should alternate dark/light for visual rhythm.
- **Responsive:** Always design mobile-first. All grids collapse on mobile. Test all breakpoints.
- **Don't ask for opinions on design/marketing.** Research what experts recommend and implement it. Mike is not a designer or marketer — that's your job.
- **PowerShell terminal:** Mike uses Windows PowerShell. Use `;` not `&&` to chain commands. Or give commands on separate lines.
- **Deploy flow:** Always include `vercel --prod` in deploy instructions. Git push alone doesn't reliably trigger Vercel builds.

## Messaging Strategy (May 2026)

The entire site messaging was rebuilt around Google I/O 2026 (announced May 19, 2026). The core angle:

- **Core message:** "Google doesn't rank local businesses anymore. It picks one. If your profile isn't ready, AI skips you."
- **The urgency is real:** AI Mode has 1B+ monthly users, queries doubling every quarter. The search box itself was replaced with AI. This happened 8 days before the messaging rewrite.
- **The opportunity angle:** The old system (10 blue links, pages) was locked by SEO spend. The new system (AI recommends 1-2 businesses) rewards completeness, not budget. Businesses that act first get picked before competitors adapt.
- **Target buyer:** Local business owners who've passively gotten customers from Google for years and now face the ground shifting. NOT marketing-savvy people. NOT oversaturated trades (HVAC, plumbing, roofing).
- **No clients yet:** The site must do ALL the selling. No testimonials, no referral trust. Every word earns credibility from scratch.
- **GetMeFound = "get found":** The word "found" should appear in key messaging. The brand name IS the value prop.

## Homepage Structure (7 sections)

The homepage was restructured from 14 sections to 7:
1. **Hero** (dark) — "Google doesn't rank you anymore. It picks you — or it doesn't." + red alert banner "May 2026 — Google replaced Search with AI"
2. **Sample Report** (light) — Before/after product demo. Currently shows lawn care — NEEDS TO BE CHANGED TO DENTIST.
3. **How It Works** (light) — 3 horizontal cards with dark backgrounds, colored accents. Steps: "We check what AI sees" → "We fix what's invisible" → "You see the difference" (with 12%→89% animated counter)
4. **Visibility Check** (dark) — Carousel showing what Google & AI check. Strong section, keep as-is.
5. **Pricing** (dark) — Get Found $149, Stay Found $99/mo, Always Ready $299/mo. Bullets rewritten to outcomes not features.
6. **FAQ** (light) — Objection handling. Needs copy update to match new messaging.
7. **Final CTA** (light) — "Your competitor is being recommended. Fix that today."

Sections that were REMOVED from homepage: stats row, trust cards, game changed, cost comparison (moved to pricing page), revenue calculator (has own /calculator page), social proof stats, extra footer CTA.

## Completed (Session 2 — May 2026)

- ✅ **Sample report changed to dental practice** — Now shows "Lakeside Family Dentistry, Hartford CT · General Dentistry". Score card copy updated ("new patients", "competing practices").
- ✅ **FAQ copy updated** — Removed "You give us access, we handle everything." Q1 now uses "Google picks" language and ends with "Everything is done within 48 hours."
- ✅ **Final CTA updated** — Headline is now "One business gets recommended in your area. / Make sure it's yours." (was the old hero line about "your competitor").
- ✅ **CostCompare reworked for dentist buyers** — Replaced Birdeye/Yext/BrightLocal with Podium/Weave (tools dentists know) and generic descriptions. Footnote and callout updated to match.
- ✅ **Visibility Check** — Already well-aligned with new messaging. No changes needed.
- ✅ **Pricing page** — Hero, product sections, and Always Ready are already updated. No further changes needed.

## Completed (Session 3 — May 2026)

- ✅ **Calendly link** — Set to `https://calendly.com/mike-getmefound/30min` in `app/calculator/page.tsx`, `app/contact/page.tsx`, and `app/about/page.tsx`.
- ✅ **About page Book a Call** — Added "Book a call →" link under Mike's photo (alongside LinkedIn) and as a third button in the §05 CTA section.
- ✅ **Partners nav link** — Added "Partners" to desktop and mobile navbar (after "About").
- ✅ **Partner program built** — Full referral system:
  - `app/partners/page.tsx` — Public-facing partner page. Hero: "One referral a day. $1,500 a month." Sections: What your referral gets (4 cards with SVG icons), How it works (4 steps), Who it's for (6 dark cards with SVG icons + color tags), Ready-to-use copy (2 blurbs), Commission math (side-by-side table, highlighted 1/day row), Application form.
  - `app/api/partners/route.ts` — POST handler. Honeypot spam filter, email validation, rate limiting. Creates `agent_tasks` row in Supabase (`kind: "partner_application"`, `status: "new"`), sends applicant confirmation email, notifies mike@getmefound.ai internally.
  - `app/ref/[code]/page.tsx` — Referral landing page (dark, no nav, noindex). Checkout URL passes `ref=PARTNERCODE` + UTM params for tracking.
  - `docs/GMF_PARTNER_PROGRAM.md` — Agent operating guide for OpenClaw agents. Full approval criteria (auto-approve / flag / decline), email templates, partner code format, task update contract.
- ✅ **Partner page design** — All sections dark navy. No emoji — replaced with clean 16px stroke SVG icons. Commission copy says "weekly" (not monthly). Dropdowns use explicit `backgroundColor: "#0f1a24"` to fix Windows browser white-background issue.
- ✅ **Commission structure** — $50 per Get Found ($149) conversion. Paid weekly. No cap, no minimum. Highlighted row: 1 referral/day = $1,500/mo = $18,000/yr.
- ✅ **Who we want as partners** — Content creators & influencers (top), podcast hosts, bookkeepers, virtual assistants, business coaches, newsletter writers. Web designers intentionally excluded (compete on services). HVAC/plumbing/roofing not targeted.

## Technical Notes

- **CSS vars in JSX** — Never use `border-[var(--color-x)]` or `bg-[var(--color-x)]` in Tailwind className strings — causes TypeScript "Unterminated string literal" JSX parser errors. Always use `style={{ borderColor: "var(--color-x)" }}` instead.
- **Write/Edit tool truncation** — The file tools truncate large files. For files >400 lines or with long lines, use `bash` with a Python heredoc or `cat` to write. Never use the Write tool on the partners page — use Python script.
- **Select dropdown background on Windows** — Native `<select>` ignores Tailwind bg utilities on Windows. Always add `style={{ backgroundColor: "#0f1a24" }}` explicitly to select elements in dark sections.
- **Pre-existing TS errors** — `app/api/motto-banner/`, `app/api/team-banner/`, and `app/calculator/page.tsx` have pre-existing TypeScript errors (invalid characters). These do not block Vercel builds and are not from our changes.

## Remaining Work

### Optional future improvements
- **Industry dropdown cleanup** — Remove plumbing, HVAC, roofer (excluded target market). Add dental, chiro, salon, therapist, accountant, realestate, legalfirm. Curate to ~15 best options for mobile UX. No category/subcategory needed.
- **VisibilityCheck section heading** — Currently "What Google & AI check". Could be made more specific to the "picks, not ranks" angle, but current copy is functional.
- **Spanish page (app/es/)** — Homepage, pricing, and FAQ may still use old messaging. Low priority unless Spanish traffic matters.
- **Blog posts** — Existing posts may predate the May 2026 messaging shift. Worth a content audit before running ads.
- **Calculator page** — Pending audit (pre-existing TS errors). Low priority.
- **Partner payout method** — No PayPal account set up yet. Commission copy says "sent directly to you each week" — need to decide on actual payout method (bank transfer, Venmo, etc.) before first partner earns.
