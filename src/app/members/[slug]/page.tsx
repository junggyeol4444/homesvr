import type { Metadata } from 'next';
import { MemberProfile } from '@/components/members/member-profile';

type MemberPageProps = {
  params: {
    slug: string;
  };
};

export const metadata: Metadata = {
  title: '멤버 상세 | 쌀가루집안',
  description: '쌀가루집안 멤버의 상세 프로필을 확인하세요.'
};

export default function MemberProfilePage({ params }: MemberPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  return <MemberProfile slug={decodedSlug} />;
}
