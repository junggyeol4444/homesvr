'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/lib/site';

interface PostShareButtonsProps {
  postId: string;
  slug: string;
  title: string;
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
}

export function PostShareButtons({ postId, slug, title, dictionary }: PostShareButtonsProps) {
  const shareUrl = `${siteConfig.url.replace(/\/$/, '')}/posts/${slug}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackEvent({ name: 'post_share_click', payload: { id: postId, target: 'copy' } });
      alert(dictionary.common.copied);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  }, [dictionary.common.copied, postId, shareUrl]);

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <Link
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="button-secondary"
        onClick={() => trackEvent({ name: 'post_share_click', payload: { id: postId, target: 'x' } })}
      >
        X
      </Link>
      <button type="button" className="button-secondary" onClick={handleCopy}>
        {dictionary.common.copyLink}
      </button>
    </div>
  );
}
