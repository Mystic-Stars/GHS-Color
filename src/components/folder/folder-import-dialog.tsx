'use client';

import React, { useState } from 'react';
import {
  Download,
  AlertTriangle,
  Check,
  X,
  Folder,
  Palette,
  Calendar,
  Info,
  Settings,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Switch,
  Card,
  CardContent,
  Badge,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { ColorCard } from '@/components/color';
import { useFolderStore } from '@/store/folder-store';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/components/toast-provider';
import { formatShareDataInfo, checkFolderNameConflict, generateUniqueFolderName } from '@/utils/folder-share';
import type { 
  SharedFolderData, 
  FolderImportOptions, 
  FolderConflictStrategy,
  ColorFolder 
} from '@/types';

interface FolderImportDialogProps {
  sharedData: SharedFolderData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: (success: boolean, folderId?: string) => void;
}

export function FolderImportDialog({
  sharedData,
  open,
  onOpenChange,
  onImportComplete,
}: FolderImportDialogProps) {
  const { folders, importSharedFolder, handleFolderConflict } = useFolderStore();
  const { t } = useTranslation();
  const { success, error } = useToast();

  const [isImporting, setIsImporting] = useState(false);
  const [conflictStrategy, setConflictStrategy] = useState<FolderConflictStrategy>('rename');
  const [customName, setCustomName] = useState('');
  const [importOptions, setImportOptions] = useState<FolderImportOptions>({});

  const shareInfo = formatShareDataInfo(sharedData);
  const hasNameConflict = checkFolderNameConflict(sharedData.folder.name, folders);
  const suggestedName = generateUniqueFolderName(sharedData.folder.name, folders);

  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      let result;
      
      if (hasNameConflict) {
        result = await handleFolderConflict(
          sharedData,
          conflictStrategy,
          conflictStrategy === 'rename' ? (customName || suggestedName) : undefined
        );
      } else {
        result = await importSharedFolder(sharedData, importOptions);
      }

      if (result.success) {
        success(t('folder.import.success', { 
          count: result.importedColors || 0 
        }));
        onImportComplete?.(true, result.folderId);
        onOpenChange(false);
      } else {
        error(result.error || t('folder.import.failed'));
      }
    } catch (err) {
      error(err instanceof Error ? err.message : t('folder.import.failed'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    onImportComplete?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('folder.import.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 文件夹信息预览 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50 border border-border">
                  <span className="text-xl">
                    {sharedData.folder.icon || '📁'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-lg">
                    {sharedData.folder.name}
                  </div>
                  {sharedData.folder.description && (
                    <div className="text-sm text-muted-foreground">
                      {sharedData.folder.description}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>{shareInfo.colorCount} {t('folder.colors')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{shareInfo.sharedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>{shareInfo.dataSize}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 名称冲突处理 */}
          {hasNameConflict && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('folder.import.nameConflict', { name: sharedData.folder.name })}
              </AlertDescription>
            </Alert>
          )}

          {hasNameConflict && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">
                  {t('folder.import.conflictStrategy')}
                </Label>
                
                <RadioGroup
                  value={conflictStrategy}
                  onValueChange={(value) => setConflictStrategy(value as FolderConflictStrategy)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rename" id="rename" />
                    <Label htmlFor="rename" className="flex-1">
                      {t('folder.import.strategy.rename')}
                    </Label>
                  </div>
                  
                  {conflictStrategy === 'rename' && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="custom-name" className="text-sm">
                        {t('folder.import.customName')}
                      </Label>
                      <Input
                        id="custom-name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder={suggestedName}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="replace" id="replace" />
                    <Label htmlFor="replace" className="flex-1">
                      {t('folder.import.strategy.replace')}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merge" id="merge" />
                    <Label htmlFor="merge" className="flex-1">
                      {t('folder.import.strategy.merge')}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}



          <Separator />

          {/* 颜色预览 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {t('folder.import.colorPreview')} ({sharedData.colors.length})
            </Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {sharedData.colors.slice(0, 12).map((color) => (
                <div key={color.id} className="relative">
                  <ColorCard
                    color={color}
                    showDetails={false}
                  />
                </div>
              ))}
              
              {sharedData.colors.length > 12 && (
                <div className="flex items-center justify-center bg-muted/50 rounded-lg border border-dashed border-border p-4">
                  <span className="text-sm text-muted-foreground">
                    +{sharedData.colors.length - 12} {t('folder.import.moreColors')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isImporting}
          >
            {t('common.cancel')}
          </Button>
          
          <Button
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t('folder.import.importing')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('folder.import.confirm')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
