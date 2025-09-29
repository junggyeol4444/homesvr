'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useStoredMembers } from '@/hooks/use-stored-members';

interface MemberProfileProps {
  slug: string;
}

export function MemberProfile({ slug }: MemberProfileProps) {
  const { members, reload, isLoading } = useStoredMembers();
  const member = useMemo(() => members.find((item) => item.slug === slug) ?? null, [members, slug]);

  if (isLoading) {
    return (
      <div className="glass-card space-y-4 text-center text-slate-600 dark:text-slate-300">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">멤버 정보를 불러오는 중입니다.</p>
        <p className="text-sm">잠시만 기다려 주세요.</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="glass-card space-y-4 text-center text-slate-600 dark:text-slate-300">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">멤버 정보를 찾을 수 없습니다.</p>
        <p className="text-sm">주소가 정확한지 확인하거나 관리자 페이지에서 멤버를 등록해 주세요.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/members" className="button-secondary h-10 px-5 text-xs">
            멤버 목록으로 돌아가기
          </Link>
          <Link href="/admin" className="button-secondary h-10 px-5 text-xs">
            관리자 페이지 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="glass-card space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={`${member.name} 프로필 이미지`}
              className="h-24 w-24 rounded-full border border-orange-200/70 object-cover dark:border-white/20"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-orange-200/70 text-sm text-slate-500 dark:border-white/20 dark:text-slate-300">
              NO IMG
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{member.name}</h1>
            {member.role ? <p className="text-base text-orange-600 dark:text-orange-200">{member.role}</p> : null}
            <p className="text-xs text-slate-500 dark:text-slate-400">프로필 주소: /members/{member.slug}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/members" className="button-secondary h-10 px-5 text-xs">
            목록으로 돌아가기
          </Link>
          <button type="button" onClick={reload} className="button-secondary h-10 px-5 text-xs">
            정보 새로고침
          </button>
          <Link href="/admin" className="button-secondary h-10 px-5 text-xs">
            관리자 페이지 이동
          </Link>
        </div>
      </header>

      {member.description ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">소개</h2>
          <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-200">{member.description}</p>
        </section>
      ) : (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">소개</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">아직 등록된 소개가 없습니다. 관리자 페이지에서 내용을 추가해 보세요.</p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">연결 정보</h2>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-200">
          {member.profileUrl ? (
            <a
              href={member.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-orange-200/70 px-4 py-2 text-xs text-orange-600 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/20 dark:text-orange-200 dark:hover:border-orange-300 dark:hover:text-orange-100"
            >
              외부 프로필 방문하기
            </a>
          ) : (
            <span className="rounded-full border border-dashed border-orange-200/70 px-4 py-2 text-xs text-slate-500 dark:border-white/20 dark:text-slate-400">
              등록된 외부 링크가 없습니다.
            </span>
          )}
        </div>
      </section>

      {member.createdAt ? (
        <footer className="text-right text-xs text-slate-500 dark:text-slate-400">
          최초 등록일 {new Date(member.createdAt).toLocaleString('ko-KR')}
        </footer>
      ) : null}
    </article>
  );
}
