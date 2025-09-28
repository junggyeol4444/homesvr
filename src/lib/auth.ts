import { cookies as nextCookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE_NAME = 'admin-auth';

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? 'ssalgageul-family';
}

export function hashPassword(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function isAdminAuthenticated() {
  const cookieStore = nextCookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return false;
  }
  const expected = hashPassword(getAdminPassword());
  if (sessionCookie.value.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(sessionCookie.value, 'hex'), Buffer.from(expected, 'hex'));
  } catch (error) {
    console.error('관리자 인증을 확인하지 못했습니다.', error);
    return false;
  }
}
