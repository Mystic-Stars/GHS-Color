/**
 * 本地存储工具
 */

/**
 * 安全的localStorage操作
 */
class SafeStorage {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  /**
   * 检查localStorage是否可用
   */
  private checkAvailability(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 设置存储项
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * 获取存储项
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable) return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  }

  /**
   * 移除存储项
   */
  removeItem(key: string): boolean {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * 清空所有存储
   */
  clear(): boolean {
    if (!this.isAvailable) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * 获取所有键
   */
  getAllKeys(): string[] {
    if (!this.isAvailable) return [];

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn('Failed to get localStorage keys:', error);
      return [];
    }
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    if (!this.isAvailable) return 0;

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.warn('Failed to calculate localStorage size:', error);
      return 0;
    }
  }

  /**
   * 检查是否可用
   */
  get available(): boolean {
    return this.isAvailable;
  }
}

// 全局存储实例
export const storage = new SafeStorage();

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  // 应用设置
  APP_SETTINGS: 'ghs-color-app-settings',
  USER_PREFERENCES: 'ghs-color-user-preferences',
  
  // 颜色数据
  COLORS: 'ghs-color-colors',
  CATEGORIES: 'ghs-color-categories',
  
  // UI状态
  SIDEBAR_STATE: 'ghs-color-sidebar-state',
  THEME: 'ghs-color-theme',
  
  // 缓存
  RECENT_SEARCHES: 'ghs-color-recent-searches',
  RECENT_COLORS: 'ghs-color-recent-colors',
  
  // 备份
  BACKUP_PREFIX: 'ghs-color-backup-',
} as const;

/**
 * 数据备份工具
 */
export class BackupManager {
  private maxBackups = 5;

  /**
   * 创建备份
   */
  createBackup(data: any, name?: string): boolean {
    const timestamp = new Date().toISOString();
    const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${name || timestamp}`;
    
    const backupData = {
      timestamp,
      name: name || `自动备份 ${new Date().toLocaleString()}`,
      data,
    };

    const success = storage.setItem(backupKey, backupData);
    
    if (success) {
      this.cleanupOldBackups();
    }
    
    return success;
  }

  /**
   * 获取所有备份
   */
  getBackups(): Array<{
    key: string;
    timestamp: string;
    name: string;
    data: any;
  }> {
    const allKeys = storage.getAllKeys();
    const backupKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.BACKUP_PREFIX));
    
    const backups = backupKeys
      .map(key => {
        const backup = storage.getItem(key);
        return backup ? { key, ...backup } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return backups as Array<{
      key: string;
      timestamp: string;
      name: string;
      data: any;
    }>;
  }

  /**
   * 恢复备份
   */
  restoreBackup(backupKey: string): any | null {
    const backup = storage.getItem(backupKey);
    return backup ? backup.data : null;
  }

  /**
   * 删除备份
   */
  deleteBackup(backupKey: string): boolean {
    return storage.removeItem(backupKey);
  }

  /**
   * 清理旧备份
   */
  private cleanupOldBackups(): void {
    const backups = this.getBackups();
    
    if (backups.length > this.maxBackups) {
      const toDelete = backups.slice(this.maxBackups);
      toDelete.forEach(backup => {
        storage.removeItem(backup.key);
      });
    }
  }

  /**
   * 设置最大备份数量
   */
  setMaxBackups(max: number): void {
    this.maxBackups = Math.max(1, max);
    this.cleanupOldBackups();
  }
}

// 全局备份管理器实例
export const backupManager = new BackupManager();

/**
 * 缓存管理器
 */
export class CacheManager {
  private prefix = 'ghs-color-cache-';
  private defaultTTL = 24 * 60 * 60 * 1000; // 24小时

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    const cacheKey = this.prefix + key;
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    
    const cacheData = {
      value,
      expiresAt,
    };

    return storage.setItem(cacheKey, cacheData);
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const cacheKey = this.prefix + key;
    const cacheData = storage.getItem(cacheKey);
    
    if (!cacheData) return null;
    
    // 检查是否过期
    if (Date.now() > cacheData.expiresAt) {
      storage.removeItem(cacheKey);
      return null;
    }
    
    return cacheData.value as T;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const cacheKey = this.prefix + key;
    return storage.removeItem(cacheKey);
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const allKeys = storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.prefix));
    
    cacheKeys.forEach(key => {
      const cacheData = storage.getItem(key);
      if (cacheData && Date.now() > cacheData.expiresAt) {
        storage.removeItem(key);
      }
    });
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    const allKeys = storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.prefix));
    
    cacheKeys.forEach(key => {
      storage.removeItem(key);
    });
  }
}

// 全局缓存管理器实例
export const cacheManager = new CacheManager();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 60 * 60 * 1000); // 每小时清理一次
}
