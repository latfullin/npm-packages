::: ru
tinyval считает **пустыми** три значения: `undefined`, `null` и пустую строку `''`.

## Как это работает

| Значение | Обязательная схема (`string()`, `object()`…) | [`optional()`](~/schemas/optional) | [`nullable()`](~/schemas/nullable) |
| --- | --- | --- | --- |
| `undefined` | ошибка `required` | пропуск / значение по умолчанию | ошибка `required` |
| `''` | ошибка `required` | пропуск / значение по умолчанию | ошибка `required` |
| `null` | ошибка `required` | ошибка `required` | `null` |

## Почему так

Из HTML-форм незаполненное поле приходит пустой строкой, а не `undefined`. Если считать `''` обычной строкой, то обязательное поле «Имя» с пустым инпутом проходило бы проверку, а необязательное поле «Сайт» падало бы на проверке формата URL.

Laravel решает это так же — middleware `ConvertEmptyStringsToNull` превращает пустые строки в `null` до валидации.

## Частые случаи

```ts
// Обязательное поле: '' даёт ошибку Required
name: string()

// Необязательное: '' и undefined пропускаются, поле не попадёт в data
website: optional(pipe(string(), pattern(/^https?:\/\//)))

// Необязательное со значением по умолчанию
role: optional(oneOf(['admin', 'user']), 'user')

// Может быть null (например, из JSON с сервера) или отсутствовать
middleName: optional(nullable(string()))

// Нужна именно пустая строка как значение
comment: optional(string(), '')
```

## Строка из пробелов

`'   '` — не пустая строка, поэтому `string()` её пропустит. Чтобы запретить такие значения, обрежьте пробелы и проверьте длину:
:::

::: en
tinyval treats three values as **empty**: `undefined`, `null` and the empty string `''`.

## How it works

| Value | Required schema (`string()`, `object()`…) | [`optional()`](~/schemas/optional) | [`nullable()`](~/schemas/nullable) |
| --- | --- | --- | --- |
| `undefined` | `required` error | skipped / default value | `required` error |
| `''` | `required` error | skipped / default value | `required` error |
| `null` | `required` error | `required` error | `null` |

## Why

An empty field of an HTML form comes as an empty string, not `undefined`. If `''` were a regular string, a required "Name" field with an empty input would pass, while an optional "Website" field would fail the URL format check.

Laravel does the same — the `ConvertEmptyStringsToNull` middleware turns empty strings into `null` before validation.

## Common cases

```ts
// Required: '' fails with Required
name: string()

// Optional: '' and undefined are skipped, the field is not added to data
website: optional(pipe(string(), pattern(/^https?:\/\//)))

// Optional with a default value
role: optional(oneOf(['admin', 'user']), 'user')

// May be null (e.g. from JSON) or missing
middleName: optional(nullable(string()))

// An empty string is a valid value
comment: optional(string(), '')
```

## Whitespace-only strings

`'   '` is not empty, so `string()` accepts it. To reject such values, trim and check the length:
:::

::: zh
tinyval 将三种值视为**空值**：`undefined`、`null` 和空字符串 `''`。

## 工作方式

| 值 | 必填 Schema（`string()`、`object()`…） | [`optional()`](~/schemas/optional) | [`nullable()`](~/schemas/nullable) |
| --- | --- | --- | --- |
| `undefined` | `required` 错误 | 跳过 / 使用默认值 | `required` 错误 |
| `''` | `required` 错误 | 跳过 / 使用默认值 | `required` 错误 |
| `null` | `required` 错误 | `required` 错误 | `null` |

## 为什么这样设计

HTML 表单中未填写的字段会以空字符串提交，而不是 `undefined`。如果把 `''` 当作普通字符串，那么必填的“姓名”字段留空也能通过校验，而选填的“网站”字段却会因 URL 格式校验而失败。

Laravel 的做法相同 —— `ConvertEmptyStringsToNull` 中间件会在校验前把空字符串转换为 `null`。

## 常见情况

```ts
// 必填：'' 会产生 Required 错误
name: string()

// 选填：'' 和 undefined 会被跳过，字段不会出现在 data 中
website: optional(pipe(string(), pattern(/^https?:\/\//)))

// 选填并带默认值
role: optional(oneOf(['admin', 'user']), 'user')

// 可以为 null（例如来自 JSON）或缺失
middleName: optional(nullable(string()))

// 需要把空字符串作为有效值
comment: optional(string(), '')
```

## 只包含空格的字符串

`'   '` 不是空字符串，所以 `string()` 会接受它。要拒绝这类值，先去除空格再检查长度：
:::

```ts
name: pipe(string(), trim(), minLength(1))
```

## @t(see)

::: ru
- [optional](~/schemas/optional) — необязательные поля
- [nullable](~/schemas/nullable) — поля со значением null
- [trim](~/actions/trim) — обрезка пробелов
:::

::: en
- [optional](~/schemas/optional) — optional fields
- [nullable](~/schemas/nullable) — fields that can be null
- [trim](~/actions/trim) — trimming whitespace
:::

::: zh
- [optional](~/schemas/optional)：选填字段
- [nullable](~/schemas/nullable)：可以为 null 的字段
- [trim](~/actions/trim)：去除空格
:::
