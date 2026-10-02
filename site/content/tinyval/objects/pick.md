::: ru
Новая схема объекта только с перечисленными полями.
:::

::: en
A new object schema with only the listed fields.
:::

::: zh
创建只包含列出字段的新对象 Schema。
:::

## @t(signature)

```ts
function pick<S, K extends keyof S>(schema: ObjectSchema<S>, keys: K[]): ObjectSchema<Pick<S, K>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `ObjectSchema` | Схема, созданная [`object`](~/schemas/object) |
| `keys` | `string[]` | Поля, которые нужно оставить. TypeScript проверяет, что они есть в схеме |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `ObjectSchema` | A schema created with [`object`](~/schemas/object) |
| `keys` | `string[]` | Fields to keep. TypeScript checks that they exist in the schema |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `ObjectSchema` | 由 [`object`](~/schemas/object) 创建的 Schema |
| `keys` | `string[]` | 要保留的字段。TypeScript 会检查它们是否存在于 Schema 中 |
:::

## @t(example)

::: ru
### Вход по email и паролю
:::

::: en
### Login with email and password
:::

::: zh
### 使用邮箱和密码登录
:::

```ts
const User = object({
  name: string(),
  email: pipe(string(), email()),
  password: pipe(string(), minLength(8)),
});

const Login = pick(User, ['email', 'password']);

validate(Login, { email: 'a@a.ru', password: '12345678', name: 'x' }).data;
// { email: 'a@a.ru', password: '12345678' }
```

## @t(see)

::: ru
- [omit](~/objects/omit) — наоборот: все поля, кроме перечисленных
- [partial](~/objects/partial), [extend](~/objects/extend)
:::

::: en
- [omit](~/objects/omit) — the opposite: all fields except the listed ones
- [partial](~/objects/partial), [extend](~/objects/extend)
:::

::: zh
- [omit](~/objects/omit)：相反，保留除列出字段外的所有字段
- [partial](~/objects/partial)、[extend](~/objects/extend)
:::
