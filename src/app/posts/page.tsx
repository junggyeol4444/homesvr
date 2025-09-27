import type { Metadata } from 'next';
import LocalizedPostsPage, { generateMetadata as generateLocalizedMetadata } from '../(localized)/[lang]/posts/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function PostsPage() {
  return <LocalizedPostsPage params={{ lang: 'ko' }} />;
}
