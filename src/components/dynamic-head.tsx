'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { appConfig } from '@/lib/env-config';

interface DynamicHeadProps {
  children?: React.ReactNode;
}

export function DynamicHead({ children }: DynamicHeadProps) {
  const { t, language } = useTranslation();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // 更新页面标题 - 从环境变量获取
      const title =
        language === 'zh-CN' ? appConfig.site.title : appConfig.site.titleEn;
      document.title = title;

      // 更新meta描述 - 从环境变量获取
      const description =
        language === 'zh-CN'
          ? appConfig.site.description
          : appConfig.site.descriptionEn;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }

      // 更新关键词 - 通用关键词，不需要多语言
      const keywords = appConfig.site.keywords;

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords);
        document.head.appendChild(metaKeywords);
      }

      // 更新HTML lang属性
      document.documentElement.lang = language;
    }
  }, [language, t]);

  return <>{children}</>;
}
