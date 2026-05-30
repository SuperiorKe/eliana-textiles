import { test, expect } from '@playwright/test';

test.describe('Product search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[aria-label^="View details for"]');
  });

  async function openSearch(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
    await page.getByLabel('Open search').click();
    await expect(page.getByLabel('Search collections')).toBeVisible();
  }

  test('typing a product name filters the grid', async ({ page }) => {
    await openSearch(page);
    await page.getByLabel('Search collections').fill('duvet');
    const cards = page.locator('[aria-label^="View details for"]');
    await expect(cards).not.toHaveCount(6);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    // All shown products should be duvet-related
    const labels = await cards.evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-label') ?? '')
    );
    for (const label of labels) {
      expect(label.toLowerCase()).toContain('duvet');
    }
  });

  test('non-matching search shows the empty-results state', async ({ page }) => {
    await openSearch(page);
    await page.getByLabel('Search collections').fill('zzznomatch');
    await expect(page.getByText(/no textiles matching/i)).toBeVisible();
    await expect(page.locator('[aria-label^="View details for"]')).toHaveCount(0);
  });

  test('clear search restores all products', async ({ page }) => {
    await openSearch(page);
    await page.getByLabel('Search collections').fill('zzznomatch');
    await expect(page.getByText(/no textiles matching/i)).toBeVisible();
    await page.getByRole('button', { name: /clear search/i }).click();
    await expect(page.locator('[aria-label^="View details for"]')).toHaveCount(6);
  });

  test('search suggestions appear in the navbar dropdown', async ({ page }) => {
    await openSearch(page);
    await page.getByLabel('Search collections').fill('cotton');
    // Suggestions dropdown should appear with the matching product
    await expect(page.getByText('Silky Smooth Cotton Set').first()).toBeVisible();
  });
});
