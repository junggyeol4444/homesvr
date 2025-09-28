'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { generateId } from '@/lib/id';
import { membersFromLegacyCategories, normalizeStoredMembers } from '@/lib/members';
import { STORAGE_KEYS } from '@/lib/storage';
import { createUniqueSlug } from '@/lib/slug';
import type { StoredMember } from '@/types/stored-member';

type Notice = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type ScheduleItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

function normalizeVideoInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (youtubeIdPattern.test(trimmed)) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'youtu.be') {
      return url.pathname.replace('/', '');
    }
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v') ?? '';
    }
  } catch (error) {
    console.warn('알 수 없는 YouTube 주소 형식입니다.', error);
  }
  return '';
}

function loadArrayFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
  } catch (error) {
    console.error(`${key} 데이터를 불러오지 못했습니다.`, error);
  }
  return fallback;
}

export function AdminDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [members, setMembers] = useState<StoredMember[]>([]);
  const [videoId, setVideoId] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', description: '', date: '' });
  const [memberForm, setMemberForm] = useState({ name: '', role: '', description: '', profileUrl: '', avatarUrl: '' });

  useEffect(() => {
    setNotices(loadArrayFromStorage<Notice>(STORAGE_KEYS.notices, []));
    setSchedule(loadArrayFromStorage<ScheduleItem>(STORAGE_KEYS.schedule, []));

    if (typeof window !== 'undefined') {
      try {
        const rawMembers = window.localStorage.getItem(STORAGE_KEYS.members);
        if (rawMembers) {
          const parsed = JSON.parse(rawMembers);
          const normalized = normalizeStoredMembers(parsed);
          setMembers(normalized);
          window.localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(normalized));
        } else {
          const legacy = window.localStorage.getItem(STORAGE_KEYS.legacyCategories);
          if (legacy) {
            const parsedLegacy = JSON.parse(legacy);
            const migrated = membersFromLegacyCategories(parsedLegacy);
            setMembers(migrated);
            if (migrated.length) {
              window.localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(migrated));
            }
          } else {
            setMembers([]);
          }
        }
      } catch (error) {
        console.error('멤버 정보를 불러오지 못했습니다.', error);
        setMembers([]);
      }

      const storedVideo = window.localStorage.getItem(STORAGE_KEYS.video);
      if (storedVideo) {
        setVideoId(storedVideo);
        setVideoInput(`https://youtu.be/${storedVideo}`);
      }
    }
  }, []);

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(null), 4000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [status]);

  const previewUrl = useMemo(() => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }, [videoId]);

  function persistNotices(next: Notice[]) {
    setNotices(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.notices, JSON.stringify(next));
    }
  }

  function persistSchedule(next: ScheduleItem[]) {
    setSchedule(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(next));
    }
  }

  function persistMembers(next: StoredMember[]) {
    setMembers(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(next));
    }
  }

  const handleNoticeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = noticeForm.title.trim();
    const trimmedContent = noticeForm.content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setStatus('공지사항 제목과 내용을 모두 입력해 주세요.');
      return;
    }
    const next = [
      { id: generateId(), title: trimmedTitle, content: trimmedContent, createdAt: new Date().toISOString() },
      ...notices
    ];
    persistNotices(next);
    setNoticeForm({ title: '', content: '' });
    setStatus('새 공지사항이 등록되었습니다.');
  };

  const handleNoticeDelete = (id: string) => {
    const next = notices.filter((notice) => notice.id !== id);
    persistNotices(next);
    setStatus('공지사항이 삭제되었습니다.');
  };

  const handleScheduleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = scheduleForm.title.trim();
    if (!trimmedTitle || !scheduleForm.date) {
      setStatus('방송 제목과 일정을 입력해 주세요.');
      return;
    }
    const next = [
      { id: generateId(), title: trimmedTitle, description: scheduleForm.description.trim(), date: scheduleForm.date },
      ...schedule
    ];
    persistSchedule(next);
    setScheduleForm({ title: '', description: '', date: '' });
    setStatus('새 방송 일정이 등록되었습니다.');
  };

  const handleScheduleDelete = (id: string) => {
    const next = schedule.filter((item) => item.id !== id);
    persistSchedule(next);
    setStatus('방송 일정이 삭제되었습니다.');
  };

  const handleVideoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeVideoInput(videoInput);
    if (!normalized) {
      setStatus('YouTube 영상 URL 또는 ID를 정확히 입력해 주세요.');
      return;
    }
    setVideoId(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.video, normalized);
    }
    setVideoInput(`https://youtu.be/${normalized}`);
    setStatus('하이라이트 영상이 업데이트되었습니다.');
  };

  const handleMemberSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = memberForm.name.trim();
    if (!trimmedName) {
      setStatus('멤버 이름을 입력해 주세요.');
      return;
    }

    const usedSlugs = new Set(members.map((member) => member.slug));
    const slug = createUniqueSlug(trimmedName, usedSlugs);
    const trimmedRole = memberForm.role.trim();
    const trimmedDescription = memberForm.description.trim();
    const trimmedProfileUrl = memberForm.profileUrl.trim();
    const trimmedAvatarUrl = memberForm.avatarUrl.trim();

    const nextMember: StoredMember = {
      id: generateId(),
      name: trimmedName,
      slug,
      role: trimmedRole || undefined,
      description: trimmedDescription || undefined,
      profileUrl: trimmedProfileUrl || undefined,
      avatarUrl: trimmedAvatarUrl || undefined,
      createdAt: new Date().toISOString()
    };

    const next = [nextMember, ...members];
    persistMembers(next);
    setMemberForm({ name: '', role: '', description: '', profileUrl: '', avatarUrl: '' });
    setStatus('새 멤버가 등록되었습니다.');
  };

  const handleMemberDelete = (id: string) => {
    const next = members.filter((member) => member.id !== id);
    persistMembers(next);
    setStatus('멤버가 삭제되었습니다.');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10">
      <header className="glass-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500 dark:text-orange-300">쌀가루집안</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">관리자 대시보드</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">공지, 방송 일정, 멤버, 하이라이트 영상을 직접 관리할 수 있습니다.</p>
        </div>
        <button onClick={handleLogout} className="button-secondary h-11 px-6 text-sm">로그아웃</button>
      </header>

      {status ? (
        <div className="glass-card border-l-4 border-orange-400 bg-orange-100/60 px-6 py-4 text-sm text-orange-600 dark:bg-orange-400/10 dark:text-orange-200">
          {status}
        </div>
      ) : null}

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">하이라이트 영상</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">YouTube URL 또는 영상 ID를 입력하면 홈페이지에 즉시 반영됩니다.</p>
        </div>
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            YouTube 주소 또는 ID
            <input
              type="text"
              value={videoInput}
              onChange={(event) => setVideoInput(event.target.value)}
              placeholder="https://youtu.be/..."
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <button type="submit" className="button-primary">영상 저장</button>
        </form>
        {previewUrl ? (
          <div className="overflow-hidden rounded-3xl border border-orange-200/70 bg-white/80 shadow-inner shadow-orange-200/60 dark:border-white/10 dark:bg-black/60 dark:shadow-black/40">
            <iframe
              title="video-preview"
              src={previewUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </section>

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">공지사항 관리</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">홈페이지에 노출될 공지를 작성하고 삭제할 수 있습니다.</p>
        </div>
        <form onSubmit={handleNoticeSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            제목
            <input
              type="text"
              value={noticeForm.title}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            내용
            <textarea
              value={noticeForm.content}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, content: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="button-primary">공지 등록</button>
          </div>
        </form>
        <div className="space-y-3">
          {notices.length ? (
            notices.map((notice) => (
              <article key={notice.id} className="rounded-2xl border border-orange-200/70 bg-white/80 p-4 shadow-sm shadow-orange-200/60 dark:border-white/10 dark:bg-black/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notice.title}</h3>
                    <time className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(notice.createdAt).toLocaleString('ko-KR')}
                    </time>
                  </div>
                  <button
                    onClick={() => handleNoticeDelete(notice.id)}
                    className="button-secondary h-10 px-4 text-xs"
                    type="button"
                  >
                    삭제
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">{notice.content}</p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-orange-200/70 px-4 py-6 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
              등록된 공지사항이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">방송 일정 관리</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">다음 방송 계획을 등록하거나 정리할 수 있습니다.</p>
        </div>
        <form onSubmit={handleScheduleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            방송 제목
            <input
              type="text"
              value={scheduleForm.title}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            방송 예정일
            <input
              type="datetime-local"
              value={scheduleForm.date}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            간단한 소개
            <textarea
              value={scheduleForm.description}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="button-primary">일정 등록</button>
          </div>
        </form>
        <div className="space-y-3">
          {schedule.length ? (
            schedule.map((item) => (
              <article key={item.id} className="rounded-2xl border border-orange-200/70 bg-white/80 p-4 shadow-sm shadow-orange-200/60 dark:border-white/10 dark:bg-black/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <time className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.date).toLocaleString('ko-KR')}
                    </time>
                  </div>
                  <button
                    onClick={() => handleScheduleDelete(item.id)}
                    className="button-secondary h-10 px-4 text-xs"
                    type="button"
                  >
                    삭제
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">{item.description}</p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-orange-200/70 px-4 py-6 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
              등록된 방송 일정이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">멤버 관리</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">홈페이지 사이드바와 멤버 페이지에서 소개될 멤버 정보를 추가하거나 수정할 수 있습니다.</p>
        </div>
        <form onSubmit={handleMemberSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            이름
            <input
              type="text"
              value={memberForm.name}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="예) 쌀가루"
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            역할 (선택)
            <input
              type="text"
              value={memberForm.role}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, role: event.target.value }))}
              placeholder="예) 메인 스트리머"
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            소개 (선택)
            <textarea
              value={memberForm.description}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              placeholder="멤버에 대한 간단한 설명을 작성해 주세요."
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            외부 프로필 링크 (선택)
            <input
              type="url"
              value={memberForm.profileUrl}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, profileUrl: event.target.value }))}
              placeholder="https://"
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            대표 이미지 URL (선택)
            <input
              type="url"
              value={memberForm.avatarUrl}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
              placeholder="https://"
              className="rounded-2xl border border-orange-200/70 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60 dark:border-white/20 dark:bg-black/40 dark:text-white"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="button-primary">멤버 추가</button>
          </div>
        </form>
        <div className="space-y-3">
          {members.length ? (
            members.map((member) => (
              <article key={member.id} className="rounded-2xl border border-orange-200/70 bg-white/80 p-4 shadow-sm shadow-orange-200/60 dark:border-white/10 dark:bg-black/40">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={`${member.name} 프로필 이미지`}
                        className="h-16 w-16 flex-none rounded-full border border-orange-200/70 object-cover dark:border-white/20"
                      />
                    ) : null}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                        {member.role ? (
                          <span className="rounded-full border border-orange-200/80 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:border-orange-300/60 dark:bg-orange-400/10 dark:text-orange-200">
                            {member.role}
                          </span>
                        ) : null}
                      </div>
                      {member.description ? (
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">{member.description}</p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-slate-700 dark:bg-white/5 dark:text-slate-200">/members/{member.slug}</span>
                        {member.profileUrl ? (
                          <a
                            href={member.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-500 dark:text-orange-200 dark:hover:text-orange-100"
                          >
                            외부 링크
                          </a>
                        ) : null}
                        {member.createdAt ? (
                          <time className="text-slate-500">
                            등록일 {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                          </time>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/members/${encodeURIComponent(member.slug)}`}
                      className="button-secondary h-10 px-4 text-xs"
                    >
                      멤버 페이지 보기
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleMemberDelete(member.id)}
                      className="button-secondary h-10 px-4 text-xs text-orange-600 hover:text-orange-500 dark:text-orange-200 dark:hover:text-orange-100"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-orange-200/70 px-4 py-6 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
              등록된 멤버가 없습니다. 위 양식을 통해 멤버를 추가해 주세요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
