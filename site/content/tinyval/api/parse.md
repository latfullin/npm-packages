::: ru
Проверяет данные и **возвращает их**, если они валидны, или **бросает** [`ValidationError`](~/api/validation-error). Удобно на сервере, где невалидный запрос — повод сразу прервать обработку.
:::

::: en
Validates data and **returns it** if valid, or **throws** [`ValidationError`](~/api/validation-error). Handy on the server, where an invalid request should stop processing right away.
:::

::: zh
校验数据，有效时**返回数据**，无效时**抛出** [`ValidationError`](~/api/validation-error)。适合在服务端使用：请求无效时可以立即中止处理。
:::

## @t(signature)

```ts
function parse<S extends Schema>(schema: S, value: unknown, options?: Options): Infer<S>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema` | Схема, по которой проверяются данные |
| `value` | `unknown` | Любые данные |
| `options` | `Options` | `{ all?: boolean }` — как в [validate](~/api/validate) |

## Возвращает

Очищенные типизированные данные — то же, что `result.data` у [`validate`](~/api/validate).

## Бросает

- [`ValidationError`](~/api/validation-error) — если данные невалидны. В нём есть `errors` и `issues`.
- `Error` — если в схеме есть [`checkAsync`](~/actions/check-async). Используйте [`parseAsync`](~/api/parse-async).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema` | The schema to validate against |
| `value` | `unknown` | Any data |
| `options` | `Options` | `{ all?: boolean }` — as in [validate](~/api/validate) |

## Returns

Cleaned, typed data — the same as `result.data` of [`validate`](~/api/validate).

## Throws

- [`ValidationError`](~/api/validation-error) — if the data is invalid. It contains `errors` and `issues`.
- `Error` — if the schema contains [`checkAsync`](~/actions/check-async). Use [`parseAsync`](~/api/parse-async).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema` | 用于校验数据的 Schema |
| `value` | `unknown` | 任意数据 |
| `options` | `Options` | `{ all?: boolean }` —— 与 [validate](~/api/validate) 相同 |

## 返回值

清洗后的、带类型的数据 —— 与 [`validate`](~/api/validate) 的 `result.data` 相同。

## 抛出

- [`ValidationError`](~/api/validation-error) —— 数据无效时。包含 `errors` 和 `issues`。
- `Error` —— Schema 中包含 [`checkAsync`](~/actions/check-async) 时。请使用 [`parseAsync`](~/api/parse-async)。
:::

## @t(examples)

### Express

::: ru
```ts
import { parse, ValidationError } from 'tinyval';

app.post('/users', (req, res) => {
  try {
    const user = parse(CreateUser, req.body);
    // user уже проверен и типизирован
  } catch (e) {
    if (e instanceof ValidationError) return res.status(422).json({ errors: e.errors });
    throw e;
  }
});
```

### Переменные окружения

```ts
const env = parse(
  object({
    PORT: optional(coerce.number(), 3000),
    DATABASE_URL: string(),
    DEBUG: optional(coerce.boolean(), false),
  }),
  process.env,
);
// при отсутствии DATABASE_URL приложение упадёт при старте с понятной ошибкой
```
:::

::: en
```ts
import { parse, ValidationError } from 'tinyval';

app.post('/users', (req, res) => {
  try {
    const user = parse(CreateUser, req.body);
    // user is validated and typed
  } catch (e) {
    if (e instanceof ValidationError) return res.status(422).json({ errors: e.errors });
    throw e;
  }
});
```

### Environment variables

```ts
const env = parse(
  object({
    PORT: optional(coerce.number(), 3000),
    DATABASE_URL: string(),
    DEBUG: optional(coerce.boolean(), false),
  }),
  process.env,
);
// without DATABASE_URL the app fails on startup with a clear error
```
:::

::: zh
```ts
import { parse, ValidationError } from 'tinyval';

app.post('/users', (req, res) => {
  try {
    const user = parse(CreateUser, req.body);
    // user 已校验且带有类型
  } catch (e) {
    if (e instanceof ValidationError) return res.status(422).json({ errors: e.errors });
    throw e;
  }
});
```

### 环境变量

```ts
const env = parse(
  object({
    PORT: optional(coerce.number(), 3000),
    DATABASE_URL: string(),
    DEBUG: optional(coerce.boolean(), false),
  }),
  process.env,
);
// 缺少 DATABASE_URL 时，应用会在启动时给出明确的错误
```
:::

## @t(see)

::: ru
- [ValidationError](~/api/validation-error)
- [parseAsync](~/api/parse-async)
- [validate](~/api/validate) — без исключений
:::

::: en
- [ValidationError](~/api/validation-error)
- [parseAsync](~/api/parse-async)
- [validate](~/api/validate) — without exceptions
:::

::: zh
- [ValidationError](~/api/validation-error)
- [parseAsync](~/api/parse-async)
- [validate](~/api/validate)：不抛出异常
:::
