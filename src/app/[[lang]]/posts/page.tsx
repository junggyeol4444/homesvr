import type { Metadata } from 'next';
import { getPosts } from '@/lib/data';
import { getDictionary, type SupportedLanguage } from '@/i18n/dictionaries';
import { PostCard } from '@/components/post-card';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, postJsonLd } from '@/lib/seo';

export const dynamic = 'force-static';

interface PostsPageProps {
  params: { lang?: string };
}

export function generateMetadata({ params }: PostsPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: dictionary.posts.title,
    description: dictionary.posts.intro,
    path: params.lang ? `/${params.lang}/posts` : '/posts',
    lang
  });
}

export default function PostsPage({ params }: PostsPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const allPosts = getPosts();
  const structuredData = allPosts.map((post) => postJsonLd(post, lang));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.posts.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{dictionary.posts.intro}</p>
      </header>
      <div className="card-grid">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
      {structuredData.length ? <StructuredData data={structuredData} /> : null}
    </div>
  );
}
