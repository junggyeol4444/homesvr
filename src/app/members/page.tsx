import type { Metadata } from 'next';
import { MembersList } from '@/components/members/members-list';

export const metadata: Metadata = {
  title: '멤버 소개 | 쌀가루집안',
  description: '쌀가루집안 멤버들의 프로필과 활동 정보를 한눈에 확인하세요.'
};

export default function MembersPage() {
  return <MembersList />;
}
