import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminPassword, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!password) {
    return NextResponse.json({ message: '비밀번호를 입력해 주세요.' }, { status: 400 });
  }

  const expectedHash = hashPassword(getAdminPassword());
  const receivedHash = hashPassword(password);

  if (expectedHash !== receivedHash) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: expectedHash,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: ADMIN_COOKIE_NAME, value: '', maxAge: 0, path: '/' });
  return response;
}
