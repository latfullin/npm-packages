// Поведение в поле ввода: happy-dom вместо браузера. Vue читает document при загрузке — импорт после настройки окружения
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const window = new Window();
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'SVGElement', 'Event', 'InputEvent', 'MathMLElement']) {
  globalThis[key] = key === 'window' ? window : window[key];
}

const { attach, masks, numberMask } = await import('../dist/index.js');
const { vMask } = await import('../dist/vue.js');
const { createApp, h, ref, withDirectives, vModelText, nextTick } = await import('vue');

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
  assert.deepEqual(states.at(-1), { value: '+7 (999) 123-45-67', raw: '79991234567', complete: true });
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
