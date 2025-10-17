'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, Badge, AffiliateLabel, PriceDelayBanner, Button } from '@homesvr/ui';
import type { ProductDto } from '@homesvr/types';
import { useComparisonStore } from '../store/comparison-store';

export const CompareTable = ({ products }: { products: ProductDto[] }) => {
  const { add, remove } = useComparisonStore();

  useEffect(() => {
    products.slice(0, 3).forEach((product) =>
      add({ id: product.id, name: product.name, brand: product.brand, score: product.rating ?? undefined })
    );
  }, [products, add]);

  if (!products.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        비교할 제품을 선택해 주세요.
      </div>
    );
  }

  const specs = Array.from(
    new Set(products.flatMap((product) => product.specs.map((spec) => spec.label)))
  );

  return (
    <div className="space-y-4">
      <PriceDelayBanner />
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableCell header>스펙</TableCell>
              {products.map((product) => (
                <TableCell key={product.id} header className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base font-semibold text-white">{product.name}</span>
                    <Badge variant="outline" className="text-xs text-slate-300">
                      {product.brand}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(product.id)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      제거
                    </Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {specs.map((label) => (
              <TableRow key={label}>
                <TableCell className="font-semibold text-slate-200">{label}</TableCell>
                {products.map((product) => {
                  const spec = product.specs.find((item) => item.label === label);
                  return (
                    <TableCell key={`${product.id}-${label}`} className="text-slate-200">
                      {spec?.value ?? '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold text-slate-200">최저가</TableCell>
              {products.map((product) => {
                const lowest = [...product.prices].sort((a, b) => Number(a.amount) - Number(b.amount))[0];
                return (
                  <TableCell key={`${product.id}-price`} className="space-y-2">
                    {lowest ? (
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-primary">
                          ₩{Number(lowest.amount).toLocaleString('ko-KR')}
                        </span>
                        <AffiliateLabel />
                        <a
                          href={lowest.partnerLink ?? lowest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-300"
                        >
                          {lowest.retailerName ?? lowest.retailer}
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">데이터 수집 중</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
