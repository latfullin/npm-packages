::: ru
Поле обязательно, если условие **не** выполняется. Аналог `required_unless` в Laravel.
:::

::: en
The field is required unless the condition holds. Like `required_unless` in Laravel.
:::

::: zh
条件**不**满足时字段为必填。类似 Laravel 的 `required_unless`。
:::

## @t(signature)

```ts
function requiredUnless<T>(condition: Condition, schema: Schema<T>): Schema<T | undefined>

type Condition = Record<string, unknown> | ((info: { parent: unknown; root: unknown }) => boolean)
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `condition` | `Condition` | Соседние поля и их значения: `{ delivery: 'courier' }`; несколько значений — массивом: `{ delivery: ['courier', 'post'] }`. Или функция |
| `schema` | `Schema<T>` | Схема значения, когда оно передано |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `Condition` | Sibling fields and their values: `{ delivery: 'courier' }`; several values — an array: `{ delivery: ['courier', 'post'] }`. Or a function |
| `schema` | `Schema<T>` | The value schema when it is provided |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `condition` | `Condition` | 同级字段及其值：`{ delivery: 'courier' }`；多个值用数组：`{ delivery: ['courier', 'post'] }`。也可以是函数 |
| `schema` | `Schema<T>` | 值存在时使用的 Schema |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое, а поле обязательно | Required |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty and the field is required | Required |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空且该字段为必填 | Required |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Поля условия ищутся в том же объекте, что и само поле. Вложенные — через точку: `{ 'company.type': 'org' }`. Для доступа ко всем данным используйте функцию — она получает `{ parent, root }`.
- Когда поле не обязательно, оно работает как [`optional`](~/schemas/optional): пустое значение не попадает в `data`, а переданное — проверяется схемой.
- В типе TypeScript поле становится необязательным (`?`).
:::

::: en
- Condition fields are looked up in the same object as the field itself. Nested ones — with a dot: `{ 'company.type': 'org' }`. To reach all the data use a function — it receives `{ parent, root }`.
- When the field isn't required it works like [`optional`](~/schemas/optional): an empty value doesn't go to `data`, a provided one is validated by the schema.
- In the TypeScript type the field becomes optional (`?`).
:::

::: zh
- 条件中的字段在该字段所在的同一对象中查找。嵌套字段用点表示：`{ 'company.type': 'org' }`。如需访问全部数据，请使用函数 —— 它接收 `{ parent, root }`。
- 当字段不是必填时，它与 [`optional`](~/schemas/optional) 相同：空值不会进入 `data`，传入的值会按 Schema 校验。
- 在 TypeScript 类型中，该字段变为可选（`?`）。
:::

## @t(example)

```ts
const Order = object({
  delivery: oneOf(['pickup', 'courier']),
  // pickup point is required for everything except courier delivery
  pickupPoint: requiredUnless({ delivery: 'courier' }, string()),
});
```

## @t(see)

::: ru
- [requiredIf](~/conditions/required-if)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: en
- [requiredIf](~/conditions/required-if)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: zh
- [requiredIf](~/conditions/required-if)
- [requiredWith](~/conditions/required-with)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::
