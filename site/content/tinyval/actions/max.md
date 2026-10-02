::: ru
Число не больше `max` (включительно).
:::

::: en
The number is at most `max` (inclusive).
:::

::: zh
数字不大于 `max`（包含）。
:::

## @t(signature)

```ts
function max(max: number, msg?: Message): Action<number>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `max` | `number` | Максимальное значение |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `max` | `number` | Maximum value |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `max` | `number` | 最大值 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `max` | Число больше `max` | Must be at most &#123;max&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `max` | The number is greater than `max` | Must be at most &#123;max&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `max` | 数字大于 `max` | Must be at most &#123;max&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Работает только с числами. Для длины строки — [`maxLength`](~/actions/max-length).
:::

::: en
Works with numbers only. For string length use [`maxLength`](~/actions/max-length).
:::

::: zh
只适用于数字。字符串长度请使用 [`maxLength`](~/actions/max-length)。
:::

## @t(example)

::: ru
### Оценка от 1 до 5
:::

::: en
### Rating from 1 to 5
:::

::: zh
### 1 到 5 分的评分
:::

```ts
pipe(number(), integer(), min(1), max(5))
```

## @t(see)

- [min](~/actions/min)
- [integer](~/actions/integer)
