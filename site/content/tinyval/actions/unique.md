::: ru
В массиве нет повторяющихся элементов.
:::

::: en
The array has no duplicate items.
:::

::: zh
数组中没有重复的元素。
:::

## @t(signature)

```ts
function unique<T>(by?: (item: T) => unknown, msg?: Message): Action<T[]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `by` | `(item: T) => unknown` | По какому значению сравнивать: `(u) => u.email`. По умолчанию — сам элемент |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `by` | `(item: T) => unknown` | What to compare by: `(u) => u.email`. Default — the item itself |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `by` | `(item: T) => unknown` | 按什么值比较：`(u) => u.email`。默认为元素本身 |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `unique` | Есть повторы | Must not contain duplicates |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `unique` | There are duplicates | Must not contain duplicates |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `unique` | 存在重复 | Must not contain duplicates |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Строки и числа сравниваются по значению, объекты — по содержимому.
:::

::: en
Strings and numbers are compared by value, objects by content.
:::

::: zh
字符串和数字按值比较，对象按内容比较。
:::

## @t(example)

```ts
const Invite = object({
  emails: pipe(array(pipe(string(), email())), unique()),
  members: pipe(array(object({ email: string() })), unique((m) => m.email.toLowerCase())),
});
```

## @t(see)

::: ru
- [array](~/schemas/array)
- [minLength](~/actions/min-length)
:::

::: en
- [array](~/schemas/array)
- [minLength](~/actions/min-length)
:::

::: zh
- [array](~/schemas/array)
- [minLength](~/actions/min-length)
:::
