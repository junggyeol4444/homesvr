import Link from 'next/link';
import { Logo } from './logo';
import { LangToggle } from './lang-toggle';
import { ThemeToggle } from './theme-toggle';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface SiteHeaderProps {
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  lang: SupportedLanguage;
}

const navItems = [
  { href: '/', key: 'home' },
  { href: '/schedule', key: 'schedule' },
  { href: '/members', key: 'members' },
  { href: '/vod', key: 'vod' },
  { href: '/posts', key: 'posts' },
  { href: '/legal', key: 'legal' }
];

function resolveHref(base: string, lang: SupportedLanguage) {
  if (lang === 'en') {
    return base === '/' ? '/en' : `/en${base}`;
  }
  return base;
}

export function SiteHeader({ dictionary, lang }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="container-responsive flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
            {navItems.map((item) => (
              <Link key={item.key} href={resolveHref(item.href, lang)} className="hover:text-brand-600 dark:hover:text-brand-400">
                {dictionary.nav[item.key as keyof typeof dictionary.nav]}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
