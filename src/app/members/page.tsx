import type { Metadata } from 'next';
import LocalizedMembersPage, { generateMetadata as generateLocalizedMetadata } from '../(localized)/[lang]/members/page';

export const metadata: Metadata = generateLocalizedMetadata({ params: { lang: 'ko' } });

export default function MembersPage() {
  return <LocalizedMembersPage params={{ lang: 'ko' }} />;
}
