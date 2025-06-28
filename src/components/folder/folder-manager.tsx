'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Copy, Save, X, Folder, FolderPlus,
  Palette, Heart, Star, Zap, Target, Rocket, Sparkles, Camera,
  Music, Image, Film, Bookmark, Tag, Archive, Package, Box,
  Briefcase, Coffee, Home, Settings, Users, Globe
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Textarea,
  Label,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useFolderStore } from '@/store/folder-store';
import { useTranslation, useLocalizedText } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import type { ColorFolder } from '@/types';

interface FolderManagerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editingFolder?: ColorFolder | null;
  onFolderCreated?: (folder: ColorFolder) => void;
  onFolderUpdated?: (folder: ColorFolder) => void;
  showTriggerButton?: boolean; // 控制是否显示触发按钮
}

interface FolderFormData {
  name: string;
  description: string;
  icon: string;
  iconColor: string;
}

const defaultFormData: FolderFormData = {
  name: '',
  description: '',
  icon: 'folder',
  iconColor: '#ffffff',
};

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

// 可选择的图标列表
const commonIcons = [
  'folder', 'folder-plus', 'palette', 'heart', 'star', 'zap',
  'target', 'rocket', 'sparkles', 'camera', 'music', 'image',
  'film', 'bookmark', 'tag', 'archive', 'package', 'box',
  'briefcase', 'coffee', 'home', 'settings', 'users', 'globe',
];

const commonIconColors = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b',
  '#475569', '#334155', '#1e293b', '#0f172a', '#000000', '#ef4444',
  '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#06b6d4',
];

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

export function FolderManager({
  open = false,
  onOpenChange,
  editingFolder,
  onFolderCreated,
  onFolderUpdated,
  showTriggerButton = true, // 默认显示触发按钮，保持向后兼容
}: FolderManagerProps) {
  const { createFolder, updateFolder, deleteFolder, folders, getFolderStats } = useFolderStore();
  const { t } = useTranslation();
  const { getLocalizedText } = useLocalizedText();
  const { success, error } = useToast();

  const [isOpen, setIsOpen] = useState(open);
  const [formData, setFormData] = useState<FolderFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<FolderFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingFolder;

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (editingFolder) {
      setFormData({
        name: editingFolder.name,
        description: editingFolder.description || '',
        icon: editingFolder.icon || 'folder',
        iconColor: editingFolder.iconColor || '#ffffff',
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [editingFolder]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      setFormData(defaultFormData);
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FolderFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('folder.nameRequired');
    } else if (formData.name.length > 50) {
      newErrors.name = t('folder.nameTooLong');
    }

    if (formData.description.length > 200) {
      newErrors.description = t('folder.descriptionTooLong');
    }

    // 检查名称是否重复
    const existingFolder = folders.find(
      (folder) =>
        folder.id !== editingFolder?.id &&
        folder.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (existingFolder) {
      newErrors.name = t('folder.nameExists');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && editingFolder) {
        updateFolder(editingFolder.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          icon: formData.icon,
          iconColor: formData.iconColor,
        });

        const updatedFolder = { ...editingFolder, ...formData };
        onFolderUpdated?.(updatedFolder);
        success(t('folder.updateSuccess'));
      } else {
        const folderId = createFolder({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          icon: formData.icon,
          iconColor: formData.iconColor,
        });

        const newFolder = folders.find(f => f.id === folderId);
        if (newFolder) {
          onFolderCreated?.(newFolder);
        }
        success(t('folder.createSuccess'));
      }

      handleOpenChange(false);
    } catch (err) {
      error(isEditing ? t('folder.updateFailed') : t('folder.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDelete = () => {
    if (!editingFolder) return;

    if (window.confirm(t('folder.deleteConfirm'))) {
      try {
        deleteFolder(editingFolder.id);
        success(t('folder.deleteSuccess'));
        handleOpenChange(false);
      } catch (err) {
        error(t('folder.deleteFailed'));
      }
    }
  };

  const folderStats = editingFolder ? getFolderStats(editingFolder.id) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {showTriggerButton && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            {t('folder.create')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            {isEditing ? t('folder.edit') : t('folder.create')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 文件夹预览 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50 border border-border">
                  <IconRenderer
                    iconName={formData.icon}
                    className="h-5 w-5"
                    color={formData.iconColor}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {formData.name || t('folder.untitled')}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {formData.description || t('folder.noDescription')}
                  </div>
                  {folderStats && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {folderStats.colorCount} {t('folder.colors')}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 基本信息 */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">{t('folder.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('folder.namePlaceholder')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>



            <div>
              <Label htmlFor="description">{t('folder.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('folder.descriptionPlaceholder')}
                rows={2}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>


          </div>

          {/* 图标选择 */}
          <div>
            <Label>{t('folder.icon')}</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center hover:bg-accent transition-colors ${
                    formData.icon === icon ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <IconRenderer iconName={icon} className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* 图标颜色选择 */}
          <div>
            <Label>{t('folder.iconColor')}</Label>
            <div className="grid grid-cols-9 gap-2 mt-2">
              {commonIconColors.map((iconColor) => (
                <button
                  key={iconColor}
                  type="button"
                  onClick={() => setFormData({ ...formData, iconColor })}
                  className={`w-8 h-8 rounded border-2 ${
                    formData.iconColor === iconColor ? 'border-primary border-2' : 'border-border'
                  }`}
                  style={{ backgroundColor: iconColor }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={formData.iconColor}
              onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
              className="w-full h-10 mt-2"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? t('common.saving')
                : isEditing
                ? t('common.save')
                : t('folder.create')}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
