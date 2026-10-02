::: ru
Разрешает значение `null`. Всё остальное передаётся во внутреннюю схему.
:::

::: en
Allows `null`. Everything else is passed to the inner schema.
:::

::: zh
允许值为 `null`。其他值交给内部 Schema 处理。
:::

## @t(signature)

```ts
function nullable<T>(schema: Schema<T>): Schema<T | null>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема для значения, если оно не `null` |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The schema for the value when it is not `null` |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 值不为 `null` 时使用的 Schema |
:::

## @t(notes)

::: ru
- `undefined` и `''` по-прежнему дают ошибку `required`. Чтобы разрешить и отсутствие поля: `optional(nullable(...))`.
- В `data` попадает именно `null` — удобно, чтобы очистить поле в базе.

## Примеры

### Очистка поля

```ts
const UpdateUser = object({
  avatar: optional(nullable(string())),
});

validate(UpdateUser, {}).data;               // {} — не трогать поле
validate(UpdateUser, { avatar: null }).data; // { avatar: null } — удалить аватар
```
:::

::: en
- `undefined` and `''` still give a `required` error. To allow a missing field too: `optional(nullable(...))`.
- `data` contains `null` — handy for clearing a column in the database.

## Example

### Clearing a field

```ts
const UpdateUser = object({
  avatar: optional(nullable(string())),
});

validate(UpdateUser, {}).data;               // {} — leave the field as is
validate(UpdateUser, { avatar: null }).data; // { avatar: null } — remove the avatar
```
:::

::: zh
- `undefined` 和 `''` 仍然会产生 `required` 错误。如果也允许字段缺失：`optional(nullable(...))`。
- `data` 中保留 `null` —— 便于清空数据库中的字段。

## 示例

### 清空字段

```ts
const UpdateUser = object({
  avatar: optional(nullable(string())),
});

validate(UpdateUser, {}).data;               // {} —— 不修改该字段
validate(UpdateUser, { avatar: null }).data; // { avatar: null } —— 删除头像
```
:::

## @t(see)

::: ru
- [optional](~/schemas/optional)
- [Пустые значения](~/guide/empty-values)
:::

::: en
- [optional](~/schemas/optional)
- [Empty values](~/guide/empty-values)
:::

::: zh
- [optional](~/schemas/optional)
- [空值](~/guide/empty-values)
:::
