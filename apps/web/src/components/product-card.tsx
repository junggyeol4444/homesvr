import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, AffiliateLabel } from '@homesvr/ui';
import type { ProductDto } from '@homesvr/types';

export const ProductCard = ({ product }: { product: ProductDto }) => {
  const lowest = [...product.prices].sort((a, b) => Number(a.amount) - Number(b.amount))[0];

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">{product.name}</CardTitle>
        <CardDescription className="text-slate-300">{product.summary ?? `${product.brand} 대표 모델`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-slate-300">
        <div className="flex flex-wrap gap-2">
          {product.specs.slice(0, 3).map((spec) => (
            <Badge key={spec.id} variant="outline" className="text-xs text-slate-300">
              {spec.label}: {spec.value}
            </Badge>
          ))}
        </div>
        {lowest && (
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-primary">
              ₩{Number(lowest.amount).toLocaleString('ko-KR')}
            </span>
            <AffiliateLabel />
            <a href={lowest.partnerLink ?? lowest.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400">
              {lowest.retailerName ?? lowest.retailer}
            </a>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">평점 {product.rating ?? '-'} · 리뷰 {product.reviewCount ?? 0}</span>
          <Button asChild size="sm">
            <Link href={`/products/${product.id}`}>상세 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
