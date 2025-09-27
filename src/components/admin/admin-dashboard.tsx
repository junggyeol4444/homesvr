'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Episode, Post } from '@/content/types';

interface AdminDashboardProps {
  initialPosts: Post[];
  initialEpisodes: Episode[];
}

type NoticeFormState = {
  title: string;
  body: string;
  tags: string;
  publishedAt: string;
  author: string;
  cover: string;
};

type ScheduleFormState = {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  platform: Episode['platform'];
  url: string;
  thumbnail: string;
  series: string;
  guests: string;
  tags: string;
};

const defaultNoticeForm: NoticeFormState = {
  title: '',
  body: '',
  tags: '',
  publishedAt: '',
  author: '관리자',
  cover: ''
};

const defaultScheduleForm: ScheduleFormState = {
  title: '',
  description: '',
  startAt: '',
  endAt: '',
  platform: 'youtube',
  url: '',
  thumbnail: '',
  series: '',
  guests: '',
  tags: ''
};

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

export function AdminDashboard({ initialPosts, initialEpisodes }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'notices' | 'schedule'>('notices');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [noticeForm, setNoticeForm] = useState<NoticeFormState>(defaultNoticeForm);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormState>(defaultScheduleForm);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const anyData = useMemo(() => posts.length + episodes.length > 0, [posts.length, episodes.length]);

  function resetNoticeForm() {
    setNoticeForm(defaultNoticeForm);
  }

  function resetScheduleForm() {
    setScheduleForm(defaultScheduleForm);
  }

  async function handleNoticeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoticeLoading(true);
    setNoticeMessage(null);
    setNoticeError(null);
    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noticeForm,
          tags: noticeForm.tags,
          publishedAt: noticeForm.publishedAt || undefined
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setNoticeError(data.message ?? '공지 등록에 실패했습니다.');
        return;
      }
      const data = await response.json();
      setPosts((prev) => {
        const next = [data.post as Post, ...prev.filter((post) => post.id !== data.post.id)];
        return next.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      });
      setNoticeMessage('공지 등록이 완료되었습니다.');
      resetNoticeForm();
      router.refresh();
    } catch (error) {
      setNoticeError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setNoticeLoading(false);
    }
  }

  async function handleScheduleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScheduleLoading(true);
    setScheduleMessage(null);
    setScheduleError(null);
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheduleForm,
          tags: scheduleForm.tags,
          series: scheduleForm.series,
          guests: scheduleForm.guests
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setScheduleError(data.message ?? '일정 등록에 실패했습니다.');
        return;
      }
      const data = await response.json();
      setEpisodes((prev) => {
        const next = [...prev.filter((episode) => episode.id !== data.episode.id), data.episode as Episode];
        return next.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      });
      setScheduleMessage('일정 등록이 완료되었습니다.');
      resetScheduleForm();
      router.refresh();
    } catch (error) {
      setScheduleError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setScheduleLoading(false);
    }
  }

  async function handleDeleteNotice(id: string) {
    if (!confirm('해당 공지를 삭제하시겠습니까?')) return;
    const response = await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
      router.refresh();
    }
  }

  async function handleDeleteSchedule(id: string) {
    if (!confirm('해당 일정을 삭제하시겠습니까?')) return;
    const response = await fetch(`/api/admin/schedule/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setEpisodes((prev) => prev.filter((episode) => episode.id !== id));
      router.refresh();
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">쌀가루집안 관리자 도구</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              공지와 방송 일정을 실시간으로 등록하고 관리하세요. 저장 즉시 홈페이지에 반영됩니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1">
              현재 등록된 항목 {posts.length + episodes.length}개
            </span>
            <button type="button" className="button-secondary border-white/40 text-white hover:bg-white/10" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 rounded-full border border-slate-200 p-2 text-sm dark:border-slate-700" role="tablist">
        <button
          type="button"
          className={`rounded-full px-4 py-1 font-medium transition ${
            activeTab === 'notices' ? 'bg-brand-600 text-white shadow' : 'text-slate-700 dark:text-slate-300'
          }`}
          onClick={() => setActiveTab('notices')}
          role="tab"
          aria-selected={activeTab === 'notices'}
        >
          공지 관리
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-1 font-medium transition ${
            activeTab === 'schedule' ? 'bg-brand-600 text-white shadow' : 'text-slate-700 dark:text-slate-300'
          }`}
          onClick={() => setActiveTab('schedule')}
          role="tab"
          aria-selected={activeTab === 'schedule'}
        >
          일정 관리
        </button>
      </div>

      {activeTab === 'notices' ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleNoticeSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">제목</label>
              <input
                required
                value={noticeForm.title}
                onChange={(event) => setNoticeForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">본문 (마크다운 지원)</label>
              <textarea
                required
                rows={6}
                value={noticeForm.body}
                onChange={(event) => setNoticeForm((prev) => ({ ...prev, body: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">태그 (쉼표로 구분)</label>
                <input
                  value={noticeForm.tags}
                  onChange={(event) => setNoticeForm((prev) => ({ ...prev, tags: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">발행일</label>
                <input
                  type="datetime-local"
                  value={noticeForm.publishedAt}
                  onChange={(event) => setNoticeForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">작성자</label>
                <input
                  value={noticeForm.author}
                  onChange={(event) => setNoticeForm((prev) => ({ ...prev, author: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">대표 이미지 URL (선택)</label>
                <input
                  value={noticeForm.cover}
                  onChange={(event) => setNoticeForm((prev) => ({ ...prev, cover: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            {noticeError ? <p className="text-sm text-red-500">{noticeError}</p> : null}
            {noticeMessage ? <p className="text-sm text-brand-600">{noticeMessage}</p> : null}
            <div className="flex justify-end gap-3">
              <button type="button" className="button-secondary" onClick={resetNoticeForm} disabled={noticeLoading}>
                초기화
              </button>
              <button type="submit" className="button-primary" disabled={noticeLoading}>
                {noticeLoading ? '저장 중...' : '공지 등록'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">등록된 공지</h2>
            <div className="space-y-3">
              {posts.length ? (
                posts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{dateFormatter.format(new Date(post.publishedAt))}</p>
                      </div>
                      <button type="button" className="text-xs text-red-500 hover:text-red-600" onClick={() => handleDeleteNotice(post.id)}>
                        삭제
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{post.tags.join(', ') || '태그 없음'}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  아직 등록된 공지가 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleScheduleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">제목</label>
              <input
                required
                value={scheduleForm.title}
                onChange={(event) => setScheduleForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">설명 (선택)</label>
              <textarea
                rows={4}
                value={scheduleForm.description}
                onChange={(event) => setScheduleForm((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">시작 시간</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleForm.startAt}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, startAt: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">종료 시간 (선택)</label>
                <input
                  type="datetime-local"
                  value={scheduleForm.endAt}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, endAt: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">플랫폼</label>
                <select
                  value={scheduleForm.platform}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, platform: event.target.value as Episode['platform'] }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="youtube">YouTube</option>
                  <option value="chzzk">치지직</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">시청 링크</label>
                <input
                  required
                  value={scheduleForm.url}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, url: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">썸네일 URL (선택)</label>
                <input
                  value={scheduleForm.thumbnail}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">시리즈 (쉼표로 구분)</label>
                <input
                  value={scheduleForm.series}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, series: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">게스트 (쉼표로 구분)</label>
                <input
                  value={scheduleForm.guests}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, guests: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">태그 (쉼표로 구분)</label>
                <input
                  value={scheduleForm.tags}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, tags: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            {scheduleError ? <p className="text-sm text-red-500">{scheduleError}</p> : null}
            {scheduleMessage ? <p className="text-sm text-brand-600">{scheduleMessage}</p> : null}
            <div className="flex justify-end gap-3">
              <button type="button" className="button-secondary" onClick={resetScheduleForm} disabled={scheduleLoading}>
                초기화
              </button>
              <button type="submit" className="button-primary" disabled={scheduleLoading}>
                {scheduleLoading ? '저장 중...' : '일정 등록'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">등록된 일정</h2>
            <div className="space-y-3">
              {episodes.length ? (
                episodes
                  .slice()
                  .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                  .map((episode) => (
                    <div key={episode.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{episode.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {dateFormatter.format(new Date(episode.startAt))} · {episode.platform.toUpperCase()}
                          </p>
                        </div>
                        <button type="button" className="text-xs text-red-500 hover:text-red-600" onClick={() => handleDeleteSchedule(episode.id)}>
                          삭제
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{episode.tags.join(', ') || '태그 없음'}</p>
                    </div>
                  ))
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  아직 등록된 일정이 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {!anyData ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          첫 공지와 일정을 등록하면 홈페이지에 바로 노출됩니다.
        </p>
      ) : null}
    </div>
  );
}
