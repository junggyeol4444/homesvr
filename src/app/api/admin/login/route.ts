import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authenticateAdmin, isAdminRequest, startAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (isAdminRequest(request)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false });
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!authenticateAdmin(password)) {
      return NextResponse.json({ message: '잘못된 비밀번호입니다.' }, { status: 401 });
    }
    startAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: '요청을 처리할 수 없습니다.' }, { status: 400 });
  }
}
