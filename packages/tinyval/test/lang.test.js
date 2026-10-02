// Свой lang-файл: команда tinyval lang, тексты для полей, setLabels. Отдельный файл — меняет глобальные сообщения
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validate, setMessages, setLabels, object, array, string, pipe, minLength, email } from '../dist/index.js';

const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const run = (cwd, ...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf-8' });

test('tinyval lang: создаёт .ts с типом Messages', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tinyval-'));
  const r = run(dir, 'lang', 'ru');
  assert.equal(r.status, 0);
  const text = fs.readFileSync(path.join(dir, 'lang/tinyval/ru.ts'), 'utf-8');
  assert.match(text, /import type \{ Messages \} from 'tinyval';/);
  assert.match(text, /required: 'Обязательное поле',/);
  assert.match(text, /\} satisfies Messages;/);
  assert.match(text, /import messages from '\.\/lang\/tinyval\/ru';/);
});

test('tinyval lang: .js в своей папке, файл работает с setMessages', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tinyval-'));
  assert.equal(run(dir, 'lang', 'en', '--js', '--out', 'src/i18n').status, 0);
  const file = path.join(dir, 'src/i18n/en.js');
  const edited = fs.readFileSync(file, 'utf-8').replace("required: 'Required'", "required: 'Please fill in {label}'");
  fs.writeFileSync(file, edited);
  const { default: messages } = await import(pathToFileURL(file).href);
  setMessages(messages);
  assert.equal(validate(object({ name: string() }), {}).errors.name, 'Please fill in name');
});

test('tinyval lang: не перезаписывает без --force, ошибки ввода', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tinyval-'));
  assert.equal(run(dir, 'lang', 'zh').status, 0);
  const again = run(dir, 'lang', 'zh');
  assert.equal(again.status, 1);
  assert.match(again.stderr, /already exists/);
  assert.equal(run(dir, 'lang', 'zh', '--force').status, 0);
  const unknown = run(dir, 'lang', 'xx');
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown locale "xx"/);
  assert.match(run(dir, '--help').stdout, /Usage: npx tinyval lang/);
});

test('текст для конкретного поля и для элементов массива', () => {
  setMessages({
    required: 'Обязательно',
    'email.required': 'Укажите почту',
    'items.*.title.minLength': 'Название позиции — минимум {min} символа',
  });
  const s = object({
    email: pipe(string(), email()),
    name: string(),
    items: array(object({ title: pipe(string(), minLength(3)) })),
  });
  assert.deepEqual(validate(s, { items: [{ title: 'ok!' }, { title: 'a' }] }).errors, {
    email: 'Укажите почту',
    name: 'Обязательно',
    'items.1.title': 'Название позиции — минимум 3 символа',
  });
});

test('приоритет: схема → поле в вызове → поле глобально → код в вызове → код глобально', () => {
  setMessages({ 'code.required': 'глобально для поля' });
  const s = object({ code: string(), other: string(), custom: string('из схемы') });
  const r = validate(s, {}, { messages: { required: 'вызов', 'other.required': 'вызов для поля' } });
  assert.deepEqual(r.errors, { code: 'глобально для поля', other: 'вызов для поля', custom: 'из схемы' });
});

test('setLabels: названия полей для всего приложения', () => {
  setMessages({ required: '{label}: обязательно' });
  // phone, а не email: для email.required выше задан свой текст, и он важнее общего
  setLabels({ phone: 'Телефон', 'items.*.title': 'Название' });
  const s = object({ phone: string(), items: array(object({ title: string() })) });
  assert.deepEqual(validate(s, { items: [{}] }).errors, { phone: 'Телефон: обязательно', 'items.0.title': 'Название: обязательно' });
  assert.equal(validate(s, { items: [{}] }, { labels: { phone: 'Мобильный' } }).errors.phone, 'Мобильный: обязательно');
});

test('ключи из данных не читают прототип сообщений', () => {
  setMessages({ required: 'Обязательно' });
  const s = object({ constructor: string(), toString: string() });
  assert.deepEqual(validate(s, {}).errors, { constructor: 'Обязательно', toString: 'Обязательно' });
});
