import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { loadAdminEpisodes, saveAdminEpisodes } from '@/lib/admin-data';

function unauthorized() {
  return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const episodes = await loadAdminEpisodes();
  const nextEpisodes = episodes.filter((episode) => episode.id !== params.id);
  if (nextEpisodes.length === episodes.length) {
    return NextResponse.json({ message: '존재하지 않는 일정입니다.' }, { status: 404 });
  }

  await saveAdminEpisodes(nextEpisodes);
  return NextResponse.json({ ok: true });
}
