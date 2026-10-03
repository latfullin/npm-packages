::: ru
Добавляет к схеме правила и преобразования. Они выполняются по порядку **после** проверки типа.
:::

::: en
Adds rules and transforms to a schema. They run in order **after** the type check.
:::

::: zh
为 Schema 添加规则和转换。它们在类型检查**之后**按顺序执行。
:::

## @t(signature)

```ts
function pipe<T>(schema: Schema<T>, ...actions: Action<T>[]): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Базовая схема: `string()`, `number()`, `array(...)`… |
| `actions` | `Action<T>[]` | Правила и преобразования |

## Порядок выполнения

1. Проверяется базовая схема. Если ошибка — правила не выполняются.
2. Правила и преобразования выполняются слева направо. Каждое следующее получает результат предыдущего: `pipe(string(), trim(), minLength(2))` проверяет длину уже обрезанной строки.
3. На первой ошибке выполнение останавливается. С опцией `{ all: true }` у [`validate`](~/api/validate) проверяются все правила.
4. Асинхронные правила ([`checkAsync`](~/actions/check-async)) запускаются в конце и только если остальные прошли.

## Что можно передавать

| Тип | Действия |
| --- | --- |
| Длина | [`minLength`](~/actions/min-length), [`maxLength`](~/actions/max-length), [`length`](~/actions/length) |
| Числа | [`min`](~/actions/min), [`max`](~/actions/max), [`between`](~/actions/between), [`integer`](~/actions/integer) |
| Формат | [`pattern`](~/actions/pattern), [`email`](~/actions/email), [`url`](~/actions/url), [`uuid`](~/actions/uuid), [`startsWith`](~/actions/starts-with), [`endsWith`](~/actions/ends-with), [`includes`](~/actions/includes) |
| Даты | [`minDate`](~/actions/min-date), [`maxDate`](~/actions/max-date), [`after`](~/actions/after), [`before`](~/actions/before) |
| Массивы | [`unique`](~/actions/unique) |
| Контрольные суммы | [`inn`](~/actions/inn), [`snils`](~/actions/snils), [`luhn`](~/actions/luhn) |
| Сравнение | [`sameAs`](~/actions/same-as) |
| Преобразования | [`trim`](~/actions/trim), [`toLowerCase`](~/actions/to-lower-case), [`toUpperCase`](~/actions/to-upper-case) |
| Свои | [`check`](~/actions/check), [`checkAsync`](~/actions/check-async) |

TypeScript проверяет, что правило подходит к типу схемы: `pipe(string(), min(1))` — ошибка компиляции.

Преобразования внутри `pipe` не меняют тип. Чтобы получить значение другого типа, используйте [`transform`](~/schemas/transform).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The base schema: `string()`, `number()`, `array(...)`… |
| `actions` | `Action<T>[]` | Rules and transforms |

## Execution order

1. The base schema is checked. On error the rules don't run.
2. Rules and transforms run left to right. Each one gets the result of the previous: `pipe(string(), trim(), minLength(2))` checks the length of the trimmed string.
3. Execution stops at the first error. With the `{ all: true }` option of [`validate`](~/api/validate) all rules are checked.
4. Async rules ([`checkAsync`](~/actions/check-async)) run last and only if the others passed.

## What you can pass

| Kind | Actions |
| --- | --- |
| Length | [`minLength`](~/actions/min-length), [`maxLength`](~/actions/max-length), [`length`](~/actions/length) |
| Numbers | [`min`](~/actions/min), [`max`](~/actions/max), [`between`](~/actions/between), [`integer`](~/actions/integer) |
| Format | [`pattern`](~/actions/pattern), [`email`](~/actions/email), [`url`](~/actions/url), [`uuid`](~/actions/uuid), [`startsWith`](~/actions/starts-with), [`endsWith`](~/actions/ends-with), [`includes`](~/actions/includes) |
| Dates | [`minDate`](~/actions/min-date), [`maxDate`](~/actions/max-date), [`after`](~/actions/after), [`before`](~/actions/before) |
| Arrays | [`unique`](~/actions/unique) |
| Checksums | [`inn`](~/actions/inn), [`snils`](~/actions/snils), [`luhn`](~/actions/luhn) |
| Comparison | [`sameAs`](~/actions/same-as) |
| Transforms | [`trim`](~/actions/trim), [`toLowerCase`](~/actions/to-lower-case), [`toUpperCase`](~/actions/to-upper-case) |
| Custom | [`check`](~/actions/check), [`checkAsync`](~/actions/check-async) |

TypeScript checks that a rule matches the schema type: `pipe(string(), min(1))` is a compile error.

Transforms inside `pipe` keep the type. To get a value of another type, use [`transform`](~/schemas/transform).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 基础 Schema：`string()`、`number()`、`array(...)`… |
| `actions` | `Action<T>[]` | 规则和转换 |

## 执行顺序

1. 先检查基础 Schema。如果出错，规则不会执行。
2. 规则和转换从左到右执行。每一个都接收前一个的结果：`pipe(string(), trim(), minLength(2))` 检查的是去除空格后的长度。
3. 遇到第一个错误时停止。使用 [`validate`](~/api/validate) 的 `{ all: true }` 选项可以检查所有规则。
4. 异步规则（[`checkAsync`](~/actions/check-async)）最后执行，并且只在其他规则通过后执行。

## 可以传入什么

| 类别 | 操作 |
| --- | --- |
| 长度 | [`minLength`](~/actions/min-length)、[`maxLength`](~/actions/max-length)、[`length`](~/actions/length) |
| 数字 | [`min`](~/actions/min)、[`max`](~/actions/max)、[`between`](~/actions/between)、[`integer`](~/actions/integer) |
| 格式 | [`pattern`](~/actions/pattern)、[`email`](~/actions/email)、[`url`](~/actions/url)、[`uuid`](~/actions/uuid)、[`startsWith`](~/actions/starts-with)、[`endsWith`](~/actions/ends-with)、[`includes`](~/actions/includes) |
| 日期 | [`minDate`](~/actions/min-date)、[`maxDate`](~/actions/max-date)、[`after`](~/actions/after)、[`before`](~/actions/before) |
| 数组 | [`unique`](~/actions/unique) |
| 校验位 | [`inn`](~/actions/inn)、[`snils`](~/actions/snils)、[`luhn`](~/actions/luhn) |
| 比较 | [`sameAs`](~/actions/same-as) |
| 转换 | [`trim`](~/actions/trim)、[`toLowerCase`](~/actions/to-lower-case)、[`toUpperCase`](~/actions/to-upper-case) |
| 自定义 | [`check`](~/actions/check)、[`checkAsync`](~/actions/check-async) |

TypeScript 会检查规则是否与 Schema 类型匹配：`pipe(string(), min(1))` 会产生编译错误。

`pipe` 中的转换不会改变类型。要得到其他类型的值，请使用 [`transform`](~/schemas/transform)。
:::

## @t(examples)

::: ru
### Логин

```ts
const username = pipe(
  string(),
  trim(),
  toLowerCase(),
  minLength(3),
  maxLength(20),
  pattern(/^[a-z0-9_]+$/, 'Только латиница, цифры и _'),
);
```

### С optional

```ts
// optional снаружи pipe
const phone = optional(pipe(string(), pattern(/^\+7\d{10}$/)));
```
:::

::: en
### Username

```ts
const username = pipe(
  string(),
  trim(),
  toLowerCase(),
  minLength(3),
  maxLength(20),
  pattern(/^[a-z0-9_]+$/, 'Only latin letters, digits and _'),
);
```

### With optional

```ts
// optional goes outside pipe
const phone = optional(pipe(string(), pattern(/^\+1\d{10}$/)));
```
:::

::: zh
### 用户名

```ts
const username = pipe(
  string(),
  trim(),
  toLowerCase(),
  minLength(3),
  maxLength(20),
  pattern(/^[a-z0-9_]+$/, '只能包含拉丁字母、数字和 _'),
);
```

### 与 optional 一起使用

```ts
// optional 放在 pipe 外层
const phone = optional(pipe(string(), pattern(/^1\d{10}$/)));
```
:::

## @t(see)

::: ru
- [check](~/actions/check) — своё правило
- [transform](~/schemas/transform) — изменить тип
- [validate](~/api/validate) — опция all
:::

::: en
- [check](~/actions/check) — a custom rule
- [transform](~/schemas/transform) — change the type
- [validate](~/api/validate) — the all option
:::

::: zh
- [check](~/actions/check)：自定义规则
- [transform](~/schemas/transform)：改变类型
- [validate](~/api/validate)：all 选项
:::
