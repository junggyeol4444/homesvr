import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 py-8 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-950/70 dark:text-slate-400">
      <div className="container-responsive flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} 쌀가루집안. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="https://tally.so" target="_blank" rel="noopener" className="hover:text-brand-600 dark:hover:text-brand-400">
            문의하기
          </Link>
          <Link href="/legal" className="hover:text-brand-600 dark:hover:text-brand-400">
            정책 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}
