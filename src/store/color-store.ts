import { create } from 'zustand';
import type {
  ExtendedColor,
  ColorCategory,
  ColorFilter,
  ColorSort,
  ColorStats,
} from '@/types';
import { generateId } from '@/utils';
import { useAppStore } from './app-store';
import { useFolderStore } from './folder-store';

interface ColorState {
  // 数据状态
  colors: ExtendedColor[];
  categories: ColorCategory[];
  selectedColorId: string | null;

  // 过滤和排序
  filter: ColorFilter;
  sort: ColorSort;

  // UI状态
  isLoading: boolean;
  error: string | null;

  // 统计信息
  stats: ColorStats | null;
}

interface ColorActions {
  // CRUD操作
  addColor: (
    colorData: Omit<
      ExtendedColor,
      'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'usageCount'
    >
  ) => void;
  updateColor: (id: string, updates: Partial<ExtendedColor>) => void;
  deleteColor: (id: string) => void;

  // 只读操作
  toggleFavorite: (id: string) => void;
  incrementUsage: (id: string) => void;
  syncFavorites: () => void;

  // 选择操作
  selectColor: (id: string | null) => void;

  // 过滤和排序
  setFilter: (filter: Partial<ColorFilter>) => void;
  clearFilter: () => void;
  setSort: (sort: ColorSort) => void;

  // 数据初始化
  initializeData: (
    colors: ExtendedColor[],
    categories: ColorCategory[]
  ) => void;

  // 搜索
  searchColors: (keyword: string) => ExtendedColor[];
  getFilteredColors: () => ExtendedColor[];

  // 统计
  updateStats: () => void;

  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ColorStore = ColorState & ColorActions;

const defaultFilter: ColorFilter = {
  keyword: '',
  categories: [],
  tags: [],
  temperatures: [],
  favoritesOnly: false,
  folders: [],
  ungroupedOnly: false,
};

const defaultSort: ColorSort = {
  by: 'createdAt',
  order: 'desc',
};

export const useColorStore = create<ColorStore>()((set, get) => ({
  // 初始状态
  colors: [],
  categories: [
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
  ],
  selectedColorId: null,
  filter: defaultFilter,
  sort: defaultSort,
  isLoading: false,
  error: null,
  stats: null,

  // 数据初始化
  initializeData: (colors, categories) => {
    // 从 app-store 获取收藏的颜色ID列表
    const appStore = useAppStore.getState();
    const favoriteColorIds = appStore.preferences.favoriteColorIds;

    // 恢复收藏状态
    const colorsWithFavorites = colors.map((color) => ({
      ...color,
      isFavorite: favoriteColorIds.includes(color.id),
    }));

    set({
      colors: colorsWithFavorites,
      categories,
    });
    get().updateStats();
  },

  // 颜色CRUD操作
  addColor: (colorData) => {
    const newColor: ExtendedColor = {
      ...colorData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      usageCount: 0,
    };

    set((state) => ({
      colors: [...state.colors, newColor],
    }));

    get().updateStats();
  },

  updateColor: (id, updates) => {
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id
          ? {
              ...color,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : color
      ),
    }));

    get().updateStats();
  },

  deleteColor: (id) => {
    set((state) => ({
      colors: state.colors.filter((color) => color.id !== id),
      selectedColorId:
        state.selectedColorId === id ? null : state.selectedColorId,
    }));

    get().updateStats();
  },

  toggleFavorite: (id) => {
    const state = get();
    const color = state.colors.find((c) => c.id === id);
    if (!color) return;

    const newIsFavorite = !color.isFavorite;

    // 更新颜色状态
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id
          ? {
              ...color,
              isFavorite: newIsFavorite,
              updatedAt: new Date().toISOString(),
            }
          : color
      ),
    }));

    // 同步到 app-store 的 favoriteColorIds
    const appStore = useAppStore.getState();
    if (newIsFavorite) {
      appStore.addFavoriteColor(id);
    } else {
      appStore.removeFavoriteColor(id);
    }

    get().updateStats();
  },

  incrementUsage: (id) => {
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id
          ? {
              ...color,
              usageCount: (color.usageCount || 0) + 1,
              updatedAt: new Date().toISOString(),
            }
          : color
      ),
    }));

    get().updateStats();
  },

  // 同步收藏状态
  syncFavorites: () => {
    const appStore = useAppStore.getState();
    const favoriteColorIds = appStore.preferences.favoriteColorIds;

    set((state) => ({
      colors: state.colors.map((color) => ({
        ...color,
        isFavorite: favoriteColorIds.includes(color.id),
      })),
    }));

    get().updateStats();
  },

  // 选择操作
  selectColor: (id) => {
    set({ selectedColorId: id });
  },

  // 过滤和排序
  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    }));
  },

  clearFilter: () => {
    set({ filter: defaultFilter });
  },

  setSort: (sort) => {
    set({ sort });
  },

  // 搜索
  searchColors: (keyword) => {
    const { colors } = get();
    const lowerKeyword = keyword.toLowerCase();

    return colors.filter(
      (color) =>
        color.name.toLowerCase().includes(lowerKeyword) ||
        color.nameZh.includes(lowerKeyword) ||
        color.description.toLowerCase().includes(lowerKeyword) ||
        color.descriptionZh.includes(lowerKeyword) ||
        color.hex.toLowerCase().includes(lowerKeyword) ||
        color.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    );
  },

  getFilteredColors: () => {
    const { colors, filter, sort } = get();
    let filteredColors = [...colors];

    // 应用过滤器
    if (filter.keyword) {
      const lowerKeyword = filter.keyword.toLowerCase();
      filteredColors = filteredColors.filter(
        (color) =>
          color.name.toLowerCase().includes(lowerKeyword) ||
          color.nameZh.includes(lowerKeyword) ||
          color.description.toLowerCase().includes(lowerKeyword) ||
          color.descriptionZh.includes(lowerKeyword) ||
          color.hex.toLowerCase().includes(lowerKeyword) ||
          color.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
      );
    }

    if (filter.categories && filter.categories.length > 0) {
      filteredColors = filteredColors.filter((color) =>
        filter.categories!.includes(color.category || '')
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredColors = filteredColors.filter((color) =>
        color.tags?.some((tag) => filter.tags!.includes(tag))
      );
    }

    if (filter.temperatures && filter.temperatures.length > 0) {
      filteredColors = filteredColors.filter((color) =>
        filter.temperatures!.includes(color.temperature)
      );
    }

    if (filter.favoritesOnly) {
      filteredColors = filteredColors.filter((color) => color.isFavorite);
    }

    // 文件夹过滤
    if (filter.folders && filter.folders.length > 0) {
      const folderStore = useFolderStore.getState();
      const colorIdsInFolders = new Set<string>();

      filter.folders.forEach(folderId => {
        const colorsInFolder = folderStore.getColorsInFolder(folderId, colors);
        colorsInFolder.forEach(color => colorIdsInFolders.add(color.id));
      });

      filteredColors = filteredColors.filter((color) =>
        colorIdsInFolders.has(color.id)
      );
    }

    // 未分组颜色过滤
    if (filter.ungroupedOnly) {
      const folderStore = useFolderStore.getState();
      const unassignedColors = folderStore.getUnassignedColors(colors);
      const unassignedColorIds = new Set(unassignedColors.map(c => c.id));

      filteredColors = filteredColors.filter((color) =>
        unassignedColorIds.has(color.id)
      );
    }

    // 应用排序
    filteredColors.sort((a, b) => {
      let aValue: any = a[sort.by];
      let bValue: any = b[sort.by];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sort.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredColors;
  },

  // 统计
  updateStats: () => {
    const { colors, categories } = get();

    const categoryCounts: Record<string, number> = {};
    const temperatureCounts: Record<string, number> = {
      warm: 0,
      cool: 0,
      neutral: 0,
    };

    let favoriteCount = 0;

    colors.forEach((color) => {
      // 分类统计
      const category = color.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      // 温度统计
      temperatureCounts[color.temperature]++;

      // 收藏统计
      if (color.isFavorite) {
        favoriteCount++;
      }
    });

    // 最近使用的颜色（按更新时间排序）
    const recentColors = [...colors]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      )
      .slice(0, 10);

    // 最受欢迎的颜色（按使用次数排序）
    const popularColors = [...colors]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 10);

    const stats: ColorStats = {
      totalColors: colors.length,
      categoryCounts,
      temperatureCounts: temperatureCounts as any,
      favoriteCount,
      recentColors,
      popularColors,
    };

    set({ stats });
  },

  // 状态管理
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
