'use client';

import React from 'react';
import { cn } from '@/lib/utils';
// 静态导入国旗图标
import CN from 'country-flag-icons/react/3x2/CN';
import US from 'country-flag-icons/react/3x2/US';

interface FlagIconProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// 国旗组件映射
const flagComponents: Record<string, React.ComponentType<any>> = {
  CN,
  US,
};

export function FlagIcon({
  countryCode,
  className,
  size = 'md',
}: FlagIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-5 h-4',
    lg: 'w-6 h-5',
  };

  const FlagComponent = flagComponents[countryCode];

  if (!FlagComponent) {
    // 如果找不到国旗图标，显示国家代码
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded border border-border/60 bg-muted/40 font-mono text-xs font-semibold text-muted-foreground',
          sizeClasses[size],
          className
        )}
        title={`Country: ${countryCode}`}
      >
        {countryCode}
      </div>
    );
  }

  return (
    <div
      className={cn('flag-icon', sizeClasses[size], className)}
      title={`Country: ${countryCode}`}
    >
      <FlagComponent className="w-full h-full object-cover" />
    </div>
  );
}
