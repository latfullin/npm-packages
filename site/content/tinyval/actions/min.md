::: ru
Число не меньше `min` (включительно).
:::

::: en
The number is at least `min` (inclusive).
:::

::: zh
数字不小于 `min`（包含）。
:::

## @t(signature)

```ts
function min(min: number, msg?: Message): Action<number>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `min` | `number` | Минимальное значение |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `min` | `number` | Minimum value |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `min` | `number` | 最小值 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `min` | Число меньше `min` | Must be at least &#123;min&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `min` | The number is less than `min` | Must be at least &#123;min&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `min` | 数字小于 `min` | Must be at least &#123;min&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Работает только с числами. Для длины строки — [`minLength`](~/actions/min-length).
:::

::: en
Works with numbers only. For string length use [`minLength`](~/actions/min-length).
:::

::: zh
只适用于数字。字符串长度请使用 [`minLength`](~/actions/min-length)。
:::

## @t(example)

::: ru
### Цена
:::

::: en
### Price
:::

::: zh
### 价格
:::

```ts
pipe(coerce.number(), min(0))
```

## @t(see)

- [max](~/actions/max)
- [integer](~/actions/integer)
- [number](~/schemas/number)
