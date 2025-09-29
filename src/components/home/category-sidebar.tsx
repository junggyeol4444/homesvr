'use client';

import Link from 'next/link';
import { useStoredMembers } from '@/hooks/use-stored-members';

export function CategorySidebar() {
  const { members } = useStoredMembers();

  return (
    <aside className="glass-card flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">멤버 카테고리</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">관리자 페이지에서 멤버 정보를 추가하거나 정리할 수 있어요.</p>
      </div>
      <ul className="space-y-3">
        {members.length ? (
          members.map((member) => (
            <li key={member.id}>
              <Link
                href={`/members/${encodeURIComponent(member.slug)}`}
                className="flex items-center justify-between rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-2 text-left text-sm text-slate-700 transition hover:border-orange-300/70 hover:bg-orange-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
              >
                <span className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-white">{member.name}</span>
                  {member.role ? <span className="text-xs text-slate-500 dark:text-slate-300">{member.role}</span> : null}
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-300">프로필</span>
              </Link>
            </li>
          ))
        ) : (
          <li className="rounded-2xl border border-dashed border-orange-200/70 px-4 py-5 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
            등록된 멤버가 없습니다. 관리자 페이지에서 추가해 주세요.
          </li>
        )}
      </ul>
      <div className="flex flex-col gap-2">
        <Link
          href="/members"
          className="inline-flex items-center justify-center rounded-full border border-orange-200/70 px-4 py-2 text-sm text-slate-700 transition hover:bg-orange-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
        >
          멤버 전체 보기
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-orange-200/70 px-4 py-2 text-sm text-slate-700 transition hover:bg-orange-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
        >
          관리자 바로가기
        </Link>
      </div>
    </aside>
  );
}
