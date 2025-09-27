'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="button-secondary"
        aria-label="Toggle theme"
        type="button"
      >
        <SunIcon className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      className="button-secondary"
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      <span className="hidden text-sm md:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
