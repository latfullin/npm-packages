::: ru
Новая схема объекта без перечисленных полей.
:::

::: en
A new object schema without the listed fields.
:::

::: zh
创建不包含列出字段的新对象 Schema。
:::

## @t(signature)

```ts
function omit<S, K extends keyof S>(schema: ObjectSchema<S>, keys: K[]): ObjectSchema<Omit<S, K>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `ObjectSchema` | Схема, созданная [`object`](~/schemas/object) |
| `keys` | `string[]` | Поля, которые нужно убрать |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `ObjectSchema` | A schema created with [`object`](~/schemas/object) |
| `keys` | `string[]` | Fields to remove |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `ObjectSchema` | 由 [`object`](~/schemas/object) 创建的 Schema |
| `keys` | `string[]` | 要移除的字段 |
:::

## @t(notes)

::: ru
По умолчанию лишние поля удаляются из `data` (режим `strip`), поэтому `omit` удобно использовать и для ответа API: прогнать объект из базы через схему без пароля — и пароль не уйдёт клиенту.
:::

::: en
By default unknown keys are removed from `data` (`strip` mode), so `omit` is also handy for API responses: run a database record through a schema without the password, and the password never reaches the client.
:::

::: zh
默认情况下多余字段会从 `data` 中删除（`strip` 模式），因此 `omit` 也适用于 API 响应：让数据库记录通过不含密码的 Schema，密码就不会发送给客户端。
:::

## @t(example)

::: ru
### Публичный профиль
:::

::: en
### Public profile
:::

::: zh
### 公开资料
:::

```ts
const User = object({
  id: number(),
  name: string(),
  email: string(),
  password: string(),
});

const PublicUser = omit(User, ['password', 'email']);

parse(PublicUser, userFromDb); // { id: 1, name: 'Ivan' }
```

## @t(see)

::: ru
- [pick](~/objects/pick) — наоборот: только перечисленные поля
- [partial](~/objects/partial), [extend](~/objects/extend)
:::

::: en
- [pick](~/objects/pick) — the opposite: only the listed fields
- [partial](~/objects/partial), [extend](~/objects/extend)
:::

::: zh
- [pick](~/objects/pick)：相反，只保留列出的字段
- [partial](~/objects/partial)、[extend](~/objects/extend)
:::
