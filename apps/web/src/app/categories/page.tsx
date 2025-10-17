import { CategoryGrid } from '../../components/category-grid';
import { apiFetch } from '../../lib/api-client';

export const revalidate = 300;

const CategoriesPage = async () => {
  const data = await apiFetch<{ categories: Array<{ id: string; name: string; slug: string; description?: string; productCount: number }> }>('/categories');
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">카테고리</h1>
        <p className="text-sm text-slate-400">카테고리별 스펙 필터와 추천 제품을 확인하세요.</p>
      </header>
      <CategoryGrid categories={data.categories} />
    </div>
  );
};

export default CategoriesPage;
