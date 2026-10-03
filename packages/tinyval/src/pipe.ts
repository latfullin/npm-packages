import { createSchema, FAIL, fail, type Message, type Schema } from './core.js';

export interface Info {
  // Объект, в котором лежит поле (исходные данные), и корень всех данных
  parent: unknown;
  root: unknown;
}

// k: 0 — проверка, 1 — преобразование, 2 — асинхронная проверка
export interface Action<T> {
  k: 0 | 1 | 2;
  f: (value: T, info: Info) => unknown;
  // код ошибки; функция — если код зависит от значения (minLength у строки, minItems у массива)
  c?: string | ((value: T) => string);
  m?: Message;
  p?: Record<string, unknown>;
}

const code = <T>(a: Action<T>, v: T) => (typeof a.c === 'function' ? a.c(v) : (a.c ?? 'invalid'));

export function pipe<T>(schema: Schema<T>, ...actions: Action<T>[]): Schema<T> {
  return createSchema((v, ctx, path, parent) => {
    let r = schema.run(v, ctx, path, parent);
    if (r === FAIL) return r;
    const info: Info = { parent, root: ctx.root };
    const deferred: Action<T>[] = [];
    let ok = true;
    for (const a of actions) {
      if (a.k === 2) deferred.push(a);
      else if (a.k === 1) {
        if (ok) r = a.f(r, info) as T;
      } else if (!a.f(r, info)) {
        fail(ctx, path, code(a, r), a.m, a.p);
        ok = false;
        if (!ctx.all || ctx.abort) break;
      }
    }
    if (!ok) return FAIL;
    // Асинхронные проверки запускаются, только если синхронные прошли
    const value = r;
    for (const a of deferred) {
      ctx.pending.push(
        Promise.resolve(a.f(value, info)).then((res) => {
          if (!res) fail(ctx, path, code(a, value), a.m, a.p);
        }),
      );
    }
    return r;
  });
}

const rule = <T>(c: string | ((v: T) => string), f: (v: T, info: Info) => boolean, m?: Message, p?: Record<string, unknown>): Action<T> => ({
  k: 0,
  f,
  c,
  m,
  p,
});

export const check = <T>(fn: (value: T, info: Info) => boolean, msg?: Message): Action<T> => rule('invalid', fn, msg);

export const checkAsync = <T>(fn: (value: T, info: Info) => Promise<boolean> | boolean, msg?: Message): Action<T> => ({
  k: 2,
  f: fn,
  c: 'invalid',
  m: msg,
});

type Sized = { length: number };

// у строки — символы (minLength), у массива — элементы (minItems): разные тексты сообщений
const sized = (str: string, arr: string) => (v: Sized) => (Array.isArray(v) ? arr : str);

export const minLength = (min: number, msg?: Message): Action<Sized> =>
  rule(sized('minLength', 'minItems'), (v) => v.length >= min, msg, { min });

export const maxLength = (max: number, msg?: Message): Action<Sized> =>
  rule(sized('maxLength', 'maxItems'), (v) => v.length <= max, msg, { max });

export const length = (length: number, msg?: Message): Action<Sized> =>
  rule(sized('length', 'items'), (v) => v.length === length, msg, { length });

export const min = (min: number, msg?: Message): Action<number> => rule('min', (v) => v >= min, msg, { min });

export const max = (max: number, msg?: Message): Action<number> => rule('max', (v) => v <= max, msg, { max });

export const integer = (msg?: Message): Action<number> => rule('integer', Number.isInteger, msg);

export const pattern = (re: RegExp, msg?: Message, code = 'pattern'): Action<string> =>
  rule(
    code,
    (v) => {
      re.lastIndex = 0;
      return re.test(v);
    },
    msg,
  );

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const email = (msg?: Message): Action<string> => pattern(EMAIL_RE, msg, 'email');

// Совпадает с соседним полем: sameAs('password')
export const sameAs = (field: string, msg?: Message): Action<unknown> =>
  rule('sameAs', (v, { parent }) => (parent as Record<string, unknown> | undefined)?.[field] === v, msg, { field });

const map = <T>(f: (v: T) => T): Action<T> => ({ k: 1, f });

export const trim = (): Action<string> => map((v) => v.trim());
export const toLowerCase = (): Action<string> => map((v) => v.toLowerCase());
export const toUpperCase = (): Action<string> => map((v) => v.toUpperCase());

// ---------- числа и строки

export const between = (min: number, max: number, msg?: Message): Action<number> =>
  rule('between', (v) => v >= min && v <= max, msg, { min, max });

// Ссылка: по умолчанию только http и https
export const url = (msg?: Message, protocols: string[] = ['http', 'https']): Action<string> =>
  rule(
    'url',
    (v) => {
      try {
        return protocols.includes(new URL(v).protocol.slice(0, -1));
      } catch {
        return false;
      }
    },
    msg,
  );

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const uuid = (msg?: Message): Action<string> => pattern(UUID_RE, msg, 'uuid');

export const startsWith = (value: string, msg?: Message): Action<string> =>
  rule('startsWith', (v) => v.startsWith(value), msg, { value });

export const endsWith = (value: string, msg?: Message): Action<string> =>
  rule('endsWith', (v) => v.endsWith(value), msg, { value });

export const includes = (value: string, msg?: Message): Action<string> =>
  rule('includes', (v) => v.includes(value), msg, { value });

// Элементы массива не повторяются; by — по какому значению сравнивать объекты: unique((u) => u.email)
export const unique = <T = unknown>(by?: (item: T) => unknown, msg?: Message): Action<T[]> =>
  rule(
    'unique',
    (v) => {
      const keys = by ? v.map(by) : v;
      return new Set(keys.map((k) => (k !== null && typeof k === 'object' ? JSON.stringify(k) : k))).size === v.length;
    },
    msg,
  );

// ---------- даты

type DateLike = Date | string | number | (() => Date);
const toDate = (d: DateLike) => (typeof d === 'function' ? d() : new Date(d));
const day = (d: Date) => (Number.isNaN(d.getTime()) ? String(d) : d.toISOString().slice(0, 10));

// дата для сравнения считается при каждой проверке — так работает minDate(() => new Date())
const dateRule = (code: string, ok: (v: number, d: number) => boolean) => (date: DateLike, msg?: Message): Action<Date> => {
  const a: Action<Date> = {
    k: 0,
    c: code,
    m: msg,
    f: (v) => {
      const d = toDate(date);
      a.p = { date: day(d) };
      return ok(v.getTime(), d.getTime());
    },
  };
  return a;
};

// Не раньше даты: minDate('2026-01-01') или minDate(() => new Date()) — «не раньше сегодня»
export const minDate = dateRule('minDate', (v, d) => v >= d);
export const maxDate = dateRule('maxDate', (v, d) => v <= d);

// Позже / раньше соседнего поля: after('start'). Если соседнее поле не дата — его ошибку покажет его схема
const sibling = (field: string, cmp: (v: number, other: number) => boolean) => (v: Date, { parent }: Info) => {
  const raw = (parent as Record<string, unknown> | undefined)?.[field];
  const other = raw instanceof Date ? raw : new Date(raw as string);
  return raw == null || raw === '' || Number.isNaN(other.getTime()) || cmp(v.getTime(), other.getTime());
};

export const after = (field: string, msg?: Message): Action<Date> => rule('after', sibling(field, (v, o) => v > o), msg, { field });
export const before = (field: string, msg?: Message): Action<Date> => rule('before', sibling(field, (v, o) => v < o), msg, { field });

// ---------- контрольные суммы (пробелы и дефисы в значении допускаются)

const digitsOf = (v: string) => {
  const d = v.replace(/[\s-]/g, '');
  return /^\d+$/.test(d) ? d.split('').map(Number) : null;
};
const weighted = (d: number[], w: number[]) => w.reduce((s, x, i) => s + x * d[i], 0);

// ИНН: 10 цифр (организация) или 12 (физлицо, ИП)
export function isInn(v: string): boolean {
  const d = digitsOf(v);
  if (!d) return false;
  const c = (w: number[]) => (weighted(d, w) % 11) % 10;
  if (d.length === 10) return c([2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[9];
  if (d.length === 12) return c([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[10] && c([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[11];
  return false;
}

// СНИЛС: 11 цифр, последние две — контрольное число
export function isSnils(v: string): boolean {
  const d = digitsOf(v);
  if (!d || d.length !== 11) return false;
  const sum = weighted(d, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
  const control = sum < 100 ? sum : sum === 100 || sum === 101 ? 0 : sum % 101 === 100 ? 0 : sum % 101;
  return control === d[9] * 10 + d[10];
}

// Номер карты по алгоритму Луна, 12–19 цифр
export function isLuhn(v: string): boolean {
  const d = digitsOf(v);
  if (!d || d.length < 12 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let x = d[d.length - 1 - i];
    if (i % 2) x = x * 2 > 9 ? x * 2 - 9 : x * 2;
    sum += x;
  }
  return sum % 10 === 0;
}

export const inn = (msg?: Message): Action<string> => rule('inn', isInn, msg);
export const snils = (msg?: Message): Action<string> => rule('snils', isSnils, msg);
export const luhn = (msg?: Message): Action<string> => rule('luhn', isLuhn, msg);
