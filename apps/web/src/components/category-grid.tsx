import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homesvr/ui';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
};

export const CategoryGrid = ({ categories }: { categories: Category[] }) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">카테고리 탐색</h2>
        <p className="text-sm text-slate-400">생활가전 · 오디오 · 게임 액세서리 · 전자책 리더</p>
      </div>
      <Link href="/categories" className="text-sm text-primary">
        전체 보기 →
      </Link>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {categories.map((category) => (
        <Card key={category.id} className="border-white/10 bg-white/5 transition hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{category.name}</CardTitle>
            <Badge variant="outline" className="border-white/20 text-xs text-slate-300">
              {category.productCount ?? 0}개 모델
            </Badge>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            <p>{category.description ?? '기본 제공 데이터 기반 추천'}</p>
            <div className="mt-4">
              <Link href={`/categories/${category.slug}`} className="text-sm text-primary">
                카테고리 상세 보기
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);
