import type { Metadata } from 'next';
import LocalizedMemberPage, { generateMetadata as generateLocalizedMetadata } from '../../(localized)/[lang]/members/[slug]/page';
import { getMembers } from '@/lib/data';

type Params = { slug: string };

export function generateStaticParams() {
  return getMembers().map((member) => ({ slug: member.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  return generateLocalizedMetadata({ params: { lang: 'ko', slug: params.slug } });
}

export default function MemberPage({ params }: { params: Params }) {
  return <LocalizedMemberPage params={{ lang: 'ko', slug: params.slug }} />;
}
