::: ru
Новая схема объекта, в которой все поля (или перечисленные) необязательные. Типичный случай — `PATCH`: при обновлении можно передать только изменившиеся поля.
:::

::: en
A new object schema where all fields (or the listed ones) are optional. The typical case is `PATCH`: an update can send only the changed fields.
:::

::: zh
创建一个新的对象 Schema，其中所有字段（或列出的字段）都变为选填。典型场景是 `PATCH`：更新时只需传入变化的字段。
:::

## @t(signature)

```ts
function partial<S, K extends keyof S = keyof S>(schema: ObjectSchema<S>, keys?: K[]): ObjectSchema<...>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `ObjectSchema` | Схема, созданная [`object`](~/schemas/object) |
| `keys` | `string[]` | Какие поля сделать необязательными. По умолчанию — все |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `ObjectSchema` | A schema created with [`object`](~/schemas/object) |
| `keys` | `string[]` | Which fields to make optional. Default: all |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `ObjectSchema` | 由 [`object`](~/schemas/object) 创建的 Schema |
| `keys` | `string[]` | 要变为选填的字段。默认为全部 |
:::

## @t(notes)

::: ru
- Исходная схема не меняется — возвращается новая.
- Если поле передано, его правила проверяются как обычно.
- Значения по умолчанию из [`optional`](~/schemas/optional) не применяются: при `PATCH` отсутствующее поле не нужно перезаписывать значением по умолчанию.
- Опции объекта (`unknown`) сохраняются.
:::

::: en
- The original schema is not changed — a new one is returned.
- If a field is present, its rules are checked as usual.
- Defaults from [`optional`](~/schemas/optional) are not applied: with `PATCH` a missing field shouldn't be overwritten with a default.
- Object options (`unknown`) are preserved.
:::

::: zh
- 原 Schema 不会被修改 —— 返回一个新的 Schema。
- 如果传入了字段，仍按原规则校验。
- 不会应用 [`optional`](~/schemas/optional) 的默认值：在 `PATCH` 中，缺失的字段不应被默认值覆盖。
- 保留对象选项（`unknown`）。
:::

## @t(examples)

::: ru
### Создание и обновление
:::

::: en
### Create and update
:::

::: zh
### 创建与更新
:::

```ts
const CreateUser = object({
  name: pipe(string(), minLength(2)),
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8)),
});

const UpdateUser = partial(CreateUser);

validate(UpdateUser, { name: 'Ivan' }).data; // { name: 'Ivan' }
validate(UpdateUser, { name: 'I' }).errors;  // { name: 'Must be at least 2 long' }
```

::: ru
### Только некоторые поля
:::

::: en
### Only some fields
:::

::: zh
### 仅部分字段
:::

```ts
const EditProfile = partial(CreateUser, ['password']);
```

## @t(see)

::: ru
- [pick](~/objects/pick), [omit](~/objects/omit), [extend](~/objects/extend)
- [optional](~/schemas/optional)
:::

::: en
- [pick](~/objects/pick), [omit](~/objects/omit), [extend](~/objects/extend)
- [optional](~/schemas/optional)
:::

::: zh
- [pick](~/objects/pick)、[omit](~/objects/omit)、[extend](~/objects/extend)
- [optional](~/schemas/optional)
:::
