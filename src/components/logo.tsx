import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 dark:bg-brand-500">
        44
      </span>
      <span className="text-lg">4444 Crew</span>
    </Link>
  );
}
