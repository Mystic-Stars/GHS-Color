'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { settings } = useAppStore();

  // 更新HTML lang属性
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = settings.language;
    }
  }, [settings.language]);

  return <>{children}</>;
}
