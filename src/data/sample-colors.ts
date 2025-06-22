import type { ExtendedColor } from '@/types';
import { generateId, getColorTemperature } from '@/utils';

/**
 * 创建颜色数据的辅助函数
 */
function createColor(
  name: string,
  nameZh: string,
  hex: string,
  description: string,
  descriptionZh: string,
  category: string,
  tags: string[],
  isFavorite: boolean = false,
  usageCount: number = 0
): ExtendedColor {
  return {
    id: generateId(),
    name,
    nameZh,
    hex,
    description,
    descriptionZh,
    temperature: getColorTemperature(hex), // 自动计算颜色温度
    category,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite,
    usageCount,
  };
}

/**
 * 示例颜色数据
 */
export const sampleColors: ExtendedColor[] = [
  createColor(
    'Primary Blue',
    '主蓝色',
    '#3B82F6',
    'Primary brand color',
    '主要品牌色',
    'brand',
    ['primary', 'brand', 'blue'],
    true,
    15
  ),
  createColor(
    'Success Green',
    '成功绿',
    '#10B981',
    'Success state color',
    '成功状态颜色',
    'ui',
    ['success', 'green', 'status'],
    false,
    8
  ),
  createColor(
    'Warning Orange',
    '警告橙',
    '#F59E0B',
    'Warning state color',
    '警告状态颜色',
    'ui',
    ['warning', 'orange', 'status'],
    false,
    5
  ),
  createColor(
    'Error Red',
    '错误红',
    '#EF4444',
    'Error state color',
    '错误状态颜色',
    'ui',
    ['error', 'red', 'status'],
    true,
    12
  ),
  createColor(
    'Team Lead Purple',
    '团队负责人紫',
    '#8B5CF6',
    'Team lead representative color',
    '团队负责人代表色',
    'team',
    ['team', 'purple', 'lead'],
    false,
    3
  ),
  createColor(
    'Designer Pink',
    '设计师粉',
    '#EC4899',
    'Designer representative color',
    '设计师代表色',
    'team',
    ['team', 'pink', 'designer'],
    true,
    7
  ),
  createColor(
    'Developer Cyan',
    '开发者青',
    '#06B6D4',
    'Developer representative color',
    '开发者代表色',
    'team',
    ['team', 'cyan', 'developer'],
    false,
    9
  ),
  createColor(
    'Neutral Gray',
    '中性灰',
    '#6B7280',
    'Neutral gray color',
    '中性灰色',
    'brand',
    ['neutral', 'gray', 'text'],
    false,
    20
  ),
  createColor(
    'Dark Charcoal',
    '深炭色',
    '#374151',
    'Dark charcoal for text',
    '用于文本的深炭色',
    'ui',
    ['dark', 'text', 'charcoal'],
    false,
    25
  ),
  createColor(
    'Light Background',
    '浅色背景',
    '#F9FAFB',
    'Light background color',
    '浅色背景颜色',
    'ui',
    ['light', 'background', 'white'],
    false,
    18
  ),
  createColor(
    'Box Yellow',
    '盒子黄',
    '#f6dc50',
    'The exclusive yellow color of BoxWorld, the logo color of GHS.',
    '盒王的专属黄色，GHS的标志颜色。',
    'brand',
    ['brand', 'yellow', 'logo', 'ghs'],
    true,
    25
  ),
  createColor(
    'MysticStars Yellow',
    '星星黄',
    '#ffc91a',
    'Little cute stars.',
    '可爱小星星的超级标志黄色。',
    'brand',
    ['brand', 'yellow', 'stars', 'cute'],
    true,
    22
  ),
  createColor(
    'zzh Blue',
    '周周蓝',
    '#1f91dc',
    "Turquoise depths with azure meet, A sea's calm whisper, soft and sweet.",
    '碧水深流，海面一抹幽蓝。',
    'brand',
    ['brand', 'blue', 'ocean', 'calm'],
    true,
    30
  ),
  createColor(
    'Final Black',
    '终末黑',
    '#000205',
    'The final colour, the echo of the world.',
    '终末的色彩，世间的残响。',
    'ui',
    ['dark', 'black', 'final', 'echo'],
    false,
    15
  ),
  createColor(
    'Lafcadian Blue',
    '氿月蓝',
    '#66ccff',
    'The color of Highness Tianyi.',
    '即天依蓝',
    'brand',
    ['brand', 'blue', 'tianyi', 'special'],
    true,
    28
  ),
];
