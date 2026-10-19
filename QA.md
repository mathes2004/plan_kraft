# Acceptance record

Date: 19 October 2026 · Environment: local Windows / Node.js 24.22.0 / Next.js 16.4.2 / installed Microsoft Edge via Playwright.
Status: tested local implementation preview; production inputs and live acceptance remain pending.

| Check                                | Result                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Clean installation from lockfile     | `npm.cmd ci` passed                                                                                                                      |
| Production build                     | `npm.cmd run build` passed; all seven pages rendered, quote API remains server-side                                                      |
| TypeScript / lint                    | Both passed                                                                                                                              |
| Unit / mocked integration tests      | 33 passed across three files; no live emails sent                                                                                        |
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
| User-selected reference logo | Installed in header/footer; production build and 360/1440px logo checks passed |
| Real gallery/lightbox                | Code implemented; filters/empty states checked; approved photographs and populated-gallery QA pending                                    |
| Genuine comparison                   | Pointer capture/cancellation, native keyboard range and touch handling implemented; real paired photos and interaction QA pending        |
| Map                                  | Address-search embed and external fallback provided; precise entrance pin pending                                                        |
| 200% zoom / full keyboard / contrast | Comprehensive manual verification pending; no accessibility compliance claim                                                             |
| Physical devices / Safari / Firefox  | Not tested; mobile browser profile is emulation                                                                                          |
| Live email receipt                   | Not tested; authenticated sender, Redis, hosting and recipient receipt confirmation required                                             |
| Performance / Core Web Vitals        | Not measured                                                                                                                             |
| Domain / HTTPS / rollback            | Not configured or tested                                                                                                                 |

Screenshots are generated by the responsive test under `test-results/previews/`. These test artifacts are ignored by Git and refreshed by each run. A device-specific menu test is intentionally skipped on desktop; the responsive matrix runs once on desktop with explicit viewport sizes and is skipped in the separate mobile project.

## Dependency audit

Production-only `npm audit --omit=dev` returned zero vulnerabilities. Full audit reported five high-severity development-tool findings through the Next.js ESLint plugin → fast-glob → micromatch → braces chain. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version. Do not run the suggested forced downgrade of the current Next lint configuration without compatibility review. The application does not use visitor input in lint glob patterns. Review this advisory when updating tooling; ESLint 9 also reports a deprecation warning, while the installed React lint plugin declares ESLint 9 peer compatibility.

Production handover requires approved project imagery, populated gallery/comparison QA, production hosting/provider configuration and confirmed mailbox receipt. A mocked test or provider acceptance response does not establish actual email delivery. Record the real receipt date, environment and outcome here without customer information.
