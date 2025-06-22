import { zhCN } from './locales/zh-CN';
import { enUS } from './locales/en-US';
import type { Language } from '@/types';

// 翻译资源
export const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

// 翻译类型
export type TranslationKey = keyof typeof zhCN;
export type NestedTranslationKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedTranslationKey<T[K]> & string}`
        : K & string;
    }[keyof T]
  : never;

export type AllTranslationKeys = NestedTranslationKey<typeof zhCN>;

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

// 翻译函数
export function translate(language: Language, key: string): string {
  const translation = translations[language];
  if (!translation) {
    console.warn(`Translation not found for language: ${language}`);
    return key;
  }

  const value = getNestedValue(translation, key);
  if (typeof value !== 'string') {
    console.warn(`Translation key not found: ${key} for language: ${language}`);
    return key;
  }

  return value;
}

// 创建翻译函数的快捷方式
export function createTranslator(language: Language) {
  return (key: string) => translate(language, key);
}

// 支持的语言列表
export const supportedLanguages: Language[] = ['zh-CN', 'en-US'];

// 默认语言
export const defaultLanguage: Language = 'zh-CN';

// 检测浏览器语言
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const browserLang = navigator.language || navigator.languages?.[0];
  
  // 精确匹配
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  // 语言代码匹配（如 'en' 匹配 'en-US'）
  const langCode = browserLang?.split('-')[0];
  const matchedLang = supportedLanguages.find(lang => lang.startsWith(langCode));
  
  return matchedLang || defaultLanguage;
}

// 语言显示名称
export const languageNames: Record<Language, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

// 语言对应的国家代码（用于国旗图标）
export const languageCountryCodes: Record<Language, string> = {
  'zh-CN': 'CN',
  'en-US': 'US',
};

// 语言配置（包含名称和国家代码）
export const languageConfig: Record<Language, { name: string; countryCode: string; locale: string }> = {
  'zh-CN': {
    name: languageNames['zh-CN'],
    countryCode: languageCountryCodes['zh-CN'],
    locale: 'zh-CN',
  },
  'en-US': {
    name: languageNames['en-US'],
    countryCode: languageCountryCodes['en-US'],
    locale: 'en-US',
  },
};

// 导出翻译资源类型
export type Translations = typeof translations;
export type TranslationResource = typeof zhCN;
