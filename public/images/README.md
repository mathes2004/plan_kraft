User-provided images are maintained in `src/assets/` and referenced through static imports. See `src/assets/README.md` and the project `AGENTS.md` for the required workflow for future images.

The Services page and homepage previews share imports from `src/assets/services/`. The original homepage comparison pair is imported from `src/assets/before-after/`. Next.js packages these images into production assets; runtime `/images/...` paths are no longer used.
