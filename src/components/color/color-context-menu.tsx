'use client';

import React, { useState } from 'react';
import {
  Copy,
  Heart,
  HeartOff,
  Info,
  Palette,
  Hash,
  Paintbrush,
  Eye,
  FolderPlus,
  Folder,
} from 'lucide-react';
import { ContextMenu, type ContextMenuItem } from '@/components/ui/context-menu';
import { FolderSelector } from '@/components/folder';
import { useColorStore, useAppStore } from '@/store';
import { useFolderStore } from '@/store/folder-store';
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
  const { addColorToFolders, removeColorFromFolders, getFoldersForColor } = useFolderStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const { success, error, info } = useToast();

  const [showFolderSelector, setShowFolderSelector] = useState(false);

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

  // 添加到文件夹
  const handleAddToFolders = () => {
    setShowFolderSelector(true);
  };

  // 确认文件夹选择
  const handleFolderConfirm = (selectedFolderIds: string[]) => {
    const currentFolderIds = getFoldersForColor(color.id).map(f => f.id);

    // 找出需要添加和移除的文件夹
    const toAdd = selectedFolderIds.filter(id => !currentFolderIds.includes(id));
    const toRemove = currentFolderIds.filter(id => !selectedFolderIds.includes(id));

    // 执行添加和移除操作
    if (toAdd.length > 0) {
      addColorToFolders(color.id, toAdd);
    }
    if (toRemove.length > 0) {
      removeColorFromFolders(color.id, toRemove);
    }

    // 显示成功消息
    if (toAdd.length > 0 || toRemove.length > 0) {
      success(t('folder.updateSuccess'));
    }
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
    // 添加到文件夹
    {
      id: 'add-to-folders',
      label: t('folder.addToFolders'),
      icon: Folder,
      onClick: handleAddToFolders,
    },
    // 分隔符
    {
      id: 'separator-3',
      label: '',
      onClick: () => {},
      separator: true,
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
    <>
      <ContextMenu
        items={menuItems}
        disabled={disabled}
        className={className}
      >
        {children}
      </ContextMenu>

      {/* 文件夹选择器 */}
      <FolderSelector
        open={showFolderSelector}
        onOpenChange={setShowFolderSelector}
        color={color}
        onConfirm={handleFolderConfirm}
        title={t('folder.selectFoldersForColor')}
        description={t('folder.selectFoldersDescription')}
        showCreateButton={false}
      />
    </>
  );
}
