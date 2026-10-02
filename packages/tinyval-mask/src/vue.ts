// tinyval-mask/vue — директива v-mask. Импорт из vue только для типов: директива — обычный объект
import type { Directive } from 'vue';
import type { MaskInput } from './core.js';
import { attach, type AttachedMask } from './dom.js';

const KEY = Symbol('tinyval-mask');
type El = HTMLElement & { [KEY]?: AttachedMask };

// На <input> или на компоненте, внутри которого есть <input> (поля UI-библиотек)
const findInput = (el: HTMLElement) => (el.tagName === 'INPUT' ? (el as HTMLInputElement) : el.querySelector('input'));

export const vMask: Directive<HTMLElement, MaskInput> = {
  mounted(el, { value }) {
    const input = findInput(el);
    if (input) (el as El)[KEY] = attach(input, value);
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) (el as El)[KEY]?.update(value);
  },
  unmounted(el) {
    (el as El)[KEY]?.destroy();
  },
};
