import Image from 'next/image';
import Link from 'next/link';
import type { Member } from '@/content/types';
import { trackEvent } from '@/lib/analytics';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      href={`/members/${member.slug}`}
      className="card group flex flex-col items-center text-center"
      onClick={() => trackEvent({ name: 'member_card_click', payload: { slug: member.slug } })}
    >
      <div className="relative h-32 w-32 overflow-hidden rounded-full">
        <Image src={member.avatar} alt={member.name} fill className="object-cover" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{member.name}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{member.role}</p>
    </Link>
  );
}
