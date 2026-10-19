import type { MetadataRoute } from 'next';
import { navigation } from '@/data/company';
import { origin } from '@/lib/seo';
import { withBasePath } from '@/lib/paths';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return navigation.map(([path]) => ({ url: new URL(withBasePath(path), origin).href }));
}
