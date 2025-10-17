import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Providers } from './providers';
import './globals.css';
import { themeTokens } from '@homesvr/ui';

const title = 'Homesvr | 가전·디지털 쇼핑 가이드';
const description = '생활가전, 오디오, 게임 액세서리, 전자책 리더를 비교하고 추천받는 MVP 서비스';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL('https://homesvr.dev'),
  openGraph: {
    title,
    description,
    url: 'https://homesvr.dev',
    siteName: 'Homesvr',
    images: [
      {
        url: 'https://homesvr.dev/og.png',
        width: 1200,
        height: 630,
        alt: 'Homesvr 쇼핑 가이드'
      }
    ],
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    site: '@homesvr'
  }
};

export const viewport: Viewport = {
  themeColor: themeTokens.colors.primary
};

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ko" className="bg-slate-950">
    <body className="flex min-h-screen flex-col font-sans">
      <Providers>
        <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-0">
            <div>
              <Link href="/" className="text-lg font-semibold text-primary">
                Homesvr
              </Link>
              <p className="text-xs text-slate-400">가전·디지털 비교 · 랭킹 · 구매 길잡이</p>
            </div>
            <nav className="flex items-center gap-4 text-sm text-slate-300">
              <Link href="/categories">카테고리</Link>
              <Link href="/compare">비교하기</Link>
              <Link href="/tools">맞춤 도구</Link>
              <Link href="/alerts">가격 알림</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-white/10 bg-slate-950/70 py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-slate-400 lg:px-0">
            <p>© {new Date().getFullYear()} Homesvr. 제휴 링크를 포함할 수 있으며, 가격 정보는 지연될 수 있습니다.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy">개인정보 처리방침</Link>
              <Link href="/terms">서비스 이용약관</Link>
              <a href="https://lookerstudio.google.com">Looker Studio 대시보드</a>
            </div>
          </div>
        </footer>
      </Providers>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </body>
  </html>
);

export default RootLayout;
