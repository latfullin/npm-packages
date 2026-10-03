import {
  createSchema,
  FAIL,
  fail,
  has,
  isEmpty,
  newCtx,
  put,
  toPath,
  type Infer,
  type Message,
  type Schema,
} from './core.js';

function type<T>(code: string, test: (v: unknown) => boolean, msg?: Message, params?: Record<string, unknown>): Schema<T> {
  return createSchema((v, ctx, path) =>
    isEmpty(v) ? fail(ctx, path, 'required', msg) : test(v) ? (v as T) : fail(ctx, path, code, msg, params),
  );
}

// Схема с известным списком значений — его использует variant для сообщения об ошибке
export type ValuesSchema<T> = Schema<T> & { readonly values: readonly T[] };

export const string = (msg?: Message): Schema<string> => type('string', (v) => typeof v === 'string', msg);

export const number = (msg?: Message): Schema<number> =>
  type('number', (v) => typeof v === 'number' && Number.isFinite(v), msg);

export const boolean = (msg?: Message): Schema<boolean> => type('boolean', (v) => typeof v === 'boolean', msg);

export const date = (msg?: Message): Schema<Date> =>
  type('date', (v) => v instanceof Date && !Number.isNaN(v.getTime()), msg);

export const literal = <const T extends string | number | boolean>(value: T, msg?: Message): ValuesSchema<T> =>
  Object.assign(type<T>('literal', (v) => v === value, msg, { expected: value }), { values: [value] });

export const oneOf = <const T extends readonly (string | number | boolean)[]>(
  values: T,
  msg?: Message,
): ValuesSchema<T[number]> =>
  Object.assign(type<T[number]>('oneOf', (v) => values.includes(v as T[number]), msg, { options: values.join(', ') }), {
    values,
  });

// Значения TypeScript-enum или объекта as const: enumOf(Role)
export function enumOf<const E extends Record<string, string | number>>(e: E, msg?: Message): ValuesSchema<E[keyof E]> {
  // у числовых enum есть обратные ключи (Role[0] === 'Admin') — их пропускаем
  const values = Object.keys(e)
    .filter((k) => typeof e[e[k] as keyof E] !== 'number')
    .map((k) => e[k]);
  return oneOf(values, msg) as ValuesSchema<E[keyof E]>;
}

export const unknown = (): Schema<unknown> => createSchema((v) => v);

export function optional<T>(schema: Schema<T>): Schema<T | undefined>;
export function optional<T>(schema: Schema<T>, def: T | (() => T)): Schema<T>;
export function optional<T>(schema: Schema<T>, def?: T | (() => T)): Schema<T | undefined> {
  return createSchema((v, ctx, path, parent) =>
    v === undefined || v === ''
      ? typeof def === 'function'
        ? (def as () => T)()
        : def
      : schema.run(v, ctx, path, parent),
  );
}

export const nullable = <T>(schema: Schema<T>): Schema<T | null> =>
  createSchema((v, ctx, path, parent) => (v === null ? null : schema.run(v, ctx, path, parent)));

export type Shape = Record<string, Schema<any>>;
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

// Схема объекта хранит поля и опции — их используют partial, pick, omit, extend и variant
export type ObjectSchema<S extends Shape> = Schema<ObjectOut<S>> & { readonly shape: S; readonly options: ObjectOptions };

export function object<S extends Shape>(shape: S, opts: ObjectOptions = {}): ObjectSchema<S> {
  const keys = Object.keys(shape);
  const mode = opts.unknown ?? 'strip';
  const schema = createSchema<ObjectOut<S>>((v, ctx, path) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', opts.message);
    if (typeof v !== 'object' || Array.isArray(v)) return fail(ctx, path, 'object', opts.message);
    const input = v as Record<string, unknown>;
    const out: Record<string, unknown> = mode === 'passthrough' ? { ...input } : {};
    let ok = true;
    for (const k of keys) {
      const r = shape[k].run(has(input, k) ? input[k] : undefined, ctx, { k, p: path }, input);
      if (r === FAIL) {
        if (ctx.abort) return FAIL;
        ok = false;
      }
      else if (r !== undefined) out[k] = r;
      else if (mode === 'passthrough') delete out[k];
    }
    if (mode === 'strict') {
      for (const k in input) {
        if (has(input, k) && !has(shape, k)) {
          fail(ctx, { k, p: path }, 'unknownKey');
          if (ctx.abort) return FAIL;
          ok = false;
        }
      }
    }
    return ok ? (out as ObjectOut<S>) : FAIL;
  });
  return Object.assign(schema, { shape, options: opts });
}

export function array<T>(item: Schema<T>, msg?: Message): Schema<T[]> {
  return createSchema((v, ctx, path) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', msg);
    if (!Array.isArray(v)) return fail(ctx, path, 'array', msg);
    const out: T[] = new Array(v.length);
    let ok = true;
    for (let i = 0; i < v.length; i++) {
      const r = item.run(v[i], ctx, { k: i, p: path }, v);
      if (r === FAIL) {
        if (ctx.abort) return FAIL;
        ok = false;
      }
      else out[i] = r;
    }
    return ok ? out : FAIL;
  });
}

// Массив фиксированной длины, у каждого элемента своя схема: tuple([number(), number()])
export function tuple<const T extends readonly Schema<any>[]>(
  items: T,
  msg?: Message,
): Schema<{ -readonly [I in keyof T]: Infer<T[I]> }> {
  return createSchema((v, ctx, path) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', msg);
    if (!Array.isArray(v)) return fail(ctx, path, 'array', msg);
    if (v.length !== items.length) return fail(ctx, path, 'items', msg, { length: items.length });
    const out: unknown[] = new Array(v.length);
    let ok = true;
    for (let i = 0; i < items.length; i++) {
      const r = items[i].run(v[i], ctx, { k: i, p: path }, v);
      if (r === FAIL) {
        if (ctx.abort) return FAIL;
        ok = false;
      }
      else out[i] = r;
    }
    return ok ? (out as { -readonly [I in keyof T]: Infer<T[I]> }) : FAIL;
  });
}

// Объект с произвольными ключами: record(number()) или record(keySchema, valueSchema)
export function record<V>(value: Schema<V>, msg?: Message): Schema<Record<string, V>>;
export function record<K extends string, V>(key: Schema<K>, value: Schema<V>, msg?: Message): Schema<Record<K, V>>;
export function record(a: Schema, b?: Schema | Message, c?: Message): Schema<Record<string, unknown>> {
  const withKey = typeof b === 'object';
  const key = withKey ? a : undefined;
  const value = withKey ? (b as Schema) : a;
  const msg = withKey ? c : (b as Message | undefined);
  return createSchema((v, ctx, path) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', msg);
    if (typeof v !== 'object' || Array.isArray(v)) return fail(ctx, path, 'object', msg);
    const input = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    let ok = true;
    for (const k in input) {
      if (!has(input, k)) continue;
      const p = { k, p: path };
      const rk = key ? key.run(k, ctx, p, input) : k;
      const r = value.run(input[k], ctx, p, input);
      if (rk === FAIL || r === FAIL) {
        if (ctx.abort) return FAIL;
        ok = false;
      }
      else put(out, rk as string, r);
    }
    return ok ? out : FAIL;
  });
}

// Первая подходящая схема из списка: union([string(), number()])
export function union<const T extends readonly Schema<any>[]>(options: T, msg?: Message): Schema<Infer<T[number]>> {
  return createSchema((v, ctx, path, parent) => {
    for (const o of options) {
      const tmp = newCtx(ctx);
      const r = o.run(v, tmp, path, parent);
      if (r !== FAIL) {
        // асинхронные проверки подошедшей схемы сообщают ошибки в общий результат
        if (tmp.pending.length) ctx.pending.push(Promise.all(tmp.pending).then(() => void ctx.issues.push(...tmp.issues)));
        return r;
      }
    }
    return fail(ctx, path, isEmpty(v) ? 'required' : 'union', msg);
  });
}

// Объединение объектов, вариант выбирается по полю-признаку: variant('type', [object({ type: literal('card'), ... }), ...])
export function variant<K extends string, const T extends readonly ObjectSchema<Record<K, Schema<any>>>[]>(
  key: K,
  options: T,
  msg?: Message,
): Schema<Infer<T[number]>> {
  const allowed = options.flatMap((o) => (o.shape[key] as Partial<ValuesSchema<unknown>>).values ?? []).join(', ');
  return createSchema<Infer<T[number]>>((v, ctx, path, parent) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', msg);
    if (typeof v !== 'object' || Array.isArray(v)) return fail(ctx, path, 'object', msg);
    const input = v as Record<string, unknown>;
    const d = has(input, key) ? input[key] : undefined;
    for (const o of options) {
      if (o.shape[key].run(d, newCtx(ctx), undefined, input) !== FAIL) return o.run(v, ctx, path, parent) as Infer<T[number]>;
    }
    return fail(ctx, { k: key, p: path }, isEmpty(d) ? 'required' : 'variant', msg, { options: allowed });
  });
}

// Меняет тип результата: transform(string(), (s) => s.split(','))
export const transform = <T, U>(schema: Schema<T>, fn: (value: T) => U): Schema<U> =>
  createSchema((v, ctx, path, parent) => {
    const r = schema.run(v, ctx, path, parent);
    return r === FAIL ? FAIL : fn(r);
  });

// Подготавливает входное значение до проверки
export const preprocess = <T>(fn: (value: unknown) => unknown, schema: Schema<T>): Schema<T> =>
  createSchema((v, ctx, path, parent) => schema.run(fn(v), ctx, path, parent));

// Схема, которая выбирается при проверке: рекурсия — lazy(() => Category),
// или по значению и соседним полям — lazy((value, { parent }) => …)
export function lazy<T>(getter: (value: unknown, info: { parent: unknown; root: unknown }) => Schema<T>): Schema<T> {
  return createSchema((v, ctx, path, parent) => {
    // защита от слишком глубоких данных: без неё запрос может уронить сервер переполнением стека
    if (ctx.depth >= ctx.maxDepth) return fail(ctx, path, 'depth', undefined, { max: ctx.maxDepth });
    ctx.depth++;
    try {
      return getter(v, { parent, root: ctx.root }).run(v, ctx, path, parent);
    } finally {
      ctx.depth--;
    }
  });
}

// Название поля для {label} в сообщениях: label(string(), 'Email')
export const label = <T>(schema: Schema<T>, text: string): Schema<T> =>
  createSchema((v, ctx, path, parent) => {
    ctx.labels.set(toPath(path).join('.'), text);
    return schema.run(v, ctx, path, parent);
  });

// Значение вместо ошибки: fallback(pipe(coerce.number(), min(1)), 1) — ?page=abc станет 1
export function fallback<T>(schema: Schema<T>, value: T | ((input: unknown) => T)): Schema<T> {
  return createSchema((v, ctx, path, parent) => {
    const tmp = newCtx(ctx);
    const r = schema.run(v, tmp, path, parent);
    if (r === FAIL) return typeof value === 'function' ? (value as (input: unknown) => T)(v) : value;
    if (tmp.pending.length) ctx.pending.push(Promise.all(tmp.pending).then(() => void ctx.issues.push(...tmp.issues)));
    return r;
  });
}

// ---------- файлы

export interface FileOptions {
  // Максимальный размер в байтах: 2 * 1024 * 1024
  maxSize?: number;
  // MIME-типы и расширения: ['image/*', 'application/pdf', '.docx']
  types?: string[];
}

const bytes = (n: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${Math.round(n * 10) / 10} ${units[i]}`;
};

const typeMatches = (f: Blob & { name?: string }, t: string) =>
  t.startsWith('.')
    ? (f.name ?? '').toLowerCase().endsWith(t.toLowerCase())
    : t.endsWith('/*')
      ? f.type.startsWith(t.slice(0, -1))
      : f.type === t;

// Файл из <input type="file"> или FormData: file({ maxSize: 2 * 1024 * 1024, types: ['image/*'] })
export function file(options: FileOptions = {}, msg?: Message): Schema<File> {
  return createSchema((v, ctx, path) => {
    if (isEmpty(v)) return fail(ctx, path, 'required', msg);
    if (typeof Blob === 'undefined' || !(v instanceof Blob)) return fail(ctx, path, 'file', msg);
    if (options.maxSize !== undefined && v.size > options.maxSize) {
      return fail(ctx, path, 'fileSize', msg, { max: bytes(options.maxSize), size: bytes(v.size) });
    }
    if (options.types && !options.types.some((t) => typeMatches(v, t))) {
      return fail(ctx, path, 'fileType', msg, { types: options.types.join(', ') });
    }
    return v as File;
  });
}

// ---------- брендированные типы

export type Brand<B extends string> = { readonly '~brand': B };

// Тип с «меткой»: brand(pipe(string(), uuid()), 'UserId') — TypeScript не даст передать OrderId вместо UserId
export const brand = <T, B extends string>(schema: Schema<T>, _name: B): Schema<T & Brand<B>> => schema as Schema<T & Brand<B>>;
