'use client';

import { useEffect, useState } from 'react';
import { useColorStore } from '@/store';
import { loadColorsFromEnv, loadCategoriesFromEnv } from '@/lib/env-config';

/**
 * 初始化应用数据的Hook
 */
export function useInitData() {
  const { colors, initializeData, updateStats, syncFavorites } = useColorStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 从环境变量加载数据
    if (colors.length === 0 && !isInitialized) {
      const envColors = loadColorsFromEnv();
      const envCategories = loadCategoriesFromEnv();

      initializeData(envColors, envCategories);
      updateStats();
      setIsInitialized(true);
    }
  }, [colors.length, initializeData, updateStats, isInitialized]);

  // 在数据初始化后，监听 localStorage 变化以同步收藏状态
  useEffect(() => {
    if (!isInitialized) return;

    const handleStorageChange = (e: StorageEvent) => {
      // 当 app-store 的数据发生变化时，同步收藏状态
      if (e.key === 'ghs-app-store') {
        syncFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isInitialized, syncFavorites]);

  return { isInitialized };
}
