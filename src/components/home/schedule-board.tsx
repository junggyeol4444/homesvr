'use client';

import { useEffect, useState } from 'react';
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return value;
  }
}

export function ScheduleBoard() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.schedule);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isScheduleArray(parsed)) {
        setItems(parsed);
      }
    } catch (error) {
      console.error('방송 일정을 불러오지 못했습니다.', error);
    }
  }, []);

  return (
    <section id="schedule" className="glass-card space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">다가오는 방송 일정</h2>
        <p className="text-sm text-slate-300">곧 만날 방송 계획을 한눈에 볼 수 있어요.</p>
      </div>
      <div className="space-y-4">
        {items.length ? (
          items.slice(0, 5).map((item) => (
            <article key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/30 p-4">
              <div className="mt-1 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-semibold text-orange-200">
                {formatDate(item.date)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-200 whitespace-pre-line">{item.description}</p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-slate-300">
            예정된 방송이 없습니다. 관리자 페이지에서 방송 일정을 등록해 주세요.
          </div>
        )}
      </div>
    </section>
  );
}
