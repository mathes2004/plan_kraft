# PLAN KRAFT — Next.js website

Seven-page, English-language business website built with Next.js App Router, TypeScript and React. Includes service-specific quote links, accessible mobile navigation, a dedicated eight-stage CSS 3D-style rooftop model, approved-photo gallery/lightbox, before/after component, and secure quotation API.

This is a local implementation preview. Genuine project photos and an exterior comparison pair have been supplied and integrated. Production acceptance still requires authenticated email setup, deployment and recorded real mailbox receipt. The supplied specification remains the authority. The older Vite files are retained but are not used by Next.js.

## Run locally

Use Node.js 24 LTS and npm. In this folder:

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:3000. On systems that allow npm's PowerShell script, `npm` also works. Use the workspace TypeScript version in VS Code. Dependency versions are recorded in the lockfile; use `npm ci` after the first installation.

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Browser tests use installed Microsoft Edge on Windows. For other systems, change `channel` in `playwright.config.ts` to your installed browser, or install Playwright Chromium and remove the channel. The tests start the production server; build first. Browser/device QA with real assets remains a deployment acceptance item.

## Routes and content

`/`, `/services`, `/about`, `/projects`, `/work-process`, `/contact`, `/request-quote` are the seven primary routes. `/api/quote` is the only submission endpoint. Sitemap, robots, error/loading and 404 infrastructure are included. Internal navigation uses `next/link` in the same tab. Home has seven content sections plus the single shared footer as section eight; it has no process preview.

- Verified company facts and contact URLs: `src/data/company.ts`.
- Nine services and allowed IDs: `src/data/services.ts`.
- Project records: `src/data/projects.ts`. Only published records containing approved genuine photographs render.
- Eight process stages: `src/data/process.ts`. No autoplay; manual selection pauses; hidden tabs stop progression. CSS reduced-motion disables transitions. No WebGL/GPU dependency.
- Colors, responsive layouts and scene layers: `src/app/globals.css`.
- Source/approval record: `ASSETS.md`.

The shared logo in `src/components/BrandLogo.tsx` copies the SVG paths, wordmark and colors from the user-selected reference at https://plan-kraft-roof-protection.socialrook16.chatgpt.site/. It appears in the header and footer. Add approved photos under `src/assets/projects/`; import them statically and record truthful alt text in the project data. Set `approved: true`, `kind: 'genuine-project'`, and `published: true` only after business approval. Set `featured: true` for up to three Home previews. The homepage comparison uses static imports of the user's original exterior photographs in `src/assets/before-after/`, registered as `homepageComparison` in `src/data/projects.ts`. The photographs show different viewpoints of the same project, as stated below the slider. The divider starts at 50%; moving right reveals more BEFORE, and moving left reveals more AFTER. Smooth transitions respect reduced motion, with mouse, touch and native keyboard range controls. The six completed projects (335, 333, 318, 316, 314 and 310) use seventeen original photos with stage captions, category filters, keyboard-accessible galleries and project-specific enquiry links. Their polished descriptions omit client identities and street addresses. Project-specific warranty details retain the terms note. No fake portfolio entries or fabricated transformations are shipped.

Typography uses locally hosted, licensed Manrope and DM Sans through Fontsource, with Arial fallback. Font license files are retained in their npm packages; no Google Fonts request is made by the browser. Contact and navigation remain usable if fonts or maps fail. The homepage banner uses the user-selected reference site's interactive Three.js house, with rain, before/after comparison, rotation and exploded protective layers. Its scene, renderer, dependency, font and licenses live in `public/banner/` and run in an isolated local iframe, with no CDN dependency. Animation pauses when hidden or outside the viewport and respects reduced motion; an SVG illustration remains available if WebGL or script loading fails. The About illustration is built in SVG, visibly labeled, and is not represented as customer work. The completed photograph from an approved featured rooftop project replaces the About illustration. All nine services use the user-selected images in `src/assets/services/`, with one shared mapping in `src/data/services.ts`; the homepage previews reuse the images for services 01-03. These service images are not automatically published as portfolio project records.

## Configure email and abuse controls

Set environment variables in `.env.local` or the host's secret settings. Never commit real credentials.

| Variable                                                 | Purpose                                                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                   | Exact origin, without a path; localhost for development, actual HTTPS origin for deployment   |
| `SITE_INDEXABLE`                                         | Default false; set true only for the final public website after QA                            |
| `RESEND_API_KEY`                                         | Server-side transactional mail key                                                            |
| `QUOTE_FROM_EMAIL`                                       | Sender on your verified sending domain, e.g. `PLAN KRAFT <quotes@your-domain>`                |
| `QUOTE_TO_EMAIL`                                         | Must equal `vinothvj1993@gmail.com`; fixed in code, cannot be chosen by visitors              |
| `RATE_LIMIT_REST_URL`, `RATE_LIMIT_REST_TOKEN`           | HTTPS Upstash-compatible Redis REST endpoint and token; required for all accepted submissions |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional matching pair; if enabled, server verifies token and hostname and fails closed       |

1. Verify a sending domain in Resend and configure its prescribed SPF/DKIM records. Do not use the recipient Gmail address as an unverified From identity.
2. Create an Upstash Redis database. Only short-lived hashed-IP counters are stored: 5 attempts per 15 minutes, atomic increment and 900-second expiry. No form content is stored in Redis.
3. Configure Turnstile for actual hostnames if using it. Rebuild after changing public origin/site key.
4. Deploy on Vercel. The handler trusts only Vercel's overwritten `x-vercel-forwarded-for` when `VERCEL=1`. For another host, adapt the trusted IP adapter to documented host behavior before enabling mail. Do not trust visitor-supplied generic `x-forwarded-for` headers. Non-Vercel production submissions fail closed. Local development uses a shared development rate key.
5. Submit a test with explicit permission to send it, confirm real receipt in `vinothvj1993@gmail.com` (including spam folder), and record the result in `QA.md`. Automated tests mock the provider and send no live mail.

The API checks JSON type, actual 16 KiB byte limit, configured origin, honeypot, independent Zod validation, configured shared rate limiter, optional challenge, then fixed-recipient email. HTML is escaped and a plain-text alternative is included. Provider timeouts/failures are reported honestly. No secrets or customer data are logged. Stable provider idempotency keys suppress retries of the same UUID and normalized content within the provider's retention window (Resend documents 24 hours); retries after that window are not guaranteed duplicate-free. The client preserves submission identity after uncertainty and blocks concurrent requests. A changed enquiry is a new attempt.

An `accepted` response means the provider accepted the message, not verified mailbox delivery. Missing credentials return 503 and preserve the form; WhatsApp/call remain available. No email webhook, customer uploads, dashboard or enquiry database is included. Keep operational logs free of names, phone numbers and descriptions; configure a short host log-retention policy (for example seven days).

## Deployment and maintenance

Deploy this folder as a normal Next.js Node application on Vercel, with `npm ci` and `npm run build`. Do not use static export: `/api/quote` needs a server. No hosting/domain purchase or public deployment has been performed.

Select a host and confirmed domain, configure all production values and rebuild. Configure exact DNS records provided by the host, HTTPS, a canonical apex/www origin and redirect the alternative. Protect previews with host access controls and keep `SITE_INDEXABLE=false`; robots directives do not provide access control. Set the public origin accurately for canonical URLs, sitemap, structured data and origin checking. Sitemap contains exactly seven primary routes. No unconfirmed custom domain is hardcoded.

After deployment, test every direct route and reload, both telephone links, WhatsApp, map, form failures, and real email receipt. Test desktop/mobile browsers, 200% zoom, reduced motion, real gallery/lightbox and real-photo comparison. Measure performance on a mobile profile before making performance claims. Follow `QA.md` for outstanding items.

For updates: edit the relevant data/component, run the checks above, deploy a preview and review before promotion. Preserve originals and approvals for media. Keep the last known-good host deployment and source commit; rollback by promoting that deployment, then verify routes and conversions. Take dependency updates deliberately, review changelogs and rerun tests. No new primary pages should be added without approval.

Implementation references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Resend send email](https://resend.com/docs/api-reference/emails/send-email), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
