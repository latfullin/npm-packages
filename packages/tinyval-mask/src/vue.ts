// tinyval-mask/vue — директива v-mask. Импорт из vue только для типов: директива — обычный объект
//
//   v-mask="phoneMask"                                — маска, в v-model значение с маской
//   v-mask.raw="phoneMask"                            — в v-model значение без маски: 79991234567
//   v-mask="{ mask: phoneMask, placeholder: '_' }"    — видимый шаблон +7 (___) ___-__-__
import type { Directive, DirectiveBinding } from 'vue';
import type { MaskInput } from './core.js';
import { attach, type AttachedMask, type AttachOptions } from './dom.js';

export type MaskBinding = MaskInput | ({ mask: MaskInput } & Omit<AttachOptions, 'onChange'>);

const KEY = Symbol('tinyval-mask');
type El = HTMLElement & { [KEY]?: AttachedMask };

// На <input> или на компоненте, внутри которого есть <input> (поля UI-библиотек)
const findInput = (el: HTMLElement) => (el.tagName === 'INPUT' ? (el as HTMLInputElement) : el.querySelector('input'));

function parse({ value, modifiers }: DirectiveBinding<MaskBinding>): [MaskInput, AttachOptions] {
  const o = value && typeof value === 'object' && 'mask' in value ? value : { mask: value as MaskInput };
  return [o.mask, { placeholder: o.placeholder, raw: !!(modifiers.raw || o.raw) }];
}

export const vMask: Directive<HTMLElement, MaskBinding> = {
  mounted(el, binding) {
    const input = findInput(el);
    if (input) (el as El)[KEY] = attach(input, ...parse(binding));
  },
  updated(el, binding) {
    const attached = (el as El)[KEY];
    if (!attached) return;
    if (binding.value !== binding.oldValue) attached.update(...parse(binding));
    // v-model мог записать в поле значение из модели (без маски) — вернуть маску и курсор
    else attached.refresh();
  },
  unmounted(el) {
    (el as El)[KEY]?.destroy();
  },
};
