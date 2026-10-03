::: ru
Число в диапазоне от `min` до `max` включительно.
:::

::: en
A number from `min` to `max` inclusive.
:::

::: zh
介于 `min` 和 `max` 之间（包含）的数字。
:::

## @t(signature)

```ts
function between(min: number, max: number, msg?: Message): Action<number>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `min` | `number` | Минимум |
| `max` | `number` | Максимум |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `min` | `number` | Minimum |
| `max` | `number` | Maximum |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `min` | `number` | 最小值 |
| `max` | `number` | 最大值 |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `between` | Число вне диапазона | Must be between &#123;min&#125; and &#123;max&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `between` | The number is out of range | Must be between &#123;min&#125; and &#123;max&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `between` | 数字超出范围 | Must be between &#123;min&#125; and &#123;max&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(example)

```ts
const rating = pipe(coerce.number(), integer(), between(1, 5));
```

## @t(see)

::: ru
- [min](~/actions/min)
- [max](~/actions/max)
:::

::: en
- [min](~/actions/min)
- [max](~/actions/max)
:::

::: zh
- [min](~/actions/min)
- [max](~/actions/max)
:::
