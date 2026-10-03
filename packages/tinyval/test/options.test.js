import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validate,
  validateAsync,
  parse,
  ValidationError,
  object,
  array,
  string,
  number,
  optional,
  pipe,
  minLength,
  min,
  integer,
  checkAsync,
  coerce,
  lazy,
  label,
  fallback,
} from '../dist/index.js';
import ru from '../dist/locales/ru.js';
import zh from '../dist/locales/zh.js';

const User = object({ name: pipe(string(), minLength(3)), age: pipe(number(), min(18)) });

test('сообщения для одного вызова не меняют глобальные', () => {
  assert.deepEqual(validate(User, { name: 'a', age: 1 }, { messages: ru }).errors, {
    name: 'Минимум 3 символа',
    age: 'Не меньше 18',
  });
  assert.equal(validate(User, { name: 'a', age: 20 }).errors.name, 'Must be at least 3 characters long');
});

test('параллельные запросы на разных языках не мешают друг другу', async () => {
  const s = object({ email: pipe(string(), checkAsync(async () => false)) });
  const [a, b] = await Promise.all([
    validateAsync(s, { email: 'x' }, { messages: ru }),
    validateAsync(s, { email: 'x' }, { messages: zh }),
  ]);
  assert.equal(a.errors.email, 'Некорректное значение');
  assert.equal(b.errors.email, '无效的值');
});

test('частичные сообщения вызова дополняются глобальными', () => {
  const r = validate(User, { age: 1 }, { messages: { required: 'Нужно заполнить' } });
  assert.deepEqual(r.errors, { name: 'Нужно заполнить', age: 'Must be at least 18' });
});

test('params в ошибках — для перевода на клиенте', () => {
  const r = validate(User, { name: 'a', age: 1 });
  assert.deepEqual(
    r.issues.map(({ code, params }) => ({ code, params })),
    [
      { code: 'minLength', params: { min: 3 } },
      { code: 'min', params: { min: 18 } },
    ],
  );
});

test('label: название поля в сообщении', () => {
  const s = object({
    email: label(string(), 'Почта'),
    age: label(pipe(number(), min(18)), 'Возраст'),
    city: string(),
  });
  const messages = { required: 'Поле «{label}» обязательно', min: '{label}: не меньше {min}' };
  assert.deepEqual(validate(s, { age: 5 }, { messages }).errors, {
    email: 'Поле «Почта» обязательно',
    age: 'Возраст: не меньше 18',
    city: 'Поле «city» обязательно',
  });
});

test('labels в опциях — для разных языков', () => {
  const r = validate(object({ address: object({ city: string() }) }), { address: {} }, {
    messages: { required: '{label} is required' },
    labels: { 'address.city': 'City' },
  });
  assert.deepEqual(r.errors, { 'address.city': 'City is required' });
});

test('label работает и для асинхронных проверок', async () => {
  const s = object({ email: label(pipe(string(), checkAsync(async () => false, '{label} занят')), 'Email') });
  assert.deepEqual((await validateAsync(s, { email: 'a' })).errors, { email: 'Email занят' });
});

test('label не переходит на вложенные поля', () => {
  const s = label(object({ name: string() }), 'Профиль');
  assert.equal(validate(s, {}, { messages: { required: '{label}' } }).errors.name, 'name');
});

test('lazy: рекурсивное дерево', () => {
  const Category = object({ name: string(), children: optional(array(lazy(() => Category)), () => []) });
  const tree = { name: 'root', children: [{ name: 'a', children: [{ name: 'b' }, { children: [] }] }] };
  const r = validate(Category, tree);
  assert.deepEqual(r.errors, { 'children.0.children.1.name': 'Required' });
  assert.deepEqual(validate(Category, { name: 'x' }).data, { name: 'x', children: [] });
});

test('lazy: слишком глубокие данные — ошибка, а не падение', () => {
  const Node = object({ next: optional(lazy(() => Node)) });
  let deep = {};
  for (let i = 0; i < 100_000; i++) deep = { next: deep };
  const r = validate(Node, deep);
  assert.equal(r.valid, false);
  assert.equal(r.issues[0].code, 'depth');
  // корень — обычный object, дальше 256 уровней lazy; ошибка на 257-м
  assert.equal(r.issues[0].path.length, 257);
  assert.equal(validate(Node, { next: { next: {} } }, { maxDepth: 1 }).issues[0].message, 'Too deeply nested (max 1)');
});

test('fallback: значение при ошибке', () => {
  const Query = object({
    page: fallback(pipe(coerce.number(), integer(), min(1)), 1),
    sort: fallback(string(), (input) => (input === undefined ? 'date' : 'name')),
  });
  assert.deepEqual(validate(Query, { page: 'abc' }).data, { page: 1, sort: 'date' });
  assert.deepEqual(validate(Query, { page: '3', sort: 5 }).data, { page: 3, sort: 'name' });
  assert.deepEqual(validate(Query, {}).data, { page: 1, sort: 'date' });
});

test('fallback не скрывает асинхронные ошибки', async () => {
  const s = fallback(pipe(string(), checkAsync(async () => false, 'No')), 'x');
  assert.deepEqual((await validateAsync(s, 'a')).errors, { '': 'No' });
});

test('parse принимает опции', () => {
  assert.throws(
    () => parse(User, {}, { messages: ru }),
    (e) => e instanceof ValidationError && e.errors.name === 'Обязательное поле',
  );
});

test('Standard Schema использует глобальные сообщения', () => {
  assert.deepEqual(User['~standard'].validate({ age: 20 }), { issues: [{ message: 'Required', path: ['name'] }] });
});
