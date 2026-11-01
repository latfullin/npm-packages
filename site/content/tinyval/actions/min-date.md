::: ru
Дата не раньше указанной.
:::

::: en
The date is not earlier than the given one.
:::

::: zh
日期不早于给定日期。
:::

## @t(signature)

```ts
function minDate(date: Date | string | number | (() => Date), msg?: Message): Action<Date>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `date` | `Date \| string \| number \| (() => Date)` | Дата или функция, которая её возвращает — функция вызывается при каждой проверке |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `date` | `Date \| string \| number \| (() => Date)` | A date or a function returning it — the function is called on every validation |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `date` | `Date \| string \| number \| (() => Date)` | 日期或返回日期的函数 —— 函数在每次校验时调用 |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `minDate` | Дата раньше | Must be on or after &#123;date&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `minDate` | The date is earlier | Must be on or after &#123;date&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `minDate` | 日期更早 | Must be on or after &#123;date&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Работает с [`date`](~/schemas/date) и [`coerce.date`](~/schemas/coerce). В сообщении `{date}` — дата в формате `ГГГГ-ММ-ДД`.
:::

::: en
Works with [`date`](~/schemas/date) and [`coerce.date`](~/schemas/coerce). In the message `{date}` is the date as `YYYY-MM-DD`.
:::

::: zh
与 [`date`](~/schemas/date) 和 [`coerce.date`](~/schemas/coerce) 一起使用。信息中的 `{date}` 为 `YYYY-MM-DD` 格式的日期。
:::

## @t(example)

::: ru
### Бронь не в прошлом
:::

::: en
### A booking not in the past
:::

::: zh
### 预订不能在过去
:::

```ts
const checkIn = pipe(coerce.date(), minDate(() => new Date()));
```

## @t(see)

::: ru
- [maxDate](~/actions/max-date)
- [after](~/actions/after) — сравнение с другим полем
:::

::: en
- [maxDate](~/actions/max-date)
- [after](~/actions/after) — comparison with another field
:::

::: zh
- [maxDate](~/actions/max-date)
- [after](~/actions/after)：与其他字段比较
:::
