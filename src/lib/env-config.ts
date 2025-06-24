import type { ExtendedColor, ColorCategory } from '@/types';
import { getColorTemperature } from '@/utils/color';

// 动态导入配置文件
let configColors: any[] = [];
let configCategories: any[] = [];

try {
  const config = require('../../config.js');
  configColors = config.colors || [];
  configCategories = config.categories || [];
} catch (error) {
  console.warn('Failed to load config.js, falling back to environment variables');
}

/**
 * 应用配置
 */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'GHS Color Next',
  mainTitle: process.env.NEXT_PUBLIC_APP_MAIN_TITLE || 'GHS Color',
  suffix: process.env.NEXT_PUBLIC_APP_SUFFIX || 'Next',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '现代化色彩管理工具',
  descriptionEn:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION_EN ||
    'Modern Color Management Tool',
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ||
    'https://github.com/Mystic-Stars/GHS-Color',

  // 页面配置 - 支持多语言
  site: {
    // 中文配置
    title:
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'GHS Color Next - 现代化色彩管理工具',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      '基于原版GHS Color重构的现代化色彩管理工具',

    // 英文配置
    titleEn:
      process.env.NEXT_PUBLIC_SITE_TITLE_EN ||
      'GHS Color Next - Modern Color Management Tool',
    descriptionEn:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN ||
      'A modern color management tool based on the original GHS Color, supporting multiple color formats, theme switching, multi-language and more',

    // 关键字（通用，不需要多语言）
    keywords:
      process.env.NEXT_PUBLIC_SITE_KEYWORDS ||
      'GHS Color,color management,color tool,design tool,color picker,palette,颜色管理,色彩工具',
  },
};

/**
 * 从环境变量或配置文件加载颜色数据
 * 优先级：环境变量 > config.js文件
 */
export function loadColorsFromEnv(): ExtendedColor[] {
  try {
    // 首先尝试从环境变量加载（优先级最高）
    const colorsJson = process.env.NEXT_PUBLIC_COLORS;
    if (colorsJson) {
      console.info('Loading colors from environment variables');
      const rawColors = JSON.parse(colorsJson);
      const colors: ExtendedColor[] = rawColors.map(
        (color: any, index: number) => {
          const hex = color.hex || '#000000';
          return {
            id: color.id || `color-${index}`,
            name: color.name || 'Unnamed Color',
            nameZh: color.nameZh || '未命名颜色',
            hex,
            description: color.description || '',
            descriptionZh: color.descriptionZh || '',
            temperature: getColorTemperature(hex),
            category: color.category,
            tags: color.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            usageCount: 0,
            rgb: color.rgb,
            hsl: color.hsl,
          };
        }
      );
      return colors;
    }

    // 回退到配置文件
    if (configColors && configColors.length > 0) {
      console.info('Loading colors from config.js file');
      const colors: ExtendedColor[] = configColors.map(
        (color: any, index: number) => {
          const hex = color.hex || '#000000';
          return {
            id: color.id || `color-${index}`,
            name: color.name || 'Unnamed Color',
            nameZh: color.nameZh || '未命名颜色',
            hex,
            description: color.description || '',
            descriptionZh: color.descriptionZh || '',
            temperature: getColorTemperature(hex), // 自动计算颜色温度
            category: color.category,
            tags: color.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            usageCount: 0,
            rgb: color.rgb,
            hsl: color.hsl,
          };
        }
      );
      return colors;
    }

    console.warn('No colors found in environment variables or config file');
    return [];
  } catch (error) {
    console.error('Failed to load colors from environment variables or config file:', error);
    return [];
  }
}

/**
 * 从环境变量或配置文件加载分类数据
 * 优先级：环境变量 > config.js文件 > 默认分类
 */
export function loadCategoriesFromEnv(): ColorCategory[] {
  try {
    // 首先尝试从环境变量加载（优先级最高）
    const categoriesJson = process.env.NEXT_PUBLIC_CATEGORIES;
    if (categoriesJson) {
      console.info('Loading categories from environment variables');
      const categories = JSON.parse(categoriesJson);
      return categories.map((category: any) => ({
        id: category.id || 'default',
        name: category.name || 'Default Category',
        nameZh: category.nameZh || '默认分类',
        description: category.description,
        icon: category.icon || '📁',
        color: category.color || '#6B7280',
        order: category.order || 0,
      }));
    }

    // 回退到配置文件
    if (configCategories && configCategories.length > 0) {
      console.info('Loading categories from config.js file');
      return configCategories.map((category: any) => ({
        id: category.id || 'default',
        name: category.name || 'Default Category',
        nameZh: category.nameZh || '默认分类',
        description: category.description,
        icon: category.icon || '📁',
        color: category.color || '#6B7280',
        order: category.order || 0,
      }));
    }

    // 最后回退到默认分类
    console.warn('No categories found in environment variables or config file, using defaults');
    return getDefaultCategories();
  } catch (error) {
    console.error(
      'Failed to load categories from environment variables or config file:',
      error
    );
    return getDefaultCategories();
  }
}

/**
 * 获取默认分类
 */
function getDefaultCategories(): ColorCategory[] {
  return [
    {
      id: 'brand',
      name: 'Brand Colors',
      nameZh: '品牌色',
      description: 'Primary brand colors',
      icon: '🎨',
      color: '#6366F1',
      order: 1,
    },
    {
      id: 'ui',
      name: 'UI Colors',
      nameZh: 'UI色彩',
      description: 'User interface colors',
      icon: '🖥️',
      color: '#10B981',
      order: 2,
    },
    {
      id: 'team',
      name: 'Team Colors',
      nameZh: '团队色彩',
      description: 'Team member colors',
      icon: '👥',
      color: '#F59E0B',
      order: 3,
    },
  ];
}

/**
 * 获取GitHub提交指南配置
 */
export const submitGuideConfig = {
  githubUrl: appConfig.githubUrl,
  issueUrl: `${appConfig.githubUrl}/issues/new`,
  contributingUrl: `${appConfig.githubUrl}/blob/main/CONTRIBUTING.md`,

  // 提交模板
  issueTemplate: {
    title: '新颜色提交申请',
    body: `## 颜色信息

**颜色名称（英文）：**
**颜色名称（中文）：**
**HEX值：** #
**颜色描述（英文）：**
**颜色描述（中文）：**
**分类：** [brand/ui/team/其他]
**标签：**

> 注意：颜色温度将根据HEX值自动识别，无需手动指定

## 使用场景

请描述这个颜色的使用场景和用途：


## 其他说明

如有其他需要说明的信息，请在此处添加：

`,
  },
};
