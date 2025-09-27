import type { Metadata } from 'next';
import LocalizedSchedulePage, { generateMetadata as generateLocalizedMetadata } from '../(localized)/[lang]/schedule/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function SchedulePage() {
  return <LocalizedSchedulePage params={{ lang: 'ko' }} />;
}
