'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

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

const STORAGE_KEYS = {
  notices: 'ssalgageul-notices',
  schedule: 'ssalgageul-schedule',
  video: 'ssalgageul-featured-video',
  categories: 'ssalgageul-categories'
} as const;

const defaultCategories = ['메인', '게임', '이야기', '먹방', '리뷰', 'VLOG', '이벤트'];

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

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
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [videoId, setVideoId] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', description: '', date: '' });
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    setNotices(loadArrayFromStorage<Notice>(STORAGE_KEYS.notices, []));
    setSchedule(loadArrayFromStorage<ScheduleItem>(STORAGE_KEYS.schedule, []));
    const storedCategories = loadArrayFromStorage<string>(STORAGE_KEYS.categories, defaultCategories);
    setCategories(storedCategories.length ? storedCategories : defaultCategories);

    if (typeof window !== 'undefined') {
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

  function persistCategories(next: string[]) {
    setCategories(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(next));
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

  const handleCategoriesSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = categoryInput.trim();
    if (!trimmed) {
      setStatus('추가할 카테고리 이름을 입력해 주세요.');
      return;
    }
    const next = [...new Set([trimmed, ...categories])];
    persistCategories(next);
    setCategoryInput('');
    setStatus('카테고리가 추가되었습니다.');
  };

  const handleCategoryDelete = (target: string) => {
    const next = categories.filter((category) => category !== target);
    persistCategories(next);
    setStatus('카테고리가 삭제되었습니다.');
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
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">쌀가루집안</p>
          <h1 className="mt-2 text-3xl font-bold text-white">관리자 대시보드</h1>
          <p className="mt-2 text-sm text-slate-300">공지, 방송 일정, 카테고리, 하이라이트 영상을 직접 관리할 수 있습니다.</p>
        </div>
        <button onClick={handleLogout} className="button-secondary h-11 px-6 text-sm">로그아웃</button>
      </header>

      {status ? (
        <div className="glass-card border-l-4 border-orange-400 bg-orange-400/10 px-6 py-4 text-sm text-orange-200">
          {status}
        </div>
      ) : null}

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">하이라이트 영상</h2>
          <p className="text-sm text-slate-300">YouTube URL 또는 영상 ID를 입력하면 홈페이지에 즉시 반영됩니다.</p>
        </div>
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            YouTube 주소 또는 ID
            <input
              type="text"
              value={videoInput}
              onChange={(event) => setVideoInput(event.target.value)}
              placeholder="https://youtu.be/..."
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <button type="submit" className="button-primary">영상 저장</button>
        </form>
        {previewUrl ? (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-inner shadow-black/40">
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
          <h2 className="text-2xl font-semibold text-white">공지사항 관리</h2>
          <p className="text-sm text-slate-300">홈페이지에 노출될 공지를 작성하고 삭제할 수 있습니다.</p>
        </div>
        <form onSubmit={handleNoticeSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            제목
            <input
              type="text"
              value={noticeForm.title}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
            내용
            <textarea
              value={noticeForm.content}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, content: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="button-primary">공지 등록</button>
          </div>
        </form>
        <div className="space-y-3">
          {notices.length ? (
            notices.map((notice) => (
              <article key={notice.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{notice.title}</h3>
                    <time className="text-xs text-slate-400">
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
                <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">{notice.content}</p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-slate-300">
              등록된 공지사항이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">방송 일정 관리</h2>
          <p className="text-sm text-slate-300">다음 방송 계획을 등록하거나 정리할 수 있습니다.</p>
        </div>
        <form onSubmit={handleScheduleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            방송 제목
            <input
              type="text"
              value={scheduleForm.title}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            방송 예정일
            <input
              type="datetime-local"
              value={scheduleForm.date}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
            간단한 소개
            <textarea
              value={scheduleForm.description}
              onChange={(event) => setScheduleForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="button-primary">일정 등록</button>
          </div>
        </form>
        <div className="space-y-3">
          {schedule.length ? (
            schedule.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <time className="text-xs text-slate-400">
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
                <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">{item.description}</p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-slate-300">
              등록된 방송 일정이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="glass-card space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">카테고리 관리</h2>
          <p className="text-sm text-slate-300">홈페이지 왼쪽에 노출되는 카테고리 목록을 자유롭게 조정할 수 있습니다.</p>
        </div>
        <form onSubmit={handleCategoriesSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            placeholder="예) 게임"
            className="flex-1 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
          />
          <button type="submit" className="button-primary">카테고리 추가</button>
        </form>
        <div className="flex flex-wrap gap-3">
          {categories.length ? (
            categories.map((category) => (
              <div key={category} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryDelete(category)}
                  className="text-xs text-orange-200 hover:text-orange-100"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-300">등록된 카테고리가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
