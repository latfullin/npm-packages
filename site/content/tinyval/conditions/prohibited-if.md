::: ru
Поле должно быть пустым, если выполняется условие, иначе — необязательное. Аналог `prohibited_if` в Laravel.
:::

::: en
The field must be empty if the condition holds, otherwise it's optional. Like `prohibited_if` in Laravel.
:::

::: zh
满足条件时字段必须为空，否则为选填。类似 Laravel 的 `prohibited_if`。
:::

## @t(signature)

```ts
function prohibitedIf<T>(condition: Condition, schema: Schema<T>, msg?: Message): Schema<T | undefined>

type Condition = Record<string, unknown> | ((info: { parent: unknown; root: unknown }) => boolean)
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `condition` | `Condition` | Соседние поля и их значения: `{ delivery: 'courier' }`; несколько значений — массивом: `{ delivery: ['courier', 'post'] }`. Или функция |
| `schema` | `Schema<T>` | Схема значения, когда оно передано |
| `msg` | `Message` | Своё сообщение |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `Condition` | Sibling fields and their values: `{ delivery: 'courier' }`; several values — an array: `{ delivery: ['courier', 'post'] }`. Or a function |
| `schema` | `Schema<T>` | The value schema when it is provided |
| `msg` | `Message` | Custom message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `condition` | `Condition` | 同级字段及其值：`{ delivery: 'courier' }`；多个值用数组：`{ delivery: ['courier', 'post'] }`。也可以是函数 |
| `schema` | `Schema<T>` | 值存在时使用的 Schema |
| `msg` | `Message` | 自定义信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `prohibited` | Условие выполняется, а значение передано | Must be empty |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `prohibited` | The condition holds but a value is provided | Must be empty |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `prohibited` | 条件满足但传入了值 | Must be empty |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Защищает от данных, которые не должны прийти вместе: цена у бесплатного товара, ИНН у физлица без ИП.
:::

::: en
Protects from data that must not come together: a price for a free item, a company tax ID for an individual.
:::

::: zh
用于防止不应同时出现的数据：免费商品的价格、个人的公司税号。
:::

## @t(example)

```ts
const Product = object({
  type: oneOf(['free', 'paid']),
  price: prohibitedIf({ type: 'free' }, coerce.number()),
});

validate(Product, { type: 'free', price: '10' }).errors; // { price: 'Must be empty' }
validate(Product, { type: 'paid', price: '10' }).data;   // { type: 'paid', price: 10 }
```

## @t(see)

::: ru
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
:::

::: en
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
:::

::: zh
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
:::
