import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tinyval-vue/');
});

test('отправка пустой формы показывает ошибки и фокусирует первое поле', async ({ page }) => {
  const form = page.locator('form.vue-demo');
  await form.locator('button[type=submit]').click();
  await expect(form.locator('.vue-demo__error').first()).toBeVisible();
  await expect(form.locator('input[name=name]')).toBeFocused();
});

test('ошибка с «сервера» попадает в поле', async ({ page }) => {
  const form = page.locator('form.vue-demo');
  await form.locator('input[name=name]').fill('Тимур');
  await form.locator('input[name=email]').fill('taken@mail.ru');
  await form.locator('input[name=password]').fill('secret123');
  await form.locator('input[name=confirm]').fill('secret123');
  await form.locator('button[type=submit]').click();
  await expect(form.getByText('Этот email уже зарегистрирован')).toBeVisible();
});

test('сброс очищает форму', async ({ page }) => {
  const form = page.locator('form.vue-demo');
  await form.locator('input[name=name]').fill('Тимур');
  await form.locator('button.secondary').click();
  await expect(form.locator('input[name=name]')).toHaveValue('');
});
