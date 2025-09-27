import type { Metadata } from 'next';
import LocalizedPostPage, { generateMetadata as generateLocalizedMetadata } from '../../(localized)/[lang]/posts/[slug]/page';
import { getPosts } from '@/lib/data';

type Params = { slug: string };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  return generateLocalizedMetadata({ params: { lang: 'ko', slug: params.slug } });
}

export default function PostPage({ params }: { params: Params }) {
  return <LocalizedPostPage params={{ lang: 'ko', slug: params.slug }} />;
}
