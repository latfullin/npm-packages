::: ru
Логическое значение `true` или `false`.
:::

::: en
A boolean value: `true` or `false`.
:::

::: zh
布尔值：`true` 或 `false`。
:::

## @t(signature)

```ts
function boolean(msg?: Message): Schema<boolean>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |

## Пропускает

Только `true` и `false`. `false` — валидное значение, а не пустое.

Пустыми считаются `undefined`, `null` и `''` — подробнее в разделе [Пустые значения](~/guide/empty-values).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |

## Accepts

Only `true` and `false`. `false` is a valid value, not an empty one.

`undefined`, `null` and `''` are treated as empty — see [Empty values](~/guide/empty-values).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |

## 接受的值

只接受 `true` 和 `false`。`false` 是有效值，而不是空值。

`undefined`、`null` 和 `''` 都被视为空值 —— 详见 [空值](~/guide/empty-values)。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `boolean` | Не `true`/`false` | Must be a boolean |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).

## Чекбоксы и query

Из форм чекбокс приходит как `"on"`, из query — `"true"`/`"1"`. Используйте [`coerce.boolean`](~/schemas/coerce).

Чтобы потребовать именно `true` (например, «Согласен с условиями»), используйте [`literal(true)`](~/schemas/literal).

## Примеры

### Подписка на рассылку

```ts
const Settings = object({
  newsletter: optional(boolean(), false),
});

validate(Settings, {}).data;                  // { newsletter: false }
validate(Settings, { newsletter: true }).data; // { newsletter: true }
```
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `boolean` | Not `true`/`false` | Must be a boolean |

You can change the texts: see [Messages & i18n](~/guide/messages).

## Checkboxes and query strings

A form checkbox is sent as `"on"`, a query parameter as `"true"`/`"1"`. Use [`coerce.boolean`](~/schemas/coerce).

To require exactly `true` (e.g. "I accept the terms"), use [`literal(true)`](~/schemas/literal).

## Example

### Newsletter subscription

```ts
const Settings = object({
  newsletter: optional(boolean(), false),
});

validate(Settings, {}).data;                   // { newsletter: false }
validate(Settings, { newsletter: true }).data; // { newsletter: true }
```
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `boolean` | 不是 `true`/`false` | Must be a boolean |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。

## 复选框和 query

表单复选框以 `"on"` 提交，query 参数为 `"true"`/`"1"`。请使用 [`coerce.boolean`](~/schemas/coerce)。

如果必须为 `true`（例如“我同意条款”），请使用 [`literal(true)`](~/schemas/literal)。

## 示例

### 订阅邮件

```ts
const Settings = object({
  newsletter: optional(boolean(), false),
});

validate(Settings, {}).data;                   // { newsletter: false }
validate(Settings, { newsletter: true }).data; // { newsletter: true }
```
:::

## @t(see)

::: ru
- [coerce.boolean](~/schemas/coerce)
- [literal](~/schemas/literal) — обязательное согласие
:::

::: en
- [coerce.boolean](~/schemas/coerce)
- [literal](~/schemas/literal) — required consent
:::

::: zh
- [coerce.boolean](~/schemas/coerce)
- [literal](~/schemas/literal)：必须同意
:::
