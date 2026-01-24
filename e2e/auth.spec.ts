import { test, expect } from '@playwright/test';

test.describe('Authentication and Data Loading', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Google Apps Script API
    await page.route('https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec', async route => {
      const request = route.request();
      if (request.method() === 'POST') {
        const postData = request.postDataJSON();
        
        // Handle different API methods based on payload
        if (postData.method === 'forceRefresh') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}), // returns void/empty usually or maybe status
          });
        }
        
        if (postData.method === 'getSuiviDays') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              { date: new Date().toISOString(), matin: 'Apple', Calories: 50 }, // Mock data
            ]),
          });
        }

        if (postData.method === 'getDatabase') {
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify([
                { aliment: 'Apple', Calories: 50, Proteines: 0.5 },
              ]),
            });
        }

        if (postData.method === 'getTargets') {
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify([
                { targetName: 'Calories', min: '2000' },
              ]),
            });
        }
        
        // Fallback for other methods
        return route.fulfill({
             status: 200,
             contentType: 'application/json',
             body: JSON.stringify({}),
        });
      }
      return route.continue();
    });
  });

  test('successfully logs in and loads data', async ({ page }) => {
    await page.goto('/');

    // Check if Password Modal is visible
    // "Cette application est protégée par un mot de passe"
    await expect(page.getByText('Cette application est protégée par un mot de passe')).toBeVisible();

    // Enter password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('dummyPassword');

    // Click validate
    await page.getByRole('button', { name: 'Valider' }).click();

    // Should see loading spinner or main content eventually
    // The LoadingRing component might be visible
    // await expect(page.locator('.loading-ring')).toBeVisible(); // Selector might differ

    // Wait for the main body or header to appear
    // HeaderDate component has a specific look, maybe check for text or just the container
    // If login is successful, PasswordModal should disappear.
    await expect(page.getByText('Cette application est protégée par un mot de passe')).not.toBeVisible();
    
    // Check if Header is visible (it appears if activeMenu !== 'charts')
    // Or just check for NavBar elements which are always there
    await expect(page.getByText('📊')).toBeVisible();
  });
});
