::: ru
Строка соответствует регулярному выражению.
:::

::: en
The string matches a regular expression.
:::

::: zh
字符串匹配正则表达式。
:::

## @t(signature)

```ts
function pattern(re: RegExp, msg?: Message): Action<string>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `re` | `RegExp` | Регулярное выражение |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `re` | `RegExp` | Regular expression |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `re` | `RegExp` | 正则表达式 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `pattern` | Строка не подходит | Invalid format |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `pattern` | The string does not match | Invalid format |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `pattern` | 字符串不匹配 | Invalid format |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Используйте `^` и `$`: без них `/\d+/` пропустит `'abc1'`, потому что найдёт цифру внутри строки.
- Флаг `g` безопасен — `lastIndex` сбрасывается перед каждой проверкой.
:::

::: en
- Use `^` and `$`: without them `/\d+/` accepts `'abc1'`, because it finds a digit inside the string.
- The `g` flag is safe — `lastIndex` is reset before each check.
:::

::: zh
- 请使用 `^` 和 `$`：没有它们，`/\d+/` 会接受 `'abc1'`，因为它在字符串中找到了数字。
- `g` 标志是安全的 —— 每次检查前都会重置 `lastIndex`。
:::

## @t(examples)

::: ru
### Телефон

```ts
pipe(string(), pattern(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'))
```
:::

::: en
### Phone

```ts
pipe(string(), pattern(/^\+1\d{10}$/, 'Format: +1XXXXXXXXXX'))
```
:::

::: zh
### 手机号

```ts
pipe(string(), pattern(/^1\d{10}$/, '请输入 11 位手机号'))
```
:::

### Slug

```ts
pipe(string(), pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/))
```

## @t(see)

::: ru
- [email](~/actions/email)
- [length](~/actions/length)
- [check](~/actions/check) — когда регулярного выражения мало
:::

::: en
- [email](~/actions/email)
- [length](~/actions/length)
- [check](~/actions/check) — when a regex is not enough
:::

::: zh
- [email](~/actions/email)
- [length](~/actions/length)
- [check](~/actions/check)：正则表达式不够用时
:::
