::: ru
Дата не позже указанной.
:::

::: en
The date is not later than the given one.
:::

::: zh
日期不晚于给定日期。
:::

## @t(signature)

```ts
function maxDate(date: Date | string | number | (() => Date), msg?: Message): Action<Date>
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
| `maxDate` | Дата позже | Must be on or before &#123;date&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `maxDate` | The date is later | Must be on or before &#123;date&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `maxDate` | 日期更晚 | Must be on or before &#123;date&#125; |

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
### Дата рождения
:::

::: en
### Date of birth
:::

::: zh
### 出生日期
:::

```ts
const birthday = pipe(coerce.date(), minDate('1900-01-01'), maxDate(() => new Date()));
```

## @t(see)

::: ru
- [minDate](~/actions/min-date)
- [before](~/actions/before) — сравнение с другим полем
:::

::: en
- [minDate](~/actions/min-date)
- [before](~/actions/before) — comparison with another field
:::

::: zh
- [minDate](~/actions/min-date)
- [before](~/actions/before)：与其他字段比较
:::
