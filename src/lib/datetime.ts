import { format, formatDistanceStrict, isAfter, isWithinInterval } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import type { SupportedLanguage } from '@/i18n/dictionaries';

export function formatDate(date: string | Date, lang: SupportedLanguage, pattern = 'PPPp') {
  const locale = lang === 'ko' ? ko : enUS;
  return format(typeof date === 'string' ? new Date(date) : date, pattern, { locale });
}

export function formatCountdown(target: string, lang: SupportedLanguage) {
  const targetDate = new Date(target);
  const now = new Date();
  if (isAfter(now, targetDate)) {
    return lang === 'ko' ? '방송 중' : 'Live now';
  }
  return formatDistanceStrict(targetDate, now, {
    roundingMethod: 'floor',
    locale: lang === 'ko' ? ko : enUS
  });
}

export function isUpcoming(target: string) {
  return isAfter(new Date(target), new Date());
}

export function isLive(start: string, end?: string) {
  if (!end) {
    return false;
  }
  const now = new Date();
  return isWithinInterval(now, { start: new Date(start), end: new Date(end) });
}

export function formatTimeRange(start: string, lang: SupportedLanguage, end?: string) {
  const locale = lang === 'ko' ? ko : enUS;
  const startDate = new Date(start);
  if (!end) {
    return format(startDate, 'PPP p', { locale });
  }
  const endDate = new Date(end);
  return `${format(startDate, 'MMM d, p', { locale })} – ${format(endDate, 'p', { locale })}`;
}

export function formatVodDuration(durationSeconds: number, lang: SupportedLanguage) {
  const minutes = Math.floor(durationSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return lang === 'ko'
      ? `${hours}시간 ${remainingMinutes}분`
      : `${hours}h ${remainingMinutes}m`;
  }
  return lang === 'ko' ? `${minutes}분` : `${minutes}m`;
}
