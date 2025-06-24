'use client';

import React from 'react';
import {
  Copy,
  Heart,
  HeartOff,
  Info,
  Palette,
  Hash,
  Paintbrush,
  Eye,
} from 'lucide-react';
import { ContextMenu, type ContextMenuItem } from '@/components/ui/context-menu';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { formatColor, copyToClipboard } from '@/utils';
import type { ExtendedColor, ColorFormat } from '@/types';

interface ColorContextMenuProps {
  color: ExtendedColor;
  children: React.ReactNode;
  onViewDetails?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ColorContextMenu({
  color,
  children,
  onViewDetails,
  disabled = false,
  className,
}: ColorContextMenuProps) {
  const { toggleFavorite, incrementUsage } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const { success, error, info } = useToast();

  // 复制颜色值
  const handleCopyColor = async (format: ColorFormat) => {
    try {
      const formattedColor = formatColor(color.hex, format);
      const copySuccess = await copyToClipboard(formattedColor);

      if (copySuccess) {
        incrementUsage(color.id);
        success(formattedColor, t('color.copySuccess'));
      } else {
        error(t('color.copyFailed'));
      }
    } catch (err) {
      error(t('color.copyFailed'));
    }
  };

  // 复制颜色名称
  const handleCopyName = async () => {
    try {
      const name = settings.language === 'zh-CN' ? color.nameZh : color.name;
      const copySuccess = await copyToClipboard(name);

      if (copySuccess) {
        success(name, t('color.copySuccess'));
      } else {
        error(t('color.copyFailed'));
      }
    } catch (err) {
      error(t('color.copyFailed'));
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = () => {
    toggleFavorite(color.id);
    const message = color.isFavorite
      ? t('color.removedFromFavorites')
      : t('color.addedToFavorites');
    info(message);
  };

  // 查看详情
  const handleViewDetails = () => {
    onViewDetails?.();
  };

  // 构建菜单项
  const menuItems: ContextMenuItem[] = [
    // 复制颜色值部分
    {
      id: 'copy-hex',
      label: `${t('common.copy')} HEX`,
      icon: Hash,
      onClick: () => handleCopyColor('hex'),
      shortcut: '⌘C',
    },
    {
      id: 'copy-rgb',
      label: `${t('common.copy')} RGB`,
      icon: Palette,
      onClick: () => handleCopyColor('rgb'),
    },
    {
      id: 'copy-hsl',
      label: `${t('common.copy')} HSL`,
      icon: Paintbrush,
      onClick: () => handleCopyColor('hsl'),
    },
    {
      id: 'copy-css',
      label: `${t('common.copy')} CSS`,
      icon: Copy,
      onClick: () => handleCopyColor('css'),
    },
    // 分隔符
    {
      id: 'separator-1',
      label: '',
      onClick: () => {},
      separator: true,
    },
    // 复制名称
    {
      id: 'copy-name',
      label: t('color.copyName'),
      icon: Copy,
      onClick: handleCopyName,
    },
    // 分隔符
    {
      id: 'separator-2',
      label: '',
      onClick: () => {},
      separator: true,
    },
    // 收藏操作
    {
      id: 'toggle-favorite',
      label: color.isFavorite
        ? t('color.removeFromFavorites')
        : t('color.addToFavorites'),
      icon: color.isFavorite ? HeartOff : Heart,
      onClick: handleToggleFavorite,
    },
    // 查看详情
    {
      id: 'view-details',
      label: t('color.viewDetails'),
      icon: Eye,
      onClick: handleViewDetails,
      disabled: !onViewDetails,
    },
  ];

  return (
    <ContextMenu
      items={menuItems}
      disabled={disabled}
      className={className}
    >
      {children}
    </ContextMenu>
  );
}
