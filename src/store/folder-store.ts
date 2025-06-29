import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ColorFolder,
  ColorFolderRelation,
  FolderStats,
  FolderFilter,
  ExtendedColor,
  SharedFolderData,
  FolderImportResult,
  FolderImportOptions,
  FolderConflictStrategy,
  FolderShareConfig,
} from '@/types';
import { generateId } from '@/utils';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import {
  createSharedFolderData,
  generateShareUrl,
  checkFolderNameConflict,
  generateUniqueFolderName,
} from '@/utils/folder-share';

interface FolderState {
  // 数据状态
  folders: ColorFolder[];
  relations: ColorFolderRelation[];
  folderStats: Record<string, FolderStats>;
  selectedFolderId: string | null;

  // 过滤和排序
  filter: FolderFilter;

  // UI状态
  isLoading: boolean;
  error: string | null;
}

interface FolderActions {
  // 文件夹CRUD操作
  createFolder: (folderData: Omit<ColorFolder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFolder: (id: string, updates: Partial<ColorFolder>) => void;
  deleteFolder: (id: string) => void;


  // 颜色与文件夹关联操作
  addColorToFolder: (colorId: string, folderId: string) => void;
  removeColorFromFolder: (colorId: string, folderId: string) => void;
  addColorToFolders: (colorId: string, folderIds: string[]) => void;
  removeColorFromFolders: (colorId: string, folderIds: string[]) => void;
  moveColorBetweenFolders: (colorId: string, fromFolderId: string, toFolderId: string) => void;

  // 查询操作
  getFolderById: (id: string) => ColorFolder | null;
  getColorsInFolder: (folderId: string) => ExtendedColor[];
  getFoldersForColor: (colorId: string) => ColorFolder[];
  getUnassignedColors: (colors: ExtendedColor[]) => ExtendedColor[];
  searchFolders: (keyword: string) => ColorFolder[];

  // 统计操作
  updateFolderStats: (colors: ExtendedColor[]) => void;
  getFolderStats: (folderId: string) => FolderStats | null;

  // 工具方法
  addRecentFolder: (folderId: string) => void;

  // 选择操作
  selectFolder: (id: string | null) => void;

  // 过滤操作
  setFilter: (filter: Partial<FolderFilter>) => void;
  clearFilter: () => void;
  getFilteredFolders: () => ColorFolder[];

  // 数据管理
  initializeData: (folders?: ColorFolder[], relations?: ColorFolderRelation[]) => void;
  exportData: () => { folders: ColorFolder[]; relations: ColorFolderRelation[] };
  importData: (data: { folders: ColorFolder[]; relations: ColorFolderRelation[] }) => void;
  clearAllData: () => void;

  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 分享功能
  generateShareUrl: (folderId: string, config?: FolderShareConfig) => Promise<string>;
  importSharedFolder: (
    sharedData: SharedFolderData,
    options?: FolderImportOptions
  ) => Promise<FolderImportResult>;
  handleFolderConflict: (
    sharedData: SharedFolderData,
    strategy: FolderConflictStrategy,
    customName?: string
  ) => Promise<FolderImportResult>;
}

type FolderStore = FolderState & FolderActions;

const defaultFilter: FolderFilter = {
  keyword: '',
  sortByColorCount: false,
};

// 移除默认系统文件夹，用户只能看到自己创建的文件夹

export const useFolderStore = create<FolderStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      folders: [], // 不再有默认文件夹
      relations: [],
      folderStats: {},
      selectedFolderId: null,
      filter: defaultFilter,
      isLoading: false,
      error: null,

      // 文件夹CRUD操作
      createFolder: (folderData) => {
        const newFolder: ColorFolder = {
          ...folderData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));

        return newFolder.id;
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? {
                  ...folder,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : folder
          ),
        }));
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          relations: state.relations.filter((relation) => relation.folderId !== id),
          selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
        }));
      },



      // 颜色与文件夹关联操作
      addColorToFolder: (colorId, folderId) => {
        const state = get();
        const existingRelation = state.relations.find(
          (r) => r.colorId === colorId && r.folderId === folderId
        );

        if (existingRelation) {
          throw new Error('Color already exists in folder');
        }

        const newRelation: ColorFolderRelation = {
          id: generateId(),
          colorId,
          folderId,
          addedAt: new Date().toISOString(),
        };

        set((state) => ({
          relations: [...state.relations, newRelation],
        }));
      },

      removeColorFromFolder: (colorId, folderId) => {
        set((state) => ({
          relations: state.relations.filter(
            (relation) => !(relation.colorId === colorId && relation.folderId === folderId)
          ),
        }));
      },

      addColorToFolders: (colorId, folderIds) => {
        const state = get();
        const newRelations: ColorFolderRelation[] = [];

        folderIds.forEach((folderId) => {
          const existingRelation = state.relations.find(
            (r) => r.colorId === colorId && r.folderId === folderId
          );

          if (!existingRelation) {
            newRelations.push({
              id: generateId(),
              colorId,
              folderId,
              addedAt: new Date().toISOString(),
            });
          }
        });

        if (newRelations.length > 0) {
          set((state) => ({
            relations: [...state.relations, ...newRelations],
          }));
        }
      },

      removeColorFromFolders: (colorId, folderIds) => {
        set((state) => ({
          relations: state.relations.filter(
            (relation) => 
              !(relation.colorId === colorId && folderIds.includes(relation.folderId))
          ),
        }));
      },

      moveColorBetweenFolders: (colorId, fromFolderId, toFolderId) => {
        const actions = get();
        actions.removeColorFromFolder(colorId, fromFolderId);
        actions.addColorToFolder(colorId, toFolderId);
      },

      // 查询操作
      getFolderById: (id) => {
        const state = get();
        return state.folders.find((folder) => folder.id === id) || null;
      },

      getColorsInFolder: (folderId) => {
        const state = get();
        const { useColorStore } = require('@/store/color-store');
        const colorStore = useColorStore.getState();

        const colorIds = state.relations
          .filter((relation) => relation.folderId === folderId)
          .map((relation) => relation.colorId);

        return colorStore.colors.filter((color: ExtendedColor) => colorIds.includes(color.id));
      },

      getFoldersForColor: (colorId) => {
        const state = get();
        const folderIds = state.relations
          .filter((relation) => relation.colorId === colorId)
          .map((relation) => relation.folderId);

        return state.folders.filter((folder) => folderIds.includes(folder.id));
      },

      getUnassignedColors: (colors) => {
        const state = get();
        const assignedColorIds = new Set(state.relations.map((r) => r.colorId));
        return colors.filter((color) => !assignedColorIds.has(color.id));
      },

      searchFolders: (keyword) => {
        const state = get();
        if (!keyword.trim()) return state.folders;

        const lowerKeyword = keyword.toLowerCase();
        return state.folders.filter(
          (folder) =>
            folder.name.toLowerCase().includes(lowerKeyword) ||
            folder.description?.toLowerCase().includes(lowerKeyword)
        );
      },

      // 统计操作
      updateFolderStats: (colors) => {
        const state = get();
        const stats: Record<string, FolderStats> = {};

        state.folders.forEach((folder) => {
          const folderColors = get().getColorsInFolder(folder.id);
          const recentColors = folderColors
            .sort((a, b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime())
            .slice(0, 5);

          stats[folder.id] = {
            folderId: folder.id,
            colorCount: folderColors.length,
            recentColors,
            lastUpdated: new Date().toISOString(),
          };
        });

        set({ folderStats: stats });
      },

      getFolderStats: (folderId) => {
        const state = get();
        return state.folderStats[folderId] || null;
      },

      // 选择操作
      selectFolder: (id) => {
        set({ selectedFolderId: id });
      },

      // 过滤操作
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },

      clearFilter: () => {
        set({ filter: defaultFilter });
      },

      getFilteredFolders: () => {
        const state = get();
        let filteredFolders = [...state.folders];

        // 关键词过滤
        if (state.filter.keyword) {
          filteredFolders = get().searchFolders(state.filter.keyword);
        }

        // 移除系统/用户文件夹过滤逻辑，因为不再有系统文件夹

        // 按颜色数量排序
        if (state.filter.sortByColorCount) {
          filteredFolders.sort((a, b) => {
            const aCount = state.folderStats[a.id]?.colorCount || 0;
            const bCount = state.folderStats[b.id]?.colorCount || 0;
            return bCount - aCount;
          });
        } else {
          // 默认按order和名称排序
          filteredFolders.sort((a, b) => {
            if (a.order !== b.order) {
              return (a.order || 999) - (b.order || 999);
            }
            return a.name.localeCompare(b.name);
          });
        }

        return filteredFolders;
      },

      // 数据管理
      initializeData: (folders, relations) => {
        set({
          folders: folders || [],
          relations: relations || [],
        });
      },

      exportData: () => {
        const state = get();
        return {
          folders: state.folders,
          relations: state.relations,
        };
      },

      importData: (data) => {
        set({
          folders: data.folders || [],
          relations: data.relations || [],
        });
      },

      clearAllData: () => {
        set({
          folders: [],
          relations: [],
          folderStats: {},
          selectedFolderId: null,
        });
      },

      // 状态管理
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 工具方法实现

      addRecentFolder: (folderId) => {
        // 这里可以实现最近访问文件夹的逻辑
        // 暂时留空，后续可以扩展
      },

      // 分享功能实现
      generateShareUrl: async (folderId, config = {}) => {
        const state = get();
        const folder = state.folders.find(f => f.id === folderId);

        if (!folder) {
          throw new Error('文件夹不存在');
        }

        const colors = get().getColorsInFolder(folderId);
        const sharedData = createSharedFolderData(folder, colors, config);

        return generateShareUrl(sharedData);
      },

      importSharedFolder: async (sharedData, options = {}) => {
        const state = get();

        try {
          // 检查文件夹名称冲突
          const hasConflict = checkFolderNameConflict(sharedData.folder.name, state.folders);

          if (hasConflict && !options.overwriteExisting && !options.mergeWithExisting) {
            return {
              success: false,
              error: '文件夹名称已存在，请选择处理方式',
            };
          }

          let targetFolderId: string;
          let importedColors = 0;

          if (hasConflict && options.mergeWithExisting) {
            // 合并到现有文件夹
            const existingFolder = state.folders.find(f =>
              f.name.toLowerCase() === sharedData.folder.name.toLowerCase()
            );
            targetFolderId = existingFolder!.id;
          } else {
            // 创建新文件夹
            const folderName = options.customName ||
              (hasConflict ? generateUniqueFolderName(sharedData.folder.name, state.folders) : sharedData.folder.name);

            targetFolderId = get().createFolder({
              name: folderName,
              description: sharedData.folder.description,
              icon: sharedData.folder.icon,
              iconColor: sharedData.folder.iconColor,
            });
          }



          // 添加颜色到文件夹
          for (const color of sharedData.colors) {
            try {
              get().addColorToFolder(color.id, targetFolderId);
              importedColors++;
            } catch (error) {
              // 颜色已存在于文件夹中，忽略错误
            }
          }

          return {
            success: true,
            folderId: targetFolderId,
            importedColors,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : '导入失败',
          };
        }
      },

      handleFolderConflict: async (sharedData, strategy, customName) => {
        const state = get();

        switch (strategy) {
          case 'rename':
            return get().importSharedFolder(sharedData, {
              customName: customName || generateUniqueFolderName(sharedData.folder.name, state.folders),
            });

          case 'replace':
            // 删除现有文件夹
            const existingFolder = state.folders.find(f =>
              f.name.toLowerCase() === sharedData.folder.name.toLowerCase()
            );
            if (existingFolder) {
              get().deleteFolder(existingFolder.id);
            }
            return get().importSharedFolder(sharedData);

          case 'merge':
            return get().importSharedFolder(sharedData, {
              mergeWithExisting: true,
            });

          case 'cancel':
            return {
              success: false,
              error: '用户取消导入',
            };

          default:
            return {
              success: false,
              error: '无效的冲突处理策略',
            };
        }
      },
    }),
    {
      name: 'ghs-folder-store',
      partialize: (state) => ({
        folders: state.folders,
        relations: state.relations,
      }),
    }
  )
);
