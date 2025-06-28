'use client';

import React, { useState, useEffect } from 'react';
import { X, Palette, Heart, Folder, Wrench, Settings } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useAppStore, useColorStore } from '@/store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { ColorDetailModal, ColorConverterModal, ColorConfigGeneratorModal, ColorContextMenu } from '@/components/color';
import { FolderList } from '@/components/folder';
import type { ExtendedColor } from '@/types';

interface SidebarProps {
  onBackToColors?: () => void;
  onFolderSelect?: (folderId: string | null) => void;
}

export function Sidebar({ onBackToColors, onFolderSelect }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, settings } = useAppStore();
  const { categories, stats, filter, setFilter, clearFilter, incrementUsage } =
    useColorStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const [selectedColor, setSelectedColor] = useState<ExtendedColor | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);
  const [showConfigGeneratorModal, setShowConfigGeneratorModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 监听屏幕尺寸变化
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md断点是768px
      setIsMobile(mobile);

      // 如果从移动端切换到桌面端，且侧边栏被关闭，则自动打开
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    // 初始检查
    checkIsMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const handleCategoryClick = (categoryId: string | null) => {
    // 如果点击的是已选中的分类，则清除过滤器返回全部颜色
    if (categoryId && filter.categories?.includes(categoryId)) {
      clearFilter();
      onBackToColors?.();
    } else if (categoryId) {
      // 更新过滤器 - 只有当 categoryId 不为 null 时才设置过滤器
      clearFilter();
      setFilter({ categories: [categoryId] });
      onBackToColors?.();
    }
  };

  const handleFavoritesClick = () => {
    // 如果已经在显示收藏，则返回全部颜色
    if (filter.favoritesOnly) {
      clearFilter();
      onBackToColors?.();
    } else {
      setFilter({ favoritesOnly: true });
      onBackToColors?.();
    }
  };

  const handleClearFilters = () => {
    clearFilter();
    onBackToColors?.();
  };

  const handleRecentColorClick = (color: ExtendedColor) => {
    setSelectedColor(color);
    setShowDetailModal(true);
    incrementUsage(color.id);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedColor(null);
  };

  const handleOpenConverter = () => {
    setShowConverterModal(true);
  };

  const handleCloseConverter = () => {
    setShowConverterModal(false);
  };

  const handleOpenConfigGenerator = () => {
    setShowConfigGeneratorModal(true);
  };

  const handleCloseConfigGenerator = () => {
    setShowConfigGeneratorModal(false);
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* 移动端遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 h-full w-80 bg-background border-r z-30 md:relative md:z-auto">
        <div className="flex flex-col h-full">
          {/* 侧边栏头部 */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">{t('sidebar.colorCategories')}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 侧边栏内容 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* 快速过滤 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t('common.filter')}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleClearFilters}
                  className={`w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent ${
                    !filter.categories?.length && !filter.favoritesOnly
                      ? 'bg-accent'
                      : ''
                  }`}
                >
                  <span>{t('sidebar.allColors')}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.totalColors || 0}
                  </Badge>
                </button>

                <button
                  onClick={handleFavoritesClick}
                  className={`w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent ${
                    filter.favoritesOnly ? 'bg-accent' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t('sidebar.favoriteColors')}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.favoriteCount || 0}
                  </Badge>
                </button>
              </div>
            </div>

            {/* 颜色分类 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {t('search.categories')}
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const categoryCount = stats?.categoryCounts[category.id] || 0;
                  const isSelected = filter.categories?.includes(category.id);

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-accent ${
                        isSelected ? 'bg-accent' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>
                          {getLocalizedText(category.nameZh, category.name)}
                        </span>
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryCount}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 文件夹管理 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {t('folder.manageFolders')}
              </h3>
              <FolderList
                onFolderSelect={(folderId) => {
                  onFolderSelect?.(folderId);
                  // 不要调用 onBackToColors，因为我们想要显示文件夹视图
                }}
                selectedFolderId={filter.folders?.[0] || null}
                showCreateButton={true}
                compact={true}
              />
            </div>

            {/* 颜色温度统计 */}
            {stats && (
              <div>
                <h3 className="text-sm font-medium mb-3">
                  {t('search.temperature')}
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'warm', emoji: '🔥' },
                    { key: 'cool', emoji: '❄️' },
                    { key: 'neutral', emoji: '⚪' },
                  ].map(({ key, emoji }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span>{emoji}</span>
                        <span>{t(`search.${key}`)}</span>
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {stats.temperatureCounts[
                          key as keyof typeof stats.temperatureCounts
                        ] || 0}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 实用工具 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {t('tools.title')}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={handleOpenConverter}
                  className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <Palette className="h-4 w-4" />
                  <span>{t('tools.colorConverter.title')}</span>
                </button>
                <button
                  onClick={handleOpenConfigGenerator}
                  className="w-full flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('tools.colorConfigGenerator.title')}</span>
                </button>
              </div>
            </div>

            {/* 最近使用的颜色 */}
            {stats?.recentColors && stats.recentColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">
                  {t('sidebar.recentColors')}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {stats.recentColors.slice(0, 8).map((color) => (
                    <ColorContextMenu
                      key={color.id}
                      color={color}
                      onViewDetails={() => handleRecentColorClick(color)}
                    >
                      <div
                        className="aspect-square rounded-md cursor-pointer hover:scale-105 transition-transform border"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.nameZh} (${color.hex})`}
                        onClick={() => handleRecentColorClick(color)}
                      />
                    </ColorContextMenu>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 颜色详情Modal */}
      <ColorDetailModal
        color={selectedColor}
        open={showDetailModal}
        onOpenChange={handleCloseDetailModal}
        onEdit={() => {
          // 这里可以添加编辑功能，暂时关闭模态框
          handleCloseDetailModal();
        }}
      />

      {/* 颜色转换工具Modal */}
      <ColorConverterModal
        open={showConverterModal}
        onOpenChange={handleCloseConverter}
      />

      {/* 颜色配置生成器Modal */}
      <ColorConfigGeneratorModal
        open={showConfigGeneratorModal}
        onOpenChange={handleCloseConfigGenerator}
      />
    </>
  );
}
