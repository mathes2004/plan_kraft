# Acceptance record

Date: 19 October 2026 · Environment: local Windows / Node.js 24.22.0 / Next.js 16.4.2 / installed Microsoft Edge via Playwright.
Status: tested local implementation preview; production inputs and live acceptance remain pending.

## Free email form and Pages update

The active quote form now posts directly to FormSubmit for **mathesmathes20005@gmail.com**. It requires no paid subscription, Resend key, Redis database or server endpoint. The legacy server API remains separately tested but is not called by the form and is omitted from the static export.

- Normal production build and GitHub Pages static build passed.
- All 34 existing unit/legacy API tests passed.
- Ten focused desktop/mobile form tests passed: full field mapping and fixed recipient, required fields and honeypot, concurrent-submit guard, service rejection, HTTP errors, malformed responses, activation-pending feedback, network failure and retry. All external form responses were mocked.
- Eight desktop/mobile static export tests passed: all seven repository-prefixed routes, navigation and reloads, local gallery photos, local WebGL banner, enabled quote form with mocked delivery, sitemap/robots and 404 handling. Missing segment-payload paths from the installed Next.js export are materialized as aliases by the Pages build script.
- No live email, activation request or confirmed mailbox receipt was performed. An additional external documentation check was not executed because automatic approval review could not complete due to a session usage limit. Local tests continued without bypassing the review.
- Required live acceptance: deploy this version, submit a test, activate FormSubmit through the recipient's confirmation email (including Spam), then submit again and record actual receipt here. Provider acceptance alone is not proof of mailbox delivery.
- GitHub Pages deployment is prepared but not confirmed published. The connected GitHub account last checked had only read access to the target repository.

## Previous broader acceptance record

The following records describe earlier checks. Server protection, HTML escaping and provider idempotency rows apply only to the retained legacy API, not the active FormSubmit delivery path. The active client prevents simultaneous sends but does not guarantee deduplication after uncertain responses.

| Check                                | Result                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Clean installation from lockfile     | `npm.cmd ci` passed                                                                                                                      |
| Production build                     | `npm.cmd run build` passed; all seven pages rendered, quote API remains server-side                                                      |
| TypeScript / lint                    | Both passed                                                                                                                              |
| Unit / mocked integration tests      | 34 passed across three files; no live emails sent                                                                                        |
| Browser acceptance                   | 30 passed, 2 intentional profile skips; report: `test-results/report.json`; desktop and iPhone-sized Edge                                |
| Seven routes                         | Direct loads, one H1, one footer and no browser runtime errors passed                                                                    |
| Home structure                       | Seven content sections plus single contact/footer passed; process model absent                                                           |
| Nine services / quote prefill        | Passed                                                                                                                                   |
| Mobile navigation                    | Toggle, Escape, focus restoration and hidden-menu state passed                                                                           |
| Phone / WhatsApp / fixed recipient   | Targets checked; phone normalization, recipient restriction and independent schema checks passed                                         |
| Server protections                   | Body-byte limit, origin, honeypot, rate limiting, storage failure, challenge/hostname rejection and provider failure mocked tests passed |
| Duplicate protection                 | Stable provider idempotency keys checked across retries; concurrent-submit guard implemented                                             |
| Email content                        | HTML escaping tested; plain-text alternative included; no PII logging                                                                    |
| Work process                         | Eight distinct stage states, boundaries, manual selection, replay and playback checked                                                   |
| Reduced motion / visibility          | Reduced-motion style checked; hidden-tab behavior simulated with visibilitychange and fake clock; progression pauses                     |
| Responsive matrix                    | All seven pages checked at 360, 390, 768, 1024 and 1440px after fonts settle; no horizontal overflow                                     |
| Visual review                        | Desktop Home and mobile process screenshots reviewed; hero label overlap, model sizing and 360px heading corrected                       |
| SEO infrastructure                   | Sitemap contains seven routes; preview robots blocks indexing; unknown route returns 404                                                 |
| User-selected reference logo         | Installed in header/footer; production build and 360/1440px logo checks passed                                                           |
| Real gallery/lightbox                | Code implemented; filters/empty states checked; approved photographs and populated-gallery QA pending                                    |
| Genuine comparison                   | Pointer capture/cancellation, native keyboard range and touch handling implemented; real paired photos and interaction QA pending        |
| Map                                  | Address-search embed and external fallback provided; precise entrance pin pending                                                        |
| 200% zoom / full keyboard / contrast | Comprehensive manual verification pending; no accessibility compliance claim                                                             |
| Physical devices / Safari / Firefox  | Not tested; mobile browser profile is emulation                                                                                          |
| Live email receipt                   | Not tested; deploy the FormSubmit form, activate the recipient and confirm mailbox receipt                                               |
| Performance / Core Web Vitals        | Not measured                                                                                                                             |
| Domain / HTTPS / rollback            | Not configured or tested                                                                                                                 |

Screenshots are generated by the responsive test under `test-results/previews/`. These test artifacts are ignored by Git and refreshed by each run. A device-specific menu test is intentionally skipped on desktop; the responsive matrix runs once on desktop with explicit viewport sizes and is skipped in the separate mobile project.

## Dependency audit

Production-only `npm audit --omit=dev` returned zero vulnerabilities. Full audit reported five high-severity development-tool findings through the Next.js ESLint plugin → fast-glob → micromatch → braces chain. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version. Do not run the suggested forced downgrade of the current Next lint configuration without compatibility review. The application does not use visitor input in lint glob patterns. Review this advisory when updating tooling; ESLint 9 also reports a deprecation warning, while the installed React lint plugin declares ESLint 9 peer compatibility.

Production handover requires deployment, FormSubmit recipient activation and confirmed mailbox receipt. Supplied project photographs are already integrated. A mocked test or provider acceptance response does not establish actual email delivery. Record the real receipt date, environment and outcome here without customer information.

## Automatic GitHub sync checks

The sync runner uses the installed Git for Windows and the local Windows Git Credential Manager account. Six integration tests passed against disposable local Git remotes: saved edits/additions/deletions, ignored private/generated files, refusing remote changes/other branches/destination changes/in-progress Git operations, retrying a failed push without a duplicate commit, deferring work changed during the idle period, and blocking secrets in outgoing history even after later removal. Lint, TypeScript, Node syntax and both PowerShell script syntax checks passed. These local tests do not claim a successful live GitHub push; inspect `.auto-sync/status.json`, Windows task `PlanKraft-GitHub-AutoSync` and GitHub history for the current operational state.
