import LZString from 'lz-string';
import type { 
  ColorFolder, 
  ExtendedColor, 
  SharedFolderData, 
  FolderImportResult,
  FolderImportOptions,
  FolderConflictStrategy,
  FolderShareConfig
} from '@/types';
import { generateId } from '@/lib/utils';
import { appConfig } from '@/lib/env-config';

/**
 * 分享数据版本号
 */
export const SHARE_DATA_VERSION = '1.0.0';

/**
 * URL参数名称
 */
export const SHARE_URL_PARAM = 'shared';

/**
 * 最大URL长度限制（考虑浏览器兼容性）
 */
export const MAX_URL_LENGTH = 2000;

/**
 * 生成文件夹分享数据
 */
export function createSharedFolderData(
  folder: ColorFolder,
  colors: ExtendedColor[],
  config: FolderShareConfig = {}
): SharedFolderData {
  // 根据配置过滤颜色数据
  const processedColors = colors.map(color => {
    const processedColor: ExtendedColor = {
      ...color,
      // 根据配置决定是否包含某些字段
      description: config.includeDescriptions !== false ? color.description : '',
      descriptionZh: config.includeDescriptions !== false ? color.descriptionZh : '',
      tags: config.includeTags !== false ? color.tags : [],
      usageCount: config.includeUsageStats !== false ? color.usageCount : 0,
    };
    return processedColor;
  });

  const sharedData: SharedFolderData = {
    version: SHARE_DATA_VERSION,
    folder: {
      ...folder,
      // 生成新的ID避免冲突
      id: generateId(),
    },
    colors: processedColors,
    sharedAt: new Date().toISOString(),
    metadata: {
      totalColors: colors.length,
      appVersion: appConfig.version,
      source: 'GHS Color Next',
    },
  };

  return sharedData;
}

/**
 * 将分享数据编码为URL参数
 */
export function encodeSharedFolderData(sharedData: SharedFolderData): string {
  try {
    // 1. 转换为JSON字符串
    const jsonString = JSON.stringify(sharedData);
    
    // 2. 使用LZ-string压缩
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    // 3. 检查URL长度
    const testUrl = `${window.location.origin}${window.location.pathname}?${SHARE_URL_PARAM}=${compressed}`;
    if (testUrl.length > MAX_URL_LENGTH) {
      throw new Error('分享数据过大，无法生成有效的分享链接');
    }
    
    return compressed;
  } catch (error) {
    console.error('编码分享数据失败:', error);
    throw new Error('生成分享链接失败');
  }
}

/**
 * 从URL参数解码分享数据
 */
export function decodeSharedFolderData(encodedData: string): SharedFolderData {
  try {
    // 1. 使用LZ-string解压缩
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    
    if (!decompressed) {
      throw new Error('无法解压缩分享数据');
    }
    
    // 2. 解析JSON
    const sharedData: SharedFolderData = JSON.parse(decompressed);
    
    // 3. 验证数据结构
    if (!validateSharedFolderData(sharedData)) {
      throw new Error('分享数据格式无效');
    }
    
    return sharedData;
  } catch (error) {
    console.error('解码分享数据失败:', error);
    throw new Error('分享链接无效或已损坏');
  }
}

/**
 * 验证分享数据结构
 */
function validateSharedFolderData(data: any): data is SharedFolderData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    data.folder &&
    typeof data.folder.id === 'string' &&
    typeof data.folder.name === 'string' &&
    Array.isArray(data.colors) &&
    typeof data.sharedAt === 'string' &&
    data.metadata &&
    typeof data.metadata.totalColors === 'number'
  );
}

/**
 * 生成完整的分享URL
 */
export function generateShareUrl(sharedData: SharedFolderData): string {
  const encodedData = encodeSharedFolderData(sharedData);
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?${SHARE_URL_PARAM}=${encodedData}`;
}

/**
 * 从当前URL获取分享数据
 */
export function getSharedDataFromUrl(): SharedFolderData | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get(SHARE_URL_PARAM);
    
    if (!encodedData) {
      return null;
    }
    
    return decodeSharedFolderData(encodedData);
  } catch (error) {
    console.error('从URL获取分享数据失败:', error);
    return null;
  }
}

/**
 * 清除URL中的分享参数
 */
export function clearShareUrlParam(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_URL_PARAM);
  
  // 使用replaceState避免在浏览器历史中留下记录
  window.history.replaceState({}, '', url.toString());
}

/**
 * 检查文件夹名称是否冲突
 */
export function checkFolderNameConflict(
  folderName: string,
  existingFolders: ColorFolder[]
): boolean {
  return existingFolders.some(folder => 
    folder.name.toLowerCase() === folderName.toLowerCase()
  );
}

/**
 * 生成唯一的文件夹名称
 */
export function generateUniqueFolderName(
  baseName: string,
  existingFolders: ColorFolder[]
): string {
  let uniqueName = baseName;
  let counter = 1;
  
  while (checkFolderNameConflict(uniqueName, existingFolders)) {
    uniqueName = `${baseName} (${counter})`;
    counter++;
  }
  
  return uniqueName;
}

/**
 * 估算分享数据大小（字节）
 */
export function estimateShareDataSize(sharedData: SharedFolderData): number {
  const jsonString = JSON.stringify(sharedData);
  return new Blob([jsonString]).size;
}

/**
 * 检查分享数据是否过期
 */
export function isShareDataExpired(
  sharedData: SharedFolderData,
  expirationHours: number = 0
): boolean {
  if (expirationHours <= 0) {
    return false; // 永不过期
  }
  
  const sharedTime = new Date(sharedData.sharedAt).getTime();
  const currentTime = new Date().getTime();
  const expirationTime = sharedTime + (expirationHours * 60 * 60 * 1000);
  
  return currentTime > expirationTime;
}

/**
 * 格式化分享数据信息用于显示
 */
export function formatShareDataInfo(sharedData: SharedFolderData): {
  folderName: string;
  colorCount: number;
  sharedDate: string;
  dataSize: string;
} {
  const dataSize = estimateShareDataSize(sharedData);
  const sizeInKB = (dataSize / 1024).toFixed(1);
  
  return {
    folderName: sharedData.folder.name,
    colorCount: sharedData.metadata.totalColors,
    sharedDate: new Date(sharedData.sharedAt).toLocaleDateString(),
    dataSize: `${sizeInKB} KB`,
  };
}
