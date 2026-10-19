# PLAN KRAFT — Waterproofing Solutions

Seven-page business website built with Next.js App Router, TypeScript and React. Includes ten services, twelve completed projects with local photo galleries, a real-photo comparison slider, an interactive homepage house animation, an eight-stage work process and a quote form.

## Run locally

Use Node.js 24 and npm from this folder:

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:3000. The active Forminit form needs no API keys. Do not overwrite an existing `.env.local` containing your own settings. On systems that allow npm's PowerShell script, `npm` also works.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e -- --workers=2
```

Browser tests use installed Microsoft Edge on Windows. Adjust the Playwright channel for another system. Build before testing against the production server; Playwright can also reuse an existing local server.

## Forminit quote emails

The active form uses the documented [Forminit submission endpoint](https://forminit.com/docs/submit-form-api/) in Public mode. Form ID: **nilov0qnww9**. The public ID and expected notification recipient are recorded in `src/data/quote-config.ts`. The optional `NEXT_PUBLIC_FORMINIT_FORM_ID` environment variable overrides the public ID; GitHub Pages can obtain this from the repository variable `FORMINIT_FORM_ID`. No private API key, SDK, application server, Redis database or paid subscription is needed for this integration.

[Forminit's Free plan](https://forminit.com/pricing/) includes one form, email notifications and **100 submissions per month**. Public forms accept at most one request per five seconds per IP address. When the monthly allowance is exhausted, Forminit pauses new submissions; the website keeps entered details and offers phone/WhatsApp contact.

### Gmail notification workflow

The website's expected notification recipient is **Plankraftwaterproofing@gmail.com**, shared by the public contact details and the optional server endpoint through `src/data/quote-config.ts`. Forminit routes notifications through its dashboard workflow; the website cannot choose or verify that recipient by adding a field to the submission. Changing the recipient requires updating the workflow's To field and publishing it; changing this project reference alone cannot redirect delivery.

To configure or review it:

1. Open form **nilov0qnww9** in the [Forminit dashboard](https://app.forminit.com/).
2. In Form Settings, choose **Public** authentication.
3. Under **Workflow**, connect **Submission received** directly to **Send email notification**. Set **To** to **Plankraftwaterproofing@gmail.com**, remove any previous recipients from To/Cc/Bcc, and choose **Publish**.
4. Keep the default sender `notifications@forminit.com`; custom SMTP is unnecessary. A useful subject is `PLAN KRAFT enquiry {{@submission_id}}`. Use the default answers template, or include all answers in the email body. The form collects a phone number rather than a customer email, so do not use an absent `sender.email` as Reply-to.
5. If Authorized Domains are enabled, add `mathes2004.github.io`. Add `localhost` and `127.0.0.1` only for local submissions. Enter hostnames without protocol, path or port; an unlisted referrer may be treated as spam and skip notification actions.
6. Submit an enquiry from the deployed website, check its submission/workflow logs in Forminit and confirm actual Gmail receipt, including Spam. Submission acceptance does not establish mailbox delivery.

See [email notifications](https://forminit.com/docs/email-notifications/), [workflows](https://forminit.com/docs/workflow/) and [authorized domains](https://forminit.com/docs/authorized-domains/). If a submission is classified as spam, restoring it to Inbox does not automatically run the workflow; use the dashboard's Run workflow action where appropriate.

### Request and response behavior

The required District / project location dropdown lists all 25 Sri Lankan districts alphabetically from `src/data/districts.ts`. Its selected value is validated against the shared list and sent in `fi-text-projectDistrict`. The previous `location` block name was rejected by Forminit with `FI_FIELD_NAME_CONFLICT`; the distinct project-district name has been verified against the live endpoint. It starts and resets with an empty ?Choose a district? placeholder. Custom email templates must include `{{text.projectDistrict}}`; the default answers template includes the visible project-district block automatically.

`src/lib/quote-delivery.ts` maps the existing fields to documented Forminit names: `fi-sender-fullName`, `fi-sender-phone`, `fi-text-projectDistrict`, `fi-text-service`, `fi-text-message`, `fi-text-reference` and `fi-url-source`. The hidden honeypot is `_gotcha`. Browser fetch submits URL-encoded fields to `https://forminit.com/f/nilov0qnww9` with `Accept: application/json`; Forminit explicitly supports this content type. Private keys are never sent from the client.

The client validates fields, normalizes Sri Lankan mobile numbers and prevents simultaneous submissions. It shows acceptance only for a successful HTTP response containing `success: true` and a submission ID. Rate limits, disabled/missing forms, exhausted quotas, malformed responses and network failures preserve entered details. The visitor stays on the website after acceptance; remote redirect URLs are not followed. Tracking references do not guarantee deduplication after uncertain responses. No enquiry contents are logged by this application.

Forminit stores submissions in its dashboard. Its default retention and available controls are described in the [retention documentation](https://forminit.com/docs/submission-retention/). Review the service settings when managing customer enquiries.

### Optional legacy server endpoint

`/api/quote` and `src/lib/server/quote.ts` remain available only in a normal Next.js server build. The current form does not call them. Their Resend/Redis/Turnstile environment settings in `.env.example` are optional legacy configuration, unrelated to Forminit. The Pages build excludes this server code. Never commit credentials.

## GitHub Pages preview

Target repository: https://github.com/mathes2004/plan_kraft. Put the application files at the repository root, including `package.json`, `src/`, `public/`, `scripts/` and `.github/`.

```powershell
npm.cmd run build:pages
npm.cmd run preview:pages
```

Open http://127.0.0.1:4173/plan_kraft/. The build creates `.pages-preview/out`; it includes local images, fonts, banner, seven routes, sitemap and 404 page. It uses `/plan_kraft` as the base path, disables indexing for client review and enables the same free quote form. No local API server is needed. Normal `npm.cmd run build` remains a separate server build.

`scripts/build-pages.mjs` builds from a dedicated staging folder without copying `.env.local` or server handlers. It also creates static segment-payload aliases required by the installed Next.js export so navigation can work without rewrite rules. `npm.cmd run test:pages -- --workers=2` checks direct routes, client navigation, images, the banner, mocked quote submission and 404 handling in desktop/mobile profiles.

To publish, push the application to the target repository's `main` branch and choose **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` builds and deploys automatically. An authorized repository owner must enable Pages and grant write access before this workspace can publish.

Published client preview: **https://mathes2004.github.io/plan_kraft/**. GitHub Pages is enabled with GitHub Actions, and the first deployment succeeded. Check the repository's Actions tab for each subsequent deployment outcome. The GitHub connector and local Git can have different account permissions. Automatic sync uses local Git and Windows Git Credential Manager.

`GITHUB_REPOSITORY` determines the build's default repository path. `PAGES_BASE_PATH` and `PAGES_SITE_ORIGIN` can override it; the workflow obtains these from GitHub Pages. For a normal server deployment, set `NEXT_PUBLIC_SITE_URL` to the actual origin and leave `SITE_INDEXABLE=false` until final approval. Preview robots directives are not access controls.

## Automatic GitHub updates on this computer

The Windows startup task **PlanKraft-GitHub-AutoSync** runs `scripts/auto-sync.mjs` for the signed-in user. After saved files have been unchanged for 30 seconds, the runner commits them and pushes to **origin/main**, which must point to **mathes2004/plan_kraft**. Unsaved editor buffers are not included. Git is discovered automatically, including installations under `C:\Program Files (x86)\Git`. Your existing Windows Git Credential Manager sign-in is used; no token is written into the project.

```powershell
npm.cmd run sync:install    # Install/restart the Windows logon task
npm.cmd run sync:check      # Check local repository configuration without pushing
npm.cmd run sync:now        # Commit and push saved changes immediately
npm.cmd run sync:pause      # Pause now and across future Windows sign-ins
npm.cmd run sync:resume     # Resume in this terminal (keep it open)
npm.cmd run sync:uninstall  # Pause and remove the Windows startup task
```

`sync:install` clears a pause and starts the hidden watcher again. `sync:watch` runs it in a terminal without installing anything. The startup task works while this Windows user is signed in, even with VS Code closed. Internet access and GitHub write access are required. Offline/push failures retry after a minute. A paused watcher stops within ten seconds. Only one sync process can run per project.

Status and logs are stored in the ignored `.auto-sync/` folder: `status.json`, `watcher.stdout.log` and `watcher.stderr.log`. VS Code's **Tasks: Run Task** menu also includes immediate sync and pause commands when opening this application folder. If you move the folder, uninstall the task first and install it again from the new location.

The watcher respects `.gitignore`; private `.env` files, key files, dependencies, generated builds and logs remain local. It also refuses tracked private/generated paths and outgoing commits containing them. It pauses on another branch, an in-progress Git operation, or newer commits on GitHub. Resolve those conditions manually, and it will retry. It never force-pushes, automatically merges, rebases, stashes or resets work. A failed push keeps its local commit for retry.

Each sync publishes the saved source state, including unfinished edits. The watcher does not run the application test/build suite before every commit. The Pages workflow separately builds pushed revisions; a failed build leaves the previous deployed preview in place. Keep passwords and other credentials out of source files, including `.env.example`.

Implementation references: [Git status](https://git-scm.com/docs/git-status), [Git push](https://git-scm.com/docs/git-push).

## Content and images

Routes: `/`, `/services`, `/about`, `/projects`, `/work-process`, `/contact`, `/request-quote`.

- Company facts and contact links: `src/data/company.ts`.
- Ten services and shared image mappings: `src/data/services.ts`.
- Completed projects and comparison pair: `src/data/projects.ts`.
- Work process stages: `src/data/process.ts`.
- Styling and responsive layouts: `src/app/globals.css`.
- Asset source register: `ASSETS.md` and `src/assets/README.md`.

Copy every future user-supplied image into `src/assets/`, preserve its original contents and reference it through a static import. Never reference a Windows path or `/src/assets/...` as a browser URL. Add its source, dimensions and intended use to `ASSETS.md`. Service images are shared between the Services page and corresponding homepage previews.

The twelve projects (335, 333, 318, 316, 314, 310, 331, 323, 313, 306, 302 and 299) use thirty-two supplied photographs with category filters, captions, accessible galleries and project-specific enquiry links. Descriptions omit client identities and street addresses. Warranty details retain the terms note. Only records with genuine approved photographs marked as published render; up to three can be featured on the homepage. Keep all existing and future project images in `src/assets/projects/<project-number>/` and import them through `src/data/projects.ts`.

The homepage comparison uses the supplied exterior photos from different viewpoints of the same project. The divider starts at 50%; moving right reveals more BEFORE and moving left reveals more AFTER. Mouse, touch, keyboard and reduced motion are supported.

The homepage uses the selected reference site's Three.js house animation inside `public/banner/`, with local renderer, dependencies, fonts and licenses. Its rain, before/after, rotation and protective-layer controls need WebGL; an illustration fallback is available. The work-process model is a separate CSS scene. Fonts are hosted locally through Fontsource. The header and footer share the user's unchanged original logo from `src/assets/brand/plan-kraft-logo.jpg`; the browser icon embeds the same image.

## Handover

After deployment, check direct-route reloads, mobile navigation, telephone/WhatsApp links, photo galleries, comparison controls and actual quote email receipt. Record confirmed live receipt in `QA.md`. Local mocked tests do not establish real delivery. Physical devices, Safari/Firefox, full accessibility review and performance measurement remain separate acceptance work.

Retain the last known-good deployment and source commit for rollback. Review dependency updates deliberately and rerun relevant checks. The older Vite files are retained but are not used by Next.js.
