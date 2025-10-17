import { notFound } from 'next/navigation';
import type { ProductDto } from '@homesvr/types';
import { apiFetch } from '../../../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, Badge, PriceDelayBanner, AffiliateLabel, Button } from '@homesvr/ui';
import { PriceAlertForm } from '../../../components/price-alert-form';

export const revalidate = 60;

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  try {
    const product = await apiFetch<ProductDto>(`/products/${params.id}`);

    const lowest = [...product.prices].sort((a, b) => Number(a.amount) - Number(b.amount))[0];

    return (
      <div className="space-y-10">
        <header className="space-y-3">
          <Badge variant="outline" className="text-xs text-slate-300">
            {product.category.name}
          </Badge>
          <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
          <p className="text-sm text-slate-400">{product.summary}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span>브랜드: {product.brand}</span>
            <span>평점 {product.rating ?? '-'}</span>
            <span>리뷰 {product.reviewCount ?? 0}개</span>
          </div>
        </header>
        <PriceDelayBanner />
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">핵심 스펙</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200">
                  <p className="text-xs uppercase text-slate-400">{spec.category ?? '일반'}</p>
                  <p className="font-semibold text-white">{spec.label}</p>
                  <p className="text-xs text-slate-400">{spec.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">실시간 가격</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-200">
              {lowest ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-primary">
                    ₩{Number(lowest.amount).toLocaleString('ko-KR')}
                  </p>
                  <AffiliateLabel />
                  <a href={lowest.partnerLink ?? lowest.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400">
                    {lowest.retailerName ?? lowest.retailer}
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-400">가격 정보 수집 중</p>
              )}
              <div className="space-y-2">
                {product.prices.map((price) => (
                  <div key={price.id} className="flex items-center justify-between text-xs text-slate-400">
                    <span>{price.retailer ?? '리셀러'}</span>
                    <span>₩{Number(price.amount).toLocaleString('ko-KR')}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="secondary" size="sm">
                <a href="/compare">비교표에 추가하기</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        {product.compatibility.length > 0 && (
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">호환성 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 text-sm text-slate-300">
              {product.compatibility.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <PriceAlertForm />
      </div>
    );
  } catch (error) {
    notFound();
  }
};

export default ProductDetailPage;
