import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextTick } from 'vue';
import { useForm, useLeaveGuard, defaultExtractErrors } from '../dist/index.js';
import { object, string, pipe, minLength, email, parse, ValidationError } from 'tinyval';

const User = object({ name: pipe(string(), minLength(2)), email: pipe(string(), email()) });
const filled = () => ({ name: 'Ivan', email: 'a@a.ru' });

test('setFieldError и clearErrors', async () => {
  const form = useForm(User, { initial: { name: '', email: 'a@a.ru' } });
  form.setFieldError('email', 'Почта занята');
  form.touch('name');
  assert.deepEqual(form.errors, { name: 'Required', email: 'Почта занята' });
  form.clearErrors('email');
  assert.deepEqual(form.errors, { name: 'Required' });
  form.setFieldError('email', 'снова');
  form.clearErrors();
  assert.deepEqual(form.errors, {});
  await form.validate();
  assert.deepEqual(form.errors, { name: 'Required' }, 'после clearErrors ошибки снова видны при следующей проверке');
});

test('setTouched, validateField, resetField', async () => {
  const form = useForm(User, { initial: { name: 'Iv', email: '' } });
  form.setTouched('email');
  assert.deepEqual(form.errors, { email: 'Required' });
  form.setTouched('email', false);
  assert.deepEqual(form.errors, {});
  assert.equal(await form.validateField('name'), true);
  assert.equal(await form.validateField('email'), false);

  form.values.name = 'Changed';
  form.resetField('name');
  await nextTick();
  assert.equal(form.values.name, 'Iv');
  assert.equal(form.isDirty('name'), false);

  form.resetField('name', 'New default');
  await nextTick();
  assert.equal(form.values.name, 'New default');
  assert.equal(form.isDirty('name'), false, 'новое значение стало начальным');
  assert.equal(form.touched.name, undefined);
});

test('submitCount и submitSucceeded', async () => {
  const form = useForm(User, { initial: { name: '', email: '' } });
  await form.handleSubmit(() => {})();
  assert.equal(form.submitCount, 1);
  assert.equal(form.submitSucceeded, false);
  Object.assign(form.values, filled());
  await form.handleSubmit(() => {})();
  assert.equal(form.submitCount, 2);
  assert.equal(form.submitSucceeded, true);
  form.reset();
  assert.equal(form.submitSucceeded, false);
});

test('исключение 422 из axios раскладывается по полям', async () => {
  const form = useForm(User, { initial: filled() });
  const axiosError = Object.assign(new Error('Request failed with status code 422'), {
    response: { status: 422, data: { message: 'The given data was invalid.', errors: { email: ['The email has already been taken.'] } } },
  });
  await form.handleSubmit(() => Promise.reject(axiosError))();
  assert.deepEqual(form.errors, { email: 'The email has already been taken.' });
  assert.equal(form.submitSucceeded, false);
  assert.equal(form.submitting, false);
  assert.equal(form.dirty, false, 'начальные значения не стали «сохранёнными»');
});

test('ofetch, ValidationError из tinyval и свой extractErrors', async () => {
  assert.deepEqual(defaultExtractErrors({ statusCode: 422, data: { errors: { name: ['x'] } } }), { name: ['x'] });
  let validationError;
  try {
    parse(User, { name: 'I', email: 'a@a.ru' });
  } catch (e) {
    validationError = e;
  }
  assert.ok(validationError instanceof ValidationError);
  assert.deepEqual(defaultExtractErrors(validationError), { name: 'Must be at least 2 characters long' });
  assert.equal(defaultExtractErrors({ response: { status: 500 } }), undefined);

  const form = useForm(User, {
    initial: filled(),
    extractErrors: (e) => (e instanceof Response && e.status === 409 ? { email: 'Conflict' } : undefined),
  });
  await form.handleSubmit(() => Promise.reject(new Response(null, { status: 409 })))();
  assert.deepEqual(form.errors, { email: 'Conflict' });
});

test('другие исключения пробрасываются', async () => {
  const form = useForm(User, { initial: filled() });
  await assert.rejects(form.handleSubmit(() => Promise.reject(new Error('Network down')))(), /Network down/);
  assert.equal(form.submitting, false);
});

test('useLeaveGuard: переходы внутри приложения через vue-router', async () => {
  let guard;
  const asked = [];
  const form = useForm(User, { initial: filled() });
  useLeaveGuard(form, {
    onBeforeRouteLeave: (g) => (guard = g),
    confirm: async (m) => (asked.push(m), false),
    message: 'Уйти без сохранения?',
  });
  assert.equal(await guard(), true, 'без изменений уходим без вопроса');
  form.values.name = 'Other';
  assert.equal(await guard(), false);
  assert.deepEqual(asked, ['Уйти без сохранения?']);
});

test('id формы задаётся опцией', () => {
  const form = useForm(User, { initial: filled(), id: 'signup' });
  assert.equal(form.id, 'signup');
});
