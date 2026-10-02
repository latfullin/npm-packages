::: ru
Массив, каждый элемент которого проверяется одной схемой.
:::

::: en
An array whose every item is validated with one schema.
:::

::: zh
数组，其中每个元素都用同一个 Schema 校验。
:::

## @t(signature)

```ts
function array<T>(item: Schema<T>, msg?: Message): Schema<T[]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `item` | `Schema<T>` | Схема для каждого элемента |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `item` | `Schema<T>` | The schema for each item |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `item` | `Schema<T>` | 每个元素的 Schema |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `array` | Не массив | Must be an array |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `array` | Not an array | Must be an array |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `array` | 不是数组 | Must be an array |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Пустой массив `[]` — валидное значение. Чтобы потребовать хотя бы один элемент: `pipe(array(...), minLength(1))`.
- Ошибки элементов имеют путь с индексом: `items.2.title`.
- Проверяются все элементы, а не только до первой ошибки.
- Длину массива проверяют [`minLength`](~/actions/min-length), [`maxLength`](~/actions/max-length) и [`length`](~/actions/length).
:::

::: en
- An empty array `[]` is valid. To require at least one item: `pipe(array(...), minLength(1))`.
- Item errors have a path with an index: `items.2.title`.
- All items are validated, not only until the first error.
- The array length is checked with [`minLength`](~/actions/min-length), [`maxLength`](~/actions/max-length) and [`length`](~/actions/length).
:::

::: zh
- 空数组 `[]` 是有效值。要求至少一个元素：`pipe(array(...), minLength(1))`。
- 元素的错误路径包含索引：`items.2.title`。
- 会校验所有元素，而不是在第一个错误处停止。
- 数组长度由 [`minLength`](~/actions/min-length)、[`maxLength`](~/actions/max-length) 和 [`length`](~/actions/length) 检查。
:::

## @t(examples)

::: ru
### Позиции заказа

```ts
const Order = object({
  items: pipe(
    array(object({ id: number(), qty: pipe(number(), integer(), min(1)) })),
    minLength(1, 'Корзина пуста'),
  ),
});

validate(Order, { items: [{ id: 1, qty: 0 }] }).errors; // { 'items.0.qty': 'Must be at least 1' }
```

### Теги
:::

::: en
### Order items

```ts
const Order = object({
  items: pipe(
    array(object({ id: number(), qty: pipe(number(), integer(), min(1)) })),
    minLength(1, 'The cart is empty'),
  ),
});

validate(Order, { items: [{ id: 1, qty: 0 }] }).errors; // { 'items.0.qty': 'Must be at least 1' }
```

### Tags
:::

::: zh
### 订单商品

```ts
const Order = object({
  items: pipe(
    array(object({ id: number(), qty: pipe(number(), integer(), min(1)) })),
    minLength(1, '购物车为空'),
  ),
});

validate(Order, { items: [{ id: 1, qty: 0 }] }).errors; // { 'items.0.qty': 'Must be at least 1' }
```

### 标签
:::

```ts
const tags = optional(array(pipe(string(), trim(), toLowerCase())), () => []);
```

## @t(see)

::: ru
- [object](~/schemas/object)
- [minLength](~/actions/min-length) — минимальное число элементов
:::

::: en
- [object](~/schemas/object)
- [minLength](~/actions/min-length) — minimum number of items
:::

::: zh
- [object](~/schemas/object)
- [minLength](~/actions/min-length)：最少元素数量
:::
