import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tinyval-mask/');
});

const raw = (page: import('@playwright/test').Page, id: string) =>
  page.locator('.mask-demo__row').filter({ has: page.locator(`#mask-${id}`) }).locator('.mask-demo__raw');

test('телефон: маска при вводе, значение без маски', async ({ page }) => {
  const input = page.locator('#mask-phone');
  await input.click();
  await input.pressSequentially('9991234567');
  await expect(input).toHaveValue('+7 (999) 123-45-67');
  await expect(raw(page, 'phone')).toContainText('"79991234567"');
  await expect(raw(page, 'phone')).toContainText('✓');
  await expect(page.locator('.mask-demo__country')).toContainText('Россия');
});

test('телефон: вставленный номер с 8 в начале — это +7', async ({ page }) => {
  const input = page.locator('#mask-phone');
  await input.fill('89991234567');
  await expect(input).toHaveValue('+7 (999) 123-45-67');
});

test('телефон: страна определяется по коду', async ({ page }) => {
  const input = page.locator('#mask-phone');
  await input.click();
  await input.pressSequentially('+375291234567');
  await expect(input).toHaveValue('+375 (29) 123-45-67');
  await expect(page.locator('.mask-demo__country')).toContainText('Беларусь');
  await expect(raw(page, 'phone')).toContainText('"375291234567"');
});

test('телефон: Backspace стирает цифры, а не разделители', async ({ page }) => {
  const input = page.locator('#mask-phone');
  await input.click();
  await input.pressSequentially('9991234');
  await input.press('Backspace');
  await input.press('Backspace');
  await expect(raw(page, 'phone')).toContainText('"799912"');
});

test('карта: группы по 4, платёжная система, проверка Луна', async ({ page }) => {
  const input = page.locator('#mask-card');
  await input.click();
  await input.pressSequentially('4111111111111111');
  await expect(input).toHaveValue('4111 1111 1111 1111');
  await expect(page.locator('.mask-demo__brand')).toHaveText('visa');
  await expect(raw(page, 'card')).toContainText('✓');
});

test('дата: несуществующая дата помечается', async ({ page }) => {
  const input = page.locator('#mask-date');
  await input.click();
  await input.pressSequentially('31022024');
  await expect(input).toHaveValue('31.02.2024');
  await expect(raw(page, 'date')).toContainText('✗');
});

test('лишние символы не вводятся', async ({ page }) => {
  const input = page.locator('#mask-phone');
  await input.click();
  await input.pressSequentially('99a9');
  await expect(raw(page, 'phone')).toContainText('"7999"');
});
