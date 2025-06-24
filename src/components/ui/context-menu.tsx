'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  shortcut?: string;
  separator?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

interface Position {
  x: number;
  y: number;
}

export function ContextMenu({
  items,
  children,
  disabled = false,
  className,
  onOpenChange,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 计算菜单位置，确保不超出视窗
  const calculatePosition = useCallback((clientX: number, clientY: number): Position => {
    const menuWidth = isMobile ? Math.min(250, window.innerWidth - 32) : 200; // 移动端适配
    const menuHeight = items.length * 40; // 预估菜单高度
    const padding = isMobile ? 16 : 8; // 移动端增加边距

    let x = clientX;
    let y = clientY;

    // 移动端居中显示
    if (isMobile) {
      x = (window.innerWidth - menuWidth) / 2;
      y = Math.max(padding, Math.min(clientY, window.innerHeight - menuHeight - padding));
    } else {
      // 桌面端位置计算
      // 检查右边界
      if (x + menuWidth > window.innerWidth - padding) {
        x = window.innerWidth - menuWidth - padding;
      }

      // 检查左边界
      if (x < padding) {
        x = padding;
      }

      // 检查下边界
      if (y + menuHeight > window.innerHeight - padding) {
        y = window.innerHeight - menuHeight - padding;
      }

      // 检查上边界
      if (y < padding) {
        y = padding;
      }
    }

    return { x, y };
  }, [items.length, isMobile]);

  // 显示菜单的通用函数
  const showMenu = useCallback(
    (clientX: number, clientY: number) => {
      const pos = calculatePosition(clientX, clientY);
      setPosition(pos);
      setIsOpen(true);
      setSelectedIndex(-1);
      onOpenChange?.(true);
    },
    [calculatePosition, onOpenChange]
  );

  // 处理右键事件
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      e.preventDefault();
      e.stopPropagation();

      showMenu(e.clientX, e.clientY);
    },
    [disabled, showMenu]
  );

  // 处理触摸开始（长按开始）
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isMobile) return;

      const touch = e.touches[0];
      if (!touch) return;

      // 清除之前的定时器
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      // 设置长按定时器
      longPressTimerRef.current = setTimeout(() => {
        e.preventDefault();
        showMenu(touch.clientX, touch.clientY);

        // 添加触觉反馈（如果支持）
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500); // 500ms 长按时间
    },
    [disabled, isMobile, showMenu]
  );

  // 处理触摸结束/移动（取消长按）
  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // 处理菜单项点击
  const handleItemClick = useCallback(
    (item: ContextMenuItem) => {
      if (item.disabled) return;
      
      item.onClick();
      setIsOpen(false);
      onOpenChange?.(false);
    },
    [onOpenChange]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      const validItems = items.filter(item => !item.separator && !item.disabled);

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          onOpenChange?.(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const nextIndex = prev + 1;
            return nextIndex >= validItems.length ? 0 : nextIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const nextIndex = prev - 1;
            return nextIndex < 0 ? validItems.length - 1 : nextIndex;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < validItems.length) {
            handleItemClick(validItems[selectedIndex]);
          }
          break;
      }
    },
    [isOpen, items, selectedIndex, handleItemClick, onOpenChange]
  );

  // 处理点击外部关闭
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    },
    [isOpen, onOpenChange]
  );

  // 添加事件监听器
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      // 聚焦菜单以支持键盘导航
      if (menuRef.current) {
        menuRef.current.focus();
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleKeyDown, handleClickOutside]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // 渲染菜单项
  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return (
        <div
          key={`separator-${index}`}
          className="h-px bg-border my-1"
          role="separator"
        />
      );
    }

    const validItems = items.filter(i => !i.separator && !i.disabled);
    const validIndex = validItems.findIndex(i => i.id === item.id);
    const isSelected = validIndex === selectedIndex;

    return (
      <button
        key={item.id}
        className={cn(
          'flex items-center gap-3 w-full text-left transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]',
          'focus:bg-accent focus:text-accent-foreground focus:outline-none',
          'active:scale-[0.98] rounded-md',
          isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm',
          item.disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          item.variant === 'destructive' && 'text-destructive hover:text-destructive hover:bg-destructive/10',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
        role="menuitem"
        tabIndex={-1}
      >
        {item.icon && (
          <item.icon className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && (
          <span className="text-xs text-muted-foreground">
            {item.shortcut}
          </span>
        )}
      </button>
    );
  };

  const menu = isOpen && (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-50 rounded-lg border bg-popover shadow-lg backdrop-blur-sm',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        'focus:outline-none',
        isMobile ? 'min-w-[250px] max-w-[calc(100vw-32px)] shadow-2xl' : 'min-w-[200px]',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      role="menu"
      tabIndex={-1}
    >
      <div className={cn('p-1', isMobile && 'p-2')}>
        {items.map((item, index) => renderMenuItem(item, index))}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="contents"
      >
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(menu, document.body)}
    </>
  );
}
