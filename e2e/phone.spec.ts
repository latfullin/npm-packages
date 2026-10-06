import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tinyval-phone/');
});

test('номер любой страны: маска, страна и иконка флага', async ({ page }) => {
  const input = page.locator('#phone-any');
  await input.click();
  await input.pressSequentially('+819012345678');
  await expect(input).toHaveValue('+81 90-1234-5678');
  await expect(page.locator('.phone-demo__country')).toContainText('Япония');
  await expect(page.locator('.phone-demo__flag svg')).toBeVisible();
  await expect(page.locator('.phone-demo__raw')).toContainText('"819012345678"');
  await expect(page.locator('.phone-demo__raw')).toContainText('✓');
});

test('общий код +1: Багамы по началу номера', async ({ page }) => {
  await page.locator('.phone-demo__samples button', { hasText: '+1 242' }).click();
  await expect(page.locator('#phone-any')).toHaveValue('+1 (242) 359-1234');
  await expect(page.locator('.phone-demo__country')).toContainText('Багамы');
});
