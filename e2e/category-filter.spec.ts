import { test, expect } from '@playwright/test';

test.describe('Category filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for the product grid to populate
    await page.waitForSelector('[aria-label^="View details for"]');
  });

  test('all products are shown by default', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    await expect(cards).toHaveCount(6);
  });

  test('Duvets filter shows only Duvet products', async ({ page }) => {
    await page.getByRole('button', { name: 'Duvets' }).click();
    const cards = page.locator('[aria-label^="View details for"]');
    await expect(cards).toHaveCount(2);
    const names = await cards.allTextContents();
    // Every visible product name should include "Duvet"
    for (const name of names) {
      expect(name.toLowerCase()).toContain('duvet');
    }
  });

  test('Bed Sheets filter shows only Bed Sheet products', async ({ page }) => {
    await page.getByRole('button', { name: 'Bed Sheets' }).click();
    const cards = page.locator('[aria-label^="View details for"]');
    await expect(cards).toHaveCount(1);
  });

  test('Accessories catch-all shows products outside the three named categories', async ({ page }) => {
    await page.getByRole('button', { name: 'Accessories' }).click();
    const cards = page.locator('[aria-label^="View details for"]');
    // The seed data has one Accessories product (Decorative Throw Pillows)
    await expect(cards).toHaveCount(1);
  });

  test('clicking All after a filter restores the full product grid', async ({ page }) => {
    await page.getByRole('button', { name: 'Duvets' }).click();
    await expect(page.locator('[aria-label^="View details for"]')).toHaveCount(2);
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.locator('[aria-label^="View details for"]')).toHaveCount(6);
  });
});
