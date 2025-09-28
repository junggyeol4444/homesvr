import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl('/'), lastModified: now },
    { url: absoluteUrl('/members'), lastModified: now },
    { url: absoluteUrl('/admin'), lastModified: now }
  ];
}
