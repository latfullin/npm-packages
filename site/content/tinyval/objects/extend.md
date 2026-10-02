::: ru
Новая схема объекта с дополнительными полями. Поле с тем же именем заменяется новой схемой.
:::

::: en
A new object schema with additional fields. A field with the same name is replaced with the new schema.
:::

::: zh
创建带有额外字段的新对象 Schema。同名字段会被新的 Schema 替换。
:::

## @t(signature)

```ts
function extend<S, E>(schema: ObjectSchema<S>, fields: E): ObjectSchema<Omit<S, keyof E> & E>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `ObjectSchema` | Схема, созданная [`object`](~/schemas/object) |
| `fields` | `Record<string, Schema>` | Новые поля или замена существующих |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `ObjectSchema` | A schema created with [`object`](~/schemas/object) |
| `fields` | `Record<string, Schema>` | New fields or replacements for existing ones |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `ObjectSchema` | 由 [`object`](~/schemas/object) 创建的 Schema |
| `fields` | `Record<string, Schema>` | 新字段或对已有字段的替换 |
:::

## @t(examples)

::: ru
### Новые поля
:::

::: en
### New fields
:::

::: zh
### 新字段
:::

```ts
const User = object({ name: string(), email: pipe(string(), email()) });

const Admin = extend(User, {
  role: oneOf(['admin', 'moderator']),
});
// { name: string; email: string; role: 'admin' | 'moderator' }
```

::: ru
### Другие правила для поля
:::

::: en
### Different rules for a field
:::

::: zh
### 字段使用不同的规则
:::

```ts
const StrongSignup = extend(Signup, {
  password: pipe(string(), minLength(12)),
});
```

## @t(see)

::: ru
- [partial](~/objects/partial), [pick](~/objects/pick), [omit](~/objects/omit)
- [object](~/schemas/object)
:::

::: en
- [partial](~/objects/partial), [pick](~/objects/pick), [omit](~/objects/omit)
- [object](~/schemas/object)
:::

::: zh
- [partial](~/objects/partial)、[pick](~/objects/pick)、[omit](~/objects/omit)
- [object](~/schemas/object)
:::
