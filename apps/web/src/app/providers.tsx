'use client';

import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ToastProvider, ToastViewport } from '@homesvr/ui';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    persistence: 'localStorage'
  });
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.capture('$pageview');
  }, [pathname, searchParams]);

  return (
    <PostHogProvider client={posthog}>
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </PostHogProvider>
  );
};
