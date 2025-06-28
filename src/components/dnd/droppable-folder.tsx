'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDragDrop } from './drag-drop-context';
import type { ColorFolder } from '@/types';

interface DroppableFolderProps {
  folder: ColorFolder;
  children: React.ReactNode;
  className?: string;
}

export const DroppableFolder = React.memo(function DroppableFolder({
  folder,
  children,
  className,
}: DroppableFolderProps) {
  const { isDragging } = useDragDrop();
  
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: folder.id,
    data: {
      type: 'folder',
      folder,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${className}
        ${isDragging ? 'transition-all duration-200' : ''}
        ${isOver && isDragging ? 'ring-2 ring-primary ring-offset-2 bg-primary/10 scale-105 shadow-lg' : ''}
      `}
    >
      {children}
      
      {/* 拖拽提示 */}
      {isOver && isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg border-2 border-dashed border-primary animate-pulse">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            📁 放置到此文件夹
          </div>
        </div>
      )}
    </div>
  );
});
