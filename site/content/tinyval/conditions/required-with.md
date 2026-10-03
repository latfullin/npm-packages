::: ru
Поле обязательно, если заполнено хотя бы одно из перечисленных полей. Аналог `required_with` в Laravel.
:::

::: en
The field is required if at least one of the listed fields is filled. Like `required_with` in Laravel.
:::

::: zh
列出的字段中至少有一个已填写时，该字段为必填。类似 Laravel 的 `required_with`。
:::

## @t(signature)

```ts
function requiredWith<T>(fields: string[], schema: Schema<T>): Schema<T | undefined>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `fields` | `string[]` | Имена соседних полей |
| `schema` | `Schema<T>` | Схема значения, когда оно передано |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `fields` | `string[]` | Names of sibling fields |
| `schema` | `Schema<T>` | The value schema when it is provided |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fields` | `string[]` | 同级字段的名称 |
| `schema` | `Schema<T>` | 值存在时使用的 Schema |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое, а поле обязательно | Required |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty and the field is required | Required |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空且该字段为必填 | Required |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Заполненным считается любое значение, кроме `undefined`, `null` и `''` — см. [Пустые значения](~/guide/empty-values).
:::

::: en
Any value except `undefined`, `null` and `''` counts as filled — see [Empty values](~/guide/empty-values).
:::

::: zh
除 `undefined`、`null` 和 `''` 之外的任何值都视为已填写 —— 见 [空值](~/guide/empty-values)。
:::

## @t(example)

```ts
const ChangePassword = object({
  password: optional(pipe(string(), minLength(8))),
  passwordConfirm: requiredWith(['password'], pipe(string(), sameAs('password'))),
});

validate(ChangePassword, {}).valid;                     // true — nothing to change
validate(ChangePassword, { password: 'secret123' }).errors; // { passwordConfirm: 'Required' }
```

## @t(see)

::: ru
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: en
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: zh
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWithout](~/conditions/required-without)
- [prohibitedIf](~/conditions/prohibited-if)
:::
