import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validate,
  interpolate,
  object,
  array,
  string,
  number,
  date,
  coerce,
  oneOf,
  pipe,
  minLength,
  maxLength,
  length,
  between,
  url,
  uuid,
  startsWith,
  endsWith,
  includes,
  unique,
  minDate,
  maxDate,
  after,
  before,
  inn,
  snils,
  luhn,
  isInn,
  isSnils,
  isLuhn,
  requiredIf,
  requiredUnless,
  requiredWith,
  requiredWithout,
  prohibitedIf,
  file,
  brand,
} from '../dist/index.js';
import ru from '../dist/locales/ru.js';
import zh from '../dist/locales/zh.js';

const err = (schema, value, opts) => validate(schema, value, opts).errors[''];

test('склонения: английский, русский, китайский', () => {
  const s = (n) => pipe(string(), minLength(n));
  assert.equal(err(s(1), 'a'), undefined);
  assert.equal(err(s(2), 'a'), 'Must be at least 2 characters long');
  assert.equal(err(pipe(string(), maxLength(1)), 'ab'), 'Must be at most 1 character long');
  const forms = { 1: 'символ', 2: 'символа', 4: 'символа', 5: 'символов', 11: 'символов', 21: 'символ', 22: 'символа', 111: 'символов' };
  for (const [n, word] of Object.entries(forms)) {
    const max = Number(n);
    assert.equal(err(pipe(string(), maxLength(max)), 'x'.repeat(max + 1), { messages: ru }), `Максимум ${n} ${word}`);
  }
  assert.equal(err(s(3), 'a', { messages: zh }), '至少需要 3 个字符');
});

test('interpolate: формы слова, неизвестный язык, отсутствующий параметр', () => {
  assert.equal(interpolate('{n} {n|файл|файла|файлов}', { n: 3 }, 'ru'), '3 файла');
  assert.equal(interpolate('{n} {n|file|files}', { n: 1 }, 'en'), '1 file');
  assert.equal(interpolate('{n|file|files}', { n: 2 }, 'xx-invalid-locale'), 'files');
  assert.equal(interpolate('{x|a|b}', {}, 'en'), '{x|a|b}');
});

test('длина: у строк символы, у массивов элементы', () => {
  const tags = pipe(array(string()), minLength(2));
  assert.equal(err(tags, ['a']), 'Must have at least 2 items');
  assert.equal(validate(tags, ['a']).issues[0].code, 'minItems');
  assert.equal(err(tags, ['a'], { messages: ru }), 'Минимум 2 элемента');
  assert.equal(err(pipe(array(string()), maxLength(1)), ['a', 'b']), 'Must have at most 1 item');
  assert.equal(err(pipe(array(string()), length(3)), ['a']), 'Must have exactly 3 items');
  assert.equal(validate(pipe(string(), minLength(2)), 'a').issues[0].code, 'minLength');
});

test('requiredIf / requiredUnless', () => {
  const Order = object({
    delivery: oneOf(['pickup', 'courier', 'post']),
    address: requiredIf({ delivery: ['courier', 'post'] }, string()),
    pickupPoint: requiredUnless({ delivery: ['courier', 'post'] }, string()),
  });
  assert.deepEqual(validate(Order, { delivery: 'courier', address: '' }).errors, { address: 'Required' });
  assert.deepEqual(validate(Order, { delivery: 'pickup' }).errors, { pickupPoint: 'Required' });
  assert.deepEqual(validate(Order, { delivery: 'pickup', pickupPoint: 'A1' }).data, { delivery: 'pickup', pickupPoint: 'A1' });
  assert.deepEqual(validate(Order, { delivery: 'post', address: 5 }).errors, { address: 'Must be a string' }, 'если передано — проверяется');
});

test('условие-функция и вложенные поля', () => {
  const s = object({
    company: object({ type: oneOf(['person', 'org']) }),
    inn: requiredIf(({ parent }) => parent.company?.type === 'org', pipe(string(), inn())),
    kpp: requiredIf({ 'company.type': 'org' }, string()),
  });
  assert.deepEqual(validate(s, { company: { type: 'org' } }).errors, { inn: 'Required', kpp: 'Required' });
  assert.equal(validate(s, { company: { type: 'person' } }).valid, true);
});

test('requiredWith / requiredWithout', () => {
  const Contact = object({
    phone: requiredWithout(['email'], string()),
    email: requiredWithout(['phone'], string()),
    passwordConfirm: requiredWith(['password'], string()),
    password: requiredWith([], string()),
  });
  assert.deepEqual(validate(Contact, {}).errors, { phone: 'Required', email: 'Required' });
  assert.equal(validate(Contact, { email: 'a@a.ru' }).valid, true);
  assert.deepEqual(validate(Contact, { email: 'a@a.ru', password: 'x' }).errors, { passwordConfirm: 'Required' });
});

test('prohibitedIf', () => {
  const s = object({
    type: oneOf(['free', 'paid']),
    price: prohibitedIf({ type: 'free' }, coerce.number()),
  });
  assert.deepEqual(validate(s, { type: 'free', price: '10' }).errors, { price: 'Must be empty' });
  assert.deepEqual(validate(s, { type: 'free', price: '' }).data, { type: 'free' });
  assert.deepEqual(validate(s, { type: 'paid', price: '10' }).data, { type: 'paid', price: 10 });
  assert.equal(validate(s, { type: 'free', price: '1' }, { messages: ru }).errors.price, 'Поле должно быть пустым');
});

test('строки: url, uuid, startsWith, endsWith, includes', () => {
  assert.equal(err(pipe(string(), url()), 'https://example.com/a?b=1'), undefined);
  assert.equal(err(pipe(string(), url()), 'example.com'), 'Invalid URL');
  assert.equal(err(pipe(string(), url()), 'javascript:alert(1)'), 'Invalid URL', 'опасные схемы не пропускаются');
  assert.equal(err(pipe(string(), url(undefined, ['ftp'])), 'ftp://files.example.com'), undefined);
  assert.equal(err(pipe(string(), uuid()), '550e8400-e29b-41d4-a716-446655440000'), undefined);
  assert.equal(err(pipe(string(), uuid()), '550e8400'), 'Invalid UUID');
  assert.equal(err(pipe(string(), startsWith('+7')), '8999'), 'Must start with "+7"');
  assert.equal(err(pipe(string(), endsWith('.ru')), 'a@b.com'), 'Must end with ".ru"');
  assert.equal(err(pipe(string(), includes('@')), 'ab'), 'Must contain "@"');
});

test('числа и массивы: between, unique', () => {
  assert.equal(err(pipe(number(), between(1, 5)), 7), 'Must be between 1 and 5');
  assert.equal(err(pipe(number(), between(1, 5)), 5), undefined);
  assert.equal(err(pipe(array(string()), unique()), ['a', 'b', 'a']), 'Must not contain duplicates');
  assert.equal(err(pipe(array(string()), unique()), ['a', 'b']), undefined);
  const users = pipe(array(object({ email: string() })), unique((u) => u.email.toLowerCase()));
  assert.equal(err(users, [{ email: 'A@a.ru' }, { email: 'a@a.ru' }]), 'Must not contain duplicates');
  assert.equal(err(pipe(array(unknownObj()), unique()), [{ a: 1 }, { a: 1 }]), 'Must not contain duplicates', 'объекты сравниваются по содержимому');
});

function unknownObj() {
  return object({ a: number() });
}

test('даты: minDate, maxDate, after, before', () => {
  assert.equal(err(pipe(coerce.date(), minDate('2026-01-01')), '2025-12-31'), 'Must be on or after 2026-01-01');
  assert.equal(err(pipe(coerce.date(), maxDate('2026-01-01')), '2026-01-01'), undefined);
  const future = pipe(coerce.date(), minDate(() => new Date()));
  assert.equal(validate(future, '2000-01-01').issues[0].params.date, new Date().toISOString().slice(0, 10), 'дата считается при проверке');
  const Period = object({ start: coerce.date(), end: pipe(coerce.date(), after('start')) });
  assert.deepEqual(validate(Period, { start: '2026-05-10', end: '2026-05-01' }).errors, { end: 'Must be after start' });
  assert.equal(validate(Period, { start: '2026-05-10', end: '2026-05-11' }).valid, true);
  assert.deepEqual(validate(Period, { start: 'bad', end: '2026-05-11' }).errors, { start: 'Must be a valid date' }, 'ошибку соседнего поля показывает его схема');
  const B = object({ from: pipe(date(), before('to')), to: date() });
  assert.equal(validate(B, { from: new Date('2026-02-01'), to: new Date('2026-01-01') }).errors.from, 'Must be before to');
});

test('контрольные суммы: ИНН, СНИЛС, карта', () => {
  for (const v of ['7707083893', '500100732259', '7728168971']) assert.equal(isInn(v), true, v);
  for (const v of ['7707083894', '500100732258', '123', '77070838931', 'abcdefghij']) assert.equal(isInn(v), false, v);
  for (const v of ['112-233-445 95', '11223344595']) assert.equal(isSnils(v), true, v);
  for (const v of ['112-233-445 96', '1122334459']) assert.equal(isSnils(v), false, v);
  for (const v of ['4111 1111 1111 1111', '5555555555554444', '378282246310005', '2200 0000 0000 0004']) assert.equal(isLuhn(v), true, v);
  for (const v of ['4111 1111 1111 1112', '1234', '4111-1111-1111-111x']) assert.equal(isLuhn(v), false, v);
  assert.equal(err(pipe(string(), inn()), '7707083894', { messages: ru }), 'Некорректный ИНН');
  assert.equal(err(pipe(string(), snils()), '11223344596'), 'Invalid SNILS');
  assert.equal(err(pipe(string(), luhn()), '4111111111111112'), 'Invalid card number');
});

test('file: размер и тип', () => {
  const avatar = file({ maxSize: 1024, types: ['image/*', '.pdf'] });
  const png = new File(['x'.repeat(100)], 'me.png', { type: 'image/png' });
  const pdf = new File(['x'], 'doc.PDF', { type: '' });
  const big = new File(['x'.repeat(3000)], 'big.png', { type: 'image/png' });
  const txt = new File(['x'], 'a.txt', { type: 'text/plain' });
  assert.equal(validate(avatar, png).data, png);
  assert.equal(validate(avatar, pdf).valid, true, 'расширение без учёта регистра');
  assert.equal(err(avatar, big), 'File must be at most 1 KB');
  assert.equal(validate(avatar, big).issues[0].params.size, '2.9 KB');
  assert.equal(err(avatar, txt), 'File type must be one of: image/*, .pdf');
  assert.equal(err(avatar, 'not a file'), 'Must be a file');
  assert.equal(err(avatar, null), 'Required');
  assert.equal(err(file({ maxSize: 2 * 1024 * 1024 }), big, { messages: ru }), undefined);
  assert.equal(err(file({ maxSize: 1536 }), big, { messages: ru }), 'Файл не больше 1.5 KB');
  const gallery = pipe(array(file({ types: ['image/*'] })), maxLength(2));
  assert.equal(err(gallery, [png, png, png]), 'Must have at most 2 items');
});

test('brand не меняет значение', () => {
  const UserId = brand(pipe(string(), uuid()), 'UserId');
  const id = '550e8400-e29b-41d4-a716-446655440000';
  assert.equal(validate(UserId, id).data, id);
});
