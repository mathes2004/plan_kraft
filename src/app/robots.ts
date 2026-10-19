import type { MetadataRoute } from 'next';
import { origin, indexable } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: indexable ? '/' : undefined,
      disallow: indexable ? '/api/' : '/',
    },
    sitemap: indexable ? new URL('/sitemap.xml', origin).href : undefined,
  };
}
