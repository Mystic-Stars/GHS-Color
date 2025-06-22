'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<
    SelectOption | undefined
  >(options.find((option) => option.value === value));

  const selectRef = React.useRef<HTMLDivElement>(null);

  // 处理选项选择
  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onValueChange?.(option.value);
    setIsOpen(false);
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // 移动到下一个选项
          const currentIndex = selectedOption
            ? options.findIndex((opt) => opt.value === selectedOption.value)
            : -1;
          const nextIndex =
            currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          handleSelect(options[nextIndex]);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // 移动到上一个选项
          const currentIndex = selectedOption
            ? options.findIndex((opt) => opt.value === selectedOption.value)
            : -1;
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          handleSelect(options[prevIndex]);
        }
        break;
    }
  };

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 更新选中的选项
  React.useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* 选择器触发器 */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'hover:bg-muted/30 transition-all duration-200',
          isOpen && 'ring-2 ring-ring ring-offset-2 bg-muted/20'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2.5">
          {selectedOption?.icon && (
            <selectedOption.icon className="h-4 w-4 flex-shrink-0" />
          )}
          <span
            className={
              selectedOption
                ? 'text-foreground font-medium'
                : 'text-muted-foreground'
            }
          >
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* 下拉选项 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-lg border bg-popover shadow-lg backdrop-blur-sm">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  'relative flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm outline-none transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                  selectedOption?.value === option.value &&
                    'bg-accent text-accent-foreground'
                )}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.icon && (
                  <option.icon className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="flex-1 text-left font-medium">
                  {option.label}
                </span>
                {selectedOption?.value === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
