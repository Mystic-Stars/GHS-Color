'use client';

import React from 'react';
import { Heart, Copy, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import {
  formatColor,
  getContrastColor,
  copyToClipboard,
  getCategoryIcon,
} from '@/utils';
import type { ExtendedColor, ColorFormat } from '@/types';

interface ColorCardProps {
  color: ExtendedColor;
  showDetails?: boolean;
  onClick?: () => void;
}

export function ColorCard({
  color,
  showDetails = true,
  onClick,
}: ColorCardProps) {
  const { toggleFavorite, incrementUsage, selectColor } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success } = useToast();
  const contrastColor = getContrastColor(color.hex);

  const handleCopyColor = async (format: ColorFormat, e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedColor = formatColor(color.hex, format);
    const copySuccess = await copyToClipboard(formattedColor);

    if (copySuccess) {
      incrementUsage(color.id);
      success(`${t('color.copySuccess')}: ${formattedColor}`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(color.id);
  };

  const handleCardClick = () => {
    selectColor(color.id);
    onClick?.();
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* 颜色预览区域 */}
        <div
          className="h-32 w-full rounded-t-lg relative overflow-hidden"
          style={{ backgroundColor: color.hex }}
        >
          {/* 悬浮操作按钮 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 backdrop-blur-sm"
              style={{
                backgroundColor: `${contrastColor}20`,
                color: contrastColor,
              }}
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${color.isFavorite ? 'fill-current' : ''}`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 backdrop-blur-sm"
              style={{
                backgroundColor: `${contrastColor}20`,
                color: contrastColor,
              }}
              onClick={(e) => handleCopyColor(settings.defaultColorFormat, e)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 颜色信息区域 */}
        {showDetails && (
          <div className="p-3">
            <div className="space-y-2.5">
              {/* 颜色名称 */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm truncate leading-tight">
                  {getLocalizedText(color.nameZh, color.name)}
                </h3>
                {(color.description || color.descriptionZh) && (
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {getLocalizedText(color.descriptionZh, color.description)}
                  </p>
                )}
              </div>

              {/* 分类和标签 */}
              <div className="flex flex-wrap gap-1">
                {/* 分类 - 带有emoji图标 */}
                {color.category && (
                  <Badge variant="outline" className="text-xs font-medium">
                    <span className="mr-1">
                      {getCategoryIcon(color.category)}
                    </span>
                    {color.category === 'brand'
                      ? t('color.brand')
                      : color.category === 'ui'
                        ? t('color.ui')
                        : color.category === 'team'
                          ? t('color.team')
                          : color.category}
                  </Badge>
                )}
                {/* 标签 - 不带图标 */}
                {color.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {color.tags && color.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{color.tags.length - 2}
                  </Badge>
                )}
              </div>

              {/* 快速复制按钮 */}
              <div className="flex gap-1 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => handleCopyColor('hex', e)}
                >
                  HEX
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => handleCopyColor('rgb', e)}
                >
                  RGB
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => handleCopyColor('hsl', e)}
                >
                  HSL
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
