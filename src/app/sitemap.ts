import type { MetadataRoute } from 'next';
import { navigation } from '@/data/company';
import { origin } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return navigation.map(([path]) => ({ url: new URL(path, origin).href }));
}
