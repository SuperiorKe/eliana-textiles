import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[aria-label^="View details for"]');
  });

  // Helper: the Navbar wishlist button aria-label is "Wishlist, N items".
  // Using ^Wishlist, avoids matching product-card wishlist buttons like
  // "Add X to wishlist" or "Remove X from wishlist".
  function navWishlistBtn(page: import('@playwright/test').Page) {
    return page.getByLabel(/^Wishlist,/);
  }

  test('wishlist count starts at zero — no badge visible', async ({ page }) => {
    // The badge span is conditionally rendered; with 0 items it is absent
    await expect(navWishlistBtn(page).locator('span')).not.toBeVisible();
  });

  test('adding a product increments the wishlist badge', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
    await page.getByRole('button', { name: `Add ${firstName} to wishlist` }).click();
    await expect(navWishlistBtn(page).locator('span')).toHaveText('1');
  });

  test('toggling the same product removes it from the wishlist', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';

    // Add
    await page.getByRole('button', { name: `Add ${firstName} to wishlist` }).click();
    await expect(navWishlistBtn(page).locator('span')).toHaveText('1');

    // Remove
    await page.getByRole('button', { name: `Remove ${firstName} from wishlist` }).click();
    await expect(navWishlistBtn(page).locator('span')).not.toBeVisible();
  });

  test('product appears in the wishlist drawer after being added', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
    await page.getByRole('button', { name: `Add ${firstName} to wishlist` }).click();

    // Open wishlist drawer via the Navbar button
    await navWishlistBtn(page).click();
    const drawer = page.getByRole('dialog', { name: /your selection/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(firstName)).toBeVisible();
  });

  test('Add to Bag in wishlist drawer moves the item to the cart', async ({ page }) => {
    const cards = page.locator('[aria-label^="View details for"]');
    const firstName = (await cards.first().getAttribute('aria-label'))?.replace('View details for ', '') ?? '';
    await page.getByRole('button', { name: `Add ${firstName} to wishlist` }).click();
    await navWishlistBtn(page).click();

    const drawer = page.getByRole('dialog', { name: /your selection/i });
    // "Add to Bag" is the button label inside the wishlist drawer
    await drawer.getByRole('button', { name: /add to bag/i }).click();

    // Cart badge should now show 1
    await expect(page.getByLabel(/shopping bag/i).locator('span')).toHaveText('1');

    // Wishlist badge should be gone (item moved out)
    await expect(navWishlistBtn(page).locator('span')).not.toBeVisible();
  });
});
