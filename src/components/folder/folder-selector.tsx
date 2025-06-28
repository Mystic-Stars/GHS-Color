'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Search, X, Folder, Plus, FolderPlus, Palette, Heart, Star, Zap,
  Target, Rocket, Sparkles, Camera, Music, Image, Film, Bookmark, Tag,
  Archive, Package, Box, Briefcase, Coffee, Home, Settings, Users, Globe
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Checkbox,
  Badge,
  ScrollArea,
} from '@/components/ui';
import { FolderManager } from './folder-manager';
import { useFolderStore } from '@/store/folder-store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import type { ColorFolder, ExtendedColor } from '@/types';

// 图标映射对象
const iconMap = {
  'folder': Folder,
  'folder-plus': FolderPlus,
  'palette': Palette,
  'heart': Heart,
  'star': Star,
  'zap': Zap,
  'target': Target,
  'rocket': Rocket,
  'sparkles': Sparkles,
  'camera': Camera,
  'music': Music,
  'image': Image,
  'film': Film,
  'bookmark': Bookmark,
  'tag': Tag,
  'archive': Archive,
  'package': Package,
  'box': Box,
  'briefcase': Briefcase,
  'coffee': Coffee,
  'home': Home,
  'settings': Settings,
  'users': Users,
  'globe': Globe,
};

// 图标渲染组件
const IconRenderer = ({
  iconName,
  className = "h-4 w-4",
  color
}: {
  iconName: string;
  className?: string;
  color?: string;
}) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  const iconStyle = color ? { color } : {};

  if (IconComponent) {
    return <IconComponent className={className} style={iconStyle} />;
  }
  // 如果找不到图标，显示默认文件夹图标
  return <Folder className={className} style={iconStyle} />;
};

interface FolderSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: ExtendedColor;
  onConfirm: (selectedFolderIds: string[]) => void;
  title?: string;
  description?: string;
  allowMultiple?: boolean;
  showCreateButton?: boolean;
}

export function FolderSelector({
  open,
  onOpenChange,
  color,
  onConfirm,
  title,
  description,
  allowMultiple = true,
  showCreateButton = true,
}: FolderSelectorProps) {
  const {
    folders,
    folderStats,
    getFoldersForColor,
    searchFolders,
  } = useFolderStore();
  
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success } = useToast();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  // 获取当前颜色已在的文件夹
  const currentFolders = useMemo(() => {
    return getFoldersForColor(color.id);
  }, [color.id, getFoldersForColor]);

  // 过滤文件夹
  const filteredFolders = useMemo(() => {
    if (!searchKeyword.trim()) {
      return folders;
    }
    return searchFolders(searchKeyword);
  }, [folders, searchKeyword, searchFolders]);

  // 初始化选中状态
  useEffect(() => {
    if (open) {
      const currentFolderIds = currentFolders.map(folder => folder.id);
      setSelectedFolderIds(currentFolderIds);
      setSearchKeyword('');
    }
  }, [open, currentFolders]);

  const handleFolderToggle = (folderId: string) => {
    if (allowMultiple) {
      setSelectedFolderIds(prev => 
        prev.includes(folderId)
          ? prev.filter(id => id !== folderId)
          : [...prev, folderId]
      );
    } else {
      setSelectedFolderIds(prev => 
        prev.includes(folderId) ? [] : [folderId]
      );
    }
  };

  const handleSelectAll = () => {
    const allFolderIds = filteredFolders.map(folder => folder.id);
    setSelectedFolderIds(allFolderIds);
  };

  const handleDeselectAll = () => {
    setSelectedFolderIds([]);
  };

  const handleConfirm = () => {
    onConfirm(selectedFolderIds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCreateFolder = () => {
    setShowCreateFolder(true);
  };

  const handleFolderCreated = (newFolder: ColorFolder) => {
    // 自动选中新创建的文件夹
    if (allowMultiple) {
      setSelectedFolderIds(prev => [...prev, newFolder.id]);
    } else {
      setSelectedFolderIds([newFolder.id]);
    }
    success(t('folder.createSuccess'));
  };

  const selectedCount = selectedFolderIds.length;
  const hasChanges = JSON.stringify(selectedFolderIds.sort()) !== 
                    JSON.stringify(currentFolders.map(f => f.id).sort());

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {title || t('folder.selectFolders')}
            </DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* 颜色信息 */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div
                className="w-8 h-8 rounded-md border"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {color.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {color.hex.toUpperCase()}
                </div>
              </div>
            </div>

            {/* 搜索栏 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('folder.searchPlaceholder')}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {allowMultiple && filteredFolders.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      disabled={selectedCount === filteredFolders.length}
                    >
                      {t('common.selectAll')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      disabled={selectedCount === 0}
                    >
                      {t('common.deselectAll')}
                    </Button>
                  </>
                )}
              </div>

              {showCreateButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateFolder}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('folder.create')}
                </Button>
              )}
            </div>

            {/* 文件夹列表 */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-2 pr-4">
                {filteredFolders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchKeyword ? t('folder.noSearchResults') : t('folder.noFolders')}
                    </p>
                  </div>
                ) : (
                  filteredFolders.map((folder) => {
                    const isSelected = selectedFolderIds.includes(folder.id);
                    const isCurrentFolder = currentFolders.some(f => f.id === folder.id);
                    const stats = folderStats[folder.id];
                    const colorCount = stats?.colorCount || 0;

                    return (
                      <div
                        key={folder.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-all duration-200 ${
                          isSelected ? 'bg-transparent border-primary ring-2 ring-primary/30' : 'border-border'
                        }`}
                        onClick={() => handleFolderToggle(folder.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleFolderToggle(folder.id)}
                          className="pointer-events-none"
                        />

                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0 transition-all duration-200 bg-muted/50 border border-border ${
                            isSelected ? 'ring-2 ring-primary/30 bg-muted/80' : ''
                          }`}
                        >
                          <IconRenderer
                            iconName={folder.icon || 'folder'}
                            className="h-4 w-4 transition-colors duration-200"
                            color={folder.iconColor || (isSelected ? '#6366f1' : '#64748b')}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {folder.name}
                            </span>
                            {isCurrentFolder && (
                              <Badge variant="secondary" className="text-xs">
                                {t('folder.current')}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {colorCount} {t('folder.colors')}
                            </span>
                            {stats?.recentColors && stats.recentColors.length > 0 && (
                              <div className="flex gap-1">
                                {stats.recentColors.slice(0, 3).map((recentColor) => (
                                  <div
                                    key={recentColor.id}
                                    className="w-3 h-3 rounded-full border border-white/20"
                                    style={{ backgroundColor: recentColor.hex }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 底部操作 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {allowMultiple ? (
                selectedCount > 0 ? (
                  t('folder.selectedCount', { count: selectedCount })
                ) : (
                  t('folder.noSelection')
                )
              ) : (
                selectedCount > 0 ? t('folder.oneSelected') : t('folder.noSelection')
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!hasChanges}
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 文件夹创建器 */}
      <FolderManager
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        showTriggerButton={false}
        onFolderCreated={handleFolderCreated}
      />
    </>
  );
}
