import { useEffect, useRef } from 'react';
import type { PropsWithChildren, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

type DialogProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onOpenChange(false);
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', () => onOpenChange(false));
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      className={cn(
        'backdrop:bg-black/60 rounded-xl border border-border/60 bg-background p-0 text-foreground shadow-xl'
      )}
    >
      {children}
    </dialog>
  );
};

type DialogContentProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type DialogHeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type DialogTitleProps = PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>;

type DialogDescriptionProps = PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>;

export const DialogContent = ({ className, ...props }: DialogContentProps) => (
  <div className={cn('flex flex-col gap-4 p-6', className)} {...props} />
);

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn('flex flex-col gap-1', className)} {...props} />
);

export const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => (
  <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props}>
    {children}
  </h2>
);

export const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => (
  <p className={cn('text-sm text-slate-400', className)} {...props}>
    {children}
  </p>
);

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-2 border-t border-border/40 p-4', className)} {...props} />
);

type DialogTriggerProps = PropsWithChildren<{ onClick?: () => void; render: (props: { onClick: () => void }) => ReactNode }>;

export const DialogTrigger = ({ onClick, render }: DialogTriggerProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return <>{render({ onClick: handleClick })}</>;
};
