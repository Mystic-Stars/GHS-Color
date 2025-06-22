import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppSettings,
  UserPreferences,
  ThemeMode,
  Language,
  ViewMode,
} from '@/types';

interface AppState {
  // 应用设置
  settings: AppSettings;
  preferences: UserPreferences;

  // UI状态
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  // 设置操作
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // 偏好操作
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  addFavoriteColor: (colorId: string) => void;
  removeFavoriteColor: (colorId: string) => void;

  // UI状态操作
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 主题操作
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setViewMode: (viewMode: ViewMode) => void;
}

type AppStore = AppState & AppActions;

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  viewMode: 'grid',
  itemsPerPage: 20,
  showColorCodes: true,
  defaultColorFormat: 'hex',
  enableAnimations: true,
  autoSave: true,
};

const defaultPreferences: UserPreferences = {
  recentColorFormats: ['hex', 'rgb', 'hsl'],
  favoriteColorIds: [],
  recentSearches: [],
  customCategories: [],
  shortcuts: {
    'copy-hex': 'Ctrl+C',
    'copy-rgb': 'Ctrl+Shift+C',
    'toggle-favorite': 'F',
    search: 'Ctrl+K',
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: defaultSettings,
      preferences: defaultPreferences,
      sidebarOpen: true,
      isLoading: false,
      error: null,

      // 设置操作
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      // 偏好操作
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },

      addRecentSearch: (search) => {
        if (!search.trim()) return;

        set((state) => {
          const recentSearches = [
            search,
            ...state.preferences.recentSearches.filter((s) => s !== search),
          ].slice(0, 10); // 保留最近10个搜索

          return {
            preferences: {
              ...state.preferences,
              recentSearches,
            },
          };
        });
      },

      clearRecentSearches: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            recentSearches: [],
          },
        }));
      },

      addFavoriteColor: (colorId) => {
        set((state) => {
          if (state.preferences.favoriteColorIds.includes(colorId)) {
            return state; // 已经存在，不重复添加
          }

          return {
            preferences: {
              ...state.preferences,
              favoriteColorIds: [
                ...state.preferences.favoriteColorIds,
                colorId,
              ],
            },
          };
        });
      },

      removeFavoriteColor: (colorId) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            favoriteColorIds: state.preferences.favoriteColorIds.filter(
              (id) => id !== colorId
            ),
          },
        }));
      },

      // UI状态操作
      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 主题操作
      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));

        // 应用主题到DOM
        applyTheme(theme);
      },

      setLanguage: (language) => {
        set((state) => ({
          settings: { ...state.settings, language },
        }));
      },

      setViewMode: (viewMode) => {
        set((state) => ({
          settings: { ...state.settings, viewMode },
        }));
      },
    }),
    {
      name: 'ghs-app-store',
      partialize: (state) => ({
        settings: state.settings,
        preferences: state.preferences,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// 应用主题到DOM的辅助函数
function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  if (theme === 'system') {
    // 使用系统主题
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.toggle('dark', systemTheme === 'dark');
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const { settings } = useAppStore.getState();
      if (settings.theme === 'system') {
        applyTheme('system');
      }
    });
}
