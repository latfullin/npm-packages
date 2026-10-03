import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validate,
  validateAsync,
  object,
  array,
  tuple,
  record,
  string,
  number,
  oneOf,
  optional,
  pipe,
  minLength,
  length,
  pattern,
  uuid,
  inn,
  checkAsync,
  lazy,
} from '../dist/index.js';

test('lazy: схема по значению', () => {
  const id = lazy((v) => (typeof v === 'number' ? number() : pipe(string(), uuid())));
  assert.equal(validate(id, 42).valid, true);
  assert.equal(validate(id, '550e8400-e29b-41d4-a716-446655440000').valid, true);
  assert.equal(validate(id, 'abc').errors[''], 'Invalid UUID');
});

test('lazy: схема по соседним полям', () => {
  const Company = object({
    type: oneOf(['person', 'org']),
    inn: lazy((_, { parent }) => pipe(string(), length(parent.type === 'org' ? 10 : 12), inn())),
    kpp: lazy((_, { parent }) => (parent.type === 'org' ? pipe(string(), pattern(/^\d{4}[\dA-Z]{2}\d{3}$/)) : optional(string()))),
  });
  assert.equal(validate(Company, { type: 'org', inn: '7707083893', kpp: '773601001' }).valid, true);
  assert.deepEqual(validate(Company, { type: 'org', inn: '500100732259' }).errors, {
    inn: 'Must be exactly 10 characters long',
    kpp: 'Required',
  });
  assert.equal(validate(Company, { type: 'person', inn: '500100732259' }).valid, true);
});

test('lazy: функция получает root и вызывается при каждой проверке', () => {
  let calls = 0;
  const s = object({
    currency: string(),
    items: array(object({ price: lazy((_, { root }) => (calls++, root.currency === 'JPY' ? pipe(number()) : number())) })),
  });
  validate(s, { currency: 'JPY', items: [{ price: 1 }, { price: 2 }] });
  validate(s, { currency: 'USD', items: [{ price: 1 }] });
  assert.equal(calls, 3);
});

test('lazy: рекурсия по-прежнему работает', () => {
  const Node = object({ name: string(), children: optional(array(lazy(() => Node))) });
  assert.deepEqual(validate(Node, { name: 'a', children: [{ name: 'b', children: [{}] }] }).errors, {
    'children.0.children.0.name': 'Required',
  });
});

const Big = object({
  a: string(),
  b: pipe(string(), minLength(5)),
  nested: object({ c: number(), d: number() }),
  list: array(number()),
});

test('abortEarly: остановка на первой ошибке', () => {
  const input = { b: 'x', nested: {}, list: ['x', 'y'] };
  assert.equal(validate(Big, input).issues.length, 6, 'a, b, nested.c, nested.d, list.0, list.1');
  const r = validate(Big, input, { abortEarly: true });
  assert.equal(r.valid, false);
  assert.deepEqual(r.errors, { a: 'Required' });
  assert.equal(r.issues.length, 1);
});

test('abortEarly: первая ошибка во вложенных объектах и массивах', () => {
  assert.deepEqual(validate(Big, { a: 'x', b: 'hello', nested: { c: 1 }, list: ['x'] }, { abortEarly: true }).errors, {
    'nested.d': 'Required',
  });
  assert.deepEqual(validate(Big, { a: 'x', b: 'hello', nested: { c: 1, d: 2 }, list: [1, 'x', 'y'] }, { abortEarly: true }).errors, {
    'list.1': 'Must be a number',
  });
  assert.equal(validate(tuple([number(), number()]), ['x', 'y'], { abortEarly: true }).issues.length, 1);
  assert.equal(validate(record(number()), { a: 'x', b: 'y' }, { abortEarly: true }).issues.length, 1);
  assert.equal(validate(object({ a: string() }, { unknown: 'strict' }), { a: 'x', z: 1, y: 2 }, { abortEarly: true }).issues.length, 1);
});

test('abortEarly важнее all и не меняет успешный результат', () => {
  const s = pipe(string(), minLength(5), pattern(/^\d+$/));
  assert.equal(validate(s, 'ab', { all: true, abortEarly: true }).issues.length, 1);
  assert.deepEqual(validate(Big, { a: 'x', b: 'hello', nested: { c: 1, d: 2 }, list: [1] }, { abortEarly: true }).data, {
    a: 'x',
    b: 'hello',
    nested: { c: 1, d: 2 },
    list: [1],
  });
});

test('abortEarly: асинхронные проверки после ошибки не запускаются', async () => {
  let called = false;
  const s = object({
    a: string(),
    b: pipe(string(), checkAsync(async () => ((called = true), true))),
  });
  const r = await validateAsync(s, { b: 'x' }, { abortEarly: true });
  assert.deepEqual(r.errors, { a: 'Required' });
  assert.equal(called, false);
});
