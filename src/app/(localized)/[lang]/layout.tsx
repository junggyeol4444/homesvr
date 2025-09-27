import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { getDictionary, supportedLanguages, type SupportedLanguage } from '@/i18n/dictionaries';

interface LayoutProps {
  children: ReactNode;
  params: { lang?: string };
}

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function LangLayout({ children, params }: LayoutProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  if (params.lang && !supportedLanguages.includes(lang)) {
    notFound();
  }
  const dictionary = getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <SiteHeader dictionary={dictionary} lang={lang} />
      <main className="container-responsive flex-1 py-10">{children}</main>
      <SiteFooter />
      <PwaInstallPrompt />
    </div>
  );
}
