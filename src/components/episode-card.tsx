import Image from 'next/image';
import type { Episode } from '@/content/types';
import { formatTimeRange } from '@/lib/datetime';
import type { SupportedLanguage } from '@/i18n/dictionaries';
import { trackEvent } from '@/lib/analytics';

interface EpisodeCardProps {
  episode: Episode;
  lang: SupportedLanguage;
  onClick?: () => void;
}

export function EpisodeCard({ episode, lang, onClick }: EpisodeCardProps) {
  const platformLabel: Record<string, string> = {
    youtube: 'YouTube',
    chzzk: 'Chzzk',
    tiktok: 'TikTok'
  };

  return (
    <a
      href={episode.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col overflow-hidden"
      onClick={() => {
        trackEvent({ name: 'schedule_card_click', payload: { episode_id: episode.id, platform: episode.platform } });
        onClick?.();
      }}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-xl">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="tag absolute left-3 top-3 bg-white/90 text-xs font-semibold uppercase tracking-wide">
          {platformLabel[episode.platform] ?? episode.platform}
        </span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{episode.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {formatTimeRange(episode.startAt, episode.endAt, lang)}
        </p>
        {episode.description ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{episode.description}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {episode.series.map((item) => (
            <span key={item} className="tag">
              #{item}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
