# Homesvr API

Express 기반 가전·디지털 쇼핑 가이드 백엔드입니다.

## 스택

- Express + TypeScript
- Prisma + PostgreSQL
- Swagger(OpenAPI) 자동 문서화 (`/docs`, `/openapi.json`)
- Vitest 단위 테스트

## 주요 스크립트

```bash
pnpm --filter @homesvr/api dev    # 개발 서버 (http://localhost:8080)
pnpm --filter @homesvr/api build  # 프로덕션 빌드
pnpm --filter @homesvr/api start  # 빌드된 서버 실행
pnpm --filter @homesvr/api seed   # 샘플 데이터 30개 시드
pnpm --filter @homesvr/api test   # Vitest 실행
```

## 환경 변수

`.env.example` 참고. 필수 값은 `packages/config/env.ts` 스키마에 정의되어 있습니다.

## 데이터베이스 마이그레이션

```bash
pnpm dlx prisma migrate dev --schema apps/api/prisma/schema.prisma
```

## 가격 알림

- 이메일/슬랙/텔레그램 채널 필드를 지원합니다.
- 개인정보 필드는 별도 KMS/Secrets Manager에 저장하는 것을 전제로 합니다.

## API 문서

- Swagger UI: `/docs`
- OpenAPI JSON: `/openapi.json`
