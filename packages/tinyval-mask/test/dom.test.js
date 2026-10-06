// Поведение в поле ввода: happy-dom вместо браузера. Vue читает document при загрузке — импорт после настройки окружения
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const window = new Window();
for (const key of ['window', 'document', 'Document', 'ShadowRoot', 'Node', 'Element', 'HTMLElement', 'SVGElement', 'Event', 'InputEvent', 'MathMLElement']) {
  globalThis[key] = key === 'window' ? window : window[key];
}

const { attach, masks, numberMask } = await import('../dist/index.js');
const { phoneAuto } = await import('../dist/presets.js');
const { vMask } = await import('../dist/vue.js');
const { createApp, h, ref, withDirectives, vModelText, nextTick, defineComponent } = await import('vue');

function field() {
  const el = document.createElement('input');
  document.body.appendChild(el);
  el.focus();
  return el;
}

// Ввод как в браузере: значение меняется на месте курсора, затем событие input
function type(el, text) {
  for (const ch of text) {
    const s = el.selectionStart;
    el.value = el.value.slice(0, s) + ch + el.value.slice(el.selectionEnd);
    el.setSelectionRange(s + 1, s + 1);
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
  }
}

function backspace(el) {
  const ev = new window.InputEvent('beforeinput', { inputType: 'deleteContentBackward', cancelable: true, bubbles: true });
  el.dispatchEvent(ev);
  if (ev.defaultPrevented) return;
  const s = el.selectionStart;
  el.value = el.value.slice(0, s - 1) + el.value.slice(s);
  el.setSelectionRange(s - 1, s - 1);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}

test('ввод телефона по символу', () => {
  const el = field();
  const states = [];
  const m = attach(el, masks.phone(), { onChange: (s) => states.push(s) });
  type(el, '89991234567');
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(el.selectionStart, el.value.length);
  assert.equal(m.raw, '79991234567');
  assert.equal(m.complete, true);
  assert.deepEqual(states.at(-1), { value: '+7 (999) 123-45-67', raw: '79991234567', complete: true, valid: true });
  m.destroy();
});

test('вставка из буфера и правка в середине — курсор остаётся на месте', () => {
  const el = field();
  attach(el, masks.phone());
  el.value = '8 999 123 45 67';
  el.setSelectionRange(el.value.length, el.value.length);
  el.dispatchEvent(new window.Event('input'));
  assert.equal(el.value, '+7 (999) 123-45-67');

  // курсор после «+7 (99», вводим 5: цифры сдвигаются, курсор — сразу за 5
  el.setSelectionRange(6, 6);
  type(el, '5');
  assert.equal(el.value, '+7 (995) 912-34-56');
  assert.equal(el.selectionStart, 7);
});

test('Backspace после литерала удаляет цифру, а не застревает', () => {
  const el = field();
  attach(el, masks.phone());
  type(el, '9991234');
  assert.equal(el.value, '+7 (999) 123-4');
  // курсор после «+7 (999) » — перед ним пробел и скобка
  el.setSelectionRange(9, 9);
  backspace(el);
  assert.equal(el.value, '+7 (991) 234');
  assert.equal(el.selectionStart, 6, 'курсор на месте удалённой цифры');
  // обычный Backspace в конце
  el.setSelectionRange(el.value.length, el.value.length);
  backspace(el);
  assert.equal(el.value, '+7 (991) 23');
});

test('числовая маска: разделители появляются, курсор не прыгает', () => {
  const el = field();
  attach(el, numberMask());
  type(el, '1234567,5');
  assert.equal(el.value, '1 234 567,5');
  assert.equal(el.selectionStart, el.value.length);
  // убираем первую цифру — группировка меняется, курсор остаётся перед «2»
  el.setSelectionRange(1, 1);
  backspace(el);
  assert.equal(el.value, '234 567,5');
  assert.equal(el.selectionStart, 0);
});

test('update меняет маску, destroy снимает обработчики', () => {
  const el = field();
  const m = attach(el, '99-99');
  type(el, '1234');
  assert.equal(el.value, '12-34');
  m.update('99 99');
  assert.equal(el.value, '12 34');
  m.destroy();
  type(el, 'x');
  assert.equal(el.value, '12 34x');
});

test('v-mask вместе с v-model: в модели отформатированное значение', async () => {
  const model = ref('');
  const phone = masks.phone();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp({
    render: () =>
      withDirectives(h('input', { 'onUpdate:modelValue': (v) => (model.value = v) }), [
        [vModelText, model.value],
        [vMask, phone],
      ]),
  });
  app.mount(root);
  const el = root.querySelector('input');
  el.focus();
  type(el, '9991234567');
  await nextTick();
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(model.value, '+7 (999) 123-45-67', 'v-model получил уже отформатированное значение');
  app.unmount();
});

test('v-mask на обёртке находит input внутри', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp({ render: () => withDirectives(h('label', [h('input')]), [[vMask, '99-99']]) });
  app.mount(root);
  const el = root.querySelector('input');
  el.focus();
  type(el, '1234');
  assert.equal(el.value, '12-34');
  app.unmount();
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function mountInput(model, binding, modifiers = {}) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp({
    render: () =>
      withDirectives(h('input', { 'onUpdate:modelValue': (v) => (model.value = v) }), [
        [vModelText, model.value],
        [vMask, binding, undefined, modifiers],
      ]),
  });
  app.mount(root);
  return { el: root.querySelector('input'), app };
}

test('v-mask.raw: в модели значение без маски, в поле — с маской', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, masks.phone(), { raw: true });
  el.focus();
  type(el, '89991234567');
  await nextTick();
  assert.equal(model.value, '79991234567');
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(el.selectionStart, el.value.length);
  app.unmount();
});

test('v-mask.raw: правка в середине — курсор остаётся после перерисовки', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, masks.phone(), { raw: true });
  el.focus();
  type(el, '9991234567');
  await nextTick();
  el.setSelectionRange(6, 6); // после «+7 (99»
  type(el, '5');
  await nextTick();
  assert.equal(model.value, '79959123456');
  assert.equal(el.value, '+7 (995) 912-34-56');
  assert.equal(el.selectionStart, 7);
  app.unmount();
});

test('v-mask.raw: значение из кода показывается с маской', async () => {
  const model = ref('79991234567');
  const { el, app } = mountInput(model, masks.phone(), { raw: true });
  assert.equal(el.value, '+7 (999) 123-45-67');
  model.value = '79000000000';
  await nextTick();
  assert.equal(el.value, '+7 (900) 000-00-00');
  model.value = '';
  await nextTick();
  assert.equal(el.value, '');
  app.unmount();
});

test('v-mask.raw на компоненте поля и для чисел', async () => {
  const Field = defineComponent({
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup: (props, { emit }) => () => h('input', { value: props.modelValue, onInput: (e) => emit('update:modelValue', e.target.value) }),
  });
  const model = ref('');
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp({
    render: () =>
      withDirectives(h(Field, { modelValue: model.value, 'onUpdate:modelValue': (v) => (model.value = v) }), [
        [vMask, numberMask(), undefined, { raw: true }],
      ]),
  });
  app.mount(root);
  const el = root.querySelector('input');
  el.focus();
  type(el, '1234567,5');
  await nextTick();
  assert.equal(model.value, '1234567.5');
  assert.equal(el.value, '1 234 567,5');
  app.unmount();
});

test('шаблон: виден при фокусе, курсор на первой пустой позиции, пустое поле очищается', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.phone(), placeholder: '_' });
  assert.equal(el.value, '', 'до фокуса шаблона нет');
  el.focus();
  await sleep(5);
  assert.equal(el.value, '+7 (___) ___-__-__');
  assert.equal(el.selectionStart, 4);
  type(el, '999');
  await nextTick();
  assert.equal(el.value, '+7 (999) ___-__-__');
  assert.equal(el.selectionStart, 7);
  assert.equal(model.value, '+7 (999', 'в модели — без шаблона');
  backspace(el);
  await nextTick();
  assert.equal(el.value, '+7 (99_) ___-__-__');
  el.blur();
  assert.equal(el.value, '+7 (99_) ___-__-__', 'частично заполненное поле сохраняет шаблон');
  el.focus();
  el.setSelectionRange(el.value.length, el.value.length);
  backspace(el);
  backspace(el);
  await nextTick();
  el.blur();
  assert.equal(el.value, '', 'пустое поле после ухода очищается');
  app.unmount();
});

test('шаблон: выделение сразу после фокуса сохраняется — вставка заменяет значение', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.phone(), placeholder: '_' });
  el.focus();
  el.setSelectionRange(0, el.value.length);
  await sleep(5);
  assert.equal(el.selectionStart, 0);
  assert.equal(el.selectionEnd, el.value.length);
  el.value = '89991234567';
  el.setSelectionRange(11, 11);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
  await nextTick();
  assert.equal(el.value, '+7 (999) 123-45-67');
  app.unmount();
});

test('шаблон: вставка номера с 8 в пустое поле — это +7, ввод 8 по одной цифре — часть номера', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.phoneAuto({ defaultCountry: 'ru' }), placeholder: '_' });
  el.focus();
  await sleep(5);
  const s = el.selectionStart;
  el.value = el.value.slice(0, s) + '8 999 123-45-67' + el.value.slice(s);
  el.setSelectionRange(s + 15, s + 15);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
  await nextTick();
  assert.equal(el.value, '+7 (999) 123-45-67');
  app.unmount();

  const second = mountInput(ref(''), { mask: masks.phoneAuto({ defaultCountry: 'ru' }), placeholder: '_' });
  second.el.focus();
  await sleep(5);
  type(second.el, '800');
  await nextTick();
  assert.equal(second.el.value, '+7 (800) ___-__-__');
  second.app.unmount();
});

test('шаблон: код страны, выбранный по вводу, стирается Backspace', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.phoneAuto(), placeholder: '_' });
  el.focus();
  await sleep(5);
  type(el, '1');
  await nextTick();
  assert.equal(el.value, '+1 (___) ___-____');
  backspace(el);
  await nextTick();
  assert.equal(el.value.replace(/[_ ]/g, ''), '+', 'остался только +');
  type(el, '44');
  await nextTick();
  assert.equal(el.value, '+44 ____ ______');
  backspace(el);
  backspace(el);
  await nextTick();
  assert.equal(el.value.replace(/[_ ]/g, ''), '+');
  app.unmount();

  // у маски одной страны код — часть шаблона: стереть его нельзя, поле остаётся пустым
  const single = mountInput(ref(''), { mask: masks.phone('ru'), placeholder: '_' });
  single.el.focus();
  await sleep(5);
  backspace(single.el);
  await nextTick();
  assert.equal(single.el.value, '+7 (___) ___-__-__');
  single.app.unmount();
});

test('шаблон: заполнитель-цифра не считается вводом', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.phone('ru'), placeholder: '0' }, { raw: true });
  el.focus();
  await sleep(5);
  assert.equal(el.value, '+7 (000) 000-00-00');
  type(el, '999');
  await nextTick();
  assert.equal(el.value, '+7 (999) 000-00-00');
  assert.equal(model.value, '7999');
  backspace(el);
  await nextTick();
  assert.equal(model.value, '799');
  type(el, '91234567');
  await nextTick();
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(model.value, '79991234567');
  el.blur();
  el.focus();
  await sleep(5);
  assert.equal(model.value, '79991234567', 'фокус и уход не меняют значение');
  app.unmount();

  const auto = mountInput(ref(''), { mask: masks.phoneAuto(), placeholder: '9' });
  auto.el.focus();
  await sleep(5);
  assert.equal(auto.el.value, '+999 999 999 999 999');
  type(auto.el, '+49');
  await nextTick();
  assert.equal(auto.el.value, '+49 999 9999999');
  type(auto.el, '15');
  await nextTick();
  assert.equal(auto.el.value, '+49 159 9999999');
  backspace(auto.el);
  backspace(auto.el);
  backspace(auto.el);
  await nextTick();
  assert.equal(auto.el.value, '+499 999 999 999 999', 'код страны стёрт: снова общий шаблон');
  auto.app.unmount();
});

test('шаблон + raw: в модели только цифры', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: masks.date(), placeholder: '_' }, { raw: true });
  el.focus();
  await sleep(5);
  assert.equal(el.value, '__.__.____');
  type(el, '3505');
  await nextTick();
  // 3 — день; 5 после 3 невозможна и пропускается; 0 — второй знак дня; 5 как первая цифра месяца невозможна
  assert.equal(el.value, '30.__.____');
  assert.equal(model.value, '30');
  type(el, '12');
  await nextTick();
  assert.equal(el.value, '30.12.____');
  assert.equal(model.value, '3012');
  app.unmount();
});

test('phoneAuto в поле: маска меняется при вводе кода, курсор в конце', () => {
  const el = field();
  const states = [];
  const m = phoneAuto();
  attach(el, m, { onChange: (s) => states.push(s) });
  type(el, '+375291234567');
  assert.equal(el.value, '+375 (29) 123-45-67');
  assert.equal(el.selectionStart, el.value.length);
  assert.equal(m.country(el.value).code, 'by');
  assert.deepEqual(states.at(-1), { value: '+375 (29) 123-45-67', raw: '375291234567', complete: true, valid: true });
  // стираем всё и вводим другую страну
  while (el.value) backspace(el);
  type(el, '+79991234567');
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(m.country(el.value).code, 'ru');
});

test('phoneAuto + шаблон + raw: местный номер по умолчанию', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: phoneAuto({ defaultCountry: 'ru' }), placeholder: '_' }, { raw: true });
  el.focus();
  type(el, '9991234567');
  await nextTick();
  assert.equal(el.value, '+7 (999) 123-45-67');
  assert.equal(model.value, '79991234567');
  app.unmount();
});

test('phoneAuto + шаблон: смена страны вводом +', async () => {
  const model = ref('');
  const { el, app } = mountInput(model, { mask: phoneAuto({ defaultCountry: 'ru' }), placeholder: '_' }, { raw: true });
  el.focus();
  await sleep(5);
  assert.equal(el.value, '+7 (___) ___-__-__');
  type(el, '+375291234567');
  await nextTick();
  assert.equal(el.value, '+375 (29) 123-45-67');
  assert.equal(model.value, '375291234567');
  app.unmount();
});

test('attach.valid и onChange в v-mask: только при изменении состояния', async () => {
  const states = [];
  const model = ref('');
  const tick = ref(0);
  const date = masks.date();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createApp({
    render: () =>
      withDirectives(h('input', { 'data-tick': tick.value, 'onUpdate:modelValue': (v) => (model.value = v) }), [
        [vModelText, model.value],
        // объект создаётся заново при каждой перерисовке — onChange не должен зацикливаться
        [vMask, { mask: date, onChange: (s) => states.push(s) }],
      ]),
  });
  app.mount(root);
  const el = root.querySelector('input');
  el.focus();
  type(el, '31022026');
  await nextTick();
  assert.deepEqual(states.at(-1), { value: '31.02.2026', raw: '31022026', complete: true, valid: false });
  const count = states.length;
  tick.value++; // перерисовка без изменений значения
  await nextTick();
  assert.equal(el.getAttribute('data-tick'), '1', 'перерисовка произошла');
  assert.equal(states.length, count, 'без изменений onChange не вызывается');
  backspace(el);
  type(el, '5');
  await nextTick();
  assert.equal(el.value, '31.02.2025');
  assert.equal(states.at(-1).valid, false);
  app.unmount();

  const field2 = field();
  const a = attach(field2, masks.card());
  type(field2, '4111111111111111');
  assert.equal(a.complete, true);
  assert.equal(a.valid, true);
});
