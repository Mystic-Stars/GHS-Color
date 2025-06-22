'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, Palette, RotateCcw, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Badge,
} from '@/components/ui';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import {
  formatColor,
  convertToHex,
  validateColorFormat,
  copyToClipboard,
  getContrastColor,
} from '@/utils';
import type { ColorFormat } from '@/types';

interface ColorConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ColorValue {
  format: ColorFormat;
  value: string;
  isValid: boolean;
  error?: string;
}

interface ValidationState {
  isValid: boolean;
  error?: string;
  isValidating: boolean;
}

const COLOR_FORMATS: {
  format: ColorFormat;
  label: string;
  placeholder: string;
}[] = [
  { format: 'hex', label: 'HEX', placeholder: '#FF5733' },
  { format: 'rgb', label: 'RGB', placeholder: 'rgb(255, 87, 51)' },
  { format: 'rgba', label: 'RGBA', placeholder: 'rgba(255, 87, 51, 1)' },
  { format: 'hsl', label: 'HSL', placeholder: 'hsl(9, 100%, 60%)' },
  { format: 'hsla', label: 'HSLA', placeholder: 'hsla(9, 100%, 60%, 1)' },
  { format: 'hsv', label: 'HSV', placeholder: 'hsv(9, 80%, 100%)' },
  { format: 'css', label: 'CSS Variable', placeholder: 'var(--color-ff5733)' },
];

// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 500;

export function ColorConverterModal({
  open,
  onOpenChange,
}: ColorConverterModalProps) {
  const { t } = useTranslation();
  const { success } = useToast();

  const [inputValue, setInputValue] = useState('');
  const [inputFormat, setInputFormat] = useState<ColorFormat>('hex');
  const [currentHex, setCurrentHex] = useState('#FF5733');
  const [colorValues, setColorValues] = useState<ColorValue[]>([]);
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    isValidating: false,
  });

  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // 初始化颜色值
  const initializeColorValues = useCallback(
    (hex: string) => {
      const values: ColorValue[] = COLOR_FORMATS.map(({ format }) => {
        try {
          const value = formatColor(hex, format);
          return {
            format,
            value,
            isValid: true,
          };
        } catch (err) {
          return {
            format,
            value: '',
            isValid: false,
            error: t('tools.colorConverter.conversionFailed'),
          };
        }
      });
      setColorValues(values);
    },
    [t]
  );

  // 验证和转换颜色（不使用toast，返回结果）
  const validateAndConvert = useCallback(
    (
      value: string,
      format: ColorFormat
    ): {
      isValid: boolean;
      error?: string;
      hex?: string;
    } => {
      if (!value.trim()) {
        return { isValid: true };
      }

      try {
        // 验证输入格式
        const isValid = validateColorFormat(value, format);
        if (!isValid) {
          return {
            isValid: false,
            error: t('tools.colorConverter.invalidFormat'),
          };
        }

        // 转换为HEX
        const hex = convertToHex(value, format);
        if (!hex) {
          return {
            isValid: false,
            error: t('tools.colorConverter.conversionFailed'),
          };
        }

        return {
          isValid: true,
          hex,
        };
      } catch (err) {
        return {
          isValid: false,
          error: t('tools.colorConverter.conversionFailed'),
        };
      }
    },
    [t]
  );

  // 防抖转换函数
  const debouncedConvert = useCallback(
    (value: string, format: ColorFormat) => {
      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 如果输入为空，立即重置
      if (!value.trim()) {
        setValidationState({ isValid: true, isValidating: false });
        initializeColorValues(currentHex);
        return;
      }

      // 设置验证中状态
      setValidationState((prev) => ({ ...prev, isValidating: true }));

      // 设置新的定时器
      debounceTimerRef.current = setTimeout(() => {
        const result = validateAndConvert(value, format);

        setValidationState({
          isValid: result.isValid,
          error: result.error,
          isValidating: false,
        });

        if (result.isValid && result.hex) {
          setCurrentHex(result.hex);
          initializeColorValues(result.hex);
        }
      }, DEBOUNCE_DELAY);
    },
    [validateAndConvert, initializeColorValues, currentHex]
  );

  // 处理输入变化
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedConvert(value, inputFormat);
    },
    [debouncedConvert, inputFormat]
  );

  // 处理格式变化
  const handleFormatChange = useCallback(
    (format: ColorFormat) => {
      setInputFormat(format);
      // 清除之前的验证状态
      setValidationState({ isValid: true, isValidating: false });

      if (inputValue.trim()) {
        debouncedConvert(inputValue, format);
      }
    },
    [debouncedConvert, inputValue]
  );

  // 处理输入框失去焦点
  const handleInputBlur = useCallback(() => {
    // 如果正在验证中，立即执行验证
    if (validationState.isValidating && debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      const result = validateAndConvert(inputValue, inputFormat);

      setValidationState({
        isValid: result.isValid,
        error: result.error,
        isValidating: false,
      });

      if (result.isValid && result.hex) {
        setCurrentHex(result.hex);
        initializeColorValues(result.hex);
      }
    }
  }, [
    validationState.isValidating,
    validateAndConvert,
    inputValue,
    inputFormat,
    initializeColorValues,
  ]);

  // 处理回车键
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInputBlur();
      }
    },
    [handleInputBlur]
  );

  // 复制颜色值
  const handleCopy = useCallback(
    async (value: string, format: ColorFormat) => {
      const copySuccess = await copyToClipboard(value);
      if (copySuccess) {
        success(`${t('tools.colorConverter.copySuccess')}: ${value}`);
      }
      // 移除复制失败的toast，因为用户可以看到复制是否成功
    },
    [success, t]
  );

  // 重置
  const handleReset = useCallback(() => {
    // 清除防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setInputValue('');
    setInputFormat('hex');
    setCurrentHex('#FF5733');
    setValidationState({ isValid: true, isValidating: false });
    initializeColorValues('#FF5733');
  }, [initializeColorValues]);

  // 初始化
  useEffect(() => {
    if (open && !isInitializedRef.current) {
      initializeColorValues(currentHex);
      isInitializedRef.current = true;
    } else if (!open) {
      isInitializedRef.current = false;
    }
  }, [open, currentHex, initializeColorValues]);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const contrastColor = getContrastColor(currentHex);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('tools.colorConverter.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 颜色预览 */}
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-lg border shadow-sm flex items-center justify-center text-sm font-medium"
              style={{
                backgroundColor: currentHex,
                color: contrastColor,
              }}
            >
              {currentHex}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">
                {t('tools.colorConverter.preview')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('tools.colorConverter.previewDescription')}
              </p>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              {t('tools.colorConverter.input')}
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={inputFormat}
                  onChange={(e) =>
                    handleFormatChange(e.target.value as ColorFormat)
                  }
                  className="px-3 py-2 border rounded-md bg-background text-sm min-w-[100px]"
                >
                  {COLOR_FORMATS.map(({ format, label }) => (
                    <option key={format} value={format}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      COLOR_FORMATS.find((f) => f.format === inputFormat)
                        ?.placeholder || ''
                    }
                    className={`w-full ${
                      !validationState.isValid
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                  />
                  {validationState.isValidating && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  title={t('common.reset')}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* 内联错误提示 */}
              {!validationState.isValid && validationState.error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{validationState.error}</span>
                </div>
              )}

              {/* 验证中提示 */}
              {validationState.isValidating && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                  <span>{t('tools.colorConverter.validating')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 转换结果 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              {t('tools.colorConverter.results')}
            </h3>
            <div className="grid gap-3">
              {colorValues.map(({ format, value, isValid, error }) => {
                const formatInfo = COLOR_FORMATS.find(
                  (f) => f.format === format
                );
                return (
                  <div
                    key={format}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                  >
                    <Badge
                      variant="secondary"
                      className="min-w-[80px] justify-center"
                    >
                      {formatInfo?.label || format.toUpperCase()}
                    </Badge>
                    <div className="flex-1 font-mono text-sm">
                      {isValid ? (
                        value
                      ) : (
                        <span className="text-muted-foreground">
                          {error || t('tools.colorConverter.invalidValue')}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(value, format)}
                      disabled={!isValid || !value}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{t('tools.colorConverter.usage')}</p>
            <p>{t('tools.colorConverter.supportedFormats')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
