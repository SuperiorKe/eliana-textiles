import { test, expect } from '@playwright/test';

test.describe('Hero section buttons', () => {
  test('Shop Collections scrolls to product grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const shopBtn = page.getByRole('button', { name: /shop collections/i });
    await expect(shopBtn).toBeVisible();
    await expect(shopBtn).toHaveCSS('cursor', 'pointer');

    await shopBtn.click();
    await page.waitForTimeout(600); // wait for smooth scroll

    const collections = page.locator('#collections');
    await expect(collections).toBeInViewport();
  });

  test('Our Materials scrolls to materials section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const materialsBtn = page.getByRole('button', { name: /our materials/i });
    await expect(materialsBtn).toBeVisible();
    await expect(materialsBtn).toHaveCSS('cursor', 'pointer');

    await materialsBtn.click();
    await page.waitForTimeout(600);

    const materials = page.locator('#materials');
    await expect(materials).toBeInViewport();
  });
});
