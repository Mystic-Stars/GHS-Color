'use client';

import React from 'react';
import {
  ExternalLink,
  Github,
  FileText,
  Users,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { useTranslation } from '@/hooks/use-translation';
import { submitGuideConfig } from '@/lib/env-config';

interface SubmitGuideProps {
  onClose?: () => void;
}

export function SubmitGuide({ onClose }: SubmitGuideProps) {
  const { t } = useTranslation();

  const handleOpenGitHub = () => {
    window.open(submitGuideConfig.githubUrl, '_blank');
  };

  const handleOpenIssue = () => {
    const { title, body } = submitGuideConfig.issueTemplate;
    const issueUrl = `${submitGuideConfig.issueUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.open(issueUrl, '_blank');
  };

  const handleOpenContributing = () => {
    window.open(submitGuideConfig.contributingUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Github className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('submitGuide.title')}</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {t('submitGuide.description')}
        </p>
      </div>

      {/* 提交步骤 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 步骤1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              {t('submitGuide.steps.step3')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('submitGuide.steps.step3Description')}
            </p>
            <ul className="text-sm space-y-1">
              <li>• {t('submitGuide.colorInfo.name')}</li>
              <li>• {t('submitGuide.colorInfo.hex')}</li>
              <li>• {t('submitGuide.colorInfo.description')}</li>
              <li>• {t('submitGuide.colorInfo.category')}</li>
              <li>• {t('submitGuide.colorInfo.tags')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* 步骤2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              {t('submitGuide.steps.step2')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('submitGuide.steps.step2Description')}
            </p>
            <Button onClick={handleOpenIssue} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              {t('submitGuide.buttons.createIssue')}
            </Button>
          </CardContent>
        </Card>

        {/* 步骤3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              {t('submitGuide.steps.step4')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('submitGuide.steps.step4Description')}
            </p>
            <ul className="text-sm space-y-1">
              <li>• {t('submitGuide.requirements.colorReq4')}</li>
              <li>• {t('submitGuide.requirements.colorReq1')}</li>
              <li>• {t('submitGuide.requirements.colorReq3')}</li>
              <li>• {t('submitGuide.requirements.descReq3')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 提交要求 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t('submitGuide.requirements.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">
                {t('submitGuide.requirements.colorRequirements')}
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {t('submitGuide.requirements.colorReq1')}</li>
                <li>• {t('submitGuide.requirements.colorReq2')}</li>
                <li>• {t('submitGuide.requirements.colorReq3')}</li>
                <li>• {t('submitGuide.requirements.colorReq4')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {t('submitGuide.requirements.descriptionRequirements')}
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {t('submitGuide.requirements.descReq1')}</li>
                <li>• {t('submitGuide.requirements.descReq2')}</li>
                <li>• {t('submitGuide.requirements.descReq3')}</li>
                <li>• {t('submitGuide.requirements.descReq4')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快速链接 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" onClick={handleOpenGitHub} className="gap-2">
          <Github className="h-4 w-4" />
          {t('submitGuide.buttons.visitGitHub')}
        </Button>

        <Button
          variant="outline"
          onClick={handleOpenContributing}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          {t('submitGuide.buttons.contributingGuide')}
        </Button>

        <Button variant="outline" onClick={handleOpenIssue} className="gap-2">
          <Users className="h-4 w-4" />
          {t('submitGuide.buttons.viewIssues')}
        </Button>
      </div>

      {/* 关闭按钮 */}
      {onClose && (
        <div className="text-center pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('submitGuide.backToColors')}
          </Button>
        </div>
      )}

      {/* 感谢信息 */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>{t('submitGuide.thanks')}</p>
      </div>
    </div>
  );
}
