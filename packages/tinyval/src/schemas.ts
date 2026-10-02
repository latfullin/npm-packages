import { FAIL, fail, has, isEmpty, type Infer, type Message, type Schema } from './core.js';

function type<T>(code: string, test: (v: unknown) => boolean, msg?: Message, params?: Record<string, unknown>): Schema<T> {
  return {
    run: (v, ctx, path) =>
      isEmpty(v) ? fail(ctx, path, 'required', msg) : test(v) ? (v as T) : fail(ctx, path, code, msg, params),
  };
}

export const string = (msg?: Message): Schema<string> => type('string', (v) => typeof v === 'string', msg);

export const number = (msg?: Message): Schema<number> =>
  type('number', (v) => typeof v === 'number' && Number.isFinite(v), msg);

export const boolean = (msg?: Message): Schema<boolean> => type('boolean', (v) => typeof v === 'boolean', msg);

export const date = (msg?: Message): Schema<Date> =>
  type('date', (v) => v instanceof Date && !Number.isNaN(v.getTime()), msg);

export const literal = <const T extends string | number | boolean>(value: T, msg?: Message): Schema<T> =>
  type('literal', (v) => v === value, msg, { expected: value });

export const oneOf = <const T extends readonly (string | number | boolean)[]>(
  values: T,
  msg?: Message,
): Schema<T[number]> => type('oneOf', (v) => values.includes(v as T[number]), msg, { options: values.join(', ') });

export const unknown = (): Schema<unknown> => ({ run: (v) => v });

export function optional<T>(schema: Schema<T>): Schema<T | undefined>;
export function optional<T>(schema: Schema<T>, def: T | (() => T)): Schema<T>;
export function optional<T>(schema: Schema<T>, def?: T | (() => T)): Schema<T | undefined> {
  return {
    run: (v, ctx, path, parent) =>
      v === undefined || v === ''
        ? typeof def === 'function'
          ? (def as () => T)()
          : def
        : schema.run(v, ctx, path, parent),
  };
}

export const nullable = <T>(schema: Schema<T>): Schema<T | null> => ({
  run: (v, ctx, path, parent) => (v === null ? null : schema.run(v, ctx, path, parent)),
});

type Shape = Record<string, Schema<any>>;
type Flat<T> = { [K in keyof T]: T[K] } & {};
type OptKeys<S extends Shape> = { [K in keyof S]: undefined extends Infer<S[K]> ? K : never }[keyof S];

export type ObjectOut<S extends Shape> = Flat<
  { [K in Exclude<keyof S, OptKeys<S>>]: Infer<S[K]> } & { [K in OptKeys<S>]?: Infer<S[K]> }
>;

export interface ObjectOptions {
  // strip — удалить лишние поля (по умолчанию), strict — ошибка, passthrough — оставить
  unknown?: 'strip' | 'strict' | 'passthrough';
  message?: Message;
}

export function object<S extends Shape>(shape: S, opts: ObjectOptions = {}): Schema<ObjectOut<S>> {
  const keys = Object.keys(shape);
  const mode = opts.unknown ?? 'strip';
  return {
    run(v, ctx, path) {
      if (isEmpty(v)) return fail(ctx, path, 'required', opts.message);
      if (typeof v !== 'object' || Array.isArray(v)) return fail(ctx, path, 'object', opts.message);
      const input = v as Record<string, unknown>;
      const out: Record<string, unknown> = mode === 'passthrough' ? { ...input } : {};
      let ok = true;
      for (const k of keys) {
        const r = shape[k].run(has(input, k) ? input[k] : undefined, ctx, { k, p: path }, input);
        if (r === FAIL) ok = false;
        else if (r !== undefined) out[k] = r;
        else if (mode === 'passthrough') delete out[k];
      }
      if (mode === 'strict') {
        for (const k in input) {
          if (has(input, k) && !has(shape, k)) {
            fail(ctx, { k, p: path }, 'unknownKey');
            ok = false;
          }
        }
      }
      return ok ? (out as ObjectOut<S>) : FAIL;
    },
  };
}

export function array<T>(item: Schema<T>, msg?: Message): Schema<T[]> {
  return {
    run(v, ctx, path) {
      if (isEmpty(v)) return fail(ctx, path, 'required', msg);
      if (!Array.isArray(v)) return fail(ctx, path, 'array', msg);
      const out: T[] = new Array(v.length);
      let ok = true;
      for (let i = 0; i < v.length; i++) {
        const r = item.run(v[i], ctx, { k: i, p: path }, v);
        if (r === FAIL) ok = false;
        else out[i] = r;
      }
      return ok ? out : FAIL;
    },
  };
}

// Меняет тип результата: transform(string(), (s) => s.split(','))
export const transform = <T, U>(schema: Schema<T>, fn: (value: T) => U): Schema<U> => ({
  run(v, ctx, path, parent) {
    const r = schema.run(v, ctx, path, parent);
    return r === FAIL ? FAIL : fn(r);
  },
});

// Подготавливает входное значение до проверки
export const preprocess = <T>(fn: (value: unknown) => unknown, schema: Schema<T>): Schema<T> => ({
  run: (v, ctx, path, parent) => schema.run(fn(v), ctx, path, parent),
});
