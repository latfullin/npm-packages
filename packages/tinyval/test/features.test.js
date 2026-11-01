import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validate,
  validateAsync,
  flatten,
  createSchema,
  fail,
  object,
  string,
  number,
  boolean,
  literal,
  optional,
  pipe,
  minLength,
  email,
  checkAsync,
  partial,
  pick,
  omit,
  extend,
  union,
  variant,
  record,
  tuple,
  enumOf,
} from '../dist/index.js';

const User = object({
  name: pipe(string(), minLength(2)),
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8)),
});

test('partial: все поля необязательные', () => {
  const Update = partial(User);
  assert.deepEqual(validate(Update, {}).data, {});
  assert.deepEqual(validate(Update, { name: 'Ivan' }).data, { name: 'Ivan' });
  assert.deepEqual(validate(Update, { name: 'I' }).errors, { name: 'Must be at least 2 characters long' });
});

test('partial: только перечисленные поля', () => {
  const s = partial(User, ['password']);
  assert.deepEqual(validate(s, { email: 'a@a.ru' }).errors, { name: 'Required' });
});

test('pick и omit', () => {
  assert.deepEqual(validate(pick(User, ['email']), { email: 'a@a.ru', name: 'x' }).data, { email: 'a@a.ru' });
  assert.deepEqual(validate(omit(User, ['password']), { name: 'Ivan', email: 'a@a.ru', password: '1' }).data, {
    name: 'Ivan',
    email: 'a@a.ru',
  });
});

test('extend: новые поля и замена существующих', () => {
  const Admin = extend(User, { role: literal('admin'), name: string() });
  const r = validate(Admin, { name: 'I', email: 'a@a.ru', password: '12345678', role: 'admin' });
  assert.equal(r.valid, true);
  assert.equal(validate(Admin, { name: 'Ivan', email: 'a@a.ru', password: '12345678' }).errors.role, 'Required');
});

test('операции сохраняют опции объекта', () => {
  const Strict = object({ a: string(), b: string() }, { unknown: 'strict' });
  assert.deepEqual(validate(pick(Strict, ['a']), { a: 'x', b: 'y' }).errors, { b: 'Unknown field' });
});

test('union', () => {
  const id = union([number(), pipe(string(), minLength(3))]);
  assert.equal(validate(id, 5).data, 5);
  assert.equal(validate(id, 'abc').data, 'abc');
  assert.equal(validate(id, 'ab').errors[''], 'Does not match any allowed type');
  assert.equal(validate(id, '').errors[''], 'Required');
});

test('union с асинхронной проверкой', async () => {
  const s = union([number(), pipe(string(), checkAsync(async (v) => v !== 'taken', 'Taken'))]);
  assert.equal((await validateAsync(s, 'free')).valid, true);
  assert.deepEqual((await validateAsync(s, 'taken')).errors, { '': 'Taken' });
});

test('variant: ошибки выбранного варианта и неизвестный тип', () => {
  const Payment = variant('type', [
    object({ type: literal('card'), number: string() }),
    object({ type: literal('invoice'), inn: string() }),
  ]);
  assert.deepEqual(validate(Payment, { type: 'invoice', inn: '7700000000' }).data, { type: 'invoice', inn: '7700000000' });
  assert.deepEqual(validate(Payment, { type: 'card' }).errors, { number: 'Required' });
  assert.deepEqual(validate(Payment, { type: 'cash' }).errors, { type: 'Unknown type, expected one of: card, invoice' });
  assert.deepEqual(validate(Payment, {}).errors, { type: 'Required' });
});

test('record', () => {
  assert.deepEqual(validate(record(number()), { a: 1, b: 2 }).data, { a: 1, b: 2 });
  assert.deepEqual(validate(record(number()), { a: 1, b: 'x' }).errors, { b: 'Must be a number' });
  const prices = record(pipe(string(), minLength(3)), number());
  assert.deepEqual(validate(prices, { ab: 1 }).errors, { ab: 'Must be at least 3 characters long' });
  const r = validate(record(number()), JSON.parse('{"__proto__": 1}'));
  assert.equal(r.valid, true);
  assert.equal(Object.getPrototypeOf(r.data), Object.prototype);
  assert.equal(r.data.__proto__, 1);
});

test('tuple', () => {
  const point = tuple([number(), number()]);
  assert.deepEqual(validate(point, [1, 2]).data, [1, 2]);
  assert.deepEqual(validate(point, [1]).errors, { '': 'Must have exactly 2 items' });
  assert.deepEqual(validate(point, [1, 'x']).errors, { 1: 'Must be a number' });
});

test('enumOf: строковые и числовые enum, объекты as const', () => {
  // так TypeScript компилирует enum Role { Admin = 'admin', User = 'user' } и enum Level { Low, High }
  const Role = { Admin: 'admin', User: 'user' };
  const Level = { 0: 'Low', 1: 'High', Low: 0, High: 1 };
  assert.equal(validate(enumOf(Role), 'admin').valid, true);
  assert.equal(validate(enumOf(Role), 'Admin').errors[''], 'Must be one of: admin, user');
  assert.equal(validate(enumOf(Level), 1).valid, true);
  assert.equal(validate(enumOf(Level), 'Low').valid, false);
});

test('flatten: все ошибки по полям, как в Laravel', () => {
  const s = object({ code: pipe(string(), minLength(5), email()) });
  const r = validate(s, { code: 'ab', x: 1 }, { all: true });
  assert.deepEqual(flatten(r.issues), { code: ['Must be at least 5 characters long', 'Invalid email'] });
});

test('Standard Schema', async () => {
  const std = User['~standard'];
  assert.equal(std.version, 1);
  assert.equal(std.vendor, 'tinyval');
  assert.deepEqual(std.validate({ name: 'Ivan', email: 'a@a.ru', password: '12345678' }), {
    value: { name: 'Ivan', email: 'a@a.ru', password: '12345678' },
  });
  assert.deepEqual(std.validate({ name: 'Ivan', email: 'bad', password: '12345678' }), {
    issues: [{ message: 'Invalid email', path: ['email'] }],
  });
  const asyncSchema = pipe(string(), checkAsync(async () => false, 'No'));
  const res = asyncSchema['~standard'].validate('x');
  assert.ok(res instanceof Promise);
  assert.deepEqual(await res, { issues: [{ message: 'No', path: [] }] });
});

test('createSchema: своя схема со Standard Schema', () => {
  const even = createSchema((v, ctx, path) => (typeof v === 'number' && v % 2 === 0 ? v : fail(ctx, path, 'even', 'Must be even')));
  assert.equal(validate(even, 3).errors[''], 'Must be even');
  assert.deepEqual(even['~standard'].validate(4), { value: 4 });
  assert.equal(validate(object({ n: even, ok: boolean() }), { n: 2, ok: true }).valid, true);
  assert.equal(validate(optional(even), undefined).valid, true);
});
