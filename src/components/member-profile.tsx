'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Member } from '@/content/types';
import { trackEvent } from '@/lib/analytics';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface MemberProfileProps {
  member: Member;
  lang: SupportedLanguage;
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
}

const socialLabels: Record<string, { label: string; icon: string }> = {
  youtube: { label: 'YouTube', icon: '▶' },
  chzzk: { label: 'Chzzk', icon: '⚡' },
  tiktok: { label: 'TikTok', icon: '♪' },
  twitch: { label: 'Twitch', icon: '⌁' },
  x: { label: 'X', icon: '𝕏' },
  instagram: { label: 'Instagram', icon: '◎' },
  email: { label: 'Email', icon: '✉' }
};

export function MemberProfile({ member, lang, dictionary }: MemberProfileProps) {
  const socials = Object.entries(member.socials).filter(([, url]) => Boolean(url));

  return (
    <div className="card flex flex-col gap-6 md:flex-row md:items-center">
      <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={member.avatar} alt={member.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{member.name}</h1>
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-400">{member.role}</p>
        <p className="mt-4 text-base text-slate-700 dark:text-slate-200">
          {lang === 'en' && member.bio_en ? member.bio_en : member.bio}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {member.pronouns ? <span>{dictionary.members.pronouns}: {member.pronouns}</span> : null}
          {member.focus?.length ? <span>{dictionary.members.focus}: {member.focus.join(', ')}</span> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {socials.map(([network, url]) => (
            <Link
              key={network}
              href={url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
              onClick={() =>
                trackEvent({ name: 'member_social_click', payload: { slug: member.slug, network } })
              }
            >
              <span aria-hidden className="text-base">
                {socialLabels[network]?.icon ?? '↗'}
              </span>
              <span className="text-sm">{socialLabels[network]?.label ?? network}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
