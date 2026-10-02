import en from './locales/en.js';

export type PathKey = string | number;

// Путь хранится связным списком и превращается в массив только при ошибке
export type Path = { k: PathKey; p: Path } | undefined;

export interface Issue {
  code: string;
  message: string;
  path: PathKey[];
  // Параметры правила ({ min: 8 }) — чтобы перевести ошибку по коду на клиенте
  params: Record<string, unknown>;
}

export type Message = string | ((params: Record<string, unknown>) => string);

// Ошибка до форматирования: текст собирается в конце проверки, когда известны язык и названия полей
interface RawIssue {
  code: string;
  path: PathKey[];
  params: Record<string, unknown>;
  m?: Message;
}

export interface Ctx {
  issues: RawIssue[];
  pending: Promise<void>[];
  root: unknown;
  all: boolean;
  messages?: Record<string, Message>;
  labels: Map<string, string>;
  depth: number;
  maxDepth: number;
}

export const FAIL: unique symbol = Symbol('tinyval.fail');
export type Fail = typeof FAIL;

// Интерфейс Standard Schema (https://standardschema.dev) — совместимость с tRPC, Hono, TanStack Form и др.
export interface StandardProps<Input, Output> {
  readonly version: 1;
  readonly vendor: string;
  readonly validate: (value: unknown) => StandardResult<Output> | Promise<StandardResult<Output>>;
  readonly types?: { readonly input: Input; readonly output: Output } | undefined;
}

export type StandardResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string; readonly path?: ReadonlyArray<PropertyKey> }> };

export interface Schema<T = unknown> {
  readonly '~t'?: T;
  readonly '~standard': StandardProps<unknown, T>;
  run(value: unknown, ctx: Ctx, path: Path, parent: unknown): T | Fail;
}

const proto = {
  get '~standard'(): StandardProps<unknown, unknown> {
    const schema = this as unknown as Schema;
    return {
      version: 1,
      vendor: 'tinyval',
      validate(value) {
        const [ctx, out] = start(schema, value);
        const result = (): StandardResult<unknown> => {
          const r = finish(ctx, out);
          return r.valid ? { value: r.data } : { issues: r.issues.map(({ message, path }) => ({ message, path })) };
        };
        return ctx.pending.length ? Promise.all(ctx.pending).then(result) : result();
      },
    };
  },
};

// Создаёт схему из функции проверки: run возвращает значение или результат fail(...)
export function createSchema<T>(run: Schema<T>['run']): Schema<T> {
  const schema = Object.create(proto);
  schema.run = run;
  return schema;
}

export type Infer<S> = S extends Schema<infer T> ? T : never;

// Все коды ошибок и тип полного lang-файла: const ru = { ... } satisfies Messages
export type MessageCode = keyof typeof en;
export type Messages = Record<MessageCode, Message> & Record<string, Message>;

const messages: Record<string, Message> = { ...en };
const labels: Record<string, string> = {};

// Тексты ошибок для всего приложения. Ключи — код ('required') или поле и код ('email.required', 'items.*.name.required')
export function setMessages(m: Record<string, Message>): void {
  Object.assign(messages, m);
}

// Названия полей для {label} во всём приложении: { email: 'Почта', 'items.*.name': 'Название' }
export function setLabels(l: Record<string, string>): void {
  Object.assign(labels, l);
}

export const has = (o: object, k: PropertyKey): boolean => Object.prototype.hasOwnProperty.call(o, k);

// Пустые значения: undefined, null и '' (как в Laravel после ConvertEmptyStringsToNull)
export const isEmpty = (v: unknown): boolean => v === undefined || v === null || v === '';

// Запись свойства, безопасная для ключа __proto__ из входных данных
export function put(o: Record<string, unknown>, k: string, v: unknown): void {
  if (k === '__proto__') Object.defineProperty(o, k, { value: v, enumerable: true, writable: true, configurable: true });
  else o[k] = v;
}

export const newCtx = (ctx: Ctx): Ctx => ({ ...ctx, issues: [], pending: [] });

export function toPath(p: Path): PathKey[] {
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
  ctx.issues.push({ code, path: toPath(path), params, m: msg });
  return FAIL;
}

const own = <T>(o: Record<string, T> | undefined, k: string): T | undefined => (o && has(o, k) ? o[k] : undefined);

function format(i: RawIssue, ctx: Ctx): Issue {
  const key = i.path.join('.');
  // тот же путь со звёздочками вместо индексов массивов: items.*.name
  const star = i.path.map((k) => (typeof k === 'number' ? '*' : k)).join('.');
  // {label}: label() и options.labels, затем setLabels, иначе имя поля
  const label =
    ctx.labels.get(key) ?? ctx.labels.get(star) ?? own(labels, key) ?? own(labels, star) ?? String(i.path[i.path.length - 1] ?? '');
  const params: Record<string, unknown> = { label, ...i.params };
  // Текст: из схемы → для поля (вызов, глобально) → по коду (вызов, глобально) → invalid
  const field = (k: string) => (k ? own(ctx.messages, `${k}.${i.code}`) ?? own(messages, `${k}.${i.code}`) : undefined);
  const m =
    i.m ??
    field(key) ??
    field(star) ??
    own(ctx.messages, i.code) ??
    own(messages, i.code) ??
    own(ctx.messages, 'invalid') ??
    messages.invalid;
  return {
    code: i.code,
    path: i.path,
    params: i.params,
    message:
      typeof m === 'function' ? m(params) : m.replace(/\{(\w+)\}/g, (s, k) => (k in params ? String(params[k]) : s)),
  };
}

export interface Options {
  // Собирать все ошибки поля, а не только первую
  all?: boolean;
  // Сообщения для этого вызова — например, язык текущего запроса на сервере
  messages?: Record<string, Message>;
  // Названия полей для {label}: { email: 'Почта', 'address.city': 'Город' }
  labels?: Record<string, string>;
  // Максимальная вложенность рекурсивных схем (lazy)
  maxDepth?: number;
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
  const ctx: Ctx = {
    issues: [],
    pending: [],
    root: value,
    all: !!opts?.all,
    messages: opts?.messages,
    labels: new Map(opts?.labels ? Object.entries(opts.labels) : undefined),
    depth: 0,
    maxDepth: opts?.maxDepth ?? 256,
  };
  return [ctx, schema.run(value, ctx, undefined, undefined)];
}

function finish<T>(ctx: Ctx, out: unknown): Result<T> {
  if (!ctx.issues.length) return { valid: true, data: out as T, errors: {}, issues: [] };
  const issues = ctx.issues.map((i) => format(i, ctx));
  const errors: Record<string, string> = {};
  for (const i of issues) {
    const k = i.path.join('.');
    if (!has(errors, k)) put(errors, k, i.message);
  }
  return { valid: false, data: undefined, errors, issues };
}

// Все ошибки по полям, как в Laravel: { email: ['...', '...'] }
export function flatten(issues: Issue[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const i of issues) {
    const k = i.path.join('.');
    if (has(out, k)) out[k].push(i.message);
    else put(out, k, [i.message]);
  }
  return out;
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

// Синхронный результат, если в схеме нет асинхронных проверок, иначе Promise. Каждая проверка вызывается один раз
export function validateAny<S extends Schema<any>>(
  schema: S,
  value: unknown,
  opts?: Options,
): Result<Infer<S>> | Promise<Result<Infer<S>>> {
  const [ctx, out] = start(schema, value, opts);
  return ctx.pending.length ? Promise.all(ctx.pending).then(() => finish(ctx, out)) : finish(ctx, out);
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
