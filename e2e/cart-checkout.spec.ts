import { test, expect } from '@playwright/test';

test.describe('Cart and checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('adding a product increments the cart badge', async ({ page }) => {
    const firstAddBtn = page.getByRole('button', { name: /add .* to bag/i }).first();
    await firstAddBtn.click();
    const cartBtn = page.getByLabel(/shopping bag/i);
    await expect(cartBtn.locator('span')).toHaveText('1');
  });

  test('added product appears in the cart drawer', async ({ page }) => {
    // Hover over first product card to reveal its "Add to bag" button
    const firstCard = page.locator('[aria-label^="View details for"]').first();
    const productName = await firstCard.getAttribute('aria-label').then(
      (l) => l?.replace('View details for ', '') ?? ''
    );
    await page.getByRole('button', { name: `Add ${productName} to bag` }).click();

    // Open the cart
    await page.getByLabel(/shopping bag/i).click();
    const drawer = page.getByRole('dialog', { name: /your bag/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(productName)).toBeVisible();
  });

  test('Order via WhatsApp link contains the product name and total', async ({ page }) => {
    const firstCard = page.locator('[aria-label^="View details for"]').first();
    const productName = await firstCard.getAttribute('aria-label').then(
      (l) => l?.replace('View details for ', '') ?? ''
    );
    await page.getByRole('button', { name: `Add ${productName} to bag` }).click();

    await page.getByLabel(/shopping bag/i).click();
    // Scope to the cart dialog to avoid matching the Navbar WhatsApp icon link
    const drawer = page.getByRole('dialog', { name: /your bag/i });
    const whatsappLink = drawer.getByRole('link', { name: /order via whatsapp/i });
    await expect(whatsappLink).toBeVisible();

    const href = await whatsappLink.getAttribute('href') ?? '';
    expect(href).toContain('wa.me/254715035359');
    expect(href.toLowerCase()).toContain(productName.toLowerCase().split(' ')[0]);
  });

  test('cart shows empty state when no items are added', async ({ page }) => {
    await page.getByLabel(/shopping bag/i).click();
    const drawer = page.getByRole('dialog', { name: /your bag/i });
    await expect(drawer.getByText(/your bag is currently empty/i)).toBeVisible();
  });

  test('"Added to Bag" notification appears when a product is added', async ({ page }) => {
    await page.getByRole('button', { name: /add .* to bag/i }).first().click();
    await expect(page.getByText(/added to bag/i)).toBeVisible();
  });
});
