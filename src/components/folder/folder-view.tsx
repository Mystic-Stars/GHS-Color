'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  FolderX,
  Search,
  X,
  Folder,
  Palette, Heart, Star, Zap, Target, Rocket, Sparkles, Camera,
  Music, Image, Film, Bookmark, Tag, Archive, Package, Box,
  Briefcase, Coffee, Home, Settings, Users, Globe, FolderPlus
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ColorGrid } from '@/components/color';
import { FolderManager } from './folder-manager';
import { useFolderStore } from '@/store/folder-store';
import { useColorStore } from '@/store/color-store';
import { useAppStore } from '@/store/app-store';
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

interface FolderViewProps {
  folderId: string;
  onBack?: () => void;
  onColorClick?: (color: ExtendedColor) => void;
  showHeader?: boolean;
  allowEdit?: boolean;
}

export function FolderView({
  folderId,
  onBack,
  onColorClick,
  showHeader = true,
  allowEdit = true,
}: FolderViewProps) {
  const {
    getFolderById,
    getColorsInFolder,
    removeColorFromFolder,
    deleteFolder,
    getFolderStats,
  } = useFolderStore();
  
  const { colors, setFilter } = useColorStore();
  const { settings } = useAppStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success, error } = useToast();

  const [showEditModal, setShowEditModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const folder = getFolderById(folderId);
  const folderColors = getColorsInFolder(folderId, colors);
  const folderStats = getFolderStats(folderId);

  // 过滤颜色
  const filteredColors = searchKeyword
    ? folderColors.filter(color =>
        color.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        color.hex.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : folderColors;

  useEffect(() => {
    // 设置过滤器以显示当前文件夹的颜色
    setFilter({ folders: [folderId] });
    
    return () => {
      // 清理过滤器
      setFilter({ folders: [] });
    };
  }, [folderId, setFilter]);

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <FolderX className="h-12 w-12 mb-4 opacity-50" />
        <p>{t('folder.notFound')}</p>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        )}
      </div>
    );
  }

  const handleRemoveColor = (colorId: string) => {
    if (window.confirm(t('folder.removeColorConfirm'))) {
      removeColorFromFolder(colorId, folderId);
      success(t('folder.colorRemoved'));
    }
  };

  const handleEditFolder = () => {
    setShowEditModal(true);
  };



  const handleDeleteFolder = () => {
    if (folder.isSystem) {
      error(t('folder.cannotDeleteSystem'));
      return;
    }

    if (window.confirm(t('folder.deleteConfirm'))) {
      try {
        deleteFolder(folderId);
        success(t('folder.deleteSuccess'));
        onBack?.();
      } catch (err) {
        error(t('folder.deleteFailed'));
      }
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
  };

  return (
    <div className="space-y-6">
      {/* 文件夹头部 */}
      {showHeader && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50 border border-border">
                    <IconRenderer
                      iconName={folder.icon || 'folder'}
                      className="h-6 w-6"
                      color={folder.iconColor || '#6366f1'}
                    />
                  </div>
                  
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {folder.name}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>
                        {folderColors.length} {t('folder.colors')}
                      </span>
                      {folder.description && (
                        <span>
                          {folder.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作菜单 */}
              {allowEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditFolder}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t('common.edit')}
                    </DropdownMenuItem>

                    {!folder.isSystem && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleDeleteFolder}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        {/* 搜索栏 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('color.searchInFolder')}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchKeyword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>


      </div>

      {/* 颜色列表 */}
      <div>
        {filteredColors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {searchKeyword ? t('color.noSearchResults') : t('folder.noColors')}
            </p>
            <p className="text-sm">
              {searchKeyword 
                ? t('color.tryDifferentKeyword')
                : t('folder.addColorsToFolder')
              }
            </p>
          </div>
        ) : (
          <ColorGrid
            colors={filteredColors}
            onColorClick={onColorClick}
            viewMode={settings.viewMode}
            showRemoveFromFolder={true}
            currentFolderId={folderId}
            onRemoveFromFolder={handleRemoveColor}
          />
        )}
      </div>

      {/* 编辑文件夹模态框 */}
      <FolderManager
        open={showEditModal}
        onOpenChange={setShowEditModal}
        editingFolder={folder}
        showTriggerButton={false}
        onFolderUpdated={() => {
          // 文件夹更新后会自动刷新
        }}
      />
    </div>
  );
}
