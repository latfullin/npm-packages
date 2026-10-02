import { FAIL, fail, type Message, type Schema } from './core.js';

export interface Info {
  // Объект, в котором лежит поле (исходные данные), и корень всех данных
  parent: unknown;
  root: unknown;
}

// k: 0 — проверка, 1 — преобразование, 2 — асинхронная проверка
export interface Action<T> {
  k: 0 | 1 | 2;
  f: (value: T, info: Info) => unknown;
  c?: string;
  m?: Message;
  p?: Record<string, unknown>;
}

export function pipe<T>(schema: Schema<T>, ...actions: Action<T>[]): Schema<T> {
  return {
    run(v, ctx, path, parent) {
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
          fail(ctx, path, a.c ?? 'invalid', a.m, a.p);
          ok = false;
          if (!ctx.all) break;
        }
      }
      if (!ok) return FAIL;
      // Асинхронные проверки запускаются, только если синхронные прошли
      const value = r;
      for (const a of deferred) {
        ctx.pending.push(
          Promise.resolve(a.f(value, info)).then((res) => {
            if (!res) fail(ctx, path, a.c ?? 'invalid', a.m, a.p);
          }),
        );
      }
      return r;
    },
  };
}

const rule = <T>(c: string, f: (v: T, info: Info) => boolean, m?: Message, p?: Record<string, unknown>): Action<T> => ({
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

export const minLength = (min: number, msg?: Message): Action<Sized> =>
  rule('minLength', (v) => v.length >= min, msg, { min });

export const maxLength = (max: number, msg?: Message): Action<Sized> =>
  rule('maxLength', (v) => v.length <= max, msg, { max });

export const length = (length: number, msg?: Message): Action<Sized> =>
  rule('length', (v) => v.length === length, msg, { length });

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
