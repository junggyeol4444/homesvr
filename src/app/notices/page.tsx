import type { Metadata } from 'next';
import Link from 'next/link';
import { NoticeArchive } from '@/components/notices/notice-archive';

export const metadata: Metadata = {
  title: '공지사항',
  description: '쌀가루집안의 최신 공지사항을 모두 확인하세요.'
};

export default function NoticesPage() {
  return (
    <div className="space-y-10">
      <header className="glass-card space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500 dark:text-orange-300">공지사항</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">쌀가루집안 새 소식 모아보기</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            관리자 페이지에서 직접 작성한 공지사항이 최신 순으로 정렬되어 표시됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="button-secondary h-10 px-5 text-xs">
            홈으로 돌아가기
          </Link>
          <Link href="/admin" className="button-secondary h-10 px-5 text-xs">
            관리자 페이지 이동
          </Link>
        </div>
      </header>

      <NoticeArchive />
    </div>
  );
}
