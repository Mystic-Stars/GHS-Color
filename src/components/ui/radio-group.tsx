'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onValueChange, disabled = false, className, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn('grid gap-2', className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, id, disabled: itemDisabled, className, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const disabled = itemDisabled || context.disabled;
    const checked = context.value === value;

    const handleClick = () => {
      if (!disabled && context.onValueChange) {
        context.onValueChange(value);
      }
    };

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {checked && (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        )}
      </button>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
