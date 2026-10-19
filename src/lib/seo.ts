import type { Metadata } from 'next';
import { staticPreview, withBasePath } from '@/lib/paths';
export const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const indexable = !staticPreview && process.env.SITE_INDEXABLE === 'true';
export function metadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: withBasePath(path) },
    openGraph: { title, description, url: withBasePath(path), type: 'website' },
  };
}
