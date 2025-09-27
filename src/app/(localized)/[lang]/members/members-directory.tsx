'use client';

import { useMemo, useState } from 'react';
import type { Member } from '@/content/types';
import { MemberCard } from '@/components/member-card';
import { trackEvent } from '@/lib/analytics';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface MembersDirectoryProps {
  members: Member[];
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  lang: SupportedLanguage;
}

export function MembersDirectory({ members, dictionary, lang }: MembersDirectoryProps) {
  const [focusFilter, setFocusFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const focusTags = useMemo(() => {
    return Array.from(new Set(members.flatMap((member) => member.focus ?? []))).sort();
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((member) => {
      if (focusFilter && !(member.focus ?? []).includes(focusFilter)) {
        return false;
      }
      const keywords = `${member.name} ${member.role} ${(lang === 'en' ? member.bio_en ?? member.bio : member.bio)}`.toLowerCase();
      if (search && !keywords.includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [members, focusFilter, search, lang]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`button-secondary ${focusFilter === '' ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20' : ''}`}
            onClick={() => {
              setFocusFilter('');
              trackEvent({ name: 'member_filter_change', payload: { value: 'all' } });
            }}
          >
            {dictionary.common.all}
          </button>
          {focusTags.map((focus) => (
            <button
              key={focus}
              type="button"
              className={`button-secondary ${focusFilter === focus ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20' : ''}`}
              onClick={() => {
                setFocusFilter((prev) => (prev === focus ? '' : focus));
                trackEvent({ name: 'member_filter_change', payload: { value: focus } });
              }}
            >
              {focus}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder={dictionary.common.search}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {filtered.length ? (
        <div className="card-grid">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">{dictionary.common.empty}</p>
      )}
    </div>
  );
}
