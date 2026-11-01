import { test, expect } from '@playwright/test';

test('демо tinyval: результат проверки меняется при вводе', async ({ page }) => {
  await page.goto('/tinyval/');
  const pre = page.locator('.package-demo pre').first();
  await expect(pre).toContainText('"valid": false');

  const inputs = page.locator('.package-demo input');
  await inputs.nth(0).fill('Тимур');
  await inputs.nth(1).fill('timur@mail.ru');
  await inputs.nth(3).fill('secret123');
  await inputs.nth(4).fill('secret123');
  await expect(pre).toContainText('"valid": true');
});

test('английская версия: ошибки на английском', async ({ page }) => {
  await page.goto('/en/tinyval/');
  await expect(page.locator('.package-demo pre').first()).toContainText('"valid": false');
  await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
});
