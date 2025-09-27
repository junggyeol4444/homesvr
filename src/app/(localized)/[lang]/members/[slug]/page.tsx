import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMemberBySlug, getMembers, getPostsByAuthor, getVodById, getPostBySlug } from '@/lib/data';
import { getDictionary, type SupportedLanguage, supportedLanguages } from '@/i18n/dictionaries';
import { MemberProfile } from '@/components/member-profile';
import { PostCard } from '@/components/post-card';
import { VodGallery } from '../../vod-gallery';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, memberJsonLd, vodJsonLd, postJsonLd } from '@/lib/seo';

interface MemberPageProps {
  params: { lang?: string; slug: string };
}

export function generateStaticParams() {
  return supportedLanguages.flatMap((lang) =>
    getMembers().map((member) => ({ lang, slug: member.slug }))
  );
}

export function generateMetadata({ params }: MemberPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const member = getMemberBySlug(params.slug);
  if (!member) {
    return buildMetadata({
      title: 'Member',
      description: siteFallbackDescription(lang),
      path: params.lang ? `/${params.lang}/members/${params.slug}` : `/members/${params.slug}`,
      lang
    });
  }
  const dictionary = getDictionary(lang);
  const description = lang === 'en' && member.bio_en ? member.bio_en : member.bio;
  return buildMetadata({
    title: `${member.name} | ${dictionary.members.title}`,
    description,
    path: params.lang ? `/${params.lang}/members/${member.slug}` : `/members/${member.slug}`,
    lang
  });
}

function siteFallbackDescription(lang: SupportedLanguage) {
  const dictionary = getDictionary(lang);
  return dictionary.members.intro;
}

export default function MemberPage({ params }: MemberPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const member = getMemberBySlug(params.slug);
  if (!member) {
    notFound();
  }
  const memberLookup = Object.fromEntries(getMembers().map((item) => [item.slug, item.name]));
  const posts = getPostsByAuthor(member.slug).slice(0, 3);
  const featuredVods = member.featuredVods
    .map((id) => getVodById(id))
    .filter((vod): vod is NonNullable<ReturnType<typeof getVodById>> => Boolean(vod));
  const pinnedNotice = member.noticePinned ? getPostBySlug(member.noticePinned) : undefined;
  const structuredData = [
    memberJsonLd(member),
    ...featuredVods.map((vod) => vodJsonLd(vod)),
    ...posts.map((post) => postJsonLd(post, lang))
  ];

  return (
    <div className="space-y-10">
      <MemberProfile member={member} lang={lang} dictionary={dictionary} />
      {pinnedNotice ? (
        <section className="card border-l-4 border-brand-500">
          <p className="text-xs uppercase tracking-wider text-brand-500">{dictionary.members.notices}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            {lang === 'en' && pinnedNotice.title_en ? pinnedNotice.title_en : pinnedNotice.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{pinnedNotice.tags.join(', ')}</p>
        </section>
      ) : null}
      <section className="space-y-4">
        <div>
          <h2 className="section-title">{dictionary.members.featuredVods}</h2>
        </div>
        {featuredVods.length ? (
          <VodGallery vods={featuredVods} dictionary={dictionary} lang={lang} memberLookup={memberLookup} />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{dictionary.common.empty}</p>
        )}
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="section-title">{dictionary.members.relatedPosts}</h2>
        </div>
        {posts.length ? (
          <div className="card-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{dictionary.common.empty}</p>
        )}
      </section>
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </div>
  );
}
