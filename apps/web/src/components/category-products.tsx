'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { SpecFilterPanel } from './spec-filter-panel';
import { apiFetch } from '../lib/api-client';
import type { ProductDto } from '@homesvr/types';

export const CategoryProducts = ({
  categoryId,
  categorySlug,
  initialProducts
}: {
  categoryId: string;
  categorySlug: string;
  initialProducts: ProductDto[];
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('category', categorySlug);
    Object.entries(filters).forEach(([key, value]) => query.append(`spec_${key}`, value));

    const fetchProducts = async () => {
      setLoading(true);
      const data = await apiFetch<{ items: ProductDto[] }>(`/products?${query.toString()}`);
      setProducts(data.items);
      setLoading(false);
    };

    fetchProducts();
  }, [categorySlug, filters]);

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      <SpecFilterPanel categoryId={categoryId} onFilterChange={setFilters} />
      <div className="space-y-4">
        {loading && <p className="text-sm text-slate-400">필터 적용 중...</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && <p className="text-sm text-slate-400">조건에 맞는 제품이 없습니다.</p>}
      </div>
    </div>
  );
};
