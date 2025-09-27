'use client';

interface AnalyticsEvent {
  name: string;
  payload?: Record<string, unknown>;
}

export function trackEvent(event: AnalyticsEvent) {
  try {
    const body = JSON.stringify({
      event: event.name,
      payload: event.payload ?? {},
      timestamp: new Date().toISOString()
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/log', body);
    } else {
      fetch('/api/log', {
        method: 'POST',
        body,
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(() => {
        // noop
      });
    }
  } catch (error) {
    console.error('[analytics] failed', error);
  }
}
