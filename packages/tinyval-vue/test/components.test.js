// Компоненты рендерятся в DOM от happy-dom. Vue читает document при загрузке — поэтому импорт после настройки окружения
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const window = new Window();
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'SVGElement', 'Event', 'MathMLElement']) {
  globalThis[key] = key === 'window' ? window : window[key];
}

const { createApp, defineComponent, h, nextTick } = await import('vue');
const { useForm, useField, useFormContext, TvForm, TvField, TvError, TvFieldArray } = await import('../dist/index.js');
const { object, string, pipe, minLength, email, boolean, literal, oneOf, array } = await import('tinyval');

function mount(component) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp(component);
  app.config.warnHandler = (msg) => {
    throw new Error(`Vue warning: ${msg}`);
  };
  app.mount(root);
  return { root, unmount: () => app.unmount() };
}

const flush = async () => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
  await nextTick();
};

const input = (el, value) => {
  el.value = value;
  el.dispatchEvent(new window.Event('input'));
};
const change = (el) => el.dispatchEvent(new window.Event('change'));
const blur = (el) => el.dispatchEvent(new window.Event('blur'));
const submit = (el) => el.dispatchEvent(new window.Event('submit', { cancelable: true }));

const Signup = object({ name: pipe(string(), minLength(2)), email: pipe(string(), email()) });

test('TvForm + TvField + TvError: ввод, ошибка после blur, aria-связь', async () => {
  let form;
  const { root, unmount } = mount({
    setup() {
      form = useForm(Signup, { initial: { name: '', email: '' } });
      return () =>
        h(TvForm, { form }, () => [
          h(TvField, { name: 'name', placeholder: 'Name' }),
          h(TvError, { name: 'name' }),
          h(TvField, { name: 'email', type: 'email' }),
          h(TvError, { name: 'email' }),
        ]);
    },
  });
  const [name, mail] = root.querySelectorAll('input');
  assert.equal(name.getAttribute('placeholder'), 'Name', 'атрибуты пробрасываются на input');
  assert.equal(mail.getAttribute('type'), 'email');

  input(name, 'I');
  blur(name);
  await flush();
  assert.equal(form.values.name, 'I');
  const error = root.querySelector('[role="alert"]');
  assert.equal(error.textContent, 'Must be at least 2 long');
  assert.equal(name.getAttribute('aria-invalid'), 'true');
  assert.equal(name.getAttribute('aria-describedby'), error.id);

  input(name, 'Ivan');
  await flush();
  assert.equal(root.querySelector('[role="alert"]'), null);
  unmount();
});

test('TvForm: неудачная отправка — все ошибки и фокус на первом поле; удачная — onSubmit с данными', async () => {
  let sent;
  const form = { current: null };
  const { root, unmount } = mount({
    setup() {
      form.current = useForm(Signup, { initial: { name: 'Ivan', email: '' } });
      return () =>
        h(TvForm, { form: form.current, onSubmit: async (data) => (sent = data) }, () => [
          h(TvField, { name: 'name' }),
          h(TvField, { name: 'email' }),
          h(TvError, { name: 'email' }),
          h('button', { type: 'submit' }),
        ]);
    },
  });
  const el = root.querySelector('form');
  submit(el);
  await flush();
  assert.equal(root.querySelector('[role="alert"]').textContent, 'Required');
  assert.equal(document.activeElement, root.querySelectorAll('input')[1]);
  assert.equal(sent, undefined);

  input(root.querySelectorAll('input')[1], 'a@a.ru');
  await flush();
  submit(el);
  await flush();
  assert.deepEqual(sent, { name: 'Ivan', email: 'a@a.ru' });
  unmount();
});

test('TvForm: ответ 422 из onSubmit показывается у поля', async () => {
  const { root, unmount } = mount({
    setup() {
      const form = useForm(Signup, { initial: { name: 'Ivan', email: 'a@a.ru' } });
      const save = () => Promise.reject({ response: { status: 422, data: { errors: { email: ['Taken'] } } } });
      return () => h(TvForm, { form, onSubmit: save }, () => [h(TvField, { name: 'email' }), h(TvError, { name: 'email' })]);
    },
  });
  submit(root.querySelector('form'));
  await flush();
  assert.equal(root.querySelector('[role="alert"]').textContent, 'Taken');
  unmount();
});

test('TvField: checkbox, группа чекбоксов, radio, select, textarea', async () => {
  let form;
  const Schema = object({
    terms: literal(true),
    tags: array(oneOf(['js', 'go'])),
    plan: oneOf(['free', 'pro']),
    city: oneOf(['msk', 'spb']),
    langs: array(string()),
    bio: string(),
  });
  const { root, unmount } = mount({
    setup() {
      form = useForm(Schema, { initial: { terms: false, tags: [], plan: 'free', city: '', langs: [], bio: '' } });
      return () =>
        h(TvForm, { form }, () => [
          h(TvField, { name: 'terms', type: 'checkbox', 'data-t': 'terms' }),
          h(TvField, { name: 'tags', type: 'checkbox', value: 'js', 'data-t': 'js' }),
          h(TvField, { name: 'tags', type: 'checkbox', value: 'go', 'data-t': 'go' }),
          h(TvField, { name: 'plan', type: 'radio', value: 'free', 'data-t': 'free' }),
          h(TvField, { name: 'plan', type: 'radio', value: 'pro', 'data-t': 'pro' }),
          h(TvField, { name: 'city', as: 'select', 'data-t': 'city' }, () => [
            h('option', { value: '' }, '—'),
            h('option', { value: 'msk' }, 'Moscow'),
            h('option', { value: 'spb' }, 'SPb'),
          ]),
          h(TvField, { name: 'langs', as: 'select', multiple: true, 'data-t': 'langs' }, () => [
            h('option', { value: 'ru' }, 'ru'),
            h('option', { value: 'en' }, 'en'),
          ]),
          h(TvField, { name: 'bio', as: 'textarea', 'data-t': 'bio' }),
        ]);
    },
  });
  const $ = (t) => root.querySelector(`[data-t="${t}"]`);

  $('terms').checked = true;
  change($('terms'));
  $('js').checked = true;
  change($('js'));
  $('go').checked = true;
  change($('go'));
  $('js').checked = false;
  change($('js'));
  $('pro').checked = true;
  change($('pro'));
  $('city').value = 'spb';
  change($('city'));
  $('langs').options[0].selected = true;
  $('langs').options[1].selected = true;
  change($('langs'));
  input($('bio'), 'Hello');
  await flush();

  assert.deepEqual(form.values, { terms: true, tags: ['go'], plan: 'pro', city: 'spb', langs: ['ru', 'en'], bio: 'Hello' });
  assert.equal(form.valid, true);
  assert.equal($('free').checked, false);
  assert.notEqual($('free').id, $('pro').id, 'у радио-кнопок разные id');

  form.values.plan = 'free';
  form.values.city = 'msk';
  await flush();
  assert.equal($('free').checked, true, 'значение из формы отражается в DOM');
  assert.equal($('city').value, 'msk');
  unmount();
});

test('useField(path) и useFormContext во вложенном компоненте', async () => {
  const EmailInput = defineComponent({
    setup() {
      const { value, attrs, error } = useField('email');
      const form = useFormContext();
      return () => [
        h('input', { ...attrs.value, value: value.value, onInput: (e) => (value.value = e.target.value) }),
        h('span', { class: 'err' }, error.value ?? ''),
        h('span', { class: 'dirty' }, String(form.dirty)),
      ];
    },
  });
  let form;
  const { root, unmount } = mount({
    setup() {
      form = useForm(Signup, { initial: { name: 'Ivan', email: '' } });
      return () => h('div', [h(EmailInput)]);
    },
  });
  const el = root.querySelector('input');
  assert.equal(el.getAttribute('name'), 'email');
  input(el, 'bad');
  blur(el);
  await flush();
  assert.equal(form.values.email, 'bad');
  assert.equal(root.querySelector('.err').textContent, 'Invalid email');
  assert.equal(root.querySelector('.dirty').textContent, 'true');
  unmount();
});

test('TvFieldArray: список строк с добавлением и удалением', async () => {
  let form;
  const { root, unmount } = mount({
    setup() {
      form = useForm(object({ items: array(object({ title: string() })) }), { initial: { items: [{ title: 'a' }] } });
      return () =>
        h(TvForm, { form }, () =>
          h(TvFieldArray, { name: 'items' }, ({ fields, append, remove }) => [
            ...fields.map((f) =>
              h('div', { key: f.key, class: 'row' }, [
                h(TvField, { name: `${f.path}.title` }),
                h('button', { type: 'button', class: 'rm', onClick: () => remove(f.index) }),
              ]),
            ),
            h('button', { type: 'button', class: 'add', onClick: () => append({ title: '' }) }),
          ]),
        );
    },
  });
  root.querySelector('.add').click();
  await flush();
  assert.equal(root.querySelectorAll('.row').length, 2);
  input(root.querySelectorAll('input')[1], 'b');
  await flush();
  root.querySelectorAll('.rm')[0].click();
  await flush();
  assert.deepEqual(form.values.items, [{ title: 'b' }]);
  assert.equal(root.querySelector('input').value, 'b');
  assert.equal(root.querySelector('input').getAttribute('name'), 'items.0.title');
  unmount();
});

test('без формы выше по дереву — понятная ошибка', () => {
  let error;
  const app = createApp({
    setup() {
      useField('email');
      return () => null;
    },
  });
  app.config.errorHandler = (e) => (error = e);
  app.config.warnHandler = () => {};
  app.mount(document.createElement('div'));
  assert.match(error.message, /no form found/);
  app.unmount();
});

void boolean;
