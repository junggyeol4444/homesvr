import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'dev-admin-session-secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me';

function sign(value: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function isExpired(issuedAt: number) {
  if (Number.isNaN(issuedAt)) return true;
  const age = Date.now() - issuedAt;
  return age > ADMIN_SESSION_DURATION_SECONDS * 1000;
}

export function createSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  return `${issuedAt}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false;
  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;
  const expectedSignature = sign(issuedAt);
  try {
    const matches = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    return matches && !isExpired(Number(issuedAt));
  } catch (error) {
    return false;
  }
}

export function authenticateAdmin(password: string) {
  return password === ADMIN_PASSWORD;
}

export function startAdminSession() {
  const cookieStore = cookies();
  const token = createSessionToken();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
    path: '/'
  });
}

export function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    maxAge: 0,
    path: '/'
  });
}

export function isAdminAuthenticated() {
  return verifySessionToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }
}

export function isAdminRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION_SECONDS };
