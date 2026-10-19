import type { NextConfig } from 'next';
const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === 'true';
const config: NextConfig = {
  poweredByHeader: false,
  ...(staticPreview
    ? {
        output: 'export',
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
        trailingSlash: true,
        images: { unoptimized: true },
        turbopack: { root: process.env.PAGES_WORKSPACE_ROOT || process.cwd() },
      }
    : {}),
};
export default config;
