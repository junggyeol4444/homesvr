'use client';

import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/storage';

function buildEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white`;
}

export function FeaturedVideo() {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.video);
      if (stored) {
        setVideoId(stored);
      }
    } catch (error) {
      console.error('하이라이트 영상을 불러오지 못했습니다.', error);
    }
  }, []);

  const embedUrl = useMemo(() => (videoId ? buildEmbedUrl(videoId) : null), [videoId]);

  return (
    <section className="glass-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">쌀가루집안</p>
          <h1 className="mt-2 text-3xl font-bold text-white">최신 하이라이트 영상</h1>
          <p className="mt-2 text-sm text-slate-300">관리자 페이지에서 YouTube 영상을 등록하면 이 영역에서 바로 확인할 수 있어요.</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-inner shadow-black/40">
        {embedUrl ? (
          <iframe
            title="featured-video"
            src={embedUrl}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-center text-slate-300">
            <span className="text-lg font-semibold text-white">등록된 하이라이트 영상이 없습니다.</span>
            <p className="text-sm text-slate-400">관리자 페이지에서 YouTube 주소나 영상 ID를 입력해 주세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
