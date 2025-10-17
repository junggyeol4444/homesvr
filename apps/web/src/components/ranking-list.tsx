import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@homesvr/ui';
import type { ProductDto } from '@homesvr/types';

export const RankingList = ({ items }: { items: Array<{ product: ProductDto; score: number }> }) => (
  <div className="grid gap-4">
    {items.map(({ product, score }, index) => (
      <Card key={product.id} className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs text-slate-300">
              #{index + 1}
            </Badge>
            <CardTitle className="text-white">{product.name}</CardTitle>
          </div>
          <span className="text-sm text-primary">가중치 점수: {score.toFixed(2)}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-slate-200">브랜드: {product.brand}</p>
            <p className="text-xs text-slate-400">평균 평점 {product.rating ?? 0} · 리뷰 {product.reviewCount ?? 0}개</p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <a href={`/products/${product.id}`}>상세 보기</a>
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);
