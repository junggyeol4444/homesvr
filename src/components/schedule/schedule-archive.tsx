'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/lib/storage';

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

function isScheduleArray(value: unknown): value is ScheduleItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof (item as ScheduleItem).id === 'string' &&
        typeof (item as ScheduleItem).title === 'string' &&
        typeof (item as ScheduleItem).description === 'string' &&
        typeof (item as ScheduleItem).date === 'string'
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

export function ScheduleArchive() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.schedule);
      if (!stored) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(stored);
      if (isScheduleArray(parsed)) {
        setItems(parsed);
      }
    } catch (error) {
      console.error('방송 일정을 불러오지 못했습니다.', error);
    }
  }, []);

  if (!items.length) {
    return (
      <div className="glass-card space-y-4 text-center text-slate-600 dark:text-slate-300">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">등록된 방송 일정이 없습니다.</p>
        <p className="text-sm">관리자 페이지에서 일정을 등록하면 이곳에서 확인할 수 있습니다.</p>
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
      {items.map((item) => (
        <article key={item.id} className="glass-card space-y-3">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{item.title}</h2>
            <time className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-400/20 dark:text-orange-200">
              {formatDate(item.date)}
            </time>
          </header>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">{item.description || '설명이 등록되지 않았습니다.'}</p>
        </article>
      ))}
    </div>
  );
}
