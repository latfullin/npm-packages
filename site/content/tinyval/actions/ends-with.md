::: ru
Строка заканчивается на `value`.
:::

::: en
The string ends with `value`.
:::

::: zh
字符串以 `value` 结尾。
:::

## @t(signature)

```ts
function endsWith(value: string, msg?: Message): Action<string>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `value` | `string` | Искомая подстрока |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `string` | The substring |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 要查找的子字符串 |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `endsWith` | Условие не выполнено | Must end with "&#123;value&#125;" |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `endsWith` | The condition is not met | Must end with "&#123;value&#125;" |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `endsWith` | 条件不满足 | Must end with "&#123;value&#125;" |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
С учётом регистра. Чтобы не учитывать регистр, добавьте перед правилом [`toLowerCase`](~/actions/to-lower-case).
:::

::: en
Case-sensitive. To ignore case, add [`toLowerCase`](~/actions/to-lower-case) before the rule.
:::

::: zh
区分大小写。如需忽略大小写，请在规则前添加 [`toLowerCase`](~/actions/to-lower-case)。
:::

## @t(example)

```ts
pipe(string(), email(), endsWith('@company.com', 'Only corporate email'))
```

## @t(see)

::: ru
- [pattern](~/actions/pattern) — сложные условия
:::

::: en
- [pattern](~/actions/pattern) — complex conditions
:::

::: zh
- [pattern](~/actions/pattern)：复杂条件
:::
