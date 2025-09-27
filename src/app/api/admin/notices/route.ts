import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Post } from '@/content/types';
import { isAdminRequest } from '@/lib/auth';
import { loadAdminPosts, saveAdminPosts } from '@/lib/admin-data';

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

function createSlug(title: string, existing: Post[]) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^0-9a-z\u3131-\uD79D\s-]/g, '')
    .replace(/\s+/g, '-');
  const fallback = base || randomUUID();
  let candidate = fallback;
  let counter = 1;
  while (existing.some((post) => post.slug === candidate)) {
    candidate = `${fallback}-${counter++}`;
  }
  return candidate;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }
  const posts = await loadAdminPosts();
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return NextResponse.json({ posts: sorted });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  try {
    const payload = await request.json();
    const title: string = payload.title?.toString().trim();
    const content: string = payload.body?.toString() ?? '';
    if (!title) {
      return NextResponse.json({ message: '제목은 필수 항목입니다.' }, { status: 400 });
    }

    const posts = await loadAdminPosts();
    const slug = createSlug(title, posts);
    const publishedAt = payload.publishedAt ? new Date(payload.publishedAt).toISOString() : new Date().toISOString();
    const newPost: Post = {
      id: randomUUID(),
      slug,
      title,
      body: content,
      tags: normaliseStringArray(payload.tags),
      publishedAt,
      author: payload.author?.toString() || '관리자',
      excerpt: payload.excerpt?.toString() || content.slice(0, 140)
    };

    if (payload.cover) {
      newPost.cover = payload.cover.toString();
    }
    if (payload.title_en) {
      newPost.title_en = payload.title_en.toString();
    }
    if (payload.body_en) {
      newPost.body_en = payload.body_en.toString();
    }
    if (payload.excerpt_en) {
      newPost.excerpt_en = payload.excerpt_en.toString();
    }

    const nextPosts = [newPost, ...posts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    await saveAdminPosts(nextPosts);

    return NextResponse.json({ post: newPost });
  } catch (error) {
    return NextResponse.json({ message: '공지 생성에 실패했습니다.' }, { status: 400 });
  }
}
