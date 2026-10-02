::: ru
Значение совпадает с соседним полем того же объекта. Аналог `confirmed` в Laravel.
:::

::: en
The value equals a sibling field of the same object. Like Laravel's `confirmed`.
:::

::: zh
值与同一对象中的另一个字段相等。类似 Laravel 的 `confirmed`。
:::

## @t(signature)

```ts
function sameAs(field: string, msg?: Message): Action<unknown>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `field` | `string` | Имя поля в том же объекте |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `field` | `string` | Field name in the same object |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | `string` | 同一对象中的字段名 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `sameAs` | Значения отличаются | Must match &#123;field&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `sameAs` | The values differ | Must match &#123;field&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `sameAs` | 值不一致 | Must match &#123;field&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Сравнивается с **исходным** значением поля (до `trim` и других преобразований). Если поле обрезается, обрежьте и подтверждение.
- Работает только внутри одного [`object`](~/schemas/object). Для сравнения с полями в других местах используйте [`check`](~/actions/check) и `root`.
:::

::: en
- Compared with the **raw** value of the field (before `trim` and other transforms). If the field is trimmed, trim the confirmation too.
- Works only within one [`object`](~/schemas/object). To compare with fields elsewhere use [`check`](~/actions/check) and `root`.
:::

::: zh
- 与该字段的**原始**值比较（在 `trim` 等转换之前）。如果字段会去除空格，确认字段也要去除。
- 只在同一个 [`object`](~/schemas/object) 内有效。要与其他位置的字段比较，请使用 [`check`](~/actions/check) 和 `root`。
:::

## @t(example)

::: ru
### Подтверждение пароля

```ts
const Signup = object({
  password: pipe(string(), minLength(8)),
  passwordConfirm: pipe(string(), sameAs('password', 'Пароли не совпадают')),
});
```
:::

::: en
### Password confirmation

```ts
const Signup = object({
  password: pipe(string(), minLength(8)),
  passwordConfirm: pipe(string(), sameAs('password', 'Passwords do not match')),
});
```
:::

::: zh
### 确认密码

```ts
const Signup = object({
  password: pipe(string(), minLength(8)),
  passwordConfirm: pipe(string(), sameAs('password', '两次输入的密码不一致')),
});
```
:::

## @t(see)

::: ru
- [check](~/actions/check) — сравнение с другими полями
:::

::: en
- [check](~/actions/check) — comparing with other fields
:::

::: zh
- [check](~/actions/check)：与其他字段比较
:::
