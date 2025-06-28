'use client';

import { useEffect, useState } from 'react';
import { useColorStore } from '@/store';
import { loadColorsFromEnv, loadCategoriesFromEnv } from '@/lib/env-config';

/**
 * 检查 Zustand 持久化存储是否已完成水合
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 在客户端设置为已水合
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * 初始化应用数据的Hook
 */
export function useInitData() {
  const { colors, initializeData, updateStats, syncFavorites } = useColorStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const isHydrated = useHydration();

  useEffect(() => {
    // 确保在水合完成后再初始化数据
    if (!isHydrated) return;

    // 从环境变量加载数据
    if (colors.length === 0 && !isInitialized) {
      const envColors = loadColorsFromEnv();
      const envCategories = loadCategoriesFromEnv();

      initializeData(envColors, envCategories);
      updateStats();
      setIsInitialized(true);
    }
  }, [colors.length, initializeData, updateStats, isInitialized, isHydrated]);

  // 在数据初始化后，监听 localStorage 变化以同步收藏状态
  useEffect(() => {
    if (!isInitialized || !isHydrated) return;

    const handleStorageChange = (e: StorageEvent) => {
      // 当 app-store 的数据发生变化时，同步收藏状态
      if (e.key === 'ghs-app-store') {
        syncFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isInitialized, syncFavorites, isHydrated]);

  return { isInitialized, isHydrated };
}
