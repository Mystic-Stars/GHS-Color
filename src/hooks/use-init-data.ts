'use client';

import { useEffect, useState } from 'react';
import { useColorStore } from '@/store';
import { loadColorsFromEnv, loadCategoriesFromEnv } from '@/lib/env-config';

/**
 * 初始化应用数据的Hook
 */
export function useInitData() {
  const { colors, initializeData, updateStats } = useColorStore();
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

  return { isInitialized };
}
