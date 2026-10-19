# PLAN KRAFT — Waterproofing Solutions

Seven-page business website built with Next.js App Router, TypeScript and React. Includes nine services, six completed projects with local photo galleries, a real-photo comparison slider, an interactive homepage house animation, an eight-stage work process and a quote form.

## Run locally

Use Node.js 24 and npm from this folder:

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:3000. The email form needs no API keys. Do not overwrite an existing `.env.local` containing your own settings. On systems that allow npm's PowerShell script, `npm` also works.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e -- --workers=2
```

Browser tests use installed Microsoft Edge on Windows. Adjust the Playwright channel for another system. Build before testing against the production server; Playwright can also reuse an existing local server.

## Free quote emails

The form sends directly to [FormSubmit](https://formsubmit.co/) using its [AJAX endpoint](https://formsubmit.co/ajax-documentation). FormSubmit advertises a free service with no registration required. No paid subscription, Resend account, Redis database, private API key or application server is required for this form. It works with GitHub Pages.

Recipient: **mathesmathes20005@gmail.com**. The endpoint and readable email field mapping are centralized in `src/lib/quote-delivery.ts`; the form is in `src/components/QuoteForm.tsx`.

### Required one-time activation

1. Deploy the updated website and submit a test enquiry from its quote form.
2. Open **mathesmathes20005@gmail.com**, check Inbox and Spam, and open FormSubmit's confirmation email.
3. Click the activation link. Then submit another test enquiry and confirm the actual enquiry email arrives with name, phone number, location, selected service and project description.

Until activation, submissions may await confirmation. See [FormSubmit help](https://formsubmit.co/help). This workspace has not triggered an activation email or confirmed live mailbox receipt. Activation belongs to the recipient and cannot be completed by changing website code.

The client validates required fields, normalizes Sri Lankan mobile numbers, includes a hidden honeypot and prevents concurrent submissions. It sends a readable service name and a tracking reference. A reference is not a provider idempotency guarantee: retries after an uncertain response can create duplicate emails. Provider acceptance is not proof of inbox delivery. Failed, malformed or activation-pending responses preserve entered details; WhatsApp remains available. Automated tests mock the provider and send no emails.

FormSubmit processes submitted details for email delivery; its [documentation](https://formsubmit.co/documentation) describes submission archives retained for 30 days. See its [privacy policy](https://formsubmit.co/privacy.pdf). The recipient is public in the website code. FormSubmit can supply an alternative endpoint token after confirmation if you later want to replace it.

### Optional legacy server endpoint

`/api/quote` and `src/lib/server/quote.ts` remain available only in a normal Next.js server build. The current form does **not** call them. Their Resend/Redis/Turnstile environment settings in `.env.example` are optional legacy configuration, unrelated to the free form. The Pages build excludes this server code. If intentionally switching back to that endpoint, configure a verified sender, shared rate limiter and trusted hosting IP adapter, then validate real receipt again. Never commit real credentials.

## GitHub Pages preview

Target repository: https://github.com/mathes2004/plan_kraft. Put the application files at the repository root, including `package.json`, `src/`, `public/`, `scripts/` and `.github/`.

```powershell
npm.cmd run build:pages
npm.cmd run preview:pages
```

Open http://127.0.0.1:4173/plan_kraft/. The build creates `.pages-preview/out`; it includes local images, fonts, banner, seven routes, sitemap and 404 page. It uses `/plan_kraft` as the base path, disables indexing for client review and enables the same free quote form. No local API server is needed. Normal `npm.cmd run build` remains a separate server build.

`scripts/build-pages.mjs` builds from a dedicated staging folder without copying `.env.local` or server handlers. It also creates static segment-payload aliases required by the installed Next.js export so navigation can work without rewrite rules. `npm.cmd run test:pages -- --workers=2` checks direct routes, client navigation, images, the banner, mocked quote submission and 404 handling in desktop/mobile profiles.

To publish, push the application to the target repository's `main` branch and choose **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` builds and deploys automatically. An authorized repository owner must enable Pages and grant write access before this workspace can publish.

Expected URL after successful deployment: **https://mathes2004.github.io/plan_kraft/**. Preparing a build or workflow does not publish it; check the repository's Actions tab for the deployment outcome. The GitHub connector and local Git can have different account permissions. Automatic sync uses local Git and Windows Git Credential Manager.

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
- Nine services and shared image mappings: `src/data/services.ts`.
- Completed projects and comparison pair: `src/data/projects.ts`.
- Work process stages: `src/data/process.ts`.
- Styling and responsive layouts: `src/app/globals.css`.
- Asset source register: `ASSETS.md` and `src/assets/README.md`.

Copy every future user-supplied image into `src/assets/`, preserve its original contents and reference it through a static import. Never reference a Windows path or `/src/assets/...` as a browser URL. Add its source, dimensions and intended use to `ASSETS.md`. Service images are shared between the Services page and corresponding homepage previews.

The six projects (335, 333, 318, 316, 314 and 310) use seventeen supplied photographs with category filters, captions, accessible galleries and project-specific enquiry links. Descriptions omit client identities and street addresses. Warranty details retain the terms note. Only records with genuine approved photographs marked as published render; up to three can be featured on the homepage.

The homepage comparison uses the supplied exterior photos from different viewpoints of the same project. The divider starts at 50%; moving right reveals more BEFORE and moving left reveals more AFTER. Mouse, touch, keyboard and reduced motion are supported.

The homepage uses the selected reference site's Three.js house animation inside `public/banner/`, with local renderer, dependencies, fonts and licenses. Its rain, before/after, rotation and protective-layer controls need WebGL; an illustration fallback is available. The work-process model is a separate CSS scene. Fonts are hosted locally through Fontsource. The shared logo follows the supplied reference.

## Handover

After deployment, check direct-route reloads, mobile navigation, telephone/WhatsApp links, photo galleries, comparison controls and actual quote email receipt. Record live activation and receipt in `QA.md`. Local mocked tests do not establish real delivery. Physical devices, Safari/Firefox, full accessibility review and performance measurement remain separate acceptance work.

Retain the last known-good deployment and source commit for rollback. Review dependency updates deliberately and rerun relevant checks. The older Vite files are retained but are not used by Next.js.
