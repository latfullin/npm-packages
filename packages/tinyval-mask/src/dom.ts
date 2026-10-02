// attach — маска на <input>: форматирование при вводе и вставке, курсор не прыгает, Backspace через литералы
import { toMask, type Mask, type MaskInput, type MaskResult } from './core.js';

export interface MaskState {
  value: string;
  raw: string;
  complete: boolean;
}

export interface AttachOptions {
  onChange?: (state: MaskState) => void;
}

export interface AttachedMask {
  readonly raw: string;
  readonly complete: boolean;
  update(mask: MaskInput): void;
  destroy(): void;
}

export function attach(input: HTMLInputElement, maskInput: MaskInput, options: AttachOptions = {}): AttachedMask {
  let m: Mask = toMask(maskInput);
  let last: MaskResult;

  // курсор — после n-го введённого символа
  const caretAt = (r: MaskResult, n: number) => (n === 0 ? (r.slots[0] ?? r.value.length) : r.slots[n - 1] + 1);
  const rawLength = (s: string) => m.process(s).raw.length;

  function apply(value: string, caret: number | null) {
    const r = (last = m.process(value));
    if (input.value !== r.value) input.value = r.value;
    if (caret !== null && input.ownerDocument.activeElement === input) {
      const pos = caretAt(r, Math.min(caret, r.slots.length));
      input.setSelectionRange(pos, pos);
    }
    options.onChange?.({ value: r.value, raw: m.output(r), complete: r.complete });
  }

  const notify = () => input.dispatchEvent(new Event('input', { bubbles: true }));

  const onInput = () => {
    const c = input.selectionStart ?? input.value.length;
    apply(input.value, rawLength(input.value.slice(0, c)));
  };

  // Backspace / Delete рядом с литералом удаляет ближайший введённый символ, а не «застревает» на ) или -
  const onBeforeInput = (e: Event) => {
    const type = (e as InputEvent).inputType;
    const back = type === 'deleteContentBackward';
    if (!back && type !== 'deleteContentForward') return;
    const s = input.selectionStart;
    if (s === null || s !== input.selectionEnd) return;
    const slots = m.process(input.value).slots;
    if (back ? s === 0 || slots.includes(s - 1) : slots.includes(s)) return;
    const j = back ? [...slots].reverse().find((x) => x < s) : slots.find((x) => x > s);
    if (j === undefined) return;
    e.preventDefault();
    const v = input.value.slice(0, j) + input.value.slice(j + 1);
    apply(v, rawLength(v.slice(0, back ? j : s)));
    notify();
  };

  // capture — чтобы отформатировать раньше обработчиков фреймворка (v-model читает уже готовое значение)
  input.addEventListener('input', onInput, true);
  input.addEventListener('beforeinput', onBeforeInput);
  apply(input.value, null);

  return {
    get raw() {
      return m.output(last);
    },
    get complete() {
      return last.complete;
    },
    update(next) {
      m = toMask(next);
      apply(input.value, null);
    },
    destroy() {
      input.removeEventListener('input', onInput, true);
      input.removeEventListener('beforeinput', onBeforeInput);
    },
  };
}
