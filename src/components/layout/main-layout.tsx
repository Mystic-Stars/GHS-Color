'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAppStore, useColorStore } from '@/store';

interface MainLayoutProps {
  children: React.ReactNode;
  onSubmitColor?: () => void;
  onSettings?: () => void;
  onBackToColors?: () => void;
}

export function MainLayout({
  children,
  onSubmitColor,
  onSettings,
  onBackToColors
}: MainLayoutProps) {
  const { sidebarOpen, setSidebarOpen, settings } = useAppStore();
  const { updateStats } = useColorStore();

  // 初始化时更新统计信息
  useEffect(() => {
    updateStats();
  }, [updateStats]);

  // 应用主题到DOM
  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme]);

  // 监听屏幕尺寸变化，确保桌面端侧边栏可见
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md断点
      if (isDesktop && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    // 初始检查
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <Header
        onSubmitColor={onSubmitColor}
        onSettings={onSettings}
        onBackToColors={onBackToColors}
      />

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 侧边栏 */}
        <Sidebar onBackToColors={onBackToColors} />

        {/* 主内容区 */}
        <main 
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            sidebarOpen ? 'md:ml-0' : ''
          }`}
        >
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
