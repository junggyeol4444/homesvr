import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: ['/', '/categories', '/products', '/compare', '/tools', '/alerts']
  },
  sitemap: 'https://homesvr.dev/sitemap.xml'
});

export default robots;
