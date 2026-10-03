::: ru
Строка — ссылка с разрешённым протоколом. По умолчанию только `http` и `https`.
:::

::: en
The string is a URL with an allowed protocol. Only `http` and `https` by default.
:::

::: zh
字符串是使用允许协议的链接。默认只允许 `http` 和 `https`。
:::

## @t(signature)

```ts
function url(msg?: Message, protocols?: string[]): Action<string>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение об ошибке |
| `protocols` | `string[]` | Разрешённые протоколы. По умолчанию `['http', 'https']` |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom error message |
| `protocols` | `string[]` | Allowed protocols. Default `['http', 'https']` |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义错误信息 |
| `protocols` | `string[]` | 允许的协议。默认为 `['http', 'https']` |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `url` | Не ссылка или другой протокол | Invalid URL |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `url` | Not a URL or another protocol | Invalid URL |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `url` | 不是链接或协议不允许 | Invalid URL |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Ссылки вида `javascript:` и `data:` не пройдут — значение безопасно выводить в `href`. Домен без протокола (`example.com`) — тоже ошибка: добавьте протокол [`preprocess`](~/schemas/preprocess) или [`startsWith`](~/actions/starts-with).
:::

::: en
`javascript:` and `data:` links won't pass — the value is safe to put into `href`. A domain without a protocol (`example.com`) is an error too: add the protocol with [`preprocess`](~/schemas/preprocess) or check with [`startsWith`](~/actions/starts-with).
:::

::: zh
`javascript:` 和 `data:` 链接无法通过 —— 该值可以安全地放入 `href`。没有协议的域名（`example.com`）也会报错：可以用 [`preprocess`](~/schemas/preprocess) 补上协议，或用 [`startsWith`](~/actions/starts-with) 检查。
:::

## @t(example)

```ts
const Profile = object({
  website: optional(pipe(string(), trim(), url())),
  ftp: optional(pipe(string(), url(undefined, ['ftp', 'sftp']))),
});
```

## @t(see)

::: ru
- [pattern](~/actions/pattern)
- [email](~/actions/email)
:::

::: en
- [pattern](~/actions/pattern)
- [email](~/actions/email)
:::

::: zh
- [pattern](~/actions/pattern)
- [email](~/actions/email)
:::
