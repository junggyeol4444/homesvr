import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeroNextEpisode } from '@/components/hero-next-episode';
import { PostCard } from '@/components/post-card';
import { StructuredData } from '@/components/structured-data';
import { getUpcomingEpisode, getPosts, getVods, getMembers } from '@/lib/data';
import { getDictionary, type SupportedLanguage, supportedLanguages } from '@/i18n/dictionaries';
import { episodeJsonLd, vodJsonLd, buildMetadata } from '@/lib/seo';
import { VodGallery } from './vod-gallery';

export const dynamic = 'force-static';

interface PageProps {
  params: { lang?: string };
}

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: undefined,
    description: dictionary.hero.nextShow,
    path: params.lang ? `/${params.lang}` : '/',
    lang
  });
}

export default function HomePage({ params }: PageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const upcoming = getUpcomingEpisode();
  const latestPosts = getPosts().slice(0, 3);
  const highlights = getVods().slice(0, 3);
  const memberLookup = Object.fromEntries(getMembers().map((member) => [member.slug, member.name]));
  const structuredData = [
    ...(upcoming ? [episodeJsonLd(upcoming)] : []),
    ...highlights.map((vod) => vodJsonLd(vod))
  ];

  return (
    <div className="space-y-12">
      <HeroNextEpisode episode={upcoming} dictionary={dictionary} lang={lang} />
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">{dictionary.common.latestNotices}</h2>
            <p className="section-subtitle">{dictionary.posts.intro}</p>
          </div>
        </div>
        <div className="mt-6 card-grid">
          {latestPosts.length ? (
            latestPosts.map((post) => <PostCard key={post.id} post={post} lang={lang} />)
          ) : (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {dictionary.common.empty}
            </p>
          )}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">{dictionary.common.highlightVod}</h2>
            <p className="section-subtitle">{dictionary.vod.intro}</p>
          </div>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="skeleton h-64" />)}</div>}>
          <VodGallery vods={highlights} dictionary={dictionary} lang={lang} memberLookup={memberLookup} />
        </Suspense>
      </section>
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </div>
  );
}
