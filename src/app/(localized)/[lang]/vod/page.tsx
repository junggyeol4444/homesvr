import type { Metadata } from 'next';
import { getVods, getMembers } from '@/lib/data';
import { getDictionary, type SupportedLanguage } from '@/i18n/dictionaries';
import { VodFilters } from './vod-filters';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, vodJsonLd } from '@/lib/seo';

export const dynamic = 'force-static';

interface VodPageProps {
  params: { lang?: string };
}

export function generateMetadata({ params }: VodPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: dictionary.vod.title,
    description: dictionary.vod.intro,
    path: params.lang ? `/${params.lang}/vod` : '/vod',
    lang
  });
}

export default function VodPage({ params }: VodPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const allVods = getVods();
  const memberLookup = Object.fromEntries(getMembers().map((member) => [member.slug, member.name]));
  const structuredData = allVods.slice(0, 10).map((vod) => vodJsonLd(vod));

  return (
    <>
      <VodFilters vods={allVods} dictionary={dictionary} lang={lang} memberLookup={memberLookup} />
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </>
  );
}
