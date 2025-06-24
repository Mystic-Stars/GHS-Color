'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  showIcon?: boolean;
  showProgress?: boolean;
}

interface ToastContextType {
  toast: (data: Omit<ToastData, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastData = {
        id,
        duration: 5000,
        ...data,
      };

      setToasts((prev) => [...prev, newToast]);

      // 自动移除toast
      if (newToast.duration && newToast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, newToast.duration);

        // 存储定时器ID以便后续可能的清理
        (newToast as any).timerId = timer;
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => {
      toast({
        title: title || '成功',
        description: message,
        variant: 'success',
        duration: 4000,
        showIcon: true,
        showProgress: true,
      });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      toast({
        title: title || '错误',
        description: message,
        variant: 'destructive',
        duration: 6000,
        showIcon: true,
      });
    },
    [toast]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      toast({
        title: title || '警告',
        description: message,
        variant: 'warning',
        duration: 5000,
        showIcon: true,
      });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      toast({
        title: title || '提示',
        description: message,
        variant: 'info',
        duration: 4000,
        showIcon: true,
      });
    },
    [toast]
  );

  const value: ToastContextType = {
    toast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      <RadixToastProvider>
        {children}
        {toasts.map((toastData) => (
          <Toast
            key={toastData.id}
            variant={toastData.variant}
            showIcon={toastData.showIcon}
            showProgress={toastData.showProgress}
            duration={toastData.duration}
            onOpenChange={(open) => {
              if (!open) {
                removeToast(toastData.id);
              }
            }}
          >
            {toastData.title && <ToastTitle>{toastData.title}</ToastTitle>}
            {toastData.description && (
              <ToastDescription>{toastData.description}</ToastDescription>
            )}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
