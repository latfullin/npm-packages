// Отдельный файл: setMessages меняет глобальное состояние, а node --test запускает файлы в разных процессах
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, setMessages, object, string, pipe, minLength } from '../dist/index.js';
import ru from '../dist/locales/ru.js';

test('русская локализация через setMessages', () => {
  setMessages(ru);
  const r = validate(object({ a: string(), b: pipe(string(), minLength(3)) }), { b: 'x' });
  assert.deepEqual(r.errors, { a: 'Обязательное поле', b: 'Минимум 3 символа' });
});

test('частичное переопределение сообщений', () => {
  setMessages({ required: 'Заполните поле' });
  assert.equal(validate(string(), '').errors[''], 'Заполните поле');
});

test('китайская локализация и возврат к английской', async () => {
  const { default: zh } = await import('../dist/locales/zh.js');
  const { default: en } = await import('../dist/locales/en.js');
  setMessages(zh);
  assert.equal(validate(pipe(string(), minLength(3)), 'x').errors[''], '至少需要 3 个字符');
  setMessages(en);
  assert.equal(validate(string(), '').errors[''], 'Required');
});
