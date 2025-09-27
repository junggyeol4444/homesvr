'use client';

import { useState } from 'react';
import type { Vod } from '@/content/types';
import { VodCard } from '@/components/vod-card';
import { VodPlayerModal } from '@/components/vod-player-modal';
import type { SupportedLanguage } from '@/i18n/dictionaries';

interface VodGalleryProps {
  vods: Vod[];
  dictionary: ReturnType<typeof import('@/i18n/dictionaries').getDictionary>;
  lang: SupportedLanguage;
}

export function VodGallery({ vods, dictionary, lang }: VodGalleryProps) {
  const [selected, setSelected] = useState<Vod | null>(null);
  return (
    <>
      <div className="mt-6 card-grid">
        {vods.map((vod) => (
          <VodCard key={vod.id} vod={vod} onSelect={setSelected} />
        ))}
      </div>
      <VodPlayerModal vod={selected} onClose={() => setSelected(null)} dictionary={dictionary} lang={lang} />
    </>
  );
}
