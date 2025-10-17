# Homesvr Web

Next.js(App Router) 기반 가전·디지털 쇼핑 가이드 프론트엔드입니다.

## 주요 기능

- 홈: 카테고리/추천 제품, Hero, 파트너 알림
- 카테고리: 스펙 필터 DB + 제품 리스트
- 상세: 스펙, 가격, 호환성, 가격 알림 폼
- 비교: 3-way 비교표, 최저가 제휴 라벨
- 도구: 10문항 맞춤 설문 (React Hook Form + Zustand)
- 알림: 가격 알림 등록, Opt-in/Opt-out 안내
- SEO: 메타/OG, sitemap, robots
- Analytics: GA4 + PostHog 추적 스크립트

## 개발

```bash
pnpm --filter @homesvr/web dev
```

## 테스트 & 품질

- Tailwind + shadcn/ui 래퍼(`@homesvr/ui`)
- Zustand 상태 관리 (비교 흐름)
- React Hook Form + zod 검증
- Playwright E2E 시나리오 (`pnpm --filter @homesvr/web exec playwright test`) 준비

## 환경 변수

`NEXT_PUBLIC_*` 변수는 `.env.example` 참고.
