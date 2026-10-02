import en from './locales/en.js';

export type PathKey = string | number;

// Путь хранится связным списком и превращается в массив только при ошибке
export type Path = { k: PathKey; p: Path } | undefined;

export interface Issue {
  code: string;
  message: string;
  path: PathKey[];
}

export type Message = string | ((params: Record<string, unknown>) => string);

export interface Ctx {
  issues: Issue[];
  pending: Promise<void>[];
  root: unknown;
  all: boolean;
}

export const FAIL: unique symbol = Symbol('tinyval.fail');
export type Fail = typeof FAIL;

export interface Schema<T = unknown> {
  readonly '~t'?: T;
  run(value: unknown, ctx: Ctx, path: Path, parent: unknown): T | Fail;
}

export type Infer<S> = S extends Schema<infer T> ? T : never;

const messages: Record<string, Message> = { ...en };

export function setMessages(m: Record<string, Message>): void {
  Object.assign(messages, m);
}

export const has = (o: object, k: PropertyKey): boolean => Object.prototype.hasOwnProperty.call(o, k);

// Пустые значения: undefined, null и '' (как в Laravel после ConvertEmptyStringsToNull)
export const isEmpty = (v: unknown): boolean => v === undefined || v === null || v === '';

function toPath(p: Path): PathKey[] {
  const a: PathKey[] = [];
  for (; p; p = p.p) a.unshift(p.k);
  return a;
}

export function fail(
  ctx: Ctx,
  path: Path,
  code: string,
  msg?: Message,
  params: Record<string, unknown> = {},
): Fail {
  const m = msg ?? messages[code] ?? messages.invalid;
  ctx.issues.push({
    code,
    path: toPath(path),
    message:
      typeof m === 'function'
        ? m(params)
        : m.replace(/\{(\w+)\}/g, (s, k) => (k in params ? String(params[k]) : s)),
  });
  return FAIL;
}

export interface Options {
  // Собирать все ошибки поля, а не только первую
  all?: boolean;
}

export type Result<T> =
  | { valid: true; data: T; errors: Record<string, string>; issues: Issue[] }
  | { valid: false; data: undefined; errors: Record<string, string>; issues: Issue[] };

export class ValidationError extends Error {
  constructor(
    public issues: Issue[],
    public errors: Record<string, string>,
  ) {
    super(issues.map((i) => (i.path.length ? `${i.path.join('.')}: ` : '') + i.message).join('; '));
    this.name = 'ValidationError';
  }
}

function start(schema: Schema, value: unknown, opts?: Options): [Ctx, unknown] {
  const ctx: Ctx = { issues: [], pending: [], root: value, all: !!opts?.all };
  return [ctx, schema.run(value, ctx, undefined, undefined)];
}

function finish<T>(ctx: Ctx, out: unknown): Result<T> {
  const errors: Record<string, string> = {};
  for (const i of ctx.issues) {
    const k = i.path.join('.');
    if (!has(errors, k)) {
      Object.defineProperty(errors, k, { value: i.message, enumerable: true, writable: true, configurable: true });
    }
  }
  return ctx.issues.length
    ? { valid: false, data: undefined, errors, issues: ctx.issues }
    : { valid: true, data: out as T, errors, issues: [] };
}

function noAsync(ctx: Ctx): void {
  if (ctx.pending.length) throw new Error('tinyval: schema has async checks, use validateAsync()');
}

export function validate<S extends Schema<any>>(schema: S, value: unknown, opts?: Options): Result<Infer<S>> {
  const [ctx, out] = start(schema, value, opts);
  noAsync(ctx);
  return finish(ctx, out);
}

export async function validateAsync<S extends Schema<any>>(
  schema: S,
  value: unknown,
  opts?: Options,
): Promise<Result<Infer<S>>> {
  const [ctx, out] = start(schema, value, opts);
  await Promise.all(ctx.pending);
  return finish(ctx, out);
}

function unwrap<T>(r: Result<T>): T {
  if (!r.valid) throw new ValidationError(r.issues, r.errors);
  return r.data;
}

// Возвращает данные или бросает ValidationError — удобно на сервере
export function parse<S extends Schema<any>>(schema: S, value: unknown, opts?: Options): Infer<S> {
  return unwrap(validate(schema, value, opts));
}

export async function parseAsync<S extends Schema<any>>(schema: S, value: unknown, opts?: Options): Promise<Infer<S>> {
  return unwrap(await validateAsync(schema, value, opts));
}
