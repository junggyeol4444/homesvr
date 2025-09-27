import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/content/types';
import type { SupportedLanguage } from '@/i18n/dictionaries';
import { formatDate } from '@/lib/datetime';
import { trackEvent } from '@/lib/analytics';

interface PostCardProps {
  post: Post;
  lang: SupportedLanguage;
}

export function PostCard({ post, lang }: PostCardProps) {
  const excerpt = lang === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt;
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="card group flex flex-col overflow-hidden"
      onClick={() => trackEvent({ name: 'post_card_click', payload: { post_id: post.id } })}
    >
      {post.cover ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl">
          <Image src={post.cover} alt={post.title} fill className="object-cover transition group-hover:scale-105" />
        </div>
      ) : null}
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {formatDate(post.publishedAt, lang, 'PPP')}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {lang === 'en' && post.title_en ? post.title_en : post.title}
        </h3>
        {excerpt ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{excerpt}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
