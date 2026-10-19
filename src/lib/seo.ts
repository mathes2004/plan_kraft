import type { Metadata } from 'next';
export const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const indexable = process.env.SITE_INDEXABLE === 'true';
export function metadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website' },
  };
}
