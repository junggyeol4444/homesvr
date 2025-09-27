import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { loadAdminPosts, saveAdminPosts } from '@/lib/admin-data';

function unauthorized() {
  return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const posts = await loadAdminPosts();
  const nextPosts = posts.filter((post) => post.id !== params.id);
  if (nextPosts.length === posts.length) {
    return NextResponse.json({ message: '존재하지 않는 공지입니다.' }, { status: 404 });
  }
  await saveAdminPosts(nextPosts);
  return NextResponse.json({ ok: true });
}
