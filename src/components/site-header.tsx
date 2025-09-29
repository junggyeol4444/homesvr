import Link from 'next/link';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { label: '홈', href: '/' },
  { label: '공지사항', href: '/notices' },
  { label: '방송 일정', href: '/schedule' },
  { label: '관리자', href: '/admin' }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-200/70 bg-white/80 text-slate-900 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100">
      <div className="container-responsive flex items-center justify-between py-5">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-slate-700 transition hover:bg-orange-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-400/40 transition hover:brightness-110"
          >
            관리자
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
