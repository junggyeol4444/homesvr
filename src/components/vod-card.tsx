import Image from 'next/image';
import type { Vod } from '@/content/types';
import { trackEvent } from '@/lib/analytics';

interface VodCardProps {
  vod: Vod;
  onSelect?: (vod: Vod) => void;
}

const platformLabel: Record<string, string> = {
  youtube: 'YouTube',
  chzzk: 'Chzzk',
  tiktok: 'TikTok'
};

export function VodCard({ vod, onSelect }: VodCardProps) {
  return (
    <button
      type="button"
      className="card group flex flex-col text-left"
      onClick={() => {
        trackEvent({ name: 'vod_play', payload: { id: vod.id, platform: vod.platform } });
        onSelect?.(vod);
      }}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-xl">
        <Image src={vod.thumbnail} alt={vod.title} fill className="object-cover transition group-hover:scale-105" />
        <span className="tag absolute left-3 top-3 bg-white/90 text-xs font-semibold uppercase tracking-wide">
          {platformLabel[vod.platform] ?? vod.platform}
        </span>
      </div>
      <div className="mt-4 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{vod.title}</h3>
        {vod.description ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{vod.description}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {vod.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
