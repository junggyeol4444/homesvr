import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from '../utils';

type TableProps = TableHTMLAttributes<HTMLTableElement>;

export const Table = ({ className, ...props }: TableProps) => (
  <div className="w-full overflow-x-auto">
    <table
      className={cn('w-full border-collapse rounded-lg border border-border/60 text-sm', className)}
      {...props}
    />
  </div>
);

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  header?: boolean;
};

export const TableHeader = ({ className, ...props }: TableHeaderProps) => (
  <thead className={cn('bg-muted/70 text-xs uppercase tracking-wide text-slate-400', className)} {...props} />
);

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('divide-y divide-border/60', className)} {...props} />
);

export const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr className={cn('transition hover:bg-muted/40', className)} {...props} />
);

export const TableCell = ({ className, header, ...props }: TableCellProps) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'whitespace-nowrap px-4 py-3 text-left align-top text-foreground',
        header ? 'font-semibold text-xs uppercase tracking-wide' : 'text-sm',
        className
      )}
      {...props}
    />
  );
};
