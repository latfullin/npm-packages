::: ru
Создаёт свою схему из функции проверки. Такая схема работает везде, где встроенные: в [`object`](~/schemas/object), [`pipe`](~/actions/pipe), [`optional`](~/schemas/optional), — и поддерживает [Standard Schema](~/guide/standard-schema).
:::

::: en
Creates your own schema from a validation function. Such a schema works everywhere the built-in ones do: in [`object`](~/schemas/object), [`pipe`](~/actions/pipe), [`optional`](~/schemas/optional) — and supports [Standard Schema](~/guide/standard-schema).
:::

::: zh
用校验函数创建自定义 Schema。它可以在任何使用内置 Schema 的地方使用：[`object`](~/schemas/object)、[`pipe`](~/actions/pipe)、[`optional`](~/schemas/optional) —— 并且支持 [Standard Schema](~/guide/standard-schema)。
:::

## @t(signature)

```ts
function createSchema<T>(run: (value: unknown, ctx: Ctx, path: Path, parent: unknown) => T | Fail): Schema<T>

function fail(ctx: Ctx, path: Path, code: string, msg?: Message, params?: Record<string, unknown>): Fail
function isEmpty(value: unknown): boolean
```

## @t(params)

::: ru
| Параметр `run` | Описание |
| --- | --- |
| `value` | Проверяемое значение — может быть чем угодно |
| `ctx`, `path` | Передайте в `fail` при ошибке и во вложенные схемы |
| `parent` | Объект, в котором лежит значение (исходные данные) |

`run` возвращает значение (его можно преобразовать) или результат `fail(...)`.

- `fail(ctx, path, code, msg?, params?)` — записывает ошибку с кодом `code`. Текст берётся из `msg` или из сообщений [`setMessages`](~/api/set-messages) по коду; `params` подставляются в `{параметры}`.
- `isEmpty(value)` — `true` для `undefined`, `null` и `''`: так ведут себя встроенные схемы, см. [Пустые значения](~/guide/empty-values).
:::

::: en
| `run` parameter | Description |
| --- | --- |
| `value` | The value to validate — can be anything |
| `ctx`, `path` | Pass them to `fail` on error and to nested schemas |
| `parent` | The object containing the value (raw input) |

`run` returns the value (it may be transformed) or the result of `fail(...)`.

- `fail(ctx, path, code, msg?, params?)` — records an error with code `code`. The text comes from `msg` or from the [`setMessages`](~/api/set-messages) messages by code; `params` fill `{params}`.
- `isEmpty(value)` — `true` for `undefined`, `null` and `''`: this is how built-in schemas behave, see [Empty values](~/guide/empty-values).
:::

::: zh
| `run` 参数 | 说明 |
| --- | --- |
| `value` | 要校验的值 —— 可以是任何值 |
| `ctx`、`path` | 出错时传给 `fail`，也传给嵌套的 Schema |
| `parent` | 包含该值的对象（原始数据） |

`run` 返回值（可以是转换后的值）或 `fail(...)` 的结果。

- `fail(ctx, path, code, msg?, params?)` —— 记录代码为 `code` 的错误。文本来自 `msg`，或按代码来自 [`setMessages`](~/api/set-messages) 的信息；`params` 用于替换 `{参数}`。
- `isEmpty(value)` —— 对 `undefined`、`null` 和 `''` 返回 `true`：内置 Schema 也是这样处理的，见 [空值](~/guide/empty-values)。
:::

## @t(examples)

```ts
import { createSchema, fail, isEmpty, setMessages, type Message } from 'tinyval';

export const bigint = (msg?: Message) =>
  createSchema<bigint>((value, ctx, path) => {
    if (isEmpty(value)) return fail(ctx, path, 'required', msg);
    if (typeof value !== 'bigint') return fail(ctx, path, 'bigint', msg);
    return value;
  });

setMessages({ bigint: 'Must be a bigint' });
```

```ts
// slug: trims, lowercases and validates
export const slug = (msg?: Message) =>
  createSchema<string>((value, ctx, path) => {
    if (isEmpty(value)) return fail(ctx, path, 'required', msg);
    const s = String(value).trim().toLowerCase();
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) ? s : fail(ctx, path, 'pattern', msg);
  });
```

## @t(see)

::: ru
- [Свои правила и схемы](~/guide/custom-rules) — когда хватит [`check`](~/actions/check)
- [Standard Schema](~/guide/standard-schema)
:::

::: en
- [Custom rules & schemas](~/guide/custom-rules) — when [`check`](~/actions/check) is enough
- [Standard Schema](~/guide/standard-schema)
:::

::: zh
- [自定义规则与 Schema](~/guide/custom-rules)：使用 [`check`](~/actions/check) 就足够的情况
- [Standard Schema](~/guide/standard-schema)
:::
