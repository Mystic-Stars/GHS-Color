/**
 * 键盘快捷键工具
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export interface ShortcutHandler {
  shortcut: KeyboardShortcut;
  handler: (event: KeyboardEvent) => void;
  description: string;
  enabled?: boolean;
}

class KeyboardManager {
  private handlers: Map<string, ShortcutHandler> = new Map();
  private isListening = false;

  /**
   * 注册快捷键
   */
  register(id: string, handler: ShortcutHandler) {
    this.handlers.set(id, handler);
    if (!this.isListening) {
      this.startListening();
    }
  }

  /**
   * 注销快捷键
   */
  unregister(id: string) {
    this.handlers.delete(id);
    if (this.handlers.size === 0) {
      this.stopListening();
    }
  }

  /**
   * 启用/禁用快捷键
   */
  setEnabled(id: string, enabled: boolean) {
    const handler = this.handlers.get(id);
    if (handler) {
      handler.enabled = enabled;
    }
  }

  /**
   * 获取所有注册的快捷键
   */
  getShortcuts(): Array<{ id: string; handler: ShortcutHandler }> {
    return Array.from(this.handlers.entries()).map(([id, handler]) => ({
      id,
      handler,
    }));
  }

  /**
   * 开始监听键盘事件
   */
  private startListening() {
    if (typeof window === 'undefined') return;
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.isListening = true;
  }

  /**
   * 停止监听键盘事件
   */
  private stopListening() {
    if (typeof window === 'undefined') return;
    
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isListening = false;
  }

  /**
   * 处理键盘按下事件
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    // 忽略在输入框中的按键
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    for (const [id, handler] of this.handlers) {
      if (handler.enabled === false) continue;

      if (this.matchesShortcut(event, handler.shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        handler.handler(event);
        break;
      }
    }
  };

  /**
   * 检查事件是否匹配快捷键
   */
  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const key = event.key.toLowerCase();
    const targetKey = shortcut.key.toLowerCase();

    // 检查主键
    if (key !== targetKey) return false;

    // 检查修饰键
    if (!!shortcut.ctrl !== event.ctrlKey) return false;
    if (!!shortcut.shift !== event.shiftKey) return false;
    if (!!shortcut.alt !== event.altKey) return false;
    if (!!shortcut.meta !== event.metaKey) return false;

    return true;
  }

  /**
   * 清理所有快捷键
   */
  cleanup() {
    this.handlers.clear();
    this.stopListening();
  }
}

// 全局键盘管理器实例
export const keyboardManager = new KeyboardManager();

/**
 * React Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  handler: (event: KeyboardEvent) => void,
  description: string,
  enabled: boolean = true
) {
  const id = React.useRef<string>();

  React.useEffect(() => {
    // 生成唯一ID
    if (!id.current) {
      id.current = Math.random().toString(36).substr(2, 9);
    }

    // 注册快捷键
    keyboardManager.register(id.current, {
      shortcut,
      handler,
      description,
      enabled,
    });

    return () => {
      if (id.current) {
        keyboardManager.unregister(id.current);
      }
    };
  }, [shortcut, handler, description, enabled]);

  React.useEffect(() => {
    if (id.current) {
      keyboardManager.setEnabled(id.current, enabled);
    }
  }, [enabled]);
}

/**
 * 格式化快捷键显示文本
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Cmd');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}

/**
 * 预定义的快捷键
 */
export const SHORTCUTS = {
  COPY_HEX: { key: 'c', ctrl: true } as KeyboardShortcut,
  COPY_RGB: { key: 'c', ctrl: true, shift: true } as KeyboardShortcut,
  COPY_HSL: { key: 'c', ctrl: true, alt: true } as KeyboardShortcut,
  TOGGLE_FAVORITE: { key: 'f' } as KeyboardShortcut,
  SEARCH: { key: 'k', ctrl: true } as KeyboardShortcut,
  ADD_COLOR: { key: 'n', ctrl: true } as KeyboardShortcut,
  DELETE_COLOR: { key: 'delete' } as KeyboardShortcut,
  ESCAPE: { key: 'escape' } as KeyboardShortcut,
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true } as KeyboardShortcut,
  TOGGLE_THEME: { key: 't', ctrl: true } as KeyboardShortcut,
  EXPORT: { key: 'e', ctrl: true } as KeyboardShortcut,
  IMPORT: { key: 'i', ctrl: true } as KeyboardShortcut,
} as const;

// 为了兼容性，导入React
import React from 'react';
