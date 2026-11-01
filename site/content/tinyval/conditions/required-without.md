::: ru
Поле обязательно, если **не** заполнено хотя бы одно из перечисленных полей. Аналог `required_without` в Laravel — например, «телефон или email».
:::

::: en
The field is required if at least one of the listed fields is **not** filled. Like `required_without` in Laravel — e.g. "phone or email".
:::

::: zh
列出的字段中至少有一个**未**填写时，该字段为必填。类似 Laravel 的 `required_without` —— 例如“电话或邮箱”。
:::

## @t(signature)

```ts
function requiredWithout<T>(fields: string[], schema: Schema<T>): Schema<T | undefined>
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

## @t(example)

::: ru
### Телефон или email
:::

::: en
### Phone or email
:::

::: zh
### 电话或邮箱
:::

```ts
const Contact = object({
  phone: requiredWithout(['email'], string()),
  email: requiredWithout(['phone'], pipe(string(), email())),
});

validate(Contact, {}).errors;                  // { phone: 'Required', email: 'Required' }
validate(Contact, { email: 'a@a.ru' }).valid;  // true
```

## @t(see)

::: ru
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: en
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [prohibitedIf](~/conditions/prohibited-if)
:::

::: zh
- [requiredIf](~/conditions/required-if)
- [requiredUnless](~/conditions/required-unless)
- [requiredWith](~/conditions/required-with)
- [prohibitedIf](~/conditions/prohibited-if)
:::
