/**
 * 颜色温度类型
 */
export type ColorTemperature = 'warm' | 'cool' | 'neutral';

/**
 * 颜色格式类型
 */
export type ColorFormat =
  | 'hex'
  | 'rgb'
  | 'hsl'
  | 'hsv'
  | 'rgba'
  | 'hsla'
  | 'css';

/**
 * 基础颜色接口（兼容原版GHS Color）
 */
export interface Color {
  /** 颜色名称（英文） */
  name: string;
  /** 颜色名称（中文） */
  nameZh: string;
  /** HEX颜色值 */
  hex: string;
  /** 颜色描述（英文） */
  description: string;
  /** 颜色描述（中文） */
  descriptionZh: string;
  /** 颜色温度 */
  temperature: ColorTemperature;
  /** RGB颜色值（可选） */
  rgb?: string;
  /** HSL颜色值（可选） */
  hsl?: string;
}

/**
 * 扩展颜色接口（新版功能）
 */
export interface ExtendedColor extends Color {
  /** 唯一标识符 */
  id: string;
  /** 颜色标签 */
  tags?: string[];
  /** 颜色分类 */
  category?: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 使用次数 */
  usageCount?: number;
}

/**
 * 颜色分类接口
 */
export interface ColorCategory {
  /** 分类ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类名称（中文） */
  nameZh: string;
  /** 分类描述 */
  description?: string;
  /** 分类图标 */
  icon?: string;
  /** 分类颜色 */
  color?: string;
  /** 排序权重 */
  order?: number;
}

/**
 * 颜色搜索过滤器
 */
export interface ColorFilter {
  /** 搜索关键词 */
  keyword?: string;
  /** 颜色分类 */
  categories?: string[];
  /** 颜色标签 */
  tags?: string[];
  /** 颜色温度 */
  temperatures?: ColorTemperature[];
  /** 是否只显示收藏 */
  favoritesOnly?: boolean;
  /** 文件夹过滤 */
  folders?: string[];
  /** 是否只显示未分组的颜色 */
  ungroupedOnly?: boolean;
}

/**
 * 文件夹过滤器
 */
export interface FolderFilter {
  /** 搜索关键词 */
  keyword?: string;
  /** 按颜色数量排序 */
  sortByColorCount?: boolean;
}

/**
 * 颜色排序选项
 */
export type ColorSortBy =
  | 'name'
  | 'nameZh'
  | 'createdAt'
  | 'updatedAt'
  | 'usageCount';
export type ColorSortOrder = 'asc' | 'desc';

export interface ColorSort {
  by: ColorSortBy;
  order: ColorSortOrder;
}

/**
 * 颜色导出格式
 */
export interface ColorExportData {
  /** 导出版本 */
  version: string;
  /** 导出时间 */
  exportedAt: string;
  /** 颜色数据 */
  colors: ExtendedColor[];
  /** 分类数据 */
  categories: ColorCategory[];
  /** 元数据 */
  metadata?: {
    totalColors: number;
    totalCategories: number;
    [key: string]: any;
  };
}

/**
 * 颜色统计信息
 */
export interface ColorStats {
  /** 总颜色数 */
  totalColors: number;
  /** 分类统计 */
  categoryCounts: Record<string, number>;
  /** 温度统计 */
  temperatureCounts: Record<ColorTemperature, number>;
  /** 收藏数量 */
  favoriteCount: number;
  /** 最近使用的颜色 */
  recentColors: ExtendedColor[];
  /** 最受欢迎的颜色 */
  popularColors: ExtendedColor[];
}

/**
 * RGB颜色值接口
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * RGBA颜色值接口
 */
export interface RGBAColor extends RGBColor {
  a: number;
}

/**
 * HSL颜色值接口
 */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * HSLA颜色值接口
 */
export interface HSLAColor extends HSLColor {
  a: number;
}

/**
 * HSV颜色值接口
 */
export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

/**
 * 颜色文件夹接口
 */
export interface ColorFolder {
  /** 文件夹ID */
  id: string;
  /** 文件夹名称 */
  name: string;
  /** 文件夹描述 */
  description?: string;
  /** 文件夹图标 */
  icon?: string;
  /** 文件夹图标颜色 */
  iconColor?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 排序权重 */
  order?: number;
}

/**
 * 颜色与文件夹的关联关系
 */
export interface ColorFolderRelation {
  /** 关联ID */
  id: string;
  /** 颜色ID */
  colorId: string;
  /** 文件夹ID */
  folderId: string;
  /** 添加时间 */
  addedAt: string;
  /** 添加者（可选，用于多用户场景） */
  addedBy?: string;
}

/**
 * 文件夹统计信息
 */
export interface FolderStats {
  /** 文件夹ID */
  folderId: string;
  /** 颜色数量 */
  colorCount: number;
  /** 最近添加的颜色 */
  recentColors: ExtendedColor[];
  /** 最后更新时间 */
  lastUpdated: string;
}

/**
 * 颜色转换工具的输入类型
 */
export interface ColorConverterInput {
  format: ColorFormat;
  value: string;
}

/**
 * 颜色转换工具的输出类型
 */
export interface ColorConverterOutput {
  format: ColorFormat;
  value: string;
  isValid: boolean;
  error?: string;
}
