import type { ColorFormat, ColorTemperature, RGBColor, RGBAColor, HSLColor, HSLAColor, HSVColor } from '@/types';

/**
 * HEX转RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB转HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * HEX转HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * 格式化颜色值
 */
export function formatColor(hex: string, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return hex.toUpperCase();
    case 'rgb': {
      const rgb = hexToRgb(hex);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex;
    }
    case 'rgba': {
      const rgb = hexToRgb(hex);
      return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : hex;
    }
    case 'hsl': {
      const hsl = hexToHsl(hex);
      return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : hex;
    }
    case 'hsla': {
      const hsl = hexToHsl(hex);
      return hsl ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` : hex;
    }
    case 'hsv': {
      const hsv = hexToHsv(hex);
      return hsv ? `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` : hex;
    }
    case 'css':
      return `var(--color-${hex.slice(1).toLowerCase()})`;
    default:
      return hex;
  }
}

/**
 * 判断颜色是否为深色
 */
export function isDarkColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  // 使用相对亮度公式
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.5;
}

/**
 * 获取对比色（黑色或白色）
 */
export function getContrastColor(hex: string): string {
  return isDarkColor(hex) ? '#FFFFFF' : '#000000';
}

/**
 * 验证HEX颜色格式
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * 标准化HEX颜色（3位转6位）
 */
export function normalizeHex(hex: string): string {
  if (!isValidHex(hex)) return hex;

  if (hex.length === 4) {
    // #RGB -> #RRGGBB
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex.toUpperCase();
}

/**
 * 根据RGB值判断颜色温度
 * 使用更科学的算法，基于色相和饱和度来判断
 */
export function getColorTemperature(hex: string): ColorTemperature {
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);

  if (!rgb || !hsl) return 'neutral';

  const { r, g, b } = rgb;
  const { h, s, l } = hsl;

  // 优先处理极端亮度情况
  // 极低亮度（接近黑色）或极高亮度（接近白色）都判断为中性色
  if (l <= 5 || l >= 95) {
    return 'neutral';
  }

  // 如果饱和度很低（接近灰色），判断为中性色
  if (s < 15) {
    return 'neutral';
  }

  // 如果亮度很高或很低，且饱和度不高，倾向于中性
  // 但对于纯色（高饱和度）要特殊处理
  if ((l > 85 || l < 25) && s < 40) {
    return 'neutral';
  }

  // 对于低饱和度的颜色，即使色相偏向某个温度，也判断为中性
  if (s < 25 && l < 50) {
    return 'neutral';
  }

  // 基于色相判断温度
  // 暖色：红色、橙色、黄色 (0-60度, 300-360度)
  // 冷色：青色、蓝色、紫色 (180-300度)
  // 中性偏暖：黄绿色 (60-120度)
  // 中性偏冷：绿色、青绿色 (120-180度)

  if (h >= 0 && h <= 60) {
    // 红色到黄色：暖色
    return 'warm';
  } else if (h > 60 && h <= 120) {
    // 黄绿色：根据饱和度和具体色相判断
    if (h <= 90 && s > 40) {
      return 'warm'; // 偏黄的黄绿色
    }
    return 'neutral';
  } else if (h > 120 && h <= 180) {
    // 绿色到青绿色：根据色相和饱和度判断
    if (h > 160 && s > 80) {
      return 'cool'; // 高饱和度的青色
    }
    return 'neutral';
  } else if (h > 180 && h <= 240) {
    // 青色到蓝色：冷色
    return 'cool';
  } else if (h > 240 && h <= 300) {
    // 蓝色到紫色：冷色
    return 'cool';
  } else {
    // 紫色到红色 (300-360度)：暖色
    return 'warm';
  }
}

/**
 * 根据分类获取对应的emoji图标
 */
export function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    brand: '🎨',
    ui: '🖥️',
    team: '👥',
    primary: '⭐',
    secondary: '🌟',
    accent: '✨',
    neutral: '⚪',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    background: '🎭',
    text: '📝',
    border: '🔲',
    shadow: '🌫️',
    gradient: '🌈',
    material: '🧱',
    nature: '🌿',
    sky: '☁️',
    ocean: '🌊',
    sunset: '🌅',
    vintage: '📸',
    modern: '🔮',
    classic: '🏛️',
    minimal: '⬜',
    vibrant: '🎆',
    pastel: '🌸',
    dark: '🌑',
    light: '☀️',
  };

  return categoryIcons[category.toLowerCase()] || '📁';
}

/**
 * 根据颜色温度获取对应的emoji图标
 */
export function getTemperatureIcon(temperature: ColorTemperature): string {
  const temperatureIcons: Record<ColorTemperature, string> = {
    warm: '🔥',
    cool: '❄️',
    neutral: '⚪',
  };

  return temperatureIcons[temperature] || '⚪';
}

/**
 * 生成颜色的相似色
 */
export function generateSimilarColors(hex: string, count: number = 5): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];

  const colors: string[] = [];
  const { h, s, l } = hsl;

  for (let i = 0; i < count; i++) {
    // 在色相上稍作调整
    const newH = (h + (i - Math.floor(count / 2)) * 15) % 360;
    const newS = Math.max(0, Math.min(100, s + (Math.random() - 0.5) * 20));
    const newL = Math.max(0, Math.min(100, l + (Math.random() - 0.5) * 20));

    const newHex = hslToHex(newH, newS, newL);
    if (newHex && newHex !== hex) {
      colors.push(newHex);
    }
  }

  return colors;
}

/**
 * HSL转HEX
 */
function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rFinal = Math.round((r + m) * 255);
  const gFinal = Math.round((g + m) * 255);
  const bFinal = Math.round((b + m) * 255);

  return rgbToHex(rFinal, gFinal, bFinal);
}

/**
 * HEX转HSV
 */
export function hexToHsv(hex: string): HSVColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

/**
 * RGB转HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSVColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const v = max;

  if (delta !== 0) {
    s = delta / max;

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * HSV转RGB
 */
export function hsvToRgb(h: number, s: number, v: number): RGBColor {
  const sNorm = s / 100;
  const vNorm = v / 100;

  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * HSV转HEX
 */
export function hsvToHex(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * 验证RGB格式
 */
export function isValidRgb(rgb: string): boolean {
  return /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(rgb);
}

/**
 * 验证RGBA格式
 */
export function isValidRgba(rgba: string): boolean {
  return /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i.test(rgba);
}

/**
 * 验证HSL格式
 */
export function isValidHsl(hsl: string): boolean {
  return /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.test(hsl);
}

/**
 * 验证HSLA格式
 */
export function isValidHsla(hsla: string): boolean {
  return /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/i.test(hsla);
}

/**
 * 验证HSV格式
 */
export function isValidHsv(hsv: string): boolean {
  return /^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.test(hsv);
}

/**
 * 解析RGB字符串
 */
export function parseRgb(rgb: string): RGBColor | null {
  const match = rgb.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  if (r > 255 || g > 255 || b > 255) return null;

  return { r, g, b };
}

/**
 * 解析RGBA字符串
 */
export function parseRgba(rgba: string): RGBAColor | null {
  const match = rgba.match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  if (r > 255 || g > 255 || b > 255 || a > 1) return null;

  return { r, g, b, a };
}

/**
 * 解析HSL字符串
 */
export function parseHsl(hsl: string): HSLColor | null {
  const match = hsl.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (!match) return null;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);

  if (h > 360 || s > 100 || l > 100) return null;

  return { h, s, l };
}

/**
 * 解析HSLA字符串
 */
export function parseHsla(hsla: string): HSLAColor | null {
  const match = hsla.match(/^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/i);
  if (!match) return null;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  if (h > 360 || s > 100 || l > 100 || a > 1) return null;

  return { h, s, l, a };
}

/**
 * 解析HSV字符串
 */
export function parseHsv(hsv: string): HSVColor | null {
  const match = hsv.match(/^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (!match) return null;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const v = parseInt(match[3], 10);

  if (h > 360 || s > 100 || v > 100) return null;

  return { h, s, v };
}

/**
 * 将任意颜色格式转换为HEX
 */
export function convertToHex(value: string, format: ColorFormat): string | null {
  switch (format) {
    case 'hex':
      return isValidHex(value) ? normalizeHex(value) : null;
    case 'rgb': {
      const rgb = parseRgb(value);
      return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : null;
    }
    case 'rgba': {
      const rgba = parseRgba(value);
      return rgba ? rgbToHex(rgba.r, rgba.g, rgba.b) : null;
    }
    case 'hsl': {
      const hsl = parseHsl(value);
      return hsl ? hslToHex(hsl.h, hsl.s, hsl.l) : null;
    }
    case 'hsla': {
      const hsla = parseHsla(value);
      return hsla ? hslToHex(hsla.h, hsla.s, hsla.l) : null;
    }
    case 'hsv': {
      const hsv = parseHsv(value);
      return hsv ? hsvToHex(hsv.h, hsv.s, hsv.v) : null;
    }
    default:
      return null;
  }
}

/**
 * 验证颜色格式
 */
export function validateColorFormat(value: string, format: ColorFormat): boolean {
  switch (format) {
    case 'hex':
      return isValidHex(value);
    case 'rgb':
      return isValidRgb(value);
    case 'rgba':
      return isValidRgba(value);
    case 'hsl':
      return isValidHsl(value);
    case 'hsla':
      return isValidHsla(value);
    case 'hsv':
      return isValidHsv(value);
    case 'css':
      return true; // CSS变量格式比较灵活，暂时不做严格验证
    default:
      return false;
  }
}
