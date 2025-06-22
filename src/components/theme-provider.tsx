'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import type { ThemeMode } from '@/types';

interface ThemeProviderContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeProviderContext = createContext<
  ThemeProviderContextType | undefined
>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ghs-color-theme',
}: ThemeProviderProps) {
  const { settings, setTheme: setAppTheme } = useAppStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 获取系统主题
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  // 解析主题
  const resolveTheme = (theme: ThemeMode): 'light' | 'dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  // 应用主题到DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    setResolvedTheme(theme);
  };

  // 设置主题
  const setTheme = (theme: ThemeMode) => {
    setAppTheme(theme);
    const resolved = resolveTheme(theme);
    applyTheme(resolved);

    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, theme);
    }
  };

  // 初始化主题
  useEffect(() => {
    let initialTheme = settings.theme;

    // 从localStorage读取主题设置
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as ThemeMode;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        initialTheme = stored;
        setAppTheme(stored);
      }
    }

    const resolved = resolveTheme(initialTheme);
    applyTheme(resolved);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (settings.theme === 'system') {
        const resolved = resolveTheme('system');
        applyTheme(resolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // 监听设置变化
  useEffect(() => {
    const resolved = resolveTheme(settings.theme);
    applyTheme(resolved);
  }, [settings.theme]);

  const value: ThemeProviderContextType = {
    theme: settings.theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
