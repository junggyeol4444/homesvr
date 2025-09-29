import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} Hub`,
    short_name: '쌀가루집안',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '128x128'
      }
    ]
  };
}
