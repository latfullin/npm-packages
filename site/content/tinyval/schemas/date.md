::: ru
Объект `Date` с корректной датой.
:::

::: en
A `Date` object with a valid date.
:::

::: zh
包含有效日期的 `Date` 对象。
:::

## @t(signature)

```ts
function date(msg?: Message): Schema<Date>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |

## Пропускает

Экземпляр `Date`, у которого `getTime()` не `NaN`. `new Date('abc')` не пройдёт.

Пустыми считаются `undefined`, `null` и `''` — подробнее в разделе [Пустые значения](~/guide/empty-values).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |

## Accepts

A `Date` instance whose `getTime()` is not `NaN`. `new Date('abc')` is rejected.

`undefined`, `null` and `''` are treated as empty — see [Empty values](~/guide/empty-values).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |

## 接受的值

`getTime()` 不为 `NaN` 的 `Date` 实例。`new Date('abc')` 不会通过。

`undefined`、`null` 和 `''` 都被视为空值 —— 详见 [空值](~/guide/empty-values)。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `date` | Не `Date` или некорректная дата | Must be a valid date |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).

## Даты из JSON

В JSON нет типа «дата» — с клиента на сервер даты приходят строкой (`"2026-10-02"`). Используйте [`coerce.date`](~/schemas/coerce), он создаст `Date` из строки или числа.

## Примеры

### Период

```ts
const Period = object({
  from: coerce.date(),
  to: pipe(coerce.date(), check((v, { parent }) => v >= new Date(parent.from), 'Конец раньше начала')),
});

validate(Period, { from: '2026-01-10', to: '2026-01-01' }).errors; // { to: 'Конец раньше начала' }
```
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `date` | Not a `Date` or an invalid date | Must be a valid date |

You can change the texts: see [Messages & i18n](~/guide/messages).

## Dates from JSON

JSON has no date type — dates come from the client as strings (`"2026-10-02"`). Use [`coerce.date`](~/schemas/coerce), it creates a `Date` from a string or a number.

## Example

### Period

```ts
const Period = object({
  from: coerce.date(),
  to: pipe(coerce.date(), check((v, { parent }) => v >= new Date(parent.from), 'End is before start')),
});

validate(Period, { from: '2026-01-10', to: '2026-01-01' }).errors; // { to: 'End is before start' }
```
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `date` | 不是 `Date` 或日期无效 | Must be a valid date |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。

## 来自 JSON 的日期

JSON 没有日期类型 —— 客户端发送的日期是字符串（`"2026-10-02"`）。请使用 [`coerce.date`](~/schemas/coerce)，它会从字符串或数字创建 `Date`。

## 示例

### 时间段

```ts
const Period = object({
  from: coerce.date(),
  to: pipe(coerce.date(), check((v, { parent }) => v >= new Date(parent.from), '结束时间早于开始时间')),
});

validate(Period, { from: '2026-01-10', to: '2026-01-01' }).errors; // { to: '结束时间早于开始时间' }
```
:::

## @t(see)

::: ru
- [coerce.date](~/schemas/coerce) — дата из строки
- [check](~/actions/check) — сравнение дат
:::

::: en
- [coerce.date](~/schemas/coerce) — date from a string
- [check](~/actions/check) — comparing dates
:::

::: zh
- [coerce.date](~/schemas/coerce)：从字符串获取日期
- [check](~/actions/check)：比较日期
:::
