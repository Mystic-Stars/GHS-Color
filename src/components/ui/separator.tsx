'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
