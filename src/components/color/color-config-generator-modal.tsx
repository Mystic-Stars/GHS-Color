'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Palette, X, Plus, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  Badge,
} from '@/components/ui';
import type { SelectOption } from '@/components/ui';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { useColorStore } from '@/store';
import {
  copyToClipboard,
  isValidHex,
  normalizeHex,
  getContrastColor,
} from '@/utils';

interface ColorConfigGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ColorFormData {
  id: string;
  name: string;
  nameZh: string;
  hex: string;
  description: string;
  descriptionZh: string;
  category: string;
  tags: string[];
}

interface FormErrors {
  id?: string;
  name?: string;
  nameZh?: string;
  hex?: string;
  description?: string;
  descriptionZh?: string;
  category?: string;
}

const initialFormData: ColorFormData = {
  id: '',
  name: '',
  nameZh: '',
  hex: '',
  description: '',
  descriptionZh: '',
  category: '',
  tags: [],
};

export function ColorConfigGeneratorModal({
  open,
  onOpenChange,
}: ColorConfigGeneratorModalProps) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { categories } = useColorStore();
  
  const [formData, setFormData] = useState<ColorFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [touchedFields, setTouchedFields] = useState<Set<keyof ColorFormData>>(new Set());

  // 验证ID格式
  const validateId = useCallback((id: string): boolean => {
    return /^[a-z0-9-]+$/.test(id);
  }, []);

  // 验证表单
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = t('tools.colorConfigGenerator.validation.idRequired');
    } else if (!validateId(formData.id)) {
      newErrors.id = t('tools.colorConfigGenerator.validation.idInvalid');
    }

    if (!formData.name.trim()) {
      newErrors.name = t('tools.colorConfigGenerator.validation.nameRequired');
    }

    if (!formData.nameZh.trim()) {
      newErrors.nameZh = t('tools.colorConfigGenerator.validation.nameZhRequired');
    }

    if (!formData.hex.trim()) {
      newErrors.hex = t('tools.colorConfigGenerator.validation.hexRequired');
    } else if (!isValidHex(formData.hex)) {
      newErrors.hex = t('tools.colorConfigGenerator.validation.hexInvalid');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('tools.colorConfigGenerator.validation.descriptionRequired');
    }

    if (!formData.descriptionZh.trim()) {
      newErrors.descriptionZh = t('tools.colorConfigGenerator.validation.descriptionZhRequired');
    }

    if (!formData.category) {
      newErrors.category = t('tools.colorConfigGenerator.validation.categoryRequired');
    }

    return newErrors;
  }, [formData, t, validateId]);

  // 生成JSON配置（不显示验证错误）
  const generateJsonPreview = useCallback(() => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const config = {
        id: formData.id,
        name: formData.name,
        nameZh: formData.nameZh,
        hex: normalizeHex(formData.hex),
        description: formData.description,
        descriptionZh: formData.descriptionZh,
        category: formData.category,
        tags: formData.tags,
      };

      const jsonString = JSON.stringify(config, null, 2);
      setGeneratedJson(jsonString);
    } else {
      setGeneratedJson('');
    }
  }, [formData, validateForm]);

  // 验证表单并显示错误（用于提交时）
  const validateAndShowErrors = useCallback(() => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [validateForm]);

  // 监听表单变化，实时生成JSON
  useEffect(() => {
    generateJsonPreview();
  }, [generateJsonPreview]);

  // 处理表单字段变化
  const handleFieldChange = (field: keyof ColorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除对应字段的错误（只有在字段已被触摸过的情况下）
    if (touchedFields.has(field) && errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field as keyof FormErrors]: undefined,
      }));
    }
  };

  // 处理字段失去焦点
  const handleFieldBlur = (field: keyof ColorFormData) => {
    // 标记字段为已触摸
    setTouchedFields(prev => new Set(prev).add(field));

    // 验证单个字段
    const fieldValue = formData[field];
    let fieldError: string | undefined;

    switch (field) {
      case 'id':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.idRequired');
        } else if (!validateId(fieldValue.toString())) {
          fieldError = t('tools.colorConfigGenerator.validation.idInvalid');
        }
        break;
      case 'name':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.nameRequired');
        }
        break;
      case 'nameZh':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.nameZhRequired');
        }
        break;
      case 'hex':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.hexRequired');
        } else if (!isValidHex(fieldValue.toString())) {
          fieldError = t('tools.colorConfigGenerator.validation.hexInvalid');
        }
        break;
      case 'description':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.descriptionRequired');
        }
        break;
      case 'descriptionZh':
        if (!fieldValue.toString().trim()) {
          fieldError = t('tools.colorConfigGenerator.validation.descriptionZhRequired');
        }
        break;
      case 'category':
        if (!fieldValue.toString()) {
          fieldError = t('tools.colorConfigGenerator.validation.categoryRequired');
        }
        break;
    }

    // 设置字段错误
    setErrors(prev => ({
      ...prev,
      [field as keyof FormErrors]: fieldError,
    }));
  };

  // 处理标签输入
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // 复制JSON到剪贴板
  const handleCopyJson = async () => {
    // 先进行完整验证
    if (!validateAndShowErrors()) {
      error(t('tools.colorConfigGenerator.validation.formInvalid'));
      return;
    }

    if (!generatedJson) return;

    try {
      await copyToClipboard(generatedJson);
      success(t('tools.colorConfigGenerator.preview.copySuccess'));
    } catch (err) {
      error(t('tools.colorConfigGenerator.preview.copyFailed'));
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTagInput('');
    setGeneratedJson('');
    setTouchedFields(new Set());
  };

  // 获取颜色预览的对比色
  const getPreviewTextColor = () => {
    if (!formData.hex || !isValidHex(formData.hex)) {
      return '#000000';
    }
    return getContrastColor(normalizeHex(formData.hex));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('tools.colorConfigGenerator.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* 左侧：表单 */}
          <div className="space-y-4">
            <div className="space-y-4">
              {/* ID字段 */}
              <div className="space-y-2">
                <label htmlFor="color-id" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.id')} *
                </label>
                <Input
                  id="color-id"
                  value={formData.id}
                  onChange={(e) => handleFieldChange('id', e.target.value)}
                  onBlur={() => handleFieldBlur('id')}
                  placeholder={t('tools.colorConfigGenerator.form.idPlaceholder')}
                  className={errors.id ? 'border-destructive' : ''}
                />
                {errors.id && (
                  <p className="text-sm text-destructive">{errors.id}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('tools.colorConfigGenerator.form.idHelp')}
                </p>
              </div>

              {/* 英文名称 */}
              <div className="space-y-2">
                <label htmlFor="color-name" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.name')} *
                </label>
                <Input
                  id="color-name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  placeholder={t('tools.colorConfigGenerator.form.namePlaceholder')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* 中文名称 */}
              <div className="space-y-2">
                <label htmlFor="color-name-zh" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.nameZh')} *
                </label>
                <Input
                  id="color-name-zh"
                  value={formData.nameZh}
                  onChange={(e) => handleFieldChange('nameZh', e.target.value)}
                  onBlur={() => handleFieldBlur('nameZh')}
                  placeholder={t('tools.colorConfigGenerator.form.nameZhPlaceholder')}
                  className={errors.nameZh ? 'border-destructive' : ''}
                />
                {errors.nameZh && (
                  <p className="text-sm text-destructive">{errors.nameZh}</p>
                )}
              </div>

              {/* 颜色值 */}
              <div className="space-y-2">
                <label htmlFor="color-hex" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.hex')} *
                </label>
                <div className="flex gap-2">
                  <Input
                    id="color-hex"
                    value={formData.hex}
                    onChange={(e) => handleFieldChange('hex', e.target.value)}
                    onBlur={() => handleFieldBlur('hex')}
                    placeholder={t('tools.colorConfigGenerator.form.hexPlaceholder')}
                    className={errors.hex ? 'border-destructive' : ''}
                  />
                  <input
                    type="color"
                    value={isValidHex(formData.hex) ? normalizeHex(formData.hex) : '#000000'}
                    onChange={(e) => handleFieldChange('hex', e.target.value)}
                    className="w-10 h-10 sm:w-12 sm:h-10 rounded border border-input cursor-pointer flex-shrink-0"
                  />
                </div>
                {errors.hex && (
                  <p className="text-sm text-destructive">{errors.hex}</p>
                )}
              </div>

              {/* 英文描述 */}
              <div className="space-y-2">
                <label htmlFor="color-description" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.description')} *
                </label>
                <textarea
                  id="color-description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                  placeholder={t('tools.colorConfigGenerator.form.descriptionPlaceholder')}
                  className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.description ? 'border-destructive' : ''}`}
                  rows={2}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* 中文描述 */}
              <div className="space-y-2">
                <label htmlFor="color-description-zh" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.descriptionZh')} *
                </label>
                <textarea
                  id="color-description-zh"
                  value={formData.descriptionZh}
                  onChange={(e) => handleFieldChange('descriptionZh', e.target.value)}
                  onBlur={() => handleFieldBlur('descriptionZh')}
                  placeholder={t('tools.colorConfigGenerator.form.descriptionZhPlaceholder')}
                  className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.descriptionZh ? 'border-destructive' : ''}`}
                  rows={2}
                />
                {errors.descriptionZh && (
                  <p className="text-sm text-destructive">{errors.descriptionZh}</p>
                )}
              </div>

              {/* 分类 */}
              <div className="space-y-2">
                <label htmlFor="color-category" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.category')} *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFieldChange('category', value)}
                  onBlur={() => handleFieldBlur('category')}
                  options={categories.map((category) => ({
                    value: category.id,
                    label: `${category.icon} ${category.nameZh}`,
                  }))}
                  placeholder={t('tools.colorConfigGenerator.form.categoryPlaceholder')}
                  className={errors.category ? 'border-destructive' : ''}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label htmlFor="color-tags" className="text-sm font-medium">
                  {t('tools.colorConfigGenerator.form.tags')}
                </label>
                <Input
                  id="color-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={t('tools.colorConfigGenerator.form.tagsPlaceholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('tools.colorConfigGenerator.form.tagsHelp')}
                </p>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 text-sm"
                  size="sm"
                >
                  {t('common.reset')}
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧：预览和JSON */}
          <div className="space-y-4">
            {/* 颜色预览 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tools.colorConfigGenerator.preview.title')}</label>
              <div
                className="h-16 sm:h-20 rounded-lg border flex items-center justify-center text-xs sm:text-sm font-medium"
                style={{
                  backgroundColor: isValidHex(formData.hex) ? normalizeHex(formData.hex) : '#f3f4f6',
                  color: getPreviewTextColor(),
                }}
              >
                {formData.nameZh || formData.name || 'Color Preview'}
              </div>
            </div>

            {/* JSON预览 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('tools.colorConfigGenerator.preview.jsonTitle')}</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJson}
                  disabled={!generatedJson}
                  className="h-8 text-xs sm:text-sm"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{t('tools.colorConfigGenerator.preview.copyJson')}</span>
                  <span className="sm:hidden">{t('common.copy')}</span>
                </Button>
              </div>
              <div className="relative">
                <pre className="bg-muted p-2 sm:p-3 rounded-lg text-xs overflow-x-auto max-h-32 sm:max-h-40 border">
                  <code>{generatedJson || '// JSON will appear here when form is valid'}</code>
                </pre>
              </div>
            </div>

            {/* 使用说明 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('tools.colorConfigGenerator.usage.title')}
              </label>
              <div className="bg-muted/50 p-2 sm:p-3 rounded-lg text-xs space-y-1">
                <p>{t('tools.colorConfigGenerator.usage.step1')}</p>
                <p>{t('tools.colorConfigGenerator.usage.step2')}</p>
                <p>{t('tools.colorConfigGenerator.usage.step3')}</p>
                <p>{t('tools.colorConfigGenerator.usage.step4')}</p>
                <p>{t('tools.colorConfigGenerator.usage.step5')}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
