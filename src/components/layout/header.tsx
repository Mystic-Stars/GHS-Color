'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Menu,
  Plus,
  Settings,
  Moon,
  Sun,
  Monitor,
  Grid3X3,
  List,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useAppStore, useColorStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import { appConfig } from '@/lib/env-config';
import type { ThemeMode, ViewMode } from '@/types';

interface HeaderProps {
  onSubmitColor?: () => void;
  onSettings?: () => void;
  onBackToColors?: () => void;
}

export function Header({
  onSubmitColor,
  onSettings,
  onBackToColors,
}: HeaderProps) {
  const { settings, toggleSidebar, setTheme, setViewMode } = useAppStore();
  const { colors, stats } = useColorStore();
  const { t } = useTranslation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const viewModeIcons = {
    grid: Grid3X3,
    list: List,
    compact: LayoutGrid,
  };

  const ThemeIcon = themeIcons[settings.theme];
  const ViewIcon = viewModeIcons[settings.viewMode];

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
    setShowThemeMenu(false);
  };

  const handleViewModeChange = (viewMode: ViewMode) => {
    setViewMode(viewMode);
    setShowViewMenu(false);
  };

  return (
    <header className="relative z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧 - Logo 和菜单 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            title={t('header.toggleSidebar')}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onBackToColors}
            title="返回颜色管理"
          >
            <div className="w-8 h-8 relative">
              <Image
                src="/icons/ico.svg"
                alt="GHS Color Next Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              {/* 桌面端显示完整标题 */}
              <div className="hidden sm:flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {appConfig.mainTitle}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-400 text-white text-sm font-medium shadow-sm">
                  {appConfig.suffix}
                </span>
              </div>

              {/* 移动端只显示简化标题（可选，或者完全隐藏） */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-foreground sr-only">
                  {appConfig.mainTitle} {appConfig.suffix}
                </h1>
              </div>

              <p className="text-xs text-muted-foreground hidden sm:block mt-1">
                {settings.language === 'zh-CN'
                  ? appConfig.description
                  : appConfig.descriptionEn}
              </p>
            </div>
          </div>
        </div>

        {/* 中间 - 统计信息 */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{t('header.totalColors')}:</span>
            <span className="font-semibold text-foreground">
              {colors.length}
            </span>
          </div>
          {stats && (
            <div className="flex items-center gap-2">
              <span>{t('header.favorites')}:</span>
              <span className="font-semibold text-foreground">
                {stats.favoriteCount}
              </span>
            </div>
          )}
        </div>

        {/* 右侧 - 操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 视图模式切换 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowViewMenu(!showViewMenu)}
              title={t('header.switchViewMode')}
            >
              <ViewIcon className="h-4 w-4" />
            </Button>

            {showViewMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-md shadow-lg z-[60]">
                <div className="p-1">
                  {[
                    {
                      mode: 'grid' as ViewMode,
                      label: t('viewMode.gridView'),
                      icon: Grid3X3,
                    },
                    {
                      mode: 'list' as ViewMode,
                      label: t('viewMode.listView'),
                      icon: List,
                    },
                    {
                      mode: 'compact' as ViewMode,
                      label: t('viewMode.compactView'),
                      icon: LayoutGrid,
                    },
                  ].map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => handleViewModeChange(mode)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent ${
                        settings.viewMode === mode ? 'bg-accent' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 主题切换 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title={t('header.switchTheme')}
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>

            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-popover border rounded-md shadow-lg z-[60]">
                <div className="p-1">
                  {[
                    {
                      theme: 'light' as ThemeMode,
                      label: t('theme.light'),
                      icon: Sun,
                    },
                    {
                      theme: 'dark' as ThemeMode,
                      label: t('theme.dark'),
                      icon: Moon,
                    },
                    {
                      theme: 'system' as ThemeMode,
                      label: t('theme.system'),
                      icon: Monitor,
                    },
                  ].map(({ theme, label, icon: Icon }) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent ${
                        settings.theme === theme ? 'bg-accent' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 设置 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettings}
            title={t('header.settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* 提交颜色 */}
          <Button onClick={onSubmitColor} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('header.submitColor')}</span>
          </Button>
        </div>
      </div>

      {/* 点击外部关闭菜单 */}
      {(showThemeMenu || showViewMenu) && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => {
            setShowThemeMenu(false);
            setShowViewMenu(false);
          }}
        />
      )}
    </header>
  );
}
