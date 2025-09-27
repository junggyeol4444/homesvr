'use client';

import { useMemo, useState } from 'react';
import type { Episode } from '@/content/types';
import { EpisodeCard } from './episode-card';
import { trackEvent } from '@/lib/analytics';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface CalendarViewProps {
  episodes: Episode[];
  lang: SupportedLanguage;
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
}

export function CalendarView({ episodes, lang, dictionary }: CalendarViewProps) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [filters, setFilters] = useState<{ platform?: string; series?: string; guest?: string }>({});

  const filteredEpisodes = useMemo(() => {
    const now = new Date();
    const horizon = new Date(now);
    horizon.setDate(now.getDate() + (view === 'week' ? 7 : 31));
    return episodes.filter((episode) => {
      const start = new Date(episode.startAt);
      if (start < now || start > horizon) return false;
      if (filters.platform && episode.platform !== filters.platform) return false;
      if (filters.series && !episode.series.includes(filters.series)) return false;
      if (filters.guest && !episode.guests.includes(filters.guest)) return false;
      return true;
    });
  }, [episodes, filters, view]);

  const uniquePlatforms = Array.from(new Set(episodes.map((episode) => episode.platform)));
  const uniqueSeries = Array.from(new Set(episodes.flatMap((episode) => episode.series)));
  const uniqueGuests = Array.from(new Set(episodes.flatMap((episode) => episode.guests)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-slate-200 p-1 text-sm dark:border-slate-700" role="tablist" aria-label="Schedule view">
          <button
            type="button"
            className={`rounded-full px-4 py-1 font-medium transition ${
              view === 'week' ? 'bg-brand-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => {
              setView('week');
              trackEvent({ name: 'schedule_filter_change', payload: { type: 'view', value: 'week' } });
            }}
            role="tab"
            aria-selected={view === 'week'}
          >
            {dictionary.schedule.week}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1 font-medium transition ${
              view === 'month' ? 'bg-brand-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => {
              setView('month');
              trackEvent({ name: 'schedule_filter_change', payload: { type: 'view', value: 'month' } });
            }}
            role="tab"
            aria-selected={view === 'month'}
          >
            {dictionary.schedule.month}
          </button>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <select
            className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700 dark:bg-slate-900"
            value={filters.platform ?? ''}
            onChange={(event) => {
              const value = event.target.value || undefined;
              setFilters((prev) => ({ ...prev, platform: value }));
              trackEvent({ name: 'schedule_filter_change', payload: { type: 'platform', value } });
            }}
            aria-label={dictionary.schedule.platform}
          >
            <option value="">{dictionary.schedule.platform}</option>
            {uniquePlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700 dark:bg-slate-900"
            value={filters.series ?? ''}
            onChange={(event) => {
              const value = event.target.value || undefined;
              setFilters((prev) => ({ ...prev, series: value }));
              trackEvent({ name: 'schedule_filter_change', payload: { type: 'series', value } });
            }}
            aria-label={dictionary.schedule.series}
          >
            <option value="">{dictionary.schedule.series}</option>
            {uniqueSeries.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700 dark:bg-slate-900"
            value={filters.guest ?? ''}
            onChange={(event) => {
              const value = event.target.value || undefined;
              setFilters((prev) => ({ ...prev, guest: value }));
              trackEvent({ name: 'schedule_filter_change', payload: { type: 'guest', value } });
            }}
            aria-label={dictionary.schedule.guests}
          >
            <option value="">{dictionary.schedule.guests}</option>
            {uniqueGuests.map((guest) => (
              <option key={guest} value={guest}>
                {guest}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card-grid">
        {filteredEpisodes.length ? (
          filteredEpisodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} lang={lang} />)
        ) : (
          <p className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400">{dictionary.common.empty}</p>
        )}
      </div>
    </div>
  );
}
