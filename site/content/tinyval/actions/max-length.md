::: ru
Длина строки или массива не больше `max`.
:::

::: en
The length of a string or array is at most `max`.
:::

::: zh
字符串或数组的长度不超过 `max`。
:::

## @t(signature)

```ts
function maxLength(max: number, msg?: Message): Action<{ length: number }>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `max` | `number` | Максимальная длина (включительно) |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `max` | `number` | Maximum length (inclusive) |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `max` | `number` | 最大长度（包含） |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `maxLength` | Строка длиннее `max` | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long |
| `maxItems` | Массив длиннее `max` | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `maxLength` | A string is longer than `max` | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long |
| `maxItems` | An array has more than `max` items | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `maxLength` | 字符串长于 `max` | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long |
| `maxItems` | 数组元素多于 `max` | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; |

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

## @t(examples)

::: ru
### Под размер колонки в базе
:::

::: en
### Fits a database column
:::

::: zh
### 符合数据库字段长度
:::

```ts
pipe(string(), trim(), maxLength(255))
```

::: ru
### Не больше 5 файлов
:::

::: en
### Up to 5 files
:::

::: zh
### 最多 5 个文件
:::

```ts
pipe(array(string()), maxLength(5))
```

## @t(see)

- [minLength](~/actions/min-length)
- [length](~/actions/length)
