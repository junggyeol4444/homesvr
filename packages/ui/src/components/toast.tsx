import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode
} from 'react';
import { cn } from '../utils';

export type ToastOptions = {
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'success' | 'error';
  duration?: number;
};

type ToastContextValue = {
  toasts: Array<ToastOptions & { id: string }>;
  dismiss: (id: string) => void;
  push: (toast: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const createId = () =>
  (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: string }>>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((toast: ToastOptions) => {
    const id = createId();
    setToasts((current) => [...current, { ...toast, id }]);
    const duration = toast.duration ?? 5000;
    window.setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const value = useMemo(() => ({ toasts, dismiss, push }), [toasts, dismiss, push]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const variantClassMap: Record<NonNullable<ToastOptions['variant']>, string> = {
  default: 'border-border/60 bg-background/95 text-foreground',
  success: 'border-emerald-500/40 bg-emerald-100/95 text-emerald-900',
  error: 'border-red-500/40 bg-red-100/95 text-red-900'
};

export const ToastViewport = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn('rounded-lg border p-4 shadow-lg transition-all', variantClassMap[toast.variant ?? 'default'])}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-xs text-slate-400">{toast.description}</p>}
            </div>
            <button
              type="button"
              className="text-xs font-medium text-slate-400 hover:text-foreground"
              onClick={() => dismiss(toast.id)}
            >
              닫기
            </button>
          </div>
          {toast.action && <div className="mt-3">{toast.action}</div>}
        </div>
      ))}
    </div>
  );
};
