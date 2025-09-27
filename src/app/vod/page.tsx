import type { Metadata } from 'next';
import LocalizedVodPage, { generateMetadata as generateLocalizedMetadata } from '../(localized)/[lang]/vod/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function VodPage() {
  return <LocalizedVodPage params={{ lang: 'ko' }} />;
}
