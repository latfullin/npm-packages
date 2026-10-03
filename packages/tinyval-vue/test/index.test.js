import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextTick } from 'vue';
import { useForm } from '../dist/index.js';
import { object, array, string, optional, pipe, trim, minLength, email, checkAsync, coerce, min } from 'tinyval';
import ru from 'tinyval/locales/ru';

const Signup = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), email()),
  age: optional(pipe(coerce.number(), min(18))),
});

const initial = () => ({ name: '', email: '', age: '' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('начальное состояние: ошибки есть, но не показываются', () => {
  const init = initial();
  const form = useForm(Signup, { initial: init });
  form.values.name = 'x';
  assert.equal(init.name, '', 'initial не меняется');
  assert.equal(form.valid, false);
  assert.deepEqual(form.errors, {});
  assert.deepEqual(Object.keys(form.allErrors).sort(), ['email', 'name']);
});

test('mode blur: ошибка поля появляется после touch и исчезает после исправления', async () => {
  const form = useForm(Signup, { initial: initial() });
  form.touch('name');
  assert.deepEqual(form.errors, { name: 'Required' });
  form.values.name = 'Ivan';
  await nextTick();
  assert.deepEqual(form.errors, {});
});

test('mode input — сразу при вводе, mode submit — только после отправки', async () => {
  const input = useForm(Signup, { initial: initial(), mode: 'input' });
  input.values.email = 'bad';
  await nextTick();
  assert.deepEqual(input.errors, { email: 'Invalid email' });

  const submit = useForm(Signup, { initial: initial(), mode: 'submit' });
  submit.values.email = 'bad';
  submit.touch('email');
  await nextTick();
  assert.deepEqual(submit.errors, {});
  await submit.validate();
  assert.deepEqual(Object.keys(submit.errors).sort(), ['email', 'name']);
});

test('handleSubmit: невалидная форма — onInvalid и все ошибки видны', async () => {
  const form = useForm(Signup, { initial: initial() });
  let prevented = false;
  let invalid;
  await form.handleSubmit(
    () => assert.fail('onValid не должен вызываться'),
    (errors) => (invalid = errors),
  )({ preventDefault: () => (prevented = true) });
  assert.equal(prevented, true);
  assert.equal(form.submitted, true);
  assert.deepEqual(invalid, { name: 'Required', email: 'Required' });
  assert.deepEqual(form.errors, invalid);
});

test('handleSubmit: валидная форма — данные после trim и coerce, submitting', async () => {
  const form = useForm(Signup, { initial: { name: ' Ivan ', email: 'a@a.ru', age: '30' } });
  let data;
  let during;
  await form.handleSubmit(async (d) => {
    data = d;
    during = form.submitting;
  })();
  assert.deepEqual(data, { name: 'Ivan', email: 'a@a.ru', age: 30 });
  assert.equal(during, true);
  assert.equal(form.submitting, false);
});

test('setErrors: ошибки сервера в формате Laravel, исчезают при изменении поля', async () => {
  const form = useForm(Signup, { initial: { name: 'Ivan', email: 'a@a.ru', age: '' } });
  await nextTick();
  assert.equal(form.valid, true);
  form.setErrors({ email: ['Email уже занят', 'второе сообщение'] });
  assert.deepEqual(form.errors, { email: 'Email уже занят' });
  assert.equal(form.valid, false);
  form.values.name = 'Petr';
  await nextTick();
  assert.deepEqual(form.errors, { email: 'Email уже занят' }, 'другое поле не сбрасывает ошибку');
  form.values.email = 'b@b.ru';
  await nextTick();
  assert.deepEqual(form.errors, {});
  assert.equal(form.valid, true);
});

test('асинхронные проверки: задержка и защита от устаревших ответов', async () => {
  const calls = [];
  const s = object({
    login: pipe(
      string(),
      checkAsync(async (v) => {
        calls.push(v);
        await sleep(v === 'slow' ? 60 : 5);
        return v !== 'taken';
      }, 'Занят'),
    ),
  });
  const form = useForm(s, { initial: { login: 'a' }, debounce: 30 });
  form.touch('login');
  await sleep(50);
  form.values.login = 't';
  await nextTick();
  form.values.login = 'ta';
  await nextTick();
  form.values.login = 'taken';
  await nextTick();
  assert.equal(form.validating, true);
  await sleep(80);
  assert.deepEqual(calls, ['a', 'taken'], 'промежуточные значения не проверяются');
  assert.deepEqual(form.errors, { login: 'Занят' });
  assert.equal(form.validating, false);

  form.values.login = 'slow';
  await nextTick();
  await sleep(35);
  form.values.login = 'free';
  await nextTick();
  await sleep(120);
  assert.deepEqual(form.errors, {}, 'медленный ответ для slow не перезаписал результат для free');
  assert.equal(form.valid, true);
});

test('reset: значения, touched, submitted и dirty', async () => {
  const form = useForm(Signup, { initial: initial() });
  form.values.name = 'Ivan';
  form.touch('name');
  await form.validate();
  assert.equal(form.dirty, true);
  form.reset();
  await nextTick();
  assert.deepEqual(form.values, initial());
  assert.deepEqual(form.touched, {});
  assert.equal(form.submitted, false);
  assert.equal(form.dirty, false);
  assert.deepEqual(form.errors, {});
  form.reset({ name: 'Petr', email: 'p@p.ru', age: '' });
  await nextTick();
  assert.equal(form.dirty, false);
  assert.equal(form.valid, true);
});

test('bind: для компонентов UI-библиотек', async () => {
  const form = useForm(object({ address: object({ city: pipe(string(), minLength(2)) }) }), {
    initial: { address: { city: '' } },
  });
  const field = form.bind('address.city');
  assert.equal(field.modelValue, '');
  field['onUpdate:modelValue']('M');
  assert.equal(form.values.address.city, 'M');
  field.onBlur();
  await nextTick();
  assert.deepEqual(form.errors, { 'address.city': 'Must be at least 2 characters long' });
});

test('массивы: touch родителя показывает ошибки элементов', async () => {
  const form = useForm(object({ items: array(object({ title: string() })) }), {
    initial: { items: [{ title: 'a' }, { title: '' }] },
  });
  form.touch('items');
  assert.deepEqual(form.errors, { 'items.1.title': 'Required' });
  form.values.items.push({ title: '' });
  await nextTick();
  assert.deepEqual(Object.keys(form.errors), ['items.1.title', 'items.2.title']);
});

test('опции проверки: язык и названия полей для этой формы', async () => {
  const form = useForm(Signup, {
    initial: initial(),
    messages: { ...ru, required: '{label}: обязательно' },
    labels: { name: 'Имя' },
  });
  await form.validate();
  assert.deepEqual(form.errors, { name: 'Имя: обязательно', email: 'email: обязательно' });
});
