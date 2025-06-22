import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/toast-provider';
import { LanguageProvider } from '@/components/language-provider';
import { DynamicHead } from '@/components/dynamic-head';
import { appConfig } from '@/lib/env-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: appConfig.site.title,
  description: appConfig.site.description,
  keywords: appConfig.site.keywords.split(','),
  authors: [{ name: 'GHS Color Next Team' }],
  icons: {
    icon: [
      {
        url: '/icons/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icons/ico.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/icons/favicon.ico',
    apple: '/icons/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="ghs-color-theme">
          <LanguageProvider>
            <DynamicHead>
              <ToastProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  {children}
                </div>
              </ToastProvider>
            </DynamicHead>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
