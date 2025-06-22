'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { ColorGrid, ColorSearch, ColorDetailModal } from '@/components/color';
import { SubmitGuide } from '@/components/submit-guide';
import { SettingsModal } from '@/components/settings/settings-modal';
import { useColorStore } from '@/store';
import { useInitData } from '@/hooks/use-init-data';
import { useToast } from '@/components/toast-provider';

import type { ExtendedColor } from '@/types';

export default function Home() {
  const { selectedColorId, colors, selectColor } = useColorStore();
  const { isInitialized } = useInitData();
  const [showSubmitGuide, setShowSubmitGuide] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const selectedColor = selectedColorId
    ? colors.find(c => c.id === selectedColorId)
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
    console.log('handleBackToColors called');
    setShowSubmitGuide(false);
    setShowDetailModal(false);
    selectColor(null);
  };





  const handleSettings = () => {
    setShowSettingsModal(true);
    setShowDetailModal(false);
    setShowSubmitGuide(false);
  };

  return (
    <MainLayout
      onSubmitColor={handleSubmitColor}
      onSettings={handleSettings}
      onBackToColors={handleBackToColors}
    >
      {showSubmitGuide ? (
        <SubmitGuide onClose={() => setShowSubmitGuide(false)} />
      ) : (
        <div className="p-6 space-y-6">
          {/* 搜索栏 */}
          <ColorSearch />

          {/* 主要内容区域 */}
          <div className="w-full">
            {/* 颜色网格 - 全宽显示 */}
            <ColorGrid onColorClick={handleColorClick} />
          </div>

          {/* 颜色详情Modal */}
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
        </div>
      )}
    </MainLayout>
  );
}
