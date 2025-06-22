// 通用工具函数
export { cn, copyToClipboard, generateId, delay } from '@/lib/utils';

// 颜色相关工具函数
export {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hexToHsv,
  rgbToHsv,
  hsvToRgb,
  hsvToHex,
  formatColor,
  isDarkColor,
  getContrastColor,
  isValidHex,
  isValidRgb,
  isValidRgba,
  isValidHsl,
  isValidHsla,
  isValidHsv,
  normalizeHex,
  parseRgb,
  parseRgba,
  parseHsl,
  parseHsla,
  parseHsv,
  convertToHex,
  validateColorFormat,
  getColorTemperature,
  generateSimilarColors,
  getCategoryIcon,
  getTemperatureIcon,
} from './color';

// 导入工具（保留导入功能用于数据初始化）
export {
  importColorsFromJSON,
  importColorsFromCSV,
  readFileAsText,
} from './import-export';

// 键盘快捷键工具
export {
  keyboardManager,
  useKeyboardShortcut,
  formatShortcut,
  SHORTCUTS,
} from './keyboard';

// 存储工具
export { storage, backupManager, cacheManager, STORAGE_KEYS } from './storage';
