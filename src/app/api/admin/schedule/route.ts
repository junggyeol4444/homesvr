import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Episode } from '@/content/types';
import { isAdminRequest } from '@/lib/auth';
import { loadAdminEpisodes, saveAdminEpisodes } from '@/lib/admin-data';

const allowedPlatforms: Episode['platform'][] = ['youtube', 'chzzk', 'tiktok'];

function unauthorized() {
  return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
}

function normaliseStringArray(input: unknown) {
  if (!input) return [] as string[];
  if (Array.isArray(input)) {
    return input.map((value) => `${value}`.trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [] as string[];
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }
  const episodes = await loadAdminEpisodes();
  const sorted = episodes.slice().sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  return NextResponse.json({ episodes: sorted });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  try {
    const payload = await request.json();
    const title: string = payload.title?.toString().trim();
    if (!title) {
      return NextResponse.json({ message: '제목은 필수 항목입니다.' }, { status: 400 });
    }

    const startAtInput = payload.startAt ? new Date(payload.startAt) : null;
    if (!startAtInput || Number.isNaN(startAtInput.getTime())) {
      return NextResponse.json({ message: '시작 시간 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const endAtInput = payload.endAt ? new Date(payload.endAt) : null;
    if (endAtInput && Number.isNaN(endAtInput.getTime())) {
      return NextResponse.json({ message: '종료 시간 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const platform = payload.platform?.toString() as Episode['platform'];
    if (!allowedPlatforms.includes(platform)) {
      return NextResponse.json({ message: '플랫폼을 선택해주세요.' }, { status: 400 });
    }

    const url = payload.url?.toString().trim();
    if (!url) {
      return NextResponse.json({ message: '시청 링크를 입력해주세요.' }, { status: 400 });
    }

    const episodes = await loadAdminEpisodes();
    const newEpisode: Episode = {
      id: randomUUID(),
      title,
      description: payload.description?.toString() ?? '',
      startAt: startAtInput.toISOString(),
      endAt: endAtInput ? endAtInput.toISOString() : undefined,
      platform,
      url,
      thumbnail: payload.thumbnail?.toString() || 'https://placehold.co/600x400?text=Ssalgaru',
      series: normaliseStringArray(payload.series),
      guests: normaliseStringArray(payload.guests),
      tags: normaliseStringArray(payload.tags),
      published: payload.published !== false
    };

    const nextEpisodes = [...episodes, newEpisode].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
    await saveAdminEpisodes(nextEpisodes);

    return NextResponse.json({ episode: newEpisode });
  } catch (error) {
    return NextResponse.json({ message: '일정 생성에 실패했습니다.' }, { status: 400 });
  }
}
