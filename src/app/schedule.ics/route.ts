import { NextResponse } from 'next/server';
import { getEpisodes } from '@/lib/data';

export const revalidate = 600;

function formatDate(date: string) {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export async function GET() {
  const items = getEpisodes();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//4444 Crew//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:4444 Crew Streams',
    'X-WR-TIMEZONE:Asia/Seoul'
  ];

  items.forEach((episode) => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${episode.id}@4444crew`);
    lines.push(`DTSTAMP:${formatDate(new Date().toISOString())}`);
    lines.push(`DTSTART:${formatDate(episode.startAt)}`);
    if (episode.endAt) {
      lines.push(`DTEND:${formatDate(episode.endAt)}`);
    }
    lines.push(`SUMMARY:${episode.title}`);
    lines.push(`URL:${episode.url}`);
    const description = [episode.description, `Platform: ${episode.platform}`, `Tags: ${episode.tags.join(', ')}`]
      .filter(Boolean)
      .join('\\n');
    lines.push(`DESCRIPTION:${description}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  const body = lines.join('\r\n');

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="schedule.ics"',
      'Cache-Control': 'public, max-age=600'
    }
  });
}
