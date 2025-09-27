'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ScheduleSubscribeProps {
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
}

export function ScheduleSubscribe({ dictionary }: ScheduleSubscribeProps) {
  const [copied, setCopied] = useState(false);
  const icsUrl = '/schedule.ics';

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${icsUrl}`);
      setCopied(true);
      trackEvent({ name: 'schedule_subscribe_ics', payload: { method: 'copy' } });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={icsUrl}
        className="button-primary"
        onClick={() => trackEvent({ name: 'schedule_subscribe_ics', payload: { method: 'download' } })}
      >
        {dictionary.common.download}
      </a>
      <button type="button" className="button-secondary" onClick={copyLink}>
        {copied ? dictionary.common.copied : dictionary.common.copyLink}
      </button>
    </div>
  );
}
