import type { Metadata } from 'next';
import LocalizedLegalPage, { generateMetadata as generateLocalizedMetadata } from '../(localized)/[lang]/legal/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function LegalPage() {
  return <LocalizedLegalPage params={{ lang: 'ko' }} />;
}
