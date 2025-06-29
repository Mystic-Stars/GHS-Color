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
      {...listeners}
    >
      <div className="relative">
        <ColorCard
          color={color}
          showDetails={showDetails}
          onClick={onClick}
        />

        {/* 拖拽指示器 - 仅在悬停时显示 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm rounded-md p-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            >
              <circle cx="9" cy="12" r="1"/>
              <circle cx="9" cy="5" r="1"/>
              <circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="12" r="1"/>
              <circle cx="15" cy="5" r="1"/>
              <circle cx="15" cy="19" r="1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});
