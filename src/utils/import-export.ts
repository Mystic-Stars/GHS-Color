import type { ExtendedColor, ColorExportData, ColorCategory } from '@/types';
import { normalizeHex, isValidHex, getColorTemperature } from './color';
import { generateId } from '@/lib/utils';

/**
 * 导出颜色数据为JSON
 */
export function exportColorsToJSON(
  colors: ExtendedColor[],
  categories: ColorCategory[]
): string {
  const exportData: ColorExportData = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    colors,
    categories,
    metadata: {
      totalColors: colors.length,
      totalCategories: categories.length,
      exportedBy: 'GHS Color Next',
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * 从JSON导入颜色数据
 */
export function importColorsFromJSON(jsonString: string): {
  colors: ExtendedColor[];
  categories: ColorCategory[];
  success: boolean;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString) as ColorExportData;
    
    // 验证数据格式
    if (!data.colors || !Array.isArray(data.colors)) {
      return {
        colors: [],
        categories: [],
        success: false,
        error: '无效的数据格式：缺少颜色数组',
      };
    }

    // 处理颜色数据
    const processedColors: ExtendedColor[] = data.colors.map((color) => {
      // 确保必要字段存在
      const processedColor: ExtendedColor = {
        id: color.id || generateId(),
        name: color.name || 'Unnamed Color',
        nameZh: color.nameZh || '未命名颜色',
        hex: normalizeHex(color.hex || '#000000'),
        description: color.description || '',
        descriptionZh: color.descriptionZh || '',
        temperature: color.temperature || getColorTemperature(color.hex),
        category: color.category,
        tags: color.tags || [],
        createdAt: color.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: color.isFavorite || false,
        usageCount: color.usageCount || 0,
      };

      return processedColor;
    });

    // 处理分类数据
    const processedCategories: ColorCategory[] = (data.categories || []).map((category) => ({
      id: category.id || generateId(),
      name: category.name || 'Unnamed Category',
      nameZh: category.nameZh || '未命名分类',
      description: category.description,
      icon: category.icon,
      color: category.color,
      order: category.order || 0,
    }));

    return {
      colors: processedColors,
      categories: processedCategories,
      success: true,
    };
  } catch (error) {
    return {
      colors: [],
      categories: [],
      success: false,
      error: `解析JSON失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 导出颜色为CSS变量
 */
export function exportColorsToCSS(colors: ExtendedColor[]): string {
  const cssVariables = colors.map((color) => {
    const variableName = color.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `  --color-${variableName}: ${color.hex}; /* ${color.nameZh} */`;
  }).join('\n');

  return `:root {\n${cssVariables}\n}`;
}

/**
 * 导出颜色为SCSS变量
 */
export function exportColorsToSCSS(colors: ExtendedColor[]): string {
  const scssVariables = colors.map((color) => {
    const variableName = color.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `$color-${variableName}: ${color.hex}; // ${color.nameZh}`;
  }).join('\n');

  return `// GHS Color Next - 颜色变量\n// 导出时间: ${new Date().toLocaleString()}\n\n${scssVariables}`;
}

/**
 * 导出颜色为Adobe Swatch Exchange (ASE) 格式的JSON表示
 */
export function exportColorsToASE(colors: ExtendedColor[]): string {
  const aseData = {
    version: '1.0',
    groups: [
      {
        name: 'GHS Color Next',
        swatches: colors.map((color) => ({
          name: color.nameZh || color.name,
          type: 'global',
          data: {
            mode: 'RGB',
            values: hexToRgbArray(color.hex),
          },
        })),
      },
    ],
  };

  return JSON.stringify(aseData, null, 2);
}

/**
 * 从文件读取内容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('无法读取文件内容'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * 从CSV导入颜色
 */
export function importColorsFromCSV(csvString: string): {
  colors: ExtendedColor[];
  success: boolean;
  error?: string;
} {
  try {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) {
      return {
        colors: [],
        success: false,
        error: 'CSV文件格式无效：至少需要标题行和一行数据',
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const colors: ExtendedColor[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) continue;

      const colorData: any = {};
      headers.forEach((header, index) => {
        colorData[header] = values[index];
      });

      // 验证必要字段
      if (!colorData.hex || !isValidHex(colorData.hex)) {
        continue;
      }

      const color: ExtendedColor = {
        id: generateId(),
        name: colorData.name || colorData.english_name || 'Unnamed Color',
        nameZh: colorData.namezh || colorData.chinese_name || colorData.name_zh || '未命名颜色',
        hex: normalizeHex(colorData.hex),
        description: colorData.description || colorData.desc || '',
        descriptionZh: colorData.descriptionzh || colorData.description_zh || colorData.desc_zh || '',
        temperature: colorData.temperature || getColorTemperature(colorData.hex),
        category: colorData.category,
        tags: colorData.tags ? colorData.tags.split(';').filter(Boolean) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        usageCount: 0,
      };

      colors.push(color);
    }

    return {
      colors,
      success: true,
    };
  } catch (error) {
    return {
      colors: [],
      success: false,
      error: `解析CSV失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 导出颜色为CSV
 */
export function exportColorsToCSV(colors: ExtendedColor[]): string {
  const headers = [
    'name',
    'nameZh',
    'hex',
    'description',
    'descriptionZh',
    'temperature',
    'category',
    'tags',
    'isFavorite',
    'usageCount',
  ];

  const csvContent = [
    headers.join(','),
    ...colors.map(color => [
      color.name,
      color.nameZh,
      color.hex,
      color.description,
      color.descriptionZh,
      color.temperature,
      color.category || '',
      (color.tags || []).join(';'),
      color.isFavorite ? 'true' : 'false',
      color.usageCount || 0,
    ].join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * HEX转RGB数组（用于ASE格式）
 */
function hexToRgbArray(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}
