'use client';

import { useEffect, useState } from 'react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('pwaPromptSeen');
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!seen) {
        setVisible(true);
      }
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!visible || !deferredPrompt) {
    return null;
  }

  async function handleInstall() {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      sessionStorage.setItem('pwaPromptSeen', '1');
      setVisible(false);
    }
  }

  return (
    <div className="fixed bottom-6 inset-x-4 z-40 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm text-slate-700 dark:text-slate-200">
          <p className="font-semibold">홈 화면에 4444 크루 허브를 설치해보세요!</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">언제든지 일정과 하이라이트를 빠르게 확인할 수 있어요.</p>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="button-primary text-xs" onClick={handleInstall}>
            설치
          </button>
          <button
            type="button"
            className="button-secondary text-xs"
            onClick={() => {
              sessionStorage.setItem('pwaPromptSeen', '1');
              setVisible(false);
            }}
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
