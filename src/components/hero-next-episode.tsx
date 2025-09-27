'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Episode } from '@/content/types';
import type { SupportedLanguage } from '@/i18n/dictionaries';
import { formatCountdown, formatDate, isLive } from '@/lib/datetime';
import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/lib/site';

interface HeroNextEpisodeProps {
  episode?: Episode;
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  lang: SupportedLanguage;
}

const platformLinks: Record<string, { href: string; label: string }> = {
  youtube: {
    href: siteConfig.socials.youtube,
    label: 'YouTube'
  },
  chzzk: {
    href: siteConfig.socials.chzzk,
    label: 'Chzzk'
  },
  tiktok: {
    href: siteConfig.socials.tiktok,
    label: 'TikTok'
  }
};

export function HeroNextEpisode({ episode, dictionary, lang }: HeroNextEpisodeProps) {
  const [timeLeft, setTimeLeft] = useState(episode ? formatCountdown(episode.startAt, lang) : '');

  useEffect(() => {
    if (!episode) return;
    trackEvent({
      name: 'hero_countdown_view',
      payload: { time_to_start: new Date(episode.startAt).getTime() - Date.now() }
    });
    const interval = setInterval(() => {
      setTimeLeft(formatCountdown(episode.startAt, lang));
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, [episode, lang]);

  const isEpisodeLive = useMemo(() => {
    if (!episode) return false;
    return isLive(episode.startAt, episode.endAt);
  }, [episode]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 p-10 text-white shadow-xl">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80)', backgroundSize: 'cover' }} aria-hidden />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-white/80">
            {dictionary.hero.nextShow}
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            {episode ? episode.title : `${siteConfig.name} 라이브`}
          </h1>
          <p className="mt-3 text-base text-white/80">
            {episode
              ? `${formatDate(episode.startAt, lang, 'PPP p')} · ${episode.platform.toUpperCase()}`
              : dictionary.hero.noUpcoming}
          </p>
          {episode?.description ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
              {episode.description}
            </p>
          ) : null}
          {episode ? (
            <p className="mt-2 text-sm font-semibold text-white">
              {isEpisodeLive
                ? dictionary.hero.liveNow
                : `${dictionary.hero.countdown} ${timeLeft}`}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {episode ? (
              <a
                href={episode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary"
                onClick={() =>
                  trackEvent({ name: 'hero_platform_click', payload: { platform: episode.platform, position: 'hero-primary' } })
                }
              >
                {dictionary.hero.watchOn} · {platformLinks[episode.platform]?.label ?? episode.platform}
              </a>
            ) : null}
            {(['youtube', 'chzzk', 'tiktok'] as const)
              .filter((platform) => platformLinks[platform].href && platformLinks[platform].href !== '#')
              .map((platform) => (
                <a
                  key={platform}
                  href={platformLinks[platform].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary border-white/40 text-white hover:bg-white/10"
                  onClick={() =>
                    trackEvent({ name: 'hero_platform_click', payload: { platform, position: 'hero-secondary' } })
                  }
                >
                  {dictionary.hero[`cta${platform.charAt(0).toUpperCase() + platform.slice(1)}` as 'ctaYoutube']}
                </a>
              ))}
          </div>
        </div>
        {episode ? (
          <div className="grid gap-3 rounded-2xl bg-white/10 p-6 text-sm text-white/90 backdrop-blur">
            <div>
              <p className="text-xs uppercase text-white/60">Series</p>
              <p className="font-semibold">{episode.series.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/60">Guests</p>
              <p className="font-semibold">{episode.guests.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/60">Tags</p>
              <p className="font-semibold">{episode.tags.join(', ')}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
