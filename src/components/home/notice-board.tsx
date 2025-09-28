'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/storage';

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

function isNoticeArray(value: unknown): value is Notice[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof (item as Notice).id === 'string' &&
        typeof (item as Notice).title === 'string' &&
        typeof (item as Notice).content === 'string' &&
        typeof (item as Notice).createdAt === 'string'
    )
  );
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return value;
  }
}

export function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.notices);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isNoticeArray(parsed)) {
        setNotices(parsed);
      }
    } catch (error) {
      console.error('공지사항을 불러오지 못했습니다.', error);
    }
  }, []);

  return (
    <section id="notices" className="glass-card space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">공지사항</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">중요한 안내를 여기에서 확인할 수 있어요.</p>
      </div>
      <div className="space-y-4">
        {notices.length ? (
          notices.slice(0, 5).map((notice) => (
            <article key={notice.id} className="rounded-2xl border border-orange-200/70 bg-white/80 p-4 shadow-sm shadow-orange-200/60 dark:border-white/5 dark:bg-black/30 dark:shadow-black/30">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{notice.title}</h3>
              <time className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{formatDate(notice.createdAt)}</time>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-200">{notice.content}</p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200/70 p-6 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
            등록된 공지사항이 없습니다. 관리자 페이지에서 직접 작성해 주세요.
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Link href="/notices" className="text-xs font-medium text-orange-600 underline-offset-4 hover:underline dark:text-orange-300">
          공지사항 전체 보기
        </Link>
      </div>
    </section>
  );
}
