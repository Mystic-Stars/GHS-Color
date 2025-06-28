'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { ColorGrid, ColorSearch, ColorDetailModal } from '@/components/color';
import { FolderView } from '@/components/folder';
import { DragDropProvider } from '@/components/dnd';
import { SubmitGuide } from '@/components/submit-guide';
import { SettingsModal } from '@/components/settings/settings-modal';
import { useColorStore } from '@/store';
import { useInitData } from '@/hooks/use-init-data';
import type { ExtendedColor } from '@/types';

export default function Home() {
  const { selectedColorId, colors, selectColor } = useColorStore();
  const { isInitialized, isHydrated } = useInitData();
  const [showSubmitGuide, setShowSubmitGuide] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const selectedColor = selectedColorId
    ? colors.find((c) => c.id === selectedColorId)
    : null;

  const handleSubmitColor = () => {
    setShowSubmitGuide(true);
    setShowDetailModal(false);
  };

  const handleColorClick = (color: ExtendedColor) => {
    selectColor(color.id);
    setShowDetailModal(true);
    setShowSubmitGuide(false);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    selectColor(null);
  };

  const handleBackToColors = () => {
    setShowSubmitGuide(false);
    setShowDetailModal(false);
    setSelectedFolderId(null);
    selectColor(null);
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    setShowSubmitGuide(false);
    setShowDetailModal(false);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
    setShowDetailModal(false);
    setShowSubmitGuide(false);
  };

  // 在水合完成之前显示加载状态
  if (!isHydrated) {
    return (
      <MainLayout
        onSubmitColor={handleSubmitColor}
        onSettings={handleSettings}
        onBackToColors={handleBackToColors}
        onFolderSelect={handleFolderSelect}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <DragDropProvider>
      <MainLayout
        onSubmitColor={handleSubmitColor}
        onSettings={handleSettings}
        onBackToColors={handleBackToColors}
        onFolderSelect={handleFolderSelect}
      >
      {showSubmitGuide ? (
        <SubmitGuide onClose={() => setShowSubmitGuide(false)} />
      ) : selectedFolderId ? (
        <div className="p-6">
          <FolderView
            folderId={selectedFolderId}
            onBack={handleBackToColors}
            onColorClick={handleColorClick}
          />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* 搜索栏 */}
          <ColorSearch />

          {/* 主要内容区域 */}
          <div className="w-full">
            {/* 颜色网格 - 全宽显示 */}
            <ColorGrid onColorClick={handleColorClick} />
          </div>
        </div>
      )}

      {/* 颜色详情Modal - 移到外层，在所有视图中都可用 */}
      <ColorDetailModal
        color={selectedColor || null}
        open={showDetailModal}
        onOpenChange={handleCloseDetailModal}
        onEdit={() => setShowSubmitGuide(true)}
      />

      {/* 设置Modal */}
      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </MainLayout>
    </DragDropProvider>
  );
}
