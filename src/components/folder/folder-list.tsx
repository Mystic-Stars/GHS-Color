'use client';

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Plus,
  Search,
  X,
  Share2,
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
} from '@/components/ui';
import { FolderManager } from './folder-manager';
import { FolderShareDialog } from './folder-share-dialog';
import { DroppableFolder } from '@/components/dnd';
import { useFolderStore } from '@/store/folder-store';
import { useColorStore } from '@/store/color-store';
import { useAppStore } from '@/store/app-store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { useHydration } from '@/hooks/use-init-data';
import type { ColorFolder } from '@/types';

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

interface FolderListProps {
  onFolderSelect?: (folderId: string | null) => void;
  selectedFolderId?: string | null;
  showCreateButton?: boolean;
  compact?: boolean;
}

export function FolderList({
  onFolderSelect,
  selectedFolderId,
  showCreateButton = true,
  compact = false,
}: FolderListProps) {
  const {
    folders,
    folderStats,
    filter,
    setFilter,
    clearFilter,
    getFilteredFolders,
    updateFolderStats,
    deleteFolder,
  } = useFolderStore();

  const { colors } = useColorStore();
  const { addRecentFolder } = useAppStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success, error } = useToast();
  const isHydrated = useHydration();

  const [showManager, setShowManager] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ColorFolder | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sharingFolder, setSharingFolder] = useState<ColorFolder | null>(null);

  // 更新文件夹统计信息
  useEffect(() => {
    if (isHydrated) {
      updateFolderStats(colors);
    }
  }, [colors, updateFolderStats, isHydrated]);

  // 处理搜索
  useEffect(() => {
    if (isHydrated) {
      setFilter({ keyword: searchKeyword });
    }
  }, [searchKeyword, setFilter, isHydrated]);

  // 在水合完成之前不获取过滤后的文件夹
  const filteredFolders = isHydrated ? getFilteredFolders() : [];

  const handleFolderClick = (folderId: string) => {
    onFolderSelect?.(folderId);
    addRecentFolder(folderId);
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setShowManager(true);
  };

  const handleEditFolder = (folder: ColorFolder) => {
    setEditingFolder(folder);
    setShowManager(true);
  };

  const handleShareFolder = (folder: ColorFolder) => {
    setSharingFolder(folder);
  };



  const handleDeleteFolder = (folder: ColorFolder) => {
    if (window.confirm(t('folder.deleteConfirm'))) {
      try {
        deleteFolder(folder.id);
        success(t('folder.deleteSuccess'));

        // 如果删除的是当前选中的文件夹，清除选择
        if (selectedFolderId === folder.id) {
          onFolderSelect?.(null);
        }
      } catch (err) {
        error(t('folder.deleteFailed'));
      }
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    clearFilter();
  };

  // 在水合完成之前显示加载状态
  if (!isHydrated) {
    return (
      <div className="space-y-3">
        <div className="text-center py-8 text-muted-foreground">
          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 搜索栏 */}
      {!compact && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('folder.searchPlaceholder')}
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
      )}

      {/* 创建按钮 */}
      {showCreateButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateFolder}
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('folder.create')}
        </Button>
      )}

      {/* 文件夹列表 */}
      <div className="space-y-1">
        {filteredFolders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchKeyword ? t('folder.noSearchResults') : t('folder.noFolders')}
            </p>
          </div>
        ) : (
          filteredFolders.map((folder) => {
            const stats = folderStats[folder.id];
            const isSelected = selectedFolderId === folder.id;
            const colorCount = stats?.colorCount || 0;

            return (
              <DroppableFolder
                key={folder.id}
                folder={folder}
                className={`group flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-all duration-200 relative ${
                  isSelected ? 'ring-2 ring-primary/30 bg-transparent' : ''
                }`}
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  {/* 文件夹图标 */}
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

                  {/* 文件夹信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {folder.name}
                      </span>

                    </div>
                    
                    {!compact && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {colorCount} {t('folder.colors')}
                        </Badge>
                        {stats?.recentColors && stats.recentColors.length > 0 && (
                          <div className="flex gap-1">
                            {stats.recentColors.slice(0, 3).map((color) => (
                              <div
                                key={color.id}
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t('common.edit')}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleShareFolder(folder)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('folder.share.title')}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteFolder(folder)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DroppableFolder>
            );
          })
        )}
      </div>

      {/* 文件夹管理器 */}
      <FolderManager
        open={showManager}
        onOpenChange={setShowManager}
        editingFolder={editingFolder}
        showTriggerButton={false}
        onFolderCreated={() => {
          // 刷新列表会自动处理
        }}
        onFolderUpdated={() => {
          // 刷新列表会自动处理
        }}
      />

      {/* 文件夹分享对话框 */}
      {sharingFolder && (
        <FolderShareDialog
          folder={sharingFolder}
          open={!!sharingFolder}
          onOpenChange={(open) => {
            if (!open) {
              setSharingFolder(null);
            }
          }}
        />
      )}
    </div>
  );
}
