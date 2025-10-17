#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="homesvr-api"
PROJECT_ID=${GCP_PROJECT_ID:?"GCP_PROJECT_ID is required"}
REGION=${GCP_REGION:-asia-northeast3}
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:$(git rev-parse --short HEAD)"

pnpm --filter @homesvr/api build

gcloud builds submit --tag "$IMAGE" .

gcloud run deploy "$SERVICE_NAME" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --image "$IMAGE" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-secrets DATABASE_URL=db-connection:latest
