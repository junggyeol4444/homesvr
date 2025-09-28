import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold text-white">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-lg text-white shadow-lg shadow-orange-500/40">
        쌀
      </span>
      <span className="text-xl tracking-tight">쌀가루집안</span>
    </Link>
  );
}
