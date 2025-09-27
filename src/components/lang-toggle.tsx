'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supportedLanguages } from '@/i18n/dictionaries';

function buildPath(pathname: string, target: string) {
  if (target === 'ko') {
    if (!pathname.startsWith('/en')) {
      return pathname || '/';
    }
    return pathname.replace(/^\/en/, '') || '/';
  }
  if (pathname.startsWith('/en')) {
    return pathname;
  }
  return pathname === '/' ? '/en' : `/en${pathname}`;
}

export function LangToggle() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {supportedLanguages.map((lang) => {
        const href = buildPath(pathname, lang);
        const active = (lang === 'ko' && !pathname.startsWith('/en')) || pathname.startsWith(`/${lang}`);
        return (
          <Link
            key={lang}
            href={href}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              active
                ? 'bg-brand-600 text-white shadow-brand-600/30 shadow'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
