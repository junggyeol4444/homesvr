import type { Metadata } from 'next';
import { getDictionary, type SupportedLanguage } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-static';

interface LegalPageProps {
  params: { lang?: string };
}

export function generateMetadata({ params }: LegalPageProps): Metadata {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);
  return buildMetadata({
    title: dictionary.legal.title,
    description: dictionary.legal.privacy,
    path: params.lang ? `/${params.lang}/legal` : '/legal',
    lang
  });
}

export default function LegalPage({ params }: LegalPageProps) {
  const lang = (params.lang ?? 'ko') as SupportedLanguage;
  const dictionary = getDictionary(lang);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.legal.title}</h1>
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">{dictionary.legal.privacy}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          팬 커뮤니티 운영에 필요한 최소한의 정보만 수집하며, 서드파티 분석 도구 없이 Cloudflare Analytics만 사용합니다.
        </p>
      </section>
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">{dictionary.legal.copyright}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          모든 콘텐츠의 저작권은 4444 크루와 협력 파트너에 있습니다. 무단 전재·배포를 금지하며, 인용 시 출처를 명확히 기재해주세요.
        </p>
      </section>
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">{dictionary.legal.ads}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          일부 링크는 제휴 마케팅이 포함될 수 있으며, 방송 내 광고·협찬은 사전에 명확히 안내드립니다.
        </p>
      </section>
    </div>
  );
}
