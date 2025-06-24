'use client';

import React from 'react';
import {
  Copy,
  Hash,
  Palette,
  Paintbrush,
} from 'lucide-react';
import { ContextMenu, type ContextMenuItem } from '@/components/ui/context-menu';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { formatColor, copyToClipboard } from '@/utils';
import type { ColorFormat } from '@/types';

interface SimpleColorContextMenuProps {
  hex: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SimpleColorContextMenu({
  hex,
  children,
  disabled = false,
  className,
}: SimpleColorContextMenuProps) {
  const { t } = useTranslation();
  const { success, error } = useToast();

  // 复制颜色值
  const handleCopyColor = async (format: ColorFormat) => {
    try {
      const formattedColor = formatColor(hex, format);
      const copySuccess = await copyToClipboard(formattedColor);

      if (copySuccess) {
        success(formattedColor, t('color.copySuccess'));
      } else {
        error(t('color.copyFailed'));
      }
    } catch (err) {
      error(t('color.copyFailed'));
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
