<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## User-provided image assets

- Copy every image supplied by the user, including future images, into `src/assets/` before referencing it. Use descriptive filenames and subfolders such as `services/`, `before-after/`, and `projects/`.
- Preserve original image contents. JPEG files supplied with `.jfif` extensions may be copied with `.jpg` filenames without re-encoding.
- Keep all existing and future project photos in `src/assets/projects/<project-number>/`, with descriptive filenames and shared imports in `src/data/projects.ts`.
- Keep project numbers internal for records and asset organization; do not display them on project cards, gallery headers or accessible gallery labels.
- Import these files statically, for example `import photo from '@/assets/services/rooftop-waterproofing.webp'`, and pass the imported image to `next/image`. Next.js will package the image into the production build and check that its source exists.
- Never use a user's absolute filesystem path or a `/src/assets/...` URL as an image `src`. Use shared image mappings in `src/data/services.ts` and `src/data/projects.ts` wherever an image appears on multiple pages.
- Update `ASSETS.md` with the supplied source filename, destination, dimensions, and intended use. User instructions to add an image already authorize copying and referencing it for the requested purpose.
