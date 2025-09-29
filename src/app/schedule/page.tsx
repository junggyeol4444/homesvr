import type { Metadata } from 'next';
import Link from 'next/link';
import { ScheduleArchive } from '@/components/schedule/schedule-archive';

export const metadata: Metadata = {
  title: '방송 일정',
  description: '쌀가루집안의 예정된 방송 일정을 확인하세요.'
};

export default function SchedulePage() {
  return (
    <div className="space-y-10">
      <header className="glass-card space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500 dark:text-orange-300">방송 일정</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">다가오는 방송 계획</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            등록된 일정은 최신 순으로 정렬되어 있으며, 관리자 페이지에서 언제든지 수정할 수 있습니다.
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

      <ScheduleArchive />
    </div>
  );
}
