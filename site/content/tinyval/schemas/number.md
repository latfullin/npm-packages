::: ru
Конечное число. `NaN`, `Infinity` и строки не проходят.
:::

::: en
A finite number. `NaN`, `Infinity` and strings are rejected.
:::

::: zh
有限数字。`NaN`、`Infinity` 和字符串都不会通过。
:::

## @t(signature)

```ts
function number(msg?: Message): Schema<number>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |

## Пропускает

Число, для которого `Number.isFinite(value) === true`. Ноль — валидное значение, а не пустое.

Пустыми считаются `undefined`, `null` и `''` — подробнее в разделе [Пустые значения](~/guide/empty-values).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |

## Accepts

A number for which `Number.isFinite(value) === true`. Zero is a valid value, not an empty one.

`undefined`, `null` and `''` are treated as empty — see [Empty values](~/guide/empty-values).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |

## 接受的值

满足 `Number.isFinite(value) === true` 的数字。零是有效值，而不是空值。

`undefined`、`null` 和 `''` 都被视为空值 —— 详见 [空值](~/guide/empty-values)。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `number` | Не число, `NaN` или `Infinity` | Must be a number |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).

## Числа из форм и query

Из HTML-форм и query-строк числа приходят строкой (`"42"`). Используйте [`coerce.number`](~/schemas/coerce) — он приведёт строку к числу.

## Примеры

### Количество товара

```ts
const qty = pipe(number(), integer(), min(1), max(99));

validate(qty, 3);    // valid
validate(qty, '3');  // Must be a number — нужен coerce.number()
validate(qty, 0);    // Must be at least 1
```
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `number` | Not a number, `NaN` or `Infinity` | Must be a number |

You can change the texts: see [Messages & i18n](~/guide/messages).

## Numbers from forms and query strings

HTML forms and query strings send numbers as strings (`"42"`). Use [`coerce.number`](~/schemas/coerce) — it converts the string to a number.

## Example

### Item quantity

```ts
const qty = pipe(number(), integer(), min(1), max(99));

validate(qty, 3);    // valid
validate(qty, '3');  // Must be a number — use coerce.number()
validate(qty, 0);    // Must be at least 1
```
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `number` | 不是数字、`NaN` 或 `Infinity` | Must be a number |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。

## 来自表单和 query 的数字

HTML 表单和 query 字符串中的数字以字符串形式提交（`"42"`）。请使用 [`coerce.number`](~/schemas/coerce) —— 它会把字符串转换为数字。

## 示例

### 商品数量

```ts
const qty = pipe(number(), integer(), min(1), max(99));

validate(qty, 3);    // 有效
validate(qty, '3');  // Must be a number —— 需要 coerce.number()
validate(qty, 0);    // Must be at least 1
```
:::

## @t(see)

::: ru
- [coerce.number](~/schemas/coerce) — число из строки
- [min](~/actions/min)
- [max](~/actions/max)
- [integer](~/actions/integer)
:::

::: en
- [coerce.number](~/schemas/coerce) — number from a string
- [min](~/actions/min)
- [max](~/actions/max)
- [integer](~/actions/integer)
:::

::: zh
- [coerce.number](~/schemas/coerce)：从字符串获取数字
- [min](~/actions/min)
- [max](~/actions/max)
- [integer](~/actions/integer)
:::
