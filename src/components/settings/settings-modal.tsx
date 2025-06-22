'use client';

import React from 'react';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Grid3X3,
  List,
  LayoutGrid,
  Palette,
  Eye,
  Languages,
  Globe
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Select,
  FlagIcon,
  type SelectOption
} from '@/components/ui';
import { useAppStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import { languageConfig } from '@/lib/i18n';
import type { ThemeMode, ViewMode, Language } from '@/types';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, setTheme, setViewMode, setLanguage } = useAppStore();
  const { t } = useTranslation();

  const themeOptions = [
    { value: 'light' as ThemeMode, label: t('theme.light'), icon: Sun },
    { value: 'dark' as ThemeMode, label: t('theme.dark'), icon: Moon },
    { value: 'system' as ThemeMode, label: t('theme.system'), icon: Monitor },
  ];

  const viewModeOptions = [
    { value: 'grid' as ViewMode, label: t('viewMode.grid'), icon: Grid3X3 },
    { value: 'list' as ViewMode, label: t('viewMode.list'), icon: List },
    { value: 'compact' as ViewMode, label: t('viewMode.compact'), icon: LayoutGrid },
  ];

  // 创建带国旗的语言选项
  const languageOptions: SelectOption[] = Object.entries(languageConfig).map(([code, config]) => ({
    value: code,
    label: config.name,
    icon: ({ className }: { className?: string }) => (
      <FlagIcon countryCode={config.countryCode} className={className} />
    ),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto w-[90vw] sm:w-full">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-muted-foreground" />
            {t('settings.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 主题设置 */}
          <div className="settings-section">
            <div className="flex items-center gap-3">
              <div className="settings-icon-container">
                <Palette className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">{t('settings.theme')}</h3>
                <p className="text-xs text-muted-foreground">{t('settings.themeDescription')}</p>
              </div>
            </div>
            <div className="settings-button-group">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = settings.theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`settings-button ${
                      isSelected ? 'settings-button-active' : 'settings-button-inactive'
                    }`}
                    title={option.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 视图设置 */}
          <div className="settings-section">
            <div className="flex items-center gap-3">
              <div className="settings-icon-container">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">{t('settings.viewMode')}</h3>
                <p className="text-xs text-muted-foreground">{t('settings.viewModeDescription')}</p>
              </div>
            </div>
            <div className="settings-button-group">
              {viewModeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = settings.viewMode === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setViewMode(option.value)}
                    className={`settings-button ${
                      isSelected ? 'settings-button-active' : 'settings-button-inactive'
                    }`}
                    title={option.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 语言设置 */}
          <div className="settings-section">
            <div className="flex items-center gap-3">
              <div className="settings-icon-container">
                <Languages className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">{t('settings.language')}</h3>
                <p className="text-xs text-muted-foreground">{t('settings.languageDescription')}</p>
              </div>
            </div>
            <Select
              value={settings.language}
              onValueChange={(value) => setLanguage(value as Language)}
              options={languageOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
