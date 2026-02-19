'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextType = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const TOAST_DURATION = 4000;

const variantConfig: Record<ToastVariant, {
  icon: typeof CheckCircle2;
  borderClass: string;
  bgClass: string;
  iconBgClass: string;
  iconClass: string;
  textClass: string;
}> = {
  success: {
    icon: CheckCircle2,
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconBgClass: 'bg-emerald-100 dark:bg-emerald-900',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    textClass: 'text-emerald-900 dark:text-emerald-100',
  },
  error: {
    icon: AlertTriangle,
    borderClass: 'border-red-200 dark:border-red-800',
    bgClass: 'bg-red-50 dark:bg-red-950/50',
    iconBgClass: 'bg-red-100 dark:bg-red-900',
    iconClass: 'text-red-600 dark:text-red-400',
    textClass: 'text-red-900 dark:text-red-100',
  },
  info: {
    icon: Info,
    borderClass: 'border-blue-200 dark:border-blue-800',
    bgClass: 'bg-blue-50 dark:bg-blue-950/50',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900',
    iconClass: 'text-blue-600 dark:text-blue-400',
    textClass: 'text-blue-900 dark:text-blue-100',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => removeToast(id), TOAST_DURATION);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className="animate-in slide-in-from-top-2 fade-in duration-300"
            >
              <Card className={`border ${config.borderClass} ${config.bgClass} shadow-xl`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${config.iconBgClass} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${config.iconClass}`} />
                    </div>
                    <p className={`text-sm font-semibold flex-1 ${config.textClass}`}>
                      {t.message}
                    </p>
                    <button
                      onClick={() => removeToast(t.id)}
                      className={`flex-shrink-0 ${config.iconClass} hover:opacity-70 transition-opacity`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
