import type { Metadata } from 'next';
import type { Episode, Member, Post, Vod } from '@/content/types';
import type { SupportedLanguage } from '@/i18n/dictionaries';
import { siteConfig } from './site';
import { getMembersBySlugList } from './data';

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  lang = 'ko',
  images
}: {
  title?: string;
  description?: string;
  path?: string;
  lang?: SupportedLanguage;
  images?: string[];
}): Metadata {
  const pageTitle = title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.slogan}`;
  const canonical = absoluteUrl(path);
  const ogImages = images?.map((src) => ({ url: src, width: 1200, height: 630 })) ?? [];

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(path.startsWith('/en') ? path : `/en${path === '/' ? '' : path}`),
        ko: absoluteUrl(path.replace(/^\/en/, '') || '/')
      }
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      images: ogImages
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ogImages.map((item) => item.url)
    }
  } satisfies Metadata;
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs: Object.values(siteConfig.socials)
  };
}

export function episodeJsonLd(episode: Episode) {
  const members = getMembersBySlugList(episode.guests);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: episode.title,
    description: episode.description,
    startDate: episode.startAt,
    endDate: episode.endAt ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    performer: members.length
      ? members.map((member) => ({ '@type': 'Person', name: member.name }))
      : episode.guests.map((guest) => ({ '@type': 'Person', name: guest })),
    url: episode.url,
    isAccessibleForFree: true
  };
}

function durationToIso(durationSeconds?: number) {
  if (!durationSeconds) return undefined;
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  return `PT${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${seconds ? `${seconds}S` : ''}`;
}

export function vodJsonLd(vod: Vod) {
  const { watchUrl, embedUrl } = (() => {
    switch (vod.platform) {
      case 'youtube':
        return {
          watchUrl: `https://www.youtube.com/watch?v=${vod.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${vod.videoId}`
        };
      case 'tiktok':
        return {
          watchUrl: `https://www.tiktok.com/@4444crew/video/${vod.videoId}`,
          embedUrl: `https://www.tiktok.com/embed/${vod.videoId}`
        };
      case 'chzzk':
        return {
          watchUrl: `https://chzzk.naver.com/live/${vod.videoId}`,
          embedUrl: `https://chzzk.naver.com/live/${vod.videoId}`
        };
      default:
        return { watchUrl: undefined, embedUrl: undefined };
    }
  })();

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: vod.title,
    description: vod.description ?? '',
    uploadDate: vod.publishedAt ?? undefined,
    duration: durationToIso(vod.duration),
    thumbnailUrl: [vod.thumbnail],
    contentUrl: watchUrl,
    embedUrl,
    genre: vod.series
  };
}

export function postJsonLd(post: Post, lang: SupportedLanguage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: lang === 'en' && post.title_en ? post.title_en : post.title,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author
    },
    inLanguage: lang === 'ko' ? 'ko' : 'en',
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`)
  };
}

export function memberJsonLd(member: Member) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    description: member.bio,
    url: absoluteUrl(`/members/${member.slug}`),
    sameAs: Object.values(member.socials).filter(Boolean)
  };
}
