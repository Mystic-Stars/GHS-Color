'use client';

import React, { useState } from 'react';
import { Heart, Copy, Edit, Trash2, Palette } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
} from '@/components/ui';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import {
  formatColor,
  getContrastColor,
  copyToClipboard,
  generateSimilarColors,
  getCategoryIcon,
  getTemperatureIcon,
} from '@/utils';
import type { ExtendedColor, ColorFormat } from '@/types';

interface ColorDetailProps {
  color: ExtendedColor;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ColorDetail({ color, onEdit, onDelete }: ColorDetailProps) {
  const { toggleFavorite, incrementUsage } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const [showSimilarColors, setShowSimilarColors] = useState(false);

  const contrastColor = getContrastColor(color.hex);
  const similarColors = generateSimilarColors(color.hex, 8);

  const colorFormats: { format: ColorFormat; label: string }[] = [
    { format: 'hex', label: t('color.hex') },
    { format: 'rgb', label: t('color.rgb') },
    { format: 'hsl', label: t('color.hsl') },
    { format: 'css', label: t('color.cssVariable') },
  ];

  const handleCopyColor = async (format: ColorFormat) => {
    const formattedColor = formatColor(color.hex, format);
    const success = await copyToClipboard(formattedColor);

    if (success) {
      incrementUsage(color.id);
      // TODO: 显示复制成功的提示
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(color.id);
  };

  return (
    <div className="space-y-6">
      {/* 主要颜色显示 */}
      <Card>
        <CardContent className="p-0">
          <div
            className="h-48 w-full rounded-t-lg relative"
            style={{ backgroundColor: color.hex }}
          >
            {/* 操作按钮 */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="backdrop-blur-sm"
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
                className="backdrop-blur-sm"
                style={{
                  backgroundColor: `${contrastColor}20`,
                  color: contrastColor,
                }}
                onClick={onEdit}
                title={t('color.submitSimilarColor')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* 颜色值显示 */}
            <div className="absolute bottom-4 left-4">
              <div
                className="text-2xl font-bold"
                style={{ color: contrastColor }}
              >
                {color.hex.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* 颜色信息 */}
            <div>
              <h2 className="text-2xl font-bold">
                {settings.language === 'zh-CN' ? color.nameZh : color.name}
              </h2>
              <p className="text-muted-foreground">
                {settings.language === 'zh-CN'
                  ? color.descriptionZh
                  : color.description}
              </p>
            </div>

            {/* 分类和标签 */}
            <div className="space-y-3">
              {/* 分类和温度 */}
              <div className="flex flex-wrap gap-2">
                {color.category && (
                  <Badge variant="outline" className="font-medium">
                    <span className="mr-1.5">
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
                <Badge variant="outline" className="font-medium">
                  <span className="mr-1.5">
                    {getTemperatureIcon(color.temperature)}
                  </span>
                  {color.temperature === 'warm'
                    ? t('color.warm')
                    : color.temperature === 'cool'
                      ? t('color.cool')
                      : t('color.neutral')}
                </Badge>
              </div>

              {/* 标签 */}
              {color.tags && color.tags.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t('color.tags')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {color.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 使用统计 */}
            <div className="text-sm text-muted-foreground">
              {t('color.usageCount')}: {color.usageCount || 0} |
              {t('color.createdAt')}:{' '}
              {color.createdAt
                ? new Date(color.createdAt).toLocaleDateString()
                : t('color.unknown')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 颜色格式 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('color.colorFormats')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {colorFormats.map(({ format, label }) => {
            const formattedValue = formatColor(color.hex, format);
            return (
              <div
                key={format}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {formattedValue}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyColor(format)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {t('common.copy')}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 相似颜色 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('color.similarColors')}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSimilarColors(!showSimilarColors)}
            >
              {showSimilarColors ? t('color.hide') : t('color.show')}
            </Button>
          </CardTitle>
        </CardHeader>
        {showSimilarColors && (
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {similarColors.map((similarColor, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: similarColor }}
                  title={similarColor}
                  onClick={() => handleCopyColor('hex')}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
