# GetMeFound Website (`mje-gmf/website`)

The marketing site for **GetMeFound** - AI search visibility and local presence services for small businesses. Primary domain: [getmefound.ai](https://getmefound.ai).

> **Developer orientation**
> 1. Read this README for repo setup and deploy notes.
> 2. Read `PRODUCT.md` for current positioning.
> 3. Read `DESIGN.md` before changing visual patterns.
> 4. This repo uses a newer Next.js release. Before code changes, read the relevant guide in `node_modules/next/dist/docs/`.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router |
| UI | React |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Hosting | Vercel |
| Repo host | GitHub `mje-gmf/website` |
| Package manager | npm |

## Local Development

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Linting:

```bash
npm run lint
```

## Lead Capture Routes

- `/api/report` handles homepage free report requests.
- `/api/contact` handles contact form submissions.
- `/api/newsletter` handles newsletter submissions.

Current webhook env names still include legacy `GHL_*` labels because the migration off HighLevel is in progress. Do not add new GHL-dependent behavior unless Mike explicitly asks for it.

Common envs:

- `TURNSTILE_SECRET_KEY`
- `GHL_WEBSITE_REPORT_WEBHOOK_URL`
- `GHL_CAMPAIGN_REPORT_WEBHOOK_URL`
- `GHL_CONTACT_WEBHOOK_URL`
- `GHL_NEWSLETTER_WEBHOOK_URL`
- `GHL_WEBHOOK_URL`
- `REPORT_LINK_SECRET`
- `REPORT_TEST_BYPASS_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Public Routes

Top-level routes include `/`, `/about`, `/pricing`, `/contact`, `/faq`, `/privacy`, and `/terms`.

The public shell carries the GetMeFound brand. Some archived logs and compatibility helpers may still contain old AOH names where changing them would break a historical reference or a live bridge.

## Deploy

The previous Vercel project was tied to the old AOH deployment. Treat GetMeFound as a new production deploy target and verify the Vercel project/domain before promoting anything to production.

## Hard Rules

- Do not enable or toggle any HighLevel AI features without explicit manual authorization from Mike.
- Do not invent testimonials, logos, case studies, or client counts.
- Avoid vendor names in customer-facing copy unless the page is specifically about setup or integrations.
- Keep AI visibility positioning durable: reviews, listings, schema, local proof, citations, and conversion paths matter even if individual AI search products change.
