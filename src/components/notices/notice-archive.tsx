'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export function NoticeArchive() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.notices);
      if (!stored) {
        setNotices([]);
        return;
      }
      const parsed = JSON.parse(stored);
      if (isNoticeArray(parsed)) {
        setNotices(parsed);
      }
    } catch (error) {
      console.error('공지사항을 불러오지 못했습니다.', error);
    }
  }, []);

  if (!notices.length) {
    return (
      <div className="glass-card space-y-4 text-center text-slate-600 dark:text-slate-300">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">등록된 공지사항이 없습니다.</p>
        <p className="text-sm">관리자 페이지에서 공지를 작성하면 이곳에서 확인할 수 있습니다.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/admin" className="button-secondary h-10 px-5 text-xs">
            관리자 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notices.map((notice) => (
        <article key={notice.id} className="glass-card space-y-3">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{notice.title}</h2>
            <time className="block text-xs text-slate-500 dark:text-slate-400">{formatDate(notice.createdAt)}</time>
          </header>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">{notice.content}</p>
        </article>
      ))}
    </div>
  );
}
