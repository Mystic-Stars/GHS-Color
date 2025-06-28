/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 语言设置
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 视图模式
 */
export type ViewMode = 'grid' | 'list' | 'compact';

/**
 * 应用设置接口
 */
export interface AppSettings {
  /** 主题模式 */
  theme: ThemeMode;
  /** 语言设置 */
  language: Language;
  /** 视图模式 */
  viewMode: ViewMode;
  /** 每页显示数量 */
  itemsPerPage: number;
  /** 是否显示颜色代码 */
  showColorCodes: boolean;
  /** 默认颜色格式 */
  defaultColorFormat: 'hex' | 'rgb' | 'hsl';
  /** 是否启用动画 */
  enableAnimations: boolean;
  /** 是否自动保存 */
  autoSave: boolean;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  /** 最近使用的颜色格式 */
  recentColorFormats: string[];
  /** 收藏的颜色ID列表 */
  favoriteColorIds: string[];
  /** 最近搜索的关键词 */
  recentSearches: string[];
  /** 自定义分类 */
  customCategories: string[];
  /** 快捷键设置 */
  shortcuts: Record<string, string>;
  /** 文件夹相关偏好 */
  folderPreferences: {
    /** 默认文件夹视图模式 */
    defaultViewMode: 'grid' | 'list';
    /** 是否显示空文件夹 */
    showEmptyFolders: boolean;
    /** 文件夹排序方式 */
    sortBy: 'name' | 'createdAt' | 'colorCount';
    /** 排序顺序 */
    sortOrder: 'asc' | 'desc';
    /** 最近访问的文件夹ID列表 */
    recentFolderIds: string[];
  };
}

/**
 * 应用状态接口
 */
export interface AppState {
  /** 应用设置 */
  settings: AppSettings;
  /** 用户偏好 */
  preferences: UserPreferences;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 当前选中的颜色ID */
  selectedColorId: string | null;
  /** 侧边栏是否展开 */
  sidebarOpen: boolean;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  code?: string;
  /** 响应消息 */
  message?: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 页码（从1开始） */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总数量 */
  total?: number;
  /** 总页数 */
  totalPages?: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 分页信息 */
  pagination: PaginationParams;
}

/**
 * 操作结果
 */
export interface OperationResult {
  /** 是否成功 */
  success: boolean;
  /** 结果消息 */
  message?: string;
  /** 错误信息 */
  error?: string;
}
