::: ru
Значения TypeScript-`enum` или объекта `as const`.
:::

::: en
Values of a TypeScript `enum` or an `as const` object.
:::

::: zh
TypeScript `enum` 或 `as const` 对象的值。
:::

## @t(signature)

```ts
function enumOf<const E extends Record<string, string | number>>(e: E, msg?: Message): Schema<E[keyof E]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `e` | `enum \| object` | `enum` или объект со значениями |
| `msg` | `Message` | Своё сообщение |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `e` | `enum \| object` | An `enum` or an object with the values |
| `msg` | `Message` | Custom message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `e` | `enum \| object` | `enum` 或包含这些值的对象 |
| `msg` | `Message` | 自定义信息 |
:::

## @t(notes)

::: ru
- Проверяются **значения**, а не имена: для `enum Role { Admin = 'admin' }` подходит `'admin'`, а не `'Admin'`.
- У числовых `enum` TypeScript добавляет обратные ключи (`Level[0] === 'Low'`) — они не считаются допустимыми значениями.
- Работает как [`oneOf`](~/schemas/one-of): тот же код ошибки и параметр `{options}`.
:::

::: en
- **Values** are checked, not names: for `enum Role { Admin = 'admin' }` `'admin'` is valid, `'Admin'` is not.
- For numeric `enum`s TypeScript adds reverse keys (`Level[0] === 'Low'`) — they are not valid values.
- Works like [`oneOf`](~/schemas/one-of): the same error code and `{options}` parameter.
:::

::: zh
- 检查的是**值**而不是名称：对于 `enum Role { Admin = 'admin' }`，`'admin'` 有效，`'Admin'` 无效。
- TypeScript 会为数字 `enum` 添加反向键（`Level[0] === 'Low'`）—— 它们不是有效值。
- 与 [`oneOf`](~/schemas/one-of) 相同：相同的错误代码和 `{options}` 参数。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `oneOf` | Значения нет в enum | Must be one of: &#123;options&#125; |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `oneOf` | The value is not in the enum | Must be one of: &#123;options&#125; |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `oneOf` | 值不在 enum 中 | Must be one of: &#123;options&#125; |
:::

## @t(examples)

```ts
enum Role {
  Admin = 'admin',
  User = 'user',
}

const role = enumOf(Role); // Schema<Role>

validate(role, 'admin').valid;   // true
validate(role, 'Admin').errors;  // { '': 'Must be one of: admin, user' }
```

```ts
const Status = { Draft: 'draft', Published: 'published' } as const;

const status = enumOf(Status); // Schema<'draft' | 'published'>
```

## @t(see)

::: ru
- [oneOf](~/schemas/one-of) — список значений прямо в схеме
- [variant](~/schemas/variant) — enum как поле-признак
:::

::: en
- [oneOf](~/schemas/one-of) — a list of values right in the schema
- [variant](~/schemas/variant) — an enum as a tag field
:::

::: zh
- [oneOf](~/schemas/one-of)：直接在 Schema 中列出值
- [variant](~/schemas/variant)：把 enum 用作标识字段
:::
