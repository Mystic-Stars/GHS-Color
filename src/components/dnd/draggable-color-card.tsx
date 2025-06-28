'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ColorCard } from '@/components/color/color-card';
import type { ExtendedColor } from '@/types';

interface DraggableColorCardProps {
  color: ExtendedColor;
  showDetails?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DraggableColorCard = React.memo(function DraggableColorCard({
  color,
  showDetails = true,
  onClick,
  className,
}: DraggableColorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: color.id,
    data: {
      type: 'color',
      color,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
    >
      <div className="relative">
        <ColorCard
          color={color}
          showDetails={showDetails}
          onClick={onClick}
        />
        {/* 拖拽句柄 - 覆盖在颜色预览区域 */}
        <div
          className="absolute top-0 left-0 right-0 h-32 cursor-grab active:cursor-grabbing"
          {...listeners}
          title="拖拽到文件夹"
        />
      </div>
    </div>
  );
});
