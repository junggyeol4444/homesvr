import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/datetime';
import { getDictionary, type SupportedLanguage, supportedLanguages } from '@/i18n/dictionaries';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, postJsonLd } from '@/lib/seo';
import { PostShareButtons } from '@/components/post-share-buttons';

interface PostPageProps {
  params: { lang?: string; slug: string };
}

export function generateStaticParams() {
  return supportedLanguages.flatMap((lang) => getPosts().map((post) => ({ lang, slug: post.slug })));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const post = getPostBySlug(params.slug);
  if (!post) {
    return buildMetadata({
      title: 'Post',
      description: getDictionary(lang).posts.intro,
      path: params.lang ? `/${params.lang}/posts/${params.slug}` : `/posts/${params.slug}`,
      lang
    });
  }
  const title = lang === 'en' && post.title_en ? post.title_en : post.title;
  const description = post.excerpt_en && lang === 'en' ? post.excerpt_en : post.excerpt ?? post.title;
  return buildMetadata({
    title,
    description,
    path: params.lang ? `/${params.lang}/posts/${post.slug}` : `/posts/${post.slug}`,
    images: post.cover ? [post.cover] : undefined,
    lang
  });
}

export default function PostPage({ params }: PostPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  const resolvedPost = post;

  const title = lang === 'en' && resolvedPost.title_en ? resolvedPost.title_en : resolvedPost.title;
  const body = lang === 'en' && resolvedPost.body_en ? resolvedPost.body_en : resolvedPost.body;

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <Link href=".." className="no-underline">
        ← {dictionary.common.back}
      </Link>
      <h1 className="mt-4 text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {dictionary.common.published}: {formatDate(resolvedPost.publishedAt, lang, 'PPP')}
      </p>
      {resolvedPost.cover ? <img src={resolvedPost.cover} alt={title} className="mt-6 w-full rounded-2xl" /> : null}
      <ReactMarkdown className="mt-6">{body}</ReactMarkdown>
      <PostShareButtons postId={resolvedPost.id} slug={resolvedPost.slug} title={title} dictionary={dictionary} />
      <StructuredData data={postJsonLd(resolvedPost, lang)} />
    </article>
  );
}
