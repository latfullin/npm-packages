::: ru
Ровно одно конкретное значение: строка, число или `true`/`false`. Сравнение строгое (`===`).
:::

::: en
Exactly one specific value: a string, a number or `true`/`false`. Strict comparison (`===`).
:::

::: zh
恰好等于某个特定值：字符串、数字或 `true`/`false`。使用严格比较（`===`）。
:::

## @t(signature)

```ts
function literal<const T extends string | number | boolean>(value: T, msg?: Message): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `value` | `string | number | boolean` | Ожидаемое значение |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `string | number | boolean` | The expected value |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string | number | boolean` | 期望的值 |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `literal` | Значение не совпадает | Must be &#123;expected&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `literal` | The value does not match | Must be &#123;expected&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `literal` | 值不匹配 | Must be &#123;expected&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Тип результата — сам литерал: `literal('admin')` даёт тип `'admin'`, а не `string`.
- `literal('')` не сработает: пустая строка считается незаполненным значением. См. [Пустые значения](~/guide/empty-values).
:::

::: en
- The result type is the literal itself: `literal('admin')` gives `'admin'`, not `string`.
- `literal('')` won't work: an empty string is a missing value. See [Empty values](~/guide/empty-values).
:::

::: zh
- 结果类型就是字面量本身：`literal('admin')` 的类型是 `'admin'`，而不是 `string`。
- `literal('')` 不起作用：空字符串被视为未填写。见 [空值](~/guide/empty-values)。
:::

## @t(examples)

::: ru
### Согласие с условиями

```ts
const Signup = object({
  terms: literal(true, 'Нужно принять условия'),
});
```

### Версия API
:::

::: en
### Accepting terms

```ts
const Signup = object({
  terms: literal(true, 'You must accept the terms'),
});
```

### API version
:::

::: zh
### 同意条款

```ts
const Signup = object({
  terms: literal(true, '请同意条款'),
});
```

### API 版本
:::

```ts
const Payload = object({ version: literal(2), data: unknown() });
```

## @t(see)

::: ru
- [oneOf](~/schemas/one-of) — одно из нескольких значений
- [boolean](~/schemas/boolean)
:::

::: en
- [oneOf](~/schemas/one-of) — one of several values
- [boolean](~/schemas/boolean)
:::

::: zh
- [oneOf](~/schemas/one-of)：多个值中的一个
- [boolean](~/schemas/boolean)
:::
