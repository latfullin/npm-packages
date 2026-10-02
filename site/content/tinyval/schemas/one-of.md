::: ru
Одно из перечисленных значений — аналог `enum` или правила `in:` в Laravel.
:::

::: en
One of the listed values — like an `enum` or Laravel's `in:` rule.
:::

::: zh
列出的值之一 —— 类似 `enum` 或 Laravel 的 `in:` 规则。
:::

## @t(signature)

```ts
function oneOf<const T extends readonly (string | number | boolean)[]>(values: T, msg?: Message): Schema<T[number]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `values` | `readonly (string | number | boolean)[]` | Допустимые значения |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `values` | `readonly (string | number | boolean)[]` | Allowed values |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `values` | `readonly (string | number | boolean)[]` | 允许的值 |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `oneOf` | Значения нет в списке | Must be one of: &#123;options&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `oneOf` | The value is not in the list | Must be one of: &#123;options&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `oneOf` | 值不在列表中 | Must be one of: &#123;options&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Тип результата — объединение значений: `oneOf(['admin', 'user'])` → `'admin' | 'user'`.
- В сообщении параметр `{options}` — значения через запятую.
- Сравнение строгое: `oneOf([1, 2])` не пропустит строку `'1'`. Для query используйте `preprocess(Number, oneOf([1, 2]))`.

## Примеры

### Роль пользователя
:::

::: en
- The result type is a union of the values: `oneOf(['admin', 'user'])` → `'admin' | 'user'`.
- The `{options}` parameter is the values joined with commas.
- Strict comparison: `oneOf([1, 2])` rejects the string `'1'`. For query strings use `preprocess(Number, oneOf([1, 2]))`.

## Example

### User role
:::

::: zh
- 结果类型是这些值的联合类型：`oneOf(['admin', 'user'])` → `'admin' | 'user'`。
- 信息中的 `{options}` 参数是用逗号连接的值。
- 使用严格比较：`oneOf([1, 2])` 不接受字符串 `'1'`。对于 query 请使用 `preprocess(Number, oneOf([1, 2]))`。

## 示例

### 用户角色
:::

```ts
const ROLES = ['admin', 'editor', 'user'] as const;

const User = object({
  role: optional(oneOf(ROLES), 'user'),
});

validate(User, { role: 'root' }).errors; // { role: 'Must be one of: admin, editor, user' }
```

## @t(see)

::: ru
- [literal](~/schemas/literal) — одно конкретное значение
- [preprocess](~/schemas/preprocess)
:::

::: en
- [literal](~/schemas/literal) — one specific value
- [preprocess](~/schemas/preprocess)
:::

::: zh
- [literal](~/schemas/literal)：一个特定的值
- [preprocess](~/schemas/preprocess)
:::
