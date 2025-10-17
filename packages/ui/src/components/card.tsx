import type { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '../utils';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type CardHeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type CardTitleProps = PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>;

type CardDescriptionProps = PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>;

type CardContentProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type CardFooterProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      'rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition hover:shadow-lg',
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div className={cn('flex flex-col gap-1.5 border-b border-border/40 p-6', className)} {...props} />
);

export const CardTitle = ({ className, children, ...props }: CardTitleProps) => (
  <h3 className={cn('text-lg font-semibold tracking-tight text-foreground', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: CardDescriptionProps) => (
  <p className={cn('text-sm text-slate-400', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={cn('p-6 text-sm text-foreground', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: CardFooterProps) => (
  <div className={cn('flex items-center justify-end gap-2 border-t border-border/40 p-6', className)} {...props} />
);
