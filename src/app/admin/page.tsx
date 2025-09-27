import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { requireAdmin } from '@/lib/auth';
import { loadAdminEpisodes, loadAdminPosts } from '@/lib/admin-data';

export const metadata: Metadata = {
  title: '관리자 대시보드 — 쌀가루집안',
  description: '공지와 방송 일정을 관리하세요.'
};

export default async function AdminPage() {
  requireAdmin();
  const [posts, episodes] = await Promise.all([loadAdminPosts(), loadAdminEpisodes()]);

  return (
    <div className="container-responsive py-10">
      <AdminDashboard initialPosts={posts} initialEpisodes={episodes} />
    </div>
  );
}
