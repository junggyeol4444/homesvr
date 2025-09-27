# 4444 Crew Hub

4444 크루의 공식 허브 웹사이트입니다. 방송 일정, 멤버 소개, 공지, 하이라이트 VOD를 한 곳에서 관리·배포할 수 있도록 구성했습니다. 모든 콘텐츠는 정적 JSON/Markdown 데이터로 관리되어 Git 기반 워크플로우에 맞춰 버전 관리됩니다.

## 주요 기능

- **홈**: 다음 방송 카운트다운, 플랫폼 CTA, 최신 공지/VOD 하이라이트 노출
- **일정**: 주/월간 필터, 플랫폼·시리즈·게스트 필터, `/schedule.ics` 캘린더 피드
- **멤버**: 역할/키워드 필터, 프로필·SNS·고정 공지·대표 VOD 연동
- **VOD**: 플랫폼/시리즈/게스트/검색 필터, 라이트박스 플레이어, 챕터 지원
- **공지**: 다국어 MD 문서 렌더링, 공유 이벤트 트래킹
- **SEO/성능**: 구조화 데이터(JSON-LD), PWA manifest, robots/sitemap, 지연 로딩 이미지
- **트래킹**: Cloudflare Pages/Workers 환경과 호환되는 간단한 Beacon API(`/api/log`)

## 기술 스택

- Next.js 14 (App Router, SSG), TypeScript
- Tailwind CSS, next-themes, react-markdown
- 정적 콘텐츠(`src/content/*.json`), i18n 사전(`src/i18n`)
- Cloudflare Pages + 무료 플랜을 기준으로 월 30,000원 이하 운영 가능

## 프로젝트 구조

```
src/
  app/[[lang]]       // 언어별 라우팅 (ko 기본, /en 번역)
  app/schedule.ics   // iCal 피드
  app/api/log        // 클라이언트 이벤트 수집용 API (Beacon)
  components/        // UI 컴포넌트 및 JSON-LD 헬퍼
  content/           // Episodes/Members/Posts/VOD 데이터(JSON)
  i18n/              // 다국어 사전
  lib/               // 데이터 로더, 날짜/SEO 유틸, 사이트 설정
public/
  icon.svg, favicon.svg
```

## 개발 & 실행

```bash
npm install
npm run dev
```

> 샌드박스 환경에서는 npm registry 접근이 제한될 수 있습니다. 로컬/CI 환경에서 설치를 진행하세요.

### 스크립트

- `npm run dev` – 개발 서버 실행
- `npm run build` – 프로덕션 빌드
- `npm run start` – 빌드 결과 실행
- `npm run lint` – ESLint 검사

## 콘텐츠 업데이트

1. `src/content/episodes.json` 등 JSON 파일을 수정하여 일정/멤버/VOD/공지 데이터를 갱신합니다.
2. 영어 문구(`*_en`)가 존재하지 않으면 한국어 내용이 자동으로 사용됩니다.
3. 변경 사항을 커밋하고 Cloudflare Pages에 push하면 SSG 빌드가 수행됩니다.

## 배포 & 운영 메모

- Cloudflare Pages로 정적 배포(무료), Workers로 `/api/log` 백엔드를 확장할 수 있습니다.
- Cloudflare Web Analytics, 또는 Workers KV/Queue를 이용해 수집된 이벤트를 저장할 수 있습니다.
- PWA manifest(`src/app/manifest.ts`), sitemap/robots가 포함되어 검색엔진 최적화에 대응합니다.
- 호스팅/도메인/분석 툴을 Cloudflare 무료+저가 플랜으로 구성하면 월 30,000원 이내 운영이 가능합니다.

## Lighthouse 목표 가이드

- 이미지 lazy-load 및 Next.js SSG로 첫화면 LCP를 2.5s 이하로 유지합니다.
- 구조화 데이터(Event, VideoObject, Article, Person) 삽입으로 SEO 90+ 목표를 충족합니다.
- 다크 모드/접근성(A11y) 대응으로 Lighthouse Accessibility 90+를 목표로 합니다.
