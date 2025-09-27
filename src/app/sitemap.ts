import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { getMembers, getPosts } from '@/lib/data';

function entry(path: string, lastModified?: string | Date): MetadataRoute.Sitemap[0] {
  const koPath = path.startsWith('/') ? path : `/${path}`;
  const enPath = koPath === '/' ? '/en' : `/en${koPath}`;
  return {
    url: absoluteUrl(koPath),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    alternates: {
      languages: {
        ko: absoluteUrl(koPath),
        en: absoluteUrl(enPath)
      }
    }
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = ['/', '/schedule', '/members', '/vod', '/posts', '/legal'].map((path) => entry(path));
  const postRoutes = getPosts().map((post) => entry(`/posts/${post.slug}`, post.publishedAt));
  const memberRoutes = getMembers().map((member) => entry(`/members/${member.slug}`));
  return [...baseRoutes, ...postRoutes, ...memberRoutes];
}
