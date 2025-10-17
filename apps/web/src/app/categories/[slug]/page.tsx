import { notFound } from 'next/navigation';
import { apiFetch } from '../../../lib/api-client';
import type { ProductDto } from '@homesvr/types';
import { CategoryProducts } from '../../../components/category-products';

export const revalidate = 120;

const CategoryDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { categories } = await apiFetch<{ categories: Array<{ id: string; name: string; slug: string; description?: string }> }>('/categories');
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    notFound();
  }

  const products = await apiFetch<{ items: ProductDto[] }>(`/products?category=${category.slug}&pageSize=12`);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">{category.name}</h1>
        <p className="text-sm text-slate-400">{category.description ?? '카테고리 스펙을 기반으로 추천을 제공합니다.'}</p>
      </header>
      <CategoryProducts categoryId={category.id} categorySlug={category.slug} initialProducts={products.items} />
    </div>
  );
};

export default CategoryDetailPage;
