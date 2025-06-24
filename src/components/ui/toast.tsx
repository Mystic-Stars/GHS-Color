import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
  {
    variants: {
      variant: {
        default: 'border-border bg-background/95 text-foreground shadow-md',
        destructive:
          'border-red-200 bg-red-50/95 text-red-900 shadow-red-100 dark:border-red-800 dark:bg-red-950/95 dark:text-red-100 dark:shadow-red-900/20',
        success:
          'border-green-200 bg-green-50/95 text-green-900 shadow-green-100 dark:border-green-800 dark:bg-green-950/95 dark:text-green-100 dark:shadow-green-900/20',
        warning:
          'border-yellow-200 bg-yellow-50/95 text-yellow-900 shadow-yellow-100 dark:border-yellow-800 dark:bg-yellow-950/95 dark:text-yellow-100 dark:shadow-yellow-900/20',
        info:
          'border-blue-200 bg-blue-50/95 text-blue-900 shadow-blue-100 dark:border-blue-800 dark:bg-blue-950/95 dark:text-blue-100 dark:shadow-blue-900/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Toast图标组件
const ToastIcon = ({ variant }: { variant?: string }) => {
  const iconClass = 'h-5 w-5 flex-shrink-0';

  switch (variant) {
    case 'success':
      return <CheckCircle className={cn(iconClass, 'text-green-600 dark:text-green-400')} />;
    case 'destructive':
      return <AlertCircle className={cn(iconClass, 'text-red-600 dark:text-red-400')} />;
    case 'warning':
      return <AlertTriangle className={cn(iconClass, 'text-yellow-600 dark:text-yellow-400')} />;
    case 'info':
      return <Info className={cn(iconClass, 'text-blue-600 dark:text-blue-400')} />;
    default:
      return <Info className={cn(iconClass, 'text-muted-foreground')} />;
  }
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      showIcon?: boolean;
      showProgress?: boolean;
      duration?: number;
    }
>(({ className, variant, showIcon = true, showProgress = false, duration, children, ...props }, ref) => {
  const [progress, setProgress] = React.useState(100);
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (showProgress && duration && duration > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [showProgress, duration, isPaused]);

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), 'relative overflow-hidden', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {showIcon && <ToastIcon variant={variant} />}
      <div className="flex-1 space-y-1">
        {children}
      </div>
      {showProgress && duration && (
        <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10 w-full">
          <div
            className={cn(
              'h-full transition-all duration-100 ease-linear',
              variant === 'success' && 'bg-green-500',
              variant === 'destructive' && 'bg-red-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'info' && 'bg-blue-500',
              variant === 'default' && 'bg-primary'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground/70 opacity-70 transition-all hover:opacity-100 hover:bg-muted hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold leading-tight', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90 leading-relaxed', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
