::: ru
Длина строки или массива ровно `length`.
:::

::: en
The length of a string or array is exactly `length`.
:::

::: zh
字符串或数组的长度恰好为 `length`。
:::

## @t(signature)

```ts
function length(length: number, msg?: Message): Action<{ length: number }>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `length` | `number` | Точная длина |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `length` | `number` | Exact length |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `length` | `number` | 精确长度 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `length` | Длина строки отличается | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long |
| `items` | Число элементов отличается | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `length` | String length differs | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long |
| `items` | Number of items differs | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `length` | 字符串长度不符 | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long |
| `items` | 元素数量不符 | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Работает со строками и массивами.
- Длина строки считается в UTF-16: эмодзи и некоторые редкие символы занимают 2 единицы (`'😀'.length === 2`).
:::

::: en
- Works with strings and arrays.
- String length is counted in UTF-16 units: emoji and some rare characters take 2 units (`'😀'.length === 2`).
:::

::: zh
- 适用于字符串和数组。
- 字符串长度按 UTF-16 计算：emoji 和部分生僻字占 2 个单位（`'😀'.length === 2`）。
:::

## @t(example)

::: ru
### Код из SMS
:::

::: en
### SMS code
:::

::: zh
### 短信验证码
:::

```ts
pipe(string(), length(6), pattern(/^\d+$/))
```

## @t(see)

- [minLength](~/actions/min-length)
- [maxLength](~/actions/max-length)
- [pattern](~/actions/pattern)
