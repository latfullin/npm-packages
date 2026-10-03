::: ru
Дата позже даты в соседнем поле.
:::

::: en
The date is later than the date in a sibling field.
:::

::: zh
日期晚于同级字段中的日期。
:::

## @t(signature)

```ts
function after(field: string, msg?: Message): Action<Date>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `field` | `string` | Имя соседнего поля |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `field` | `string` | Name of the sibling field |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | `string` | 同级字段的名称 |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `after` | Дата не позже соседней | Must be after &#123;field&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `after` | The date is not later than the sibling | Must be after &#123;field&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `after` | 日期不晚于同级字段 | Must be after &#123;field&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Сравнивается с исходным значением соседнего поля — датой или строкой. Если соседнее поле пустое или не дата, правило пропускает: ошибку покажет схема того поля.
:::

::: en
Compared with the raw value of the sibling field — a date or a string. If the sibling is empty or not a date, the rule passes: that field's schema reports the error.
:::

::: zh
与同级字段的原始值（日期或字符串）比较。如果同级字段为空或不是日期，该规则直接通过：错误由那个字段的 Schema 报告。
:::

## @t(example)

```ts
const Period = object({
  start: coerce.date(),
  end: pipe(coerce.date(), after('start')),
});

validate(Period, { start: '2026-05-10', end: '2026-05-01' }).errors; // { end: 'Must be after start' }
```

## @t(see)

::: ru
- [before](~/actions/before)
- [minDate](~/actions/min-date)
:::

::: en
- [before](~/actions/before)
- [minDate](~/actions/min-date)
:::

::: zh
- [before](~/actions/before)
- [minDate](~/actions/min-date)
:::
