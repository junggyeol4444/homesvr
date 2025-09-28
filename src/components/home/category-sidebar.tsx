'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ssalgageul-categories';
const defaultCategories = ['메인', '게임', '이야기', '먹방', '리뷰', 'VLOG', '이벤트'];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function CategorySidebar() {
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isStringArray(parsed) && parsed.length) {
        setCategories(parsed);
      }
    } catch (error) {
      console.error('카테고리를 불러오지 못했습니다.', error);
    }
  }, []);

  return (
    <aside className="glass-card flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-white">방송 카테고리</h2>
        <p className="mt-1 text-sm text-slate-300">관리자 페이지에서 자유롭게 추가하거나 정리할 수 있어요.</p>
      </div>
      <ul className="space-y-3">
        {categories.length ? (
          categories.map((category) => (
            <li
              key={category}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
            >
              <span>{category}</span>
              <span className="text-xs text-orange-300">LIVE</span>
            </li>
          ))
        ) : (
          <li className="rounded-2xl border border-dashed border-white/20 px-4 py-5 text-sm text-slate-300">
            등록된 카테고리가 없습니다. 관리자 페이지에서 추가해 주세요.
          </li>
        )}
      </ul>
      <Link
        href="/admin"
        className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
      >
        관리자 바로가기
      </Link>
    </aside>
  );
}
