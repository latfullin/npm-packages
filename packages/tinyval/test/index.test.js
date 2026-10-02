import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validate,
  validateAsync,
  parse,
  parseAsync,
  ValidationError,
  string,
  number,
  boolean,
  date,
  literal,
  oneOf,
  unknown,
  optional,
  nullable,
  object,
  array,
  transform,
  preprocess,
  pipe,
  check,
  checkAsync,
  minLength,
  maxLength,
  length,
  min,
  max,
  integer,
  pattern,
  email,
  sameAs,
  trim,
  toLowerCase,
  toUpperCase,
  coerce,
} from '../dist/index.js';

const user = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), toLowerCase(), email()),
  age: optional(pipe(coerce.number(), integer(), min(0), max(150))),
});

test('валидные данные: data очищены и преобразованы', () => {
  const r = validate(user, { name: '  Ivan ', email: ' IVAN@Mail.ru ', age: '30', extra: 1 });
  assert.equal(r.valid, true);
  assert.deepEqual(r.data, { name: 'Ivan', email: 'ivan@mail.ru', age: 30 });
  assert.deepEqual(r.errors, {});
});

test('ошибки по полям, первая ошибка на поле', () => {
  const r = validate(user, { name: 'I', email: 'bad', age: '-5' });
  assert.equal(r.valid, false);
  assert.equal(r.data, undefined);
  assert.deepEqual(r.errors, {
    name: 'Must be at least 2 long',
    email: 'Invalid email',
    age: 'Must be at least 0',
  });
});

test('undefined, null и пустая строка — обязательное поле', () => {
  const s = object({ a: string(), b: string(), c: string() });
  const r = validate(s, { b: null, c: '' });
  assert.deepEqual(r.errors, { a: 'Required', b: 'Required', c: 'Required' });
});

test('optional: пропуск, пустая строка и значение по умолчанию', () => {
  const s = object({ a: optional(string()), b: optional(string(), 'def'), c: optional(array(number()), () => []) });
  assert.deepEqual(validate(s, {}).data, { b: 'def', c: [] });
  assert.deepEqual(validate(s, { a: '', b: '' }).data, { b: 'def', c: [] });
  assert.deepEqual(validate(s, { a: 'x', b: 'y', c: [1] }).data, { a: 'x', b: 'y', c: [1] });
});

test('nullable', () => {
  const s = object({ a: nullable(string()) });
  assert.deepEqual(validate(s, { a: null }).data, { a: null });
  assert.equal(validate(s, {}).valid, false);
});

test('вложенные объекты и массивы: пути ошибок', () => {
  const s = object({
    address: object({ city: string() }),
    items: array(object({ name: string(), qty: pipe(number(), min(1)) })),
  });
  const r = validate(s, { address: {}, items: [{ name: 'a', qty: 1 }, { qty: 0 }] });
  assert.deepEqual(r.errors, {
    'address.city': 'Required',
    'items.1.name': 'Required',
    'items.1.qty': 'Must be at least 1',
  });
  assert.deepEqual(r.issues[0], { code: 'required', message: 'Required', path: ['address', 'city'], params: {} });
});

test('лишние поля: strip, strict, passthrough', () => {
  const shape = { a: string(), b: optional(string()) };
  assert.deepEqual(validate(object(shape), { a: 'x', z: 1 }).data, { a: 'x' });
  assert.deepEqual(validate(object(shape, { unknown: 'strict' }), { a: 'x', z: 1 }).errors, { z: 'Unknown field' });
  assert.deepEqual(validate(object(shape, { unknown: 'passthrough' }), { a: 'x', b: '', z: 1 }).data, {
    a: 'x',
    z: 1,
  });
});

test('не читает свойства из прототипа и безопасен к __proto__', () => {
  const s = object({ toString: optional(string()), constructor: string() }, { unknown: 'strict' });
  const input = JSON.parse('{"__proto__": {"polluted": 1}}');
  const r = validate(s, input);
  assert.deepEqual(r.errors.constructor, 'Required');
  assert.equal(r.errors.__proto__, 'Unknown field');
  assert.equal({}.polluted, undefined);
});

test('типы: number отклоняет NaN и Infinity, date — невалидную дату', () => {
  assert.equal(validate(number(), NaN).valid, false);
  assert.equal(validate(number(), Infinity).valid, false);
  assert.equal(validate(number(), 0).valid, true);
  assert.equal(validate(boolean(), false).valid, true);
  assert.equal(validate(date(), new Date('nope')).valid, false);
  assert.equal(validate(string(), 1).errors[''], 'Must be a string');
});

test('literal, oneOf, unknown', () => {
  assert.equal(validate(literal('a'), 'b').errors[''], 'Must be a');
  assert.equal(validate(oneOf(['a', 'b']), 'c').errors[''], 'Must be one of: a, b');
  assert.equal(validate(oneOf([1, 2]), 2).valid, true);
  assert.equal(validate(unknown(), undefined).valid, true);
});

test('проверки длины и формата', () => {
  assert.equal(validate(pipe(string(), maxLength(2)), 'abc').valid, false);
  assert.equal(validate(pipe(string(), length(3)), 'abc').valid, true);
  assert.equal(validate(pipe(array(number()), minLength(2)), [1]).valid, false);
  assert.equal(validate(pipe(string(), pattern(/^\d+$/g)), '12').valid, true);
  assert.equal(validate(pipe(string(), pattern(/^\d+$/g)), '12').valid, true);
  assert.equal(validate(pipe(string(), toUpperCase()), 'ab').data, 'AB');
});

test('опция all — все ошибки поля', () => {
  const s = pipe(string(), minLength(5), pattern(/^\d+$/));
  assert.equal(validate(s, 'ab').issues.length, 1);
  assert.equal(validate(s, 'ab', { all: true }).issues.length, 2);
});

test('sameAs и check с доступом к данным', () => {
  const s = object({
    password: string(),
    confirm: pipe(string(), sameAs('password')),
    start: number(),
    end: pipe(number(), check((v, { parent }) => v > parent.start, 'End must be after start')),
  });
  const r = validate(s, { password: 'a', confirm: 'b', start: 5, end: 1 });
  assert.deepEqual(r.errors, { confirm: 'Must match password', end: 'End must be after start' });
});

test('transform и preprocess', () => {
  assert.deepEqual(validate(transform(string(), (s) => s.split(',')), 'a,b').data, ['a', 'b']);
  assert.equal(validate(preprocess((v) => (v === 'x' ? 1 : v), number()), 'x').data, 1);
});

test('coerce', () => {
  assert.equal(validate(coerce.number(), ' 42 ').data, 42);
  assert.equal(validate(coerce.number(), 'abc').errors[''], 'Must be a number');
  assert.equal(validate(coerce.number(), '').errors[''], 'Required');
  assert.equal(validate(coerce.boolean(), 'on').data, true);
  assert.equal(validate(coerce.boolean(), '0').data, false);
  assert.equal(validate(coerce.boolean(), 'maybe').valid, false);
  assert.equal(validate(coerce.date(), '2026-10-02').data.getUTCFullYear(), 2026);
  assert.equal(validate(coerce.string(), 5).data, '5');
});

test('свои сообщения: строка с параметрами и функция', () => {
  assert.equal(validate(pipe(string(), minLength(3, 'Нужно {min}+')), 'a').errors[''], 'Нужно 3+');
  assert.equal(validate(pipe(number(), max(1, (p) => `≤ ${p.max}`)), 2).errors[''], '≤ 1');
  assert.equal(validate(string('Введите имя'), '').errors[''], 'Введите имя');
});

test('асинхронные проверки', async () => {
  const taken = ['a@a.ru'];
  const calls = [];
  const s = object({
    email: pipe(
      string(),
      email(),
      checkAsync(async (v) => {
        calls.push(v);
        return !taken.includes(v);
      }, 'Email занят'),
    ),
  });
  assert.throws(() => validate(s, { email: 'a@a.ru' }), /validateAsync/);
  assert.deepEqual((await validateAsync(s, { email: 'a@a.ru' })).errors, { email: 'Email занят' });
  assert.equal((await validateAsync(s, { email: 'b@b.ru' })).valid, true);
  // при синхронной ошибке асинхронная проверка не запускается
  calls.length = 0;
  await validateAsync(s, { email: 'bad' });
  assert.deepEqual(calls, []);
});

test('parse и parseAsync', async () => {
  assert.deepEqual(parse(user, { name: 'Ivan', email: 'a@a.ru' }), { name: 'Ivan', email: 'a@a.ru' });
  assert.throws(
    () => parse(user, { name: 'I', email: 'a@a.ru' }),
    (e) => e instanceof ValidationError && e.errors.name === 'Must be at least 2 long' && /name: /.test(e.message),
  );
  await assert.rejects(parseAsync(user, {}), ValidationError);
});
