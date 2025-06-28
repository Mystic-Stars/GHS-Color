'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useFolderStore } from '@/store/folder-store';
import { useColorStore } from '@/store/color-store';
import { useToast } from '@/components/toast-provider';
import { useTranslation } from '@/hooks/use-translation';
import type { ExtendedColor } from '@/types';

interface DragDropContextProps {
  children: ReactNode;
}

interface DragData {
  type: 'color';
  color: ExtendedColor;
}

const DragDropContext = createContext<{
  isDragging: boolean;
  dragData: DragData | null;
}>({
  isDragging: false,
  dragData: null,
});

export function DragDropProvider({ children }: DragDropContextProps) {
  const { addColorToFolder, removeColorFromFolder } = useFolderStore();
  const { colors } = useColorStore();
  const { success, error } = useToast();
  const { t } = useTranslation();

  const [dragData, setDragData] = React.useState<DragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15, // 增加到15px移动距离后才开始拖拽
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300, // 增加到300ms延迟
        tolerance: 8, // 增加到8px容差
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'color') {
      const color = colors.find(c => c.id === active.id);
      if (color) {
        setDragData({
          type: 'color',
          color,
        });
      }
    }
  }, [colors]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // 可以在这里处理拖拽悬停效果
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event;

    // 拖拽结束处理

    setDragData(null);

    // 确保拖拽距离足够（至少15px）
    const dragDistance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    if (dragDistance < 15) {
      return;
    }

    if (!over) {
      return;
    }

    // 验证拖拽目标ID
    if (!over.id || typeof over.id !== 'string') {
      return;
    }

    // 验证拖拽数据的完整性
    if (!active.data.current || !over.data.current) {
      return;
    }

    // 验证拖拽源是颜色
    if (active.data.current.type !== 'color') {
      return;
    }

    // 严格验证拖拽目标是文件夹
    if (over.data.current.type !== 'folder') {
      return;
    }

    // 验证文件夹对象存在
    if (!over.data.current.folder) {
      return;
    }

    // 验证文件夹对象的完整性
    if (!over.data.current.folder.id || !over.data.current.folder.name) {
      return;
    }

    const colorId = active.id as string;
    const folderId = over.id as string;

    // 获取颜色和文件夹信息
    const color = colors.find(c => c.id === colorId);
    const folder = over.data.current?.folder;

    if (!color) {
      error('颜色不存在');
      return;
    }

    if (!folder) {
      error('文件夹不存在');
      return;
    }

    // 最终确认：确保文件夹ID匹配
    if (folder.id !== folderId) {
      error('文件夹ID不匹配');
      return;
    }

    try {
      addColorToFolder(colorId, folderId);
      success(`"${color.nameZh}" 已添加到 "${folder.name}" 文件夹`);
    } catch (err) {
      // 检查是否是重复添加错误
      if (err instanceof Error && err.message.includes('already exists')) {
        error(`"${color.nameZh}" 已经在 "${folder.name}" 文件夹中`);
      } else {
        error(t('folder.addColorFailed'));
      }
    }

    // 处理颜色从文件夹中移除
    if (
      active.data.current?.type === 'color' &&
      over.data.current?.type === 'remove-from-folder'
    ) {
      const colorId = active.id as string;
      const folderId = over.data.current.folderId as string;
      
      try {
        removeColorFromFolder(colorId, folderId);
        success(t('folder.colorRemovedFromFolder'));
      } catch (err) {
        error(t('folder.removeColorFailed'));
      }
    }
  }, [addColorToFolder, removeColorFromFolder, colors, success, error, t]);

  const contextValue = {
    isDragging: !!dragData,
    dragData,
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
        
        {/* 拖拽预览 */}
        <DragOverlay>
          {dragData?.type === 'color' && (
            <div className="bg-background border rounded-lg p-3 shadow-2xl opacity-95 transform rotate-3 scale-105 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-md"
                  style={{ backgroundColor: dragData.color.hex }}
                />
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    {dragData.color.nameZh}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {dragData.color.hex.toUpperCase()}
                  </div>
                </div>
              </div>
              {/* 拖拽指示器 */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm animate-pulse" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
