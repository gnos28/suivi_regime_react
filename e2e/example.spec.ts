import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mes repas/);
});

test('loads main components', async ({ page }) => {
  await page.goto('/');
  
  // Check if main layout is present
  await expect(page.getByText('Cette application est protégée par un mot de passe')).toBeVisible();
});
