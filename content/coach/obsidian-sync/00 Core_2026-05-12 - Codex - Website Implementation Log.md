# 2026-05-12 — Website Implementation Log (Codex)

## Scope completed

### Navigation + routing
- Removed `Contact` from top navbar (desktop + mobile).
- Renamed `Resources` to `Blog` and aligned links to `/blog`.
- Footer company link changed from `Pricing` to `What We Do`.
- Footer services links aligned to active pricing anchors.

### Pricing + CTA behavior
- Reordered pricing blocks to:
  1. Review Automation
  2. AI Visibility
  3. Reach
  4. Relay
  5. Studio
  6. Whole Stack
- Enforced alternating section backgrounds by render order (light/dark/light/dark), so reordering no longer breaks visual rhythm.
- Updated pricing card behavior:
  - Primary `Start ...` links go directly to GHL checkout/booking URLs.
  - Secondary `Book a Call` links set explicitly to booking URL for all products.
- Replaced leftover internal `/checkout/...` references inside StackBuilder with direct live checkout/booking links.

### Copy updates (pricing)
- Rewrote multiple technical/jargon bullets in AI Visibility to owner-facing language.
- Updated Reach rollout language:
  - Removed confusing `ICP` shorthand from UI title.
  - Replaced “voice training” wording.
  - Changed launch timing language to 3 business days after client intake/approvals.
- Replaced `GBP` shorthand in customer-facing areas with “Google profile / Google Business Profile” phrasing.

### About image + nav/footer consistency
- Updated about-page image wiring to the intended cropped profile source in the page flow.
- Fixed footer links to active destinations only.
- Changed FAQ link behavior to homepage section anchor (`/#faq`) and removed orphan `/faq` from sitemap exposure.

### Forms + capture flow
- Wired `/api/newsletter` to GHL webhook pattern.
- Documented lead-capture env mapping in README:
  - `GHL_WEBHOOK_URL`
  - optional `GHL_CONTACT_WEBHOOK_URL`
  - optional `GHL_NEWSLETTER_WEBHOOK_URL`
  - `TURNSTILE_SECRET_KEY`

### Internationalization rollout (EN default + ES paths)
- Added EN/ES switcher in navbar (desktop + mobile).
- English kept as default route behavior.
- Added Spanish route paths:
  - `/es`
  - `/es/about`
  - `/es/pricing`
  - `/es/blog`
  - `/es/contact`
  - `/es/privacy`
  - `/es/terms`
- Made navbar/footer locale-aware so `/es/...` pages keep users inside `/es/...` links.
- Added `/es/...` entries to sitemap.
- Final state per owner request: Spanish pages mirror English layout/structure exactly (visual parity preserved).

## Important decisions captured
- Rule adopted: if a page is not reachable through main navigation strategy, do not expose it as a primary link destination.
- Rule adopted: customer-facing copy should avoid internal shorthand and technical labels unless explained plainly.
- Rule adopted: for pricing, direct checkout/booking destinations preferred over intermediate checkout content pages.

## Open follow-ups (not blockers)
- If true Spanish copy is desired later, translate *within* existing English component structure (do not replace with simplified layouts).
- Optional: add hreflang alternates per page-level metadata strategy if SEO localization depth is increased.
