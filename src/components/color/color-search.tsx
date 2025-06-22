'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input, Button, Badge } from '@/components/ui';
import { useColorStore, useAppStore } from '@/store';
import { useTranslation } from '@/hooks/use-translation';
import type { ColorFilter } from '@/types';

interface ColorSearchProps {
  onFilterChange?: (filter: ColorFilter) => void;
}

export function ColorSearch({ onFilterChange }: ColorSearchProps) {
  const { filter, setFilter, clearFilter, categories } = useColorStore();
  const { settings, addRecentSearch } = useAppStore();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(filter.keyword || '');
  const [showFilters, setShowFilters] = useState(false);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filter.keyword) {
        const newFilter = { ...filter, keyword: searchValue };
        setFilter(newFilter);
        onFilterChange?.(newFilter);
        
        if (searchValue.trim()) {
          addRecentSearch(searchValue.trim());
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filter, setFilter, onFilterChange, addRecentSearch]);

  const handleClearSearch = () => {
    setSearchValue('');
    setFilter({ keyword: '' });
  };

  const handleClearAllFilters = () => {
    setSearchValue('');
    clearFilter();
    setShowFilters(false);
    onFilterChange?.({}as ColorFilter);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filter.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    const newFilter = { ...filter, categories: newCategories };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleTemperatureToggle = (temperature: 'warm' | 'cool' | 'neutral') => {
    const currentTemperatures = filter.temperatures || [];
    const newTemperatures = currentTemperatures.includes(temperature)
      ? currentTemperatures.filter(t => t !== temperature)
      : [...currentTemperatures, temperature];
    
    const newFilter = { ...filter, temperatures: newTemperatures };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleFavoritesToggle = () => {
    const newFilter = { ...filter, favoritesOnly: !filter.favoritesOnly };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const hasActiveFilters = 
    filter.keyword ||
    (filter.categories && filter.categories.length > 0) ||
    (filter.temperatures && filter.temperatures.length > 0) ||
    filter.favoritesOnly;

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('search.placeholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {searchValue && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-6 w-6 p-0 ${hasActiveFilters ? 'text-primary' : ''}`}
          >
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* 活跃过滤器显示 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">
            {settings.language === 'zh-CN' ? '过滤器:' : 'Filters:'}
          </span>
          
          {filter.categories?.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <Badge key={categoryId} variant="secondary" className="gap-1">
                <span>{category.icon}</span>
                {settings.language === 'zh-CN' ? category.nameZh : category.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleCategoryToggle(categoryId)}
                />
              </Badge>
            ) : null;
          })}
          
          {filter.temperatures?.map(temp => (
            <Badge key={temp} variant="secondary" className="gap-1">
              {t(`search.${temp}`)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTemperatureToggle(temp)}
              />
            </Badge>
          ))}
          
          {filter.favoritesOnly && (
            <Badge variant="secondary" className="gap-1">
              {t('search.favorites')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={handleFavoritesToggle}
              />
            </Badge>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearAllFilters}
            className="text-xs"
          >
            {t('common.clearAll')}
          </Button>
        </div>
      )}

      {/* 高级过滤器 */}
      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
          {/* 分类过滤 */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              {settings.language === 'zh-CN' ? '分类' : 'Categories'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant={filter.categories?.includes(category.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.icon} {settings.language === 'zh-CN' ? category.nameZh : category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* 颜色温度过滤 */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              {t('search.temperature')}
            </h4>
            <div className="flex gap-2">
              {[
                { value: 'warm' },
                { value: 'cool' },
                { value: 'neutral' },
              ].map(temp => (
                <Badge
                  key={temp.value}
                  variant={filter.temperatures?.includes(temp.value as any) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTemperatureToggle(temp.value as any)}
                >
                  {t(`search.${temp.value}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* 收藏过滤 */}
          <div>
            <Badge
              variant={filter.favoritesOnly ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={handleFavoritesToggle}
            >
              ❤️ {t('search.favoritesOnly')}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
