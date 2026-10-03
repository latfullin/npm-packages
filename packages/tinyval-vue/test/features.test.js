import { test } from 'node:test';
import assert from 'node:assert/strict';
import { effectScope, nextTick, ref } from 'vue';
import { useForm, useField, useFieldArray, useDraft, useLeaveGuard } from '../dist/index.js';
import { object, array, string, pipe, minLength, email, optional, coerce, number } from 'tinyval';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Wizard = object({
  name: pipe(string(), minLength(2)),
  email: pipe(string(), email()),
  city: string(),
});

test('validate(paths): проверка только полей текущего шага', async () => {
  const form = useForm(Wizard, { initial: { name: 'Ivan', email: '', city: '' } });
  assert.equal(await form.validate(['name']), true);
  assert.equal(await form.validate(['name', 'email']), false);
  assert.deepEqual(form.errors, { email: 'Required' }, 'city не трогали — его ошибка не видна');
  assert.equal(form.submitted, false);
});

test('changes и isDirty: только изменённые поля', async () => {
  const form = useForm(object({ name: string(), address: object({ city: string(), zip: string() }), tags: array(string()) }), {
    initial: { name: 'Ivan', address: { city: 'Moscow', zip: '101000' }, tags: ['a'] },
  });
  assert.deepEqual(form.changes, {});
  form.values.address.city = 'Kazan';
  form.values.tags.push('b');
  await nextTick();
  assert.deepEqual(form.changes, { address: { city: 'Kazan' }, tags: ['a', 'b'] });
  assert.equal(form.isDirty('address.city'), true);
  assert.equal(form.isDirty('address.zip'), false);
  assert.equal(form.isDirty('name'), false);
});

test('после успешной отправки значения считаются сохранёнными, после ошибки сервера — нет', async () => {
  const form = useForm(object({ name: string() }), { initial: { name: 'a' } });
  form.values.name = 'b';
  await form.handleSubmit(() => form.setErrors({ name: 'Занято' }))();
  assert.equal(form.dirty, true);
  form.values.name = 'c';
  await form.handleSubmit(() => {})();
  assert.equal(form.dirty, false);
  assert.deepEqual(form.changes, {});
});

test('setValue и setValues', async () => {
  const form = useForm(object({ a: string(), b: object({ c: string() }) }), { initial: { a: '', b: { c: '' } } });
  form.setValue('b.c', 'x');
  form.setValues({ a: 'y' });
  await nextTick();
  assert.deepEqual(form.values, { a: 'y', b: { c: 'x' } });
  assert.equal(form.valid, true);
});

function memoryStorage() {
  const data = new Map();
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
}

test('useDraft: черновик сохраняется, восстанавливается и удаляется', async () => {
  const storage = memoryStorage();
  const initial = { name: '', email: '', city: '' };
  const form = useForm(Wizard, { initial });
  const draft = useDraft(form, 'signup', { storage });
  assert.equal(draft.restored, false);
  form.values.name = 'Ivan';
  await sleep(350);
  assert.deepEqual(JSON.parse(storage.getItem('signup')), { name: 'Ivan', email: '', city: '' });

  const restored = useForm(Wizard, { initial });
  assert.equal(useDraft(restored, 'signup', { storage }).restored, true);
  assert.equal(restored.values.name, 'Ivan');
  assert.equal(restored.dirty, true);

  restored.reset();
  await nextTick();
  assert.equal(storage.getItem('signup'), null, 'после reset черновик удалён');

  restored.values.name = 'Petr';
  await sleep(350);
  assert.ok(storage.getItem('signup'));
  restored.values.email = 'p@p.ru';
  restored.values.city = 'Kazan';
  await restored.handleSubmit(() => {})();
  await nextTick();
  assert.equal(storage.getItem('signup'), null, 'после успешной отправки черновик удалён');
});

test('useDraft: испорченный черновик не ломает форму', () => {
  const storage = memoryStorage();
  storage.setItem('broken', '{not json');
  const form = useForm(Wizard, { initial: { name: '', email: '', city: '' } });
  assert.equal(useDraft(form, 'broken', { storage }).restored, false);
  assert.equal(form.values.name, '');
});

test('focusOnError: фокус на первом по разметке поле с ошибкой', async () => {
  const focused = [];
  const input = (name) => ({ getAttribute: () => name, focus: () => focused.push(name) });
  const formEl = { querySelectorAll: () => [input('city'), input('name'), input('email')] };
  const form = useForm(Wizard, { initial: { name: 'Ivan', email: '', city: '' } });
  const event = { currentTarget: formEl, preventDefault() {} };
  const submit = form.handleSubmit(() => {});
  const p = submit(event);
  event.currentTarget = null; // как в браузере: после обработчика currentTarget сбрасывается
  await p;
  assert.deepEqual(focused, ['city']);

  const off = useForm(Wizard, { initial: { name: '', email: '', city: '' }, focusOnError: false });
  await off.handleSubmit(() => {})({ currentTarget: formEl, preventDefault() {} });
  assert.deepEqual(focused, ['city']);
});

test('useLeaveGuard: предупреждение только при несохранённых изменениях, обработчик снимается', async () => {
  const listeners = new Map();
  globalThis.window = {
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type) => listeners.delete(type),
  };
  try {
    const scope = effectScope();
    const form = scope.run(() => {
      const f = useForm(object({ name: string() }), { initial: { name: '' } });
      useLeaveGuard(f);
      return f;
    });
    const fire = () => {
      const e = { prevented: false, preventDefault() { this.prevented = true; } };
      listeners.get('beforeunload')(e);
      return e.prevented;
    };
    assert.equal(fire(), false);
    form.values.name = 'x';
    assert.equal(fire(), true);
    scope.stop();
    assert.equal(listeners.has('beforeunload'), false);
  } finally {
    delete globalThis.window;
  }
});

test('useField: v-model, ошибка и атрибуты доступности', async () => {
  const form = useForm(Wizard, { initial: { name: '', email: '', city: '' } });
  const path = ref('email');
  const field = useField(form, path);
  field.value.value = 'bad';
  assert.equal(form.values.email, 'bad');
  await nextTick();
  assert.equal(field.error.value, undefined);
  assert.equal(field.attrs.value['aria-invalid'], undefined);
  field.attrs.value.onBlur();
  assert.equal(field.error.value, 'Invalid email');
  assert.equal(field.touched.value, true);
  assert.equal(field.dirty.value, true);
  assert.equal(field.attrs.value.name, 'email');
  assert.equal(field.attrs.value['aria-invalid'], 'true');
  assert.equal(field.attrs.value['aria-describedby'], field.errorId.value);
  path.value = 'name';
  assert.equal(field.value.value, '');
  assert.equal(field.attrs.value.name, 'name');
});

test('useFieldArray: устойчивые ключи и touched не съезжают', async () => {
  const form = useForm(object({ items: array(object({ title: pipe(string(), minLength(2)) })) }), {
    initial: { items: [{ title: 'a' }, { title: 'bb' }, { title: 'c' }] },
  });
  const items = useFieldArray(form, 'items');
  const keys = () => items.fields.value.map((f) => f.key);
  const [k0, k1, k2] = keys();
  form.touch('items.2.title');
  await nextTick();
  assert.deepEqual(form.errors, { 'items.2.title': 'Must be at least 2 characters long' });

  items.remove(0);
  await nextTick();
  assert.deepEqual(keys(), [k1, k2]);
  assert.deepEqual(form.touched, { 'items.1.title': true });
  assert.deepEqual(form.errors, { 'items.1.title': 'Must be at least 2 characters long' });

  items.insert(0, { title: 'zz' });
  items.swap(0, 2);
  await nextTick();
  assert.deepEqual(form.values.items.map((i) => i.title), ['c', 'bb', 'zz']);
  assert.deepEqual(form.touched, { 'items.0.title': true });

  items.move(0, 2);
  assert.deepEqual(form.values.items.map((i) => i.title), ['bb', 'zz', 'c']);
  assert.deepEqual(form.touched, { 'items.2.title': true });
  assert.equal(keys()[2], k2);

  form.values.items.push({ title: 'new' });
  assert.equal(new Set(keys()).size, 4, 'прямой push получает свой ключ');
  items.replace([{ title: 'one' }]);
  assert.equal(form.values.items.length, 1);
  assert.deepEqual(form.touched, {});
  void k0;
});

test('useFieldArray создаёт массив, если его нет', () => {
  const form = useForm(object({ tags: optional(array(string())) }), { initial: {} });
  const tags = useFieldArray(form, 'tags');
  tags.append('vue');
  assert.deepEqual(form.values.tags, ['vue']);
});

test('после остановки scope таймеры не срабатывают', async () => {
  const storage = memoryStorage();
  const scope = effectScope();
  const form = scope.run(() => {
    const f = useForm(object({ n: coerce.number() }), { initial: { n: '' } });
    useDraft(f, 'k', { storage });
    return f;
  });
  form.values.n = '1';
  await nextTick();
  scope.stop();
  await sleep(350);
  assert.equal(storage.getItem('k'), null);
  void number;
});
