import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-10 text-sm text-slate-400 backdrop-blur">
      <div className="container-responsive flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} 쌀가루집안. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            관리자 페이지
          </Link>
          <Link
            href="mailto:hello@ssalgageul.kr"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
}
