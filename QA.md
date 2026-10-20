# Acceptance record

Date: 19 October 2026 · Environment: local Windows / Node.js 24.22.0 / Next.js 16.4.2 / installed Microsoft Edge via Playwright.
Status: tested local implementation preview; production inputs and live acceptance remain pending.

## Forminit migration

The former FormSubmit integration has been removed from the active form. Quote submissions now use Public-mode Forminit form **wi49nocyvbs**. This client-provided replacement form must use Public authentication and a published Send email notification workflow addressed only to **Plankraftwaterproofing@gmail.com**, with Cc/Bcc empty. The client confirmed those private settings are configured and published; actual mailbox receipt remains a separate verification. The website cannot enforce recipients through submitted fields. No private Forminit API key is exposed or required.

- The complete documentation index was retrieved (50 guide/reference pages), with implementation based on the submission API, block naming, Next.js/React, SDK, honeypot, notifications, workflows, redirections, authorized domains and retention guidance. This static site uses the documented URL-encoded REST interface directly.
- Both normal Next.js and GitHub Pages production builds passed. All seven primary routes remain available.
- Four new unit tests passed for field mapping, normalized sender phone, endpoint configuration, honeypot validation, strict submission acknowledgement and provider error handling.
- Twenty desktop/mobile browser tests passed: ten focused quote tests, eight static-export checks and two broader quote-feedback checks. The two test-owned web servers needed explicit shutdown after assertions completed; all commands then exited successfully. Browser mocks use Forminit's actual response structure. HTTPS requests are blocked by default in the focused form tests unless explicitly handled by a test mock.
- The previous browser run initially used an older production build; it was stopped, the normal build was refreshed and tests were rerun against the new integration.
- The form keeps entered details on network failures, malformed or rejected responses, rate limits and unavailable forms. A success response must contain a submission ID. Redirect URLs from the response are not followed.
- Free plan: one form, 100 submissions/month, email notifications. Public endpoint limit: one request per five seconds per IP. Notification delivery and the recipient are controlled by Forminit's published workflow.
- Actual Gmail receipt remains unverified. Provider acceptance and mocked tests do not establish mailbox delivery. Check Forminit workflow results and Gmail Inbox/Spam after a real submission.

## Previous broader acceptance record

The following records describe earlier checks. Server protection, HTML escaping and provider idempotency rows apply only to the retained legacy API, not the active Forminit delivery path. The active client prevents simultaneous sends but does not guarantee deduplication after uncertain responses.

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
| Live email receipt                   | Not tested; submit through Forminit and confirm mailbox receipt                                                                          |
| Performance / Core Web Vitals        | Not measured                                                                                                                             |
| Domain / HTTPS / rollback            | Not configured or tested                                                                                                                 |

Screenshots are generated by the responsive test under `test-results/previews/`. These test artifacts are ignored by Git and refreshed by each run. A device-specific menu test is intentionally skipped on desktop; the responsive matrix runs once on desktop with explicit viewport sizes and is skipped in the separate mobile project.

## Dependency audit

Production-only `npm audit --omit=dev` returned zero vulnerabilities. Full audit reported five high-severity development-tool findings through the Next.js ESLint plugin → fast-glob → micromatch → braces chain. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version. Do not run the suggested forced downgrade of the current Next lint configuration without compatibility review. The application does not use visitor input in lint glob patterns. Review this advisory when updating tooling; ESLint 9 also reports a deprecation warning, while the installed React lint plugin declares ESLint 9 peer compatibility.

Production handover requires deployment, the published Forminit notification workflow and confirmed mailbox receipt. Supplied project photographs are already integrated. A mocked test or provider acceptance response does not establish actual email delivery. Record the real receipt date, environment and outcome here without customer information.

## Automatic GitHub sync checks

The sync runner uses the installed Git for Windows and the local Windows Git Credential Manager account. Six integration tests passed against disposable local Git remotes: saved edits/additions/deletions, ignored private/generated files, refusing remote changes/other branches/destination changes/in-progress Git operations, retrying a failed push without a duplicate commit, deferring work changed during the idle period, and blocking secrets in outgoing history even after later removal. Lint, TypeScript, Node syntax and both PowerShell script syntax checks passed. These local tests do not claim a successful live GitHub push; inspect `.auto-sync/status.json`, Windows task `PlanKraft-GitHub-AutoSync` and GitHub history for the current operational state.
