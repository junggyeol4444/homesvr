import { test, expect } from '@playwright/test';

test('비교 플로우', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { name: '3-way 비교표' })).toBeVisible();
  await expect(page.getByText('최저가')).toBeVisible();
});

test('설문 → 추천', async ({ page }) => {
  await page.goto('/tools');
  await expect(page.getByRole('heading', { name: '맞춤 설문 도구' })).toBeVisible();
});

test('가격 알림 폼 표시', async ({ page }) => {
  await page.goto('/alerts');
  await expect(page.getByText('가격 알림 센터')).toBeVisible();
});
