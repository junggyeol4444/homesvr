import type { Metadata } from 'next';
import LocalizedHomePage, { generateMetadata as generateLocalizedMetadata } from './(localized)/[lang]/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function RootHomePage() {
  return <LocalizedHomePage params={{ lang: 'ko' }} />;
}
