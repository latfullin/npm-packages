::: ru
Несколько вариантов объекта, вариант выбирается по полю-признаку (например, `type`). В отличие от [`union`](~/schemas/union), показывает ошибки именно выбранного варианта.
:::

::: en
Several object variants; the variant is selected by a tag field (e.g. `type`). Unlike [`union`](~/schemas/union), it shows the errors of the selected variant.
:::

::: zh
多个对象变体，按标识字段（例如 `type`）选择变体。与 [`union`](~/schemas/union) 不同，它会显示所选变体的具体错误。
:::

## @t(signature)

```ts
function variant<K extends string, const T extends readonly ObjectSchema[]>(key: K, options: T, msg?: Message): Schema<Infer<T[number]>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `key` | `string` | Имя поля-признака |
| `options` | `ObjectSchema[]` | Схемы [`object`](~/schemas/object). У каждой должно быть поле `key` — обычно [`literal`](~/schemas/literal) |
| `msg` | `Message` | Своё сообщение для пустого значения, не объекта и неизвестного варианта |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | Name of the tag field |
| `options` | `ObjectSchema[]` | [`object`](~/schemas/object) schemas. Each must have the `key` field — usually a [`literal`](~/schemas/literal) |
| `msg` | `Message` | Custom message for an empty value, a non-object and an unknown variant |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 标识字段的名称 |
| `options` | `ObjectSchema[]` | [`object`](~/schemas/object) Schema。每个都必须包含 `key` 字段 —— 通常是 [`literal`](~/schemas/literal) |
| `msg` | `Message` | 值为空、不是对象或变体未知时的自定义信息 |
:::

## @t(notes)

::: ru
- Признак проверяется схемой поля `key` каждого варианта по порядку; дальше объект проверяется подошедшим вариантом целиком.
- Признак может быть [`literal`](~/schemas/literal), [`oneOf`](~/schemas/one-of) или [`enumOf`](~/schemas/enum-of) — их значения попадают в сообщение об ошибке.
- Ошибка неизвестного варианта привязана к полю-признаку: `errors.type`.
- Тип результата — размеченное объединение: после `if (data.type === 'card')` TypeScript знает поля этого варианта.
:::

::: en
- The tag is checked against the `key` field schema of each variant in order; then the whole object is validated by the matching variant.
- The tag can be a [`literal`](~/schemas/literal), [`oneOf`](~/schemas/one-of) or [`enumOf`](~/schemas/enum-of) — their values are listed in the error message.
- The unknown-variant error is attached to the tag field: `errors.type`.
- The result type is a discriminated union: after `if (data.type === 'card')` TypeScript knows the fields of that variant.
:::

::: zh
- 按顺序用每个变体中 `key` 字段的 Schema 检查标识，然后用匹配的变体校验整个对象。
- 标识可以是 [`literal`](~/schemas/literal)、[`oneOf`](~/schemas/one-of) 或 [`enumOf`](~/schemas/enum-of) —— 它们的值会出现在错误信息中。
- 未知变体的错误关联到标识字段：`errors.type`。
- 结果类型是可辨识联合：在 `if (data.type === 'card')` 之后，TypeScript 知道该变体的字段。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение или признак пустые | Required |
| `object` | Не объект | Must be an object |
| `variant` | Неизвестное значение признака | Unknown type, expected one of: &#123;options&#125; |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value or the tag is empty | Required |
| `object` | Not an object | Must be an object |
| `variant` | Unknown tag value | Unknown type, expected one of: &#123;options&#125; |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值或标识为空 | Required |
| `object` | 不是对象 | Must be an object |
| `variant` | 标识值未知 | Unknown type, expected one of: &#123;options&#125; |
:::

## @t(example)

::: ru
### Способ оплаты
:::

::: en
### Payment method
:::

::: zh
### 支付方式
:::

```ts
const Payment = variant('type', [
  object({ type: literal('card'), number: pipe(string(), length(16)) }),
  object({ type: literal('invoice'), inn: pipe(string(), length(10)) }),
]);

validate(Payment, { type: 'card' }).errors; // { number: 'Required' }
validate(Payment, { type: 'cash' }).errors; // { type: 'Unknown type, expected one of: card, invoice' }

const payment = parse(Payment, body);
if (payment.type === 'card') payment.number; // string
```

## @t(see)

::: ru
- [union](~/schemas/union) — «или» для любых схем
- [literal](~/schemas/literal) — значение признака
- [object](~/schemas/object)
:::

::: en
- [union](~/schemas/union) — "or" for any schemas
- [literal](~/schemas/literal) — the tag value
- [object](~/schemas/object)
:::

::: zh
- [union](~/schemas/union)：任意 Schema 的“或”
- [literal](~/schemas/literal)：标识的值
- [object](~/schemas/object)
:::
