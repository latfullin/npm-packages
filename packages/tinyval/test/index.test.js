import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, required, string, number, minLength, max, email } from '../dist/index.js';

const schema = {
  name: [required(), string(), minLength(2)],
  email: [required(), email()],
  age: [number(), max(150)],
};

test('валидные данные', () => {
  const r = validate({ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }, schema);
  assert.equal(r.valid, true);
  assert.deepEqual(r.errors, {});
});

test('возвращает первую ошибку для каждого поля', () => {
  const r = validate({ name: 'I', email: 'bad', age: 200 }, schema);
  assert.equal(r.valid, false);
  assert.deepEqual(r.errors, {
    name: 'Минимум 2 символов',
    email: 'Некорректный email',
    age: 'Не больше 150',
  });
});

test('required срабатывает на пустые значения', () => {
  const r = validate({}, schema);
  assert.equal(r.errors.name, 'Обязательное поле');
  assert.equal(r.errors.email, 'Обязательное поле');
  assert.equal(r.errors.age, undefined);
});

test('кастомные сообщения', () => {
  const r = validate({ x: '' }, { x: [required('Заполните поле')] });
  assert.equal(r.errors.x, 'Заполните поле');
});
