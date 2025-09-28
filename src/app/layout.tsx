import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { StructuredData } from '@/components/structured-data';
import { siteConfig } from '@/lib/site';
import { siteJsonLd } from '@/lib/seo';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';

const inter = Inter({ subsets: ['latin'] });
const noto = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — 방송 허브`,
    template: `%s — ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ['쌀가루집안', '방송', '라이브', 'VOD', '공지'],
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — 방송 허브`,
    description: siteConfig.description
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — 방송 허브`,
    description: siteConfig.description
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg'
  }
};

export const viewport: Viewport = {
  themeColor: '#f97316'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${inter.className} ${noto.className}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <SiteHeader />
            <main className="container-responsive flex-1 py-12">{children}</main>
            <SiteFooter />
          </div>
          <PwaInstallPrompt />
          <StructuredData data={siteJsonLd()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
