::: ru
Целое число.
:::

::: en
An integer.
:::

::: zh
整数。
:::

## @t(signature)

```ts
function integer(msg?: Message): Action<number>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `integer` | Есть дробная часть | Must be an integer |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `integer` | Has a fractional part | Must be an integer |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `integer` | 有小数部分 | Must be an integer |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Проверка через `Number.isInteger`: `5.0` — целое, `5.5` — нет.
:::

::: en
Checked with `Number.isInteger`: `5.0` is an integer, `5.5` is not.
:::

::: zh
使用 `Number.isInteger` 检查：`5.0` 是整数，`5.5` 不是。
:::

## @t(example)

::: ru
### Номер страницы
:::

::: en
### Page number
:::

::: zh
### 页码
:::

```ts
optional(pipe(coerce.number(), integer(), min(1)), 1)
```

## @t(see)

- [min](~/actions/min)
- [max](~/actions/max)
- [coerce](~/schemas/coerce)
