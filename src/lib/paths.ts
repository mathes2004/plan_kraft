export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === 'true';

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
