'use client';

import Link from 'next/link';
import { useStoredMembers } from '@/hooks/use-stored-members';

export function MembersList() {
  const { members, reload } = useStoredMembers();

  return (
    <div className="space-y-8">
      <header className="glass-card space-y-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">쌀가루집안</p>
          <h1 className="mt-2 text-3xl font-bold text-white">멤버 소개</h1>
        </div>
        <p className="text-sm text-slate-300">
          쌀가루집안을 함께 만들어 가는 멤버들의 프로필을 확인할 수 있어요. 각 카드는 자세한 소개 페이지로 이동합니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="button-secondary h-10 px-5 text-xs">
            관리자 페이지로 이동
          </Link>
          <button type="button" onClick={reload} className="button-secondary h-10 px-5 text-xs">
            목록 새로고침
          </button>
        </div>
      </header>

      {members.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/members/${encodeURIComponent(member.slug)}`}
              className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white transition hover:border-orange-300/70 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={`${member.name} 프로필 이미지`}
                    className="h-16 w-16 flex-none rounded-full border border-white/20 object-cover transition group-hover:border-orange-300/80"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-dashed border-white/20 text-sm text-slate-300">
                    NO IMG
                  </div>
                )}
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-white">{member.name}</h2>
                  {member.role ? <p className="text-sm text-orange-200">{member.role}</p> : null}
                </div>
              </div>
              {member.description ? (
                <p className="text-sm text-slate-200">{member.description}</p>
              ) : (
                <p className="text-sm text-slate-400">아직 소개글이 준비되지 않았습니다.</p>
              )}
              <span className="text-xs text-orange-300">프로필 자세히 보기 →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card space-y-3 text-center text-slate-300">
          <p className="text-lg font-semibold text-white">등록된 멤버가 없습니다.</p>
          <p className="text-sm">관리자 페이지에서 멤버 정보를 추가하면 이곳에서 확인할 수 있습니다.</p>
          <Link href="/admin" className="button-primary mx-auto w-full max-w-xs text-xs">
            관리자에서 멤버 추가하기
          </Link>
        </div>
      )}
    </div>
  );
}
