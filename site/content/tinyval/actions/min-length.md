::: ru
Длина строки или массива не меньше `min`.
:::

::: en
The length of a string or array is at least `min`.
:::

::: zh
字符串或数组的长度不少于 `min`。
:::

## @t(signature)

```ts
function minLength(min: number, msg?: Message): Action<{ length: number }>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `min` | `number` | Минимальная длина (включительно) |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `min` | `number` | Minimum length (inclusive) |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `min` | `number` | 最小长度（包含） |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `minLength` | Длина меньше `min` | Must be at least &#123;min&#125; long |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `minLength` | Length is less than `min` | Must be at least &#123;min&#125; long |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `minLength` | 长度小于 `min` | Must be at least &#123;min&#125; long |

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
### Пароль

```ts
pipe(string(), minLength(8, 'Минимум {min} символов'))
```

### Хотя бы один элемент

```ts
pipe(array(string()), minLength(1, 'Выберите хотя бы один вариант'))
```
:::

::: en
### Password

```ts
pipe(string(), minLength(8, 'At least {min} characters'))
```

### At least one item

```ts
pipe(array(string()), minLength(1, 'Select at least one option'))
```
:::

::: zh
### 密码

```ts
pipe(string(), minLength(8, '至少 {min} 个字符'))
```

### 至少一个元素

```ts
pipe(array(string()), minLength(1, '请至少选择一项'))
```
:::

## @t(see)

::: ru
- [maxLength](~/actions/max-length)
- [length](~/actions/length)
- [min](~/actions/min) — для чисел
:::

::: en
- [maxLength](~/actions/max-length)
- [length](~/actions/length)
- [min](~/actions/min) — for numbers
:::

::: zh
- [maxLength](~/actions/max-length)
- [length](~/actions/length)
- [min](~/actions/min)：用于数字
:::
