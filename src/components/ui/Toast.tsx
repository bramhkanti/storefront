'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast, type ToastMessage } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}): React.JSX.Element {
  const duration = toast.durationMs ?? 4000;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />,
    error: <AlertCircle className="h-4 w-4 shrink-0 text-rose-700" />,
    info: <Info className="text-heritage-saffron-dark h-4 w-4 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900',
    info: 'border-amber-200 bg-amber-50/95 text-amber-900',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-xs font-medium shadow-lg backdrop-blur-xs transition-all duration-300 sm:max-w-sm',
        borders[toast.type],
      )}
    >
      <div className="flex items-center gap-2">
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss message"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer(): React.JSX.Element {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return <></>;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2 p-4 sm:p-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
