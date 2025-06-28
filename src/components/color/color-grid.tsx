'use client';

import React from 'react';
import { ColorCard } from './color-card';
import { DraggableColorCard } from '@/components/dnd';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import type { ExtendedColor } from '@/types';

interface ColorGridProps {
  colors?: ExtendedColor[];
  onColorClick?: (color: ExtendedColor) => void;
  viewMode?: 'grid' | 'list' | 'compact';
  showRemoveFromFolder?: boolean;
  currentFolderId?: string;
  onRemoveFromFolder?: (colorId: string) => void;
}

export function ColorGrid({
  colors,
  onColorClick,
  viewMode: propViewMode,
  showRemoveFromFolder = false,
  currentFolderId,
  onRemoveFromFolder,
}: ColorGridProps) {
  const { getFilteredColors } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();

  const displayColors = colors || getFilteredColors();

  if (displayColors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold mb-2">{t('search.noColors')}</h3>
        <p className="text-muted-foreground">
          {t('search.noColorsDescription')}
        </p>
      </div>
    );
  }

  const viewMode = propViewMode || settings.viewMode;

  const getGridClassName = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
      case 'list':
        return 'grid grid-cols-1 gap-2';
      case 'compact':
        return 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    }
  };

  return (
    <div className={getGridClassName()}>
      {displayColors.map((color) => (
        <DraggableColorCard
          key={color.id}
          color={color}
          showDetails={viewMode !== 'compact'}
          onClick={() => onColorClick?.(color)}
        />
      ))}
    </div>
  );
}
