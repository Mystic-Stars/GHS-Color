'use client';

import React, { useState } from 'react';
import { Heart, Copy, Edit, Palette } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  Button, 
  Badge 
} from '@/components/ui';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { formatColor, getContrastColor, copyToClipboard, generateSimilarColors, getCategoryIcon, getTemperatureIcon } from '@/utils';
import type { ExtendedColor, ColorFormat } from '@/types';

interface ColorDetailModalProps {
  color: ExtendedColor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function ColorDetailModal({ color, open, onOpenChange, onEdit }: ColorDetailModalProps) {
  const { toggleFavorite, incrementUsage } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success } = useToast();
  const [showSimilarColors, setShowSimilarColors] = useState(false);
  
  if (!color) return null;
  
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
    const copySuccess = await copyToClipboard(formattedColor);

    if (copySuccess) {
      incrementUsage(color.id);
      success(`已复制 ${formattedColor} 到剪贴板`);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(color.id);
  };

  const handleEdit = () => {
    onEdit?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-border"
              style={{ backgroundColor: color.hex }}
            />
            {getLocalizedText(color.nameZh, color.name)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 主要颜色显示 */}
          <div className="relative">
            <div
              className="h-48 w-full rounded-lg relative"
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
                    color: contrastColor 
                  }}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${color.isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="backdrop-blur-sm"
                  style={{
                    backgroundColor: `${contrastColor}20`,
                    color: contrastColor
                  }}
                  onClick={handleEdit}
                  title={t('color.submitSimilarColor')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* 颜色值显示 */}
              <div className="absolute bottom-4 left-4">
                <Badge 
                  variant="secondary"
                  className="backdrop-blur-sm text-lg px-3 py-1"
                  style={{ 
                    backgroundColor: `${contrastColor}20`,
                    color: contrastColor 
                  }}
                >
                  {color.hex.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* 颜色信息 */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {settings.language === 'zh-CN' ? color.nameZh : color.name}
              </h3>
              <p className="text-muted-foreground">
                {settings.language === 'zh-CN' ? color.descriptionZh : color.description}
              </p>
            </div>

            {/* 分类和标签 */}
            <div className="space-y-3">
              {/* 分类和温度 */}
              <div className="space-y-2">
                <h4 className="font-medium">{t('color.categoriesAndTemperature')}</h4>
                <div className="flex flex-wrap gap-2">
                  {color.category && (
                    <Badge variant="outline" className="font-medium">
                      <span className="mr-1.5">{getCategoryIcon(color.category)}</span>
                      {color.category === 'brand' ? t('color.brand') :
                       color.category === 'ui' ? t('color.ui') :
                       color.category === 'team' ? t('color.team') : color.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="font-medium">
                    <span className="mr-1.5">{getTemperatureIcon(color.temperature)}</span>
                    {color.temperature === 'warm' ? t('color.warm') :
                     color.temperature === 'cool' ? t('color.cool') : t('color.neutral')}
                  </Badge>
                </div>
              </div>

              {/* 标签 */}
              {color.tags && color.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">{t('color.tags')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {color.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 颜色格式 */}
            <div className="space-y-2">
              <h4 className="font-medium">{t('color.colorFormats')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {colorFormats.map(({ format, label }) => (
                  <div
                    key={format}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleCopyColor(format)}
                  >
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {formatColor(color.hex, format)}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 使用统计 */}
            <div className="space-y-2">
              <h4 className="font-medium">{t('color.usageStats')}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('color.usageCount')}:</span>
                  <span className="ml-2 font-medium">{color.usageCount || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('color.isFavorite')}:</span>
                  <span className="ml-2 font-medium">{color.isFavorite ? t('common.yes') : t('common.no')}</span>
                </div>
              </div>
            </div>

            {/* 相似颜色 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('color.similarColors')}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSimilarColors(!showSimilarColors)}
                >
                  {showSimilarColors ? t('color.hide') : t('color.show')}
                </Button>
              </div>
              {showSimilarColors && (
                <div className="grid grid-cols-4 gap-2">
                  {similarColors.map((similarColor, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform border relative group"
                      style={{ backgroundColor: similarColor }}
                      title={`${t('color.clickToCopy')} ${similarColor}`}
                      onClick={async () => {
                        const copySuccess = await copyToClipboard(similarColor);
                        if (copySuccess) {
                          success(`已复制 ${similarColor} 到剪贴板`);
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <Copy className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
