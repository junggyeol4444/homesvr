'use client';

import { useMemo, useState } from 'react';
import type { Vod } from '@/content/types';
import { VodGallery } from '../vod-gallery';
import { trackEvent } from '@/lib/analytics';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface VodFiltersProps {
  vods: Vod[];
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  lang: SupportedLanguage;
}

export function VodFilters({ vods, dictionary, lang }: VodFiltersProps) {
  const [platform, setPlatform] = useState<string>('');
  const [series, setSeries] = useState<string>('');
  const [guest, setGuest] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    return vods.filter((vod) => {
      if (platform && vod.platform !== platform) return false;
      if (series && !vod.series.includes(series)) return false;
      if (guest && !vod.members.includes(guest)) return false;
      if (
        search &&
        !vod.title.toLowerCase().includes(search.toLowerCase()) &&
        !vod.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  }, [vods, platform, series, guest, search]);

  const uniquePlatforms = Array.from(new Set(vods.map((vod) => vod.platform)));
  const uniqueSeries = Array.from(new Set(vods.flatMap((vod) => vod.series)));
  const uniqueGuests = Array.from(new Set(vods.flatMap((vod) => vod.members)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.vod.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{dictionary.vod.intro}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={platform}
          onChange={(event) => {
            setPlatform(event.target.value);
            trackEvent({ name: 'vod_filter_change', payload: { key: 'platform', value: event.target.value } });
          }}
        >
          <option value="">{dictionary.schedule.platform}</option>
          {uniquePlatforms.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={series}
          onChange={(event) => {
            setSeries(event.target.value);
            trackEvent({ name: 'vod_filter_change', payload: { key: 'series', value: event.target.value } });
          }}
        >
          <option value="">{dictionary.schedule.series}</option>
          {uniqueSeries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={guest}
          onChange={(event) => {
            setGuest(event.target.value);
            trackEvent({ name: 'vod_filter_change', payload: { key: 'guest', value: event.target.value } });
          }}
        >
          <option value="">{dictionary.schedule.guests}</option>
          {uniqueGuests.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder={dictionary.vod.searchPlaceholder}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {filtered.length ? (
        <VodGallery vods={filtered} dictionary={dictionary} lang={lang} />
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">{dictionary.common.empty}</p>
      )}
    </div>
  );
}
