# Homesvr Monorepo

가전·디지털 쇼핑 가이드(MVP)를 위한 Turbo + pnpm 모노레포입니다. Next.js 프론트엔드와 Express 기반 API, 공용 UI/설정 패키지를 포함합니다.

## 프로젝트 구조

```
apps/
  web/    # Next.js(App Router) 프론트엔드
  api/    # Express + Prisma 백엔드 API
packages/
  config/ # ESLint/TSConfig, 환경변수 스키마
  types/  # Prisma 공유 타입 및 DTO
  ui/     # shadcn 스타일 래핑 UI 컴포넌트
infra/
  ...     # 배포 및 CI 템플릿
```

## 빠른 시작

```bash
pnpm install
pnpm dev
```

- 프론트엔드: http://localhost:3000
- API: http://localhost:8080 (Cloud Run 배포 타겟)

## 품질 & 가이드

- TypeScript strict mode
- ESLint + Prettier + lint-staged
- Vitest 단위 테스트 (`pnpm --filter @homesvr/api test`)
- Playwright E2E 시나리오 준비 (`apps/web/e2e`에 추가 가능)

## 환경 변수

`.env.example` 파일을 복사하여 각 서비스에서 사용하세요. 공용 스키마는 `packages/config/env.ts`에 정의되어 있습니다.

## 문서

- `apps/api/README.md`
- `apps/web/README.md`

## 라이선스

사내 프로젝트용. 무단 배포 금지.
