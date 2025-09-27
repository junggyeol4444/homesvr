import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { StructuredData } from '@/components/structured-data';
import { siteConfig } from '@/lib/site';
import { siteJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });
const noto = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — 공식 홈페이지`,
    template: `%s — ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ['쌀가루집안', '가족', '공지', '일정', '라이브', '커뮤니티'],
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — 공식 홈페이지`,
    description: siteConfig.description
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — 공식 홈페이지`,
    description: siteConfig.description
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg'
  }
};

export const viewport: Viewport = {
  themeColor: '#3c7dff'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${inter.className} ${noto.className}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <StructuredData data={siteJsonLd()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
