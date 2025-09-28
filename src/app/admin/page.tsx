import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { isAdminAuthenticated } from '@/lib/auth';

export const metadata: Metadata = {
  title: '관리자 페이지 — 쌀가루집안',
  description: '쌀가루집안 홈페이지의 공지, 방송 일정, 카테고리를 관리합니다.'
};

export default function AdminPage() {
  const authenticated = isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 text-slate-100">
      <div className="container-responsive max-w-5xl space-y-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">쌀가루집안</p>
          <h1 className="mt-3 text-4xl font-bold text-white">관리자 영역</h1>
          <p className="mt-3 text-sm text-slate-300">
            이 페이지는 인증된 관리자만 접근할 수 있습니다. 관리자 비밀번호는 서버 환경 변수로 설정할 수 있습니다.
          </p>
        </div>
        {authenticated ? <AdminDashboard /> : <AdminLoginForm />}
      </div>
    </div>
  );
}
