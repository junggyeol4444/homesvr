import type { Metadata } from 'next';
import { getMembers } from '@/lib/data';
import { getDictionary, type SupportedLanguage } from '@/i18n/dictionaries';
import { MembersDirectory } from './members-directory';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, memberJsonLd } from '@/lib/seo';

export const dynamic = 'force-static';

interface MembersPageProps {
  params: { lang?: string };
}

export function generateMetadata({ params }: MembersPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: dictionary.members.title,
    description: dictionary.members.intro,
    path: params.lang ? `/${params.lang}/members` : '/members',
    lang
  });
}

export default function MembersPage({ params }: MembersPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const crew = getMembers();
  const structuredData = crew.map((member) => memberJsonLd(member));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.members.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{dictionary.members.intro}</p>
      </header>
      <MembersDirectory members={crew} dictionary={dictionary} lang={lang} />
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </div>
  );
}
