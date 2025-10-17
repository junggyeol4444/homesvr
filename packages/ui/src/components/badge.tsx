import type { HTMLAttributes } from 'react';
import { cn } from '../utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
};

const variantClassMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary/90 text-primary-foreground',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-black',
  danger: 'bg-red-500 text-white',
  outline: 'border border-border/60 text-foreground'
};

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
      variantClassMap[variant],
      className
    )}
    {...props}
  />
);
