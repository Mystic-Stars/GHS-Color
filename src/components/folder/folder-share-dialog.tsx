'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  Settings,
  AlertCircle,
  Info,
  X,
  Folder,
  Palette, Heart, Star, Zap, Target, Rocket, Sparkles, Camera,
  Music, Image, Film, Bookmark, Tag, Archive, Package, Box,
  Briefcase, Coffee, Home, Users, Globe, FolderPlus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Switch,
  Card,
  CardContent,
  Badge,
  Separator,
} from '@/components/ui';
import { useFolderStore } from '@/store/folder-store';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { copyToClipboard } from '@/utils';
import { formatShareDataInfo } from '@/utils/folder-share';
import type { ColorFolder, FolderShareConfig } from '@/types';

// 图标映射对象
const iconMap = {
  'folder': Folder,
  'palette': Palette,
  'heart': Heart,
  'star': Star,
  'zap': Zap,
  'target': Target,
  'rocket': Rocket,
  'sparkles': Sparkles,
  'camera': Camera,
  'music': Music,
  'image': Image,
  'film': Film,
  'bookmark': Bookmark,
  'tag': Tag,
  'archive': Archive,
  'package': Package,
  'box': Box,
  'briefcase': Briefcase,
  'coffee': Coffee,
  'home': Home,
  'users': Users,
  'globe': Globe,
};

// 图标渲染组件
const IconRenderer = ({
  iconName,
  className = "h-4 w-4",
  color
}: {
  iconName: string;
  className?: string;
  color?: string;
}) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  const iconStyle = color ? { color } : {};

  if (IconComponent) {
    return <IconComponent className={className} style={iconStyle} />;
  }
  // 如果找不到图标，显示默认文件夹图标
  return <Folder className={className} style={iconStyle} />;
};

interface FolderShareDialogProps {
  folder: ColorFolder;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FolderShareDialog({
  folder,
  children,
  open,
  onOpenChange,
}: FolderShareDialogProps) {
  const { generateShareUrl, getColorsInFolder } = useFolderStore();
  const { t } = useTranslation();
  const { success, error } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [shareConfig, setShareConfig] = useState<FolderShareConfig>({
    includeDescriptions: true,
    includeTags: true,
    includeUsageStats: false,
  });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const folderColors = getColorsInFolder(folder.id);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    
    if (!newOpen) {
      // 重置状态
      setShareUrl('');
      setCopied(false);
      setShowQrCode(false);
      setQrCodeDataUrl('');
    }
  };

  const generateShare = async () => {
    setIsGenerating(true);
    try {
      const url = await generateShareUrl(folder.id, shareConfig);
      setShareUrl(url);
      // 同时生成二维码
      await generateQrCode(url);
      success(t('folder.share.generateSuccess'));
    } catch (err) {
      error(err instanceof Error ? err.message : t('folder.share.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    
    const copySuccess = await copyToClipboard(shareUrl);
    if (copySuccess) {
      setCopied(true);
      success(t('folder.share.copySuccess'));
      
      // 3秒后重置复制状态
      setTimeout(() => setCopied(false), 3000);
    } else {
      error(t('folder.share.copyFailed'));
    }
  };

  const generateQrCode = async (url: string) => {
    if (!url) return;

    setIsGeneratingQr(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (err) {
      console.error('生成二维码失败:', err);
      error(t('folder.share.qrCodeGenerateFailed'));
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleDownloadQrCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `${folder.name}-qrcode.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success(t('folder.share.qrCodeDownloadSuccess'));
  };

  // 当配置改变时重新生成链接
  useEffect(() => {
    if (shareUrl) {
      generateShare();
    }
  }, [shareConfig]);

  const shareInfo = shareUrl ? formatShareDataInfo({
    version: '1.0.0',
    folder,
    colors: folderColors,
    sharedAt: new Date().toISOString(),
    metadata: {
      totalColors: folderColors.length,
      appVersion: '2.0.0',
      source: 'GHS Color Next',
    },
  }) : null;

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t('folder.share.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 文件夹信息 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50 border border-border">
                  <IconRenderer
                    iconName={folder.icon || 'folder'}
                    className="h-5 w-5"
                    color={folder.iconColor || '#6366f1'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {folder.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {folderColors.length} {t('folder.colors')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分享配置 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t('folder.share.options')}
            </Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-descriptions" className="text-sm">
                  {t('folder.share.includeDescriptions')}
                </Label>
                <Switch
                  id="include-descriptions"
                  checked={shareConfig.includeDescriptions}
                  onCheckedChange={(checked) =>
                    setShareConfig(prev => ({ ...prev, includeDescriptions: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-tags" className="text-sm">
                  {t('folder.share.includeTags')}
                </Label>
                <Switch
                  id="include-tags"
                  checked={shareConfig.includeTags}
                  onCheckedChange={(checked) =>
                    setShareConfig(prev => ({ ...prev, includeTags: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-stats" className="text-sm">
                  {t('folder.share.includeUsageStats')}
                </Label>
                <Switch
                  id="include-stats"
                  checked={shareConfig.includeUsageStats}
                  onCheckedChange={(checked) =>
                    setShareConfig(prev => ({ ...prev, includeUsageStats: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 生成分享链接 */}
          {!shareUrl ? (
            <Button
              onClick={generateShare}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('folder.share.generating')}
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('folder.share.generate')}
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              {/* 分享链接 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t('folder.share.shareUrl')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 分享信息 */}
              {shareInfo && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    <span>
                      {t('folder.share.dataSize')}: {shareInfo.dataSize}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      {t('folder.share.urlNote')}
                    </span>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="flex-1"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {t('folder.share.qrCode')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateShare}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('folder.share.regenerate')}
                </Button>
              </div>

              {/* 二维码显示区域 */}
              {showQrCode && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center mb-2">
                      {isGeneratingQr ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                          <span className="text-sm text-muted-foreground">
                            {t('folder.share.generatingQrCode')}
                          </span>
                        </div>
                      ) : qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t('folder.share.qrCodeNote')}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadQrCode}
                      disabled={!qrCodeDataUrl}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('folder.share.downloadQrCode')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
