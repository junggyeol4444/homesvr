import type { Metadata } from 'next';
import { getEpisodes, getUpcomingEpisodes } from '@/lib/data';
import { getDictionary, type SupportedLanguage } from '@/i18n/dictionaries';
import { CalendarView } from '@/components/calendar-view';
import { ScheduleSubscribe } from '@/components/schedule-subscribe';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, episodeJsonLd } from '@/lib/seo';

export const dynamic = 'force-static';

interface SchedulePageProps {
  params: { lang?: string };
}

export function generateMetadata({ params }: SchedulePageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: dictionary.schedule.title,
    description: dictionary.schedule.upcoming,
    path: params.lang ? `/${params.lang}/schedule` : '/schedule',
    lang
  });
}

export default function SchedulePage({ params }: SchedulePageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const episodes = getEpisodes();
  const structuredData = getUpcomingEpisodes(6).map((episode) => episodeJsonLd(episode));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.schedule.title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{dictionary.schedule.upcoming}</p>
        </div>
        <ScheduleSubscribe dictionary={dictionary} />
      </header>
      <CalendarView episodes={episodes} lang={lang} dictionary={dictionary} />
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </div>
  );
}
