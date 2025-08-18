'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Heart, ExternalLink, FileText, Bug } from 'lucide-react';
import { Button, Separator, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/use-translation';
import { appConfig } from '@/lib/env-config';

export function Footer() {
  const { t, language } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      label: language === 'zh-CN' ? '文档' : 'Documentation',
      href: `${appConfig.githubUrl}#readme`,
      icon: FileText,
      external: true,
    },
    {
      label: language === 'zh-CN' ? '问题反馈' : 'Issues',
      href: `${appConfig.githubUrl}/issues`,
      icon: Bug,
      external: true,
    },
    {
      label: language === 'zh-CN' ? '贡献指南' : 'Contributing',
      href: `${appConfig.githubUrl}/blob/main/CONTRIBUTING.md`,
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* 主要内容区域 */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
          {/* 左侧：项目信息 */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-foreground">
                {appConfig.mainTitle}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {appConfig.suffix}
                </span>
              </h3>
              <Badge variant="secondary" className="text-xs">
                v{appConfig.version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {language === 'zh-CN' ? appConfig.description : appConfig.descriptionEn}
            </p>
          </div>

          {/* 右侧：链接和操作 */}
          <div className="flex flex-col space-y-3 md:items-end">
            {/* 快速链接 */}
            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
              {footerLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 px-2 text-xs hover:bg-accent/50"
                >
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center space-x-1"
                  >
                    <link.icon className="h-3 w-3" />
                    <span>{link.label}</span>
                    {link.external && <ExternalLink className="h-2 w-2" />}
                  </Link>
                </Button>
              ))}
            </div>

            {/* GitHub 链接 */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-fit hover:bg-accent/50"
            >
              <Link
                href={appConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">
                  {language === 'zh-CN' ? '查看源码' : 'View Source'}
                </span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* 底部：版权信息 */}
        <div className="flex flex-col space-y-2 text-center md:flex-row md:items-center md:justify-between md:space-y-0 md:text-left">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground md:justify-start">
            <span>© {currentYear}</span>
            <span>{appConfig.mainTitle}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>
                {language === 'zh-CN' ? '用' : 'Made with'}
              </span>
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              <span>
                {language === 'zh-CN' ? '制作' : 'by GHS Color Team'}
              </span>
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            <span>
              {language === 'zh-CN'
                ? '现代化色彩管理工具'
                : 'Modern Color Management Tool'
              }
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
