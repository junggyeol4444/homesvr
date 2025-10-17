import type { HTMLAttributes } from 'react';
import { cn } from '../utils';

export type PriceDelayBannerProps = HTMLAttributes<HTMLDivElement> & {
  message?: string;
};

export const PriceDelayBanner = ({ className, message, ...props }: PriceDelayBannerProps) => (
  <div
    role="status"
    className={cn(
      'flex items-center gap-3 rounded-lg border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm',
      className
    )}
    {...props}
  >
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 font-semibold text-amber-900">
      ℹ️
    </span>
    <p className="flex-1 text-sm font-medium">
      {message ?? '가격 및 재고 정보는 데이터 제공사의 지연이나 오류가 있을 수 있습니다. 최신 정보를 확인해 주세요.'}
    </p>
  </div>
);
