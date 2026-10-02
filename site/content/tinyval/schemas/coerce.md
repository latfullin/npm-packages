::: ru
Приведение типов для данных, которые приходят строками: query-параметры, `FormData`, переменные окружения, CSV.
:::

::: en
Type coercion for data that comes as strings: query parameters, `FormData`, environment variables, CSV.
:::

::: zh
对以字符串形式传入的数据进行类型转换：query 参数、`FormData`、环境变量、CSV。
:::

## @t(signature)

```ts
coerce.string(msg?: Message): Schema<string>
coerce.number(msg?: Message): Schema<number>
coerce.boolean(msg?: Message): Schema<boolean>
coerce.date(msg?: Message): Schema<Date>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |

## Что во что превращается

| Функция | Преобразование | Затем проверяется как |
| --- | --- | --- |
| `coerce.string()` | число, `boolean`, `bigint` → `String(value)` | [`string()`](~/schemas/string) |
| `coerce.number()` | строка → обрезка пробелов → `Number(value)`. Пустая строка остаётся пустой | [`number()`](~/schemas/number) |
| `coerce.boolean()` | `'true'`, `'1'`, `'on'`, `'yes'`, `1` → `true`; `'false'`, `'0'`, `'off'`, `'no'`, `0` → `false`. Регистр не важен | [`boolean()`](~/schemas/boolean) |
| `coerce.date()` | непустая строка или число → `new Date(value)` | [`date()`](~/schemas/date) |

Значения, которые уже нужного типа, не меняются. Неподходящие значения дают обычную ошибку типа: `coerce.number()` на `'abc'` → `Must be a number`.
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |

## Conversions

| Function | Conversion | Then validated as |
| --- | --- | --- |
| `coerce.string()` | number, `boolean`, `bigint` → `String(value)` | [`string()`](~/schemas/string) |
| `coerce.number()` | string → trim → `Number(value)`. An empty string stays empty | [`number()`](~/schemas/number) |
| `coerce.boolean()` | `'true'`, `'1'`, `'on'`, `'yes'`, `1` → `true`; `'false'`, `'0'`, `'off'`, `'no'`, `0` → `false`. Case-insensitive | [`boolean()`](~/schemas/boolean) |
| `coerce.date()` | a non-empty string or a number → `new Date(value)` | [`date()`](~/schemas/date) |

Values that already have the right type are not changed. Unsuitable values give a regular type error: `coerce.number()` on `'abc'` → `Must be a number`.
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |

## 转换规则

| 函数 | 转换 | 随后按以下方式校验 |
| --- | --- | --- |
| `coerce.string()` | 数字、`boolean`、`bigint` → `String(value)` | [`string()`](~/schemas/string) |
| `coerce.number()` | 字符串 → 去除空格 → `Number(value)`。空字符串保持为空 | [`number()`](~/schemas/number) |
| `coerce.boolean()` | `'true'`、`'1'`、`'on'`、`'yes'`、`1` → `true`；`'false'`、`'0'`、`'off'`、`'no'`、`0` → `false`。不区分大小写 | [`boolean()`](~/schemas/boolean) |
| `coerce.date()` | 非空字符串或数字 → `new Date(value)` | [`date()`](~/schemas/date) |

已经是正确类型的值不会被修改。不合适的值会产生普通的类型错误：`coerce.number()` 处理 `'abc'` → `Must be a number`。
:::

## @t(codes)

::: ru
Такие же, как у соответствующей схемы: `required` и `string` / `number` / `boolean` / `date`.
:::

::: en
The same as the corresponding schema: `required` and `string` / `number` / `boolean` / `date`.
:::

::: zh
与对应的 Schema 相同：`required` 以及 `string` / `number` / `boolean` / `date`。
:::

## @t(examples)

::: ru
### Query-параметры
:::

::: en
### Query parameters
:::

::: zh
### Query 参数
:::

```ts
// GET /products?page=2&limit=20&inStock=1
const Query = object({
  page: optional(pipe(coerce.number(), integer(), min(1)), 1),
  limit: optional(pipe(coerce.number(), integer(), max(100)), 20),
  inStock: optional(coerce.boolean(), false),
});

parse(Query, req.query); // { page: 2, limit: 20, inStock: true }
```

### FormData

```ts
const data = validate(Form, Object.fromEntries(new FormData(form)));
```

## @t(see)

::: ru
- [preprocess](~/schemas/preprocess) — своё приведение
- [parse](~/api/parse) — пример с переменными окружения
:::

::: en
- [preprocess](~/schemas/preprocess) — custom coercion
- [parse](~/api/parse) — environment variables example
:::

::: zh
- [preprocess](~/schemas/preprocess)：自定义转换
- [parse](~/api/parse)：环境变量示例
:::
