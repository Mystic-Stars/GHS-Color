import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { translate, createTranslator } from '@/lib/i18n';
import type { Language } from '@/types';

/**
 * 翻译Hook
 * 提供翻译功能和当前语言信息
 */
export function useTranslation() {
  const { settings } = useAppStore();
  const currentLanguage = settings.language;

  // 翻译函数
  const t = useCallback(
    (key: string) => translate(currentLanguage, key),
    [currentLanguage]
  );

  // 创建特定语言的翻译函数
  const createT = useCallback(
    (language: Language) => createTranslator(language),
    []
  );

  return {
    t,
    createT,
    language: currentLanguage,
    isZhCN: currentLanguage === 'zh-CN',
    isEnUS: currentLanguage === 'en-US',
  };
}

/**
 * 获取多语言文本的Hook
 * 用于处理已有的双语言字段（如 name/nameZh）
 */
export function useLocalizedText() {
  const { language } = useTranslation();

  const getLocalizedText = useCallback(
    (zhText: string, enText: string) => {
      return language === 'zh-CN' ? zhText : enText;
    },
    [language]
  );

  return { getLocalizedText };
}
