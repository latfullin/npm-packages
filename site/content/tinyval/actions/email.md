::: ru
Строка похожа на email: `что-то@что-то.что-то`, без пробелов.
:::

::: en
The string looks like an email: `something@something.something`, no spaces.
:::

::: zh
字符串看起来像邮箱地址：`xxx@xxx.xxx`，不含空格。
:::

## @t(signature)

```ts
function email(msg?: Message): Action<string>
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
| `email` | Не похоже на email | Invalid email |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `email` | Does not look like an email | Invalid email |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `email` | 不像邮箱地址 | Invalid email |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Проверка намеренно простая: строгие регулярные выражения для email часто отклоняют настоящие адреса. Существует ли адрес — можно узнать только отправив письмо.
- Обычно вместе с [`trim`](~/actions/trim) и [`toLowerCase`](~/actions/to-lower-case), чтобы хранить email в одном виде.
:::

::: en
- The check is intentionally simple: strict email regexes often reject real addresses. The only way to know an address exists is to send an email.
- Usually combined with [`trim`](~/actions/trim) and [`toLowerCase`](~/actions/to-lower-case) to store emails consistently.
:::

::: zh
- 检查有意保持简单：严格的邮箱正则经常拒绝真实存在的地址。只有发送邮件才能确认地址是否存在。
- 通常与 [`trim`](~/actions/trim) 和 [`toLowerCase`](~/actions/to-lower-case) 一起使用，以统一存储格式。
:::

## @t(example)

::: ru
### Email
:::

::: en
### Email
:::

::: zh
### 邮箱
:::

```ts
pipe(string(), trim(), toLowerCase(), email())
```

## @t(see)

::: ru
- [pattern](~/actions/pattern) — своя проверка формата
- [checkAsync](~/actions/check-async) — проверить, что email не занят
:::

::: en
- [pattern](~/actions/pattern) — custom format check
- [checkAsync](~/actions/check-async) — check that the email is not taken
:::

::: zh
- [pattern](~/actions/pattern)：自定义格式检查
- [checkAsync](~/actions/check-async)：检查邮箱是否已被占用
:::
