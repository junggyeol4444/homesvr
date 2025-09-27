'use client';

import { useEffect, useMemo } from 'react';
import type { Vod } from '@/content/types';
import type { SupportedLanguage } from '@/i18n/dictionaries';
import { formatDate, formatVodDuration } from '@/lib/datetime';

interface VodPlayerModalProps {
  vod: Vod | null;
  onClose: () => void;
  lang: SupportedLanguage;
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  memberLookup: Record<string, string>;
}

function getEmbedUrl(vod: Vod) {
  switch (vod.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${vod.videoId}`;
    case 'tiktok':
      return `https://www.tiktok.com/embed/${vod.videoId}`;
    case 'chzzk':
      return `https://chzzk.naver.com/live/${vod.videoId}`;
    default:
      return '#';
  }
}

export function VodPlayerModal({ vod, onClose, lang, dictionary, memberLookup }: VodPlayerModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    if (vod) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [vod, onClose]);

  const memberNames = useMemo(
    () => (vod ? vod.members.map((slug) => memberLookup[slug]).filter(Boolean) : []),
    [vod, memberLookup]
  );

  if (!vod) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal>
      <div className="dialog-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{vod.title}</h3>
          <button type="button" className="button-secondary" onClick={onClose}>
            {dictionary.common.close}
          </button>
        </div>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <iframe
            src={getEmbedUrl(vod)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={vod.title}
          />
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {vod.description ? <p>{vod.description}</p> : null}
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {vod.publishedAt ? (
              <span>
                {dictionary.common.published}:{' '}
                {formatDate(vod.publishedAt, lang, 'PPP p')}
              </span>
            ) : null}
            {typeof vod.duration === 'number' ? (
              <span>
                {dictionary.common.duration}:{' '}
                {formatVodDuration(vod.duration, lang)}
              </span>
            ) : null}
            {memberNames.length ? (
              <span>
                {dictionary.common.featuring}:{' '}
                {memberNames.join(', ')}
              </span>
            ) : null}
          </div>
        </div>
        {vod.chapters?.length ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{dictionary.vod.chapters}</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {vod.chapters.map((chapter) => (
                <li key={chapter.time}>
                  {new Date(chapter.time * 1000).toISOString().substring(14, 19)} — {chapter.title}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
