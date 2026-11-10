import { expect, test } from '@playwright/test';

test('home page shows the title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Split the Bill' })).toBeVisible();
});
