import type { HTMLAttributes } from 'react';
import { Badge } from './badge';
import { cn } from '../utils';

export const AffiliateLabel = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <Badge
    variant="outline"
    className={cn('border-dashed bg-muted/40 text-[10px] font-medium uppercase tracking-widest text-slate-400', className)}
    {...props}
  >
    제휴 링크
  </Badge>
);
