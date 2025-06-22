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
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastContextType {
  toast: (data: Omit<ToastData, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
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

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      ...data,
    };

    setToasts((prev) => [...prev, newToast]);

    // 自动移除toast
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => {
    toast({
      title: title || '成功',
      description: message,
      variant: 'default',
    });
  }, [toast]);

  const error = useCallback((message: string, title?: string) => {
    toast({
      title: title || '错误',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  const info = useCallback((message: string, title?: string) => {
    toast({
      title: title || '提示',
      description: message,
      variant: 'default',
    });
  }, [toast]);

  const value: ToastContextType = {
    toast,
    success,
    error,
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
