// Маски по шаблону: 9 — цифра, a — буква, * — буква или цифра, [ ] — необязательная часть, \ — экранирование

export interface Token {
  pattern: RegExp;
  transform?: 'upper' | 'lower' | ((char: string) => string);
}

export interface MaskResult {
  // Отформатированное значение для поля
  value: string;
  // Введённые символы без литералов маски
  raw: string;
  // Все обязательные позиции заполнены
  complete: boolean;
  // Позиции введённых символов в value — по ним ставится курсор
  slots: number[];
  // Во вводе остались символы, которые не поместились в шаблон
  overflow: boolean;
}

export interface Mask {
  process(input: string): MaskResult;
  // Значение для данных (unmask): по умолчанию raw
  output(result: MaskResult): string;
}

export type Pattern = string | readonly string[] | ((input: string) => string);

export interface MaskOptions {
  pattern: Pattern;
  tokens?: Record<string, Token>;
  // Подготовка ввода перед форматированием: например, 8 → 7 в начале номера
  prepare?: (input: string) => string;
  output?: (result: MaskResult) => string;
}

export type MaskInput = Mask | MaskOptions | string | readonly string[];

export const defaultTokens: Record<string, Token> = {
  '9': { pattern: /\d/ },
  a: { pattern: /\p{L}/u },
  '*': { pattern: /[\p{L}\d]/u },
};

// opt — номер необязательной группы [ ] (0 — обязательная часть): группа заполняется целиком или не заполняется
type Element = { t: Token; opt: number } | { c: string; opt: number };

function compile(pattern: string, tokens: Record<string, Token>): Element[] {
  const out: Element[] = [];
  let opt = 0;
  let group = 0;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '\\') out.push({ c: pattern[++i] ?? '', opt });
    else if (ch === '[') opt = ++group;
    else if (ch === ']') opt = 0;
    else out.push(tokens[ch] ? { t: tokens[ch], opt } : { c: ch, opt });
  }
  return out;
}

const apply = (t: Token, ch: string) =>
  t.transform === 'upper' ? ch.toUpperCase() : t.transform === 'lower' ? ch.toLowerCase() : t.transform ? t.transform(ch) : ch;

const test = (t: Token, ch: string) => {
  t.pattern.lastIndex = 0;
  return t.pattern.test(ch);
};

function run(els: Element[], input: string): MaskResult {
  let value = '';
  let raw = '';
  let i = 0;
  // где обрезать хвост: после последнего введённого символа или совпавшего литерала
  let end = 0;
  let complete = true;
  const slots: number[] = [];
  const started = new Set<number>();
  const tokens = els.filter((e): e is { t: Token; opt: number } => 't' in e);
  const accepts = (ch: string) => tokens.some((e) => test(e.t, ch));

  // Литералы в начале шаблона, которые похожи на ввод (код страны +998): если ввод начинается не с них же,
  // код пропускается, только когда цифр больше, чем вмещает шаблон, — иначе первая 9 номера «съедалась» бы кодом
  let lead = 0;
  while (lead < els.length && 'c' in els[lead]) lead++;
  const leadChars = els
    .slice(0, lead)
    .map((e) => (e as { c: string }).c)
    .filter(accepts)
    .join('');
  const explicit = !leadChars || input.trimStart().startsWith((els[0] as { c?: string }).c ?? '');
  if (!explicit) {
    const typed = [...input].filter(accepts);
    if (typed.length > tokens.length && typed.join('').startsWith(leadChars)) {
      for (let n = 0; n < leadChars.length; i++) if (accepts(input[i])) n++;
    }
  }

  let k = 0;
  for (; k < els.length; k++) {
    const el = els[k];
    if (i >= input.length) break;
    if ('c' in el) {
      value += el.c;
      if ((explicit || k >= lead) && input[i] === el.c) {
        i++;
        end = value.length;
      }
      continue;
    }
    // символы, которые сюда не подходят, пропускаются
    while (i < input.length && !test(el.t, input[i])) i++;
    if (i >= input.length) break;
    slots.push(value.length);
    if (el.opt) started.add(el.opt);
    const ch = apply(el.t, input[i++]);
    value += ch;
    raw += ch;
    end = value.length;
  }
  for (; k < els.length; k++) {
    const el = els[k];
    if ('t' in el && (!el.opt || started.has(el.opt))) complete = false;
  }
  const overflow = [...input.slice(i)].some(accepts);
  return { value: value.slice(0, end), raw, complete, slots, overflow };
}

export function createMask(options: MaskOptions | string | readonly string[]): Mask {
  const o: MaskOptions = typeof options === 'string' || Array.isArray(options) ? { pattern: options as Pattern } : (options as MaskOptions);
  const tokens = { ...defaultTokens, ...o.tokens };
  const cache = new Map<string, Element[]>();
  const get = (p: string) => {
    let els = cache.get(p);
    if (!els) cache.set(p, (els = compile(p, tokens)));
    return els;
  };
  const patterns = typeof o.pattern === 'function' ? null : (Array.isArray(o.pattern) ? o.pattern : [o.pattern]) as string[];
  return {
    process(input) {
      const s = o.prepare ? o.prepare(input) : input;
      if (!patterns) return run(get((o.pattern as (input: string) => string)(s)), s);
      // несколько шаблонов: первый, в который ввод помещается целиком
      let r!: MaskResult;
      for (const p of patterns) {
        r = run(get(p), s);
        if (!r.overflow) break;
      }
      return r;
    },
    output: o.output ?? ((r) => r.raw),
  };
}

export const toMask = (m: MaskInput): Mask => (typeof m === 'object' && 'process' in m ? m : createMask(m));

// Отформатировать значение: mask('79991234567', masks.phone()) → '+7 (999) 123-45-67'
export const mask = (value: string, m: MaskInput): string => toMask(m).process(String(value ?? '')).value;

// Значение без маски: unmask('+7 (999) 123-45-67', masks.phone()) → '79991234567'
export function unmask(value: string, m: MaskInput): string {
  const x = toMask(m);
  return x.output(x.process(String(value ?? '')));
}

export const isComplete = (value: string, m: MaskInput): boolean => toMask(m).process(String(value ?? '')).complete;
