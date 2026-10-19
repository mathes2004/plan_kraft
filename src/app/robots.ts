import type { MetadataRoute } from 'next';
import { origin, indexable } from '@/lib/seo';
import { withBasePath } from '@/lib/paths';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: indexable ? '/' : undefined,
      disallow: indexable ? '/api/' : '/',
    },
    sitemap: indexable ? new URL(withBasePath('/sitemap.xml'), origin).href : undefined,
  };
}
