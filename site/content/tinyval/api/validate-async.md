::: ru
Асинхронная версия [`validate`](~/api/validate). Нужна, если в схеме есть [`checkAsync`](~/actions/check-async) — например, проверка «email не занят» с запросом в базу.
:::

::: en
The async version of [`validate`](~/api/validate). Required if the schema contains [`checkAsync`](~/actions/check-async) — e.g. an "email is not taken" check with a database query.
:::

::: zh
[`validate`](~/api/validate) 的异步版本。当 Schema 中包含 [`checkAsync`](~/actions/check-async) 时需要使用，例如通过数据库查询检查“邮箱未被占用”。
:::

## @t(signature)

```ts
function validateAsync<S extends Schema>(schema: S, value: unknown, options?: Options): Promise<Result<Infer<S>>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema` | Схема, по которой проверяются данные |
| `value` | `unknown` | Любые данные |
| `options` | `Options` | `{ all?: boolean }` — как в [validate](~/api/validate) |

## Возвращает

`Promise` с тем же результатом, что у [`validate`](~/api/validate): `{ valid, data, errors, issues }`.

## Как работает

1. Сначала выполняются все синхронные проверки.
2. Асинхронные проверки поля запускаются, **только если синхронные проверки этого поля прошли** — лишних запросов в базу не будет.
3. Асинхронные проверки разных полей выполняются параллельно.
4. Если асинхронная проверка бросила исключение, `validateAsync` тоже отклоняется с ним.

Для схем без асинхронных проверок `validateAsync` тоже работает, просто возвращает `Promise`.

Если заранее неизвестно, есть ли в схеме асинхронные проверки, используйте `validateAny(schema, value, options)`: она возвращает результат сразу, а `Promise` — только когда асинхронные проверки есть. Каждая проверка вызывается один раз.
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema` | The schema to validate against |
| `value` | `unknown` | Any data |
| `options` | `Options` | `{ all?: boolean }` — as in [validate](~/api/validate) |

## Returns

A `Promise` with the same result as [`validate`](~/api/validate): `{ valid, data, errors, issues }`.

## How it works

1. All synchronous checks run first.
2. Async checks of a field run **only if the synchronous checks of that field passed** — no needless database queries.
3. Async checks of different fields run in parallel.
4. If an async check throws, `validateAsync` rejects with that error.

`validateAsync` also works for schemas without async checks — it just returns a `Promise`.

If you don't know in advance whether a schema has async checks, use `validateAny(schema, value, options)`: it returns the result right away, and a `Promise` only when there are async checks. Every check is called once.
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema` | 用于校验数据的 Schema |
| `value` | `unknown` | 任意数据 |
| `options` | `Options` | `{ all?: boolean }` —— 与 [validate](~/api/validate) 相同 |

## 返回值

一个 `Promise`，结果与 [`validate`](~/api/validate) 相同：`{ valid, data, errors, issues }`。

## 工作方式

1. 先执行所有同步检查。
2. 字段的异步检查**只有在该字段的同步检查通过后**才会执行 —— 不会产生多余的数据库查询。
3. 不同字段的异步检查并行执行。
4. 如果异步检查抛出异常，`validateAsync` 也会以该异常拒绝。

没有异步检查的 Schema 同样可以使用 `validateAsync`，只是返回一个 `Promise`。

如果事先不知道 Schema 中是否有异步检查，请使用 `validateAny(schema, value, options)`：它会直接返回结果，只有存在异步检查时才返回 `Promise`。每个检查只调用一次。
:::

## @t(example)

::: ru
### Регистрация

```ts
const Signup = object({
  email: pipe(string(), email(), checkAsync(async (v) => !(await db.users.exists({ email: v })), 'Email занят')),
  password: pipe(string(), minLength(8)),
});

const result = await validateAsync(Signup, req.body);

if (!result.valid) return res.status(422).json({ errors: result.errors });
```
:::

::: en
### Sign-up

```ts
const Signup = object({
  email: pipe(string(), email(), checkAsync(async (v) => !(await db.users.exists({ email: v })), 'Email is taken')),
  password: pipe(string(), minLength(8)),
});

const result = await validateAsync(Signup, req.body);

if (!result.valid) return res.status(422).json({ errors: result.errors });
```
:::

::: zh
### 注册

```ts
const Signup = object({
  email: pipe(string(), email(), checkAsync(async (v) => !(await db.users.exists({ email: v })), '该邮箱已被占用')),
  password: pipe(string(), minLength(8)),
});

const result = await validateAsync(Signup, req.body);

if (!result.valid) return res.status(422).json({ errors: result.errors });
```
:::

## @t(see)

::: ru
- [validate](~/api/validate)
- [parseAsync](~/api/parse-async) — асинхронная версия parse
- [checkAsync](~/actions/check-async)
:::

::: en
- [validate](~/api/validate)
- [parseAsync](~/api/parse-async) — async version of parse
- [checkAsync](~/actions/check-async)
:::

::: zh
- [validate](~/api/validate)
- [parseAsync](~/api/parse-async)：parse 的异步版本
- [checkAsync](~/actions/check-async)
:::
