import { test, expect } from '@playwright/test';

test.describe('Product comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[aria-label^="View details for"]');
  });

  test('comparison bar is hidden when no products are added', async ({ page }) => {
    await expect(page.getByText(/items to compare/i)).not.toBeVisible();
  });

  test('comparison bar appears after adding a product', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
    await page.getByRole('button', { name: `Add ${firstName} to comparison` }).click();
    await expect(page.getByText(/1 item to compare/i)).toBeVisible();
  });

  test('adding 5 products silently caps the list at 4', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const count = await cards.count();
    // Add up to 5 products to comparison
    for (let i = 0; i < Math.min(5, count); i++) {
      const name = (await cards.nth(i).getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
      await page.getByRole('button', { name: `Add ${name} to comparison` }).click();
    }
    // Count should be capped at 4
    await expect(page.getByText(/4 items to compare/i)).toBeVisible();
    await expect(page.getByText(/5 items to compare/i)).not.toBeVisible();
  });

  test('Compare Now button opens the comparison modal', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
    await page.getByRole('button', { name: `Add ${firstName} to comparison` }).click();
    await page.getByRole('button', { name: /compare now/i }).click();
    // The modal renders an h2 "Product Comparison"
    await expect(page.getByRole('heading', { name: /product comparison/i })).toBeVisible();
  });
});
