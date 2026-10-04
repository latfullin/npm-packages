// attach — маска на <input>: форматирование при вводе и вставке, курсор не прыгает, Backspace через литералы,
// видимый шаблон (+7 (___) ___-__-__) и значение без маски для v-model / обработчиков
import { toMask, type Mask, type MaskInput, type MaskResult } from './core.js';

export interface MaskState {
  value: string;
  raw: string;
  complete: boolean;
  // заполнено и правильно по смыслу — см. isValid
  valid: boolean;
}

export interface AttachOptions {
  onChange?: (state: MaskState) => void;
  // Обработчики ввода (v-model, @input) получают значение без маски: 79991234567. В поле при этом видна маска
  raw?: boolean;
  // Символ для пустых позиций: '_' → +7 (999) ___-__-__. Шаблон виден при фокусе и пока поле заполнено не до конца
  placeholder?: string;
}

export interface AttachedMask {
  readonly raw: string;
  readonly complete: boolean;
  readonly valid: boolean;
  update(mask: MaskInput, options?: AttachOptions): void;
  // Переформатировать значение, которое записали в поле из кода (например, v-model), сохранив курсор
  refresh(): void;
  destroy(): void;
}

export function attach(input: HTMLInputElement, maskInput: MaskInput, options: AttachOptions = {}): AttachedMask {
  let m: Mask = toMask(maskInput);
  let opts = options;
  let last!: MaskResult;
  // курсор считается в введённых символах — так его можно вернуть после перерисовки фреймворком
  let caretRaw: number | null = null;
  // значение с маской, которое нужно вернуть в поле после обработчиков ввода
  let restore: { value: string; start: number | null; end: number | null } | null = null;
  // onChange — только при реальном изменении: перерисовка фреймворком не должна вызывать его снова
  let reported: string | undefined;

  const focused = () => input.ownerDocument.activeElement === input;
  const rawLength = (s: string) => m.process(s).raw.length;

  // что видно в поле: значение с маской и, при необходимости, хвост шаблона
  const display = (r: MaskResult) => {
    const ph = opts.placeholder;
    if (!ph || !m.template) return r.value;
    // без введённых символов поле вне фокуса пустое — видна обычная подсказка placeholder
    if (!r.raw && !focused()) return '';
    return r.value + m.template(r.value, ph).slice(r.value.length);
  };
  // что получают обработчики ввода и v-model
  const model = (r: MaskResult) => (opts.raw ? m.output(r) : opts.placeholder && !r.raw ? '' : r.value);

  // курсор — после n-го введённого символа; если ничего не введено — на первой пустой позиции
  function caretAt(r: MaskResult, shown: string, n: number) {
    if (n > 0) return r.slots[n - 1] + 1;
    if (r.slots.length) return r.slots[0];
    const empty = opts.placeholder ? shown.indexOf(opts.placeholder, r.value.length) : -1;
    return empty >= 0 ? empty : r.value.length;
  }

  function apply(value: string, caret: number | null): MaskResult {
    const r = (last = m.process(value));
    const shown = display(r);
    if (input.value !== shown) input.value = shown;
    if (caret !== null) caretRaw = Math.min(caret, r.slots.length);
    if (caret !== null && focused()) {
      const pos = caretAt(r, shown, caretRaw!);
      input.setSelectionRange(pos, pos);
    }
    const state: MaskState = { value: r.value, raw: m.output(r), complete: r.complete, valid: r.valid };
    const key = JSON.stringify(state);
    if (key !== reported) {
      reported = key;
      opts.onChange?.(state);
    }
    return r;
  }

  const notify = () => input.dispatchEvent(new Event('input', { bubbles: true }));

  // capture — раньше обработчиков фреймворка: они читают уже обработанное значение
  const onInput = () => {
    let v = input.value;
    let c = input.selectionStart ?? v.length;
    // вставка в пустое поле — вставленный текст и есть значение: 8 999 … в шаблон +7 (___) … даёт +7 (999) …, а не +7 (899) …
    if (!last.raw) {
      const prev = display(last);
      let p = 0;
      while (p < prev.length && p < v.length && prev[p] === v[p]) p++;
      let q = 0;
      while (q < prev.length - p && q < v.length - p && prev[prev.length - 1 - q] === v[v.length - 1 - q]) q++;
      const chunk = v.slice(p, v.length - q);
      if (chunk.length > 1) c = (v = chunk).length;
    }
    const r = apply(v, rawLength(v.slice(0, c)));
    const value = model(r);
    if (value !== input.value) {
      // на время обработчиков в поле — значение для данных (без маски или без шаблона)
      restore = { value: input.value, start: input.selectionStart, end: input.selectionEnd };
      input.value = value;
    }
  };

  // после всех обработчиков — вернуть в поле маску и курсор
  const onInputAfter = () => {
    if (!restore) return;
    input.value = restore.value;
    if (focused() && restore.start !== null) input.setSelectionRange(restore.start, restore.end);
    restore = null;
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

  // с шаблоном: при фокусе показать его и поставить курсор после введённого, при уходе — убрать у пустого поля
  const onFocus = () => {
    if (!opts.placeholder) return;
    apply(input.value, last.raw.length);
    // браузер ставит курсор по месту клика уже после focus. Выделение (Tab, «выделить всё» перед вставкой) не трогаем —
    // иначе вставка попадёт после шаблона, а не заменит значение
    setTimeout(() => focused() && input.selectionStart === input.selectionEnd && apply(input.value, last.raw.length), 0);
  };
  const onBlur = () => {
    if (opts.placeholder) apply(input.value, null);
  };
  // клик по пустой части шаблона — курсор на первую пустую позицию
  const onClick = () => {
    if (!opts.placeholder || input.selectionStart !== input.selectionEnd) return;
    const end = caretAt(last, input.value, last.raw.length);
    if ((input.selectionStart ?? 0) > end) input.setSelectionRange(end, end);
  };

  input.addEventListener('input', onInput, true);
  input.addEventListener('input', onInputAfter);
  input.addEventListener('beforeinput', onBeforeInput);
  input.addEventListener('focus', onFocus);
  input.addEventListener('blur', onBlur);
  input.addEventListener('click', onClick);
  apply(input.value, null);

  return {
    get raw() {
      return m.output(last);
    },
    get complete() {
      return last.complete;
    },
    get valid() {
      return last.valid;
    },
    update(next, nextOptions) {
      m = toMask(next);
      if (nextOptions) opts = nextOptions;
      apply(input.value, focused() ? caretRaw : null);
    },
    refresh() {
      // фреймворк записал в поле то же, что мы отдали модели, — ничего не изменилось, возвращаем показ как был.
      // Важно для состояний, которые модель не хранит: введённый + до кода страны, незаполненный шаблон
      if (input.value === model(last)) {
        const shown = display(last);
        if (input.value !== shown) input.value = shown;
        if (focused() && caretRaw !== null) {
          const pos = caretAt(last, shown, caretRaw);
          input.setSelectionRange(pos, pos);
        }
        return;
      }
      apply(input.value, focused() ? caretRaw : null);
    },
    destroy() {
      input.removeEventListener('input', onInput, true);
      input.removeEventListener('input', onInputAfter);
      input.removeEventListener('beforeinput', onBeforeInput);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('click', onClick);
    },
  };
}
