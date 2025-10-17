import { HeroSection } from '../components/hero-section';
import { CategoryGrid } from '../components/category-grid';
import { ProductCard } from '../components/product-card';
import { apiFetch } from '../lib/api-client';
import type { ProductDto } from '@homesvr/types';

const getCategories = async () => {
  const data = await apiFetch<{ categories: Array<{ id: string; name: string; slug: string; description?: string; productCount: number }> }>('/categories');
  return data.categories;
};

const getTopProducts = async () => {
  const data = await apiFetch<{ items: ProductDto[] }>('/products?sort=rating&pageSize=6');
  return data.items;
};

const HomePage = async () => {
  const [categories, products] = await Promise.all([getCategories(), getTopProducts()]);

  return (
    <div className="space-y-16">
      <HeroSection />
      <CategoryGrid categories={categories} />
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">주요 추천 제품</h2>
            <p className="text-sm text-slate-400">데이터 기반 상위 랭킹 6개 모델</p>
          </div>
          <a href="/compare" className="text-sm text-primary">
            3-way 비교 바로가기 →
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
