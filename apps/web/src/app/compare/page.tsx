import { CompareTable } from '../../components/compare-table';
import { apiFetch } from '../../lib/api-client';
import type { ProductDto } from '@homesvr/types';

export const revalidate = 30;

const ComparePage = async () => {
  const data = await apiFetch<{ items: ProductDto[] }>('/products?pageSize=3&sort=rating');

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">3-way 비교표</h1>
        <p className="text-sm text-slate-400">선택한 제품을 스펙·가격·호환성 기준으로 비교합니다.</p>
      </header>
      <CompareTable products={data.items} />
    </div>
  );
};

export default ComparePage;
