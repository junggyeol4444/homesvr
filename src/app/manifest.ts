import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} 허브`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#215de6',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '128x128'
      }
    ]
  };
}
