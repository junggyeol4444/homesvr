import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';
import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '관리자 로그인 — 쌀가루집안',
  description: '관리자 전용 페이지에 접속하세요.'
};

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    redirect('/admin');
  }

  return (
    <div className="container-responsive flex min-h-[70vh] flex-col items-center justify-center gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">관리자 로그인</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          인증된 관리자만 공지와 일정을 등록할 수 있습니다.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
